const net = require("net");

const CLIENT_TO_MIDDLE_PORT = process.env.PORT || 49160;
const MIDDLE_TO_FRONT_PORT = process.env.PORT || 3001;

// server to listen for add-ons
// manage multiple addons in list
// 0.0.0.0 means all IPv4 addresses on the local machine
const C2M_server = net.createServer();
C2M_server.on('connection', connectionHandler);
C2M_server.listen({host: "0.0.0.0", port:CLIENT_TO_MIDDLE_PORT}, () => console.log('opened C2M_server on ', C2M_server.address()));
const addons = [];
let chartType = "";

// create server that implements a websocket to communicate to frontend
// upon connection, emit data every 2 ms
const M2F_server = require('http').createServer({MIDDLE_TO_FRONT_PORT});
const M2F_socket = require('socket.io')(M2F_server,{cors:{origin: true, credentials: true}});

// emits individual data points for chart depending on user's selected chartType
M2F_socket.on("connection", (client)=>{
  client.on("chart_type_selection", (arg) => {chartType = arg});
  setInterval(()=>{
    for (const pkt of data){
      client.emit('data', pkt.data[chartType])
    }
  }, 9)
})

M2F_server.listen(MIDDLE_TO_FRONT_PORT, () => {console.log(`C2M_server listening on ${MIDDLE_TO_FRONT_PORT}`)});


const data = [];  // hold separated data packets (one pkt for each addon) in list
function connectionHandler(conn){
  const remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
  console.log('new client connection from %s', remoteAddress);
  console.log(addons);

  conn.on('error', (err) => {console.log('Connection %s error: %s', remoteAddress, err.message)});
  conn.on('data', (recv_d) => {
    parseData(recv_d, data)
    for (const pkt of data){
      if (!addons.some(addon => addon.id === pkt.id)) {
        console.log(pkt);
        console.log(addons.indexOf(pkt));
        addons.push(pkt);
        console.log(addons);
      }
    }
  });
  conn.on('close', () => {
    console.log('connection from %s closed', conn.remotePort);
    addon_idx = addons.indexOf(x => x === c );
    addons.splice(addon_idx, 1);
    console.log(addons);
  });
}

/**
 * Converts byte streamed data received into a list of data packet objects
 * Handles when data packets are concatenated due to TCP stream
 * @param {Buffer} recv_data 
 * @returns List of data packet JSON objects 
 */
function parseData(recv_data, pkts_array){
  pkts_array.length = 0;
  let pkt = '';
  let start = false;
  
  for (let pair of recv_data.entries()){
    let char = String.fromCharCode(pair[1]); 
    
    if (pair[1] == 0){
      parsed_pkt = JSON.parse(pkt);
      pkts_array.push(parsed_pkt);
      pkt = '';
      start = false;
    }

    if (start == true) pkt += char;
    if (pair[1] == 1) start = true;
  }
  return pkts_array;
}
