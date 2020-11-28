const { json } = require('body-parser');
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
          'SELECT id, accesstoken FROM users WHERE id = $1 AND accesstoken = $2',
          [input.id, input.accesstoken]
        );
      }
      results = results.rows[0] || new Error('Wrong user credentials');
      client.end();
    } catch (err) {
      results = err;
      console.log(`Error on loadUser: ${err}`);
      client.end();
      return results;
    }
    return results;
  }

  async updateUser(body) {
    const client = new pg.Client(this.credentials);
    const userid = body.id;
    const oldPassword = encrypt.singleHash(body.oldPassword);
    let newPassword = REGEXHandler.validate('noEmail', body.newPassword);
    let results = null;

    if (!newPassword.password) {
      //Check if the new password is a valid password
      results = new Error(
        'The password has to be at least 8 characters long and include at least one capital letter and one number'
      );
      client.end();
      return results;
    }
    newPassword = encrypt.singleHash(body.newPassword);
    try {
      await client.connect();

      results = await client.query(
        'UPDATE users SET password = $1 WHERE id = $2 AND password = $3 RETURNING id',
        [newPassword, userid, oldPassword]
      );
      results = results.rows[0] || new Error('Wrong password');
      client.end();
    } catch (err) {
      console.log(`updateUser: ${err}`);
      results = err;
      client.end();
    }
    return results;
  }

  async deleteUser(body) {
    const client = new pg.Client(this.credentials);
    const accessToken = body.accesstoken;
    const password = encrypt.singleHash(body.password);
    let results = null;

    try {
      await client.connect();
      results = await client.query(
        'SELECT id FROM users WHERE password = $1 AND accesstoken = $2',
        [password, accessToken]
      );
      const userid = results.rows[0].id || new Error('User not found');

      results = await client.query(
        'DELETE FROM presentations WHERE userid = $1',
        [userid]
      );
      results = await client.query('DELETE FROM users WHERE id = $1', [userid]);
      //delete userinfo

      client.end();
    } catch (err) {
      console.log(`deleteUser: ${err}`);
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
        'SELECT id FROM users WHERE accesstoken = $1',
        [input.accesstoken]
      );

      if (input.id == results.rows[0].id) {
        results = await client.query(
          'DELETE FROM presentations WHERE userid= $1 AND presentationid= $2 RETURNING presentationid;',
          [input.id, input.presentationid]
        );
        results = results.rows[0];
      } else {
        new Error();
      }

      client.end();
    } catch (err) {
      results = err;
      client.end();
    }
    return results;
  }

  async loadPres(body) {
    const client = new pg.Client(this.credentials);
    const input = body;

    let presentationArray = [];
    let results = null;

    try {
      await client.connect();
      results = await client.query(
        'SELECT id FROM users WHERE accesstoken = $1',
        [input.accesstoken]
      );

      if (input.id == results.rows[0].id) {
        results = await client.query(
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
          row.data = JSON.parse(results.rows[i].data);
          console.log('244', results.rows[i].data);
          presentationArray.push(row);
        }
      }
      results = { arr: presentationArray };
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
    const slides = JSON.stringify(input.data);
    let results = null;

    try {
      await client.connect();
      results = await client.query(
        'INSERT INTO presentations(userid, title, data)VALUES($1,$2, $3) RETURNING presentationid',
        [input.id, input.title, slides]
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
    let data = JSON.stringify(input.data);
    console.log('inp:', inp);
    let results = null;
    const shareStatus = input.share;
    let published = '';
    if (shareStatus) {
      published = 'PUBLIC';
    } else {
      published = 'PRIVATE';
    }
    console.log('Published:', published);

    try {
      await client.connect();
      results = await client.query(
        'SELECT id FROM users WHERE accesstoken = $1',
        [input.accesstoken]
      );
      console.log('302:', results.rows[0]);

      if (input.id == results.rows[0].id) {
        console.log('311:', results.rows[0]);
        results = await client.query(
          'UPDATE presentations SET data =$1, title =$2, theme=$3, published=$4 WHERE presentationid = $5 AND userid =$6',
          [
            data,
            input.title,
            input.theme,
            published,
            input.presentationid,
            input.id,
          ]
        );
        results = await client.query(
          'SELECT * FROM presentations WHERE presentationid = $1',
          [input.presentationid]
        );

        results = results.rows[0];
        console.log(results);
        console.log(
          `column updated with presentation: ${results.title} for presentation with id:${results.presentationid}`
        );
      }

      client.end();
    } catch (err) {
      console.log(`Error in UpdatePres: ${err}`);
      results = err;
    }
    return results;
  }

  async publicPres(body) {
    const client = new pg.Client(this.credentials);
    const input = body.published;
    let results = null;
    let presentationArray = [];

    try {
      await client.connect();
      results = await client.query(
        'SELECT COUNT(published) FROM presentations WHERE published = $1',
        [input]
      );

      let rowcount = results.rows[0].count;
      results = await client.query(
        'SELECT data, title, theme, presentationid FROM presentations WHERE published = $1',
        [input]
      );

      for (let i = 0; i < rowcount; i++) {
        let row = results.rows[i];
        row.data = JSON.parse(results.rows[i].data);
        console.log('244', results.rows[i].data);
        presentationArray.push(row);
      }

      results =
        { arr: presentationArray } || new Error('No public presentations');
      client.end();
    } catch (err) {
      console.log(`Error on loadPres: ${err}`);
      results = err;
      client.end();
    }
    return results;
  }

  async viewPres(body) {
    const client = new pg.Client(this.credentials);
    const input = body;
    let results = null;

    try {
      await client.connect();
      results = await client.query(
        'SELECT * FROM presentations WHERE presentationid = $1',
        [input]
      );
      if (JSON.stringify(results.rows[0].published) == 'PUBLIC') {
        results = results.rows[0];
      } else {
        new Error('The presentation is not published');
      }

      console.log(results.rows[0]);

      client.end();
    } catch (err) {
      console.log(`Error in viewPres: ${err}`);
      results = err;
      client.end();
    }
    return results;
  }
}

module.exports = new StorageHandler(dbCredentials);
