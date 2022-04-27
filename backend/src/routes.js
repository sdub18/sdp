const express = require('express');
const downsample = require('downsample');

const config = require('./config');
const State = require('./applicationState');
const crud = require('./services/crud');
const validatePhoneNumber = require('./utils/validatePhoneNumber');

const router = express.Router();

router.route("/policy")
    .post((req, res) => {
        policy = req.body;

        if (Object.values(policy).includes("")){
          res.status(400).send("Field must not be empty");
        }
        else if (isNaN(policy.threshold)){
          res.status(400).send("Threshold must be a number");
        }
        else{
          crud.insertNewPolicy(active_pid, policy);
          State['active_policies'] = crud.getPolicies(active_pid);
          M2F_socket.emit("updatePolicies", formatPolicies(active_policies));
          res.sendStatus(200);
        }
    })
    .delete((req, res) => {
        policy_id = req.body.id;
        crud.deletePolicy(active_pid, policy_id);
        State['active_policies'] = crud.getPolicies(active_pid);
        M2F_socket.emit("updatePolicies", formatPolicies(active_policies));
        res.sendStatus(200);
});

router.post("/addon", (req, res) => {
	pid = req.body.addon.toString();
	State['active_pid'] = pid;
	res.sendStatus(200);
});

router.post("/phone", (req, res) => {
	req_phone = req.body.phone;
	if (!validatePhoneNumber(req_phone)) {
	  res.status(400).send("Please enter valid phone number!");
	} 
	else {
		console.log(`Setting phone number for SMS alerts to ${req_phone}`)
		State['active_phone'] = req_phone;
		res.sendStatus(200);
	}
});

router.post("/chart_period", (req, res) => {
	period = req.body.period;
	
	downsampleFlag = config.dataTypes.every(dataType => {
	  cur_data = crud.getLastPeriodicData(active_pid, period, dataType);
	  if (cur_data === undefined) {
		return false;
		
	  } else {
		ds = downsample.LTD(cur_data, config.chartConfig.xMax);
  
		fill = config.chartConfig.xMax - ds.length;
  
		for (i=0; i<fill; i++) {
		  State.coordinates[active_pid][dataType][i].y = 0;
		}
		for (i=fill; i<config.chartConfig.xMax; i++){
		  State.coordinates[active_pid][dataType][i].y = ds[i-fill].y;
		}
		return true;
	  }
	});
  
	if (downsampleFlag) {
	  active_period = period;
	  res.sendStatus(200);
	} else {
	  res.sendStatus(400);
	}
});

router.get("/chart_periods", (req, res) => {
  	res.status(200).send(config.availableGraphPeriods);
});

router.get("/chart_config", (req, res) => {
  	res.status(200).send(config.chartConfig);
});

router.get("/data_types", (req, res) => {
	res.status(200).send(config.dataTypes);
}); 

router.get("/policy_modal", (req, res) => {
	let setup = {
		policyTypes: config.policyTypes, 
		periods: config.availablePolicyPeriods,
		comparisons: config.comparisons,
		dataTypes: config.dataTypes,
	};
	res.status(200).send(setup);
});

module.exports = router;