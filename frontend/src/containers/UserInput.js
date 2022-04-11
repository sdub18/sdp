import React, { useContext, useCallback } from 'react'
import { Box, Button } from '@material-ui/core';
import { Stack } from '@mui/material';

import { ViewContext } from '../contexts/ViewContext'
import { AddonContext } from '../contexts/AddonContext';
import PolicyModal from './PolicyModal';
import AddonSelector from './AddonSelector';

const PolicyModalMemo = React.memo(PolicyModal);

export default function UserInput() {
	const [views, setViews] = useContext(ViewContext);
	const [addon, setAddon] = useContext(AddonContext);
	const handleView = () => setViews(!views);

	
	return (
		<React.Fragment>
			<Stack sx={{mt: 3}} spacing={3}>
				<Button 
					style={{ fontSize: '18px', fontWeight: 'bold'}} 
					color='primary' 
					fullWidth 
					onClick={handleView} 
					size='large' 
					variant='contained'
				>
				{views ? "Charts Viewer": "Policy List"}
				</Button> 
				<AddonSelector/>
				{ views && addon && <PolicyModal/>}
			</Stack>
		</React.Fragment>
	)
}
