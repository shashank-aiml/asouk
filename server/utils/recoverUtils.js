const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');


function issueRecoverJWT(user, aud, keyPair) {
    const _id = user._id;
    expiresIn = '1d'
  
    const payload = {
      sub: _id,
      iat: Date.now(),
      aud: aud,
      exp: Math.floor(Date.now() / 1000) + (2*60*60),
    };
  
    const signedToken = jwt.sign(payload, keyPair.privateKey, { algorithm: 'RS256' });
  
    return {
      token: signedToken,
      expires: expiresIn
    }
  }

function verifyRecoverJWT(token, keyPair) {
  try {
    const results = jwt.verify(token, keyPair.publicKey, { algorithm: 'RS256' });
      return{... results, status: true}
  } catch (error) {
    console.log(error.message);
    return{status: false}
  }
}  

  module.exports.issueRecoverJWT = issueRecoverJWT;
  module.exports.verifyRecoverJWT = verifyRecoverJWT;