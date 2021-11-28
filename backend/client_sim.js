/*
CLIENT (ADDON) SOFTWARE REQUIREMENTS
Teensy:
    getSensorData(dev_addr) - Get individual sensor data
    formatSensorData() - Format data together into JSON format
    init_I2C() - Connect to sensors using I2C
    write(msg) - Send packet to ESP32 via UART (eventually change to SPI?)

ESP32:
    read(num_bytes) - Receive data from Teensy
    connect(host, port) - Connect to middleman server via TCP
    sendData(msg) - Send UID and port to server until server sends back data 
        Then send data received from Teensy to middleman once handshake made (simulated here with canSend boolean)
    setUID(UID) - Write UID to ESP32 EEPROM - need to save unique ID even with no power, just need to do once 
    getUID() - Read UID from ESP32 EEPROM - for sendData
*/

const net = require('net');
const { exit } = require('process');

//change HOST to your PC's ip address
const HOST = "localhost";
const PORT = 49160;
const UID = process.argv[2];

const options = {family: 4, host:HOST, port: PORT}
const client = net.createConnection(options, connectionHandler);
let canSend = false;

function connectionHandler(conn){
    c_addr = client.address();
    console.log("established new connection using %s:%s", c_addr.address, c_addr.port);

    sendData(c_addr.port);

    client.on('data', (d)=>{
        console.log(''+d);
        canSend = true;
    })
    client.on('error', (err)=>{
        console.log(err.message);
    })
    client.on('close', ()=>{
        console.log('connection terminated');
        client.end();
        canSend = false;
        exit();
    })
}


async function sendData(port) {
    while(1){
        let header = String.fromCharCode(1);
        let end = String.fromCharCode(0);
        let data, type = "";

        if (!canSend){
            type = "init";
            data = port;
        }
        else{
            let I = 100 + getRandomIntInRange(-10, 10);
            let V = 11 + (getRandomIntInRange(0,10)/10);
            let Ta = 60 + getRandomIntInRange(0,5);
            let Tc = 80 + getRandomIntInRange(0,5);
            let x = 0;
            let y = 9.8;
            let z = 0;
            type = "data";
            data = `{"current": ${I}, "voltage": ${V}, "temp_ambient": ${Ta}, "temp_casing": ${Tc}, "accelereation": {"x": ${x}, "y": ${y}, "z": ${z}}}`;
        }

        let load = `{"id": ${UID}, "data":${data}}`;  
        data_pkt = header + load + end;
            
        client.write(load);
        console.log(load);
        
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
