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

// instanstiate coordinates array
let coordinates = [];
for (let i = 0; i < xMax; i++) {
  coordinates.push({
    x: i,
    y: 50
  });
}


function App() {

  const [displayedCoords, setDisplayedCoords] = React.useState([]);
  const [thing, setThing] = React.useState(0);

  React.useEffect(()=>{
    socket.on('data', (data_pt) => {
      console.log("hi");
      //console.log(data_pt.data.current)
      for (let i = 0; i < coordinates.length - 1; i++) {
        coordinates[i] = coordinates[i+1];
        coordinates[i].x -= 1;
      }
      coordinates[coordinates.length - 1] = {
        x: coordinates.length - 1,
        y: data_pt.data.current
      };
      setThing(data_pt.data.current);
      setDisplayedCoords(coordinates);
    });
  }, []);
    
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <DynamicGraph
          data={displayedCoords}
          yMin={yMin}
          yMax={yMax}
          xMax={xMax}
          xIncrement={xIncrement}
          width={width}
          height={height}
        ></DynamicGraph>
      </header>
    </div>
  );
}

export default App;
