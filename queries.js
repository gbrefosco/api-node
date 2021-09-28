const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '',
    port: 5432,
});

function getCustomer(req, res) {
    let where = ` TRUE `;
    if (req.query.id || req.params.id) where += ` AND ID = ${req.query.id || req.params.id} `;
    if (req.query.name) where += ` AND NAME LIKE '%${req.query.name}%' `;

    let query = `
        SELECT *
        FROM CUSTOMER
        WHERE ${where}
        ORDER BY ID ASC
    `;

    pool.query(query, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Erro do servidor!'});
        } else {
            res.status(200).send(results.rows);
        }
    });
};

function getAccount(req, res) {
    let where = `
        TRUE
    `;

    if (req.query.id || req.params.id) where += `
        AND ID = ${req.query.id || req.params.id}
    `;

    if (req.query.customer || req.params.customer) where += `
        AND CUSTOMER = ${req.query.customer || req.params.customer}
    `;

    let query = `
        SELECT *
        FROM ACCOUNT
        WHERE ${where}
    `;

    pool.query(query, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Erro do servidor!'});
        } else {
            res.status(200).send(results.rows);
        }
    });
};

function postCustomer(req, res) {
    try {
        if (!req.body.name) throw new Error('Nome é obrigatório!');
        
        let query = `
            INSERT INTO CUSTOMER (NAME)
            VALUES (
                '${req.body.name}'
            )
        `;
    
        pool.query(query, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Erro do servidor!'});
            } else {
                res.status(200);
            }
        });        
    } catch (error) {
        res.status(400).send(error);
    }
};

function postAccount(req, res) {
    try {
        if (!req.body.customer) throw new Error('Cliente é obrigatório!');
    
        let query = `
            INSERT INTO ACCOUNT (CUSTOMER, BALANCE)
            VALUES (${req.body.customer}, ${req.body.balance || 0})
        `;
    
        pool.query(query, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Erro do servidor!'});
            } else {
                res.status(200);
            }
        });
    } catch (error) {
        res.status(400).send(error);
    }
};

function getTransaction(req, res) {
    let where = `
        TRUE
    `;

    if (req.query.id || req.params.id) where += `
        AND ID = ${req.query.id || req.params.id}
    `;

    if (req.query.originAccount) where += `
        AND ORIGINACCOUNT = ${req.query.originAccount}
    `;

    if (req.query.destinyAccount) where += `
        AND DESTINYACCOUNT = ${req.query.destinyAccount}
    `;

    let query = `
        SELECT *
        FROM TRANSACTION
        WHERE ${where}
    `;

    pool.query(query, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Erro do servidor!'});
        } else {
            res.status(200).send(results.rows);
        }
    });
};

function postTransaction(req, res) {
    let destinyAccount = req.params.destinyAccount || req.body.destinyAccount;
    if (!destinyAccount) res.status(400).send({ error: 'Conta de destino é obrigatório!' });

    let originAccount = req.body.originAccount || null;
    let value = req.body.value;

    pool.query(`SELECT ID, BALANCE FROM ACCOUNT WHERE ID IN (${destinyAccount},${originAccount})`, (error, results) => {
        if (error) res.status(500).send({ error: 'Erro do servidor!' });
        try {
            let accounts = results.rows;
            let originUpdate;
            if (originAccount) {
                originBalance = accounts.filter(acc => acc.id === originAccount)[0].balance;
                if (originBalance < value) throw new Error('Saldo insuficiente!');

                originUpdate = `
                    UPDATE ACCOUNT
                    SET BALANCE = ${originBalance - req.body.value}
                    WHERE ID = ${req.body.originAccount};
                `;
            }
            
            let [{ balance: destinyBalance }] = accounts.filter(acc => acc.id === destinyAccount);

            let query = `
                INSERT INTO TRANSACTION (ORIGINACCOUNT, DESTINYACCOUNT, VALUE)
                VALUES (
                    ${req.body.originAccount || null},
                    ${req.body.destinyAccount || req.params.destinyAccount},
                    ${req.body.value}
                );
    
                UPDATE ACCOUNT
                SET BALANCE = ${parseInt(req.body.value) + parseInt(destinyBalance)}
                WHERE ID = ${req.body.destinyAccount};

                ${originAccount ? originUpdate : ''}
            `;
    
            pool.query(query, (error, results) => {
                if (error) {
                    res.status(500).send({ error: 'Erro do servidor!'});
                } else {
                    res.status(200);
                }
            });
        } catch (error) {
            res.status(400).send({ error: error.message })
        }
    })
};

module.exports = {
    getCustomer,
    postCustomer,
    getAccount,
    postAccount,
    getTransaction,
    postTransaction
}
