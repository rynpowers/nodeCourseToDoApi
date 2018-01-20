var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_TODO, {useMongoClient: true})
module.exports = {mongoose};
