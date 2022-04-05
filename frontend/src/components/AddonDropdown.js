import React from "react";
import { makeStyles } from '@material-ui/core/styles'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


const useStyles = makeStyles(theme => ({
    containter: {
        backgroundColor: "#000000"
    },
    marginAutoItem: {
      display: "inline",
      textAlign: "center"
    },
    graph: {
        margin: "auto"
    }
  }));

  export default function AddonDropdown(props) {
    const classes = useStyles();
    
	let drop_options = props.labels.map((label, index) => {
        return <MenuItem key={index} value={label}>{label}</MenuItem>;
	});

    return(
        <Box sx={{ minWidth: props.minWidth }}>
			<FormControl style={{color: "white"}} fullWidth>
				<InputLabel style={{color: "white", fontSize: 23}}>{props.text}</InputLabel>
				<Select
        style={{margin: "white", color: "white", fontSize: 23}}
				labelId="chart-select-label"
				id="chart-select"
				value={props.value}
				label="Chart"
				onChange={props.onChangeHandler}
				>
				{drop_options}
				</Select>
			</FormControl>
		</Box>
    );
}

// TODO: Style component