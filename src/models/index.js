const Sequelize = require('sequelize');
const { database } = require('../config/config');
const logger = require('../config/logger')
const pg = require("pg");

pg.types.setTypeParser(pg.types.builtins.INT8, (value) => {
    return parseInt(value, 10);
});

const sequelize = new Sequelize(database.database, database.user, database.password, { dialect: 'postgres', logging: false });

sequelize.createSchema('e_commerce', { ifNotExists: true })
    .then(() => {
        logger.info('Schema "e_commerce" has been created')
    })
    .catch((error) => {
        if (error.message.includes('schema "e_commerce" already exists')) {
            logger.info('Schema e_commerce already exists.');
        } else {
            logger.error('Error creating schema:', error);
        }
    });

const models = {
    sequelize,
    Users: require('./user.model')(sequelize, Sequelize.DataTypes),
    Products: require('./product.model')(sequelize, Sequelize.DataTypes),
    Categories: require('./product.model')(sequelize, Sequelize.DataTypes)

};

Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});


module.exports = models;