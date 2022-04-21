function formatHealthStatuses(healthStatuses) {
    output = [];
    const moduleIds = healthStatuses.map(obj => obj.id);
    for (i = 0; i < moduleIds.length; i++) {
        let statusText;
        if (healthStatuses[i].status === "HEALTHY") {
            statusText = "HEALTHY";
        } else {
            statusText = "DANGEROUS ";
            let violatedPolicies = healthStatuses[i].violatedPolicies;
            if (violatedPolicies !== 0) {
                statusText += '(';
                for (j = 0; j < violatedPolicies.length; j++) {
                    statusText += "Policy " + violatedPolicies[j].toString() + ', ';
                }
                statusText = statusText.slice(0, -2);
                statusText += ')';
            }
        }
        output.push({id: moduleIds[i], status: statusText});
    }
    return output;
}
/*
const test = [
    { id: 4831, status: 'DANGEROUS', violatedPolicies: [ 1, 2 ] },
    { id: 4832, status: 'HEALTHY', violatedPolicies: [] }
]
console.log(formatHealthStatuses(test));
*/
module.exports = formatHealthStatuses;