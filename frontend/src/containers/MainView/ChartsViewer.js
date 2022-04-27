import React, { useContext, useEffect, useState, useCallback, useRef  } from 'react';
import axios from 'axios';
import { Stack } from '@mui/material';

import { SocketContext } from '../../contexts/SocketContext';
import DynamicGraph from '../../components/DynamicGraph';

export default function ChartsViewer() {
	const units = {"current": "mA", "voltage": "mV", "power": "mW", "temp": "°F"};

	const {holderCoords} = useContext(SocketContext);
	
	const [coords, setCoords] = useState([]);
	const [dataTypes, setDataTypes] = useState([]);
	const [chartConfig, setChartConfig] = useState({});


	useEffect(() =>{
		const interval = setInterval(()=>{
			setCoords(holderCoords.current);
		}, 100);
		return () => clearInterval(interval);
	},[])

	useEffect(() =>{
		axios.get("http://localhost:3001/data_types").then((res)=>{setDataTypes(res.data)});
		axios.get("http://localhost:3001/chart_config").then((res)=>{setChartConfig(res.data)});	
	},[]);

	return (
		<React.Fragment>
			<Stack alignItems='center'>
				{dataTypes.map((type) => (
					<DynamicGraph
						key={type}
						title={type}
						data={coords[type]}
						yAxisLabel={type + " [" + units[type] + "]"}
						xMax={chartConfig.xMax}
						xIncrement={chartConfig.xIncrement}
						width={chartConfig.width}
						height={chartConfig.height}>
					</DynamicGraph>
				))}
			</Stack>
		</React.Fragment>
	);
}