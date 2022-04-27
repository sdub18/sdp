function formatOldRuleViolations(previousRuleViolations, newRuleViolations) {
    let output = previousRuleViolations;
    let ids = Object.keys(previousRuleViolations);
    for (let i = 0; i < ids.length; i++) {
        let currentId = ids[i]
        output[ids[i]] = previousRuleViolations[currentId].concat(newRuleViolations[currentId]);
    }
    return output;
}

/*
const newRuleViolations = { '4831': [ 5 ], '4832': [ 4 ], '4833': [] }
const previousRuleViolations = { '4831': [ 1, 2, 3 ], '4832': [ 2 ], '4833': [ 1 ] }
console.log(formatOldRuleViolations(previousRuleViolations, newRuleViolations));
*/
module.exports = formatOldRuleViolations;