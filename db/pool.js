const { Pool } = require('pg')

//Postgresql Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = {

    newUser: function(inp) {

        let input = inp;

        pool.query(`INSERT INTO users(Email, Password) VALUES($1, $2) RETURNING id`, [input.user.username, input.user.password],
            function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('row inserted with id: ' + result.rows[0].id);
                }
                console.log('Client will end now!');
                pool.end();

            });
    },

    loadUser: function(inp) {
        let input = inp;
        pool.query(`SELECT * FROM users WHERE email = $1`, [input.user.username],
            function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Result loadUser:' + result.rows[0].presentations);
                }
                console.log('Client will end now!');
                pool.end();

            });
        //return [result.id, result.presentations]
    },


    createPres: async function(inp) {
        let input = inp;
        console.log(input, " ", input[0]);
        let presentationArray = "";
        pool.query(`INSERT INTO presentations(userid, data)VALUES($1,$2) RETURNING presentationid`, [input[0], input[1]], //input 1=userid, input 2 = data

            function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('column updated with prsentations: ' + result.rows[0].data + ", presentationid = " + result.rows[0].presentationid);
                }
                console.log('Client will end now!');

                presentationArray = [result.rows[0].presentationid, result.rows[0].data];
                pool.end();

            });
        return presentationArray;
    },


    updatePres: async function(inp) {

        let input = inp;
        pool.query(`UPDATE presentations SET data =$1 WHERE presentationid = $2 RETURNING id`, [input[1], input[0]],
            function(err, result) {
                if (err) {
                    console.log(input[0]);
                    console.log(err);
                } else {
                    console.log(input[1]);
                    console.log('column updated with presentation: ' + result.rows[0].presentations + "for user" + result.rows[0].userid);
                }
                console.log('Client will end now!');
                pool.end();

            });
    },

}