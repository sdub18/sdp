const db = require('../db');

function insertData(pkt) {
	const data = pkt['data'];

	const timestamp = Date.now();
	const id = pkt['id'];
	const current = data['current'];
	const voltage = data['voltage'];
	const power = data['power'];
	const temp = data['temp'];
	const a = data['acceleration'];

	const sqlCmd = 'INSERT INTO data VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
	
	db.insert(sqlCmd, [timestamp, id, current, voltage, power, temp, a['x'], a['y'], a['z']]);
};

function insertMany(pkt_buffer) {
	const insert_transaction = db.create_transaction((pkt_list) => {
		pkt_list.forEach(pkt => {
			insertData(pkt);
		});
	})

	return insert_transaction(pkt_buffer);
}

function getAccelData(type, low, high){
	try {
		const sqlCmd = `SELECT ${type} FROM data WHERE timestamp BETWEEN ? AND ? ORDER BY timestamp DESC LIMIT 512`;
		return db.query(sqlCmd, [low, high]);
			

	} catch (error) {
		console.log(error.message);
	}
}

function getPolicies(active_module) {
	const sqlCmd = `SELECT * FROM policy WHERE moduleID=?`;
	return db.query(sqlCmd, [active_module]);
}

function getAllPolicies() {
	const sqlCmd = "SELECT * FROM policy";
	return db.query(sqlCmd, []);
}

function insertNewPolicy(active_module, policy) {
	console.log(active_module);
	console.log(active_module.toString());
	let highest_id = db.query('SELECT MAX(policyID) FROM policy WHERE moduleID=?', [active_module])[0]["MAX(policyID)"];
	console.log(highest_id);

	(highest_id == null) ? new_id = 1 : new_id = highest_id+1; 

	const sqlCmd = `INSERT INTO policy VALUES (?, ?, ?, ?, ?, ?, ?)`;
	db.insert(sqlCmd, [active_module, new_id, policy.policyType, policy.dataType, policy.period, policy.comparison, policy.threshold]);
}

function deletePolicy(active_module, id) {
	const sqlCmd = `DELETE FROM policy WHERE moduleID=? AND policyID=?`;
	db.del(sqlCmd, [active_module, id])
}

function deleteAllPoliciesForModule(active_module) {
	const sqlCmd = `DELETE FROM policy WHERE moduleID=?`;
	db.del(sqlCmd, [active_module])
}

module.exports = { insertData, insertMany, insertNewPolicy, getAccelData, getPolicies, getAllPolicies, deletePolicy, deleteAllPoliciesForModule };