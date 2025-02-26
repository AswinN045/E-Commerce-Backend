const { Sequelize } = require('sequelize');
const config = require('../../src/config/config');

// Declare sequelize variable in wider scope
let sequelize;

const setupTestDB = () => {
  beforeAll(async () => {
    try {
      // First connect to default postgres database to create test database
      const rootSequelize = new Sequelize({
        dialect: 'postgres',
        host: config.database.host,
        port: config.database.port,
        username: config.database.user,
        password: config.database.password,
        database: 'postgres', // Connect to default postgres database first
        logging: false
      });

      // Try to create the test database with explicit template0 (which should have correct collation)
      await rootSequelize.query('CREATE DATABASE ecommerce_test TEMPLATE template0;').catch(err => {
        // Handle different error cases
        if (err.parent && err.parent.code === '42P04') {
          console.log('Database ecommerce_test already exists, continuing...');
        } else {
          console.log('Error creating database:', err.message);

          // If we still get collation errors, try an alternative approach
          return rootSequelize.query(`
            CREATE DATABASE ecommerce_test 
            TEMPLATE template0 
            LC_COLLATE 'C' 
            LC_CTYPE 'C' 
            ENCODING 'UTF8';
          `).catch(innerErr => {
            if (innerErr.parent && innerErr.parent.code === '42P04') {
              console.log('Database ecommerce_test already exists, continuing...');
            } else {
              console.log('Failed alternative database creation:', innerErr.message);
            }
          });
        }
      });

      await rootSequelize.close();

      // Now connect to the test database after it's been created
      sequelize = new Sequelize({
        dialect: 'postgres',
        host: config.database.host,
        port: config.database.port,
        username: config.database.user,
        password: config.database.password,
        database: 'ecommerce_test',
        logging: false
      });

      // Check if e_commerce schema exists, create if not
      await sequelize.query(`
        CREATE SCHEMA IF NOT EXISTS e_commerce;
      `).catch(err => {
        console.log('Schema creation message:', err.message);
      });

      // Create all tables
      await sequelize.sync({ force: true });
    } catch (error) {
      console.error('Failed to set up test DB:', error);
      throw error;
    }
  });

  beforeEach(async () => {
    await Promise.all(
      Object.values(sequelize.models).map(model =>
        model.destroy({ truncate: true, cascade: true, restartIdentity: true })
      )
    );
  });

  afterAll(async () => {
    try {
      await sequelize.close();

      // Connect to postgres to drop the test database
      const rootSequelize = new Sequelize({
        dialect: 'postgres',
        host: config.database.host,
        port: config.database.port,
        username: config.database.user,
        password: config.database.password,
        database: 'postgres', // Connect to default postgres database
        logging: false
      });

      // Force disconnect all connections to the test DB before dropping
      await rootSequelize.query(`
        SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = 'ecommerce_test'
          AND pid <> pg_backend_pid();
      `);

      await rootSequelize.query('DROP DATABASE IF EXISTS ecommerce_test;');
      await rootSequelize.close();
    } catch (error) {
      console.error('Failed to clean up test DB:', error);
    }
  });

  return sequelize;
};

module.exports = setupTestDB;