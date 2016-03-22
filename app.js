var express = require('express');
var parser  = require('body-parser');
var args    = require('./utils/argparse');
var log     = require('./utils/logger');

// Args from CLI or defaults
HOST = args.host || '127.0.0.1';
PORT = args.port || 3000;

// Load and configure app
var app = express();
app.use('/', express.static('static')); // Serve static files from root
app.use(parser.json());                 // Parse request data as JSON
app.use(log.middleware);                // Log request/responses

// Route Handlers
var common = require('./routes/common');

// Routes
app.use('/api/echo',  common.echo);
app.use('/api/error', common.error);


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
