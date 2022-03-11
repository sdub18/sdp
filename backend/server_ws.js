const net = require("net");

const CLIENT_TO_MIDDLE_PORT = process.env.PORT || 49160;
const MIDDLE_TO_FRONT_PORT = process.env.PORT || 3001;

const C2M_server = net.createServer();
const M2F_server = require('http').createServer({MIDDLE_TO_FRONT_PORT});
const M2F_socket = require('socket.io')(M2F_server,{cors:{origin: true, credentials: true}});

let addons = [];      // backend local array to manage addon ids
const data = [];      // hold separated data packets (one pkt for each addon) in list

// -----------------------------------------------------------------------------------------------------------------------
let config = {"xMax" : 300,         
  "xIncrement" : 100,
  "width" : 700,
  "height" : 400};

const graph_labels = ["current", "power", "temp"];
const thresholds = {"current": 100, "power": 60, "temp": 80};

let yConfig = {};
graph_labels.map((type) => {yConfig[type] = {yMin: 10000, yMax:-10000}});

let active_pid = null;
let coordinates = {};
let oldConfig = {};

M2F_socket.on("connection", M2F_connectionHandler);
M2F_server.listen(MIDDLE_TO_FRONT_PORT, () => {console.log(`C2M_server listening on ${MIDDLE_TO_FRONT_PORT}`)});

C2M_server.on('connection', C2M_connectionHandler);
C2M_server.listen({host: "0.0.0.0", port:CLIENT_TO_MIDDLE_PORT}, () => console.log('opened C2M_server on ', C2M_server.address()));

/*
This is the first thing that runs in the entire project infrastructure. It begins by asking the frontend for the parameters that are
being used in the graphs, so the backend can store/modify data correctly and send it to the frontend. Once the response has been
received, the JSON coordinated object is populated based on the info contained within the response.
*/
function createEmptyGraph() {
  labels_coords_dict = {};
    for (let i = 0; i < graph_labels.length; i++) {
      labels_coords_dict[graph_labels[i]] = [];
      for (let j = 0; j < config.xMax; j++) {
        labels_coords_dict[graph_labels[i]].push({x: j, y: 0});
      }
    }
    return labels_coords_dict;
}

function M2F_connectionHandler(client){
  
  client.on("addon_selection", (pid) => {
    active_pid = pid.toString();
  })
  setInterval(() => {
    M2F_socket.emit("graph_update", coordinates[active_pid]);
    M2F_socket.emit("updateAddons", addons.map(a => a.id));

    //if (oldConfig != yConfig) 
    M2F_socket.emit("y_axes_config", yConfig);
    M2F_socket.emit("health_status", computeHealthStatuses(coordinates, thresholds));
    
  }, 50);
  /*setInterval(() => {
    M2F_socket.emit("updateAddons", addons.map(a => a.id));
  }, 50);*/
}

/*
// When the initial connection is made with the client, 'new client connection from %s' should be printed
// The function should parse the data, where parseData(recv_d, data) places the data in a JSON that looks something like

[
  {
    id: 50043,
    data: {
      current: 96,
      power: 63,
      temperature: 82,
      accelereation: { x: 0, y: 0, z: 9.8 },
      rpm: 36
    }
  }
]
*/
// The function should also add something like { id: <some number>, data: <some number> } to the addons array
function C2M_connectionHandler(conn){
  const remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
  console.log('new client connection from %s', remoteAddress);
  conn.setTimeout(5000, function(){
    conn.destroy();
  });

  conn.on('error', (err) => {console.log('Connection %s error: %s', remoteAddress, err.message)});

  conn.on('data', (recv_d) => {
    parseData(recv_d, data)    // parse buffer stream into individual packets of data and place into data array
    for (let pkt of data) { 
      if (!addons.some(addon => addon.id === pkt.id)) {
        pkt["remotePort"] = conn.remotePort;
        addons.push(pkt);
        console.log(addons);

        coordinates[pkt.id] = createEmptyGraph(); // init coords matrix for addon
        conn.write(Buffer.from([0x01]));  // send ACK byte
      } 
      if (("data" in pkt) && (pkt.id in coordinates)) {
        for (let i = 0; i < graph_labels.length; i++) {
          for (let j = 0; j < config.xMax - 1; j++) {
            coordinates[pkt.id][graph_labels[i]][j].y = coordinates[pkt.id][graph_labels[i]][j+1].y;
          }
          coordinates[pkt.id][graph_labels[i]][config.xMax - 1].y = pkt.data[graph_labels[i]];
          
          if (active_pid == pkt.id) {
            if (yConfig[graph_labels[i]].yMax < -999) yConfig[graph_labels[i]].yMax = pkt.data[graph_labels[i]];
            if (yConfig[graph_labels[i]].yMin > 999) yConfig[graph_labels[i]].yMin = pkt.data[graph_labels[i]];
            //oldConfig = yConfig;
            curMax = Math.max.apply(Math, coordinates[pkt.id][graph_labels[i]].map((point) => { return point.y; }));
            curMin = Math.min.apply(Math, coordinates[pkt.id][graph_labels[i]].map((point) => { return point.y; }))
            newVal = pkt.data[graph_labels[i]];
            if (newVal > curMax) yConfig[graph_labels[i]].yMax = newVal * 1.2;
            if (newVal < curMin) yConfig[graph_labels[i]].yMin = newVal * 0.8;

            if ((yConfig[graph_labels[i]].yMax - yConfig[graph_labels[i]].yMin) < 1) {
              yConfig[graph_labels[i]].yMin = Math.floor(yConfig[graph_labels[i]].yMin);
              yConfig[graph_labels[i]].yMax = Math.ceil(yConfig[graph_labels[i]].yMax);
            }
          }
        }
      }
    }
  });

  conn.on('close', () => {
    // remove connection from addon array
    console.log('connection from %s closed', conn.remotePort);
    addon_index = addons.findIndex(addon => addon.remotePort == conn.remotePort);
    addon_id = addons[addon_index].id;
    addons.splice(addon_index, 1);
    console.log(addons.map(a => a.id));
    // remove coordinate matrix for addon
    delete coordinates[addon_id];
  });
}

// See the description for C2M_connectionHandler()
function parseData(recv_data, pkts_array){
  pkts_array.length = 0;
  const parens = {"{": "}", "(": ")", "[": "]"};
  const stack = []
  let pkt = "";
  let status = 0;

  try {
    pkt = JSON.parse(recv_data.toString('utf-8'));
    pkts_array.push(pkt);
    //console.log(pkt);
  }
  catch (err) {
    // handles stream buffer concatenation
    // iterate through each character of buffer
    // use valid parentheses to check when packet ends --> length of stack should be 0
    // return nothing and place nothing in pkts_array if data is invalid
    for (let char in recv_data){
      pkt += char;
      if (parens.hasOwnProperty(char)){
        stack.push(char)  
      }
      else if (Object.values(parens).some(p => p === char)){
        if (parens[stack.pop()] === char && stack.length === 0){
          let parsed_pkt = JSON.parse(pkt);
          pkts_array.push(parsed_pkt);
          pkt = "";
        }
        else {
          pkts_array.length = 0;
          console.log("Failed to parse data");
          status = -1;
          break;
        }
      }
      else continue;
    }
  }
  return status;
}

/*
coordinates: coordinates array being stored in program.
thresholds: Takes the format {current: <some number>, voltage: <some number>, power: <some number>}
*/
function computeHealthStatuses(coordinates, thresholds) {
  let output = {};
  const processes = Object.keys(coordinates);
  const attributes = Object.keys(thresholds);
  for (let i = 0; i < processes.length; i++) {
    const current_process = coordinates[processes[i]];
    let overall_dangerous = false;
    for (let j = 0; j < attributes.length; j++) {
        let current_dangerous = false;
      if (computeAverage(current_process[attributes[j]].map(point => point.y)) > thresholds[attributes[j]]) {
          current_dangerous = true;
          if (!overall_dangerous) {
            output[processes[i]] = "DANGEROUS (" + attributes[j] + ', ';
            overall_dangerous = true;
          } else {
              if (current_dangerous) {
                output[processes[i]] += attributes[j] + ', ';
              }
          }
      }
    }
    if (overall_dangerous) {
      output[processes[i]] = output[processes[i]].substring(0, output[processes[i]].length - 2);
      output[processes[i]] = output[processes[i]] + ')';
    } else {
      output[processes[i]] = "HEALTHY";
    }
  }
  return output;
}

function computeAverage(array) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
      sum += array[i];
  }
  return sum / array.length;
}