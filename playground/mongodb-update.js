const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost/TodoApp', (err, client) => {
  if (err) {
    console.log('Unable to connect to mongodb', err);
  }else {
    console.log('Connected to MongoDB server');
    var db = client.db('TodoApp');
  }

  db.collection('User').findOneAndUpdate({
    _id : new ObjectID("5a5ecbdb6bc8ec4f4e1ad644")
  }, {
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result)
  }, (err) => {
    console.log(err);
  })
  // client.close();

})
