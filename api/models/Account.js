const DatabaseService = require('../services/Database');

function get(req, res) {
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

    DatabaseService.run(query)
        .then(result => res.status(200).json(result.rows))
        .catch(() => res.status(500).json({ error: 'Erro interno!' }));
};

function post(req, res) {
    try {
        if (!req.body.customer) throw new Error('Cliente é obrigatório!');
    
        let query = `
            INSERT INTO ACCOUNT (CUSTOMER, BALANCE)
            VALUES (${req.body.customer}, ${req.body.balance || 0})
        `;
    
        DatabaseService.run(query)
            .then(() => res.status(200).send())
            .catch(() => res.status(500).json({ error: 'Erro interno!' }));
    } catch (error) {
        res.status(400).send(error);
    }
};

module.exports = {
    get,
    post
}