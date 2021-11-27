import socket
import random
import time

HOST = "https://localhost.com"
PORT = 49160

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((HOST, PORT))	

class EspSocket:
	def __init__(self):
		self.socket = socket.socket(socket.AF_INIT, socket.SOCK_STREAM)

	def connect(self, host, port):
		self.socket.connect((host, port))
		self.host = host
		self.port = port

	def write(self, msg):
		num_sent = 

		if num_sent != len(msg):
			print("Error writing message to %s: %s", self.host, self.port)
		
		



