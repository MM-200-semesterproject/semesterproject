const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/dbUpdates.js');
const encrypt = require('./modules/encryption.js');
const { Pool, Client } = require('pg');
//Getting modules instanced
const app = express();

app.set('port', (process.env.PORT || 8080));
app.use(express.static('\public'));
app.use(bodyParser.json())


app.post('/presentation', (req, res) => {
    let presentation = {
        elements: req.body,
    }

    res.status(200).json(presentation);
    return
})

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Access the parse results as request.body
app.post('/signUp', function(request, response) {
    console.log(request.body); // JSON text --> validation in signUp.html? Skal det være en email eller kan det være hva som helst? --> sendes til encryption before database
    response.send(request.body); // echo the result back
});

app.get('/create-user', function(request, response) {
    location.href("./public/sign-up-copy.html");
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

console.log(encrypt.hashCode('MaryAnn@hotmail.com'));

//let queryString = //db.createUser('MaryAnn@hotmail.com', 'asdfghjkl'); //db.createUser("exaplme@email.com", "passwordEx");
//sending data to "users" table in database
pool.query("INSERT INTO users(Email, Password) VALUES('hanna@post.no', '1234') RETURNING id",
    function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log('row inserted with id: ' + result.rows[0].id);
        }
        console.log('Client will end now!!!');
        pool.end();

    });


app.listen(app.get('port'), function() { console.log('server running', app.get('port')) });