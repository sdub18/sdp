function createRuleViolationsString(ruleViolations) {
    let output = "";
    let ids = Object.keys(ruleViolations);
    for (let i = 0; i < ids.length; i++) {
        let currentId = ids[i];
        if (ruleViolations[currentId].length === 1) {
            output += "Violation of sensing module ID " + currentId + ", rule " + ruleViolations[currentId][0] + ".\n";
        }
        if (ruleViolations[currentId].length > 1) {
            output += "Violation of sensing module ID " + currentId + ", policies "
            for (let j = 0; j < ruleViolations[currentId].length; j++) {
                output += ruleViolations[currentId][j] + ", ";
            }
            output = output.slice(0, -2);
            output += ".\n";
        }
    }
    if (output.length > 0) {
        output = output.slice(0, -1);
    }
    return output;
}

/*
const ruleViolations = { '4831': [ 1, 2, 3, 5 ], '4832': [ 2, 4 ], '4833': [ 1 ] };
console.log(createRuleViolationsString(ruleViolations));
*/
module.exports = createRuleViolationsString;