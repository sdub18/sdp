import React from 'react'
import { Button } from '@material-ui/core'

export default function SecondaryButton( props ) {
  return (
	<Button 
		style={{ fontSize: '16px', fontWeight: 'bold'}} 
		color='primary'
		onClick={props.onClick} 
		size='medium' 
		variant='contained'
	>
		{props.children}
	</Button> 
  )
}
