const net = require("net");

const CLIENT_TO_MIDDLE_PORT = process.env.PORT || 49160;
const MIDDLE_TO_FRONT_PORT = process.env.PORT || 3001;
var current = 4;
var x = "Pointless string";


const C2M_server = net.createServer();
C2M_server.on('connection', connectionHandler);
var options = {host: "0.0.0.0", port:CLIENT_TO_MIDDLE_PORT};
C2M_server.listen(options, ()=>console.log('opened C2M_server on ', C2M_server.address()));
var clients = [];

const server = require('http').createServer({MIDDLE_TO_FRONT_PORT});
const io = require('socket.io')(server,{
  cors:{
    origin: true,
    credentials: true
  }
});

io.on("connection", (client)=>{
  setInterval(()=>{
    client.emit('data', current);
  }, 2)
})

server.listen(MIDDLE_TO_FRONT_PORT, () => {
  console.log(`C2M_server listening on ${MIDDLE_TO_FRONT_PORT}`);
});

function connectionHandler(conn){
  clients.push({id:clients.length+1,port:conn.remotePort});
  var remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
  console.log('new client connection from %s', remoteAddress);

  console.log(clients);

  conn.on('data', onConnData);
  conn.on('close', onConnClose);
  conn.on('error', onConnError);

  function onConnData(d){
    current = d.toString();
    console.log(d.toString());
  }

  function onConnClose(){
    console.log('connection from %s closed', conn.remotePort);
    client_idx = clients.indexOf(obj => obj.port === conn.remotePort);
    clients.splice(client_idx, 1);
    console.log(clients);
  }

  function onConnError(err){
    console.log('Connection %s error: %s', remoteAddress, err.message);
  }
}

//TODO: handle when C2M_server randomly goes out