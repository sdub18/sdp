import React, { useContext, useEffect, useState, useCallback, useRef  } from 'react';
import { SocketContext } from '../contexts/SocketContext';
import DynamicGraph from '../components/DynamicGraph';

export default function ChartsViewer() {
	const units = {"current": "A", "power": "W", "temp": "F"};

	const socket = useContext(SocketContext);
	const [coords, setCoords] = useState([]);
	const [dataTypes, setDataTypes] = useState([]);
	const [chartConfig, setChartConfig] = useState({});

	const holderCoords = useRef([]);
	const holderDataTypes = useRef([]);
	const holderChartConfig = useRef({});

	const handleGraphUpdate = useCallback((updatedCoords) => {
		if (updatedCoords){
			holderCoords.current = updatedCoords;
			holderDataTypes.current = Object.keys(updatedCoords);
		}
	});

	const handleConfigUpdate = useCallback((updatedChartConfig) => {
		if (chartConfig){
			holderChartConfig.current = updatedChartConfig
		}
	});

	useEffect(() =>{
		const interval = setInterval(()=>{
			setCoords(holderCoords.current);
			setDataTypes(holderDataTypes.current);
			setChartConfig(holderChartConfig.current);
		}, 100);
		return () => clearInterval(interval);
	})

	useEffect(()=>{
		socket.on("graph_update", handleGraphUpdate);
		socket.on("chart_config", handleConfigUpdate);
		return () => {
			socket.off("graph_update", handleGraphUpdate);
			socket.off("chart_config", handleConfigUpdate);
		}
	},[]);

	return (
		<React.Fragment>
			{dataTypes.map((type) => (
				<DynamicGraph
					key={type}
					title={type}
					data={coords[type]}
					yAxisLabel={type + " (" + units[type] + ")"}
					xMax={chartConfig.xMax}
					xIncrement={chartConfig.xIncrement}
					width={chartConfig.width}
					height={chartConfig.height}>
				</DynamicGraph>
		  	))}
		</React.Fragment>
	);
}