<template>
    <!-- 条件筛选 -->
    <div class="condition-container">
        <!-- 头部 -->
        <div class="header-container">
            <span><i :class="[headIcon]" aria-hidden="true"></i> {{title}}</span>
            <span class="header-right">
                <slot name="operation"></slot>
            </span>
            <span v-if="showShrinkBtn" class="header-right shrink-btn" :style="{transform: shrinkStatus?'rotate(0deg)':'rotate(180deg)'}" @click="shrinkClick">
                <i class="el-icon-caret-top"></i>
            </span>
        </div>
        <!-- 内容 -->
        <div ref="content" class="content-container" :style="{height: shrinkStatus?contentHeight:0, paddingTop: shrinkStatus?'15px':0, padding: padding}">
            <slot />
        </div>
    </div>
</template>

<script>
    export default {
        name: "ConditionScreening",
        data(){
            return {
                shrinkStatus: true
            }
        },
        props: {
            title: {
                type: String,
                default: '条件筛选'
            },
            contentHeight: {
                type: String,
                default: 'auto'
            },
            headIcon: {
                type: String,
                default: 'fa fa-filter'
            },
            showShrinkBtn: {
                type: Boolean,
                default: false
            },
            padding: {
                type: String,
                default: '15px 15px 0'
            },
        },
        methods: {
            shrinkClick(){
                this.shrinkStatus = !this.shrinkStatus;
                // 重新绘制表格高度
                this.$nextTick(()=>{
                    const vTableDom = document.querySelector('.Adaption-container');
                    if(!vTableDom){return}
                    const vTable = vTableDom.__vue__;
                    if(!vTable){return}
                    const $table = vTable.$refs.eTable;
                    if(!$table){return}
                    const height = window.innerHeight - $table.$el.getBoundingClientRect().top - 70;
                    $table.layout.setHeight(height);
                    $table.doLayout();
                });
            }
        }
    }
</script>

<style scoped lang="scss">

    .condition-container {
        width: 100%;
    }

    .header-container {
        position: relative;
        width: 100%;
        height: 35px;
        line-height: 35px;
        padding: 0 15px;
        color: #fafafa;
        background: linear-gradient(to bottom, rgb(55, 143, 204), rgb(73, 123, 204));
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        user-select: none;
    }

    .header-right {
        position: absolute;
        right: 15px;
    }

    .shrink-btn {
        font-size: 20px;
        padding: 0 5px;
        transition: transform .3s;
        color: #fafafa;
        cursor: pointer;
    }

    .content-container {
        position: relative;
        width: 100%;
        border: 1px solid #dfe6ec;
        border-top: none;
        padding: 15px 15px 0;
        overflow: hidden;
        transition: all .4s;
    }

</style>
