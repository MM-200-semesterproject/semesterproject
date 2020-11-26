const pg = require('pg');
const encrypt = require('./encryption.js');
const dbCredentials =
  process.env.DATABASE_URL || require('./localenv').credentials;
const REGEXHandler = require('./validation.js');

class StorageHandler {
  constructor(credentials) {
    this.credentials = {
      connectionString: credentials,
      ssl: {
        rejectUnauthorized: false,
      },
    };
  }

  async checkIfUserExists(username) {
    const client = new pg.Client(this.credentials);
    let result = null;
    await client.connect();
    result = await client.query('SELECT * FROM users WHERE email = $1', [
      username,
    ]);
    if (result.rowCount === 0) {
      client.end();
      return false;
    }
    client.end();
    return true;
  }

  async newUser(body) {
    const client = new pg.Client(this.credentials);
    const input = encrypt.hashCode(body);
    let results = null;

    const userExists = await this.checkIfUserExists(input.username);
    const validateEmailAndPassword = REGEXHandler.validate(
      body.username,
      body.password
    );
    if (userExists) {
      results = new Error('User already exists');
      results.statusCode = 403;
      client.end();
      return results;
    }

    if (!validateEmailAndPassword.email) {
      results = new Error('Provide correct e-mail address.');
      results.statusCode = 401;
      client.end();
      return results;
    }

    if (!validateEmailAndPassword.password) {
      results = new Error(
        'The password has to be at least 8 characters long and include at least one capital letter and one number'
      );
      results.statusCode = 401;
      client.end();
      return results;
    }

    try {
      await client.connect();
      results = await client.query(
        'INSERT INTO users(Email, Password) VALUES($1, $2) RETURNING id',
        [input.username, input.password]
      );
      results = results.rows[0].id;
      console.log(`row inserted with id: ${results}`);
      client.end();
    } catch (err) {
      results = err;
      console.log(err);
      client.end();
    }

    return results;
  }

  async loadUser(body, createAccessToken) {
    const client = new pg.Client(this.credentials);
    const input = createAccessToken ? encrypt.hashCode(body) : body;
    let results = null;
    let token = null;

    if (createAccessToken) {
      token = '';
      let tempname = String(input.username);
      let randomize = Math.random() * 1000000000000000;
      randomize = randomize.toString(32).substring(3);
      for (let i = 0; i <= randomize.length; i++) {
        token += randomize.charAt(i).concat(tempname.charAt(i + 3));
      }
    }

    try {
      await client.connect();
      if (createAccessToken) {
        results = await client.query(
          'UPDATE users SET accesstoken = $1 WHERE email = $2 AND password = $3 RETURNING id,accesstoken',
          [token, input.username, input.password]
        );
      } else {
        results = await client.query(
          'SELECT * FROM users WHERE id = $1 AND accesstoken = $2',
          [input.id, input.accesstoken]
        );
      }
      results = results.rows[0];

      client.end();
    } catch (err) {
      results = err;
      console.log(`Error on loadUser: ${err}`);
      client.end();
      return results;
    }
    return results;
  }

  async deleteUser(body) {
    const client = new pg.Client(this.credentials);
    const userid = body.userid;
    let password = encrypt.singleHash(body.password);
    let results = null;

    try {
      //delete presentations
      await client.connect();
      results = await client.query(
        'DELETE FROM presentations WHERE userid = $1',
        [userid]
      );

      console.log(`Presentations deleted`);
      //delete userinfo

      results = await client.query(
        'DELETE FROM users WHERE id = $1 AND password = $2',
        [userid, password]
      );

      console.log(`user deleted`);

      client.end();
    } catch (err) {
      console.log(`Error on deleteUser: ${err}`);
      results = err;
      client.end();
    }
    return results;
  }

  async deletePres(inp) {
    const client = new pg.Client(this.credentials);
    const input = inp;
    let results = null;

    try {
      await client.connect();
      results = await client.query(
        'DELETE FROM presentations WHERE userid = $1 AND presentationid =$2',
        [input.userid, input.presentationid]
      );

      console.log(`presentation with id ${input.presentationid} deleted`);

      client.end();
    } catch (err) {
      console.log(`Error on deleteUser: ${err}`);
      client.end();
    }
  }

  async loadPres(body) {
    const client = new pg.Client(this.credentials);
    const input = body;

    let presentationArray = [];
    let results = null;

    try {
      await client.connect();
      let results = await client.query(
        'SELECT COUNT(userid) FROM presentations WHERE userid = $1',
        [input.id]
      );

      let rowcount = results.rows[0].count;

      results = await client.query(
        'SELECT * FROM presentations WHERE userid = $1',
        [input.id]
      );
      for (let i = 0; i < rowcount; i++) {
        let row = results.rows[i];
        presentationArray.push(row);
      }
      results = presentationArray;

      client.end();
    } catch (err) {
      console.log(`Error on loadPres: ${err}`);
      results = err;
      client.end();
    }
    return results;
  }

  async createPres(inp) {
    const client = new pg.Client(this.credentials);
    const input = inp;
    let results = null;

    try {
      await client.connect();
      results = await client.query(
        'INSERT INTO presentations(userid, title, data)VALUES($1,$2, $3) RETURNING presentationid',
        [input.id, input.title, input.slides]
      );

      results = results.rows[0];
      console.log(`Row created with presentationID: ${results.presentationid}`);
      console.log('Client will end now!');
      client.end();
    } catch (err) {
      console.log(`Error on createPres: ${err}`);
      results = err;
      client.end();
    }
    return results;
  }

  async updatePres(inp) {
    const client = new pg.Client(this.credentials);
    let input = inp;
    let results = null;

    try {
      await client.connect();
      results = await client.query(
        'UPDATE presentations SET data = $1 , title = $2 WHERE presentationid = $3 AND userid = $4 RETURNING title, userid, presentationid, data ',
        [input.slides, input.title, input.presentationid, input.userid]
      );
      results = results.rows[0];
      console.log(
        `column updated with presentation: ${results.title} for presentation with id:${results.presentationid}`
      );
      client.end();
    } catch (err) {
      console.log(`Error in UpdatePres: ${err}`);
      results = err;
    }
    return results;
  }
}

module.exports = new StorageHandler(dbCredentials);
