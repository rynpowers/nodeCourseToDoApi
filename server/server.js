const config = require('./config/config.js');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todos');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate')

var app = express();

var port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  })
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (err) => {
    res.status(400).send(err);
  })
});

app.get('/todos/:id', (req, res) => {
  if (!ObjectID.isValid(req.params.id)){
    return res.status(404).send();
  }
  Todo.findById(req.params.id).then((todo) => {
    if (!todo) {
      return res.status(404).send()
    }
    res.send({todo});
  }).catch((e) => res.status(400).send())
});

app.delete('/todos/:id', (req, res) => {
  if (!ObjectID.isValid(req.params.id)){
    return res.status(404).send()
  }
  Todo.findByIdAndRemove(req.params.id).then((todo) => {
    if (!todo){
      return res.status(404).send()
    }
    res.send({todo})
  }).catch((e) => res.status(400).send());
});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id
  var body = _.pick(req.body, ['completed', 'text']);

  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  }else{
    body.completedAt = null;
    body.completed = false
  }
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send()
  }
  Todo.findByIdAndUpdate(req.params.id, {$set: body}, {new:true}).then((todo) => {
    if(!todo) {
      return res.status(404).send()
    }
    res.send({todo});
  }).catch((e) => res.status(400).send());
});
// User routes

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ["email", "password"])

  var user = new User(body)

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => res.status(400).send(e));
});

app.get('/users/me', authenticate, (req, res) => {
  var user = req.user;
  res.send(user);
})

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send()
  }).catch((e) => res.status(400).send());
})

app.post('/users/login', (req, res) => {

var body = _.pick(req.body, ['email', 'password'])

User.findByCredentails(body.email, body.password)
  .then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => res.status(400).send());
})

app.listen(port, () => {
  console.log('Server running on port '+ port);
});


module.exports = {app};
