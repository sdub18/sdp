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
    UID stands for "Unique Identifier"
    sendData(msg) - Send UID and port to server until server sends back data 
        Then send data received from Teensy to middleman once handshake made (simulated here with canSend boolean)
        We should also be able to control the speed at which the ESP32 sends the data (simulated here wiht the sleep function)
    setUID(UID) - Write UID to ESP32 EEPROM - need to save unique ID even with no power, just need to do once 
    getUID() - Read UID from ESP32 EEPROM - for sendData


POTENTIALLY USEFUL CIRCUIT PYTHON LIBRARIES FOR ESP32 and TEENSY 4.1:
Core Circuit Python Modules:
- busio and adafruit_bus_device.i2c_device (for managing from main/master side)
- i2cperipheral (for managing sensor/slave side)
- socketpool (for tcp implementation)
- wifi (for internet connection)
- nvm (for EEPROM access)

Ported Micro Python Libraries:
- json (for data formatting)
- uasyncio (can be used for TCP streams)
- const (for compiling optimization)
- machine.I2C (for i2C)

CircuitPython Library Bundle Package -> existing libaries for some of our devices!
- INA260
- LIS3DH
- MCP9808

Lots of ways to implement and use i2c not sure which is the best

*/

const net = require('net');
const { exit } = require('process');

//change HOST to your PC's ip address
const HOST = "localhost";
const PORT = 49160;
// The simulated client's Unique ID can be generated from the process' PID
const UID = process.pid;
const sendFreq = 10;

const id_pkt = `{"id": ${UID}}`;

const options = {family: 4, host:HOST, port: PORT}
const client = net.createConnection(options, connectionHandler);
let canSend = false;

function connectionHandler(conn){
    c_addr = client.address();
    console.log("established new connection using %s:%s", c_addr.address, c_addr.port);

    sendData(c_addr.port);

    client.on('data', (d)=>{
        console.log(d.toString());
        console.log("Received ACK");
        if (d.toString('hex') == "01") canSend = true;
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
    let count = 0;
    let direction = 3;
    let I_base;
    let V_base;
    let P_base;
    let T_base;
    while(1){
        if (!canSend) {
            client.write(id_pkt);
        }
        else {
            if (count % 300 === 0) {
                direction *= -1;
            }
            count += 1;
            I_base = 100 + (direction);
            V_base = 10 + (direction);
            P_base = 60 + (direction);
            T_base = 80 + (direction);
            let I = (I_base) + (getRandomIntInRange(-1, 1));
            let V = (V_base) + (getRandomIntInRange(-1, 1));
            let P = (P_base) + (getRandomIntInRange(-1, 1));
            let T = (T_base) + getRandomIntInRange(-1, 1);
            let x = 0;
            let y = 0;
            let z = 9.8;
            let data = `{"current": ${I}, "voltage": ${V},"power": ${P}, "temp": ${T}, "accelereation": {"x": ${x}, "y": ${y}, "z": ${z}}}`;
            let data_pkt = `{"id": ${UID}, "data":${data}},"timestamp":${Date.now()}}\n`;  
            client.write(data_pkt);
            console.log(data_pkt);
        }
        await sleep(sendFreq);  
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
