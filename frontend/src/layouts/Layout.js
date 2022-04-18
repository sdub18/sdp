import React from 'react'
import { Divider } from '@material-ui/core'
import Header from './Header'

export default function Layout({ children }) {
  return (
	<div>
		<Header/>
		<Divider style={{height: 5}}/>
		{children}
	</div>
  )
}
