import React, { useState, useCallback, useContext, useEffect, useRef } from 'react'
import { Stack } from '@mui/material'

import { SocketContext } from '../../contexts/SocketContext';
import Dropdown from '../../components/Dropdown';
import Selector from '../../components/Selector';

const DropdownMemo = React.memo(Dropdown);

export default function AddonSelector() {
	const {socket, holderAddons} = useContext(SocketContext);
	const [chartPeriod, setChartPeriod] = useState("");
	const [chartPeriods, setChartPeriods] = useState([]);

	useEffect(() => {
	  // should call setChartPeriods
	}, [])
	
	const chooseChartPeriod = useCallback((event) => {
		const selectedPeriod = event.target.value
		socket.emit("chart_period_selection", );
		setChartPeriod(selectedPeriod);
	  }, []);

	return (
		<Selector text="Period" labels={chartPeriods} value={chartPeriod} onChangeHandler={chooseChartPeriod}>
			Select Chart Period
		</Selector>
	)
}
