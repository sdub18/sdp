import React, { useState, useContext } from 'react';
import { Stack, Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputLabel } from '@mui/material';

import { SocketContext } from '../../contexts/SocketContext';
import Dropdown from '../../components/Dropdown';
import MainButton from '../../components/MainButton';
import SecondaryButton from '../../components/SecondaryButton';

const DropdownMemo = React.memo(Dropdown);
const comparisons = [">", "<"]

export default function PolicyModal() {
  const { socket } = useContext(SocketContext);
  const [open, setOpen] = useState(false);

  const [policy, setPolicyType] = React.useState("");
  const [dataType, setDataType] = React.useState("");
  const [period, setSelectedPeriod] = React.useState("");
  const [comparison, setComparison] = React.useState("");
  const [threshold, setThreshold] = React.useState(0);

  const handleAdd = () => {
    const newPolicy = {
      policyType: policy,
      dataType: dataType,
      period: period,
      comparison: comparison,
      threshold: threshold
    };
    socket.emit("add_policy", newPolicy);

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
    <div className='add-new-policy'>
      <MainButton onClick={handleOpen}>
        Create New Policy
      </MainButton>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{fontSize: 30, fontWeight: 'bold', color:'white', bgcolor: '#32363d'}}>Policy Creation</DialogTitle>

        <DialogContent sx={{bgcolor: '#32363d'}}>
          <Stack alignItems='center' spacing={2} justifyContent='flex-start'>
            
            <Stack direction='row' spacing={2}>
              <DropdownMemo minWidth={250} text="Policy Type" labels={[]} value={policy} onChangeHandler={choosePolicy} />
              <DropdownMemo minWidth={250} text="Data Type" labels={[]} value={dataType} onChangeHandler={chooseDataType} />
            
            </Stack>
            
            <Stack direction='row' spacing={2}>
              <DropdownMemo minWidth={250} text="Period" labels={[]} value={period} onChangeHandler={choosePolicyPeriod} />
              <DropdownMemo minWidth={250} text="Comparison" labels={[]} value={comparison} onChangeHandler={chooseComparison} />
            </Stack>
            
            <Stack direction='row' spacing={2} alignItems='center' justifyContent='flex-start'>
              <InputLabel style={{color: "white", fontSize: 23}}>Threshold Value</InputLabel>
              <TextField sx={{ input: { color: 'white' } }} type='number' size='large' value={threshold} onChange={handleChange}/>
            
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions sx={{bgcolor: '#32363d'}}>
          <SecondaryButton onClick={handleClose}>Cancel</SecondaryButton>
          <SecondaryButton onClick={handleAdd}>Add</SecondaryButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}