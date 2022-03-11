/*
This is the first thing that runs in the entire project infrastructure. It begins by asking the frontend for the parameters that are
being used in the graphs, so the backend can store/modify data correctly and send it to the frontend. Once the response has been
received, the JSON coordinated object is populated based on the info contained within the response.
*/
function createEmptyGraph(chart_types, config, thresholds) {
	labels_coords_dict = {};
	  for (let i = 0; i < chart_types.length; i++) {
		labels_coords_dict[chart_types[i]] = [];
		for (let j = 0; j < config.xMax; j++) {
		  labels_coords_dict[chart_types[i]].push({x: j, y: 0/*, threshold: thresholds[chart_types[i]]*/});
		}
	  }
	return labels_coords_dict;
}

module.exports = createEmptyGraph;
