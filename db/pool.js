const pg = require('pg');
const encrypt = require('./encryption.js');
const dbCredentials =
  process.env.DATABASE_URL || require('./localenv').credentials;

//Postgresql Database connection

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
      `Pool.js: hadhed input inside newUser: username: ${input.user.username}, password: ${input.user.password}`
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
      console.log(err);
      client.end();
    }
  }
}

module.exports = new StorageHandler(dbCredentials);
