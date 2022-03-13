#!/usr/bin/env python

import socket
import serial
import random
import time

class Transmitter:
	def __init__(self, HOST="localhost", PORT="4444"):
		self.host = HOST
		self.port = PORT
		
		self.buf = None
		self.ser_status = False
		self.sock_status = False

		self.init_ser()
		self.init_sock()
	
	def init_ser(self):
		self.ser = serial.Serial(
							port='/dev/serial0',
							baudrate = 115200,
							parity=serial.PARITY_NONE,
							stopbits=serial.STOPBITS_ONE,
							bytesize=serial.EIGHTBITS,
							timeout=5
						)
		self.ser_status = True
		print("serial connected!")
		self.ser.reset_input_buffer()

	def init_sock(self):
		self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
		self.sock.connect((self.host, self.port))
		self.status = True
		print("C2M socket connected!\n")

	def read(self):
		self.buf = self.ser.readline()
		print(self.buf)

	def send(self):
		self.sock.send(self.buf)



def main():
	HOST = "192.168.1.3"
	PORT = 49160
	transmitter = Transmitter(HOST, PORT)
	while True:
		transmitter.read()
		transmitter.send()



if __name__ == "__main__":
	main()
