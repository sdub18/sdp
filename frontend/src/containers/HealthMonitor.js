import React, { useContext, useState, useCallback, useEffect } from 'react';
import { SocketContext } from '../contexts/SocketContext';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';


export default function HealthMonitor() {
  const socket = useContext(SocketContext);

  const [healthStatus, setHealthStatus] = useState([]);

  const handleUpdateHealth = useCallback((updatedHealthstatus) => {
    if (!(JSON.stringify(updatedHealthstatus) == JSON.stringify(healthStatus))){
      console.log("pissant")
      setHealthStatus(updatedHealthstatus);
    }
	  }, []);
	

	useEffect(()=>{
		socket.on("health_status", handleUpdateHealth);
		return () => {
			socket.off("health_status", handleUpdateHealth);
		}
	},[]);

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
          healthStatus.map((addon, idx) =>
          <ListItem key={idx}>
            <ListItemText primary={`${addon.id}: ${addon.status}`} style={{color: "black"}}/>
          </ListItem>
        )}
      </List>
  );
}