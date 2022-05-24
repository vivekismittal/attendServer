var crypto = require('crypto');


function randomValueHex (len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex') 
        .slice(0,len).toUpperCase();
}

var string = randomValueHex(6);
console.log(string);