const net = require('net');
const { exit } = require('process');

//change HOST to your PC's ip address
const HOST = "localhost";
const PORT = 49160;

const options = {family: 4, host:HOST, port: PORT}
const client = net.createConnection(options, connectionHandler);


function connectionHandler(conn){
    c_addr = client.address();
    console.log("established new connection using %s:%s", c_addr.address, c_addr.port);

    sendData();

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
}


async function sendData() {
    while(1){
        let I = 100 + getRandomIntInRange(-10, 10);
        let V = 11 + (getRandomIntInRange(0,10)/10);
        let Ta = 60 + getRandomIntInRange(0,5);
        let Tc = 80 + getRandomIntInRange(0,5);
        
        let header = String.fromCharCode(1);
        let end = String.fromCharCode(0);
        let data = `{"current": ${I}, "voltage": ${V}, "temp_ambient": ${Ta}, "temp_casing": ${Tc}}`;
        let data_pkt = `{"port": ${client.address().port}, "data":${data}}`;
        data_pkt = header + data_pkt + end;
        
        client.write(data_pkt);
        
        await sleep(1);
    
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
