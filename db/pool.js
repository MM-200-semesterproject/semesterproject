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


        console.log("hadhed input inside newUser: " + input);

        pool.query(`INSERT INTO users(Email, Password) VALUES($1, $2) RETURNING id`, [input.user.username, input.user.password],
            function(err, result) {
                if (err) {
                    console.log(err);
                    newUserState = false;
                } else {
                    console.log('row inserted with id: ' + result.rows[0].id);
                    newUserState = true;
                }

            });
    },

    loadUser: function(body) { //get username and password 2. validate username, validate username + password, if not return error. else return SELECT * FROM presentations WHERE userid = result.rows[0].id;
        let input = encrypt.hashCode(body);
        let checkPassword = "";
        let userid
        try {

            pool.query(`SELECT * FROM users WHERE email = $1`, [input.user.username], function(err, result) {
                console.log('Result loadUser id:' + result.rows[0].id);
                checkPassword = result.rows[0].password;
                userid = result.rows[0].id;
            });


            if (checkPassword == input.user.password) {
                pool.query(`SELECT presentationid, data FROM presentations WHERE userid = $1`, [userid], function(err, result) {
                    console.log('Result loadUser id:' + result.rows[0].id);
                    checkPassword = result.rows[0].password;

                    if (err) {
                        console.log("error in pool query2, loadUser: " + err);
                    }


                    let presentations = [];
                    //for() rows add data and presentation id to array;
                });
            }




        } catch (err) {
            console.log("Error on Load user mainFunction:" + err);
            pool.end();
        }

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



}