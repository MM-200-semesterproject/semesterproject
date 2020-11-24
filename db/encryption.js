const pool = require('./pool.js');

exports.hashCode = function (userData) {
  let password = userData.password;
  let username = userData.username;

  if (username != null) {
    let returnObject = {
      username: createHash(username),
      password: createHash(password),
    };

    return returnObject;
  } else {
    return false;
  }
};

function createHash(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    let charOfString = string.charCodeAt(i);
    hash = (hash << 5) - hash + charOfString; // <<5 shifts bits in binary
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

exports.singleHash = function (inpString) {
  let string = inpString;
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    let charOfString = string.charCodeAt(i);
    hash = (hash << 5) - hash + charOfString;
    hash |= 0;
  }

  return hash;
};
