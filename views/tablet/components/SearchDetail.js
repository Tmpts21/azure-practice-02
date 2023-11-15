module.exports = {
    props: ['article', 'propertyfileds', 'resultfields', 'disabled', 'secondtextonoff', 'thirdtextonoff', 'isfailuresituation', 'similaronoff'],
    template: `
            <div class="article-item" :style="{background:'rgb(239,239,239)'}">
            <div class="detail-button">
               
                <div class="let-right">
                    <div class="content article-content" v-if="isfailuresituation">
                        <button class="item-btn goback-btn" @click="goBackSearchList()">戻る
                        </button>
                    </div>
                </div> 
                <div class="headerButton">
                    <div class="let-right">
                        <div class="content" v-if="isfailuresituation">
                            <button class="item-btn" @click="goSimilarSearch({'text':article.trouble_text})" v-if="similaronoff ==='on'">類似検索</button>
                        </div>
                        <div class="content" v-if="!isfailuresituation">
                            <button class="item-btn" @click="goSimilarSearch({'text':article.cause_text})" v-if="similaronoff ==='on'">類似検索</button>
                        </div>
                    </div>
                    <div class="let-button-left">
                    <div class="content article-content" v-if="isfailuresituation">
                        <button class="item-btn-rank" @click="rateEval(article)" :style="{background: article.eval_show === '0' ? rateImage1 : rateImage}" :disabled="disabled" v-cloak>
                        </button>
                    </div>
                </div> 
                </div>
            </div>
                <div class="header">
                    <div class="let-left">
                        <div class="content article-content" v-if="secondtextonoff === 'on'">
                            <div class="detail-title">故障件名</div>
                            <!--<div class="symbol">：</div>-->
                            <div class="detail-content">{{article.subject}}</div>
                        </div>
                    </div>
                </div>
                <div class="header">
                    <div class="let-left">
                        <div class = "content article-content">
                            <div class="detail-title" style="line-height:38px">故障状況</div>
                            <!--<div v-if="isfailuresituation" class="symbol">：</div>-->
                            <div class="detail-content">{{ article.trouble_text }}</div>
                        </div>
                    </div>
                </div>

                <div class="header">
                    <div class="let-left">
                        <div class="content article-content" v-if="secondtextonoff === 'on'">
                            <div class="detail-title">原因・推定原因</div>
                            <div v-if="isfailuresituation" class="detail-content">{{ article.cause_text }}</div>
                        </div>
                    </div>
                </div>
                <div v-if="secondtextonoff === 'on'" />
                <div class="content article-content" v-if="thirdtextonoff === 'on'">
                    <div class="detail-title">処置内容</div>
                    <!--<div class="symbol">：</div>-->
                    <div class="detail-content">{{ article.action_text }}</div>
                </div>
                <div v-if="secondtextonoff === 'on'" />
                <div class = "footer">
                    <div class="header" style="width:100%">          
                        <div class="let-article">
                            <div class="article-content" v-if="secondtextonoff === 'on'">
                                <div class="content article-content">
                                    <div class="detail-title" style="line-height:38px">調査内容の記入</div>
                                    <div class="detail-content" v-html="article.investigation"></div>
                                </div>
                            </div>
                        </div>
                    </div> 
                </div>

                <div class="footer">
                    <div class="article-content table-title">
                        <span class="project-title">管理項目</span>
                    </div>

                    <div class="tableContent">
                        <div
                            v-for="(v, k) in article"
                            :key="k"
                            v-if="propertyfileds.indexOf(k) !== -1"
                            :style="{width: (k === 'factory' || k==='process' || k==='point' || k==='special_type' || k==='occur_date' || k==='recovery_date') ? '8.66%' : '20.66%'}"
                            class="property-item">
                            <div class="table-column">
                                <div class="table-column-name">{{ resultfields[k] }}</div>
                                <div class="table-column-value">{{ v ? v : 'ー' }}</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        `,
    data() {
        return {
            rateImage: "url('./tablet/icons/rate.png')",
            rateImage1: "url('./tablet/icons/rate1-border.png')",
        }
    },

    methods: {
        async rateEval(row) {
            if(row.eval_show == '0'){
                row.eval_list = '0'
                row.eval_detail = '1'
                row.eval_show = '1'
            }else{
                row.eval_list = '0'
                row.eval_detail = '0'
                row.eval_show = '0'
            }
            this.$emit('rate-eval-event', row, val => {
                if(val.code !== 200) {
                    if(row.eval_show == '0') {
                        row.eval_list = '0'
                        row.eval_detail = '1'
                        row.eval_show = '1'
                      } else {
                        row.eval_list = '0'
                        row.eval_detail = '0'
                        row.eval_show = '0'
                      }
                }
            })
            this.$emit('rate-parent-eval', row)
        },
        goBackSearchList() {
            this.$emit('go-back-search-list', null);
        },
        goSimilarSearch(obj) {
            this.$emit('go-similar-search-detail-event', obj.text)
        }
    }
}
