const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc';

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

var hashedPassword = '$2a$10$kke0bayLy80CVFmGCS/auOVfwzIqNg4aFQKDDeV86R64i3JA4SU2q'

bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res)
})

// var data = {
//   id: 10
// }
//
// var token = jwt.sign(data, '123abc');
// var decoded = jwt.verify(token, '123abc');
// console.log('TOKEN');
// console.log(token);
// console.log('DECODED');
// console.log(decoded);

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
