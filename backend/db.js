const DBSOURCE = "db.sqlite";
const Database = require('better-sqlite3');
const fs = require('fs');

if (fs.existsSync(DBSOURCE)) fs.unlinkSync(DBSOURCE);

const db = new Database(DBSOURCE, { verbose: console.log });
db.exec("CREATE TABLE data (timestamp DATE NOT NULL, id INTEGER NOT NULL, current REAL, temp REAL, power REAL)");

function query(sql, params) {
	return db.prepare(sql).all(params);
}

function insert(sql, params) {
	return db.prepare(sql).run(params);
}

module.exports = { query, insert }