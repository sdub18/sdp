import React, { createContext, useCallback, useRef, useEffect } from "react"
import io from 'socket.io-client';

const OPTIONS = {'reconnection': true, 'reconnectionAttempts': Infinity} // options to have frontend continuously try to reconnect to backend
const socket = io('http://localhost:3001', OPTIONS);       // frontend websocket - connects to backend server's websocket

const SocketContext = createContext(socket);

const SocketProvider = ({ children }) => {
	const holderCoords = useRef([]);
	const holderAddons = useRef([]);
	const holderChartConfig = useRef({});
	const holderHealthStatuses = useRef([]);
	const holderPolicies = useRef([]);

	const handleGraphUpdate = useCallback((updatedCoords) => {
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

	const handleHealthUpdate = useCallback((updatedHealthStatus) => {
		if (updatedHealthStatus){
			holderHealthStatuses.current = updatedHealthStatus;
		}
	}, []);

	const handlePoliciesUpdate = useCallback((updatedPolicies) => {
		if (updatedPolicies){
			holderPolicies.current = updatedPolicies;
		}
	},[]);

	useEffect(()=>{
		socket.on("graph_update", handleGraphUpdate);
		socket.on("chart_config", handleConfigUpdate);
		socket.on("updateAddons", handleAddonsUpdate);
		socket.on("health_status", handleHealthUpdate);
		socket.on("updatePolicies", handlePoliciesUpdate);
		return () => {
			socket.off("graph_update", handleGraphUpdate);
			socket.off("chart_config", handleConfigUpdate);
			socket.off("updateAddons", handleAddonsUpdate);
			socket.off("health_status", handleHealthUpdate);
			socket.off("updatePolicies", handlePoliciesUpdate);
		}
	});
	

	return(
		<SocketContext.Provider value={{
			socket: socket,
			holderCoords: holderCoords, 
			holderAddons: holderAddons,
			holderChartConfig: holderChartConfig,
			holderHealthStatuses: holderHealthStatuses,
			holderPolicies: holderPolicies
		}}>{children}</SocketContext.Provider>
	);
};

export { SocketContext, SocketProvider };