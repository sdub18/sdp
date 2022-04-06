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
	
	const sql = 'INSERT INTO data VALUES (?, ?, ?, ?, ?)';
	
	db.insert(sql, [id, timestamp, current, temp, power]);
};


module.exports = {
	insertData
};