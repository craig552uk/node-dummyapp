// 
// Arg Parse
// Author: Craig Russell <craig@craig-russell.co.uk>
// 
// Parse command line arguments into an object
// 
// e.g. 
// > node /apth/to/script.js --foo --bar=baz /path/to/file
// 
// { '0': '/usr/bin/nodejs',
//   '1': '/var/www/nodejs/dummyapp/app.js',
//   '2': '/path/to/file',
//   foo: true,
//   bar: 'baz' }
// 
// Use it like
// var args = require('argparse');
// console.log(args.bar || 'default')

var n = 0, a;
module.exports = {};

process.argv.forEach((v,k) => {
    if(v.match(/^--/)){
        a = v.replace(/^--/,'').split('=');
        k = a[0];
        v = a[1] || true;
    }else{
        k = n++;
    }
    module.exports[k] = v;
});