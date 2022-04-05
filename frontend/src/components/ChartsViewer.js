import React from 'react';
import DynamicGraph from './DynamicGraph';

let config = {"xMax" : 300,         
  "xIncrement" : 100,
  "width" : 700,
  "height" : 400,
};
const units = {"current": "A", "power": "W", "temp": "F", "rpm": "RPM"};


export default function ChartsViewer(props) {
	return (
		<React.Fragment>
			{props.chart_types.map((type) => (
				<DynamicGraph
					key={type}
					title={type}
					data={props.coords[type]}
					yAxisLabel={type + " (" + units[type] + ")"}
					xMax={config.xMax}
					xIncrement={config.xIncrement}
					width={config.width}
					height={config.height}>
				</DynamicGraph>
		  	))}
		</React.Fragment>
	);
}