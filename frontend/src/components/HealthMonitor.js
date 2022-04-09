import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

/*Call in App.js with something like
<HealthMonitor processDict={{pid1: "HEALTHY", pid2: "DANGEROUS", pid3: "HEALTHY", pid4: "DANGEROUS"}}></HealthMonitor>
*/

export default function HealthMonitor(props) {
  const keys = Object.keys(props.processDict);
  const listItems = keys.map((process, idx) =>
    <ListItem disablePadding key={{idx}}>
      <ListItemButton style={{cursor: 'auto'}}>
        <ListItemText
          primary={process + ": "}
          style={{color: "black"}}
        />
        <ListItemText
          primary={props.processDict[process]}
          style={props.processDict[process] === "HEALTHY" ? {color: "green"} : {color: "red"}}
        />
      </ListItemButton>
    </ListItem>
  );
  return (
    <Box sx={{ m: 3, width: '100%', minWidth: 360, bgcolor: 'background.paper', maxHeight: 450}} style={{overflow: 'auto'}}>
      <List>
        {listItems}
      </List>
    </Box>
  );
}