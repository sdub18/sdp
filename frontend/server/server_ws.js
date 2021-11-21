const net = require("net");

// required PORTS
const CLIENT_TO_MIDDLE_PORT = process.env.PORT || 49160;
const MIDDLE_TO_FRONT_PORT = process.env.PORT || 3001;

// create server to listen for add-ons
// manage multiple addons in list
const C2M_server = net.createServer();
C2M_server.on('connection', connectionHandler);
C2M_server.listen({host: "0.0.0.0", port:CLIENT_TO_MIDDLE_PORT}, ()=>console.log('opened C2M_server on ', C2M_server.address()));
var addons = [];

// create server using websocket to communicate to frontend
// upon connection, emit data every 2 ms
const M2F_server = require('http').createServer({MIDDLE_TO_FRONT_PORT});
const M2F_socket = require('socket.io')(M2F_server,{
  cors:{
    origin: true,
    credentials: true
  }
});

M2F_socket.on("connection", (client)=>{
  setInterval(()=>{
    for (const pkt of data){
      client.emit('data', pkt);
    }
  }, 2)
})

M2F_server.listen(MIDDLE_TO_FRONT_PORT, () => {
  console.log(`C2M_server listening on ${MIDDLE_TO_FRONT_PORT}`);
});


var data = [];  // hold separated data packets (one pkt for each addon) in list
function connectionHandler(conn){
  addons.push({id:addons.length+1,port:conn.remotePort});
  var remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
  console.log('new client connection from %s', remoteAddress);

  console.log(addons);

  conn.on('data', onConnData);
  conn.on('close', onConnClose);
  conn.on('error', onConnError);

  function onConnData(d){
    data = parseData(d);
    console.log(data);
  }


  function onConnClose(){
    console.log('connection from %s closed', conn.remotePort);
    addon_idx = addons.indexOf(obj => obj.port === conn.remotePort);
    addons.splice(addon_idx, 1);
    console.log(addons);
  }

  function onConnError(err){
    console.log('Connection %s error: %s', remoteAddress, err.message);
  }
}

/**
 * Converts byte streamed data received into a list of data packet objects
 * Handles when data packets are concatenated due to TCP stream
 * @param {Buffer} recv_data 
 * @returns List of data packet objects 
 */
function parseData(recv_data){
  var pkts = [];
  var tmp_pkt = '';
  var start = false;
  
  for (let pair of recv_data.entries()){
    let char = String.fromCharCode(pair[1]); 
  
    if (pair[1] == 0){
      pkts.push(JSON.parse(tmp_pkt));
      tmp_pkt = '';
      start = false;
    }

    if (start == true){
      tmp_pkt += char;
    }
    
    if (pair[1] == 1){
      start = true;
    }
  }
  return pkts;
}


//TODO: handle when C2M_server randomly goes out