import React from 'react';
import { Stack } from '@mui/material';
import { Divider } from '@material-ui/core';

import UserInput from './SecondaryView/UserInput';
import HealthMonitor from './SecondaryView/HealthMonitor';

const HealthMonitorMemo = React.memo(HealthMonitor);


export default function SecondaryView() {
  return (
	<React.Fragment>
		<Stack alignItems='center' justifyContent='flex-start' spacing={3}>
			<UserInput/>
			<Divider flexItem style={{height: 5, width: '100%'}} />
			<HealthMonitorMemo />
		</Stack>
	</React.Fragment>
  )
}
