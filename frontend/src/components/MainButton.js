import React from 'react'
import { Button } from '@material-ui/core'

export default function MainButton( props ) {
  return (
	<Button 
		style={{ fontSize: '18px', fontWeight: 'bold'}} 
		color='primary' 
		fullWidth 
		onClick={props.onClick} 
		size='large' 
		variant='contained'
	>
		{props.children}
	</Button> 
  )
}
