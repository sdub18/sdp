const net = require('net');
const { exit } = require('process');

//change HOST to your PC's ip address
const HOST = "192.168.1.11";
const PORT = 49160;

const options = {family: 4, host:HOST, port: PORT}
const client = net.createConnection(options, ()=>{
    console.log("established new connection with %s:%s", client.localAddress, client.localPort);
});



client.on('data', (d)=>{
    console.log(''+d);
})
client.on('error', (err)=>{
    console.log(err.message);
})
client.on('close', ()=>{
    console.log('connection terminated');
    client.end();
    exit();
})

async function sendData() {
    while(1){
        randInt = getRandomIntInRange(0,10);
        client.write(''+randInt);
        await sleep(2000);
    
    }    
}

function sleep(ms){
    return new Promise((resolve)=>{
        setTimeout(resolve, ms);
    })
}

function getRandomIntInRange(min, max) {
    return Math.floor(min + (Math.random() * (max - min)));
  }
  

sendData();