const express = require('express');
const bodyParser = require('body-parser');
//const db = require('modules/dbUpdates.js');
const crypt = require('./modules/encryption.js');
const { Pool, Client } = require('pg');
//Getting modules instanced
const app = express();

app.set('port', (process.env.PORT || 8080));
app.use(express.static('\public'));
app.use(bodyParser.json());

app.post('/presentation', (req, res) => {
    let presentation = {
        elements: req.body,
    }

    res.status(200).json(presentation);
    return
})

//DATABASE CONNECTIONS-------------------------------
//---------------------------------------------------

//Postgresql Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

console.log(crypt.hashCode("password"));
/*
let queryString = ''; //db.createUser("exaplme@email.com", "passwordEx");
//sending data to "users" table in database
pool.query(queryString, (err, res) => {
    // check if the response is not 'undefined'
    if (res !== undefined) {
        // log the response to console
        console.log(result.rows)
            // get the keys for the response object
        let keys = Object.keys(res);
        // log the response keys to console
        console.log("\nkeys type:", typeof keys);
        console.log("keys for Postgres response:", keys);
    } else { console.log(err); }
});
*/

app.listen(app.get('port'), function() { console.log('server running', app.get('port')) });