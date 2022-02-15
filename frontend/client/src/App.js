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
const chart_types = ["current", "power", "temperature", "rpm"];   // all chart types --> HARDCODED AND KEPT IN FRONTEND; NOT STORED IN BACKEND
const chart_types_index_map = {"current": 0, "power": 1, "temperature": 2, "rpm": 3}
const coordinates = [];               // frontend local copy of coordinates, used to set "coords" state variable
const config = {"xMax" : 300,         // chart config --> consider moving to backend so we can keep multiple different copies depending on chart type
                "xIncrement" : 100,
                "yMin" : 0,
                "yMax" : 130,
                "width" : 700,
                "height" : 400};

var healthy = true;
var healthText = "HEALTHY";
const thresholds = {"current": 100, "power": 60, "temperature": 82, "rpm": 40};
const units = {"current": "A", "power": "W", "temperature": "F", "rpm": "RPM"};
var currentThreshold = "current";
for (let i = 0; i < chart_types.length; i++) {
  coordinates.push([]);
  for (let j = 0; j < config.xMax; j++) {  // instantiate coordinates in array
    coordinates[i].push({x: j, y: 0, threshold: thresholds.current});
  }
}

// update coordinates upon receiving new data point from backend, shift y coordinates back by 1 position
socket.on('data', (data_pt) => {
    console.log(data_pt);
   for (let i = 0; i < chart_types.length; i++) {
    for (let j = 0; j < coordinates[i].length-1; j++) {
      coordinates[i][j].y = coordinates[i][j+1].y;
      coordinates[i][j].threshold = coordinates[i][j+1].threshold;
    }
    coordinates[i][coordinates[i].length-1].y = data_pt[0].data[chart_types[i]];
    coordinates[i][coordinates[i].length-1].threshold = thresholds[chart_types[i]];
   }
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
  const [coords, setCoords] = React.useState([]);
  const [addons, setAddons] = React.useState([]);
  const [selectedAddon, setSelectedAddon] = React.useState("");


  React.useEffect(() => {
    // update coords and addons state variable every rerender period to avoid lag
    const timer = setInterval(() => {
      if (local_addons.toString() !== addons) setAddons(local_addons);
      setCoords([...coordinates]);
      healthy = true;
      healthText = "HEALTHY"
      for (let i = 0; i < coordinates.length; i++) {
        if (average(coordinates[i].map(element => element.y)) > thresholds[chart_types[i]]) {
          healthy = false;
          healthText = "DANGER";
        }
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
    for (let i = 0; i < chart_types.length; i++) {
      for (let j = 0; j < config.xMax; j++) {
        coordinates[i][j].y = 0;
      }
    }
    setSelectedAddon(addon);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <AddonDropdownMemo labels={addons} value={selectedAddon} onChangeHandler={chooseAddon}/>
        <br/>
        {/*<ChartButtonsMemo labels={chart_types} onChangeHandler={chooseChartType}/>*/}
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
  );
}

export default App;
