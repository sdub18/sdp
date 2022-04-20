const computeAverage = require('./computeAverage');
/*
coordinates: Coordinates array being stored in the program.
policies: Array of all policy objects stored in the program.
*/

function computeHealthStatuses(coordinates, policies) {
  let outputTemplate = {}
  let dangerousDataTypesById = {}
  let output = [];
  let allIds = Object.keys(coordinates);
  for (i = 0; i < policies.length; i++) {
    let moduleID = policies[i].moduleID.toString();
    let dataType = policies[i].dataType;
    let threshold = policies[i].threshold;
    let subsetOfCoords = coordinates[moduleID][dataType];
    let operand;
    if (dangerousDataTypesById[moduleID] == undefined) {
      dangerousDataTypesById[moduleID] = [];
    }
    if (policies[i].policyType == "average") {
      operand = computeAverage(subsetOfCoords.map(coord => coord.y));
    }
    if (policies[i].policyType == "simple") {
      operand = subsetOfCoords[subsetOfCoords.length - 1].y;
    }
    if (policies[i].comparison == '>') {
      if (operand > threshold) {
        if (outputTemplate[moduleID] == undefined) {
          outputTemplate[moduleID] = "DANGEROUS (";
        }
        if (!dangerousDataTypesById[moduleID].includes(dataType)) {
          outputTemplate[moduleID] += dataType + ', ';
        }
        dangerousDataTypesById[moduleID].push(dataType);
      } else {
        if (outputTemplate[moduleID] == undefined) {
          outputTemplate[moduleID] = "HEALTHY";
        }
      }
    }
    if (policies[i].comparison == '<') {
      if (operand < threshold) {
        if (outputTemplate[moduleID] == undefined) {
          outputTemplate[moduleID] = "DANGEROUS (";
        }
        if (!dangerousDataTypesById[moduleID].includes(dataType)) {
          outputTemplate[moduleID] += dataType + ', ';
        }
        dangerousDataTypesById[moduleID].push(dataType);
      } else {
        if (outputTemplate[moduleID] == undefined) {
          outputTemplate[moduleID] = "HEALTHY";
        }
      }
    }
  }
  let policyModuleIds = Object.keys(outputTemplate);
  let leftoverIds = allIds.filter(id => !policyModuleIds.includes(id))
  for (i = 0; i < policyModuleIds.length; i++) {
    if (outputTemplate[policyModuleIds[i]].startsWith("DANGEROUS")) {
      outputTemplate[policyModuleIds[i]] = outputTemplate[policyModuleIds[i]].slice(0, -2)
      outputTemplate[policyModuleIds[i]] += ')';
    }
  }
  let objectToPush;
  for (i = 0; i < policyModuleIds.length; i++) {
    objectToPush = {};
    objectToPush["id"] = policyModuleIds[i];
      objectToPush["status"] = outputTemplate[policyModuleIds[i]];
    output.push(objectToPush);
  }
  for (i = 0; i < leftoverIds.length; i++) {
    objectToPush = {};
    objectToPush["id"] = leftoverIds[i];
    objectToPush["status"] = "HEALTHY";
    output.push(objectToPush);
  }
  return output;
}

// Uncomment and edit below for testing.
/*
const policies = [
  {
    moduleID: 4831,
    policyID: 1,
    policyType: 'average',
    dataType: 'current',
    period: '1 min',
    comparison: '>',
    threshold: 50
  }
];

const coordinates = {
  '4831': {
    current: [
      { x: 0, y: 56 },  { x: 1, y: 50 },  { x: 2, y: 58 },  { x: 3, y: 62 }
    ],
    power: [
      { x: 0, y: 56 },  { x: 1, y: 50 },  { x: 2, y: 58 },  { x: 3, y: 20 }
    ],
    temp: [
      { x: 0, y: 56 },  { x: 1, y: 50 },  { x: 2, y: 58 },  { x: 3, y: 30 }
    ]
  }
}

console.log(computeHealthStatuses(coordinates, policies));
*/

module.exports = computeHealthStatuses;