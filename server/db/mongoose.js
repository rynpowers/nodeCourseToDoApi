var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_TODO || 'mongodb://localhost:27017/TodoApp', {useMongoClient: true})
module.exports = {mongoose};
