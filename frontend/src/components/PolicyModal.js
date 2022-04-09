import React from 'react';
import { Box, Stack, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { DialogActions } from '@mui/material';
import Dropdown from './Dropdown';

const DropdownMemo = React.memo(Dropdown);
const periods = ["100 ms", "500 ms", "1 s", "10 s", "1 min"];

export default function PolicyModal(props) {
  const [open, setOpen] = React.useState(false);
  const [selectedPeriod, setSelectedPeriod] = React.useState("");
  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const chooseGraphPeriod = React.useCallback((event) => {
    const period = event.target.value
    let periodAndFrequency = {};
    periodAndFrequency[period] = period_to_frequency[period];
    socket.emit("period_selection", periodAndFrequency);
    setSelectedPeriod(period);
    let tempConfig = globalConfig;
    tempConfig.xMax = period;
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
        <DialogTitle sx={{fontSize: 36, fontWeight: 'bold', color:'white', bgcolor: '#32363d'}}>Policy Creation</DialogTitle>
        <DialogContent sx={{bgcolor: '#32363d'}}>
          <Stack alignItems='center' spacing={3} justifyContent='flex-start'>
            <Stack direction='row' spacing={2}>
              <DropdownMemo minWidth={250} text="Policy Type" labels={periods} value={selectedPeriod} onChangeHandler={chooseGraphPeriod} />
              <DropdownMemo minWidth={250} text="Data Type" labels={periods} value={selectedPeriod} onChangeHandler={chooseGraphPeriod} />
            </Stack>
            <Stack direction='row' spacing={2}>
              <DropdownMemo minWidth={250} text="Period" labels={periods} value={selectedPeriod} onChangeHandler={chooseGraphPeriod} />
              <DropdownMemo minWidth={250} text="Comparison" labels={periods} value={selectedPeriod} onChangeHandler={chooseGraphPeriod} />
            </Stack>
            <Stack direction='row' spacing={3} alignItems='center' justifyContent='flex-start'>
              <h5> THRESHOLD VALUE </h5>
              </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{bgcolor: '#32363d'}}>
          <Button variant='contained' onClick={handleClose}>Cancel</Button>
          <Button variant='contained' onClick={handleClose}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}