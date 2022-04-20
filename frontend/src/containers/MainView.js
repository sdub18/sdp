import React, { useContext } from 'react'

import { AddonContext } from '../contexts/AddonContext';
import { PeriodContext } from '../contexts/PeriodContext';
import { ViewContext } from '../contexts/ViewContext';
import ChartsViewer from './MainView/ChartsViewer';
import PolicyViewer from './MainView/PolicyViewer';


export default function MainView() {
	const [view, setView] = useContext(ViewContext);
	const [addon, setAddon] = useContext(AddonContext);
	const [period, setPeriod] = useContext(PeriodContext);
	return (
		<React.Fragment>
			{!view ? ( addon && period && <ChartsViewer /> ): <PolicyViewer />}
		</React.Fragment>
	)
}
