const { message } = require('../config/config')
const app_axios = axios.create({
    timeout: 60000,
    headers: {
        'Pragma': 'no-cache'
    }
})
app_axios.interceptors.response.use(
    async res => {
        if(res.data.code == 200){
            return Promise.resolve(res)
        }else{
            if(res.data.code == 4000){
                alert(message.loginInvalid)
                window.location.href = "/logout"
            }else if(res.data.code == 4001){
                alert(message.tokenInvalid)
                window.location.href = "/.auth/logout";
            }else{
                if(res.data.code == 4002){
                    alert(message.simError)
                }else if(res.data.code == 4003){
                    alert(message.updateFailed)
                }else if(res.data.code == 4004){
                    alert(message.surveyInsertFailed)
                }else if(res.data.code == 4005){
                    alert(message.logSaveFailed)
                }else if(res.data.code == 4006){
                    alert(message.idIsNotFound)
                }else{
                    alert(message.serverError)
                }
                return Promise.resolve(res)
            }
        }
    },
    async error => {
        console.error('[app_axios] [interceptors] [response] error:', error)
        
        // TODO トーケン　リフレッシュ
        // リフレッシュない、直接logout
        // window.location.href = "/.auth/logout";
        window.location.href = "/logout"
        return Promise.reject(error)

    }
)

module.exports = {
    app_axios
}