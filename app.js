var express = require('express');
var parser  = require('body-parser');
var args    = require('./utils/argparse');
var log     = require('./utils/logger');

// The app
var app = express();

// Args from CLI or defaults
HOST = args.host || '127.0.0.1';
PORT = args.port || 3000;

// Parse body data as JSON
// Requests must be sent with Content-Type:application/json
app.use(parser.json());

// Log request/responses
app.use(log.middleware);


// Routes

app.get('/', (req,res) => {
    res.status(200).jsonp({msg: 'Hello World!'});
});

app.post('/', (req,res) => {
    res.status(200).jsonp({msg: req.body});
});


// Listen on host and port
app.listen(PORT, HOST, () => {
    log.info(`Listening on http://${HOST}:${PORT}`);
});
