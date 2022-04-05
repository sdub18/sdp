import React from "react";
import './App.css';
import io from 'socket.io-client';

import HealthMonitor from "./components/HealthMonitor";
import ThresholdSelector from "./components/ThresholdSelector";
import Dropdown from "./components/Dropdown";
import Header from "./components/Header"
import ChartsViewer from "./components/ChartsViewer";
import PolicyViewer from "./components/PolicyViewer";

import { Box, Button, Divider, Grid } from "@material-ui/core";
import { Stack } from "@mui/material";

const DropdownMemo = React.memo(Dropdown);

let local_addons = [];          // frontend local copy of connected addons
const RENDER_PERIOD = 50;       // rerender period in milliseconds
const socket_options = {'reconnection': true, 'reconnectionAttempts': Infinity} // options to have frontend continuously try to reconnect to backend
const socket = io('http://localhost:3001', socket_options);       // frontend websocket - connects to backend server's websocket

let coordinates = [];               // frontend local copy of coordinates, used to set "coords" state variable
let processDict = {};
let globalConfig = {"xMax" : 300,         
  "xIncrement" : 100,
  "width" : 700,
  "height" : 400,
};

const chart_types = ["current", "power", "temp"];   // all chart types --> HARDCODED AND KEPT IN FRONTEND; NOT STORED IN BACKEND
const attributes = ["current", "power", "temp"];
const thresholds = {"current": 100, "power": 60, "temp": 80};;
const threshold_labels = {"current": "current (A)", "power": " power (W)", "temp": " temp (F)"};
const threshold_string = "Thresholds: " + attributes.map((attribute) => (threshold_labels[attribute] + ": " + thresholds[attribute]))

const periods = ["100 ms", "500 ms", "1 s", "10 s", "1 min"];
const period_to_frequency = {"100 ms": 1, "500 ms": 5, "1 s": 10, "10 s": 100, "1 min": 600};
// The below are to be used once we have connected the database. They are for updating the x axis and ticks.
const period_to_xMax = {"100 ms": 100, "500 ms": 500, "1 s": 1000, "10 s": 10, "1 min": 60};
const period_to_xIncrement = {"100 ms": 20, "500 ms": 100, "1 s": 200, "10 s": 1, "1 min": 10}

socket.on("graph_update", (update_data) => {
  if (update_data != null)  coordinates = update_data;
});

socket.on("updateAddons", (recv_addons) => {
  if (!(JSON.stringify(recv_addons) === JSON.stringify(local_addons))) local_addons = recv_addons;
});

socket.on("health_status", (health_status) => {
  processDict = health_status;
});


function App() {
  const [coords, setCoords] = React.useState([]);
  const [addons, setAddons] = React.useState([]);
  const [selectedAddon, setSelectedAddon] = React.useState("");
  const [viewPolicy, setViewPolicy] = React.useState(false); 
  const [selectedPeriod, setSelectedPeriod] = React.useState("");
  const [config, setConfig] = React.useState({"xMax" : 300,         
    "xIncrement" : 100,
    "width" : 700,
    "height" : 400,
  });
  const [processDict_App, setProcessDict] = React.useState({});
  const [threshold, setThreshold] = React.useState(50);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setAddons(local_addons);
      setCoords(coordinates);
      setProcessDict(processDict);

    }, RENDER_PERIOD);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    if (!(addons.includes(selectedAddon))){
      setSelectedAddon("");
    }
  }, [addons])

  const handleViewPolicies = (() => {
    if ( viewPolicy ) {
      setViewPolicy(false);
    }
    else {
      setViewPolicy(true);
    }
  })

  const chooseAddon = React.useCallback((event) => {
    const addon = event.target.value
    socket.emit("addon_selection", addon);
    setSelectedAddon(Number(addon));
  }, []);

  const choosePeriod = React.useCallback((event) => {
    const period = event.target.value
    let periodAndFrequency = {};
    periodAndFrequency[period] = period_to_frequency[period];
    socket.emit("period_selection", periodAndFrequency);
    setSelectedPeriod(period);
    let tempConfig = globalConfig;
    tempConfig.xMax = period;
  }, []);

  return (
    <div className="App">
        <Header/>
        <Divider style={{height: 5}}/>
        <div className="App-body">
            <Grid container
              direction="row"
              justifyContent="center"
              alignItems="flex-start"
            >
              <Grid container item
                direction = "column"
                justifyContent="space-between"
                alignItems="center"
                spacing={3}
                xs={8}
                style={{maxHeight: '85vh', overflow: 'auto', marginTop:10}}
              >
                <Grid item>
                  {(selectedAddon !== "" && !viewPolicy) && 
                  <ChartsViewer config={config} chart_types={chart_types} coords={coords} />}
                  
                  {viewPolicy && 
                  <PolicyViewer/>}

                </Grid>

              </Grid>
              
              {(selectedAddon == "" || viewPolicy) && 
              <div class="content-divider" style={{display: "flex", minHeight: "85vh", height: "100%"}}>
                <Divider orientation="vertical" flexItem style={{width: 5}}/>
              </div>}
              
              <Grid container item
                direction="column"
                justifyContent="flex-start"
                alignItems="center"
                zeroMinWidth={true}
                spacing={3}
                xs={4}
              >
                <Grid item>
                  <Box sx={{mt: 3, mb: 2}}>
                    <Button style={{ fontSize: '18px', fontWeight: 'bold'}} color='primary' fullWidth onClick={handleViewPolicies} size='large' variant='contained'>{viewPolicy ? "Charts Viewer": "Policy List"}</Button> 
                  </Box>
                  
                  <Stack direction='row' spacing={3} alignItems='center' justifyContent='flex-start'>
                    <h4 style={{marginLeft: 20}}>Select addon</h4>
                    <DropdownMemo minWidth={120} text="ID" labels={addons} value={selectedAddon} onChangeHandler={chooseAddon}/>  
                  </Stack>
                  
                  <Stack direction='row' spacing={3} alignItems='center' justifyContent='flex-start'>
                    <h4 style={{marginLeft: 20}}>Select graph period</h4>
                    <DropdownMemo minWidth={130} text="Period" labels={periods} value={selectedPeriod} onChangeHandler={choosePeriod}/>  
                  </Stack>
                </Grid>
                
                <Grid item>
                  {addons.length > 0 && 
                  <HealthMonitor processDict={processDict_App}></HealthMonitor>}
                </Grid>

              </Grid>

            </Grid>

        </div>
    </div>
  );
}

export default App;
