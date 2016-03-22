// 
// Route handlers for common tasks
// 

var httperror = require('../utils/httperror');

/**
 * Echos server request back as JSON
 */
module.exports.echo = function(req, res){
    res.jsonp({
        method:  req.method, 
        url:     req.url,
        headers: req.headers,
        body:    req.body,
    });
}

/**
 * Throw an error for testing
 */
module.exports.error = function(req, res){
    throw Error(req.query.message || "Error!");
}

/**
 * Throw an HTTP error for testing
 */
module.exports.httpError = function(req, res){
    throw httperror.ImATeapot('Short and Stout');
}