const search_history_inerst = [
    {key:'trouble_text',type:'NVarChar',length:2400},
    {key:'factory',type:'NVarChar',length:100},
    {key:'process',type:'NVarChar',length:100},
    {key:'block',type:'NVarChar',length:200},
    {key:'type',type:'NVarChar',length:200},
    {key:'facility',type:'NVarChar',length:200},
    {key:'apparatus',type:'NVarChar',length:200},
    {key:'point',type:'NVarChar',length:200},
    {key:'part1',type:'NVarChar',length:200},
    {key:'part2',type:'NVarChar',length:200},
    {key:'part3',type:'NVarChar',length:200},
    {key:'part4',type:'NVarChar',length:200},
    {key:'special_type',type:'NVarChar',length:200},
    {key:'isfailuresituation',type:'NVarChar',length:100},
    {key:'sort',type:'NVarChar',length:200},
    {key:'condition_fix',type:'NVarChar',length:4},
    {key:'search_type',type:'NVarChar',length:100},
    {key:'insertdate',type:'NVarChar',length:40},
    {key:'costTime',type:'NVarChar',length:100},
    {key:'simdoc_search_times',type:'NVarChar',length:10},
    {key:'keyword_select_times',type:'NVarChar',length:10},
    {key:'groupid',type:'NVarChar',length:40},
    {key:'username',type:'NVarChar',length:40},
    {key:'rank1_id',type:'NVarChar',length:30},
    {key:'rank1_score',type:'NVarChar',length:30},
    {key:'rank1_order',type:'NVarChar',length:30},
    {key:'rank2_id',type:'NVarChar',length:30},
    {key:'rank2_score',type:'NVarChar',length:30},
    {key:'rank2_order',type:'NVarChar',length:30},
    {key:'rank3_id',type:'NVarChar',length:30},
    {key:'rank3_score',type:'NVarChar',length:30},
    {key:'rank3_order',type:'NVarChar',length:30},
    {key:'rank4_id',type:'NVarChar',length:30},
    {key:'rank4_score',type:'NVarChar',length:30},
    {key:'rank4_order',type:'NVarChar',length:30},
    {key:'rank5_id',type:'NVarChar',length:30},
    {key:'rank5_score',type:'NVarChar',length:30},
    {key:'rank5_order',type:'NVarChar',length:30},
    {key:'rank6_id',type:'NVarChar',length:30},
    {key:'rank6_score',type:'NVarChar',length:30},
    {key:'rank6_order',type:'NVarChar',length:30},
    {key:'rank7_id',type:'NVarChar',length:30},
    {key:'rank7_score',type:'NVarChar',length:30},
    {key:'rank7_order',type:'NVarChar',length:30},
    {key:'rank8_id',type:'NVarChar',length:30},
    {key:'rank8_score',type:'NVarChar',length:30},
    {key:'rank8_order',type:'NVarChar',length:30},
    {key:'rank9_id',type:'NVarChar',length:30},
    {key:'rank9_score',type:'NVarChar',length:30},
    {key:'rank9_order',type:'NVarChar',length:30},
    {key:'rank10_id',type:'NVarChar',length:30},
    {key:'rank10_score',type:'NVarChar',length:30},
    {key:'rank10_order',type:'NVarChar',length:30},
    {key:'rank11_id',type:'NVarChar',length:30},
    {key:'rank11_score',type:'NVarChar',length:30},
    {key:'rank11_order',type:'NVarChar',length:30},
    {key:'rank12_id',type:'NVarChar',length:30},
    {key:'rank12_score',type:'NVarChar',length:30},
    {key:'rank12_order',type:'NVarChar',length:30},
    {key:'rank13_id',type:'NVarChar',length:30},
    {key:'rank13_score',type:'NVarChar',length:30},
    {key:'rank13_order',type:'NVarChar',length:30},
    {key:'rank14_id',type:'NVarChar',length:30},
    {key:'rank14_score',type:'NVarChar',length:30},
    {key:'rank14_order',type:'NVarChar',length:30},
    {key:'rank15_id',type:'NVarChar',length:30},
    {key:'rank15_score',type:'NVarChar',length:30},
    {key:'rank15_order',type:'NVarChar',length:30},
    {key:'rank16_id',type:'NVarChar',length:30},
    {key:'rank16_score',type:'NVarChar',length:30},
    {key:'rank16_order',type:'NVarChar',length:30},
    {key:'rank17_id',type:'NVarChar',length:30},
    {key:'rank17_score',type:'NVarChar',length:30},
    {key:'rank17_order',type:'NVarChar',length:30},
    {key:'rank18_id',type:'NVarChar',length:30},
    {key:'rank18_score',type:'NVarChar',length:30},
    {key:'rank18_order',type:'NVarChar',length:30},
    {key:'rank19_id',type:'NVarChar',length:30},
    {key:'rank19_score',type:'NVarChar',length:30},
    {key:'rank19_order',type:'NVarChar',length:30},
    {key:'rank20_id',type:'NVarChar',length:30},
    {key:'rank20_score',type:'NVarChar',length:30},
    {key:'rank20_order',type:'NVarChar',length:30}
]

const survey_inerst = [
    {
        key: 'searchid',
        type: 'Int'
    },
    {
        key: 'insertDate',
        type: 'NVarChar',
        length: 20
    },
    {
        key: 'usercomment',
        type: 'NVarChar',
        length: 1200
    },
    {
        key: 'username',
        type: 'VarChar',
        length: 20
    },
    {
        key: 'q1',
        type: 'NVarChar',
        length: 200
    },
    {
        key: 'q2',
        type: 'NVarChar',
        length: 200
    },
    {
        key: 'q3',
        type: 'NVarChar',
        length: 200
    },
    {
        key: 'q4',
        type: 'NVarChar',
        length: 200
    },
    {
        key: 'q5',
        type: 'NVarChar',
        length: 200
    }
]

const evaluation_update = 
    [
        {key:'search_id',type:'Int'},
        {key:'reportid',type:'NVarChar',length:20},
        {key:'folding',type:'NVarChar',length:20},
        {key:'eval_list',type:'NVarChar',length:20},
        {key:'eval_detail',type:'NVarChar',length:20},
        {key:'factory',type:'NVarChar',length:50},
        {key:'process',type:'NVarChar',length:50},
        {key:'block',type:'NVarChar',length:100},
        {key:'type',type:'NVarChar',length:100},
        {key:'facility',type:'NVarChar',length:100},
        {key:'apparatus',type:'NVarChar',length:100},
        {key:'point',type:'NVarChar',length:20},
        {key:'part',type:'NVarChar',length:400},
        {key:'special_type',type:'NVarChar',length:100},
        {key:'cause_type',type:'NVarChar',length:100},
        {key:'trouble_type',type:'NVarChar',length:100},
        {key:'action_status',type:'NVarChar',length:50},
        {key:'occur_date',type:'NVarChar',length:50},
        {key:'recovery_date',type:'NVarChar',length:50},
        {key:'stop_time',type:'NVarChar',length:20},
        {key:'start_date',type:'NVarChar',length:20},
        {key:'fix_date',type:'NVarChar',length:20},
        {key:'fix_time',type:'NVarChar',length:20},
        {key:'subject',type:'NVarChar',length:100},
        {key:'request_type',type:'NVarChar',length:50},
        {key:'trouble_text',type:'NVarChar',length:1200},
        {key:'score',type:'NVarChar',length:15},
        {key:'cause_text',type:'NVarChar',length:1200},
        {key:'action_text',type:'NVarChar',length:1200},
        {key:'investigation',type:'NVarChar',length:1200}
    ]

module.exports = {
    search_history_inerst,
    survey_inerst,
    evaluation_update
}