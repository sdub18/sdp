import React from "react";
import { makeStyles } from '@material-ui/core/styles'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ChartButtons from "./ChartButtons";


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
        <Box sx={{ minWidth: 120 }}>
			<FormControl fullWidth>
				<InputLabel>ID</InputLabel>
				<Select
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