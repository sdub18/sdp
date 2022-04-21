import React, { useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { Stack, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, FormControlLabel, Typography } from '@mui/material';

import Dropdown from '../../components/Dropdown';
import MainButton from '../../components/MainButton';
import SecondaryButton from '../../components/SecondaryButton';

const DropdownMemo = React.memo(Dropdown);

export default function PolicyModal() {
  const [open, setOpen] = useState(false);

  const policyTypes = useRef([]);
  const dataTypes = useRef([]);
  const policyPeriods = useRef([]);
  const comparisons = useRef([])

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
    })	
	},[]);


  const handleAdd = () => {
    const newPolicy = {
      policyType: policy,
      dataType: dataType,
      comparison: comparison,
      threshold: threshold
    };

    axios.post("http://localhost:3001/add_policy", newPolicy)
    .then(() => {
      alert("Policy added!");
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
    setDataType(event.target.value);
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

        <DialogContent sx={{ bgcolor: '#32363d'}}>
          <Stack alignItems='center' spacing={2} justifyContent='flex-start'>
            
            <DropdownMemo minWidth={250} text="Policy Type" labels={policyTypes.current} value={policy} onChangeHandler={choosePolicy} />
            <DropdownMemo minWidth={250} text="Data Type" labels={dataTypes.current} value={dataType} onChangeHandler={chooseDataType} />
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