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

export default function DynamicGraph(props) {
    const classes = useStyles();
    let ticks = [];
    for (let i = 0; i < props.xMax + props.xIncrement; i += props.xIncrement) {
        ticks.push(i);
    }
  return (
    <Box
        className={classes.marginAutoItem}
        position="relative"
    >
        <LineChart
        className={classes.graph}
        width={props.width}
        height={props.height}
        data={props.data}
        margin={{
            top: 10
        }}
        >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
            dataKey="x"
            type="number"
            tick={{fontSize: 15}}
            ticks={ticks}
        />
        <YAxis
            type="number"
            tick={{fontSize: 15}}
            domain={[props.yMin, props.yMax]}
        >
            <Label
                value={props.yAxisLabel}
                position="insideTopLeft"
                angle={-90}
                dy={230}
                fill="white"
            />
        </YAxis>
        {/*<Tooltip />*/}
        <Legend />
        <Line
            name={props.title}
            type="linear"
            dataKey="y"
            stroke="#8884d8"
            dot={false}
        />
        <Line
            name={props.threshold}
            type="linear"
            dataKey="threshold"
            stroke="#1884d8"
            dot={false}
        />
        </LineChart>
    </Box>
  );
}