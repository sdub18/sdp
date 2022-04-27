const State = require('./applicationState');
const crud = require('./services/crud');
const alerts = require('./services/alerts');

const computeHealthStatuses = require('./utils/computeHealthStatuses');
const formatHealthStatuses = require("./utils/formatHealthStatuses");
const getNewRuleViolations = require("./utils/getNewRuleViolations");
const formatOldRuleViolations = require("./utils/formatOldRuleViolations");
const createRuleViolationsString = require("./utils/createRuleViolationsString");

function M2F_connectionHandler (socket) {
	socket.on("disconnect", () => {
		console.log("we out");
		State[active_pid] = null;
		State[active_period] = 30;
		State[active_policies] = [];
	  });
	
	setInterval(() => {
		statuses = computeHealthStatuses(State['coordinates'], crud.getAllPolicies());
		let newRuleViolations = getNewRuleViolations(State['statuses'], previousRuleViolations);
		previousRuleViolations = formatOldRuleViolations(previousRuleViolations, newRuleViolations);
		let message = createRuleViolationsString(newRuleViolations);
		
		if (message.length > 0 && active_phone != null) {
			alerts.sendMessage(message, active_phone);
		}
		
		socket.emit("updateAddons", Object.keys(addons));
		socket.emit("updateStatuses", formatHealthStatuses(statuses));
	
		if (active_pid != null) {
			socket.emit("updateCoords", State['coordinates'][State['active_pid']]);
			socket.emit("updatePolicies", formatPolicies(crud.getPolicies(State['active_pid'])));
		}
	}, 100);
}

module.exports = M2F_connectionHandler;