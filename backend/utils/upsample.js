function upsample(data, target_resolution) {
	num_missing = target_resolution - data.length;

	res = [...data];

	while (res.length < target_resolution) {
		let step = Math.ceil(data.length/(target_resolution-data.length));
		let indicies = [];
		for (i=0; i<res.length; i+= step){
			indicies.push(i);
		}

		let extra = 0;

		indicies.forEach(index => {
			res.splice(index+extra, 0, res[index+extra]);
			extra+=1;
		});
	}
	return res;

}

module.exports = upsample;