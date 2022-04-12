import React, { useContext } from 'react';
import { Stack } from '@mui/material';

import { ViewContext } from '../contexts/ViewContext';
import { AddonContext } from '../contexts/AddonContext';

import PolicyModal from './PolicyModal';
import AddonSelector from './AddonSelector';
import MainButton from '../components/MainButton';

const PolicyModalMemo = React.memo(PolicyModal);

export default function UserInput() {
	const [views, setViews] = useContext(ViewContext);
	const [addon, setAddon] = useContext(AddonContext);
	const handleView = () => setViews(!views);

	
	return (
		<React.Fragment>
			<Stack sx={{mt: 3}} spacing={3}>
				<MainButton onClick={handleView}>
					{views ? "Charts Viewer": "Policy List"}
				</MainButton> 
				<AddonSelector/>
				{ views && addon && <PolicyModal/>}
			</Stack>
		</React.Fragment>
	)
}
