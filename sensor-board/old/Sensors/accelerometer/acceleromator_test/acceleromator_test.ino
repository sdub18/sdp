
const int xpin = 21;
const int ypin = 20;
const int zpin = 19;



void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for Leonardo only
  }
  Serial.println("Hello world!");
}

void loop() {
  // put your main code here, to run repeatedly:

  int x = analogRead(xpin);
  int y = analogRead(ypin);
  int z = analogRead(zpin);

  float zero_G = 512.0;
  float scale = 102.3;

  Serial.print(((float)x - 331.5)/65*9.8);
  Serial.print("\t");
  Serial.print(((float)y- 329.5)/68.5*9.8);
  Serial.print("\t");
  Serial.print(((float)y- 340)/68*9.8);
  Serial.print("\n");
  delay(500);
}
