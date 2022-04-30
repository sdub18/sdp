import React, { useState, useContext, useEffect } from 'react';
import { Stack } from '@mui/material';
import { Divider } from '@material-ui/core';

import { SocketContext } from '../contexts/SocketContext';
import UserInput from './SecondaryView/UserInput';
import HealthMonitor from './SecondaryView/HealthMonitor';

const HealthMonitorMemo = React.memo(HealthMonitor);


export default function SecondaryView() {
	const { holderAddons } = useContext(SocketContext);
	const [availableAddons, setAvailableAddons] = useState([]);	

	useEffect(() =>{
		const interval = setInterval(()=>{
			if (!(JSON.stringify(holderAddons.current) === JSON.stringify(availableAddons))) {
				setAvailableAddons(holderAddons.current);
			}
		}, 100);
		return () => clearInterval(interval);
	});

	return (
	<React.Fragment>
		<Stack alignItems='center' justifyContent='flex-start' spacing={3}>
			<UserInput/>
			<Divider flexItem style={{height: 5, width: '100%'}} />
			{ (availableAddons.length > 0) ? <HealthMonitorMemo /> : <div></div>}
		</Stack>
	</React.Fragment>
  )
}
