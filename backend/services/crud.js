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

function getAccelData(type, low, high){
	try {
		const sqlCmd = `SELECT ${type} FROM data WHERE timestamp BETWEEN ? AND ? ORDER BY timestamp DESC LIMIT 512`;
		return db.query(sqlCmd, [low, high]);
			

	} catch (error) {
		console.log(error.message);
	}
}

module.exports = { insertData, getAccelData };