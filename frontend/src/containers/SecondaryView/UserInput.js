import React, { useContext } from 'react';
import { Stack } from '@mui/material';

import { ViewContext } from '../../contexts/ViewContext';
import { AddonContext } from '../../contexts/AddonContext';
import PolicyModal from './PolicyModal';
import AddonSelector from './AddonSelector';
import ChartPeriodSlider from './ChartPeriodSlider';
import MainButton from '../../components/MainButton';
import PhoneInput from './PhoneInput';


export default function UserInput() {
	const [views, setViews] = useContext(ViewContext);
	const [addon, setAddon] = useContext(AddonContext);
	const handleView = () => setViews(!views);

	
	return (
		<React.Fragment>
			<Stack sx={{mt: 3}} spacing={3}>
				<MainButton onClick={handleView}>
					{views ? "Charts Viewer": "Rules List"}
				</MainButton> 
				<AddonSelector/>
				<PhoneInput />
				{ !views && addon && <ChartPeriodSlider />}
				{ views && addon && <PolicyModal />}
			</Stack>
		</React.Fragment>
	)
}
