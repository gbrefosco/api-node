const jwt = require('jsonwebtoken');
require('dotenv').config();

function get(req, res) {
    try {
        const { login, password } = req.query;

        if (login != process.env.LOGIN) throw new Error('Login inválido!');
        if (password != process.env.PASSWORD) throw new Error('Login inválido!');

        let token = jwt.sign({ id: process.env.LOGIN }, process.env.SECRET, { expiresIn: 86400 });
        res.status(200).send({ token });
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
}

function post(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) res.status(401).send({ error: 'Token não enviado!' });

    let [ scheme, token ] = authHeader.split(' ');

    jwt.verify(token, process.env.SECRET, (error, decoded) => {
        if (error) res.status(401).send({ error: 'Token inválido!' });
        next();
    })   
}

module.exports = {
    get,
    post
}