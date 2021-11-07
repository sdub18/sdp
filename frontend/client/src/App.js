import React from "react";
import logo from './logo.svg';
import './App.css';
import Graph from "./Graph";

function App() {
  const [data, setData] = React.useState({});
  const getPosts = async () => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData({"message": data.message, "xAxis": data.xAxis, "yAxis": data.yAxis}));
    console.log(data);
  }
  React.useEffect(()=>{
    getPosts()
    const interval=setInterval(()=>{
      getPosts()
     },1000)
     return()=>clearInterval(interval)
  },[])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {!data ? "Loading..." : data["message"]}
        </p>
        <p>
          {!data ? "Loading..." : data["xAxis"]}
        </p>
        <p>
          {!data ? "Loading..." : data["yAxis"]}
        </p>
      </header>
    </div>
  );
}

export default App;
