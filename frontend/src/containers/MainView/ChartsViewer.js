import React, { useContext, useEffect, useState, useCallback, useRef  } from 'react';

import { SocketContext } from '../../contexts/SocketContext';
import DynamicGraph from '../../components/DynamicGraph';

export default function ChartsViewer() {
	const units = {"current": "A", "power": "W", "temp": "F"};

	const {holderCoords, holderChartConfig} = useContext(SocketContext);
	
	const [coords, setCoords] = useState([]);
	const [dataTypes, setDataTypes] = useState([]);
	const [chartConfig, setChartConfig] = useState({});


	useEffect(() =>{
		const interval = setInterval(()=>{
			setCoords(holderCoords.current);
		}, 100);
		return () => clearInterval(interval);
	})

	useEffect(()=>{
		setDataTypes(Object.keys(holderCoords.current));
		setChartConfig(holderChartConfig.current);
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