var bcrypt = require('bcrypt');
var DB     = require('../utils/sequelize');

User = DB.sequelize.define('users', {
    id:       {type: DB.Sequelize.UUID,   primaryKey: true, defaultValue: DB.Sequelize.UUIDV4},
    username: {type: DB.Sequelize.STRING, allowNull: false, unique: true},
    password: {type: DB.Sequelize.STRING, allowNull: false, set: setPassword},
    name:     DB.Sequelize.STRING,
}, {
    instanceMethods: {
        checkPassword: checkPassword
    },
    classMethods: {
        authenticate: authenticate
    },
});

/**
 * Encrypt and store the password
 */
function setPassword(password){
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    return this.setDataValue('password', hash);
}

/**
 * Validate encrypted password
 */
function checkPassword(password){
    return bcrypt.compareSync(password, this.password);
}

/**
 * Attempt to authenticate a user
 */
function authenticate(username, password){
    return User.findOne({where:{username:username}}).then(u => {
        return (u && u.checkPassword(password)) ? u : undefined;
    });
}

module.exports = User;