import React, { createContext } from "react"
import io from 'socket.io-client';

const OPTIONS = {'reconnection': true, 'reconnectionAttempts': Infinity} // options to have frontend continuously try to reconnect to backend
const socket = io('http://localhost:3001', OPTIONS);       // frontend websocket - connects to backend server's websocket

const SocketContext = createContext(socket);

const SocketProvider = ({ children }) => {
	return(
		<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
	);
};

export { SocketContext, SocketProvider };