const DatabaseService = require('../services/Database');

/**
 * 
 * @param {number} id Id da conta 
 * @param {number} customer Id do cliente (dono da conta) 
 */
function get(req, res) {
    let id = req.params.id || req.query.id;
    let customerId = req.params.customer || req.query.customer;

    let where = `
        TRUE
    `;

    if (id) where += `
        AND ID = ${id}
    `;

    if (customerId) where += `
        AND CUSTOMER = ${customerId}
    `;

    let query = `
        SELECT *
        FROM ACCOUNT
        WHERE ${where}
    `;

    DatabaseService.run(query)
        .then(result => res.status(200).json(result.rows))
        .catch(() => res.status(500).json({ error: 'Erro interno!' }));
};

/**
 * 
 * @param {number} customer Id do cliente dono da conta
 * @param {number} balance Valor de saldo inicial
 */
function post(req, res) {
    try {
        let { customer:customerId, balance } = req.body;

        if (!customerId) throw new Error('Cliente é obrigatório!');
    
        let query = `
            INSERT INTO ACCOUNT (CUSTOMER, BALANCE)
            VALUES (${customerId}, ${balance || 0})
        `;
    
        DatabaseService.run(query)
            .then(() => res.status(200).send())
            .catch(() => res.status(500).json({ error: 'Erro interno!' }));
    } catch (error) {
        res.status(400).send(error.message);
    }
};

module.exports = {
    get,
    post
}