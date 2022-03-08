void setup() {
  Serial1.begin(9600);
  Serial.begin(9600);

}

String msg = "";

void loop() {

  if(Serial1.available() > 0) {
    msg = "";
    while(Serial1.available() > 0) {
      char read = Serial1.read();
      msg += read;
    }
    Serial1.write('X');
  }
  // Print Message
  Serial.println(msg);
}
