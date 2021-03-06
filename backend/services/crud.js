const db = require('../db');

function insertData(pkt) {
	const data = pkt['data'];

	const timestamp = pkt["timestamp"];
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

function getLastPeriodicData(moduleID, period, dataType) {
	try {
		periodMillis = period*1000;

		low = Date.now() - periodMillis;
		high = Date.now();
	
		const sqlCmd = `SELECT row_number() OVER() as x, ${dataType} as y FROM data WHERE moduleID=? AND timestamp BETWEEN ? AND ?`;
		return db.query(sqlCmd,[moduleID, low, high]);

	} catch (err){
		console.log(err);
		return;
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
	const highest_id = db.query('SELECT MAX(policyID) FROM policy WHERE moduleID=?', [parseInt(active_module)])[0]['MAX(policyID)'];

	(highest_id == null) ? new_id = 1 : new_id = highest_id+1; 

	const sqlCmd = `INSERT INTO policy VALUES (?, ?, ?, ?, ?, ?, ?)`;
	db.insert(sqlCmd, [active_module, new_id, policy.policyType, policy.dataType, policy.comparison, policy.threshold, policy.orderEntered]);
}

function deletePolicy(active_module, id) {
	const sqlCmd = `DELETE FROM policy WHERE moduleID=? AND policyID=?`;
	db.del(sqlCmd, [active_module, id])
}

function deleteAllPoliciesForModule(active_module) {
	const sqlCmd = `DELETE FROM policy WHERE moduleID=?`;
	db.del(sqlCmd, [active_module])
}

module.exports = { insertData, insertMany, insertNewPolicy, getLastPeriodicData, getAccelData, getPolicies, getAllPolicies, deletePolicy, deleteAllPoliciesForModule };