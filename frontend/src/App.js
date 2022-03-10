import React from "react";
import logo from './logo.svg';
import './App.css';
import DynamicGraph from "./DynamicGraph";
import io from 'socket.io-client';
import ChartButtons from "./ChartButtons";
import AddonDropdown from "./AddonDropdown";
import { Box } from "@mui/system";

const ChartButtonsMemo = React.memo(ChartButtons);
const AddonDropdownMemo = React.memo(AddonDropdown);

let local_addons = [];          // frontend local copy of connected addons
const RENDER_PERIOD = 50;       // rerender period in milliseconds
const socket_options = {'reconnection': true, 'reconnectionAttempts': Infinity} // options to have frontend continuously try to reconnect to backend
const socket = io('http://localhost:3001', socket_options);       // frontend websocket - connects to backend server's websocket
const chart_types = ["current", "power", "temp"];   // all chart types --> HARDCODED AND KEPT IN FRONTEND; NOT STORED IN BACKEND
let coordinates = [];               // frontend local copy of coordinates, used to set "coords" state variable
let config = {"xMax" : 300,         
  "xIncrement" : 100,
  "width" : 700,
  "height" : 400};
let y_axes_config = {};
let healthy = true;
let healthText = "HEALTHY";
const units = {"current": "A", "power": "W", "temp": "F", "rpm": "RPM"};

socket.on("y_axes_config", (recv_config) => {
  y_axes_config = recv_config;
});

socket.on("graph_update", (update_data) => {
  if (update_data != null)  coordinates = update_data;
});

socket.on("updateAddons", (recv_addons) => {
  if (!(JSON.stringify(recv_addons) === JSON.stringify(local_addons))) local_addons = recv_addons;
});


function App() {
  const [coords, setCoords] = React.useState([]);
  const [addons, setAddons] = React.useState([]);
  const [selectedAddon, setSelectedAddon] = React.useState("");


  React.useEffect(() => {

    const timer = setInterval(() => {
      //console.log(coordinates);
      setAddons(local_addons);
      setCoords(coordinates);

    }, RENDER_PERIOD);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    if (!(selectedAddon in addons)){
      setSelectedAddon("");
    }
  }, [addons])

  const chooseAddon = React.useCallback((event) => {
    const addon = event.target.value
    socket.emit("addon_selection", addon);
    setSelectedAddon(addon);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <AddonDropdownMemo labels={addons} value={selectedAddon} onChangeHandler={chooseAddon}/>
        <br/>
        {selectedAddon !== "" &&
          <Box style={{ color: healthy ? 'green' : 'red' }}>{healthText}</Box>
        }
        {selectedAddon !== "" &&
          chart_types.map((type) => (
          <DynamicGraph
                key={type}
                title={type}
                data={coords[type]}
                yMin={y_axes_config[type].yMin}
                yMax={y_axes_config[type].yMax}
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
    /*
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <AddonDropdownMemo labels={addons} value={selectedAddon} onChangeHandler={chooseAddon}/>
        <br/>
        {selectedAddon !== "" &&
          <Box style={{ color: healthy ? 'green' : 'red' }}>{healthText}</Box>
        }
        {selectedAddon !== "" &&
          chart_types.map((type) => (
          <DynamicGraph
                title={type}
                data={coords[chart_types_index_map[type]]}
                yMin={config.yMin}
                yMax={config.yMax}
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
    */
  );
}

export default App;
