const net = require("net");

const server = net.createServer();
server.maxConnections = 2;
server.on('connection', connectionHandler);
server.listen(9000, ()=>console.log('opened server on ', server.address()));

const CLIENTS_MAX = 2;
var clients = [];

function connectionHandler(conn){
  clients.push({id:clients.length+1,port:conn.remotePort});
  var remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
  console.log('new client connection from %s', remoteAddress);

  console.log(clients);

  conn.on('data', onConnData);
  conn.on('close', onConnClose);
  conn.on('error', onConnError);

  function onConnData(d){
    // change this function to fit structure of frontend
    // and how it fetches data from backend
    console.log('connection data from: %s: %j', conn.remotePort, d);
    conn.write(d);
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

//TODO: handle when server randomly goes out