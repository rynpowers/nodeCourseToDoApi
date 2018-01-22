const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');


var data = {
  id: 10
}

var token = jwt.sign(data, '123abc');
var decoded = jwt.verify(token, '123abc');
console.log('TOKEN');
console.log(token);
console.log('DECODED');
console.log(decoded);

// jwt.verify

// var message = "I am user number 3";
// var hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
//
// var data = {
//   id: 4
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
// token.data = 5;
// token.hash = SHA256(JSON.stringify(data)).toString()
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if (resultHash === token.hash) {
//   console.log("data not changed");
// }else {
//   console.log('data was changeed don\'t trust');
// }
