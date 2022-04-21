import React, { useState, useCallback, useContext, useEffect, useRef } from 'react';
import axios from 'axios';

import { SocketContext } from '../../contexts/SocketContext';
import Selector from '../../components/Selector';
import { PeriodContext } from '../../contexts/PeriodContext';


export default function ChartPeriodSelector() {
	const { socket } = useContext(SocketContext);
	const [period, setPeriod] = useContext(PeriodContext);
	const [chartPeriods, setChartPeriods] = useState([]);


	useEffect(() =>{
		axios.get("http://localhost:3001/chart_periods").then((res)=>{setChartPeriods(res.data)})	
	},[]);
	
	const chooseChartPeriod = useCallback((event) => {
		const selectedPeriod = event.target.value
		axios.post("http://localhost:3001/chart_period", {period: selectedPeriod});
		setPeriod(selectedPeriod);
	  }, []);

	return (
		<React.Fragment>	
			<Selector text="Period" labels={chartPeriods} value={period} onChangeHandler={chooseChartPeriod}>
				Select Chart Period
			</Selector>
		</React.Fragment>
	)
}
