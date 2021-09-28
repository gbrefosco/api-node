const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');

const db = require('./queries');
const authService = require('./authService');
const auth = require('./auth');

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (request, response) => {
    response.send({ info: 'Node.js, Express, and Postgres API' })
});

//Rotas não autenticadas
app.post('/auth', authService.authenticate);

app.use(auth);
//Rotas autenticadas
app.get('/customer', db.getCustomer);
app.get('/customer/:id', db.getCustomer);
app.post('/customer', db.postCustomer);
app.get('/account', db.getAccount);
app.get('/account/:id', db.postAccount);
app.get('/customer/:customer/account', db.getAccount);
app.post('/account', db.postAccount);
app.get('/transaction', db.getTransaction);
app.post('/transaction', db.postTransaction);
app.post('account/:destinyAccount/transaction', db.postTransaction);

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
});

