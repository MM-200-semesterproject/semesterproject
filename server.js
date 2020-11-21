const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/dbUpdates.js');

const pool = require('./db/pool.js');
//Getting modules instanced
const app = express();
const path = require('path');
const { loadUser } = require('./db/pool.js');

app.set('port', process.env.PORT || 8080);
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(express.json());

app.post('/presentation', (req, res) => {
    let presentation = {
        elements: req.body,
    };

    res.status(200).json(presentation);
    return;
});

app.post('/signUp', function(request, response) {
    // Sends object to pool.js-->DB;
    try {
        pool.newUser(request.body);
        response.status(200).send('User created');
        return;
    } catch (error) {
        response.send(error + ' Try again');
        return;
    }
});

app.post('/log-in', function(request, response) {
    // Sends object to pool.js-->DB;
    try {
        pool.loadUser(request.body);
        response.status(200).send('logged in');
        return;
    } catch (error) {
        response.send(error + ' Try again');
        return;
    }
});

app.get('/create-user', function(request, res) {
    res.sendFile(path.join(__dirname, 'public', 'sign-up-copy.html'));
});
app.listen(app.get('port'), function() {
    console.log('server running', app.get('port'));
});