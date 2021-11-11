import React from "react";
import logo from './logo.svg';
import './App.css';
import DynamicGraph from "./DynamicGraph";

const xMax = 1000; // keep this number an even number * 100
const xIncrement = 100;
const yMin = 0;
const yMax = 200;
const width = 700;
const height = 400;

const axios = require('axios').default;
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

  const getPosts = async () => {
    axios.get("/api")
      .then(function (response) {
        for (let i = 0; i < coordinates.length - 1; i++) {
          coordinates[i] = coordinates[i+1];
          coordinates[i].x -= 1;
        }
        coordinates[coordinates.length - 1] = {
          x: coordinates.length - 1,
          y: response.data.yAxis
        };
        setThing(response.data.yAxis); // not sure why, but this line is needed for the live graph
        setDisplayedCoords(coordinates);
      });
  }

  React.useEffect(()=>{
    getPosts()
    const interval=setInterval(()=>{
      getPosts()
     },2)
     return()=>clearInterval(interval)
  },[])
  
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
