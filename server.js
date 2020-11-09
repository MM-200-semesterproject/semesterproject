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
app.use(express.json()); //parser JSON bodies sent by Clients


//Getting presentation array from client (?)
app.post('/presentation', (req, res) => {
    let presentation = {
        elements: req.body,
    }

    res.status(200).json(presentation);
    return
})

//method accessed in sign-up-copy.html
app.post('/signUp', function(request, response) {
    // Sends object to pool.js-->DB;
    pool.newUser(request.body);
    // JSON text --> validation in signUp.html? Skal det være en email eller kan det være hva som helst? --> sendes til encryption before database
    // response.send(request.body); // echo the result back
});


app.get('/create-user', function(request, res) {
    res.sendFile(path.join(__dirname, 'public', 'sign-up-copy.html'));
})

// encryption-script:
//console.log(encrypt.hashCode('MaryAnn@hotmail.com'));


app.listen(app.get('port'), function() { 
    console.log('server running', app.get('port')) 
});