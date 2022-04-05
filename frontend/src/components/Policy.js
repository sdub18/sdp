import React from "react";
import { Box, Card, Typography } from "@material-ui/core";

export default function Policy(props) {
	return (
		<div className='policy'>
			<Box sx={{ mx: 10, mb:5 }}>
				<Card raised >
					<Typography variant='h4' align='center' style={{fontWeight: 'bold' }}>Policy {props.policy}</Typography>
				</Card>
			</Box>		
		</div>
	);
}