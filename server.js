const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/dbUpdates.js');

const pool = require('./db/pool.js');
//Getting modules instanced
const app = express();
const path = require('path');
const { loadUser } = require('./db/pool.js'); //Du trenger ikke denne her, bare bruk pool.loadUser();

app.set('port', process.env.PORT || 8080);
app.use(express.static('public'));
app.use(
  express.static(path.join(__dirname, 'public'), { index: 'login.html' })
);
app.use(bodyParser.json());
app.use(express.json());

app.post('/presentation', (req, res) => {
  let presentation = {
    elements: req.body,
  };

  res.status(200).json(presentation);
  return;
});

app.post('/signUp', async function (request, response) {
  // Sends object to pool.js-->DB;
  let result = await pool.newUser(request.body);
  if (result instanceof Error) {
    response.status(500).send(result + ' Try again');
    return;
  } else {
    response.status(200).json({
      msg: 'User created',
    });
    return;
  }
});

app.post('/login', async function (request, response) {
  let result = await pool.loadUser(request.body);
  if (result instanceof Error) {
    response.status(500).send(result + ' Try again');
    return;
  } else {
    response.status(200);
    return;
  }
});

app.listen(app.get('port'), function () {
  console.log('server running', app.get('port'));
});
