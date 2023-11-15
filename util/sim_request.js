var axios = require('axios')
const { simConfig } = require('../authConfig')
const log = require('./winston-log-util')

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

let sim_access_token = ''
createSimToken()

const sim_axios = axios.create({
    timeout: 180000,
    headers: {
        'Content-Type': 'application/json'
    }
})

sim_axios.interceptors.request.use(
    config  => {
        if(sim_access_token){
            config.headers.Authorization= 'Bearer ' + sim_access_token
        }
        return config
    },
    error => {
        log.error('[sim_axios] [SIM] [interceptors] [request] error:', error)
        return Promise.reject(error)
    }
)

sim_axios.interceptors.response.use(
    async res => {
        return Promise.resolve(res)
    },
    async error => {
        if(error.code == 'ETIMEDOUT'){
            log.error('[sim_axios] [SIM] [interceptors] [response] error:', error)
            return Promise.reject(error)
        }else if(error.response.status == 401){
            if(sim_access_token){
                const token_res = await createSimToken()
                if(token_res){
                    const res = await sim_axios(error.config)
                    return Promise.resolve(res)
                }else{
                    log.error('[sim_axios] [SIM] [interceptors] [response] error:', error)
                    return Promise.reject(error)    
                }
            }else{
                log.error('[sim_axios] [SIM] [interceptors] [response] error:', error)
                return Promise.reject(error)    
            }
        }else{
            log.error('[sim_axios] [SIM] [interceptors] [response] error:', error)
            return Promise.reject(error)
        }
    }
)

async function createSimToken(){
    try {
        const sim_uri = simConfig.uri_auth;
        const result = await axios({
            method: 'POST',
            url: sim_uri,
            'headers': {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer'
            },
            data: {
                name: simConfig.name,
                pwd: simConfig.pwd,
                remeberUsername: false
            }
        })

        if(result.data.success){
            log.info('[service] [createSimToken] end result:',JSON.stringify(result.data))
            sim_access_token = result.data.data.access_token
            return true
        }else{
            log.error('[service] [createSimToken] end result:',JSON.stringify(result.data))
            return false
        }
    } catch (error) {
        log.error('[service] [SIM] [createSimToken] error:', error)
        return false
    }
}

module.exports = {
    sim_axios
}