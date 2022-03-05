//
// Beep Boop Boys
// MDR.ino
// Sam Dubois, Andres Gutierrez
// 11.30.2021
//

#include <Wire.h>
#include "Adafruit_MCP9808.h"
#include <Adafruit_LIS3DH.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_INA260.h>
#include <ArduinoJson.h>

// unique id of this sensing module
const int UID = 1;

// Json Document
StaticJsonDocument<1024> pkt;
JsonObject stamp = pkt.createNestedObject("data"); 
JsonObject acceleration = stamp.createNestedObject("acceleration");
JsonObject temp = stamp.createNestedObject("temp");

// Connected Devices
Adafruit_LIS3DH lis = Adafruit_LIS3DH();            // Accelerometer sensor
Adafruit_MCP9808 tempsensor = Adafruit_MCP9808();   // Temperature Sensor
Adafruit_INA260 ina260 = Adafruit_INA260();         // Current Sensor

/////////////////////////////////////////////////////////////////////////////
// ------------------------- HELPER FUNCTIONS -----------------------------//
/////////////////////////////////////////////////////////////////////////////


void create_packet() {
  // --------------- ID ------------------
  pkt["id"] = UID;
  
  // ---------- ACCELEROMETER ------------
  lis.read();
  acceleration["x"] = lis.x;
  acceleration["y"] = lis.y;
  acceleration["z"] = lis.z;

  // ----------- TEMPERATURE --------------
  temp["c"] = tempsensor.readTempC();
  temp["f"] = tempsensor.readTempF();
   
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

  // Setup Hardware UART Serial Commms
  Serial1.begin(115200);
  while (!Serial1) delay(1); // Wait until ready

  // ------------------------ ACCELEROMETER -------------------------

  if (! lis.begin(0x19)) {   // change this to 0x19 for alternative i2c address
    Serial.println("Could not start LIS3DH");
    while (1) yield();
  } else {
    Serial.println("LIS3DH started");
  }

  // Print Range
  Serial.print("Range = "); Serial.print(2 << lis.getRange());
  Serial.println("G");

  // lis.setDataRate(LIS3DH_DATARATE_50_HZ);
  Serial.print("Data rate set to: ");
  switch (lis.getDataRate()) {
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
  
  if (!tempsensor.begin(0x1A)) {
    Serial.println("Could not start MCP9808");
    while (1);
  } else {
    Serial.println("MCP9808 started");
  }
  tempsensor.wake();
  tempsensor.setResolution(3); // sets the resolution mode of reading, the modes are defined in the table bellow:
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
  create_packet();
  
  // -------- Communicate Results ---------
  serializeJson(pkt, Serial);
  int bytes_sent = serializeJson(pkt, Serial1);
  Serial1.println();
  Serial.println();
  //Serial.println(bytes_sent);
  delay(5000);

}
