const net = require("net");
const performance = require('perf_hooks').performance;

const CLIENT_TO_MIDDLE_PORT = process.env.PORT || 49160;
const MIDDLE_TO_FRONT_PORT = process.env.PORT || 3001;

// server to listen for add-ons
// manage multiple addons in list
// 0.0.0.0 means all IPv4 addresses on the local machine
const C2M_server = net.createServer();
C2M_server.on('connection', connectionHandler);
C2M_server.listen({host: "0.0.0.0", port:CLIENT_TO_MIDDLE_PORT}, () => console.log('opened C2M_server on ', C2M_server.address()));
let addons = [];
let chartType = "";
let selectedAddonID = 0;
let update = false;

// create server that implements a websocket to communicate to frontend
// upon connection, emit data every 2 ms
const M2F_server = require('http').createServer({MIDDLE_TO_FRONT_PORT});
const M2F_socket = require('socket.io')(M2F_server,{cors:{origin: true, credentials: true}});

// emits individual data points for chart depending on user's selected chartType
M2F_socket.on("connection", (client)=>{
  client.on("chart_type_selection", (arg) => {chartType = arg});
  client.on("addon_selection", (arg) => {selectedAddonID = arg});
  setInterval(()=>{
    if (update){
      client.emit("updateAddons", addons.map(a => a.id));
      update = false;
    }
    for (const pkt of data){
      if (pkt.id === selectedAddonID && typeof(pkt.data)!== "number") client.emit('data', pkt.data[chartType]);
    }
  }, 1)
})

M2F_server.listen(MIDDLE_TO_FRONT_PORT, () => {console.log(`C2M_server listening on ${MIDDLE_TO_FRONT_PORT}`)});


const data = [];  // hold separated data packets (one pkt for each addon) in list
function connectionHandler(conn){
  const remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
  console.log('new client connection from %s', remoteAddress);

  conn.on('error', (err) => {console.log('Connection %s error: %s', remoteAddress, err.message)});
  conn.on('data', (recv_d) => {
    parseData(recv_d, data)
    for (let pkt of data){
      if (!addons.some(addon => addon.id === pkt.id)) {
        addons.push(pkt);
        conn.write("nice");
        console.log(addons);
        update = true;
      }
    }
  });
  conn.on('close', () => {
    console.log('connection from %s closed', conn.remotePort);
    addon_idx = addons.findIndex(addon => addon.data == conn.remotePort);
    addons.splice(addon_idx, 1);
    console.log(addons);
    update = true;
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
    //iterate through each character of buffer
    // use valid parentheses to check when packet ends length of stack should be 0
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
  
  if (pkts_array.length > 1) console.log(pkts_array);
  return status;

}