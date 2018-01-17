const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost/TodoApp', (err, client) => {
  if (err) {
    console.log('Unable to connect to mongodb', err);
  }else {
    console.log('Connected to MongoDB server');
    var db = client.db('TodoApp');
  }

  // delete many

  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
  //   console.log(result)
  // }, (err) => {
  //   console.log('Unable to retrieve item from the database', err);
  // });

  // deleteOne

  // db.collection('Todos').deleteOne({text: 'Eat lunch'})
  //   .then((result) => {
  //     console.log(result);
  //   }, (err) => {
  //     console.log('Unable to retrieve item from the databas', err);
  //   })

  // findOneAndDelete
  //
  // db.collection('Todos').findOneAndDelete({completed: false})
  //   .then((result) => {
  //     console.log(result)
  //   }, (err) => {
  //     console.log('Unable to retrieve item from the database', err);
  //   })

  db.collection('User').findOneAndDelete({_id: new ObjectID("5a5ecbeed4d3934f4ff6af1c")}).then((result) => {
    console.log(result);
  }, (err) => {
    console.log(err);
  });

  // client.close();

})
