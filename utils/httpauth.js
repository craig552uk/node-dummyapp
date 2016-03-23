
/**
 * Extract Basic Auth cfedentials from Header
 * And store in request object
 */
module.exports.basic = function(req, res, next){
    // Extract credentials from Header
    var creds = req.headers.authorization || '';
    creds = creds.replace(/^Basic /,'') || '';
    creds = new Buffer(creds, 'base64').toString()
    creds = creds.split(':');
    creds = {username:creds[0] || '', password:creds[1] || ''}

    // Store credentials in request object
    req.credentials = creds;
    next();
}