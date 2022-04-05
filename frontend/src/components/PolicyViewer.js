import React from "react";
import Policy from "./Policy";
import { Typography } from "@material-ui/core";
import { Stack } from "@mui/material";


export default function PolicyViewer() {
	const policies = ['1', '2', 'apple'	]
	return (
		<div className='policy-viewer'>
			<Stack
				alignItems='center'
				justifyContent='center'
			>
				<Typography style={{marginBottom: 15, fontWeight: 'bold', fontSize: 40}} variant='h1'>POLICY LIST</Typography>
				<Stack 
					alignItems='stretch'
					justifyContent='flex-start'
				>
					{policies.map((policy) => (<Policy policy={policy}/>))}
				</Stack>
			</Stack>
		</div>
	);
}