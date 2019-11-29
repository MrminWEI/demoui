// 全局mixin
export default function globalMixin(Vue) {
    Vue.mixin({
        activated(){
            this.$nextTick(()=>{
                if(!this.$el || !this.$el.querySelector){return}
                const vTableDom = this.$el.querySelector('.Adaption-container');
                if(!vTableDom){return}
                const vTable = vTableDom.__vue__;
                if(!vTable){return}
                const $table = vTable.$refs.eTable;
                if(!$table){return}
                const height = window.innerHeight - $table.$el.getBoundingClientRect().top - 75;
                $table.layout.setHeight(height);
                $table.doLayout();
            });
        }
    });
};