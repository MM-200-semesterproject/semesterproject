const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/dbUpdates.js');

const pool = require('./db/pool.js');
//Getting modules instanced
const app = express();
const path = require('path');

app.set('port', process.env.PORT || 8080);
app.use(express.static('public'));
app.use(
  express.static(path.join(__dirname, 'public'), { index: 'login.html' })
);
app.use(bodyParser.json());
app.use(express.json());

app.post('/presentation', (req, res) => {
  let presentation = {
    presentationid: req.body.presentationid,
    title: req.body.title,
    slides: req.body.slides,
  };
  res.status(200).json(presentation);
  return;
});

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

// const auth = async function (request, response, next) { //Ikke slett, skal brukes senere
//   let result = await pool.loadUser(request.body);
//   request.result = result;
//   if (result instanceof Error) {
//     response.status(400).json(result);
//     return;
//   } else {
//     next();
//   }
// };

// app.use(auth);

app.post('/login', async function (request, response) {
  console.log('next succsesfull');
  response.status(200).send('hei');
});

app.listen(app.get('port'), function () {
  console.log('server running', app.get('port'));
});
