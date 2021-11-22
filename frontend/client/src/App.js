import React from "react";
import logo from './logo.svg';
import './App.css';
import DynamicGraph from "./DynamicGraph";
import io from 'socket.io-client';

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

var charts_manager = [{"type": "current", 
                        "coords": tmp.slice(0)},
                        {"type": "temp_ambient", 
                        "coords": tmp.slice(0)},
                        {"type": "temp_casing", 
                        "coords": tmp.slice(0)}
                      ];
var current = tmp.slice(0);
var temp_ambient = tmp.slice(0);

function App() {

  const [charts, setCharts] = React.useState([]);
  const [thing, setThing] = React.useState(0);

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
    
  let graphs = charts.map((chart, index) => {
    return (  
      <DynamicGraph
            key = {index}
            title={chart.type}
            data={chart.coords}
            yMin={yMin}
            yMax={yMax}
            xMax={xMax}
            xIncrement={xIncrement}
            width={width}
            height={height}
      ></DynamicGraph>
    )
  })
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <ul>{graphs}</ul>
      </header>
    </div>
  );
}

export default App;
