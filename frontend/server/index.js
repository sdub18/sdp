function getRandomIntInRange(min, max) {
  return Math.floor(min + (Math.random() * (max - min)));
}

const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

let i = 0;
let x = [];
let y = [];
app.get("/api", (req, res) => {
    let rand = getRandomIntInRange(25, 175);
    res.json({ message: "Random number: " + rand, xAxis: x, yAxis: rand});
  });
  
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});