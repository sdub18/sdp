import React, { useContext, useState, useCallback, useEffect, useRef } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import axios from 'axios';

import { SocketContext } from '../../contexts/SocketContext';
import { AddonContext } from '../../contexts/AddonContext';

export default function HealthMonitor() {
  const { holderStatuses } = useContext(SocketContext);
  const [addon, setAddon] = useContext(AddonContext);

  const [statuses, setStatuses] = useState([]);

  useEffect(() =>{
    const interval = setInterval(()=>{
      if (!(JSON.stringify(statuses) === JSON.stringify(holderStatuses.current))){
        setStatuses(holderStatuses.current);
      }
    }, 100);
    return () => clearInterval(interval);
  })

  const handleClick = React.useCallback((id) => {
    setAddon(id)
    axios.post("http://localhost:3001/addon", {addon: id});

  });


  return (
      <List
        sx={{ 
          mx: 3, 
          mt: 5, 
          width: '50%', 
          bgcolor: 'background.paper', 
          maxHeight: 450, 
          overflow:'auto'}}
      >
        {
          statuses.map((addon, idx) =>
          <ListItem key={idx} id={addon.id}>
            <ListItemButton>
              <ListItemText onClick={() => {handleClick(addon.id)}} primary={`${addon.id}: ${addon.status}`} style={{color: "black"}}/>
            </ListItemButton>
          </ListItem>
        )}
      </List>
  );
}