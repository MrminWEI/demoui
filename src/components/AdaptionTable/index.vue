<template>
    <div class="Adaption-container" :style="{padding: containerPadding}">

        <!-- 头部 -->
        <div class="header-container" v-if="showHeader">
            <span><i class="fa fa-table" aria-hidden="true"></i> {{title}}</span>
            <span class="header-right">
                <slot name="operation"></slot>
            </span>
        </div>

        <!-- 自适应高度表格 -->
        <el-table ref="eTable" v-bind="$attrs" v-on="$listeners" height="100%" :show-header="showTableHeader" :border="!($attrs.border === false)" fit highlight-current-row v-el-table-height-adaptive="{bottomOffset: 70}">
            <slot />
        </el-table>

        <!-- 分页器 -->
        <div class="pagination-container">
            <slot name="pagination"></slot>
        </div>

    </div>
</template>

<script>
    export default {
        name: 'AdaptionTable',
        props: {
            showTableHeader: {
                type: Boolean,
                default: true
            },
            showHeader: {
                type: Boolean,
                default: true
            },
            title: {
                type: String,
                default: '数据表格'
            },
            containerPadding: {
                type: String,
                default: '20px 0;'
            }
        }
    }
</script>

<style scoped lang="scss">

    .Adaption-container {
        position: relative;
        width: 100%;
        padding: 20px 0;;
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

    .pagination-container {
        position: absolute;
        right: 10px;
        padding-top: 20px;
    }

    @media screen and (max-width: 650px){
        .pagination-container {
            display: none;
        }
    }

</style>

<style>
    .pagination-container .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #1771ce !important;
    }
</style>
