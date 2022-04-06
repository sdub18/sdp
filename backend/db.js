const Database = require('better-sqlite3');
const DBSOURCE = "db.sqlite";

const db = new Database(DBSOURCE, { verbose: console.log });

function query(sql, params) {
	return db.prepare(sql).all(params);
}

function insert(sql, params) {
	return db.prepare(sql).run(params);
}

module.exports = { query, insert }