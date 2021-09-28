const DatabaseService = require('../services/Database');

function get(req, res) {
    let where = ` TRUE `;
    if (req.query.id || req.params.id) where += ` AND ID = ${req.query.id || req.params.id} `;
    if (req.query.name) where += ` AND NAME LIKE '%${req.query.name}%' `;

    let query = `
        SELECT *
        FROM CUSTOMER
        WHERE ${where}
        ORDER BY ID ASC
    `;

    DatabaseService.run(query)
        .then(result => res.status(200).json(result.rows))
        .catch(() => res.status(500).json({ error: 'Erro interno!' }));
};

function post(req, res) {
    console.log('entrou');
    try {
        console.log('entrou2');
        if (!req.body.name) throw new Error('Nome é obrigatório!');
        
        let query = `
            INSERT INTO CUSTOMER (NAME)
            VALUES (
                '${req.body.name}'
            )
        `;
            
        console.log('entrou3');
        DatabaseService.run(query)
            .then(() => res.status(200).send())
            .catch(() => res.status(500).json({ error: 'Erro interno!' }));
    } catch (err) {
        res.status(400).send(err.message);
    }
}

module.exports = {
    get,
    post
}

