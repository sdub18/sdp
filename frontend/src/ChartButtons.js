import React from "react";
import { makeStyles } from '@material-ui/core/styles'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';


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

  export default function ChartButtons(props) {
    const classes = useStyles();

	//iterate through chart types and create control label for each
    let formlabels = props.labels.map((label, index) => {
        return <FormControlLabel key={index} value={label} control={<Radio />} label={label}/>;
	});
    
    return(
        <FormControl component="fieldset">
        <FormLabel component="legend" style={{color: "white", fontSize: 30}}>Chart Types</FormLabel>
        <RadioGroup row aria-label="Chart Types" name="row-radio-buttons-group" onChange={props.onChangeHandler}>
        	{formlabels}
        </RadioGroup>
    </FormControl>
    );
}

// TODO: Style component