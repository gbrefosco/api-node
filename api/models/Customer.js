const DatabaseService = require('../services/Database');

function get(req, res) {
    let id = req.params.id || req.query.id;
    let { name } = req.query; 

    let where = `
        TRUE
    `;

    if (id) where += ` AND ID = ${id} `;
    if (name) where += ` AND NAME LIKE '%${name}%' `;

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
    try {
        let { name } = req.body;
        if (!name) throw new Error('Nome é obrigatório!');
        
        let query = `
            INSERT INTO CUSTOMER (NAME)
            VALUES (
                '${name}'
            )
        `;
            
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

