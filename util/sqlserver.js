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
    encrypt: false, // use this if you're on azure
    // trustServerCertificate: true
  },
  pool: {
    min: 0,
    max: 10
    // idletimeoutmillis: 10000
  }
};

module.exports = {

  /**
   * Get or create a pool. If a pool doesn't exist the config must be provided.
   * If the pool does exist the config is ignored (even if it was different to the one provided
   * when creating the pool)
   *
   * @param {string} name
   * @param  [config]
   * @return {Promise.<mssql.ConnectionPool>}
   */
  get: (name) => {
   if (!pools.has(name)) {
    if (!config) {
     throw new Error('Pool does not exist');
    }
    const pool = new mssql.ConnectionPool(config, (err) => {
      if(err) {
        log.error('[sqlserver] [DB] [Connect DB] error:', fail('DbConnectError', err));
      }
    });
    // automatically remove the pool from the cache if `pool.close()` is called
    const close = pool.close.bind(pool);
    pool.close = (...args) => {
     pools.delete(name);
     return close(...args);
    }
    pools.set(name, pool.connect());
   }
   return pools.get(name);
  },

  /**
   * Closes all the pools and removes them from the store
   *
   * @return {Promise<mssql.ConnectionPool[]>}
   */
  closeAll: () => Promise.all(Array.from(pools.values()).map((connect) => {
   return connect.then((pool) => pool.close());
  }))

};