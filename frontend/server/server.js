const net = require("net");
const express = require("express");
const app = express();
const CLIENT_TO_MIDDLE_PORT = process.env.PORT || 49160;
const MIDDLE_TO_FRONT_PORT = process.env.PORT || 3001;
var current = 4;
var x = "Pointless string";

function getRandomIntInRange(min, max) {
  return Math.floor(min + (Math.random() * (max - min)));
}

const server = net.createServer();
server.on('connection', connectionHandler);
var options = {host: "0.0.0.0", port:CLIENT_TO_MIDDLE_PORT};

server.listen(options, ()=>console.log('opened server on ', server.address()));

console.log(server.address());
var clients = [];

app.get("/api", (req, res) => {
  res.json({ message: "Pointless message: ", xAxis: x, yAxis: current});
});

app.listen(MIDDLE_TO_FRONT_PORT, () => {
  console.log(`Server listening on ${MIDDLE_TO_FRONT_PORT}`);
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
    // change this function to fit structure of frontend
    // and how it fetches data from backend
    //console.log('connection data from: %s: %j', conn.remotePort, d);  
    // write to some file to save historic data

    //console.log(d.toString());
    //conn.write(d);
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

//TODO: handle when server randomly goes out