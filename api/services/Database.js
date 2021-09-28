const Pool = require('pg').Pool;

//URL: postgres://cnpbpkzq:Eh8YFaBVu-K-dQJqTxbIro5oBZPCnR1i@motty.db.elephantsql.com/cnpbpkzq
const pool = new Pool({
    user: 'cnpbpkzq',
    host: 'motty.db.elephantsql.com',
    database: 'cnpbpkzq',
    password: 'Eh8YFaBVu-K-dQJqTxbIro5oBZPCnR1i',
    port: 5432,
});

async function run(query) {
    return pool.query(query);
}

module.exports = {
    run
}