import React from 'react';
import DynamicGraph from './DynamicGraph';

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
					xMax={props.config.xMax}
					xIncrement={props.config.xIncrement}
					width={props.config.width}
					height={props.config.height}>
				</DynamicGraph>
		  	))}
		</React.Fragment>
	);
}