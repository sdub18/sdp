import React from 'react';
import { Box, Stack, Button, Dialog, DialogTitle, DialogContent, TextField } from '@mui/material';
import { DialogActions } from '@mui/material';
import Dropdown from './Dropdown';
import { InputLabel } from '@mui/material';
import { Input } from '@mui/material';

const DropdownMemo = React.memo(Dropdown);
const policies = ["Simple", "Average"];
const data_types = ["current", "voltage", "power", "temperature"];
const periods = ["100 ms", "500 ms", "1 s", "10 s", "1 min"];
const comparisons = [">", "<"]

export default function PolicyModal(props) {
  const [open, setOpen] = React.useState(false);

  const [policy, setPolicy] = React.useState("");
  const [dataType, setDataType] = React.useState("");
  const [period, setSelectedPeriod] = React.useState("");
  const [comparison, setComparison] = React.useState("");
  const [threshold, setThreshold] = React.useState("");

  const handleAdd = () => {
    const newPolicy = {
      policy: policy,
      data_type: dataType,
      period: period,
      comparison: comparison,
      threshold: threshold
    };
    props.callback(newPolicy);

    setPolicy("");
    setDataType("");
    setSelectedPeriod("");
    setComparison("");
    setThreshold("");
    handleClose();
  }

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleChange = (event) => {
    setThreshold(event.target.value);
  };

  const choosePolicy = React.useCallback((event) => {
    setPolicy(event.target.value);
  },[]);

  const chooseDataType = React.useCallback((event) => {
    setDataType(event.target.value);
  }, []);

  const choosePolicyPeriod = React.useCallback((event) => {
    setSelectedPeriod(event.target.value);
  }, []);

  const chooseComparison = React.useCallback((event) => {
    setComparison(event.target.value);
  }, []);

  return (
    <div>
      <Box sx={{mt:1.5,mb:2}}>
        <Button 
          style={{ fontSize: '18px', fontWeight: 'bold', backgroundColor: '#3F51B5' }} 
          fullWidth 
          onClick={handleOpen} 
          size='large' 
          variant='contained'>
            Create New Policy
        </Button> 
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{fontSize: 30, fontWeight: 'bold', color:'white', bgcolor: '#32363d'}}>Policy Creation</DialogTitle>
        <DialogContent sx={{bgcolor: '#32363d'}}>
          <Stack sx={{mt:3}} alignItems='center' spacing={3} justifyContent='flex-start'>
            <Stack direction='row' spacing={2}>
              <DropdownMemo minWidth={250} text="Policy Type" labels={policies} value={policy} onChangeHandler={choosePolicy} />
              <DropdownMemo minWidth={250} text="Data Type" labels={data_types} value={dataType} onChangeHandler={chooseDataType} />
            </Stack>
            <Stack direction='row' spacing={2}>
              <DropdownMemo minWidth={250} text="Period" labels={periods} value={period} onChangeHandler={choosePolicyPeriod} />
              <DropdownMemo minWidth={250} text="Comparison" labels={comparisons} value={comparison} onChangeHandler={chooseComparison} />
            </Stack>
            <Stack direction='row' spacing={3} alignItems='center' justifyContent='flex-start'>
              <InputLabel style={{color: "white", fontSize: 23}}>Threshold Value</InputLabel>
              <TextField sx={{ input: { color: 'white' } }} type='number' size='large' value={threshold} onChange={handleChange}/>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{bgcolor: '#32363d'}}>
          <Button variant='contained' onClick={handleClose}>Cancel</Button>
          <Button variant='contained' onClick={handleAdd}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}