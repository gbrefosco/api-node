API básica de criação de cliente, contas e transferências entre contas ou depósitos.  
  
ROTAS:  
  
Criar cliente: POST /customer { name: 'string' }  
Buscar cliente:  
    GET /customer?id="integer"&name="string"  
    ou  
    GET /customer/:id  
  
Criar conta: POST /account { customer: 'integer' }  
Buscar conta:  
    GET /account?id="integer"&customer="integer"  
    ou  
    GET /account/:id  
  
Transferencia entre duas contas: POST /transaction { originAccount: 'integer', destinyAccount: 'integer', value: 'integer' }  
Depósito em uma conta: POST /transaction { destinyAccount: 'integer', value: 'integer' }  
Buscar transferências:  
    GET /transaction?id="integer"&originAccount="integer"&destinyAccount="integer"  
    GET /account/:id/transaction (todas as transferências de uma conta)  