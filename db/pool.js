const { Pool } = require('pg');
const encrypt = require('./encryption.js');
const dbCredentials =
  process.env.DATABASE_URL || require('./localenv').credentials;

//Postgresql Database connection
const pool = new Pool({
  connectionString: dbCredentials,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = {
  newUser: function (body) {
    let input = encrypt.hashCode(body);
    console.log('hadhed input inside newUser: ' + input);

    pool.query(
      `INSERT INTO users(Email, Password) VALUES($1, $2) RETURNING id`,
      [input.user.username, input.user.password],
      function (err, result) {
        if (err) {
          console.log(err);
          newUserState = false;
        } else {
          console.log('row inserted with id: ' + result.rows[0].id);
          newUserState = true;
        }
      }
    );
  },

  loadUser: function (inp) {
    //get username and password 2. validate username, validate username + password, if not return error. else return SELECT * FROM presentations WHERE userid = result.rows[0].id;
    let input = inp;
    try {
      pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [input.user.username],
        function (err, result) {
          console.log('Result loadUser id:' + result.rows[0].id);
          pool.end();
        }
      );
    } catch (err) {
      console.log('Error on Load user:' + err);
      pool.end();
    }

    //return [result.id, result.presentations] SELECT * FROM presentations WHERE userid = result.rows[0].id;
  },

  createPres: async function (inp) {
    let input = inp;
    let presentationArray = '';
    pool.query(
      `INSERT INTO presentations(userid, data)VALUES($1,$2) RETURNING presentationid`,
      [input[0], input[1]], //input 1=userid, input 2 = data

      function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(
            'column updated with prsentations: ' +
              result.rows[0].data +
              ', presentationid = ' +
              result.rows[0].presentationid
          );
        }
        console.log('Client will end now!');

        presentationArray =
          await[(result.rows[0].presentationid, result.rows[0].data)];
        pool.end();
      }
    );
    return presentationArray;
  },

  updatePres: function (inp) {
    let input = inp;
    pool.query(
      `UPDATE presentations SET data =$1 WHERE presentationid = $2 RETURNING presentationid`,
      [input[1], input[0]],
      function (err, result) {
        if (err) {
          console.log(input[0]);
          console.log('Error in updatePres: ' + err);
        } else {
          console.log(input[1]);
          console.log(
            'column updated with presentation: ' +
              result.rows[0].presentations +
              'for user' +
              result.rows[0].userid
          );
        }
        console.log('Client will end now!');
        pool.end();
      }
    );
  },
};
