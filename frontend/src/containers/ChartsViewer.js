import React, { useContext, useEffect, useState, useCallback  } from 'react';
import { SocketContext } from '../contexts/SocketContext';
import DynamicGraph from '../components/DynamicGraph';

const text = 'wow'

export default function ChartsViewer() {
	const units = {"current": "A", "power": "W", "temp": "F"};

	const socket = useContext(SocketContext);
	const [coords, setCoords] = useState([]);
	const [dataTypes, setDataTypes] = useState([]);
	const [chartConfig, setChartConfig] = useState({});

	const handleGraphUpdate = useCallback((updatedCoords) => {
		if (updatedCoords){
			setDataTypes(Object.keys(updatedCoords));
			setCoords(updatedCoords);
		}
	});

	const handleConfigUpdate = useCallback((chartConfig) => {
		if (chartConfig){
			setChartConfig(chartConfig)
		}
	});

	useEffect(()=>{
		socket.on("graph_update", handleGraphUpdate);
	},[]);

	useEffect(()=>{
		socket.on("chart_config", handleConfigUpdate);
		return () => {
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