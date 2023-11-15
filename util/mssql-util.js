const { dbConfig } = require('../authConfig')
const log = require('./winston-log-util');
const { get } = require('./sqlserver');
const { success, fail } = require('./response-util');
const mssql = require('mssql');
//search survey result
exports.getComment = async(queryParams) => {
    try {
        log.info("[mssql] [getComment] start param:", JSON.stringify(queryParams))
        const sql = `select 
                        ts.search_id,
                        ts.q1,
                        ts.q2,
                        ts.q3,
                        ts.q4,
                        ts.q5,
                        ts.usercomment
                    from ` + dbConfig.table.search_table + ` tsh 
                    join ` + dbConfig.table.survey_table + ` ts on 
                        tsh.id = ts.search_id
                    where  
                        tsh.search_text = @search_text 
                        and tsh.factory = @factory 
                        and tsh.process = @process 
                        and tsh.block = @block  
                        and tsh.type = @type 
                        and tsh.facility = @facility 
                        and tsh.apparatus = @apparatus 
                        and tsh.point = @point 
                        and tsh.part1 = @part1 
                        and tsh.part2 = @part2 
                        and tsh.part3 = @part3 
                        and tsh.part4 = @part4 
                        and tsh.special_type = @special_type
                        and tsh.search_class = @search_class 
                        and tsh.sort_order = @sort_order 
                        and tsh.condition_fix = @condition_fix 
                        and tsh.username = @username
                    `
        const pool = await get('survey_pool')
        const req = pool.request()
        req.input('search_text', mssql.NVarChar(2400), queryParams.trouble_text)
            .input('factory', mssql.NVarChar(100), queryParams.factory)
            .input('process', mssql.NVarChar(100), queryParams.process)
            .input('block', mssql.NVarChar(200), queryParams.block)
            .input('type', mssql.NVarChar(200), queryParams.type)
            .input('facility', mssql.NVarChar(200), queryParams.facility)
            .input('apparatus', mssql.NVarChar(200), queryParams.apparatus)
            .input('point', mssql.NVarChar(200), queryParams.point)
            .input('part1', mssql.NVarChar(200), queryParams.part1)
            .input('part2', mssql.NVarChar(200), queryParams.part2)
            .input('part3', mssql.NVarChar(200), queryParams.part3)
            .input('part4', mssql.NVarChar(200), queryParams.part4)
            .input('special_type', mssql.NVarChar(200), queryParams.special_type)
            .input('search_class', mssql.NVarChar(100), queryParams.isfailuresituation)
            .input('sort_order', mssql.NVarChar(200), queryParams.sort)
            .input('condition_fix', mssql.NVarChar(4), queryParams.condition_fix)
            .input('username', mssql.NVarChar(50), queryParams.username)
        const result = await req.query(sql)
        log.info("[mssql] [getComment] end result:", JSON.stringify(result))
        return success(result.recordset)
    } catch (error) {
        log.error("[mssql] [DB] [getComment] error:",error)
        return fail('SqlExcuteError')
    }
}
//search t_search_history total score result
exports.getTotalScore = async(queryParams) => {
    try {
        log.info("[mssql] [getTotalScore] start param:", JSON.stringify(queryParams))
        const sql = `select
                        te.reportid,
                        sum(convert(int, te.eval_list)) as eval_list_sum,
                        sum(convert(int, te.eval_detail)) as eval_detail_sum
                    from
                        ` + dbConfig.table.search_table + ` tsh
                    join ` + dbConfig.table.evaluation_table + ` te on
                        te.search_id = tsh.id
                    where
                        tsh.search_text = @search_text 
                        and tsh.factory = @factory 
                        and tsh.process = @process 
                        and tsh.block = @block  
                        and tsh.type = @type 
                        and tsh.facility = @facility 
                        and tsh.apparatus = @apparatus 
                        and tsh.point = @point 
                        and tsh.part1 = @part1 
                        and tsh.part2 = @part2 
                        and tsh.part3 = @part3 
                        and tsh.part4 = @part4 
                        and tsh.special_type = @special_type
                        and tsh.search_class = @search_class 
                        and tsh.sort_order = @sort_order 
                        and tsh.condition_fix = @condition_fix
                    group by
                        te.reportid`
        const pool = await get('search_pool')
        const req = pool.request()
        req.input('search_text', mssql.NVarChar(2400), queryParams.trouble_text)
        .input('factory', mssql.NVarChar(100), queryParams.factory)
        .input('process', mssql.NVarChar(100), queryParams.process)
        .input('block', mssql.NVarChar(200), queryParams.block)
        .input('type', mssql.NVarChar(200), queryParams.type)
        .input('facility', mssql.NVarChar(200), queryParams.facility)
        .input('apparatus', mssql.NVarChar(200), queryParams.apparatus)
        .input('point', mssql.NVarChar(200), queryParams.point)
        .input('part1', mssql.NVarChar(200), queryParams.part1)
        .input('part2', mssql.NVarChar(200), queryParams.part2)
        .input('part3', mssql.NVarChar(200), queryParams.part3)
        .input('part4', mssql.NVarChar(200), queryParams.part4)
        .input('special_type', mssql.NVarChar(200), queryParams.special_type)
        .input('search_class', mssql.NVarChar(100), queryParams.isfailuresituation)
        .input('sort_order', mssql.NVarChar(200), queryParams.sort)
        .input('condition_fix', mssql.NVarChar(4), queryParams.condition_fix)
        const result = await req.query(sql);
        log.info("[mssql] [getTotalScore] end result:", JSON.stringify(result))
        return success(result.recordset)
    } catch (error) {
        log.error("[mssql] [DB] [getTotalScore] error:",error)
        return fail('SqlExcuteError')
    }
}
//search t_search_history total score result
exports.getUserScore = async(queryParams) => {
    try {
        log.info("[mssql] [getUserScore] start param:", JSON.stringify(queryParams))
        const sql = `select
                        tsh.id,
                        te.reportid,
                        te.eval_list,
                        te.eval_detail
                    from
                        ` + dbConfig.table.search_table + ` tsh
                    left join ` + dbConfig.table.evaluation_table + ` te on
                        te.search_id = tsh.id
                    where
                        tsh.search_text = @search_text 
                        and tsh.factory = @factory 
                        and tsh.process = @process 
                        and tsh.block = @block  
                        and tsh.type = @type 
                        and tsh.facility = @facility 
                        and tsh.apparatus = @apparatus 
                        and tsh.point = @point 
                        and tsh.part1 = @part1 
                        and tsh.part2 = @part2 
                        and tsh.part3 = @part3 
                        and tsh.part4 = @part4 
                        and tsh.special_type = @special_type
                        and tsh.search_class = @search_class 
                        and tsh.sort_order = @sort_order 
                        and tsh.condition_fix = @condition_fix
                        and tsh.username = @username
                    `
        const pool = await get('search_pool')
        const req = pool.request()
        req.input('search_text', mssql.NVarChar(2400), queryParams.trouble_text)
        .input('factory', mssql.NVarChar(100), queryParams.factory)
        .input('process', mssql.NVarChar(100), queryParams.process)
        .input('block', mssql.NVarChar(200), queryParams.block)
        .input('type', mssql.NVarChar(200), queryParams.type)
        .input('facility', mssql.NVarChar(200), queryParams.facility)
        .input('apparatus', mssql.NVarChar(200), queryParams.apparatus)
        .input('point', mssql.NVarChar(200), queryParams.point)
        .input('part1', mssql.NVarChar(200), queryParams.part1)
        .input('part2', mssql.NVarChar(200), queryParams.part2)
        .input('part3', mssql.NVarChar(200), queryParams.part3)
        .input('part4', mssql.NVarChar(200), queryParams.part4)
        .input('special_type', mssql.NVarChar(200), queryParams.special_type)
        .input('search_class', mssql.NVarChar(100), queryParams.isfailuresituation)
        .input('sort_order', mssql.NVarChar(200), queryParams.sort)
        .input('condition_fix', mssql.NVarChar(4), queryParams.condition_fix)
        .input('username', mssql.NVarChar(50), queryParams.username)
        const result = await req.query(sql);
        log.info("[mssql] [getUserScore] end result:", JSON.stringify(result))
        return success(result.recordset)
    } catch (error) {
        log.error("[mssql] [DB] [getUserScore] error:",error)
        return fail('SqlExcuteError')
    }
}
//insert search History init query result
exports.saveSearchHistory = async(insertParams) => {
    try {
        log.info("[mssql] [saveSearchHistory] start param:", JSON.stringify(insertParams))
        const sql = `insert into ` + dbConfig.table.search_table + `(search_text,factory,process,block,type,facility,apparatus,point,part1,part2,part3,part4,special_type,search_class,sort_order,condition_fix,search_type,insertdate,cost_time_display_to_search,simdoc_search_times,keyword_select_times,group_id,username,rank1_id,rank1_score,rank1_order,rank2_id,rank2_score,rank2_order,rank3_id,rank3_score,rank3_order,rank4_id,rank4_score,rank4_order,rank5_id,rank5_score,rank5_order,rank6_id,rank6_score,rank6_order,rank7_id,rank7_score,rank7_order,rank8_id,rank8_score,rank8_order,rank9_id,rank9_score,rank9_order,rank10_id,rank10_score,rank10_order,rank11_id,rank11_score,rank11_order,rank12_id,rank12_score,rank12_order,rank13_id,rank13_score,rank13_order,rank14_id,rank14_score,rank14_order,rank15_id,rank15_score,rank15_order,rank16_id,rank16_score,rank16_order,rank17_id,rank17_score,rank17_order,rank18_id,rank18_score,rank18_order,rank19_id,rank19_score,rank19_order,rank20_id,rank20_score,rank20_order) values (` + insertParams.sqlValueArray.join() + `);select @@IDENTITY as searchid`

        const pool = await get('search_pool')
        const req = pool.request()
        insertParams.inputParams.forEach(item => {
            req.input(item.key, mssql[item.type], item.value)
        })
        const res = await req.query(sql)
        log.info("[mssql] [saveSearchHistory] end result:", JSON.stringify(res))
        return success(res.recordset[0].searchid)
    } catch (error) {
        log.error("[mssql] [DB] [saveSearchHistory] error:",error)
        return fail('SqlExcuteError')
    }
}
//insert survet comment
exports.saveSurveyComment = async(insertParams) => {
    try {
        log.info("[mssql] [saveSurveyComment] start param:", JSON.stringify(insertParams))
        const sql = `insert into ` + dbConfig.table.survey_table + `(search_id,insertdate,usercomment,username,q1,q2,q3,q4,q5) values (` + insertParams.sqlValueArray.join() + `)`
        const pool = await get('survey_pool')
        const req = pool.request()
        insertParams.inputParams.forEach(item => {
            req.input(item.key, mssql[item.type], item.value)
        })
        const res = await req.query(sql)
        log.info("[mssql] [saveSurveyComment] end result:", JSON.stringify(res))
        return success()
    } catch (error) {
        log.error("[mssql] [DB] [saveSurveyComment] error:",error)
        return fail('SqlExcuteError')
    }
}
//select log
exports.queryLog = async(logParams) => {
    try {
        log.info("[mssql] [queryLog] start param:", JSON.stringify(logParams))
        const sql = `select 
                        * 
                    from 
                        ` + dbConfig.table.log_table + ` 
                    where 
                        group_id = @group_id 
                        and username = @username
                    `
        const pool = await get('log_pool')
        const req = pool.request()
        req.input('group_id', mssql.NVarChar(40), logParams.groupid)
        .input('username', mssql.NVarChar(50), logParams.username)
        const result = await req.query(sql)
        log.info("[mssql] [queryLog] end result:", JSON.stringify(result))
        return success(result.recordset)
    } catch (error) {
        log.error("[mssql] [DB] [queryLog] error:",error)
        return fail('SqlExcuteError')
    }
}
// insert log
exports.saveLog = async(logParams) => {
    try {
        log.info("[mssql] [saveLog] start param:", JSON.stringify(logParams))
        const sql = `INSERT INTO ` + dbConfig.table.log_table + `
                        (SEARCH_ID,GROUP_ID,DONE_BUTTON_IS_CLICK,USERNAME) 
                        values (@search_id, @group_id, @done_button_is_click, @username)
                    `
        const pool = await get('log_pool')
        const req = pool.request()
        req.input('search_id', mssql.Int, logParams.searchid)
        .input('group_id', mssql.NVarChar(40), logParams.groupid)
        .input('done_button_is_click', mssql.NVarChar(40), logParams.isclick)
        .input('username', mssql.NVarChar(50), logParams.username)
        const result = await req.query(sql)
        log.info("[mssql] [saveLog] end result:", JSON.stringify(result))
        return success()
    } catch (error) {
        log.error("[mssql] [DB] [saveLog] error:",error)
        return fail('SqlExcuteError')
    }
}
exports.updateLog = async(logParams) => {
    try {
        log.info("[mssql] [updateLog] start param:", JSON.stringify(logParams))
        const sql = `update 
                        ` + dbConfig.table.log_table + ` 
                    set 
                        done_button_is_click = @done_button_is_click,
                        search_id = @search_id 
                    where 
                        group_id = @group_id 
                        and username = @username
                    `
        const pool = await get('log_pool')
        const req = pool.request()
        req.input('search_id', mssql.Int, logParams.searchid)
        .input('group_id', mssql.NVarChar(40), logParams.groupid)
        .input('done_button_is_click', mssql.NVarChar(40), logParams.isclick)
        .input('username', mssql.NVarChar(50), logParams.username)
        const result = await req.query(sql)
        log.info("[mssql] [updateLog] end result:", JSON.stringify(result))
        return success()
    } catch (error) {
        log.error("[mssql] [DB] [updateLog] error:",error)
        return fail('SqlExcuteError')
    }
}

exports.updateEval = async(updateParams) => {
    try {
        log.info("[mssql] [updateEval] start param:", JSON.stringify(updateParams))
        const sql = `IF NOT EXISTS (SELECT * FROM ` + dbConfig.table.evaluation_table + ` WHERE search_id = @search_id AND reportid = @reportid) INSERT INTO ` + dbConfig.table.evaluation_table + ` (search_id, reportid, folding, eval_list, eval_detail, factory, process, block, TYPE, facility, apparatus, point, part, special_type, cause_type, trouble_type, action_status, occur_date, recovery_date, stop_time, start_date, fix_date, fix_time, subject, request_type, trouble_text, score, cause_text, action_text, investigation) VALUES (` + updateParams.sqlInsertArray.join() + `) ELSE UPDATE ` + dbConfig.table.evaluation_table + ` SET ` + updateParams.sqlUpdateArray.join() + ` WHERE  search_id = @search_id AND reportid = @reportid`
        const pool = await get('evaluation_pool')
        const req = pool.request()
        updateParams.inputParams.forEach(item => {
            req.input(item.key, mssql[item.type], item.value)
        })
        const res = await req.query(sql)
        log.info("[mssql] [updateEval] end result:", JSON.stringify(res))
        return success()
    } catch (error) {
        log.error("[mssql] [DB] [updateEval] error:",error)
        return fail('SqlExcuteError')
    }
}