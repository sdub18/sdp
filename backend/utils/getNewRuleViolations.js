function getNewRuleViolations(healthStatuses, previousRuleViolations) {
    output = {};
    ids = healthStatuses.map(item => item.id);
    for (let i = 0; i < ids.length; i++) {
        let currentId = ids[i];
        let violatedPoliciesForId = previousRuleViolations[currentId];
        if (violatedPoliciesForId === undefined) {
            output[currentId] = [];
            previousRuleViolations[currentId] = [];
            continue;
        }
        let newViolatedPoliciesByOrderEntered = healthStatuses[i].violatedPoliciesByOrderEntered.filter(rule => !violatedPoliciesForId.includes(rule));
        output[currentId] = newViolatedPoliciesByOrderEntered;
    }
    return output;
}

/*
const statuses = [
  { id: '4831', status: 'DANGEROUS', violatedPolicies: [ 2, 3 ] },
  { id: '4832', status: 'DANGEROUS', violatedPolicies: [ 1, 2, 3 ] },
  { id: '4833', status: 'HEALTHY', violatedPolicies: [] }
]
const previousRuleViolations = {'4831': [2], '4832': [1, 3]};
console.log(getNewRuleViolations(statuses, previousRuleViolations));
*/

module.exports = getNewRuleViolations;