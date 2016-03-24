'use strict';
/**
 * Helper library to create HTTP Status Responses as Errors
 */

var util = require('util');

var HTTPError = function(code, message, description){
    // Error.captureStackTrace(this, HTTPError);
    this.name        = 'HTTPError';
    this.code        = code;
    this.message     = message;
    this.description = description;
    return this;
}

util.inherits(HTTPError, Error);

exports.HTTPError = HTTPError;

/**
 * Map other errors onto HTTP errors
 */
exports.getAppropriateHTTPError = function(err){
    switch(err.name){
        case 'HTTPError':
            return err;
        case 'SequelizeValidationError': 
        case 'SequelizeUniqueConstraintError': 
        case 'SequelizeExclusionConstraintError': 
        case 'SequelizeForeignKeyConstraintError': 
            return exports.BadRequest(err.message);
        default:
            return exports.InternalServerError(err.message);
    }
}

exports.BadRequest = function(detail){
    return new HTTPError(400, "Bad Request", detail);
};

exports.Unauthorized = function(detail){
    return new HTTPError(401, "Unauthorized", detail);
};

exports.Forbidden = function(detail){
    return new HTTPError(403, "Forbidden", detail);
};

exports.NotFound = function(detail){
    return new HTTPError(404, "Not Found", detail);
};

exports.MethodNotAllowed = function(detail){
    return new HTTPError(405, "Method Not Allowed", detail);
};

exports.NotAcceptable = function(detail){
    return new HTTPError(406, "Not Acceptable", detail);
};

exports.ProxyAuthenticationRequired = function(detail){
    return new HTTPError(407, "Proxy Authentication Required", detail);
};

exports.RequestTimeout = function(detail){
    return new HTTPError(408, "Request Timeout", detail);
};

exports.Conflict = function(detail){
    return new HTTPError(409, "Conflict", detail);
};

exports.Gone = function(detail){
    return new HTTPError(410, "Gone", detail);
};

exports.LengthRequired = function(detail){
    return new HTTPError(411, "Length Required", detail);
};

exports.PreconditionFailed = function(detail){
    return new HTTPError(412, "Precondition Failed", detail);
};

exports.PayloadTooLarge = function(detail){
    return new HTTPError(413, "Payload Too Large", detail);
};

exports.URITooLong = function(detail){
    return new HTTPError(414, "URI Too Long", detail);
};

exports.UnsupportedMediaType = function(detail){
    return new HTTPError(415, "Unsupported Media Type", detail);
};

exports.RangeNotSatisfiable = function(detail){
    return new HTTPError(416, "Range Not Satisfiable", detail);
};

exports.ExpectationFailed = function(detail){
    return new HTTPError(417, "Expectation Failed", detail);
};

exports.ImATeapot = function(detail){
    return new HTTPError(418, "I'm a teapot", detail);
};

exports.UpgradeRequired = function(detail){
    return new HTTPError(426, "Upgrade Required", detail);
};

exports.InternalServerError = function(detail){
    return new HTTPError(500, "Internal Server Error", detail);
};

exports.NotImplemented = function(detail){
    return new HTTPError(501, "Not Implemented", detail);
};

exports.BadGateway = function(detail){
    return new HTTPError(502, "Bad Gateway", detail);
};

exports.ServiceUnavailable = function(detail){
    return new HTTPError(503, "Service Unavailable", detail);
};

exports.GatewayTimeout = function(detail){
    return new HTTPError(504, "Gateway Time-out", detail);
};

exports.HTTPVersionNotSupported = function(detail){
    return new HTTPError(505, "HTTP Version Not Supported", detail);
};