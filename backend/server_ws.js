const net = require("net");
const appConfig = require("./config");
const crud = require("./services/crud");
const FFT = require('fft.js');

const CLIENT_TO_MIDDLE_PORT = 49160;
const MIDDLE_TO_FRONT_PORT = 3001;

const C2M_server = net.createServer();
const M2F_server = require('http').createServer();
const M2F_socket = require('socket.io')(M2F_server,{cors:{origin: true, credentials: true}});

const crud = require("./services/crud");
const parseData = require('./utils/parseData');
const createEmptyGraph = require('./utils/createEmptyGraph');
const computeHealthStatuses = require('./utils/computeHealthStatuses');

const fft = new FFT(512);
const out = fft.createComplexArray();

let addons = [];      // backend local array to manage addon ids
let config = {"xMax" : 300,         
  "xIncrement" : 100,
  "width" : 700,
  "height" : 400};

const chart_types = ["current", "power", "temp"];
const thresholds = {"current": 100, "power": 60, "temp": 80};

let active_pid = null;
let coordinates = {};

M2F_socket.on("connection", M2F_connectionHandler);
M2F_server.listen(appConfig.M2F_PORT, () => {console.log(`M2F_server listening on ${MIDDLE_TO_FRONT_PORT}`)});

C2M_server.on('connection', C2M_connectionHandler);
<<<<<<< HEAD
C2M_server.listen(appConfig.C2M_PORT, () => console.log(`C2M_server listening on ${CLIENT_TO_MIDDLE_PORT}`));
=======
C2M_server.listen({host: "0.0.0.0", port:CLIENT_TO_MIDDLE_PORT}, C2M_server_handler);

function C2M_server_handler() {
  console.log(`C2M_server listening on ${CLIENT_TO_MIDDLE_PORT}`);

  setInterval(() => {
    prevTime = Date.now()-5000;
    curTime = Date.now();
    input = crud.getAccelData('z', prevTime, curTime).map((row) => (row['z']) );

    console.log(input.length);
    if (input.length == fft.size) {
      fft.realTransform(out, input);

    }  

  }, 500);

}
>>>>>>> 3f7d208 (implement fft to view frequency domain)

function M2F_connectionHandler(client){
  
  client.on("addon_selection", (pid) => {
    active_pid = pid.toString();
  })

  client.on("period_selection", (periodAndFrequency) => {
    // Receives label for x axis period as well as the polling frequency associated with it.
    // This will allow us to query the database for the appropriate info, as well as change
    // the frequency at which we poll the incoming data, so we can modify our coordinates array
    // and send it back to the frontend.
    console.log("To be used once we have connected the database:", periodAndFrequency);
  })

  setInterval(() => {
    M2F_socket.emit("graph_update", coordinates[active_pid]);
    M2F_socket.emit("updateAddons", addons.map(a => a.id));
    M2F_socket.emit("health_status", computeHealthStatuses(coordinates, thresholds));  
  }, 50);

}

// The function should also add something like { id: <some number>, data: <some number> } to the addons array
function C2M_connectionHandler(conn){
  const remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
  console.log('new client connection from %s', remoteAddress);
  conn.setTimeout(5000, function(){
    conn.destroy();
  });

  setInterval(() => {
    prevTime = Date.now()-2500;
    curTime = Date.now();
    input = crud.getAccelData('z', prevTime, curTime).map((row) => (row['z']) );

    console.log(input.length);
    if (input.length == fft.size) fft.realTransform(out, input);

  }, 1000);

  conn.on('error', (err) => {console.log('Connection %s error: %s', remoteAddress, err.message)});

  conn.on('data', (recv_d) => {
    let data = parseData(recv_d)    // parse buffer stream into individual packets of data and place into data array
    for (let pkt of data) { 
      if (!addons.some(addon => addon.id === pkt.id)) {
        pkt["remotePort"] = conn.remotePort;
        addons.push(pkt);
        console.log(addons);

        coordinates[pkt.id] = createEmptyGraph(chart_types, config, thresholds); // init coords matrix for addon
        conn.write(Buffer.from([0x01]));  // send ACK byte
      } 
      if (("data" in pkt) && (pkt.id in coordinates)) {
        crud.insertData(pkt);
        for (let i = 0; i < chart_types.length; i++) {
          for (let j = 0; j < config.xMax - 1; j++) {
            coordinates[pkt.id][chart_types[i]][j].y = coordinates[pkt.id][chart_types[i]][j+1].y;
          }
          coordinates[pkt.id][chart_types[i]][config.xMax - 1].y = pkt.data[chart_types[i]];
        }
      }
    }
  });

  conn.on('close', () => {
    // remove connection from addon array
    addon_index = addons.findIndex(addon => addon.remotePort == conn.remotePort);
    addon_id = addons[addon_index].id;
    addons.splice(addon_index, 1);

    console.log(addons.map(a => a.id));
    console.log('connection from %s closed', conn.remotePort);
    // remove coordinate matrix for addon
    delete coordinates[addon_id];
  });
}
