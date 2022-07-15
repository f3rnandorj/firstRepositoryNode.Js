const express = require('express'); // importando o express para o arquivo atual

const server = express(); // criando o servidor com base no express

server.use(express.json()); // habilitando o express para o uso de Json

//query params = ?teste=1
//route params = /users/1
//request body = { 'name': 'fernando', 'email': 'f3rnandorj10@gmail.com' }

//CRUD - Create, Read, Update, Delete

const users = ['João', 'Fernando', 'Pedro'];

server.use((req, res, next) => { // middleware global
  console.time('request');
  console.log(`Metodo: ${req.method}, URL: ${req.url}`);

  next();
  console.timeEnd('request');
})

function checkUserExists(req, res, next){ // middleware local / distribuido
  if(!req.body.name){
    return res.status(400).json({ error: 'Name is required' });
  }

  return next();
}

function checkUserInArray(req, res, next){
  const user = users[req.params.index];
  
  if(!user){
    return res.status(400).json({ error: "Index doesn't exist" });
  }

  req.user = user;

  return next();
}

server.get('/users', (req, res) => {
  return res.json(users);
})

server.get('/users/:index', checkUserInArray, (req, res) => { //require and respond
  //const {index} = req.params;

  return res.json(req.user);
})

server.post('/users', checkUserExists, (req, res) => {
  const {name} = req.body;
  users.push(name);
  
  return res.json(users);
})

server.put('/users/:index', checkUserInArray, (req, res) => {
  const {index} = req.params;
  const {name} = req.body;

  users[index] = name;
  return res.json(users);
})

server.delete('/users/:index', checkUserInArray, (req, res) => { 
  const {index} = req.params;

  users.splice(index, 1);
  return res.send();
})

server.listen(3000) // servidor ouça na porta 3000
