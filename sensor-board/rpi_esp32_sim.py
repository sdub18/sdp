import socket
import serial
import random
import time

HOST = "192.168.1.3"
PORT = 49160

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.connect((HOST, PORT))	

ser = serial.Serial(
	port='/dev/serial0',
	baudrate = 115200,
	parity=serial.PARITY_NONE,
	stopbits=serial.STOPBITS_ONE,
	bytesize=serial.EIGHTBITS,
	timeout=5
)
ser.reset_input_buffer()

while True:
	x = ser.readline()
	print(x)
	sock.send(x)


