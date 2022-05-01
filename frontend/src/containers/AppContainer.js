import React from 'react'

import { Grid, Divider } from '@material-ui/core';

import { ViewProvider } from '../contexts/ViewContext'
import MainView from './MainView'
import SecondaryView from './SecondaryView'

export default function AppContainer() {
	return (
		<ViewProvider>
			<div className='app-container'>
				<Grid container
					direction="row"
					justifyContent="flex-start"
					alignItems="flex-start"
					wrap={"nowrap"}
				>
					<Grid item xs={8} style={{maxHeight: '86vh', overflow: 'auto', marginTop:5}}>
						<MainView />
					</Grid>
				
					<Divider orientation="vertical" flexItem style={{display: "flex", minHeight: "87vh", height: "100%", width: 5, marginRight:"-1px"}}/>
					
					<Grid item xs={4}>
						<SecondaryView />
					</Grid>
				</Grid>
			</div>
		</ViewProvider>
	)
}
