var bunyan = require('bunyan');

// Logger Object
module.exports = log = bunyan.createLogger({name:'dummyapp'});

/**
* Stash body content in response.body for the specified function
*/
function stash_body(res, fn){
    var oldfn = res[fn];
    res[fn] = function(data){
        res.body = JSON.parse(JSON.stringify(data)); // Rough clone
        oldfn.call(this, data);
    }
}

/**
 * Logging middleware for Express.js
 * Logs full requests and responses
 * Assumes use of response.json() or response.jsonp()
 */
module.exports.middleware = function(req, res, next){
    // Stash body content in response oject when calling functions
    stash_body(res, 'json');
    stash_body(res, 'jsonp');

    next();
    
    // Log full request/response payloads
    var data = {request:req.body, response:res.body};
    var msg  = [res.statusCode, req.method, req.url].join(' ');
    log.info(data, msg);
}
