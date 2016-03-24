var DB = require('../utils/sequelize');

User = DB.sequelize.define('users', {
    id:       {type: DB.Sequelize.UUID,   primaryKey: true, defaultValue: DB.Sequelize.UUIDV4},
    username: {type: DB.Sequelize.STRING, allowNull: false, unique: true},
    password: {type: DB.Sequelize.STRING, allowNull: false},
    name:     DB.Sequelize.STRING,
});

module.exports = User;