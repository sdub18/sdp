import { Grid } from '@material-ui/core'
import React from 'react'

import { Divider } from '@material-ui/core';

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
					<Grid item xs={8} style={{maxHeight: '85vh', overflow: 'auto', marginTop:30}}>
						<MainView />
					</Grid>
				
					<Divider orientation="vertical" flexItem style={{display: "flex", minHeight: "84vh", height: "100%",width: 5, marginRight:"-1px"}}/>
					
					<Grid item xs={4}>
						<SecondaryView />
					</Grid>
				</Grid>
			</div>
		</ViewProvider>
	)
}
