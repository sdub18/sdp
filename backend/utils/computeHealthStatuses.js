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
    let moduleId = policies[i].moduleId.toString();
    let dataType = policies[i].dataType;
    let threshold = policies[i].threshold;
    let subsetOfCoords = coordinates[moduleId][dataType];
    let operand;
    if (dangerousDataTypesById[moduleId] == undefined) {
      dangerousDataTypesById[moduleId] = [];
    }
    if (policies[i].policyType == "average") {
      operand = computeAverage(subsetOfCoords.map(coord => coord.y));
    }
    if (policies[i].policyType == "simple") {
      operand = subsetOfCoords[subsetOfCoords.length - 1].y;
    }
    if (policies[i].comparison == '>') {
      if (operand > threshold) {
        if (outputTemplate[moduleId] == undefined) {
          outputTemplate[moduleId] = "DANGEROUS (";
        }
        if (!dangerousDataTypesById[moduleId].includes(dataType)) {
          outputTemplate[moduleId] += dataType + ', ';
        }
        dangerousDataTypesById[moduleId].push(dataType);
      } else {
        if (outputTemplate[moduleId] == undefined) {
          outputTemplate[moduleId] = "HEALTHY";
        }
      }
    }
    if (policies[i].comparison == '<') {
      if (operand < threshold) {
        if (outputTemplate[moduleId] == undefined) {
          outputTemplate[moduleId] = "DANGEROUS (";
        }
        if (!dangerousDataTypesById[moduleId].includes(dataType)) {
          outputTemplate[moduleId] += dataType + ', ';
        }
        dangerousDataTypesById[moduleId].push(dataType);
      } else {
        if (outputTemplate[moduleId] == undefined) {
          outputTemplate[moduleId] = "HEALTHY";
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
    moduleId: 4831,
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