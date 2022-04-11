import React from 'react';

import { Stack } from '@mui/material';
import { Divider, Grid } from '@material-ui/core';

import UserInput from './UserInput';
import HealthMonitor from './HealthMonitor';


export default function SecondaryView() {
  return (
	<React.Fragment>
		<Stack alignItems='center' justifyContent='flex-start' spacing={3}>
			<UserInput/>
			<Divider flexItem style={{height: 5, width: '100%'}} />
			<HealthMonitor />
		</Stack>
	</React.Fragment>
  )
}
