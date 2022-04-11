import React, { useContext } from 'react'
import ChartsViewer from './ChartsViewer';
import PolicyViewer from './PolicyViewer';
import { AddonContext } from '../contexts/AddonContext';
import { ViewContext } from '../contexts/ViewContext';

export default function MainView() {
	const [view, setView] = useContext(ViewContext);
	const [addon, setAddon] = useContext(AddonContext);
	return (
		<React.Fragment>
			{!view ? ( addon && <ChartsViewer /> ): <PolicyViewer />}
		</React.Fragment>
	)
}
