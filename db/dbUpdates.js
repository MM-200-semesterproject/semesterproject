//Create new user - må sendes til kryptering først!
exports.createUser = (email, password) => `INSERT INTO users(Email, Password)VALUES(${email}, ${password})`;
//UPDATE powerpoint

//on client-> let presentations = JSON.stringify(presentationData)
exports.updateData = (userId, presentations) => `UPDATE users SET presentation = ${presentations} WHERE id=${userId}`;