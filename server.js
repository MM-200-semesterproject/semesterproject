const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/dbUpdates.js');

const pool = require('./db/pool.js');
//Getting modules instanced
const app = express();
const path = require('path');
const { ppid } = require('process');

app.set('port', process.env.PORT || 8080);
app.use(express.static('public'));
app.use(
  express.static(path.join(__dirname, 'public'), { index: 'login.html' })
);
app.use(bodyParser.json());
app.use(express.json());

app.post('/signUp', async function (request, response) {
  // Sends object to pool.js-->DB;
  let result = await pool.newUser(request.body);
  if (result instanceof Error) {
    if (!result.statusCode) {
      response.status(500).json(result);
      return;
    }
    response.statusMessage = result.message;
    response.status(result.statusCode).end();
    return;
  } else {
    response.status(200).json(result);
    return;
  }
});

app.post('/login', async function (request, response) {
  let result = null;
  if (request.body.returnAccessToken) {
    const userCredentials = {
      username: request.body.username,
      password: request.body.password,
    };
    result = await pool.loadUser(userCredentials, true);
  } else {
    result = await pool.loadUser(request.body);
  }
  if (result instanceof Error) {
    response.status(400).json(result);
    return;
  } else {
    response.status(200).json(result);
    return;
  }
});

app.post('/deleteUser', async function (request, response) {
  let result = null;
  result = await pool.deleteUser(request.body);
  if (result instanceof Error) {
    response.status(400).json(result);
    return;
  } else {
    response.status(200).json(result);
    return;
  }
});

app.post('/load-presentations', async function (request, response) {
  let result = null;
  result = await pool.loadPres(request.body);
  if (result instanceof Error) {
    response.status(400).json(result);
    return;
  } else {
    console.log(result);
    response.status(200).json(result);
    return;
  }
});

app.post('/create-presentation', async function (request, response) {
  let result = null;
  result = await pool.createPres(request.body);
  if (result instanceof Error) {
    response.status(400).json(result);
    return;
  } else {
    response.status(200).json(result);
    return;
  }
});

app.post('/update-presentation', async function (request, response) {
  //on "save presentation" in editMode.html
  console.log('I am inside /update-presentation in server.js');
  response.status(200).send('hei from update-presentation in server.js');
});

app.post('/delete-presentation', async function (request, response) {
  //on "save presentation" in editMode.html
  console.log('I am inside /delete-presentation in server.js');
  response.status(200).send('hei from delete-presentation in server.js');
});

app.listen(app.get('port'), function () {
  console.log('server running', app.get('port'));
});
