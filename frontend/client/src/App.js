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
const chart_types = ["current", "temp_ambient", "temp_casing"];   // all chart types --> HARDCODED AND KEPT IN FRONTEND; NOT STORED IN BACKEND
const coordinates = [];               // frontend local copy of coordinates, used to set "coords" state variable
const config = {"xMax" : 100,         // chart config --> consider moving to backend so we can keep multiple different copies depending on chart type
                "xIncrement" : 100,
                "yMin" : 50,
                "yMax" : 130,
                "width" : 700,
                "height" : 400};

var healthy = true;
var healthText = "HEALTHY";
var thresholds = {"current": 99, "temp_ambient": 62, "temp_casing": 82, "defaultThreshold": null};
var currentThreshold = null;
for (let i = 0; i < config.xMax; i++) {  // instantiate coordinates in array
  coordinates.push({x: i, y: 0, threshold: thresholds.defaultThreshold});
}

// update coordinates upon receiving new data point from backend, shift y coordinates back by 1 position
socket.on('data', (data_pt) => {
  for (let i = 0; i < coordinates.length-1; i++) {
    coordinates[i].y = coordinates[i+1].y;
    coordinates[i].threshold = coordinates[i+1].threshold;
  }
  coordinates[coordinates.length-1].y = data_pt;
  coordinates[coordinates.length-1].threshold = thresholds[currentThreshold];
});

// update local copy of list of addon ids upon receiving different list than current local copy
socket.on("updateAddons", (recv_addons) => {
  if (!(JSON.stringify(recv_addons) === JSON.stringify(local_addons)))
    local_addons = recv_addons; 
});

// Function to compute the average of an array. Meant to be used with the y values of the different graphs
function average(array) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  return sum / array.length;
}

function App() {
  const [chartType, setChartType] = React.useState("");  
  const [thing, setThing] = React.useState(0);
  const [coords, setCoords] = React.useState([]);
  const [addons, setAddons] = React.useState([]);
  const [selectedAddon, setSelectedAddon] = React.useState("");


  React.useEffect(() => {
    // update coords and addons state variable every rerender period to avoid lag
    const timer = setInterval(() => {
      if (local_addons.toString() !== addons) setAddons(local_addons);
      setThing(coordinates[coordinates.length-1].y);
      setCoords(coordinates);
      if (average(coordinates.map(element => element.y)) > thresholds[currentThreshold]) {
        healthy = false;
        healthText = "DANGER";
      } else {
        healthy = true;
        healthText = "HEALTHY"
      }
    }, RENDER_PERIOD);
    return () => clearInterval(timer);
  }, []);
  
  const chooseChartType = React.useCallback((event) => {
    const type = event.target.value;
    socket.emit("chart_type_selection", type);
	  setChartType(type);
    currentThreshold = type;
  }, []);

  const chooseAddon = React.useCallback((event) => {
    const addon = event.target.value
    socket.emit("addon_selection", addon);
    for (let i = 0; i < config.xMax; i++) 
      coordinates[i].y = 0;
    setSelectedAddon(addon);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <AddonDropdownMemo labels={addons} value={selectedAddon} onChangeHandler={chooseAddon}/>
        <br/>
        <ChartButtonsMemo labels={chart_types} onChangeHandler={chooseChartType}/>
        <Box style={{ color: healthy ? 'green' : 'red' }}>{healthText}</Box>
        {chartType !== "" && selectedAddon !== "" &&
          <DynamicGraph
                title={chartType}
                data={coords}
                yMin={config.yMin}
                yMax={config.yMax}
                xMax={config.xMax}
                xIncrement={config.xIncrement}
                width={config.width}
                height={config.height}>
            </DynamicGraph>
        }
      </header>
    </div>
  );
}

export default App;
