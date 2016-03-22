var express = require('express');
var parser  = require('body-parser');
var args    = require('./utils/argparse');
var log     = require('./utils/logger');

// The app
var app = express();

// Args from CLI or defaults
HOST = args.host || '127.0.0.1';
PORT = args.port || 3000;

app.use(parser.json());  // Parse request data as JSON
app.use(log.middleware); // Log request/responses

// Serve static files from root
// Should be handled by NGinx in production
app.use('/', express.static('static'));

// Routes

app.get('/api/', (req, res) => {
    res.jsonp({msg: 'Hello World!'});
});

app.post('/api/', (req, res) => {
    res.jsonp({msg: req.body});
});

app.get('/api/500', (req, res) => {
    throw Error(req.query.message || "Error!");
});

// 404 Handler
app.use((req, res, next) => {
    res.status(404).jsonp({error: "Not Found"})
});

// Error Handler
app.use((err, req, res, next) => {
    log.error(err);
    res.status(500).jsonp({error: err.message});
});

// Listen on host and port
app.listen(PORT, HOST, () => {
    log.info(`Listening on http://${HOST}:${PORT}`);
});
