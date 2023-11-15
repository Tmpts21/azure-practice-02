module.exports = {
    props: ['questionanswer', 'showquestion', 'usercomment', 'useranswer', 'disabled'],
    template: `
            <el-dialog 
            :close-on-click-modal="false"
            :visible.sync="showquestion.flag"
            :showClose="showClo"
            width="70%"
            height="60%">
            <div 
            v-for="(content,title) in questionanswer"
            :title="title"
            :questioncontent="content.question"
            :answers="content.answer">
                <div class="questionAnswerCoentent">
                    <span class="questionKey">{{title}}</span>
                    <span class="question">{{content.question}}</span>
                    <div class="questionContent" ref="radioList" v-for="(answer,index) in content.answer" v-show="title == 'Q1'">
                        <label>
                        <input :name="title" type="radio" :value="answer" v-model="q1Value" :disabled="disabled"/>
                        <span class="answer">{{answer}}</span>
                        </label>
                    </div>
                </div>
            </div>
            <el-select v-model="q2Value" placeholder="選択してください" :disabled="disabled" style="width:70%">
                <el-option
                v-for="item in questionanswer['Q2']['answer']"
                :key="item"
                :label="item"
                :value="item">
                </el-option>
            </el-select>
            <div>
                <div class="condition-title1">自由コメント</div>
                <div class="textInput">
                    <div>
                        <img src="./tablet/icons/text.png" class="imageText" @click="textShowMethod()">
                    </div>
                    <div>
                        <textarea style="width:770px"
                            id="query1"
                            rows="2"
                            cols="50"
                            maxlength="100"
                            placeholder=""
                            v-if="textShow"
                            v-model="comment"
                            :disabled="disabled"
                        ></textarea>
                    </div>
                </div>
            </div>
            <div class="questionAnswer">
                <button href="#" id="cancel_btn" class="rounded-btn" @click="clickCancel()">キャンセル</button>
                <button href="#" class="rounded-btn" @click="clickComment()" :disabled="disabled">登録</button>
            </div>
            </div>
            </el-dialog>
            `,
    data() {
        return {
            showClo: false,
            textShow: false,
            q1Value: '',
            q2Value: '',
            comment: '',
            commentResult: {question:{}}
        }
    },
    watch:{
        useranswer(){
            this.q1Value = this.useranswer.q1
            this.q2Value = this.useranswer.q2
        },
        usercomment(){
            this.comment = this.usercomment
            if(this.usercomment){
                this.textShow = true
            }else{
                this.textShow = false
            }
        }
    },
    methods: {
        clickCancel() {
            this.showquestion.flag = false
            this.$emit('update-usercomment', this.comment)
            if(this.comment === '') {
                this.textShow = false
            }
        },
        clickComment() {
            if(this.q1Value && this.q2Value){
                this.showquestion.flag = false;
                this.commentResult.question.q1 = this.q1Value
                this.commentResult.question.q2 = this.q2Value
                this.commentResult.usercomment = this.comment
                this.$emit('get-comment-event', this.commentResult)
                if(this.comment === '') {
                    this.textShow = false
                }
            } else {
                alert("次の質問に答えてください")
            }
        },
        textShowMethod() {
            this.textShow = !this.textShow
        }
    }
}