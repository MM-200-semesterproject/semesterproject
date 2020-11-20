const { Pool } = require('pg')
const encrypt = require('./encryption.js');

//Postgresql Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = {

    newUser: function(body) {

        let input = encrypt.hashCode(body);
        console.log("hashed input inside newUser: " + input);
        pool.query(`SELECT * FROM users WHERE email = $1`, [input.user.username],
            function(err, result) {
                if (err) {
                    console.log("user does not exist:" + err);

                    pool.query(`INSERT INTO users(email, password) VALUES($1, $2) RETURNING id`, [input.user.username, input.user.password],
                        function(err, result) {
                            if (err) {
                                console.log("Could not create new user:" + err);
                                return 1;
                            } else {
                                console.log('row inserted with id: ' + result.rows[0].id);
                                return 0;
                            };
                        });
                } else {
                    let message = "User already exist with username" + result.rows[0].id + " - please log in";
                    return message;
                }

            });
    },

    loadUser: function(body) { //get username and password else return SELECT * FROM presentations WHERE userid = result.rows[0].id;
        let input = encrypt.hashCode(body);
        let userid;


        pool.query(`SELECT id FROM users WHERE email = $1 AND password = $2`, [input.user.username, input.user.password],
            function(err, result) {
                if (err) {
                    console.log("Could not load user:" + err);
                    return err;
                } else {
                    console.log('Result loadUser id:' + result.rows[0].id);
                    userid = result.rows[0].id;
                }


            });


        if (userid != 0) {
            pool.query(`SELECT presentationid, data FROM presentations WHERE userid = $1`, [userid], function(err, result) {


                if (err) {
                    console.log("error in pool query2, loadUser: " + err);
                } else {
                    console.log('Result presentations:' + result.rows[0]);
                }

                let presentations = [];
                //for() rows add data and presentation id to array;
            });
        }





        console.log("Error on Load user mainFunction:" + err);
        pool.end();


        //return [result.id, result.presentations] SELECT * FROM presentations WHERE userid = result.rows[0].id;
    },


    createPres: async function(inp) {
        let input = inp;
        let presentationArray = "";
        pool.query(`INSERT INTO presentations(userid, data)VALUES($1,$2) RETURNING presentationid`, [input[0], input[1]], //input 1=userid, input 2 = data

            function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('column updated with prsentations: ' + result.rows[0].data + ", presentationid = " + result.rows[0].presentationid);
                }
                console.log('Client will end now!');

                presentationArray = await [result.rows[0].presentationid, result.rows[0].data];
                pool.end();

            });
        return presentationArray;
    },


    updatePres: function(inp) {

        let input = inp;
        pool.query(`UPDATE presentations SET data =$1 WHERE presentationid = $2 RETURNING presentationid`, [input[1], input[0]],
            function(err, result) {
                if (err) {
                    console.log(input[0]);
                    console.log("Error in updatePres: " + err);
                } else {
                    console.log(input[1]);
                    console.log('column updated with presentation: ' + result.rows[0].presentations + "for user" + result.rows[0].userid);
                }
                console.log('Client will end now!');
                pool.end();

            });
    },

    checkUsers: function(usernameInput) {
        pool.query(`SELECT * FROM users WHERE email = $1`, [usernameInput],
            function(err, result) {
                if (err) {
                    console.log(usernameInput);
                    console.log("Error in checkUsers: " + err);
                } else {
                    console.log(usernameInput);
                    console.log('Result loadUser id:' + result.rows[0].id);
                    console.log(result.rows.length);
                    if (result.rows[0].id != 0) {

                        console.log("user already exists");
                        return 1;
                    }
                    return 0;

                }
            });


    }



}