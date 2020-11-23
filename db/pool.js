const pg = require('pg');
const encrypt = require('./encryption.js');
const dbCredentials =
  process.env.DATABASE_URL || require('./localenv').credentials;

class StorageHandler {
  constructor(credentials) {
    this.credentials = {
      connectionString: credentials,
      ssl: {
        rejectUnauthorized: false,
      },
    };
  }

  async newUser(body) {
    const client = new pg.Client(this.credentials);
    const input = encrypt.hashCode(body);
    let results = null;
    console.log(
      `Pool.js: hashed input inside newUser: username: ${input.user.username}, password: ${input.user.password}`
    );

    try {
      await client.connect();
      results = await client.query(
        'INSERT INTO users(Email, Password) VALUES($1, $2) RETURNING id',
        [input.user.username, input.user.password]
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

  async loadUser(body) {
    const client = new pg.Client(this.credentials);
    const input = encrypt.hashCode(body);
    let results = null;

    try {
      await client.connect();
      results = await client.query(
        'SELECT * FROM users WHERE email = $1 AND password = $2',
        [input.user.username, input.user.password]
      );
      results = results.rows[0].id;
      console.log(`Result loadUser id: ${results}`);
      client.end();
    } catch (err) {
      results = err;
      console.log(`Error on loadUser: ${err}`);
      client.end();
    }

    return results;
  }

  async deleteUser(body) {
    const client = new pg.Client(this.credentials);
    const input = encrypt.singleHash(body);
    let results = null;

    try {
      await client.connect();
      results = await client.query(
        'DELETE * FROM users WHERE id = $1 AND password = $2',
        [input.id, input.password]
      );
      userid = results.rows[0].id;
      console.log(`user with id: ${userid} deleted`);

      results = await client.query(
        'DELETE * OUTPUT DELETED.presentationid FROM presentations WHERE userid = $1 ',
        [userid]
      );
      console.log(results);
      console.log(`user with id: ${results} deleted`);

      client.end();
    } catch (err) {
      console.log(`Error on deleteUser: ${err}`); //wrong in type login-page?
      client.end();
    }
  }

  async loadPres(body) {
    const client = new pg.Client(this.credentials);
    const input = body;

    let presentationArray = [];
    let singlePres = '';
    let results = null;

    try {
      await client.connect();
      let results = await client.query(
        'SELECT COUNT(userid) FROM presentations WHERE userid = $1',
        [input.user.id]
      );

      let rowcount = results.rows[0].count;

      results = await client.query(
        'SELECT * FROM presentations WHERE userid = $1',
        [input.user.id]
      );
      for (let i = 0; i < rowcount; i++) {
        let row = results.rows[i];
        presentationArray.push(row);
      }
      return presentationArray;

      client.end();
    } catch (err) {
      console.log(`Error on loadPres: ${err}`);
      client.end();
    }
  }

  async loadPres(body) {
    const client = new pg.Client(this.credentials);
    const input = body;

    let presentationArray = [];
    let singlePres = '';
    let results = null;

    try {
      await client.connect();
      let results = await client.query(
        'SELECT COUNT(userid) FROM presentations WHERE userid = $1',
        [input.user.id]
      );

      let rowcount = results.rows[0].count;

      results = await client.query(
        'SELECT * FROM presentations WHERE userid = $1',
        [input.user.id]
      );
      for (let i = 0; i < rowcount; i++) {
        let row = results.rows[i];
        presentationArray.push(row);
      }
      return presentationArray;

      client.end();
    } catch (err) {
      console.log(`Error on loadPres: ${err}`);
      client.end();
    }
  }
  async createPres(inp) {
    const client = new pg.Client(this.credentials);
    const input = inp;
    console.log([input.userid, input.slides, input.title]);
    let results = null;

    try {
      await client.connect();
      results = await client.query(
        'INSERT INTO presentations(userid, title, data)VALUES($1,$2, $3) RETURNING presentationid',
        [input.userid, input.title, input.slides] //input 1=userid, input 2 = data
      );

      results = results.rows[0];
      console.log(`Row created with presentationID: ${results.presentationid}`);
      console.log('Client will end now!');
      client.end();
    } catch (err) {
      console.log(`Error on createPres: ${err}`);
      client.end();
    }
  }

  async updatePres(inp) {
    const client = new pg.Client(this.credentials);
    let input = inp;
    let result = null;

    try {
      await client.connect();
      result = await client.query(
        'UPDATE presentations SET data =$1 WHERE presentationid = $2 RETURNING presentationid',
        [input[1], input[0]]
      );
      results = result.rows[0];
      console.log(
        `column updated with presentation: ${results.presentations} for user ${results.userid}`
      );
      client.end();
    } catch (err) {
      console.log(`Error in UpdatePres: ${err}`);
    }
  }
}

module.exports = new StorageHandler(dbCredentials);
