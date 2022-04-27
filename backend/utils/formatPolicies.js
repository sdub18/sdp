function formatPolicies(active_policies) {
	formatted_policies = [...active_policies];
	formatted_policies.forEach((policy) => {
		policy["description"] = `${policy.dataType} ${policy.comparison} ${policy.dataType === "current" || policy.dataType === "power" ? policy.threshold / 1000 : policy.threshold}`;
		policy["id"] = policy["policyID"];
		delete policy.policyID;
		delete policy.moduleID;
		delete policy.comparison;
		delete policy.threshold;
	});
	return formatted_policies;
}

module.exports = formatPolicies;
