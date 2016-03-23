var DB = require('../utils/sequelize');

User = DB.sequelize.define('users', {
    username: {type: DB.Sequelize.STRING, allowNull: false, unique: true},
    password: {type: DB.Sequelize.STRING, allowNull: false},
    name:     DB.Sequelize.STRING,
});

module.exports = User;