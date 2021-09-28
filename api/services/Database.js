const Pool = require('pg').Pool;

//URL: postgres://cnpbpkzq:Eh8YFaBVu-K-dQJqTxbIro5oBZPCnR1i@motty.db.elephantsql.com/cnpbpkzq
const pool = new Pool({
    url: 'postgres://cnpbpkzq:Eh8YFaBVu-K-dQJqTxbIro5oBZPCnR1i@motty.db.elephantsql.com/cnpbpkzq',
    user: 'cnpbpkzq',
    host: 'motty.db.elephantsql.com',
    database: 'cnpbpkzq',
    password: 'Eh8YFaBVu-K-dQJqTxbIro5oBZPCnR1i',
    port: 5432,
    api_key: 'afad2479-e131-4cc7-a4e6-3990f386983e'
});

// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'postgres',
//     password: '',
//     port: 5432,
// });

async function run(query) {
    return pool.query(query);
}

module.exports = {
    run
}