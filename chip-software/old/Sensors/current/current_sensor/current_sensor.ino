//
// current.sensor.ino
// Beep Boop Boys
// Sam DuBois
//
// 11-28-2020

#include <Adafruit_INA260.h>

Adafruit_INA260 ina260 = Adafruit_INA260();

void setup() {
  Serial.begin(115200);

  while (!Serial) { delay(10); } // Wait until serial port is opened

  Serial.println("Searching for Current Sensor ..."); // Search for INA260 Chip

  if (!ina260.begin()) {
    Serial.println("Couldn't find INA260 chip");
    while (1);
  }
  Serial.println("Found INA260 chip");
}

void loop() {
  Serial.print("Current: ");
  Serial.print(ina260.readCurrent());
  Serial.println(" mA");

  Serial.print("Bus Voltage: ");
  Serial.print(ina260.readBusVoltage());
  Serial.println(" mV");

  Serial.print("Power: ");
  Serial.print(ina260.readPower());
  Serial.println(" mW");

  Serial.println();
  delay(1000);
}
