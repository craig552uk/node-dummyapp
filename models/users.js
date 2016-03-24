var DB = require('../utils/sequelize');

User = DB.sequelize.define('users', {
    id:       {type: DB.Sequelize.UUID,   primaryKey: true, defaultValue: DB.Sequelize.UUIDV4},
    username: {type: DB.Sequelize.STRING, allowNull: false, unique: true},
    password: {type: DB.Sequelize.STRING, allowNull: false, set: setPassword},
    name:     DB.Sequelize.STRING,
});

/**
 * Encrypt a string
 */
function encrypt(plaintext){
    // TODO Not this.
    return plaintext+Math.random();
}

/**
 * Encrypt and store the password
 */
function setPassword(password){
    return this.setDataValue('password', encrypt(password));
}

module.exports = User;