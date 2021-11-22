import React from "react";
import logo from './logo.svg';
import './App.css';
import DynamicGraph from "./DynamicGraph";
import io from 'socket.io-client';
import ChartButtons from "./ChartButtons";
import AddonDropdown from "./AddonDropdown";



const xMax = 100; // keep this number an even number * 100
const xIncrement = 100;
const yMin = 0;
const yMax = 200;
const width = 700;
const height = 400;

// instantiate "client (frontend)" websocket"
const socket = io('http://localhost:3001');

// instanstiate tmp array
let tmp = [];
for (let i = 0; i < xMax; i++) {
  tmp.push({
    x: i,
    y: 0
  });
}

// manages the type of charts to keep track of (should be constant since we keep track of limited number of sensor data types)
var charts_manager = [{"type": "current", 
                        "coords": tmp.slice(0)},
                        {"type": "temp_ambient", 
                        "coords": tmp.slice(0)},
                        {"type": "temp_casing", 
                        "coords": tmp.slice(0)}
                      ];

var chart_types = charts_manager.map(chart => chart.type);

function App() {

  const [charts, setCharts] = React.useState([]);
  const [chartDrop, setChartDrop] = React.useState("");
  const [thing, setThing] = React.useState(0);
  const [displayedChart, setDisplayedChart] = React.useState({});

  React.useEffect(()=>{
    socket.on('data', (pkt) => {
      charts_manager.forEach((chart) => {
        for (let i = 0; i < tmp.length-1; i++){
          chart.coords[i] = chart.coords[i+1]
          chart.coords[i].x -= 1;
        }
        chart.coords[tmp.length - 1] = {
            x: tmp.length-1,
            y: pkt.data[chart.type]  
        }
      })
      setThing(pkt.data.current);
      setCharts(charts_manager);
    });
  }, []);
  
  const chooseChart = (event) => {
    let type = event.target.value;
    socket.emit("chart_type_selection", type);
	  setChartDrop(type);
    let chart = charts.find(chart => chart.type == type);
    setDisplayedChart(chart);
  }

  // const [addonDrop, setAddonDrop] = React.useState("");
  // const chooseAddon = (event) => {
  // 	let addon = event.target.value	
  // 	setAddonDrop(addon)
  // 	setChartDrop("")
  // 	need to have someway to hold all addons with their respective chart managers and to select correct addon
  // }
  // <AddonDropdown labels={addon_ids} value={addonDrop} onChangeHandler={chooseAddon}/>
  // Dropdown should be used to select which addon to watch over
  // 

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

		<br/>
		<ChartButtons labels={chart_types} onChangeHandler={chooseChart}/>
        <DynamicGraph
            title={displayedChart.type}
            data={displayedChart.coords}
            yMin={yMin}
            yMax={yMax}
            xMax={xMax}
            xIncrement={xIncrement}
            width={width}
            height={height}>
          </DynamicGraph>
      </header>
    </div>
  );
}

export default App;
