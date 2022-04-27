/**
 * 
 * @param {int} period - graph period in seconds
 * @param {int} xMax - num ticks on x-axis
 * @returns sampling rate to add to coordinates array
 */
function getSampleRate(period, xMax) {
	return period/xMax * 1000;
}

module.exports = getSampleRate;