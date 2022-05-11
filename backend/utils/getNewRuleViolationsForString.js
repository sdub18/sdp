function getNewRuleViolationsForString(healthStatuses, newViolatedPoliciesByOrderEntered) {
    output = {};
    ids = healthStatuses.map(item => item.id);
    for (let i = 0; i < ids.length; i++) {
        let currentId = ids[i];
        let newViolatedPoliciesByIdOnScreen = newViolatedPoliciesByOrderEntered[currentId].map(policy => healthStatuses[i].violatedPoliciesByIdOnScreen[healthStatuses[i].violatedPoliciesByOrderEntered.indexOf(policy)]);
        output[currentId] = newViolatedPoliciesByIdOnScreen;
    }
    return output;
}

module.exports = getNewRuleViolationsForString;