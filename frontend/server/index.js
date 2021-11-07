const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

let i = 0;
let x = [];
let y = [];
app.get("/api", (req, res) => {
    i += 1;
    x.push(i);
    y.push(i * i)
    res.json({ message: "Hello from server! Counting up... " + i, xAxis: ""+x, yAxis: ""+y});
  });
  
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});