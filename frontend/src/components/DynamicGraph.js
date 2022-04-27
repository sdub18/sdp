import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Label
} from "recharts";
import { Box, makeStyles } from "@material-ui/core";

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
    <React.Fragment>
        <h2>{props.title.toUpperCase()}</h2>
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
            //tick={{fontSize: 15}}
            //ticks={ticks}
            tick={false}
        />
        <YAxis
            type="number"
            tick={{fontSize: 15}}
            domain={["auto", "auto"]}
        >
            <Label
                value={props.yAxisLabel}
                position="insideTopLeft"
                angle={-90}
                dy={230}
                fill="white"
            />
        </YAxis>
        <Line
            name={props.title}
            type="linear"
            dataKey="y"
            stroke="#8884d8"
            dot={false}
        />
        {/*<Line
             name={props.threshold}
             type="linear"
             dataKey="threshold"
             stroke="#1884d8"
             dot={false}
    />*/}
        </LineChart>
    </React.Fragment>
  );
}