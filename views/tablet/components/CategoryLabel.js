module.exports = {
    props: ['text','value'],
    template: `
                <span class="categoryLableText" v-if="value!=='--'">
                {{text}}:{{value}}
                </span>
            `
}