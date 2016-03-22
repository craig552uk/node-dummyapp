var express   = require('express');
var parser    = require('body-parser');
var args      = require('./utils/argparse');
var log       = require('./utils/logger');
var httperror = require('./utils/httperror');

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
app.use('/api/echo',      common.echo);
app.use('/api/error',     common.error);
app.use('/api/httperror', common.httpError);

// 404 Handler
app.use((req, res, next) => {throw httperror.NotFound()});

// Error Handler
app.use((err, req, res, next) => {

    if(err.name !== 'HTTPError'){
        // Only log application errors
        log.error(err);

        // Respond with InternalServerError
        err = httperror.InternalServerError(err.message);
    }

    // JSONAPI error response
    res.status(err.code).jsonp({errors: [
        {status: err.code, title: err.message, detail: err.description}
    ]});
});

// Listen on host and port
app.listen(PORT, HOST, () => {
    log.info(`Listening on http://${HOST}:${PORT}`);
});
