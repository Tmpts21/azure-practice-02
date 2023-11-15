const EnumResult = {
    success: {
        code: 200,
        msg: 'OK'
    },
    fail: {
        code: 500,
        msg: 'NG'
    },
    ForbiddenError:{
      code: 4000,
      msg: 'Invalid user!'
    },
    InvalidTokenError:{
      code: 4001,
      msg: 'Invalid Token!'
    },
    SimError:{
      code: 4002,
      msg: 'SIM Api failed!'
    },
    evalError:{
      code: 4003,
      msg: 'Eval Api failed!'
    },
    surveyInsertError:{
      code: 4004,
      msg: 'Survey Insert Api failed!'
    },
    workCompleteError:{
      code: 4005,
      msg: 'Log Handle Api failed!'
    },
    insertSearchHistoryError:{
      code: 4006,
      msg: 'Insert Search History Api failed!'
    },
    ParametersError: {
      code: 3000,
      msg: 'Invalid SQL parameters!'
    },
    DbConnectError: {
      code: 3001,
      msg: 'Connect DB failed!'
    },
    SqlExcuteError: {
      code: 3002,
      msg: 'Excute SQL failed!'
    },
    StartTransactionError: {
      code: 3003,
      msg: 'Start transaction failed!'
    },
    CommitTransactionError: {
      code: 3004,
      msg: 'Commit transaction failed!'
    },
}

function success(data) {
    const result  = ({...(EnumResult['success']), data})
    return result;
}

function fail(key, data) {
    const result  = ({...(EnumResult[key] || EnumResult['fail']), data})
    return result;
}

module.exports = {
    success,
    fail
};