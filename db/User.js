const sequelize = require('./index');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    userName: {type: DataTypes.STRING, unique: true},
    chatId: {type: DataTypes.STRING, unique: true},
});

module.exports = User;