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
                        {"type": "ambient temp", 
                        "coords": tmp.slice(0)}];
var current = tmp.slice(0);
var temp_ambient = tmp.slice(0);

function App() {

  const [charts, setCharts] = React.useState([]);
  const [thing, setThing] = React.useState(0);

  React.useEffect(()=>{
    socket.on('data', (pkt) => {
      for (let j = 0 ; j < charts_manager.length; j++){
        for (let i = 0; i < tmp.length - 1; i++) {
          charts_manager[j].coords[i] = charts_manager[j].coords[i+1];
          charts_manager[j].coords[i].x -= 1;
        }
        if (j==0){
          charts_manager[j].coords[tmp.length - 1] = {
            x: tmp.length - 1,
            y: pkt.data.current
          };
        }
        else{
          charts_manager[j].coords[tmp.length - 1] = {
            x: tmp.length - 1,
            y: pkt.data.temp_ambient
          };
        }
        

      }      
      

      setThing(pkt.data.current);
      setCharts(charts_manager);
    });
  }, []);
    
  let graphs = charts.map((chart, index) => {
    return (  
      <DynamicGraph
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
