import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

export default function AttributeList(props) {
  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <List>
        {props.graphTypes.map((graphType) => (
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary={graphType[0] + ": " + graphType[1]} style={{ color: '#000000' }}/>
            </ListItemButton>
          </ListItem>))}
      </List>
    </Box>
  );
}