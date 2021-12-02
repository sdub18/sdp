const net = require("net");

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


M2F_socket.on("connection", M2F_connectionHandler);
M2F_server.listen(MIDDLE_TO_FRONT_PORT, () => {console.log(`C2M_server listening on ${MIDDLE_TO_FRONT_PORT}`)});

C2M_server.on('connection', C2M_connectionHandler);
C2M_server.listen({host: "0.0.0.0", port:CLIENT_TO_MIDDLE_PORT}, () => console.log('opened C2M_server on ', C2M_server.address()));

function M2F_connectionHandler(client){
  client.on("chart_type_selection", (arg) => {chartType = arg});
  client.on("addon_selection", (arg) => {selectedID = arg});
  
  // separate the interval processes to emit the data and to select the data
  setInterval(() => client.emit('data', val2emit), EMIT_PERIOD);     
  setInterval(() => {
    client.emit("updateAddons", addons.map(a => a.id));  
    for (const pkt of data){
      if (pkt.id === selectedID && typeof(pkt.data)!== "number")
        val2emit = pkt.data[chartType];
    }
  }, 1);
}

function C2M_connectionHandler(conn){
  const remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
  console.log('new client connection from %s', remoteAddress);

  conn.on('error', (err) => {console.log('Connection %s error: %s', remoteAddress, err.message)});
  conn.on('data', (recv_d) => {
    parseData(recv_d, data)     // parse buffer stream into individual packets of data and place into data array
    for (let pkt of data) { 
      // update local addon array if new addon detected and write back to addon to start sending sensor data
      if (!addons.some(addon => addon.id === pkt.id)) {
        addons.push(pkt);
        conn.write("nice");
        console.log(addons);
      }
    }
  });
  conn.on('close', () => {
    // remove connection from addon array
    console.log('connection from %s closed', conn.remotePort);
    addon_idx = addons.findIndex(addon => addon.data == conn.remotePort);
    addons.splice(addon_idx, 1);
    console.log(addons);
  });
}

function parseData(recv_data, pkts_array){
  pkts_array.length = 0;
  const parens = {"{": "}", "(": ")", "[": "]"};
  const stack = []
  let pkt = "";
  let status = 0;

  try {
    pkt = JSON.parse(recv_data);
    pkts_array.push(pkt);
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