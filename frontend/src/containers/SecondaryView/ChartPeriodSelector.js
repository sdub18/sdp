import React, { useState, useCallback, useContext, useEffect, useRef } from 'react';
import axios from 'axios';

import { SocketContext } from '../../contexts/SocketContext';
import Selector from '../../components/Selector';


export default function ChartPeriodSelector() {
	const {socket} = useContext(SocketContext);
	const [chartPeriod, setChartPeriod] = useState("");
	const [chartPeriods, setChartPeriods] = useState([]);


	useEffect(() =>{
		axios.get("http://localhost:3001/chart_periods").then((res)=>{setChartPeriods(res.data)})	
	},[]);
	
	const chooseChartPeriod = useCallback((event) => {
		const selectedPeriod = event.target.value
		socket.emit("chart_period_selection", selectedPeriod);
		setChartPeriod(selectedPeriod);
	  }, []);

	return (
		<React.Fragment>	
			<Selector text="Period" labels={chartPeriods} value={chartPeriod} onChangeHandler={chooseChartPeriod}>
				Select Chart Period
			</Selector>
		</React.Fragment>
	)
}
