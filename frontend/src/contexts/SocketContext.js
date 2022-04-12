import React, { createContext, useCallback, useRef, useEffect } from "react"
import io from 'socket.io-client';

const OPTIONS = {'reconnection': true, 'reconnectionAttempts': Infinity} // options to have frontend continuously try to reconnect to backend
const socket = io('http://localhost:3001', OPTIONS);       // frontend websocket - connects to backend server's websocket

const SocketContext = createContext(socket);

const SocketProvider = ({ children }) => {
	const holderCoords = useRef([]);
	const holderAddons = useRef([]);
	const holderChartConfig = useRef({});
	const holderStatuses = useRef([]);
	const holderPolicies = useRef([]);

	const handleCoordsUpdate = useCallback((updatedCoords) => {
		if (updatedCoords){
			holderCoords.current = updatedCoords;
		}
	},[]);

	const handleConfigUpdate = useCallback((updatedChartConfig) => {
		if (updatedChartConfig){
			holderChartConfig.current = updatedChartConfig
		}
	},[]);

	const handleAddonsUpdate = useCallback((updatedAddons) => {
		if (updatedAddons){
			holderAddons.current = updatedAddons;
		}
	},[]);

	const handleHealthUpdate = useCallback((updatedStatuses) => {
		if (updatedStatuses){
			holderStatuses.current = updatedStatuses;
		}
	}, []);

	const handlePoliciesUpdate = useCallback((updatedPolicies) => {
		if (updatedPolicies){
			holderPolicies.current = updatedPolicies;
		}
	},[]);

	useEffect(()=>{
		socket.on("updateCoords", handleCoordsUpdate);
		socket.on("updateChartConfig", handleConfigUpdate);
		socket.on("updateAddons", handleAddonsUpdate);
		socket.on("updateStatuses", handleHealthUpdate);
		socket.on("updatePolicies", handlePoliciesUpdate);
		return () => {
			socket.off("updateCoords", handleCoordsUpdate);
			socket.off("updateChartConfig", handleConfigUpdate);
			socket.off("updateAddons", handleAddonsUpdate);
			socket.off("updateStatuses", handleHealthUpdate);
			socket.off("updatePolicies", handlePoliciesUpdate);
		}
	});
	

	return(
		<SocketContext.Provider value={{
			socket: socket,
			holderCoords: holderCoords, 
			holderAddons: holderAddons,
			holderChartConfig: holderChartConfig,
			holderStatuses: holderStatuses,
			holderPolicies: holderPolicies
		}}>
			{children}
		</SocketContext.Provider>
	);
};

export { SocketContext, SocketProvider };