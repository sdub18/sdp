const db = require('../db');

function insertData(pkt) {
	const id = pkt['id'];
	const data = pkt['data'];

	const current = data['current'];
	const voltage = data['voltage'];
	const power = data['power'];
	const temp = data['temp'];
	const accelereation = data['acceleration'];

	const timestamp = Date.now();
	
	const sqlCmd = 'INSERT INTO data VALUES (?, ?, ?, ?, ?)';
	
	db.insert(sqlCmd, [id, timestamp, current, temp, power]);
};

function getData(){
	
}

module.exports = { insertData, getData };