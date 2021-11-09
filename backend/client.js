const net = require('net');
const { exit } = require('process');

const options = {port: 9000}
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
        await sleep(10000);
    
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