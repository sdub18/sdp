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

var addon_manager = [];

function App() {

  const [addons, setAddons] = React.useState([]);
  const [thing, setThing] = React.useState(0);

  React.useEffect(()=>{
    socket.on('data', (pkt) => {
      if (!addon_manager.some(e => e.port === pkt.port)){
        addon_manager.push({
          "port": pkt.port,
          "coords": tmp
        });
      }
      
      var addon_idx = addon_manager.findIndex(e => e.port === pkt.port);

      for (let i = 0; i < tmp.length - 1; i++) {
        addon_manager[addon_idx].coords[i] = addon_manager[addon_idx].coords[i+1];
        addon_manager[addon_idx].coords[i].x -= 1;
      }
      addon_manager[addon_idx].coords[tmp.length - 1] = {
        x: tmp.length - 1,
        y: pkt.data.current
      };

      setThing(pkt.data.current);
      setAddons(addon_manager);
    });
  }, []);
    
  
  addons.map((addon) => {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <DynamicGraph
            data={addon.coords}
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
  });
}

export default App;
