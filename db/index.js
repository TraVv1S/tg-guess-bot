const {Sequelize} = require('sequelize');

module.exports = new Sequelize (
    'postgres',
    'postgres',
    process.env.DB_PASS,
    {
        host: process.env.DB_IP,
        port: process.env.DB_PORT,
        dialect: 'postgres'
    }
)