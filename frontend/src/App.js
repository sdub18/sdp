import React from "react";
import logo from './logo.svg';
import './App.css';
import DynamicGraph from "./DynamicGraph";
import HealthMonitor from "./HealthMonitor";
import io from 'socket.io-client';
import AddonDropdown from "./AddonDropdown";

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
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <br/>
        <AddonDropdownMemo labels={addons} value={selectedAddon} onChangeHandler={chooseAddon}/>
        <br/>
        {selectedAddon !== "" && <HealthMonitor processDict={processDict_App}></HealthMonitor>}
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
          ))
        }
      </header>
    </div>
  );
}

export default App;
