const net = require("net");

const server = net.createServer()
var clients = [];

server.on('connection', connectionHandler);
server.listen(9000, ()=>console.log('opened server on ', server.address()));


function connectionHandler(conn){
  var remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
  console.log('new client connection from %s', remoteAddress);
  
  clients.push({id:clients.length+1,port:conn.remotePort});
  if (clients.length > 2){
    conn.end();
    clients.pop()
  }
  console.log(clients);

  conn.on('data', onConnData);
  conn.on('close', onConnClose);
  conn.on('error', onConnError);

  function onConnData(d){
    console.log('connection data from: %s: %j', remoteAddress, Buffer.from(d, 'hex'));
    conn.write(d);
  }

  function onConnClose(){
    console.log('connection from %s closed', remoteAddress);
    client_idx = clients.indexOf(obj => obj.port === remotePort);
    clients.splice(client_idx, 1);
    console.log(clients);
  }

  function onConnError(err){
    console.log('Connection %s error: %s', remoteAddress, err.message);
  }
}

//TODO: handle when server randomly goes out