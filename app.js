var express   = require('express');
var parser    = require('body-parser');
var args      = require('./utils/argparse');
var log       = require('./utils/logger');
var httpauth  = require('./utils/httpauth');
var httperror = require('./utils/httperror');
var DB        = require('./utils/sequelize');

// Args from CLI or defaults
HOST = args.host || '127.0.0.1';
PORT = args.port || 3000;

// Load and configure app
var app = express();
app.use('/', express.static('static')); // Serve static files from root
app.use(parser.json());                 // Parse request data as JSON
app.use(httpauth.basic);                // Extract HTTP basic auth header
app.use(log.middleware);                // Log request/responses

// Route Handlers
var common = require('./routes/common');

// Restrict API to authenticated users
app.use('/api/', function(req, res, next){
    if(req.credentials.username != 'user' || req.credentials.password != 'passw0rd'){
        throw httperror.Unauthorized("Incorrect user name and/or password");
    }
    next();
});

// Useful Testing Routes
app.use('/api/echo',      common.echo);
app.use('/api/error',     common.error);
app.use('/api/httperror', common.httpError);

// JSON API dynamic routes
var models = ['users'].join('|');
app.use('/api/:model('+models+')/:id([0-9a-z\-]+)/?$', DB.handleItem);
app.use('/api/:model('+models+')/?$',                  DB.handleItems);

// Not Found
app.use((req, res, next) => {throw httperror.NotFound()});

// Error Handler
app.use((err, req, res, next) => {
    if(err.name != 'HTTPError') log.error(err);
    err = httperror.getAppropriateHTTPError(err);
    res.status(err.code).jsonp({errors: [
        {status: err.code, title: err.message, detail: err.description}
    ]});
});

// Listen on host and port
app.listen(PORT, HOST, () => {
    log.info(`Listening on http://${HOST}:${PORT}`);
});
