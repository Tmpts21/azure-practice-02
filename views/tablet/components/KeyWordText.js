module.exports = {
    props: ['keywords'],
    template:`
    <span v-if="keywords.facetword.length >0 && keywords.showfacetbuttonflag" @click="showButton({'facetWord':keywords.facetword})">
        <el-button type="danger" class="keyWordStyle">
        <span class="facetButtonText">{{keywords.facetword}}</span>
        <i style="font-size:14px" class="el-icon-error el-icon--right"></i>
        </el-button>
    </span>`,
    data() {
       return {}
    },
    methods: {
        showButton(obj) {
            let facetWord = obj.facetWord;
            this.$emit('remove-facet-value',facetWord);
        }
    },
    mounted() {}
}