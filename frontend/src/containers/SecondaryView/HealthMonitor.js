import React, { useContext, useState, useCallback, useEffect, useRef } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import { SocketContext } from '../../contexts/SocketContext';

export default function HealthMonitor() {
  const { holderStatuses } = useContext(SocketContext);

  const [statuses, setStatuses] = useState([]);

  useEffect(() =>{
    const interval = setInterval(()=>{
      if (!(JSON.stringify(statuses) === JSON.stringify(holderStatuses.current))){
        setStatuses(holderStatuses.current);
      }
    }, 100);
    return () => clearInterval(interval);
  })


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
          <ListItem key={idx}>
            <ListItemText primary={`${addon.id}: ${addon.status}`} style={{color: "black"}}/>
          </ListItem>
        )}
      </List>
  );
}