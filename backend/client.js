const { SSL_OP_EPHEMERAL_RSA } = require('constants');
const net = require('net');
const { send } = require('process');
const options = {port: 9000}
const client = net.createConnection(options, ()=>{
    console.log("established new connection with %s:%s", client.localAddress, client.localPort);
});


async function sendData() {
    while(1){
        randInt = getRandomIntInRange(0,10);
        client.write(''+randInt);
        await sleep(5000);
    
    }    
}


client.on('data', (d)=>{
    console.log(''+d);
})


function sleep(ms){
    return new Promise((resolve)=>{
        setTimeout(resolve, ms);
    })
}

function getRandomIntInRange(min, max) {
    return Math.floor(min + (Math.random() * (max - min)));
  }
  

sendData();