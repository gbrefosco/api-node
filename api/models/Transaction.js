const DatabaseService = require('../services/Database');

function get(req, res) {
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

    DatabaseService.run(query)
        .then(result => res.status(200).json(result.rows))
        .catch(() => res.status(500).json({ error: 'Erro interno!' }));
};

function post(req, res) {
    let destinyAccount = req.params.destinyAccount || req.body.destinyAccount;
    if (!destinyAccount) res.status(400).send({ error: 'Conta de destino é obrigatório!' });

    let originAccount = req.body.originAccount || null;
    let value = req.body.value;

    DatabaseService.run(`SELECT ID, BALANCE FROM ACCOUNT WHERE ID IN (${destinyAccount},${originAccount})`)
        .then(results => {
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
    
            DatabaseService.run(query)
                .then(() => res.status(200).send())
                .catch(() => res.status(500).json({ error: 'Erro interno!' }));            
        })
        .catch((error) => error.message ? res.status(400).send({ error: error.message }) : res.status(500).send('Erro interno!'));
}

module.exports = {
    get,
    post
}
