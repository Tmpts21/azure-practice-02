const facetQuery = {
    "queryString": "*:*",
    "start": 0,
    "rows": 50,
    "sortField": "_count",
    "facetField": ""
}
const documentQuery = {
    "queryString": "*:*",
    "start": 0,
    "rows": 20,
    "sortField": "",
    "detailed": false,
    "highlighted": false
}
const predict = {
    paramCheckFields: [
        'factory',
        'process',
        'trouble_text',
    ],
    // request parameters, corresponding the dropdown box and input text field
    paramFields: [
        // input text field, read from condition.js's inputTextField's value
        'factory',
        'process',
        'block',
        'type',
        'facility',
        'apparatus',
        'point',
        'part1',
        'part2',
        'part3',
        'part4',
        'special_type'
        //'cause',
    ],
    // the fields what server response, include SCORE,ACTION and other properties
    resultFields: {
        //DATE: '実績着手日',
        factory: '工場',
        process: '工程',
        block: '区分',
        type: '号機',
        facility: '設備',
        apparatus: '装置',
        point: '部位',
        special_type: '専門区分',
        part4: '故障部品',
        showPart: '故障部品',
        cause_type: '推定原因',
        trouble_type: '故障現象',
        action_status: '故障処置区分',
        occur_date: '発生年月日',
        recovery_date: '復旧年月日',
        stop_time: '設備停止時間(Hr)',
        start_date: '着手年月日',
        fix_date: '補修完了日',
        fix_time: '修理時間(Hr)',
        subject: '故障件名',
        part1: '故障部品1',
        part2: '故障部品2',
        part3: '故障部品3',
        request_type: '依頼区分',
        trouble_text: '故障状況',
        score: 'score',
        cause_text: '原因・推定原因',
        action_text: '処置内容（使用部品）',
        investigation: '調査内容',
        reportid: 'reportid',
    },
    secondtextonoff: 'on', //second text on: display , off: display is none
    thirdtextonoff: 'on', //third text on: display , off: display is none
    plusvalue: 0.2
}
const message = {
    notFind: '検索条件に一致する結果が見つかりませんでした。\n検索条件を変更して、再度検索を行ってください。',
    presumptionCause: '登録が完了しました。',
    notInputTroubleText: 'テキストボックスに文字を入力してください。',
    requiredSelectedText:'工場と工程を選択してください。',
    surveyInsertFailed: '登録失敗。',
    idIsNotFound: 'IDが見つかりません。',
    updateFailed: '評価に失敗しました。',
    simError:'SIMサーバーエラーが発生しました。時間をおいて再度お試しください。',
    serverError:'サーバーエラーが発生しました。時間をおいて再度お試しください。',
    logSaveFailed:'作業完了失敗。',
    loginInvalid: 'ログインが無効です。再ログインしてください。',
    tokenInvalid: 'トーケンが無効です。再ログインしてください。'
}
const evaluate = {
    //DB接続設定あり/なし　on/off
    onoff: 'on'
}

const keyword = {
    excludeKeywords: [')', '(']
}
const similarText = {
    similaronoff: 'on',
}
const hanZenKana = {
    //半角全角の転換
    hanZenKanaOnOff: true,
}
const questionContent = {
    "Q1": {
        "question": "今回の保全業務はぱっと現場を見たり、連絡を受けるなどして、すぐに処置方法が思いついた案件でしょうか？",
        "answer": ['すぐに処置方法が思いついた案件だった', 'すぐには処置方法が思いつかない案件だった']
    },
    "Q2": {
        "question": "ナレッジDBを利用することで今回の保全は何分変化したと感じますか？",
        "answer": ['30分以上短縮した','29分短縮した','28分短縮した','27分短縮した','26分短縮した','25分短縮した',
                    '24分短縮した','23分短縮した','22分短縮した','21分短縮した','20分短縮した','19分短縮した',
                    '18分短縮した','17分短縮した','16分短縮した','15分短縮した','14分短縮した','13分短縮した',
                    '12分短縮した','11分短縮した','10分短縮した','9分短縮した','8分短縮した','7分短縮した',
                    '6分短縮した','5分短縮した','4分短縮した','3分短縮した','2分短縮した','1分短縮した',
                    '変化なし','1分余計に時間がかかった','2分余計に時間がかかった','3分余計に時間がかかった',
                    '4分余計に時間がかかった','5分余計に時間がかかった','6分余計に時間がかかった','7分余計に時間がかかった',
                    '8分余計に時間がかかった','9分余計に時間がかかった','10分余計に時間がかかった','11分余計に時間がかかった',
                    '12分余計に時間がかかった','13分余計に時間がかかった','14分余計に時間がかかった','15分余計に時間がかかった',
                    '16分余計に時間がかかった','17分余計に時間がかかった','18分余計に時間がかかった','19分余計に時間がかかった',
                    '20分余計に時間がかかった','21分余計に時間がかかった','22分余計に時間がかかった','23分余計に時間がかかった',
                    '24分余計に時間がかかった','25分余計に時間がかかった','26分余計に時間がかかった','27分余計に時間がかかった',
                    '28分余計に時間がかかった','29分余計に時間がかかった','30分余計に以上時間がかかった'
    ]
    }
}
const property = {
    propertyFileds: ['factory', 'process', 'block', 'type', 'facility', 'apparatus', 'point', 'special_type', 'showPart', 'cause_type', 'trouble_type', 'action_status', 'occur_date', 'recovery_date', 'stop_time', 'start_date', 'fix_date', 'fix_time']
}
const product = {
    PS: [
        "久留米工場",
        "那須工場",
        "彦根工場",
        "鳥栖工場",
        "栃木工場",
        "甘木工場",
        "防府工場"
    ],
    TB: [
        "栃木工場",
        "甘木工場"
    ],
    OR: [
        "下関工場",
        "防府工場",
        "北九州工場"
    ],
    AC: [
        "久留米工場",
        "東京工場"
    ],
    AG: [
        "那須工場"
    ],
    MC: [
        "那須工場"
    ]
}
const allFactory = [
    "久留米工場", "那須工場", "彦根工場", "鳥栖工場", "栃木工場", "甘木工場",
    "下関工場", "防府工場", "北九州工場", "東京工場"
]
const queryData = {
    factory: "--",
    process: "--",
    block: "--",
    type: "--",
    facility: "--",
    apparatus: "--",
    point: "--",
    part1: "--",
    part2: "--",
    part3: "--",
    part4: "--",
    special_type: "--",
    trouble_text: ""
}
const rateComment = {
    rateCommentonoff: true,
}

const showSingleWord = ['上','下','左','右','表','裏','前','後']

module.exports = {
    predict,
    message,
    evaluate,
    keyword,
    similarText,
    hanZenKana,
    questionContent,
    property,
    product,
    allFactory,
    facetQuery,
    queryData,
    documentQuery,
    rateComment,
    showSingleWord
}