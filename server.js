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
app.use(bodyParser.json({ limit: '50mb' }));
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  })
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

app.post('/updateUser', async function (request, response) {
  let result = null;
  result = await pool.updateUser(request.body);
  if (result instanceof Error) {
    response.statusMessage = result.message;
    response.status(400).json(result.message);
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

app.get(
  '/editMode.html/viewMode/:presentationid',
  async function (request, response) {
    //response.sendFile(path.join(__dirname, 'public'), viewMode.html);

    response.status(200).send('ASDASD');
    /**/
  }
);

app.post('/update-presentation', async function (request, response) {
  let result = null;
  result = await pool.updatePres(request.body);
  if (result instanceof Error) {
    response.status(400).json(result);
    return;
  } else {
    response.status(200).json(result);
    return;
  }
});

app.post('/delete-presentation', async function (request, response) {
  let result = null;
  result = await pool.deletePres(request.body);
  if (result instanceof Error) {
    response.status(400).json(result);
    return;
  } else {
    response.status(200).json(result);
    return;
  }
});

app.listen(app.get('port'), function () {
  console.log('server running', app.get('port'));
});
