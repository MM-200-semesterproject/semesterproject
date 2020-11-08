const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/dbUpdates.js');
const encrypt = require('./modules/encryption.js');
const pool = require('./db/pool.js');
//Getting modules instanced
const app = express();
const path = require('path');

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
    console.log(request.body);
    pool.newUser(request.body);
    // JSON text --> validation in signUp.html? Skal det være en email eller kan det være hva som helst? --> sendes til encryption before database
    response.send(request.body); // echo the result back
});

app.get('/create-user', function(request, res) {
    res.sendFile(path.join(__dirname, 'public', 'sign-up-copy.html'));
})


//DATABASE CONNECTIONS-------------------------------
//---------------------------------------------------



//console.log(encrypt.hashCode('MaryAnn@hotmail.com'));


app.listen(app.get('port'), function() { console.log('server running', app.get('port')) });