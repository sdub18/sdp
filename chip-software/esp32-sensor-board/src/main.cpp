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
const char* HOST = "192.168.180.57"; // change to ip address of host computer

const uint16_t PORT = 49160;
const uint16_t UID = 1;

uint16_t prevDay = 0;
bool canSend = false;
uint16_t sampleRate = 100;
// Json Document
StaticJsonDocument<16> id_pkt;
StaticJsonDocument<192> data_pkt;
JsonObject data = data_pkt.createNestedObject("data"); 
JsonObject acceleration = data.createNestedObject("acceleration");

// Connected Devices
Adafruit_LIS3DH lis3dh = Adafruit_LIS3DH();            // Accelerometer sensor
Adafruit_MCP9808 mcp9808 = Adafruit_MCP9808();   // Temperature Sensor
Adafruit_INA260 ina260 = Adafruit_INA260();         // Current Sensor

// WiFi Client to communicate with
WiFiClient client;
/////////////////////////////////////////////////////////////////////////////
// ------------------------- HELPER FUNCTIONS -----------------------------//
/////////////////////////////////////////////////////////////////////////////

void fetch_NTP() {
  configTime(0, 0, "pool.ntp.org");
}

int64_t get_timestamp() {
	struct timeval tv;
	gettimeofday(&tv, NULL);
	return (tv.tv_sec * 1000LL + (tv.tv_usec / 1000LL));
}

bool check_new_day(uint16_t *prev_day) {
  struct timeval tv;
	gettimeofday(&tv, NULL);
  int t = tv.tv_sec / 86400 ;
  if (t != *prev_day) {
    *prev_day = t;
    fetch_NTP();
    return true;
  }
  return false;
}

void create_packet() {
  // ---------- META DATA ------------------
  data_pkt["id"] = UID;
  data_pkt["timestamp"] = get_timestamp();

  // ---------- ACCELEROMETER ------------
  lis3dh.read();
  acceleration["x"] = lis3dh.x;
  acceleration["y"] = lis3dh.y;
  acceleration["z"] = lis3dh.z;


  // ----------- TEMPERATURE --------------
  data["temp"] = mcp9808.readTempF();
  
  // ------------- CURRENT ----------------
  data["current"] = ina260.readCurrent();
  data["voltage"] = ina260.readBusVoltage();
  data["power"] = ina260.readPower();

}


/////////////////////////////////////////////////////////////////////////////
// -------------------------- INITIAL SETUP -------------------------------//
/////////////////////////////////////////////////////////////////////////////


void setup() {
  // -------------------- SERIAL COMMUNICATIONS -----------------------
  Serial.begin(115200);
  while (!Serial) delay(1);

  id_pkt["id"] = UID;  

  // -------------------- WIFI CONNECTION -----------------------------
  WiFi.begin(SSID, PASS);
  while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to the WiFi network");

  fetch_NTP(); // initialize time 

  // ------------------------ ACCELEROMETER -------------------------

  if (! lis3dh.begin(0x19)) {   // change this to 0x19 for alternative i2c address
    Serial.println("Could not start LIS3DH");
    while (1) yield();
  } else {
    Serial.println("LIS3DH started");
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
    // ------ check if new day -------------
    check_new_day(&prevDay);

    // ------ Check if server sent ACK ------
    if (client.available()) {
      if (!canSend){
        char c = client.read(); 
        if (c == 0x01) canSend = true;
      } else {
        char low = client.read();
        char high = client.read();
        sampleRate = (high << 8) | low;
      }
    }

    // -------- Communicate Results ---------
    WriteBufferingStream buffered_client(client, 192);
    if (canSend) {
      create_packet();
      serializeJson(data_pkt, Serial);
      Serial.println("");
      serializeJson(data_pkt, buffered_client);
      buffered_client.flush();
      delay(sampleRate);
    } else {
      serializeJson(id_pkt, Serial);
      Serial.println("");
      serializeJson(id_pkt, buffered_client);
      buffered_client.flush();
      delay(1000);
    }
    client.write("\n");

  } else {
    canSend = false;
    client.connect(HOST, PORT); 
  }
}
