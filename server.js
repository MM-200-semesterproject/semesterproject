const express = require('express');
const bodyParser = require('body-parser');
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

app.post('/public-list', async function (request, response) {
  let result = null;
  result = await pool.publicPres(request.body);
  if (result instanceof Error) {
    response.status(400).json(result);
    return;
  } else {
    response.status(200).json(result);
    return;
  }
});

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
