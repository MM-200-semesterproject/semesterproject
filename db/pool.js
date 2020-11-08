const { Pool } = require('pg')

//Postgresql Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

function dbCreateUser(inp) {

    let input = JSON.parse(inp);
    console.log(input);
    //let queryString = //db.createUser('MaryAnn@hotmail.com', 'asdfghjkl'); //db.createUser("exaplme@email.com", "passwordEx");
    //sending data to "users" table in database
    pool.query(`INSERT INTO users(Email, Password) VALUES(${input.username}, ${input.password}) RETURNING id`,
        function(err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log('row inserted with id: ' + result.rows[0].id);
            }
            console.log('Client will end now!!!');
            pool.end();

        });
}