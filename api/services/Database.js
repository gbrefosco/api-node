const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '',
    port: 5432,
});

async function run(query) {
    return pool.query(query);
}

module.exports = {
    run
}