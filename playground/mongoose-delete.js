const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todos');
const {User} = require('./../server/models/user')

// Todo.remove({}).then((result) => console.log(result))
// .catch((e) => console.log(e));

// Todo.findByIdAndRemove("5a6268dd2a7a5ef6799f1755")
// .then((todo) => (console.log(todo))).catch((e) => console.log(e));

Todo.findOneAndRemove({_id: "5a626ab53e88976aaed547e4"})
.then((todo) => console.log(todo)).catch((e) => (console.log(e)));
