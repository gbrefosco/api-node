
const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticate(req, res) {
    try {
        const { login, password } = req.body;

        if (login != process.env.LOGIN) throw new Error('Login inválido!');
        if (password != process.env.PASSWORD) throw new Error('Login inválido!');

        let token = jwt.sign({ id: process.env.LOGIN }, process.env.SECRET, { expiresIn: 86400 });
        res.status(200).send({ token });
    } catch (error) {
        res.status(400).send({ error })
    }
};

module.exports = {
    authenticate
}