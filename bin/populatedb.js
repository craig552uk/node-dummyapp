var DB   = require('../utils/sequelize');
var User = require('../models/users');


// var drop_tables = true;
var drop_tables = false;

DB.sequelize.sync({force: drop_tables}).then(() => {
    return User.create({
        username: 'craig',
        name: 'Craig Russell',
        password: 'passw0rd',
    });
}).then((craig) => {
    log.info({user:craig.jsonapi()}, "Created User");
}).catch(err => {
    log.error(err);
})