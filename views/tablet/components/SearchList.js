module.exports = {
  props: ['searchlist', 'disabled', 'similarloading'],
  template: `
  <el-table
  :data="dataTable"
  ref="topicTable"
  :header-cell-style="tableHeader"
  row-key="reportid"
  class="tableBox"
  style="width: 100%;font-size: 17.5px"
  >
  <template slot="empty">
    <div class="similarLoad" v-show="similarloading">
      <img src="./tablet/icons/watson-progress-indicator.gif" alt="similarLoading" v-cloak>
    </div>
    <div class="similarLoad" v-show="!similarloading">
      <span>データなし</span>
    </div>
  </template>
  <el-table-column
    prop="No"
    min-width="7%"
    label="No">
    <template slot-scope="scope">
        <div class="barNo" :style="{marginBottom:((scope.row.show==='true' && scope.row.children) ? maxMargin : normalMargin),marginTop:((scope.row.childrenNumber) ? lowMargin : normalMargin)}">
          <div class="barHeight" :style="{background: scope.row.score_array[0] > 80 ? deepBlueColor : scope.row.score_array[0] < 50 ? lightBlueColor : blueColor }"></div>
          <div class="rowNo">{{ scope.row.No }}<br></div>
        </div>
    </template>
  </el-table-column>
  <!--<el-table-column
    prop="score_array"
    min-width="16%"
    label="スコア">
    <template slot-scope="scope">
    <span style="display:inline-block;margin-top:13px">
    {{scope.row.score_array[0]}}
    </span>
    <br>
    <span class="ellipsisText">{{scope.row.score_array[1]}}</span>
    </template>  
  </el-table-column>-->
  <el-table-column
    min-width="21%"
    prop="occur_date_array"
    label="発生日">
    <template slot-scope="scope">
    <span style="display:inline-block;margin-top:13px">
    {{scope.row.occur_date_array[0]}}
    </span>
    <br>
    <span class="ellipsisText">{{scope.row.occur_date_array[1]}}</span>
    </template>  
  </el-table-column>
  <el-table-column
  prop="factory_array"
  min-width="14%"
  label="工場">
  <template slot-scope="scope">
  <span style="display:inline-block;margin-top:13px">
  {{scope.row.factory_array[0]}}
  </span>
  <br>
  <span class="ellipsisText">{{scope.row.factory_array[1]}}</span>
  </template>  
  </el-table-column>
<el-table-column
    prop="process_array"
    min-width="15%"
    label="工程">
    <template slot-scope="scope">
    <span style="display:inline-block;margin-top:13px">
    {{scope.row.process_array[0]}}
    </span>
    <br>
    <span class="ellipsisText">{{scope.row.process_array[1]}}</span>
    </template>  
  </el-table-column>
<el-table-column
  :show-overflow-tooltip=true
  prop="type_array"
  min-width="18%"
  label="号機">
  <template slot-scope="scope">
  <span style="display:inline-block;margin-top:13px">
  {{scope.row.type_array[0]}}
  </span>
  <br>
  <span class="ellipsisText">{{scope.row.type_array[1]}}</span>
  </template>
</el-table-column>  
  <el-table-column
    :show-overflow-tooltip=true
    prop="subject_array"
    min-width="30%"
    label="件名"
    >
    <template slot-scope="scope">
    <span style="display:inline-block;margin-top:13px">
    {{scope.row.subject_array[0]}}
    </span>
    <br>
    <span class="ellipsisText">{{scope.row.subject_array[1]}}</span>
    </template>
  </el-table-column>
  <el-table-column
    :show-overflow-tooltip=true
    prop="cause_text_array"
    min-width="40%"
    label="原因・推定原因"
    >
    <template slot-scope="scope">
    <span style="display:inline-block;margin-top:13px">
    {{scope.row.cause_text_array[0]}}
    </span>
    <br>
    <span class="ellipsisText">{{scope.row.cause_text_array[1]}}</span>
    </template>
  </el-table-column>
  <el-table-column
    :show-overflow-tooltip=true
    prop="action_text_array"
    label="処置内容"
    min-width="40%">
    <template slot-scope="scope">
    <span class="troubleMargin">
    {{scope.row.action_text_array[0]}}
    </span>
    <br>
    <span class="ellipsisText">{{scope.row.action_text_array[1]}}</span>
    </template>
  </el-table-column>
<el-table-column
    prop="detail"
    min-width="12%"
    label="詳細">
    <template slot-scope="scope">
    <img
    class="dataTableImages"
    :src="detailImage"
    @click="searchDeatils(scope.$index, scope.row)">
    </template>
  </el-table-column>
  <el-table-column
    prop="similarSearch"
    min-width="12%"
    label="類似">
    <template slot-scope="scope">
    <img
    class="dataTableImages"
    :src="similarImage"
    @click="similarSearchText(scope.$index, scope.row)">
    </template>
  </el-table-column>
<el-table-column
    prop="rate"
    min-width="12%"
    label="評価">
    <template slot-scope="scope">
    <button class="rateButton" @click="rate(scope.row)" :style="{background:scope.row.eval_show === '0' ? rateImage1 : rateImage}" :disabled="disabled" v-cloak>
    </button>
    </template>
</el-table-column>
</el-table>`,
  data() {
    return {
      detailImage: './tablet/icons/detail.png',
      similarImage: './tablet/icons/search.png',
      rateImage: "url('./tablet/icons/rate.png')",
      rateImage1: "url('./tablet/icons/rate1.png')",
      dataTable: this.searchlist,
      deepBlueColor:'rgb(72,89,152)',
      blueColor:'rgb(169,179,214)',
      lightBlueColor:'rgb(226,230,241)',
      normalMargin:"0px",
      maxMargin:"22px",
      lowMargin:"-21px"
    }
  },
  async mounted() {
    this.$nextTick(() => {
      this.initStyle();
    });
  },
  watch:{
    searchlist(){
      this.dataTable = this.searchlist
    }
  },
  methods: {
    //init el-table__expand-icon style
    initStyle() {
      let length = document.getElementsByClassName('el-table__expand-icon').length;
      for (let i = 0; i < length; i++) {
        document.getElementsByClassName('el-table__expand-icon')[i].style.display = 'none';
      }
    },    
    tableHeader() {
      return 'color: #000;font-weight: 600;background: #FFF;'
    },
    // search details info
    searchDeatils(index, row) {
      this.$emit('show-detail', row);
    },
    //similar Search 
    similarSearchText(index, row) {
      let trouble_text = row.trouble_text;
      this.$emit('go-similar-search-event', trouble_text);
    },
    //rate eval
    async rate(row) {
      if(row.eval_show == '0'){
        row.eval_list = '1'
        row.eval_detail = '0'
        row.eval_show = '1'
      }else{
        row.eval_list = '0'
        row.eval_detail = '0'
        row.eval_show = '0'
      }
      this.$emit('rate-eval-event', row, val => {
        if(val.code !== 200) {
          if(row.eval_show == '0') {
            row.eval_list = '1'
            row.eval_detail = '0'
            row.eval_show = '1'
          } else {
            row.eval_list = '0'
            row.eval_detail = '0'
            row.eval_show = '0'
          }
        }
      })
    }
  }
}