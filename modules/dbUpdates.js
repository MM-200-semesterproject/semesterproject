//Create new user - må sendes til kryptering først!
exports.createUser = (encrypted(email), encrypted(password))
let queryString = `INSERT INTO users(email, password, id, presentations)VALUES('MaryAnn@hotmail.com', 'asdfghjkl', 20, '')`;
//UPDATE powerpoint

//on client-> let presentations = JSON.stringify(presentationData)
exports.updateData = (userId, presentations) => `UPDATE users SET presentation = ${presentations} WHERE id=${userId}`;