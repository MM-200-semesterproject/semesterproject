const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const { Pool, Client } = require('pg');

express()

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

//DATABASE CONNECTIONS - ASK CAROLINE FOR EXPLANATION

//Postgresql Database connection

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,

    ssl: {
        rejectUnauthorized: false
    }
});

//getting data from database(not working yet)
app.use(express.static(path.join(__dirname, 'public')))
    .get('/db', async(req, res) => {
        try {
            console.log(path.join(__dirname, 'public', 'db.html'));
            const client = await pool.connect();
            const result = await client.query('SELECT * FROM users');
            const results = { 'results': (result) ? result.rows : null };
            console.log(results);
            res.sendFile(path.join(__dirname, 'public', 'db.html'), results);
            client.release();
        } catch (err) {
            console.error(err);
            res.send("Error " + err);

        }
    });


//sending data to "users" table in database
let queryString = `
INSERT INTO users(email, password, id)VALUES('MaryAnn@hotmail.com', 'asdfghjkl', 20)
`;
pool.query(queryString, (err, res) => {
    // check if the response is not 'undefined'
    if (res !== undefined) {
        // log the response to console
        console.log("Postgres response:", res);

        // get the keys for the response object
        var keys = Object.keys(res);

        // log the response keys to console
        console.log("\nkeys type:", typeof keys);
        console.log("keys for Postgres response:", keys);
    }
});


app.listen(app.get('port'), function() { console.log('server running', app.get('port')) });