const express = require('express');
const bodyParser = require('body-parser');

//Getting modules instanced
const app = express();

app.set('port', (process.env.PORT || 8080));
app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/presentation', (req, res) => {
    let presentation = {
        elements: req.body,
    }

    res.status(200).json(presentation);
    return
})


app.listen(app.get('port'), function () { console.log('server running', app.get('port'))});