import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

let selection_values = [];
for (let i = 0; i < 150; i++) {
    selection_values.push(i);
}

export default function ThresholdCurrentSelector(props) {
  const [threshold, setThreshold] = React.useState('');

  return (
    <Box>
        <Box component="div" style={{ minWidth: 120, display: "inline-flex" }}>
            <FormControl fullWidth>
                <InputLabel style={{color: "white"}} id={"current"}>Current</InputLabel>
                <Select
                labelId={"current"}
                id={"current"}
                value={props.value}
                label="Threshold"
                onChange={props.onChangeHandler}
                >
                {selection_values.map((value) => (
                    <MenuItem value={value}>{value}</MenuItem>
                ))}
                </Select>
            </FormControl>
        </Box>
    </Box>
    
  );
}