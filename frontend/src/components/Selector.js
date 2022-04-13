import React from 'react'
import { Stack } from '@mui/material'
import Dropdown from './Dropdown'

export default function Selector(props) {
  return (
	<React.Fragment>
		<Stack direction='row' spacing={3} alignItems='center' justifyContent='flex-start'>
			<h2>{props.children}</h2>
			<Dropdown minWidth={120} text={props.text} labels={props.labels} value={props.value} onChangeHandler={props.onChangeHandler} />
		</Stack>
	</React.Fragment>
  )
}
