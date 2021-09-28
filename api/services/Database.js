const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'iotpchjiewrrra',
    host: 'ec2-3-218-47-9.compute-1.amazonaws.com',
    database: 'ds1v5ecvlo8rl',
    password: 'c7402a540bf1f05c4994e06b8cacd9a2ca8d815f12a24303fb946586641b2fc5',
    port: 5432,
    //CLI Connect: heroku pg:psql postgresql-colorful-39704 --app api-node-gbr
});

async function run(query) {
    return pool.query(query);
}

module.exports = {
    run
}