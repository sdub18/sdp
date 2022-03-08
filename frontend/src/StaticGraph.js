import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label
} from "recharts";
import { makeStyles } from '@material-ui/core/styles'
import Box from '@mui/material/Box';

const useStyles = makeStyles(theme => ({
    containter: {
        backgroundColor: "#000000"
    },
    marginAutoItem: {
      display: "inline",
      textAlign: "center"
    },
    graph: {
        margin: "auto"
    }
  }))

const test = []
const testTicks = []
for (let i = 0; i < 401; i++) {
    let x = 20 * (i/400);
    test.push(
        {
            x: 20 * (i/400),
            y: Math.pow(x, 2),
            z: 20*x
        }
    )
    if (i % 4 == 0) {
        testTicks.push(i);
    }
}

export default function StaticGraph() {
    const classes = useStyles()
  return (
    <Box
        className={classes.marginAutoItem}
        position="relative"
    >
        <h1 display="inline" textAlign="center">Intersection of two functions</h1>
        <LineChart
        className={classes.graph}
        width={500}
        height={400}
        data={test}
        margin={{
            top: 10
        }}
        >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
            label="X Axis"
            dataKey="x"
            ticks={testTicks}
        />
        <YAxis>
            <Label
                value="Y Axis"
                position="insideTopLeft"
                offset={10}
            />
        </YAxis>
        {/*<Tooltip />*/}
        <Legend />
        <Line
            name="y = x^2"
            type="linear"
            dataKey="y"
            stroke="#8884d8"
            dot={false}
        />
        <Line
            name="z = 20x"
            type="linear"
            dataKey="z"
            stroke="#82ca9d"
            dot={false}
        />
        </LineChart>
    </Box>
  );
}