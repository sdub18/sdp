import React, { useContext } from 'react'

import { AddonContext } from '../contexts/AddonContext';
import { ViewContext } from '../contexts/ViewContext';
import ChartsViewer from './MainView/ChartsViewer';
import PolicyViewer from './MainView/PolicyViewer';


export default function MainView() {
	const [view, setView] = useContext(ViewContext);
	const [addon, setAddon] = useContext(AddonContext);
	return (
		<React.Fragment>
			{!view ? ( addon && <ChartsViewer /> ): <PolicyViewer />}
		</React.Fragment>
	)
}
