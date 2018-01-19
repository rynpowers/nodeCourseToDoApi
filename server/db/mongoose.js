var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', {useMongoClient: true});
// mongoose.connect('mongodb://rynpowers:Ronaldo01.@ds261917.mlab.com:61917/todoapp', {useMongoClient: true})

module.exports = {mongoose};
