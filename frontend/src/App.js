import React from "react";
import logo from './logo.svg';
import './App.css';
import DynamicGraph from "./DynamicGraph";
import HealthMonitor from "./HealthMonitor";
import ThresholdSelector from "./ThresholdSelector";
import io from 'socket.io-client';
import AddonDropdown from "./AddonDropdown";
import Header from "./Header"

const AddonDropdownMemo = React.memo(AddonDropdown);

let local_addons = [];          // frontend local copy of connected addons
const RENDER_PERIOD = 50;       // rerender period in milliseconds
const socket_options = {'reconnection': true, 'reconnectionAttempts': Infinity} // options to have frontend continuously try to reconnect to backend
const socket = io('http://localhost:3001', socket_options);       // frontend websocket - connects to backend server's websocket
const chart_types = ["current", "power", "temp"];   // all chart types --> HARDCODED AND KEPT IN FRONTEND; NOT STORED IN BACKEND
const units = {"current": "A", "power": "W", "temp": "F", "rpm": "RPM"};

let coordinates = [];               // frontend local copy of coordinates, used to set "coords" state variable
let processDict = {};
let config = {"xMax" : 300,         
  "xIncrement" : 100,
  "width" : 700,
  "height" : 400,
};
const attributes = ["current", "power", "temp"];
const thresholds = {"current": 100, "power": 60, "temp": 80};;
const threshold_labels = {"current": "current (A)", "power": " power (W)", "temp": " temp (F)"};
const threshold_string = "Thresholds: " + attributes.map((attribute) => (threshold_labels[attribute] + ": " + thresholds[attribute]))

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

  const chooseAddon = React.useCallback((event) => {
    const addon = event.target.value
    socket.emit("addon_selection", addon);
    setSelectedAddon(Number(addon));
  }, []);

  return (
    <div className="App">
        
        <Header/>

        <div className="App-body">
          {selectedAddon !== "" && <h3>{threshold_string}</h3> }
          <AddonDropdownMemo labels={addons} value={selectedAddon} onChangeHandler={chooseAddon}/>
          {addons.length > 0 && <HealthMonitor processDict={processDict_App}></HealthMonitor>}
          <br/>
          
          {selectedAddon !== "" &&
            chart_types.map((type) => (
            <DynamicGraph
                  key={type}
                  title={type}
                  data={coords[type]}
                  yAxisLabel={type + " (" + units[type] + ")"}
                  xMax={config.xMax}
                  xIncrement={config.xIncrement}
                  width={config.width}
                  height={config.height}>
            </DynamicGraph>
            ))}

        </div>
    </div>
  );
}

export default App;
