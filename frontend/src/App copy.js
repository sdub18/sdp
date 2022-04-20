import React from "react";
import './App.css';
import io from 'socket.io-client';

import HealthMonitor from "./components/HealthMonitor";
import Dropdown from "./components/Dropdown";
import Header from "./layouts/Header"
import ChartsViewer from "./components/ChartsViewer";
import PolicyViewer from "./components/PolicyViewer";
import PolicyModal from "./components/PolicyModal";
import Layout from "./layouts/Layout";

import { Box, Button, Divider, Grid } from "@material-ui/core";
import { Stack } from "@mui/material";

const DropdownMemo = React.memo(Dropdown);
const PolicyViewerMemo = React.memo(PolicyViewer);
const PolicyModalMemo = React.memo(PolicyModal);
const HealthMonitorMemo = React.memo(HealthMonitor);

let local_addons = [];          // frontend local copy of connected addons
let local_policies = [];
const RENDER_PERIOD = 100;       // rerender period in milliseconds
const socket_options = {'reconnection': true, 'reconnectionAttempts': Infinity} // options to have frontend continuously try to reconnect to backend
const socket = io('http://localhost:3001', socket_options);       // frontend websocket - connects to backend server's websocket

let coordinates = [];               // frontend local copy of coordinates, used to set "coords" state variable
let processDict = {};
let globalConfig = {"xMax" : 1000,         
  "xIncrement" : 100,
  "width" : 700,
  "height" : 400,
};

const dataTypes = ["current", "power", "temp"];   // should be grabbed from coordinates array -> make dynamic

  const periods = ["100 ms", "500 ms", "1 s", "10 s", "1 min"];
const period_to_frequency = {"100 ms": 1, "500 ms": 5, "1 s": 10, "10 s": 100, "1 min": 600};
// The below are to be used once we have connected the database. They are for updating the x axis and ticks.
const period_to_xMax = {"100 ms": 100, "500 ms": 500, "1 s": 1000, "10 s": 10, "1 min": 60};
const period_to_xIncrement = {"100 ms": 20, "500 ms": 100, "1 s": 200, "10 s": 1, "1 min": 10}

// should be sent from backend in initialization, config?
const policyTypes = ["Simple", "Average"];
const policyPeriods = ["100 ms", "500 ms", "1 s", "10 s", "1 min"];


socket.on("graph_update", (update_data) => {
  if (update_data != null)  coordinates = update_data;
});

socket.on("updateAddons", (recv_addons) => {
  if (!(JSON.stringify(recv_addons) === JSON.stringify(local_addons))) local_addons = recv_addons;
});

socket.on("health_status", (health_status) => {
  processDict = health_status;
});

socket.on("updatePolicies", (recv_policies) => {
  console.log(recv_policies);
  if (!(JSON.stringify(local_policies) === JSON.stringify(recv_policies))) local_policies = recv_policies;
});

function App() {
  const [coords, setCoords] = React.useState([]);
  const [addons, setAddons] = React.useState([]);
  const [policies, setPolicies] = React.useState([]);
  const [selectedAddon, setSelectedAddon] = React.useState("");
  const [viewPolicy, setViewPolicy] = React.useState(false); 
  const [selectedPeriod, setSelectedPeriod] = React.useState("");
  const [config, setConfig] = React.useState({"xMax" : 300,         
    "xIncrement" : 100,
    "width" : 700,
    "height" : 400,
  });
  const [processDict_App, setProcessDict] = React.useState({});

  React.useEffect(() => {
    const timer = setInterval(() => {
      setAddons(local_addons);
      setCoords(coordinates);
      setPolicies(local_policies);
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

  const chooseGraphPeriod = React.useCallback((event) => {
    const period = event.target.value
    let periodAndFrequency = {};
    periodAndFrequency[period] = period_to_frequency[period];
    socket.emit("period_selection", periodAndFrequency);
    setSelectedPeriod(period);
    let tempConfig = globalConfig;
    tempConfig.xMax = period;
  }, []);

  const addPolicy = React.useCallback((policy) => {
    console.log(policy);
    socket.emit("add_policy", policy);
    console.log("sent");
  })

  const deletePolicy = React.useCallback((id) => {
    // shall send id of policy back to backend to delete from table
    console.log(id);
    socket.emit("delete_policy", id)
  });

  return (
    <div className="App">
        <Layout>
        <Divider style={{height: 5}}/>
        <div className="App-body">
            <Grid container
              direction="row"
              justifyContent="center"
              alignItems="flex-start"
            >
              <Grid item
                xs={8}
                style={{maxHeight: '85vh', overflow: 'auto', marginTop:10}}
              >
                  {(selectedAddon !== "" && !viewPolicy) && 
                  <ChartsViewer config={config} dataTypes={dataTypes} coords={coords} />}
                  
                  {viewPolicy && 
                  <PolicyViewerMemo policies={policies} deletePolicy={deletePolicy}/>}
              </Grid>
              
              {(selectedAddon == "" || viewPolicy) && 
              <div className="content-divider" style={{display: "flex", minHeight: "85vh", height: "100%"}}>
                <Divider orientation="vertical" flexItem style={{width: 5}}/>
              </div>}
              
              <Grid container item
                direction="column"
                justifyContent="flex-start"
                alignItems="center"
                zeroMinWidth={true}
                spacing={1}
                xs={4}
              >
                <Grid container item
                  direction="column"
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <Grid item>
                    <Box sx={{mt: 3, mb: 2}}>
                      <Button 
                        style={{ fontSize: '18px', fontWeight: 'bold'}} 
                        color='primary' 
                        fullWidth 
                        onClick={handleViewPolicies} 
                        size='large' 
                        variant='contained'
                      >
                        {viewPolicy ? "Charts Viewer": "Policy List"}
                      </Button> 
                    </Box>
                    <Stack direction='row' spacing={3} alignItems='center' justifyContent='flex-start'>
                      <h4 style={{ marginLeft: 20 }}>Select addon</h4>
                      <DropdownMemo minWidth={120} text="ID" labels={addons} value={selectedAddon} onChangeHandler={chooseAddon} />
                    </Stack>
                    {!viewPolicy &&
                      <>
                      <Stack direction='row' spacing={3} alignItems='center' justifyContent='flex-start'>
                        <h4 style={{ marginLeft: 20 }}>Select graph period</h4>
                        <DropdownMemo minWidth={130} text="Period" labels={periods} value={selectedPeriod} onChangeHandler={chooseGraphPeriod} />
                      </Stack>
                      </>
                    }
                    {viewPolicy && selectedAddon &&
                    <PolicyModalMemo 
                      policyTypes={policyTypes} 
                      dataTypes={dataTypes} 
                      policyPeriods={policyPeriods} 
                      addPolicy={addPolicy} 
                    />}
                    
                  </Grid>
                  
                  <Divider flexItem style={{height: 5, width: '100%'}}/>
                  
                  <Grid item>
                    {addons.length > 0 && 
                      <HealthMonitorMemo processDict={processDict_App} />}

                  </Grid>

                </Grid>

              </Grid>

            </Grid>

        </div>
        </Layout>
    </div>
  );
}

export default App;