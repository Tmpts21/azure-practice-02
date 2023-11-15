var express = require("express")
var compression = require('compression')
var bodyParser = require('body-parser')
var session = require('express-session');
const { simConfig } = require('./authConfig')
const log = require('./util/winston-log-util')
const common = require('./util/common-util');
const mssqlUtil = require('./util/mssql-util');
const dbFiledDefaultConf = require('./config/dbFiledDefault_conf')
const sim_reqest = require('./util/sim_request')
const { success, fail } = require('./util/response-util')
const auth = require('./auth/auth')
const userConf = require('./config/user_conf')
const showSingleWord = require('./views/tablet/config/config').showSingleWord

var app = express();
app.use(compression())
// load UI from public folder
app.use(express.static('./views'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

if(process.env.ENV == 'dev'){
    app.use(session({
        secret: '4734F2C3-F993-4308-8CD2-A133CB5FD187',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1 * 24 * 60 * 60 * 1000// milli sec
        },
    }))

    app.use(auth(process.env.ENV))

    app.get('/login', function(req, res) {
        res.sendFile(__dirname + '/views/tablet/login.html')   
    })

    app.get('/loginerror', function(req, res) {
        res.sendFile(__dirname + '/views/tablet/loginerror.html')
    })

    app.post('/login', function(req, res) {
        log.info('[service] [login] start param:',JSON.stringify(req.body))
        if(userConf['users'][req.body.username] && req.body.password == userConf['users'][req.body.username]){
            req.session.username = req.body.username
            res.redirect('/')
        }else{
            res.redirect('/loginerror')
        }
    });

    app.get('/logout', function(req, res) {
        req.session.username = null
        res.redirect('/login')
    });


    //get user info
    app.post('/getUserInfo', async(req, res) => {
        res.header('Content-Type', 'application/json')
        try {
            log.info('[service] [getUserInfo] start param:',req.session.username)
            const result = {
                username: req.session.username,
                name: req.session.username
            }
            log.info('[service] [getUserInfo] end result:',JSON.stringify(result))
            res.json(success(result))
        } catch (error) {
            log.error('[service] [getUserInfo] error:',error)
            res.json(fail())
        }
    });

}else{
    app.get('/logout', function(req, res) {
        res.redirect('/.auth/logout')
    });

    //get user info
    app.post('/getUserInfo', async(req, res) => {
        res.header('Content-Type', 'application/json')
        try {
            const idToken = req.headers['x-ms-token-aad-id-token']
            log.info('[service] [getUserInfo] start param:',JSON.stringify(idToken))
            const buf = Buffer.from(idToken.split('.')[1], 'base64')
            const payload = JSON.parse(buf)
    
            const result = {
                username: payload.unique_name ? payload.unique_name : payload.email,
                name: payload.name
            }
            log.info('[service] [getUserInfo] end result:',JSON.stringify(result))
            res.json(success(result))
        } catch (error) {
            log.error('[service] [getUserInfo] error:',error)
            res.json(fail())
        }
    });
}

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/tablet/index.html');
});

//DB API: insert survey to tablet
app.post('/insertSurvey', async(req, res) => {
    res.header('Content-Type', 'application/json');
    try {
        const params = req.body
        log.info('[service] [insertSurvey] start param:',JSON.stringify(params))
        params.insertDate = common.getNowTime().nTime

        const sqlValueArray = []
        const inputParams = []
        dbFiledDefaultConf.survey_inerst.forEach(item => {
            sqlValueArray.push('@' + item.key)
            const value = params[item.key] || params[item.key] == 0 ? params[item.key] : ''
            inputParams.push({
                key: item.key,
                type: item.type,
                length: item.length,
                value: value
            })
        })

        log.trace(params.username + "," + params.insertDate + "," + '類似' + "のアンケート登録")
        const result =  await mssqlUtil.saveSurveyComment({
            sqlValueArray,
            inputParams
        })
        
        if(result.code == 200){
            loghandle({
                'searchid': params.searchid,
                'groupid': params.groupid,
                'isclick': '0',
                'username': params.username
            })
        }
        log.info('[service] [insertSurvey] end result:',JSON.stringify(result))
        if(result.code === 200) {
            res.json(result)
        } else {
            res.json(fail('surveyInsertError'))
        }
    }catch (error){
        log.error('[service] [DB] [insertSurvey] error:',error)
        res.json(fail('surveyInsertError'))
    }
});
//DB API: insert searchHistory table
app.post('/insertSearchHistory', async(req, res) => {
    res.header('Content-Type', 'application/json')
    try {
        const params = req.body
        log.info('[service] [insertSearchHistory] start param:',JSON.stringify(params))

        if (params.isfailuresituation === true) {
            params.isfailuresituation = '類似検索' //類似検索<=>故障状況検索
            params.searchClass = '類似'
        }
        params.insertdate = common.getNowTime().nTime


        const sqlValueArray = []
        const inputParams = []
        dbFiledDefaultConf.search_history_inerst.forEach(item => {
            sqlValueArray.push('@' + item.key)
            const value = params[item.key] || params[item.key] == 0 ? params[item.key] : ''
            inputParams.push({
                key: item.key,
                type: item.type,
                length: item.length,
                value: value
            })
        })

        //click login, log to trace.log includes userId,currentTime,isfailuresituation
        log.trace(params.username + "," + params.insertdate + "," + params.searchClass + "の検索履歴登録");
        const result = await mssqlUtil.saveSearchHistory({
            sqlValueArray,
            inputParams
        });

        // log handle
        if(result.code == 200){
            loghandle({
                'searchid': result.data,
                'groupid': params.groupid,
                'isclick': '0',
                'username': params.username
            })
        }

        log.info('[service] [insertSearchHistory] end result:',JSON.stringify(result))
        if(result.code === 200) {
            res.json(result)
        } else {
            res.json(fail('insertSearchHistoryError'))
        }
    } catch (error) {
        log.error('[service] [DB] [insertSearchHistory] error:',error)
        res.json(fail('insertSearchHistoryError'));
    }
});
//DB API: get comment-tablet
app.post('/getCommentContent', async(req, res) => {
    res.header('Content-Type', 'application/json');
    try {
        const params = req.body
        log.info('[service] [getCommentContent] start param:',JSON.stringify(params))
        if (params.isfailuresituation === true) {
            params.isfailuresituation = '類似検索'; //故障状況検索<=>類似検索
        } else {
            params.isfailuresituation = '原因・推定原因検索';
        }

        const result = await mssqlUtil.getComment(params);
        if(result.code == 200){
            const resultAnswer = {
                question: {}
            }
            if (result.data.length > 0) {
                const record = result.data[0]
                let surveySearchid = record.search_id;
                //get answer content
                if (surveySearchid) {
                    resultAnswer.answer = true
                    resultAnswer.userComment = record.usercomment
                    for (k = 1; k < 6; k++) {
                        resultAnswer.question['q' + k] = record['q' + k]
                    }
                }else{
                    resultAnswer.answer = false
                }
            }else{
                resultAnswer.answer = false
            }
            log.info('[service] [getCommentContent] end result:',JSON.stringify(resultAnswer))
            res.json(success(resultAnswer));
        }else{
            log.info('[service] [getCommentContent] end result:',JSON.stringify(result))
            res.json(result);
        }
    } catch (error) {
        log.error('[service] [DB] [getCommentContent] error:',error)
        res.json(fail());
    }
});
//DB API: get score
app.post('/getScore', async(req, res) => {
    res.header('Content-Type', 'application/json')
    try {
        const params = req.body
        log.info('[service] [getScore] start param:',JSON.stringify(params))
        if (params.isfailuresituation === true) {
            params.isfailuresituation = '類似検索'; //故障状況検索<=>類似検索
        }

        // 各ユーザーのscoreの合計
        const sumScoreArr = await mssqlUtil.getTotalScore(params)
        
        // 登録ユーザーのscoreの取得
        const userScoreArr = await mssqlUtil.getUserScore(params)

        if(sumScoreArr.code == 200 && userScoreArr.code == 200){
            const userScoreResult = {isNull:true}
            if(userScoreArr.data.length > 0){
                userScoreResult.isNull = false
                userScoreResult.searchid = userScoreArr.data[0].id
                userScoreArr.data.forEach(item => {
                    let reportid = item.reportid
                    if(reportid){
                        delete item.id
                        delete item.reportid
                        userScoreResult[reportid] = item
                    }
                })
            }

            const sumScoreResult = {}
            sumScoreArr.data.forEach(item => {
                let reportid = item.reportid
                delete item.reportid
                sumScoreResult[reportid] = item
            })

            const result = {
                sumScoreResult,
                userScoreResult
            }

            // log handle
            if(!userScoreResult.isNull){
                loghandle({
                    'searchid': userScoreResult.searchid,
                    'groupid': params.groupid,
                    'isclick': '0',
                    'username': params.username
                })
            }

            log.info('[service] [getScore] end result:',JSON.stringify(result))
            res.json(success(result));
        }else{
            log.info('[service] [getScore] end result [0]:%s [1]:%s',JSON.stringify(sumScoreArr),JSON.stringify(userScoreArr))
            res.json(fail())
        }
    } catch (error) {
        log.error('[service] [DB] [getScore] error:',error)
        res.json(fail())
    }
});
async function loghandle(logParams){
    try {
        log.info('[service] [Loghandle] start param:',JSON.stringify(logParams))
        const result = await mssqlUtil.queryLog(logParams)
        let logResult
        if(result.code == 200 && result.data.length > 0){
            logResult = mssqlUtil.updateLog(logParams)
        }else{
            logResult = mssqlUtil.saveLog(logParams)
        }
        log.info('[service] [Loghandle] end result:',JSON.stringify(result))
        return logResult
    } catch (error) {
        log.error('[service] [DB] [Loghandle] error:',error)
        return fail()
    }
}
//DB API: work complete
app.post('/workComplete', async(req, res) => {
    res.header('Content-Type', 'application/json')
    try {
        const params = req.body
        log.info('[service] [workComplete] start param:',JSON.stringify(params))
        const result = await loghandle(params)
        log.info('[service] [workComplete] end result:',JSON.stringify(result))
        if(result.code === 200) {
            res.json(result)
        } else {
            res.json(fail('workCompleteError'))
        }
    }catch (error){
        log.error('[service] [DB] [workComplete] error:',error)
        res.json(fail('workCompleteError'))
    }
});
//DB API: update Eval
app.post('/updateEval', async(req, res) => {
    res.header('Content-Type', 'application/json')
    try {
        const params = req.body
        log.info('[service] [updateEval] start param:',JSON.stringify(params))

        const sqlInsertArray = []
        const sqlUpdateArray = []
        const inputParams = []
        dbFiledDefaultConf.evaluation_update.forEach(item => {
            sqlInsertArray.push('@' + item.key)
            if(item.key != 'search_id' || item.key != 'reportid' ){
                sqlUpdateArray.push(item.key + '=@' + item.key)
            }
            const value = params[item.key] || params[item.key] == 0 ? params[item.key] : ''
            inputParams.push({
                key: item.key,
                type: item.type,
                length: item.length,
                value: value
            })
        })

        log.trace(params.username + "," + common.getNowTime().nTime + ",類似の評価登録")
        const result = await mssqlUtil.updateEval({
            sqlInsertArray,
            sqlUpdateArray,
            inputParams
        })
        log.info('[service] [updateEval] end result:',JSON.stringify(result))
        if(result.code === 200) {
            res.json(result)
        } else {
            res.json(fail('evalError'))
        }
    } catch (error) {
        log.error('[service] [DB] [updateEval] error:',error)
        res.json(fail('evalError'))
    }
});

//SIM API 
app.post('/getOptions', async(req, res) => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
    res.header('Content-Type', 'application/json')
    try {
        const params = req.body
        log.info('[service] [getOptions] start param:',JSON.stringify(params))

        var result = await sim_reqest.sim_axios({
            method: 'POST',
            url: simConfig.uri_facet,
            data: params
        })
        log.info('[service] [getOptions] end result:',JSON.stringify(result.data))
        if(result.data.success){
            res.json(success(result.data))
        }else{
            res.json(fail('SimError'))
        }
    } catch (error) {
        log.error('[service] [SIM] [getOptions] error:',error)
        res.json(fail('SimError'))
    }
});
app.post("/getKeyWord", async function(req, res) {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
    res.header('Content-Type', 'application/json')
    try {
        const params = req.body
        log.info('[service] [getKeyWord] start param:',JSON.stringify(params))

        var result = await sim_reqest.sim_axios({
                method: 'POST',
                url: simConfig.uri_facet,
                data: params
            })
        log.info('[service] [getKeyWord] end result:',JSON.stringify(result.data))
        if(result.data.success) {
            const resultResponse = result.data.data.response
            if(resultResponse) {
                if(resultResponse.tokens) {
                    let filterHirArr = []
                    // 全て、一般名詞、動詞、形容詞：ひらがな2文字は表示しない
                    if(params.facetField === 'Root._word'|| params.facetField === 'Root._word.Noun'|| params.facetField === 'Root._word.Verb'|| params.facetField === 'Root._word.Adjective') {
                        filterHirArr = resultResponse.tokens.filter(item => !(/^[ぁ-ゖ]{2}$/.test(item.label)))
                        // 全て: 英語の小文字から大文字へ
                        if(params.facetField === 'Root._word') {
                            filterHirArr = filterHirArr.map(item => {
                                const labelUpCase = item.label.replace(/[a-z]/g, function(match){
                                    return match.toUpperCase(); 
                                })
                                item.label = labelUpCase
                                return item
                            })
                        }
                        result.data.data.response.tokens = filterHirArr
                    }
                    if(params.facetField === 'Root._word' || params.facetField === 'Root._word.Noun') {
                        // 全て、一般名詞: 数字「だけ」のキーワードは表示しない
                        const filterNumArr = filterHirArr.filter(item => !(/^\d+$/.test(item.label)))
                        result.data.data.response.tokens = filterNumArr
                        // 全て、一般名詞:１文字は指定の文字列(「上、下、左、右、表、裏、前、後」と部位・部品名の１文字）以外表示しない
                        params.facetField = 'Root.partname'
                        params.rows = 10000
                        var partnameResult = await sim_reqest.sim_axios({
                            method: 'POST',
                            url: simConfig.uri_facet,
                            data: params
                        })
                        // 部位・部品名の１文字の文字セット
                        if(partnameResult.data.success) {
                            const partnameResponse = partnameResult.data.data.response
                            if(partnameResponse) {
                                if(partnameResponse.tokens) {
                                    const partnameArr = partnameResponse.tokens.filter(item => item.label.length === 1).map(item => {return item.label})
                                    const resultArr = filterNumArr.filter(item => item.label.length !== 1 || showSingleWord.includes(item.label) || partnameArr.includes(item.label));
                                    result.data.data.response.tokens = resultArr
                                }
                            }
                        }
                    }
                }
            }
            res.json(success(result.data))
        }else{
            res.json(fail('SimError'))
        }

    } catch (error) {
        log.error('[service] [SIM] [getKeyWord] error:',error)
        res.json(fail('SimError'))
    }
});
// クエリの日付範囲
app.post("/getDateRange", async function(req, res) {
    res.header('Content-Type', 'application/json')
    try {
        const params = {
            queryString: 'occur_date:[1931-03-01 TO *]',
            start: 0,
            rows: 1,
            sortField: '_key',
            facetField: 'Root.occur_date'
        }
        log.info('[service] [getDateRange] start param:',JSON.stringify(params))

        //最大日付desc
        const max_date_result = await sim_reqest.sim_axios({
            method: 'POST',
            url: simConfig.uri_facet,
            data: {
                ...params,
                sortType: 'desc'
            }
        })

        log.info('[service] [getDateRange] [maxDate] param:',JSON.stringify(max_date_result.data))

        //最小日付asc
        const min_date_result = await sim_reqest.sim_axios({
            method: 'POST',
            url: simConfig.uri_facet,
            data: {
                ...params,
                sortType: 'asc'
            }
        })

        log.info('[service] [getDateRange] [minDate] param:',JSON.stringify(min_date_result.data))

        if(max_date_result.data.success && min_date_result.data.success){
            res.json(success([
                max_date_result.data.data.response ? max_date_result.data.data.response.tokens[0].label : '',
                min_date_result.data.data.response ? min_date_result.data.data.response.tokens[0].label : ''
            ]))
        }else{
            res.json(fail('SimError'))
        }
    } catch (error) {
        log.error('[service] [SIM] [getDateRange] error:',error)
        res.json(fail('SimError'))
    }
});
app.post("/query", async function(req, res) {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
    res.header('Content-Type', 'application/json')
    try {
        const params = req.body
        log.info('[service] [query] start param:',JSON.stringify(params))

        if (params.hanZenKanaOnOff) {
            // 半角カナ対応
            params.trouble_text = "(" + common.hankana2zenkana(params.trouble_text) + ")"
        }
        
        let queryString = ''
        if(params.switchvalue){
            let q_section_condition_array = params.q_condition_array.filter(item => {
                let key = item.slice(0, item.indexOf(':'))
                let keysArray = ['part1', 'part2','part3', 'part4']
                if(!keysArray.includes(key)) {
                    return item
                }
            })
            params.q_condition_array.push(params.trouble_text)
            queryString = '(' + params.q_condition_array.join(' OR ') + ')'
            queryString += ' AND ' + q_section_condition_array.join(' AND ')
        }else{
            params.q_condition_array.push(params.trouble_text)
            queryString = '(' + params.q_condition_array.join(' OR ') + ')'
        }
        if(params.dateAndCheckList){
            queryString += ' AND ' + params.dateAndCheckList
        }

        const sim_param = {
            queryString: queryString,
            start: params.start,
            rows: params.rows,
            sortField: params.sortField,
            detailed: params.detailed,
            highlighted: params.highlighted
        }

        log.info('[service] [query] sim request param:',JSON.stringify(sim_param))
        var result = await sim_reqest.sim_axios({
            method: 'POST',
            url: simConfig.uri_document,
            data: sim_param
        })

        log.info('[service] [query] end result:',JSON.stringify(result.data))
        if(result.data.success){
            res.json(success(result.data))
        }else{
            res.json(fail('SimError'))
        }
    } catch (error) {
        log.error('[service] [SIM] [query] error:',error)
        res.json(fail('SimError'))
    }
});

//log trace info
app.post("/traceInfo", async function(req, res) {
    res.header('Content-Type', 'application/json')
    try {
        const params = req.body
        log.info('[service] [traceInfo] start param:',JSON.stringify(params))

        let traceInfo = params.username + "," + common.getNowTime().nTime + ",クリア"
        log.trace(traceInfo)

        log.info('[service] [traceInfo] end result:', traceInfo)
        res.json(success())
    } catch (error) {
        log.error('[service] [traceInfo] error:',error)
        res.json(fail())
    }
});

var port = process.env.PORT || 3001
app.listen(port, function() {
    log.info("Start app.listen");
    log.info('server listen on port: ' + port)
});