const tabletPath = './tablet';
const config = require(tabletPath + '/config/config.js')
const master = require(tabletPath + '/config/master.js')
const condition = master.condition;
const condition2 = master.condition2;
const condition3 = master.condition3;
const predict = config.predict;
const message = config.message;
const evaluate = config.evaluate;
// import component(article template)
const SearchDetail = require(tabletPath + '/components/SearchDetail.js')
//import selectedCategory
const CategoryLable = require(tabletPath + '/components/CategoryLabel.js')
//import keyWordTexts
const KeyWordTexts = require(tabletPath + '/components/KeyWordText.js')
//import searchList
const SearchList = require(tabletPath + '/components/SearchList.js')
//import comment's question
const question = require(tabletPath + '/components/question.js')

const { app_axios } = require(tabletPath + '/util/app_request.js')

const facetQuery = config.facetQuery;
const documentQuery = config.documentQuery;
const queryData = config.queryData
const keyword = config.keyword;
const similarText = config.similarText;
const hanZenKana = config.hanZenKana;
const rateComment = config.rateComment
const ProductConf = config.product
const allFactory = config.allFactory
//comment question
const commentQuestion = config.questionContent
//property result Fileds
const property = config.property
const app = new Vue({
    components: {
        'm-searchdetail': SearchDetail,
        'm-category': CategoryLable,
        'm-keywordtext': KeyWordTexts,
        'm-searchlist': SearchList,
        'm-question': question
    },
    data() {
        return {
            condition,
            condition2,
            condition3,
            similaronoff: similarText.similaronoff,
            hanZenKanaOnOff: hanZenKana.hanZenKanaOnOff,
            optionDefault: '--',
            queryData,
            articles: [],
            searchEnd: false,
            loading: false,
            textAreaNotice: '',
            resultFields: predict.resultFields,
            inParameters: {},
            disabled: false,
            username: '',
            name: '',
            onoff: evaluate.onoff,
            message: message,
            secondtextonoff: predict.secondtextonoff,
            thirdtextonoff: predict.thirdtextonoff,
            isfailuresituation: true, // true 故障状況検索, false 原因・推定原因検索
            searchdatetime: null,
            plusvalue: predict.plusvalue,
            isFacetLabelShow: true,
            dataFacets: [],
            downColor: "rgb(143,170,220)",
            upColor: "rgb(143,170,220)",
            darkColorNoun: "rgb(143,170,220)",
            darkColorVerb: "rgb(143,170,220)",
            darkColorAdjective: "rgb(143,170,220)",
            darkColorPart: "rgb(143,170,220)",
            darkColorAll: "rgb(90,105,162)",
            //発生日順   
            occurDateSort: "rgb(90, 105, 162)",
            //関連順   
            indexSort:"rgb(143, 170, 220)",
            annotationType: "Root._word",
            selectOrderValue: "count",
            sort: "スコア順",
            //検索タイプ
            search_type: '',
            //画面開始時間
            dispaly_start_time: null,
            //類似文書検索回数
            simdoc_search_times: 0,
            //キーワード使用回数
            keyword_select_times: 0,
            //カテゴリ選択(故障設備、部品)
            showCategory: true,
            //キーワード選択orテキスト入力
            showKeywordText: true,
            //検索一覧表示
            showSearchList: false,
            //検索結果詳細表示
            showSearchDetail: false,
            //カテゴリ選択(故障設備、部品)内容
            selectedCategory: {},
            //キーワード内容
            keyWordTexts: [],
            //初期時はテキストエリアは非表示
            textAreaShow: false,
            //検索一覧表示
            searchList: [],
            //検索結果詳細
            searchDetailInfo: [],
            //問題評価
            questionAnswer: commentQuestion,
            //評価問題内容表示
            showQuestion: {flag: false},
            //switch model
            switchvalue: true,
            //reportid
            reportid: null,
            //文書検索内容
            search_content: {},
            //類似文書検索内容
            simdoc_search_content: [],
            //前の検索結果ショー
            gobackSimShow: false,
            //Show keywords label
            showFacetLabel: true,
            conditionLabelColorOn: "rgb(255,102,255)",
            conditionLabelColorOFF: "rgb(127,127,127)",
            //property Fileds
            propertyFileds: property.propertyFileds,
            //comment disable
            commentDisabled: false,
            //search id
            searchid: null,
            //group id
            groupid: null,
            //answer disabled
            answerDisabled: false,
            //logout show
            showLogout: false,
            //datepicker components startDate
            selectStartDate: '',
            //datepicker components endDate
            selectEndDate: '',
            //start date Disable pickerOptions
            pickerOptions_startDate: {
                disabledDate: (time) => {
                if (this.selectEndDate) {
                        //simの開始日
                        let simStartDate = this.simDateRange[0];
                        //実際選択の終了日
                        let endDate = this.selectEndDate;
                        return time.getTime() > new Date(endDate).getTime() || time.getTime() < (new Date(simStartDate).getTime() - 24 * 3600 * 1000);
                    }
                }
            },
            //end date Disable pickerOptions
            pickerOptions_endDate: {
                disabledDate: (time) => {
                if (this.selectStartDate) {
                        //実際選択の開始日
                        let startDate = this.selectStartDate;
                        //simの終了日
                        let simEndDate = this.simDateRange[1];
                        return time.getTime() > new Date(simEndDate).getTime() || time.getTime() < (new Date(startDate).getTime() - 24 * 3600 * 1000);
                    }
                }
            },
            //q param 発生日付
            occur_date: '',
            //発生日範囲指定テキスト
            dateRangeShow: '',
            datechecked: false,
            simDateRange: null,
            showInitDate: '',
            productConfig: ProductConf,
            //factory button tab
            currntTab: 'PS',
            checkList: [],
            allFactoryConfig: allFactory,
            rateCommentonoff: rateComment.rateCommentonoff,
            userComment: '',
            userAnswer: {},
            dateRangeDisabled: false,
            similarLoading: true,
            alertShow: false
        }
    },
    computed: {
        textLength() {
            // テキスト入力文字列の長さを取得します
            return queryData[condition['inputTextField']].length;
        }
    },
    watch: {
        textLength(newVal) {
            this.keyWordTexts.length > 0 && this.keyWordTexts.length < 3 && newVal == 0 ? this.alertShow = true : this.alertShow = false
        }
    },
    methods: {
        async search(searchType){
            try {
                this.searchdatetime = new Date();

                // 画面入力チェック
                for (let i = 0; i < predict.paramCheckFields.length; i++) {
                    let key = predict.paramCheckFields[i]
                    let value = this.queryData[key]
                    if(key == 'trouble_text'){
                        if((!value || value.trim() == '') && this.keyWordTexts.length == 0 ){
                            this.loading = false;
                            alert(message.notInputTroubleText);
                            return
                        }
                    }else{
                        if(!value || value.trim() == '' || value == this.optionDefault){
                            this.loading = false;
                            alert(message.requiredSelectedText);
                            return
                        }
                    }
                }

                //検索内容保存
                if (searchType === 'similarSearchType') {
                    this.simdoc_search_content.push(this.queryData[condition['inputTextField']]);
                    this.gobackSimShow = true;
                    this.showFacetLabel = false;
                } else if (searchType === 'backSimlarSearchType') {
                    //delete last index
                    this.simdoc_search_content.pop();
                    if (this.simdoc_search_content.length == 0) {
                        if (this.splitKeywordsArrayToStr() === '') {
                            this.queryData[condition['inputTextField']] = this.search_content['search'];
                        } else {
                            this.queryData[condition['inputTextField']] = this.splitKeywordsArrayToStr() + ' ' + this.search_content['search'];
                        }
                        this.gobackSimShow = false;
                    } else {
                        let lastIndex = this.simdoc_search_content.length - 1;
                        let trouble_text = this.simdoc_search_content[lastIndex];
                        this.queryData[condition['inputTextField']] = trouble_text;
                    }
                } else{
                    this.simdoc_search_times = 0;
                    this.simdoc_search_content = [];
                    this.gobackSimShow = false;
                    //save trouble_text
                    this.search_content['search'] = typeof(this.queryData[condition['inputTextField']]) == 'undefined' ? '' : this.queryData[condition['inputTextField']];
                    this.showFacetLabel = true;
                    this.loading = true;
                }
                
                //カテゴリ選択(故障設備、部品)非表示
                this.showCategory = false;
                //キーワード選択orテキスト入力非表示
                this.showKeywordText = false;
                // 検索結果詳細表示しない
                this.searchEnd = false
                this.articles = []
                this.searchList = []

                let startDate = this.formateTime(this.selectStartDate);
                let endDate = this.formateTime(this.selectEndDate);
                if (this.datechecked) {
                    //「発生日範囲指定」と表示する。
                    this.dateRangeShow = '発生日範囲指定：' + startDate + " ~ " + endDate;
                }

                //add searchType 
                if (searchType === 'similarSearchType') {
                    this.search_type = '類似文書検索';
                } else {
                    this.search_type = '通常検索';
                }

                // 検索リスト処理
                const params = await this.getSearchParams(searchType)
                const result = await this.getSearchData(params,searchType)
                if(result){
                    this.loading = false
                    //検索一覧表示
                    this.showSearchList = true;
                    // アンケート取得
                    if(this.rateCommentonoff){
                        this.getComment()
                    }
                }else{
                    this.loading = false
                    this.searchShow()
                }

            } catch (error) {
                console.error(error)
                this.loading = false
                this.searchShow()
            }
        },
        getSearchParams(searchType){
            // 初期化パラメータ处理
            let documentQueryParam = { ...documentQuery }
        
            // DB用パラメータ
            this.inParameters = {}
        
            // 設備、部品、専門
            let q_condition_array = []
            predict.paramFields.forEach(key => {
                let value = this.queryData[key]
                if(value && value != '' && value != this.optionDefault){
                    q_condition_array.push(`${key}:"${value}"`);
                }
        
                if(value && value != ''){
                    this.inParameters[key] = value == this.optionDefault ? '' : value
                }
            });
            documentQueryParam.q_condition_array = q_condition_array
        
            // キーワード
            let trouble_text = this.queryData[condition['inputTextField']]
            if(trouble_text && trouble_text.trim() == ''){
                trouble_text = ''
            }
        
            if(searchType === 'firstSearch'){
                trouble_text = this.splitKeywordsArrayToStr() + ' ' + trouble_text
            }
            documentQueryParam.trouble_text = trouble_text.trim()
            this.inParameters.trouble_text = trouble_text.trim()
        
            // 時間処理 と　検索表示工場
            const dateAndCheckList = []
            if(this.datechecked){
                dateAndCheckList.push(this.occur_date)
            }
            // 条件固定の場合
            if(!this.switchvalue && this.checkList.length > 0){
                dateAndCheckList.push(this.formatFactoryConditions(this.checkList))
            }
        
            documentQueryParam.dateAndCheckList = dateAndCheckList.join(' AND ')
            documentQueryParam.hanZenKanaOnOff = this.hanZenKanaOnOff
            documentQueryParam.switchvalue = this.switchvalue
        
            this.inParameters.isfailuresituation = this.isfailuresituation
            this.inParameters.sort = this.sort;
            this.inParameters.condition_fix = this.switchvalue ? '1' : '0';
            this.inParameters.groupid = this.groupid
            this.inParameters.username = this.username

            return documentQueryParam
        },
        async getSearchData(data,searchType){
            try {
                this.similarLoading = true
                data.name = this.name
                const result = await app_axios({
                    method: 'POST',
                    url: '/query',
                    data
                })
                if(result.data.code == 200){
                    const response = result.data.data.data.response
                    if(response.docs.length === 0) {
                        this.similarLoading = false
                    }
                    if(response && Array.isArray(response.docs) && response.docs.length > 0){
                        const docs = response.docs
                        docs.forEach((doc,i) =>{
                            const article = {}
                            for (let k of Object.keys(predict.resultFields)) {
                                article[k] = doc.fields[k]
                            }
                            article.id = doc.id
                            article.score = doc.score
                            article.rankIndex = i
                            this.articles.push(article)
                        })
                        
                        // score 取得
                        const scoreResult = await this.getScore(searchType)
                        //splice searchList data by articles
                        const searchListNotSort = this.combinationSearchList(this.articles, scoreResult)
                        // ソート順
                        const searchListSort = this.sortByScore(searchListNotSort, 'desc')
                        // Noを追加する
                        this.searchList = await this.addPropertyToArrays(searchListSort)
                        
                        return true
                    }else{
                        alert(message.notFind);
                        return false
                    }
                }else{
                    return false
                }
            } catch (error) {
                throw error
            }
        },
        async getScore(searchType){
            try {
                const result = await app_axios({
                    method: 'POST',
                    url: '/getScore',
                    data: this.inParameters
                })
                if(result.data.code == 200){
                    // 検索テーブルにしない場合：新規
                    if(result.data.data.userScoreResult.isNull){
                        this.insertSearchList(searchType);
                    }else{
                        this.searchid = result.data.data.userScoreResult.searchid
                    }
                    return result.data.data
                }
            } catch (error) {
                throw error
            }
        },
        async getComment(){
            try {
                const result = await app_axios({
                    method: 'POST',
                    url: '/getCommentContent',
                    data: this.inParameters
                })
                if (result.data.code == 200 && result.data.data.answer) {
                    const answerRes = result.data.data
                    this.answerDisabled = true
                    this.userComment = answerRes.userComment
                    this.userAnswer = answerRes.question
                }else {
                    //insert search result
                    this.answerDisabled = false
                    this.userAnswer = {}
                    this.userComment = ''
                }
            } catch (error) {
                throw error
            }
        },
        searchShow(){
            //検索条件初期画面 -> 表示
            this.showCategory = true;
            this.showKeywordText = true;
            //検索一覧、検索結果画面 -> 非表示
            this.showSearchList = false;
            this.showSearchDetail = false;
        },
        showDownList() {
            this.showLogout = !this.showLogout
        },
        //Keywords Array to strings
        splitKeywordsArrayToStr() {
            return this.keyWordTexts.map(item => item.facetword).join(' ').trim()
        },
        //評価
        async rateComment() {
            this.showQuestion.flag = true;
        },
        //delete click facet's button item values
        updatekeyWordTexts(facet) {
            this.keyWordTexts = this.keyWordTexts.filter(item => item.facetword != facet)
            this.keyWordTexts.length > 0 && this.keyWordTexts.length < 3 && this.queryData[condition['inputTextField']] == '' ? this.alertShow = true : this.alertShow = false
        },
        //switch Change event
        switchChangeEvent() {
            if (!this.switchvalue) {
                this.changeBackGround(this.currntTab);
            }
        },
        //アセンブリ検索一覧データ
        combinationSearchList(articles, scoreResult) {
            if (articles) {
                let searchList = [];
                for (let i in articles) {
                    let articleObject = articles[i]
                    //copy articles to searchObject
                    let searchObject = Object.assign({}, articles[i])
                    searchObject['factory_array'] = searchObject['factory'] ? this.stringToTextArray(searchObject['factory'].replace('工場', ''), 2) : ''
                    searchObject['occur_date_array'] = articleObject['occur_date'] ? this.stringToTextArray(articleObject['occur_date'], 10) : ''
                    searchObject['score_array'] = articleObject['score'] ? this.stringToTextArray(articleObject['score'].toFixed(1), 8) : 0
                    searchObject['trouble_type_array'] = articleObject['trouble_type'] ? this.stringToTextArray(articleObject['trouble_type'], 4) : ''
                    searchObject['process_array'] = articleObject['process'] ? this.stringToTextArray(articleObject['process'], 3) : ''
                    searchObject['subject_array'] = articleObject['subject'] ? this.stringToTextArray(articleObject['subject'], 4) : ''
                    searchObject['trouble_text_array'] = articleObject['trouble_text'] ? this.stringToTextArray(articleObject['trouble_text'], 24) : ''
                    searchObject['block_array'] = articleObject['block'] ? this.stringToTextArray(articleObject['block'], 4) : ''
                    searchObject['type_array'] = articleObject['type'] ? this.stringToTextArray(articleObject['type'], 4) : ''
                    searchObject['cause_text_array'] = articleObject['cause_text'] ? this.stringToTextArray(articleObject['cause_text'], 12) : ''
                    searchObject['action_text_array'] = articleObject['action_text'] ? this.stringToTextArray(articleObject['action_text'], 12) : ''
                    //修理時間ー＞数値の桁数を変える。少数点以下2桁まで。   
                    searchObject['fix_time'] = articleObject['fix_time'] ? parseFloat(articleObject['fix_time']).toFixed(2) : 0
                    //設備停止時間(Hr)時間ー＞数値の桁数を変える。少数点以下2桁まで。   
                    searchObject['stop_time'] = articleObject['stop_time'] ? parseFloat(articleObject['stop_time']).toFixed(2) : 0
                    searchObject['show'] = 'true';
                    searchObject['reportid'] = articleObject['reportid'];
                    // searchObject['isFold'] = false;
                    searchObject['isShow'] = true;
                    searchObject['disabled'] = false;
                    let userEval = scoreResult['userScoreResult'][articleObject['reportid']]
                    searchObject['eval_list'] = userEval ? userEval['eval_list'] : '0'
                    searchObject['eval_detail'] = userEval ? userEval['eval_detail'] : '0'
                    searchObject['eval_show'] = searchObject['eval_list'] == '0' && searchObject['eval_detail'] == '0' ? '0' : '1'
                    searchObject['score'] = this.calculateScore(articleObject['score'] ? articleObject['score'] : 0, scoreResult['sumScoreResult'][articleObject['reportid']])
                    const partArray = []
                    for (let i = 1; i < 5; i++) {
                        const part = articleObject['part' + i]
                        if(part){
                            partArray.push(part)
                        }
                    }
                    searchObject['showPart'] = partArray.join('-')
                    searchList.push(searchObject)
                }
                return searchList;
            }
        },
        calculateScore(score, evalItem){
            if(evalItem){
                score += Number(evalItem.eval_list_sum) * 1.0 * this.plusvalue + Number(evalItem.eval_detail_sum) * 2.0 * this.plusvalue
            }
            return Number(score.toFixed(9)).toString()
        },
        //substring troubleText firstline is 20 font push array
        stringToTextArray(troubleText, number) {
            let trouble_text_array = [];
            let strLength = troubleText.length;
            if (strLength > number) {
                trouble_text_array.push(troubleText.substring(0, number));
                trouble_text_array.push(troubleText.substring(number, strLength));
            } else {
                trouble_text_array.push(troubleText.substring(0, strLength));
            }
            return trouble_text_array;
        },
        sortByScore(articles, type) {
            if (Array.isArray(articles)) {
                this.indexSort = "rgb(143, 170, 220)"
                this.occurDateSort = "rgb(90, 105, 162)"
                return articles.sort(function(a1, a2) {
                    if (type === 'desc') {
                        if(a2.score === a1.score){
                            if(a2.reportid > a1.reportid){
                                return 1
                            }
                            if(a2.reportid < a1.reportid){
                                return -1  
                            }
                            return 0
                        }
                        return a2.score - a1.score
                    } else {
                        if(a2.score === a1.score){
                            if(a1.reportid > a2.reportid){
                                return 1
                            }
                            if(a1.reportid < a2.reportid){
                                return -1  
                            }
                            return 0
                        }
                        return a1.score - a2.score
                    }
                })
            }
        },
        //発生日順 order by occur_date asc
        sortByOccurDate() {
            this.occurDateSort = "rgb(143, 170, 220)"
            this.indexSort = "rgb(90, 105, 162)"
            this.searchList.sort((a,b)=>{
                if(a.occur_date == b.occur_date){
                    if(b.score === a.score){
                        if(b.reportid > a.reportid){
                            return 1
                        }
                        if(b.reportid < a.reportid){
                            return -1  
                        }
                        return 0
                    }
                    return b.score - a.score
                }
                return new Date(b['occur_date']) - new Date(a['occur_date'])
            });
        },
        //関連性順 order by score
        sortByAssociate() {
            this.indexSort = "rgb(143, 170, 220)"
            this.occurDateSort = "rgb(90, 105, 162)"
            this.searchList = this.sortByScore(this.searchList, 'desc')
        },
        async changeColor(type) {
            document.body.style.cursor = 'wait';
            if (type == 'noun') {
                this.darkColorNoun = "rgb(90,105,162)";
                this.darkColorAdjective = "rgb(143,170,220)";
                this.darkColorVerb = "rgb(143,170,220)";
                this.darkColorPart = "rgb(143,170,220)";
                this.darkColorAll = "rgb(143,170,220)";
                this.annotationType = "Root._word.Noun";
            } else if (type == 'verb') {
                this.darkColorVerb = "rgb(90,105,162)";
                this.darkColorNoun = "rgb(143,170,220)";
                this.darkColorAdjective = "rgb(143,170,220)";
                this.darkColorPart = "rgb(143,170,220)";
                this.darkColorAll = "rgb(143,170,220)";
                this.annotationType = "Root._word.Verb";
            } else if (type == 'adjective') {
                this.darkColorAdjective = "rgb(90,105,162)";
                this.darkColorVerb = "rgb(143,170,220)";
                this.darkColorNoun = "rgb(143,170,220)";
                this.darkColorPart = "rgb(143,170,220)";
                this.darkColorAll = "rgb(143,170,220)";
                this.annotationType = "Root._word.Adjective";
            } else if (type == 'part') {
                this.darkColorPart = "rgb(90,105,162)";
                this.darkColorAdjective = "rgb(143,170,220)";
                this.darkColorVerb = "rgb(143,170,220)";
                this.darkColorNoun = "rgb(143,170,220)";
                this.darkColorAll = "rgb(143,170,220)";
                this.annotationType = "Root.partname";
            } else {
                this.darkColorPart = "rgb(143,170,220)";
                this.darkColorAdjective = "rgb(143,170,220)";
                this.darkColorVerb = "rgb(143,170,220)";
                this.darkColorNoun = "rgb(143,170,220)";
                this.darkColorAll = "rgb(90,105,162)";
                this.annotationType = "Root._word";
            }
            await this.getFacetList();
            document.body.style.cursor = 'default';
        },
        //textAreaの表示を変更します
        changeTextAreaShow() {
            if (this.textAreaShow) {
                this.textAreaShow = false;
            } else {
                this.textAreaShow = true;
            }
        },
        texAreaFocus($el) {
            this.textAreaNotice = ''
        },
        async complete() {
            try {
                if (this.rateCommentonoff && (!this.userAnswer.q1 || !this.userAnswer.q2)){
                    this.$alert('<span>アンケートを入力してから作業完了してください。</span>', 'アンケート未記入', {
                        confirmButtonText: 'OK',
                        dangerouslyUseHTMLString: true,
                        customClass: "boxMessage",
                        type: 'error',
                        showClose: false,
                        confirmButtonClass: "confim-btn"
                    }).then(() => {
                    });
                }else{
                    //  log done
                    const data = {
                        'searchid': this.searchid,
                        'groupid': this.groupid,
                        'isclick': '1',
                        'username': this.username
                    }
                    const result = await app_axios({
                        method: 'POST',
                        url: '/workComplete',
                        data
                    })
                    if(result.data.code == 200){
                        await this.logTraceInfo()
                        location.reload()
                    }
                }
            } catch (error) {
                console.error(error);
            }
        },
        async clear() {
            await this.logTraceInfo()
            location.reload();
        },
        //戻る検索一覧表示
        goBackSearchList() {
            //検索結果詳細表示
            this.showSearchDetail = false;
            //検索一覧非表示
            this.showSearchList = true;
        },
        //検索画面に戻る機能
        goBackKeywordText() {
            //判定に類似の検索キーワードが含まれています
            this.queryData[condition['inputTextField']] = this.search_content['search'];
            //カテゴリ選択(故障設備、部品)表示
            this.showCategory = true;
            //キーワード選択orテキスト入力
            this.showKeywordText = true;
            //検索一覧非表示
            this.showSearchList = false;
        },
        //戻る前の検索結果
        goBackSimlarResult() {
            this.search('backSimlarSearchType');
        },
        //検索結果詳細表示
        showDetail(row) {
            this.reportid = row.reportid
            this.searchDetailInfo = this.getArticleDetailByReportid()
            //検索一覧非表示
            this.showSearchList = false
            //検索結果詳細表示
            this.showSearchDetail = true
        },
        //getarticleDetail form reportid
        getArticleDetailByReportid() {
            let detailArray = []
            this.searchList.map(item => {
                if (this.reportid === item.reportid) {
                    detailArray.push(item)
                }
            });
            return detailArray
        },
        //insert into search result
        async insertSearchList(searchType) {
            //similar searches,then simdoc_search_times + 1
            if (searchType === 'similarSearchType') {
                this.simdoc_search_times += 1;
            }
            //search cost time
            let cost_time_display_to_search = parseInt(this.searchdatetime - this.dispaly_start_time) / 1000; //second
            let _article = {};
            for (let i = 0; i < this.articles.length; i++) {
                let rankNum = i + 1
                const rankArticle = this.articles[i];
                const article_id = rankArticle['reportid'];
                const article_score = rankArticle['score'].toString();
                const article_order = rankArticle['order'];
                _article['rank' + rankNum + '_id'] = article_id;
                _article['rank' + rankNum + '_score'] = article_score;
                _article['rank' + rankNum + '_order'] = article_order;
            }
            //key word select times from this.keyWordTexts.length
            this.keyword_select_times = this.keyWordTexts.length === 0 ? 0 : this.keyWordTexts.length;
            let data = {
                ...this.inParameters,
                ..._article,
                'costTime': cost_time_display_to_search.toString(),
                'search_type': this.search_type,
                'simdoc_search_times': this.simdoc_search_times.toString(),
                'keyword_select_times': this.keyword_select_times.toString(),
            };
            const insertResult = await app_axios({
                method: 'POST',
                url: '/insertSearchHistory',
                data
            });
            //get searchid from insertResult
            if (insertResult.data.code == 200) {
                this.searchid = insertResult.data.data;
            } else {
                this.loading = false
                //検索条件初期画面 -> 表示
                this.showCategory = true;
                this.showKeywordText = true;
                //検索一覧、検索結果画面 -> 非表示
                this.showSearchList = false;
                this.showSearchDetail = false;              
            }
        },
        //update rate eval
        async updateEval(obj, callBack) {
            let data = {
                'search_id': this.searchid,
                'reportid': obj.reportid,
                'folding': '0',
                'eval_list': obj.eval_list,
                'eval_detail': obj.eval_detail,
                "factory": obj.factory,
                "process": obj.process,
                "block": obj.block,
                "type": obj.type,
                "facility": obj.facility,
                "apparatus": obj.apparatus,
                "point": obj.point,
                "part": obj.showPart,
                "special_type": obj.special_type,
                "cause_type": obj.cause_type,
                "trouble_type": obj.trouble_type,
                "action_status": obj.action_status,
                "occur_date": obj.occur_date,
                "recovery_date": obj.recovery_date,
                "stop_time": obj.stop_time.toString(),
                "start_date": obj.start_date,
                "fix_date": obj.fix_date,
                "fix_time": obj.fix_time.toString(),
                "subject": obj.subject,
                "request_type": obj.request_type,
                "trouble_text": obj.trouble_text,
                "score": obj.score,
                "cause_text": obj.cause_text,
                "action_text": obj.action_text,
                "investigation": obj.investigation,
                "username": this.username
            };
            let evalResult = await app_axios({
                method: 'POST',
                url: '/updateEval',
                data
            });
            callBack(evalResult.data);
        },
        //child's eval render parent eval
        rateParentEval(obj) {
            this.searchList.map((value, index) => {
                if (this.searchList[index].reportid === obj.reportid) {
                    value.eval_list = obj.eval_list
                    value.eval_detail = obj.eval_detail
                    value.eval_show = obj.eval_show
                }
            })
        },
        //insert into comment result
        async insertSurveyList(comment) {
            let data = {
                'searchid': this.searchid,
                'username': this.username,
                'groupid': this.groupid,
                'usercomment': comment.usercomment,
                ...comment.question
            };

            let surveyResult = await app_axios({
                method: 'POST',
                url: '/insertSurvey',
                data
            });
            this.userComment = comment.usercomment
            if (surveyResult.data.code == 200) {
                this.answerDisabled = true                
                this.userAnswer = comment.question
                alert(message.presumptionCause)
            }
        },
        updateUserComment(usercomment) {
            this.userComment = usercomment
        },
        //format factory conditions
        formatFactoryConditions(checkList) {
            if(checkList.length == 1){
                return 'factory:' + checkList[0]
            }else{
                return 'factory:(' + checkList.join(" OR ") + ")"
            }
        },
        //類似文書検索
        receiveSimilarEvent(obj) {
            this.queryData[condition['inputTextField']] = obj; //modify
            //add search type is similar
            this.search('similarSearchType');
        },
        //類似文書検索——詳細
        receiveSimilarDetailEvent(obj) {
            this.queryData[condition['inputTextField']] = obj; //modify
            //add search type is similar
            this.search('similarSearchType');
            this.showSearchDetail = false;
            this.showSearchList = true;
        },
        async logTraceInfo() {
            try {
                await app_axios({
                    method: 'POST',
                    url: '/traceInfo',
                    data: {
                        username: this.username
                    }
                })
            } catch (error) {
                alert(error.message)
                throw error
            }
        },
        queryConditionAttribute() {
            let conditionFiled = {};
            let condition1 = this.condition;
            let condition2 = this.condition2;
            let condition3 = this.condition3;
            for (let i in condition1.sels) {
                let name = condition1.sels[i].name;
                let text = condition1.sels[i].text;
                conditionFiled[name] = text;
            }
            for (let k in condition2.sels) {
                let name = condition2.sels[k].name;
                let text = condition2.sels[k].text;
                conditionFiled[name] = text;
            }
            for (let j in condition3.sels) {
                let name = condition3.sels[j].name;
                let text = condition3.sels[j].text;
                conditionFiled[name] = text;
            }
            return conditionFiled;
        },
        //query Category Text by name
        queryCategoryName(selectedCategory) {
            let categoryObject = {}
            const resultFields = this.queryConditionAttribute();
            for (let key in selectedCategory) {
                for (let field in resultFields) {
                    if (field === key && key !== 'trouble_text') {
                        let textName = resultFields[field];
                        let categoryValue = selectedCategory[key];
                        categoryObject[textName] = categoryValue;
                    }
                }
            }
            return categoryObject;
        },
        async selectorChange(opt, index){
            document.body.style.cursor = 'wait'
            const sels = this.condition.sels
            if(index === -1) {
                // 1、indexが「-1」(工場初期化)
                await this.getOptions(sels, sels[0].name, index)

                // 1.2、デフォルト値設定 キーワード検索 
                let factory = this.$cookies.get('factory')
                if(factory && this.condition.sels[0].options.filter(i => i.name == factory).length > 0){
                    this.checkList = [factory]
                    this.queryData.factory = factory
                    await this.getOptions(sels, sels[1].name, 0)
                    await this.getFacetList()
                }else {
                    this.checkList = []
                    this.queryData.factory = '--'
                    await this.getFacetList()
                }
            }else if(index === 6) {
                // 2、indexが「6」(部位選択)の場合：キーワード検索要
                await this.getFacetList()
            }else {
                // 3.1 検索表示工場変更
                if(index === 0) {
                    let factory = this.queryData.factory;
                    this.checkList = factory === this.optionDefault ? [] : [factory];
                    this.$cookies.set('factory',factory,-1)
                }

                // 3.2、設備プルダウンの変更時、この項目以降、'--'を設定する
                await this.resetSelectorOptions(sels,index + 1)

                // 3.3、'--'を選択しない時、次のプルダウンデータを取得する
                if (this.queryData[opt.name] !== '--') {
                    await this.getOptions(sels, sels[index + 1].name, index)

                    // 区分場合：号機　と　設備取得
                    if(index == 2){
                        await this.getOptions(sels, sels[index + 2].name, index + 1)
                    }
                }else{
                    // 号機場合：'--'でも、設備を取得する
                    if(index == 3){
                        await this.getOptions(sels, sels[index + 1].name, index)
                    }
                }

                await this.getFacetList()
            }
            this.selectedCategory = this.queryCategoryName(this.queryData);
            document.body.style.cursor = 'default';
        },
        async selectorChange2(opt, index){
            document.body.style.cursor = 'wait'
            const sels = this.condition2.sels

            if(index === -1) {
                // 1、indexが「-1」(故障部品1初期化)
                await this.getOptions(sels, sels[0].name, index)
                await this.getOptions(sels, sels[1].name, 0)
            }else if(index === 3) {
                // 2、indexが「3」(故障部品4)の場合：キーワード検索要
                await this.getFacetList()
            }else {
                // 3.1、部品プルダウンの変更時、この項目以降、'--'を設定する
                await this.resetSelectorOptions(sels,index + 1)

                // 3.2、'--'を選択しない時、次のプルダウンデータを取得する
                if (this.queryData[opt.name] !== '--') {
                    await this.getOptions(sels, sels[index + 1].name, index)
                }
                await this.getFacetList()
            }
            this.selectedCategory = this.queryCategoryName(this.queryData);
            document.body.style.cursor = 'default';
        },
        async selectorChange3(opt, index){
            document.body.style.cursor = 'wait'
            const sels = this.condition3.sels

            if(index === -1) {
                // 1、indexが「-1」(専門初期化).
                await this.getOptions(sels, sels[0].name, index)
            }else {
                await this.getFacetList()
            }
            this.selectedCategory = this.queryCategoryName(this.queryData);
            document.body.style.cursor = 'default';
        },
        async getOptions(sels, facetField, index) {
            try {
                let facetQueryParam = { ...facetQuery }
                let q_condition_array = [];
                sels.forEach(item => {
                    let selName = item.name;
                    let value = this.queryData[selName]
                    if(value && value.trim() != '' && value != this.optionDefault){
                        q_condition_array.push(`${selName}:"${value}"`);
                    }
                })
                // requestのパラメータを設定する
                if(q_condition_array.length > 0) {
                    facetQueryParam.queryString =  q_condition_array.join(" AND ")
                }
                facetQueryParam.facetField = 'Root.' + facetField

                const result = await app_axios({
                    method: 'POST',
                    url: '/getOptions',
                    data: facetQueryParam
                });

                if(result.data.code == 200 && result.data.data.data.response) {
                    let option_arrays = result.data.data.data.response.tokens.filter(i => i.label && i.label.trim()).map(item=>{
                        let object = {}
                        object["name"] = item.label
                        return object
                    });
                    //選択項目の並び順を昇順する。
                    this.sortByAsc(option_arrays)
                    option_arrays.unshift({"name":this.optionDefault})
                    sels[index + 1].options = option_arrays
                }
            } catch (error) {
                console.log(error);
            }
        },
        //reset selector options
        async resetSelectorOptions(sels, index) {
            for (let i = index; i < sels.length; i++) {
                let option_name = sels[i].name;
                this.queryData[option_name] = this.optionDefault;
                sels[i].options = [{ "name": '--' }];
            }
            document.body.style.cursor = 'default';
        },
        //ファセット一覧取得
        async getFacetList() {
            try {
                let facetQueryParam = { ...facetQuery }
                let q_condition_array = [];
                //　設備 
                this.condition.sels.forEach(item => {
                    let selName = item.name;
                    let value = this.queryData[selName]
                    if(value && value.trim() != '' && value != this.optionDefault){
                        q_condition_array.push(`${selName}:"${value}"`);
                    }

                })

                //　部品 
                this.condition2.sels.forEach(item => {
                    let selName = item.name;
                    let value = this.queryData[selName]
                    if(value && value.trim() != '' && value != this.optionDefault){
                        q_condition_array.push(`${selName}:"${value}"`);
                    }

                })

                //　専門 
                this.condition3.sels.forEach(item => {
                    let selName = item.name;
                    let value = this.queryData[selName]
                    if(value && value.trim() != '' && value != this.optionDefault){
                        q_condition_array.push(`${selName}:"${value}"`);
                    }

                })

                if (q_condition_array.length > 0) {
                    facetQueryParam.queryString = q_condition_array.join(" AND ");
                }

                facetQueryParam.facetField = this.annotationType;

                const facets = await this.getFacet(facetQueryParam);

                // 品詞を指定するタブを押すと、キーワードが消える現象あり
                this.dataFacets = facets;

                //restore default sort by count desc.
                this.sortFacet(this.selectOrderValue);
            } catch (error) {
                console.log(error);
            }
        },
        async getFacet(params) {
            try {
                const result = await app_axios({
                    method: 'POST',
                    url: '/getKeyWord',
                    data: params
                });

                let array_facets = []
                if (result.data.code == 200) {
                    const response = result.data.data.data.response
                    if(response){
                        const res_arr = response.tokens
                        if (res_arr.length > 0) {
                            //get label,count,correlation
                            const annotation_word = params["facetField"];
                            for (let i = 0; i < res_arr.length; i++) {
                                if(annotation_word === 'Root._word.Adjective') {
                                    //「だ」の末尾を空に置換
                                    res_arr[i]["label"] = res_arr[i]["label"].replace(/[&だ]$/,"");
                                }
                                let obj = {
                                    "label": res_arr[i]["label"],
                                    "count": res_arr[i]["count"],
                                    "correlation": res_arr[i]["correlation"],
                                };
                                //matching numbers and letters are 1 bit,include ()
                                const regex = /^[a-z0-9]{1}$/i;

                                if (obj.correlation > 0 && !keyword.excludeKeywords.includes(obj.label) && !regex.test(obj.label)) {
                                    array_facets.push(obj);
                                }
                            }
                        }
                    }
                }
                return array_facets
            } catch (error) {
                throw error
            }
        },
        //calculate the number of keywords    
        addfacetword(_word) {
            let res = false
            let facetObj = {
                showfacetbuttonflag: true
            }
            if(this.keyWordTexts.length > 0){
                res = this.keyWordTexts.some(item => {
                    if(item.facetword == _word){
                        return true
                    }
                })
            }
            if(!res){
                this.keyword_select_times += 1;
                facetObj.facetword = _word;
                this.keyWordTexts.push(facetObj);
            }
            this.keyWordTexts.length < 3 && this.queryData[condition['inputTextField']] == '' ? this.alertShow = true : this.alertShow = false
            //scroll to bottom
            this.$nextTick(function() {
                const scrollWidth = this.$el.scrollWidth
                const scrollHeight = this.$el.scrollHeight
                window.scrollTo(scrollWidth, scrollHeight)
            })
        },
        //日付範囲を取得する
        async getDateRange() {
            const result = await app_axios({
                method: 'POST',
                url: '/getDateRange',
            })
            if (result.data.code == 200) {
                this.dateRangeDisabled = false;
                let responseData = result.data.data;
                //sim start date
                let startDate = responseData[1];
                //sim end date
                let endDate = responseData[0];
                //startDate datepicker components view
                this.selectStartDate = new Date(startDate);
                //endDate datepicker components view
                this.selectEndDate = new Date(endDate);
                //label initDate view
                this.showInitDate = startDate + ' ~ ' + endDate;
                
                //sim date range max and min value
                this.simDateRange = [startDate,endDate];
                //datepicker components v-model value
                this.occur_date = 'occur_date:[' + startDate + ' TO ' + endDate + ']';
            } else {
                this.dateRangeDisabled = true;
            }
        },
        sortFacet(sortby) {
            this.dataFacets = this.facetsSortBy(this.dataFacets, sortby, 'desc');
            if (sortby == 'count') {
                this.downColor = "rgb(90,105,162)";
                this.upColor = "rgb(143,170,220)";
            } else {
                this.upColor = "rgb(90,105,162)";
                this.downColor = "rgb(143,170,220)";
            }
            this.selectOrderValue = sortby;
        },
        //add index and flag in searchList
        addPropertyToArrays(searchList) {
            return searchList.map((item, index) => {
                item.rankIndex = index + 1
                item.index = index + 1
                item.No = index + 1
                //replace <br><br> with <br>
                if (item.investigation && item.investigation !== 'ー') {
                    item.investigation = String(item.investigation).replace(/(<br>){2}/g, "<br>");
                } else {
                    delete item.investigation;
                }
                return item
            })
        },
        //format this.dispaly_start_time
        formatDateTime() {
            let date = new Date();
            var year = date.getFullYear() * 10000;
            var month = (date.getMonth() + 1) * 100;
            var day = date.getDate();
            var hour = date.getHours() * 10000;
            var minute = date.getMinutes() * 100;
            var second = date.getSeconds();
            var totalTimeStr = (year + month + day) * 1000000 + (hour + minute + second);
            this.groupid = totalTimeStr.toString();
        },
        facetsSortBy(facets, sortbyArr, type) {
            if (Array.isArray(facets)) {
                return facets.sort(function(a1, a2) {
                    if (type === 'asc') {
                        return a1[sortbyArr] - a2[sortbyArr]
                    } else {
                        return a2[sortbyArr] - a1[sortbyArr]
                    }
                })
            }
        },
        //select DatePicker
        selectDatePicker() {
            this.selectStartDate = this.GMTToStr(this.selectStartDate);
            this.selectEndDate = this.GMTToStr(this.selectEndDate);
            let startDate = this.selectStartDate;
            let endDate = this.selectEndDate;
            //期間指定のチェックボックスを選択する
            this.datechecked = true;
            this.occur_date = 'occur_date:[' + startDate + ' TO ' + endDate + ']';
        },
        //GMT转成Str
        GMTToStr(time) {
            let date = new Date(time);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            console.log("month", typeof(month));
            let day = date.getDate();
            if (String(month).length === 1) {
                month = '0' + month;
            }
            if (String(day).length === 1) {
                day = '0' + day;
            }
            let Str = year + '-' + month + '-' + day;
            return Str
        },
        //GMT to YYYY年M月D日
        formateTime(time) {
            let date = new Date(time);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let Str = year + '年' + month + '月' + day + '日';
            return Str
        },
        //factory group color switch
        changeBackGround(key) {
            this.currntTab = key;
            this.checkList = this.productConfig[this.currntTab];
        },
        //選択項目の並び順を昇順する。
        sortByAsc(array) {
            array.sort((item1, item2)=> {
                return item1.name.localeCompare(item2.name);
            });
        },
        async getUserInfo(){
            const result = await app_axios({
                method: 'POST',
                url: '/getUserInfo',
            })
            if(result.data.code == 200){
                this.username = result.data.data.username
                this.name = result.data.data.name
            }
        }
    },
    async created() {
        this.getUserInfo()
        this.selectorChange({}, -1)
        this.selectorChange2({}, -1)
        this.selectorChange3({}, -1)
        if (this.onoff === 'on') {
            this.disabled = false;
            this.commentDisabled = false;
        } else {
            this.disabled = true;
            this.commentDisabled = true;
        }
        //クエリの日付範囲
        await this.getDateRange();
    },
    //画面読み込み完了実行機能
    async mounted() {
        this.dispaly_start_time = new Date();
        this.formatDateTime();
        window.setInterval(this.formatDateTime, 60 * 60 * 3 * 1000);
    },
}).$mount('#app')