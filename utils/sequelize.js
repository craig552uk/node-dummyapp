var log       = require('./logger');
var Sequelize = require('sequelize');

log = log.child({scope:"Sequelize"});

var config = {
    database: 'node_test',
    username: 'root',
    password: 'passw0rd',
    hostname: 'localhost',
    dialect:  'mysql',
}

log.info({config: config});

/**
 * Return an object representation formatted for a jsonapi response
 */
function jsonapi(){
    var modelName = this.$modelOptions.name.plural;
    var host = 'https://app.craig-russell.co.uk';
    return {
        type:       modelName,
        id:         this.id,
        properties: this.dataValues,
        links:{
            self: `${host}/api/${modelName}/${this.id}/`
        }
    }
}

// Construct instance with connection config and model defaults
var sequelize = new Sequelize(config.database, config.username, config.password, {
    host:    config.hostname,
    dialect: config.dialect,
    logging: function(msg){ log.info(msg); },
    define: {
        instanceMethods: {
            jsonapi: jsonapi
        }
    }
});

module.exports.Sequelize = Sequelize;
module.exports.sequelize = sequelize;