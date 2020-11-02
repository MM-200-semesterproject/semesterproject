const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

//Postgresql Database connection
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

express()

app.set('port', (process.env.PORT || 8080));
app.use(express.static('\public'));
app.use(bodyParser.json());


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
            // let route = path.join(__dirname, 'public');
            //console.log(route);
        }
    });

app.post('/presentation', (req, res) => {
    let presentation = {
        elements: req.body,
    }

    res.status(200).json(presentation);
    return
})


app.listen(app.get('port'), function() { console.log('server running', app.get('port')) });