import React from "react";
import { Box, Card, IconButton, Typography } from "@material-ui/core";
import { Stack } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

export default function Policy(props) {
	return (
		<div className='policy'>
			<Box sx={{ mx: 10, my:2.5}}>
				<Card raised >
					<Stack 
						direction='row'
						alignItems='space-between'
					>
						<Typography variant='h4' align='center' style={{fontWeight: 'bold' }}>Policy {props.policy}</Typography>
						<IconButton aria-label="delete" disabled color="primary" size='large'>
							<DeleteIcon />
						</IconButton>
					</Stack>
				</Card>
			</Box>		
		</div>
	);
}