const jwt = require('jsonwebtoken');

module.exports = ((req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) res.status(401).send({ error: 'Token não enviado!' });

    let [ scheme, token ] = authHeader.split(' ');

    jwt.verify(token, process.env.SECRET, (error, decoded) => {
        if (error) res.status(401).send({ error: 'Token inválido!' });
        next();
    })

})