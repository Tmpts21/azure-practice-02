require('dotenv').config()

const dbConfig = {
    config:{
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        database: process.env.DB_DATABASE
    },
    table:{
        search_table: process.env.DB_SCHEMA + '.' + process.env.DB_T_SEARCH_HISTORY,  
        survey_table: process.env.DB_SCHEMA + '.' + process.env.DB_T_SURVEY,
        evaluation_table: process.env.DB_SCHEMA + '.' + process.env.DB_T_EVALUATION,
        log_table: process.env.DB_SCHEMA + '.' + process.env.DB_T_LOG,
    }
}

const simConfig = {
    uri_auth: `${process.env.SIM_HOST}/api/v1/auth/login`,
    uri_facet: `${process.env.SIM_HOST}/api/v1/analysis/${process.env.SIM_COLLECTION_ID}/facetQuery`, //sim server facetQuery api
    uri_document: `${process.env.SIM_HOST}/api/v1/analysis/${process.env.SIM_COLLECTION_ID}/documentQuery`, //sim server documentQuery api
    name: process.env.SIM_NAME,
    pwd: process.env.SIM_PWD,
    collection_id: process.env.SIM_COLLECTION_ID
}

module.exports = {
    dbConfig,
    simConfig
}