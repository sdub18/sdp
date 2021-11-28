import React from "react";
import logo from './logo.svg';
import './App.css';
import DynamicGraph from "./DynamicGraph";
import io from 'socket.io-client';
import ChartButtons from "./ChartButtons";
import AddonDropdown from "./AddonDropdown";

const ChartButtonsMemo = React.memo(ChartButtons);
const AddonDropdownMemo = React.memo(AddonDropdown);

const config = {"xMax" : 100, 
                "xIncrement" : 100,
                "yMin" : 0,
                "yMax" : 200,
                "width" : 700,
                "height" : 400};

// instantiate "client (frontend)" websocket connected to M2F server on port 3001"
const socket = io('http://localhost:3001');

// instanstiate coordinates array
const coordinates = [];
for (let i = 0; i < config.xMax; i++) coordinates.push({x: i, y: 0})

// update coordinates array with incoming data_pt
socket.on('data', (data_pt) => {
  for (let i = 0; i < coordinates.length-1; i++) coordinates[i].y = coordinates[i+1].y;
  coordinates[coordinates.length-1].y = data_pt;
});

const chart_types = ["current", "temp_ambient", "temp_casing"];

function App() {
  const [chartType, setChartType] = React.useState("");
  const [thing, setThing] = React.useState(0);
  const [coords, setCoords] = React.useState([]);
  const [addons, setAddons] = React.useState([]);
  const [selectedAddon, setSelectedAddon] = React.useState("");

  // update dropdown options with addons state
  socket.on("updateAddons", (updatedAddons) => {setAddons(updatedAddons)});

  React.useEffect(()=>{
    const timer = setInterval(() => {
      setThing(coordinates[coordinates.length-1].y);
      setCoords(coordinates);
    }, 500);
    return () => clearInterval(timer);
  }, []);
  
  const chooseChartType = React.useCallback((event) => {
    const type = event.target.value;
    socket.emit("chart_type_selection", type);
	  setChartType(type);
  }, []);

  const chooseAddon = React.useCallback((event) => {
    const addon = event.target.value
    socket.emit("addon_selection", addon);
    // reset coordinates when new addon selected
    for (let i = 0; i < config.xMax; i++) coordinates[i].y = 0;
    setSelectedAddon(addon);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <AddonDropdownMemo labels={addons} value={selectedAddon} onChangeHandler={chooseAddon}/>
        <br/>
        <ChartButtonsMemo labels={chart_types} onChangeHandler={chooseChartType}/>
        {chartType !== "" &&
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
