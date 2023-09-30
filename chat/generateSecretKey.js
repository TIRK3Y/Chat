const crypto = require('crypto');
const numberOfBytes = 8; // You can adjust the number of bytes as needed
const secretKey = crypto.randomBytes(numberOfBytes).toString('hex');
console.log('Generated secret key:', secretKey);
