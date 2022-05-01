import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { Drawer, IconButton, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { List } from '@material-ui/core';
import { Divider } from '@material-ui/core';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import WorkspacesIcon from '@mui/icons-material/Workspaces';

const useStyles =  makeStyles({
	paper: {
		width: 250,
		background: "#32363d"
	}
})


export default function Navbar() {
	const classes = useStyles();

    const [open, setOpen] = useState(false);
	
	const handleDrawerOpen = () => {
		setOpen(true);
	}

	const handleDrawerClose = () => {
		setOpen(false);
	}

	return (
        <div className='navbar'>
			<IconButton
				aria-label="open drawer"
				onClick={handleDrawerOpen}
				edge="start"
				color='primary'
				sx={{ ml: 5, mr: 2 }}
			>
				<MenuIcon fontSize='large'/>
			</IconButton>

			<Drawer
				anchor="left"
				open={open}
				classes={{paper: classes.paper}}
			>
				<IconButton onClick={handleDrawerClose}>
					<ChevronLeftIcon />
				</IconButton>
				<Divider />
				<List>
					<ListItem button> 
						<ListItemIcon>
							<SettingsIcon fontSize='large'/>
						</ListItemIcon>
						<ListItemText primary='Settings' primaryTypographyProps={{variant: "h5"}} />
					</ListItem>
					<Divider/>
					<ListItem button> 
						<ListItemIcon>
							<WorkspacesIcon fontSize='large'/>
						</ListItemIcon>
						<ListItemText primary='Groups' primaryTypographyProps={{variant: "h5"}} />
					</ListItem>
				</List>
			</Drawer>
        </div>
    );
}