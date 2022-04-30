import React, { useState, useCallback, useContext, useEffect, useRef } from 'react';
import axios from 'axios';

import { Slider, Typography } from '@mui/material';
import { PeriodContext } from '../../contexts/PeriodContext';


export default function ChartPeriodSlider() {
	const [period, setPeriod] = useContext(PeriodContext);

	const chooseChartPeriod = useCallback((event) => {
		const selectedPeriod = event.target.value
		axios.post("http://localhost:3001/chart_period", {period: selectedPeriod})
		.then(()=>{setPeriod(selectedPeriod)})
		.catch((err)=>{
			alert("Period selection failed: Try again later");
			return;
		});
	  }, []);


	return (
		<React.Fragment>	
			<h2>Select Timeframe (seconds)</h2>
			<Slider
				defaultValue={30}
				valueLabelDisplay="auto"
				step={30}
				marks
				min={30}
				max={300}
				value={period}
				onChange={chooseChartPeriod}
			/>
		</React.Fragment>
	)
}
