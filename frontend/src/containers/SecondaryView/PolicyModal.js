import React, { useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { Stack, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, FormControlLabel, Typography } from '@mui/material';

import Dropdown from '../../components/Dropdown';
import MainButton from '../../components/MainButton';
import SecondaryButton from '../../components/SecondaryButton';

const DropdownMemo = React.memo(Dropdown);

export default function PolicyModal() {
  let dataTypeModalLabel;

  const [open, setOpen] = useState(false);

  const policyTypes = useRef([]);
  const dataTypes = useRef([]);
  const policyPeriods = useRef([]);
  const comparisons = useRef([]);
  const modalDataTypeLabels = useRef({});

  const [policy, setPolicyType] = useState("");
  const [dataType, setDataType] = useState("");
  const [comparison, setComparison] = useState("");
  const [threshold, setThreshold] = useState("");
  
  useEffect(() =>{
		axios.get("http://localhost:3001/policy_modal")
    .then((res)=>{
      let setup = res.data;
      policyTypes.current = setup.policyTypes;
      dataTypes.current = setup.dataTypes;
      policyPeriods.current = setup.periods;
      comparisons.current = setup.comparisons;
      modalDataTypeLabels.current = setup.modalDataTypeLabels;
    })	
	},[]);

  const handleAdd = () => {
    const newPolicy = {
      policyType: policy,
      dataType: dataType,
      comparison: comparison,
      threshold: dataType === "current" || dataType === "power" ? threshold * 1000 : threshold
    };
    axios.post("http://localhost:3001/policy", newPolicy)
    .then(() => {
      alert("Rule added!");
      handleClose();
    })
    .catch((err) => {
      reset();
      alert(`BAD REQUEST: ${err.response.data}`);
    });

  }

  const reset = () => {
    setPolicyType("");
    setDataType("");
    setComparison("");
    setThreshold("");
  }

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
    reset();
  }

  const handleChange = (event) => {
    setThreshold(event.target.value);
  };

  const choosePolicy = React.useCallback((event) => {
    setPolicyType(event.target.value);
  },[]);

  const chooseDataType = React.useCallback((event) => {
    setDataType(modalDataTypeLabels.current[event.target.value]);
  }, []);

  const chooseComparison = React.useCallback((event) => {
    setComparison(event.target.value);
  }, []);

  return (
    <div className='add-new-policy'>
      <MainButton onClick={handleOpen}>
        Create New Rule
      </MainButton>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{fontSize: 30, fontWeight: 'bold', color:'white', bgcolor: '#32363d'}}>Policy Creation</DialogTitle>

        <DialogContent sx={{ bgcolor: '#32363d'}}>
          <Stack alignItems='center' spacing={2} justifyContent='flex-start'>
            
            <DropdownMemo minWidth={250} text="Policy Type" labels={policyTypes.current} value={policy} onChangeHandler={choosePolicy} />
            <DropdownMemo minWidth={250} text="Data Type" labels={Object.keys(modalDataTypeLabels.current)} value={dataTypeModalLabel} onChangeHandler={chooseDataType} />
            <DropdownMemo minWidth={250} text="Comparison" labels={comparisons.current} value={comparison} onChangeHandler={chooseComparison} />

            <TextField  
              InputLabelProps={{style:{color: 'white', fontSize:23}}}
              inputProps={{ style: {fontSize: 18, color: 'white'}, inputMode: 'numeric', pattern: '[0-9]*' }} 
              label='Threshold' variant='outlined' size='large' 
              value={threshold} 
              onChange={handleChange}
              />           

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