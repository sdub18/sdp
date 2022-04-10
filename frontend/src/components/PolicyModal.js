import React from 'react';
import { Box, Stack, Button, Dialog, DialogTitle, DialogContent, TextField } from '@mui/material';
import { DialogActions } from '@mui/material';
import Dropdown from './Dropdown';
import { InputLabel } from '@mui/material';
import { Input } from '@mui/material';

const DropdownMemo = React.memo(Dropdown);
const comparisons = [">", "<"]

export default function PolicyModal({policyTypes, dataTypes, policyPeriods, addPolicy}) {
  const [open, setOpen] = React.useState(false);

  const [policy, setPolicyType] = React.useState("");
  const [dataType, setDataType] = React.useState("");
  const [period, setSelectedPeriod] = React.useState("");
  const [comparison, setComparison] = React.useState("");
  const [threshold, setThreshold] = React.useState("");

  const handleAdd = () => {
    const newPolicy = {
      policyType: policy,
      dataType: dataType,
      period: period,
      comparison: comparison,
      threshold: threshold
    };
    addPolicy(newPolicy);

    setPolicyType("");
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
    setPolicyType(event.target.value);
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
      <Box sx={{mt:1.5,mb:3}}>
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
              <DropdownMemo minWidth={250} text="Policy Type" labels={policyTypes} value={policy} onChangeHandler={choosePolicy} />
              <DropdownMemo minWidth={250} text="Data Type" labels={dataTypes} value={dataType} onChangeHandler={chooseDataType} />
            </Stack>
            <Stack direction='row' spacing={2}>
              <DropdownMemo minWidth={250} text="Period" labels={policyPeriods} value={period} onChangeHandler={choosePolicyPeriod} />
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