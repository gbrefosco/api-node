const DatabaseService = require('../services/Database');

function get(req, res) {
    let id = req.params.id || req.query.id;
    let customer = req.params.customer || req.query.customer;

    let where = `
        TRUE
    `;

    if (id) where += `
        AND ID = ${id}
    `;

    if (customer) where += `
        AND CUSTOMER = ${customer}
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

function post(req, res) {
    try {
        let { customerId, balance } = req.body;

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