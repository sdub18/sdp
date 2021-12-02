void setup() {
  Serial.begin(9600);
  Serial1.begin(9600);//here 9600 is baud rate
}
void loop() {
  Serial1.println("Hello mom");
  delay(1000);
}
