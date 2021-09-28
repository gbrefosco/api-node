const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const Customer = require('./api/models/Customer');
const Account = require('./api/models/Account');
const Transaction = require('./api/models/Transaction');
const AuthService = require('./api/services/Auth');

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
app.get('/auth', AuthService.get);

app.use(AuthService.post);
//Rotas autenticadas
app.get('/customer', Customer.get);
app.get('/customer/:id', Customer.get);
app.post('/customer', Customer.post);
app.get('/account', Account.get);
app.get('/account/:id', Account.get);
app.get('/customer/:customer/account', Account.get);
app.post('/account', Account.post);
app.get('/transaction', Transaction.get);
app.post('/transaction', Transaction.post);
app.post('account/:destinyAccount/transaction', Transaction.post);


app.listen(port, () => {
    console.log(`App running on port ${port}.`)
});
