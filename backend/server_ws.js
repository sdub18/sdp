const net = require("net");
const { config } = require("process");

const CLIENT_TO_MIDDLE_PORT = process.env.PORT || 49160;
const MIDDLE_TO_FRONT_PORT = process.env.PORT || 3001;
const EMIT_PERIOD = 1;

const C2M_server = net.createServer();
const M2F_server = require('http').createServer({MIDDLE_TO_FRONT_PORT});
const M2F_socket = require('socket.io')(M2F_server,{cors:{origin: true, credentials: true}});

let addons = [];      // backend local array to manage addon ids
let chartType = "";   // select data type to send to frontend
let selectedID = 0;   // select addon id to choose which data packet to access
let val2emit = 0;     // backend local variable to update to send to frontend
const data = [];      // hold separated data packets (one pkt for each addon) in list

// -----------------------------------------------------------------------------------------------------------------------

const unit_dict = {"current": "A", "power": "W", "temperature": "F", "rpm": "RPM"};
const graph_labels = Object.keys(unit_dict);
let graph_settings = null;
let active_pid = null;
let coordinates = {};


M2F_socket.on("connection", M2F_connectionHandler);
M2F_server.listen(MIDDLE_TO_FRONT_PORT, () => {console.log(`C2M_server listening on ${MIDDLE_TO_FRONT_PORT}`)});

C2M_server.on('connection', C2M_connectionHandler);
C2M_server.listen({host: "0.0.0.0", port:CLIENT_TO_MIDDLE_PORT}, () => console.log('opened C2M_server on ', C2M_server.address()));

/*
This is the first thing that runs in the entire project infrastructure. It begins by asking the frontend for the parameters that are
being used in the graphs, so the backend can store/modify data correctly and send it to the frontend. Once the response has been
received, the JSON coordinated object is populated based on the info contained within the response.
*/
function createEmptyGraph(graph_settings) {
  labels_coords_dict = {};
    for (let i = 0; i < graph_labels.length; i++) {
      labels_coords_dict[graph_labels[i]] = [];
      for (let j = 0; j < graph_settings.xMax; j++) {
        labels_coords_dict[graph_labels[i]].push({x: j, y: 0, threshold: 50});
      }
    }
    return labels_coords_dict;
}

function M2F_connectionHandler(client){
  client.emit("config");

  client.on("config_response", (info) => {
    console.log("connected to frontend");
    graph_settings = info;
  })
  
  client.on("addon_selection", (pid) => {
    console.log(pid);
    active_pid = pid;
  })
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
    parseData(recv_d, data)     // parse buffer stream into individual packets of data and place into data array
    for (let pkt of data) { 
      // update local addon array if new addon detected and write back to addon to start sending sensor data
      if (!addons.some(addon => addon.id === pkt.id)) {
        addons.push(pkt);
        coordinates[pkt.id] = createEmptyGraph(graph_settings);
        conn.write("nice");
        M2F_socket.emit("updateAddons", addons.map(a => a.id));
        console.log(addons.map(a => a.id));
      }
      for (let i = 0; i < graph_labels.length; i++) {
        for (let j = 0; j < graph_settings.xMax - 1; j++) {
          coordinates[pkt.id][graph_labels[i]][j].y = coordinates[pkt.id][graph_labels[i]][j+1].y;
        }
        coordinates[pkt.id][graph_labels[i]][graph_settings.xMax - 1].y = pkt.data[graph_labels[i]];
      }
      if (pkt.id === active_pid) {
        current_coords = coordinates[active_pid];
        sending_coords_array = [];
        for (let i = 0; i < graph_labels.length; i++) {
          sending_coords_array.push(current_coords[graph_labels[i]]);
        }
        M2F_socket.emit("graph_update", sending_coords_array);
      }
    }
  });

  conn.on('close', () => {
    // remove connection from addon array
    console.log('connection from %s closed', conn.remotePort);
    addon_index = addons.findIndex(addon => addon.data == conn.remotePort);
    addon_id = addons[addon_index].id;
    addons.splice(addon_index, 1);
    delete coordinates[addon_id];
    M2F_socket.emit("updateAddons", addons.map(a => a.id));
    console.log(addons.map(a => a.id));
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
    pkt = JSON.parse(recv_data);
    pkts_array.push(pkt);
    console.log(pkt);
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
