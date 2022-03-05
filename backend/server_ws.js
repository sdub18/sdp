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

// First line is the reception of what PID's graphs should be displayed. This value is stored in selectedID
// Function then ensures that the val2emit is not null, which should be the case after at least one process has connected
// to the server, and the user has selected a process to be viewed. After doing this, the server sends the full JSON
// associated with that process to the frontend.
// Function also updates the array of active PIDs and communicates that to the frontend.
function M2F_connectionHandler(client){
  client.on("addon_selection", (arg) => {selectedID = arg});
  
  // separate the interval processes to emit the data and to select the data
  setInterval(() => {
    if (val2emit.length > 0 && val2emit !== 0) {
      if (val2emit[0].id === selectedID) {
        client.emit('data', val2emit);
      }
    }
  }, EMIT_PERIOD);     
  setInterval(() => {
    client.emit("updateAddons", addons.map(a => a.id));  
    val2emit = data;
  }, 1);
}

// When the initial connection is made with the client, 'new client connection from %s' should be printed
// The function should parse the data, where parseData(recv_d, data) places the data in a JSON that looks something like
/*
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
        conn.write(Buffer.from([0x01]));
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