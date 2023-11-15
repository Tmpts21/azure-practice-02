const mssql = require('mssql')
const pools = new Map()
const log = require('./winston-log-util')
const { dbConfig } = require('../authConfig')
const { fail } = require('./response-util')

var config = {
  user: dbConfig.config.user,
  password: dbConfig.config.password,
  server: dbConfig.config.host,
  database: dbConfig.config.database,
  port: dbConfig.config.port,
  options: {
    encrypt: true, // use this if you're on azure
    // trustServerCertificate: true
  },
  pool: {
    min: 0,
    max: 10
    // idletimeoutmillis: 10000
  }
};

module.exports = {

get: async (name) => {  
       try {
            const connection = await mssql.connect(config);
            log.info('[sqlserver] [Connect DB] Connection established successfully');
            return connection;
        } catch (err) {
            log.error('[sqlserver] [Connect DB] error:', fail('DbConnectError', err));
        }
  }
};