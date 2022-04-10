const DBSOURCE = "db.sqlite";
const Database = require('better-sqlite3');
const fs = require('fs');

//if (fs.existsSync(DBSOURCE)) fs.unlinkSync(DBSOURCE);

const options = { verbose: console.log };
const db = new Database(DBSOURCE);
db.exec("CREATE TABLE IF NOT EXISTS data (timestamp DATE NOT NULL, id INTEGER NOT NULL, current REAL, voltage REAL, power REAL, temp REAL, x REAL, y REAL, z REAL)");
db.exec("CREATE TABLE IF NOT EXISTS freq (fx REAL, fy REAL, fz REAL)");
db.exec("CREATE TABLE IF NOT EXISTS policy (moduleId REAL, policyID REAL, policyType TEXT, dataType TEXT, period REAL, comparison TEXT, treshold REAL)");

function query(sql, params) {
	return db.prepare(sql).all(params);
}

function insert(sql, params) {
	return db.prepare(sql).run(params);
}

function del(sql, params) {
	return db.prepare(sql).run(params);
}

module.exports = { query, insert, del }