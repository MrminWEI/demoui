import Vue from 'vue'
import store from 'store'
import {addResizeListener, removeResizeListener} from './resize-event'

/**
 *  <el-table>根据视口宽高自适应
 *
 * 使用说明：
 * 1、在<el-table>标签里加上 v-el-table-height-adaptive 指令 和 height 属性（必须设置 ）
 * 2、bottomOffset可设置表格底部距离页面底部的距离（可选设置，默认30px ）
 * 3、xScroll用于判断当前table是否出现横向滚动条
 *
 * 示例：
 * <el-table height="100px" v-el-table-height-adaptive="{bottomOffset: 30}">...</el-table>
 */

const doResize = (el, binding, vnode) => {
    const {componentInstance: $table} = vnode;
    const {value} = binding;
    if (!$table.height) {
        throw new Error('el-table标签必须设置 height 属性.')
    }
    const bottomOffset = (value && value.bottomOffset) || 30;
    if (!$table) return;
    const height = window.innerHeight - el.getBoundingClientRect().top - bottomOffset;
    $table.layout.setHeight(height);
    $table.doLayout();
    Vue.nextTick(()=>{
        const xScroll =  el.getElementsByClassName('is-scrolling-none').length < 1;
        store.dispatch('sysSetting/setXScroll', xScroll);
    });
};

export default {
    bind(el, binding, vnode) {
        el.resizeListener = () => {
            doResize(el, binding, vnode)
        };
        addResizeListener(window.document.body, el.resizeListener)
    },
    inserted(el, binding, vnode) {
        doResize(el, binding, vnode)
    },
    unbind(el) {
        removeResizeListener(window.document.body, el.resizeListener)
    }
}
