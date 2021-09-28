const DatabaseService = require('../services/Database');

function get(req, res) {
    let id = req.params.id || req.query.id;
    let destinyAccountId = req.params.destinyAccountId || req.query.destinyAccountId;
    let { originAccountId } = req.query;

    let where = `
        TRUE
    `;

    if (id) where += `
        AND ID = ${id}
    `;

    if (originAccountId) where += `
        AND ORIGINACCOUNT = ${originAccountId}
    `;

    if (destinyAccountId) where += `
        AND DESTINYACCOUNT = ${destinyAccountId}
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
    const destinyAccountId = req.params.destinyAccount || req.body.destinyAccount;
    const { value } = req.body;

    if (!destinyAccountId) res.status(400).send({ error: 'Conta de destino é obrigatório!' });    
    if (!value) res.status(400).send({ error: 'Valor é obrigatório!' });   
    
    const originAccountId = req.body.originAccount || null;

    DatabaseService.run(`SELECT ID, BALANCE FROM ACCOUNT WHERE ID IN (${destinyAccountId},${originAccountId})`)
        .then(results => {
            let accounts = results.rows;

            let originUpdate;
            let originAccount;

            if (!!originAccountId) {
                originAccount = accounts.filter(acc => acc.id === originAccountId);
                if (!originAccount.length) throw new Error('Conta de origem inexistente!');

                let originBalance = originAccount[0].balance;
                if (originBalance < value) throw new Error('Saldo insuficiente!');
                
                originUpdate = `
                    UPDATE ACCOUNT
                    SET BALANCE = ${originBalance - req.body.value}
                    WHERE ID = ${originAccountId};
                `;
            }
            
            let destinyAccount = accounts.filter(acc => acc.id === destinyAccountId);
            if (!destinyAccount.length) throw new Error('Conta de destino inexistente!');
            let destinyBalance = destinyAccount[0].balance;

            let query = `
                INSERT INTO TRANSACTION (ORIGINACCOUNT, DESTINYACCOUNT, VALUE)
                VALUES (
                    ${originAccountId || null},
                    ${destinyAccountId},
                    ${req.body.value}
                );

                UPDATE ACCOUNT
                SET BALANCE = ${parseInt(req.body.value) + parseInt(destinyBalance)}
                WHERE ID = ${destinyAccountId};

                ${originAccountId ? originUpdate : ''}
            `;

            DatabaseService.run(query)
                .then(() => res.status(200).send())
                .catch(() => res.status(500).send({ error: 'Erro interno!' }));            
        })
        .catch(error => {
            res.status(400).send(error.message);
        });
}

module.exports = {
    get,
    post
}
