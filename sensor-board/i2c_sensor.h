#ifndef i2csensor.h
#define i2csensor.h

#define SDA
#define SCL 

int i2c_init();
int i2c_start(void);
int i2c_stop(void);
int i2c_write(unsigned char device_addr, int command);
unsigned char i2c_read();





#endif