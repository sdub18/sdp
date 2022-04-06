#include <Arduino.h>
#include <WiFi.h>
#include <Wire.h>
#include <Adafruit_MCP9808.h>
#include <Adafruit_LIS3DH.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_INA260.h>
#include <ArduinoJson.h>
#include <StreamUtils.h>

const char* SSID = "Pixel_8846";   
const char* PASS = "andtran123";
const char* HOST = "10.0.0.64"; // change to ip address of host computer

const int PORT = 49160; 

// unique id of this sensing module
const int UID = 1;

int canSend = 0;

// Json Document
StaticJsonDocument<1024> id_pkt;
StaticJsonDocument<1024> data_pkt;
JsonObject stamp = data_pkt.createNestedObject("data"); 
JsonObject acceleration = stamp.createNestedObject("acceleration");

// Connected Devices
Adafruit_LIS3DH lis3dh = Adafruit_LIS3DH();            // Accelerometer sensor
Adafruit_MCP9808 mcp9808 = Adafruit_MCP9808();   // Temperature Sensor
Adafruit_INA260 ina260 = Adafruit_INA260();         // Current Sensor

// WiFi Client to communicate with
WiFiClient client;

/////////////////////////////////////////////////////////////////////////////
// ------------------------- HELPER FUNCTIONS -----------------------------//
/////////////////////////////////////////////////////////////////////////////


void create_packet() {
  // --------------- ID ------------------
  data_pkt["id"] = UID;
  
  // ---------- ACCELEROMETER ------------
  lis3dh.read();
  acceleration["x"] = lis3dh.x;
  acceleration["y"] = lis3dh.y;
  acceleration["z"] = lis3dh.z;


  // ----------- TEMPERATURE --------------
  stamp["temp"] = mcp9808.readTempF();
  
  // ------------- CURRENT ----------------
  stamp["current"] = ina260.readCurrent();
  stamp["voltage"] = ina260.readBusVoltage();
  stamp["power"] = ina260.readPower();

}


/////////////////////////////////////////////////////////////////////////////
// -------------------------- INITIAL SETUP -------------------------------//
/////////////////////////////////////////////////////////////////////////////


void setup() {
  // -------------------- SERIAL COMMUNICATIONS -----------------------
  
  // Setup Serial Monitor
  Serial.begin(115200);
  while (!Serial) delay(1); // Wait until ready

  id_pkt["id"] = UID;  

  // -------------------- WIFI CONNECTION -----------------------------
  WiFi.begin(SSID, PASS);
  while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to the WiFi network");

  // ------------------------ ACCELEROMETER -------------------------

  if (! lis3dh.begin(0x19)) {   // change this to 0x19 for alternative i2c address
    Serial.println("Could not start LIS3DH");
    while (1) yield();
  } else {
    Serial.println("LIS3DH started");
  }

  // Print Range
  Serial.print("Range = "); Serial.print(2 << lis3dh.getRange());
  Serial.println("G");

  // lis3dh.setDataRate(LIS3DH_DATARATE_50_HZ);
  Serial.print("Data rate set to: ");
  switch (lis3dh.getDataRate()) {
    case LIS3DH_DATARATE_1_HZ: Serial.println("1 Hz"); break;
    case LIS3DH_DATARATE_10_HZ: Serial.println("10 Hz"); break;
    case LIS3DH_DATARATE_25_HZ: Serial.println("25 Hz"); break;
    case LIS3DH_DATARATE_50_HZ: Serial.println("50 Hz"); break;
    case LIS3DH_DATARATE_100_HZ: Serial.println("100 Hz"); break;
    case LIS3DH_DATARATE_200_HZ: Serial.println("200 Hz"); break;
    case LIS3DH_DATARATE_400_HZ: Serial.println("400 Hz"); break;

    case LIS3DH_DATARATE_POWERDOWN: Serial.println("Powered Down"); break;
    case LIS3DH_DATARATE_LOWPOWER_5KHZ: Serial.println("5 Khz Low Power"); break;
    case LIS3DH_DATARATE_LOWPOWER_1K6HZ: Serial.println("16 Khz Low Power"); break;
  }

  // ------------------------ TEMPERATURE ------------------------------
  
  if (!mcp9808.begin(0x1A)) {
    Serial.println("Could not start MCP9808");
    while (1);
  } else {
    Serial.println("MCP9808 started");
  }
  mcp9808.wake();
  mcp9808.setResolution(3); // sets the resolution mode of reading, the modes are defined in the table bellow:
  // Mode Resolution SampleTime
  //  0    0.5°C       30 ms
  //  1    0.25°C      65 ms
  //  2    0.125°C     130 ms
  //  3    0.0625°C    250 ms

  // --------------------------- CURRENT ------------------------------

  if (!ina260.begin()) {
    Serial.println("Could not start INA260");
    while (1);
  } else {
    Serial.println("INA260 started");
  }
  
}

/////////////////////////////////////////////////////////////////////////////
// ---------------------------- MAIN LOOP ---------------------------------//
/////////////////////////////////////////////////////////////////////////////

void loop() {

  if (client.connected()){
    // ------ Check if server sent ACK ------
    if (client.available()) {
      char c = client.read(); 
      if (c == 0x01) canSend = 1;
    }

    // -------- Communicate Results ---------
    if (canSend) create_packet();
    
    WriteBufferingStream buffered_client(client, 1024);
    serializeJson(canSend ? data_pkt : id_pkt, Serial);
    Serial.println("");
    serializeJson(canSend ? data_pkt : id_pkt, buffered_client);
  } else {
    client.connect(HOST, PORT); 
  }
}
