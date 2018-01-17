// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server')
  }
  console.log('Connected to MongoDB server');

  var db = client.db('TodoApp');

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert Todo', err)
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  // db.collection('User').insertOne({
  //   name: 'Ryan',
  //   age: 32,
  //   location: 'New York'
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert User', err)
  //   }
    // ops is the mongo object
    // console.log(JSON.stringify(result.ops, null, 2));
    // fetching id and attaching time stamp
  //   console.log(result.ops[0]._id.getTimestamp())
  // });

  client.close()
});
