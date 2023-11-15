const { fail } = require('../util/response-util')

function middleware(env){
    return function(req, res, next){
        const { method, url } = req
        if(env == 'dev'){
            if(method == 'GET'){
                if(url == '/' && !req.session.username){
                    res.redirect('/login')
                }else{
                    next()
                }
            }else{
                if(req.session.username || url.startsWith('/login')){
                    next()
                }else{
                    res.send(fail('ForbiddenError'))
                }
            }
        }else{
            if(req.headers['x-ms-token-aad-id-token']){
                next()
            }else{
                res.send(fail('InvalidTokenError'))
            }
        }
    }
}

module.exports = middleware