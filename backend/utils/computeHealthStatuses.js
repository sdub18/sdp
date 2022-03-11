const computeAverage = require('./computeAverage');
/*
coordinates: coordinates array being stored in program.
thresholds: Takes the format {current: <some number>, voltage: <some number>, power: <some number>}
*/
function computeHealthStatuses(coordinates, thresholds) {
  let output = {};
  const processes = Object.keys(coordinates);
  const attributes = Object.keys(thresholds);
  for (let i = 0; i < processes.length; i++) {
    const current_process = coordinates[processes[i]];
    let overall_dangerous = false;
    for (let j = 0; j < attributes.length; j++) {
        let current_dangerous = false;
      if (computeAverage(current_process[attributes[j]].map(point => point.y)) > thresholds[attributes[j]]) {
          current_dangerous = true;
          if (!overall_dangerous) {
            output[processes[i]] = "DANGEROUS (" + attributes[j] + ', ';
            overall_dangerous = true;
          } else {
              if (current_dangerous) {
                output[processes[i]] += attributes[j] + ', ';
              }
          }
      }
    }
    if (overall_dangerous) {
      output[processes[i]] = output[processes[i]].substring(0, output[processes[i]].length - 2);
      output[processes[i]] = output[processes[i]] + ')';
    } else {
      output[processes[i]] = "HEALTHY";
    }
  }
  return output;
}

module.exports = computeHealthStatuses;