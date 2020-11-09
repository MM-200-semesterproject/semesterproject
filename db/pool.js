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


    updatePres: function(inp) {

        let input = inp;
        pool.query(`UPDATE users SET Presentations =$1 WHERE id = $2 RETURNING id`, [input[1], input[0]],
            function(err, result) {
                if (err) {
                    console.log(input[0]);
                    console.log(err);
                } else {
                    console.log(input[1]);
                    console.log('coliumn updated with prsentations: ' + result.rows[0].presentations);
                }
                console.log('Client will end now!');
                pool.end();

            });
    },

}