const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todos');
const {User} = require('./../server/models/user')

var id = '5a5fdce96185e85645d6ee61'

if (!ObjectID.isValid(id)) {
  return console.log('Id not valid')
}

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos find', todos)
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo find one', todo)
// });

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('Id not found');
//   }
//   console.log('Todo by Id', todo);
// }).catch((e) => console.log(e));

User.findById(id).then((user) => {
  if (!user) {
    return console.log('No ID found');
  }
  console.log(JSON.stringify(user, null, 2));
}).catch((e) => {
  console.log(e)
})
