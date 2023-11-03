const sequelize = require('./index');
const {DataTypes} = require('sequelize');

const Demo = sequelize.define('demo', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    chatId: {type: DataTypes.STRING},
    author: {type: DataTypes.STRING},
    filename: {type: DataTypes.STRING},
    type: {type: DataTypes.STRING},
    link: {type: DataTypes.STRING, unique: true},
    date: {type: DataTypes.STRING},
    trackname: {type: DataTypes.STRING},
    messageId: {type: DataTypes.INTEGER},
})

module.exports = Demo;