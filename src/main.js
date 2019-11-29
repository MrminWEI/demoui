import Vue from 'vue'
import Element from 'element-ui'
import VueFilter from 'vue-filter';
import App from './App.vue'
import router from 'router'
import store from 'store'
import 'src/router/routerGuard'
import * as filters from './filters'
import dialogDrag from 'directives/el-dialog-drag'
import tableAdaption from 'directives/el-table-adaption'
import ConditionScreening from 'components/ConditionScreening'
import AdaptionTable from 'components/AdaptionTable'
import { FetchAxios } from 'fetch'
import GlobalMixin from 'mixin'
import pinyin from 'js-pinyin'
//import VueAMap from 'vue-amap';
//import Echarts from 'echarts';
//import 'echarts-amap';
import 'normalize.css'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
//引入自定义全局样式
import 'styles/index.scss'
//引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)

Vue.config.productionTip = false;

/*Vue.use(VueAMap);
Vue.prototype.$echarts = Echarts;*/
Vue.use(Element);
Vue.use(VueFilter);
Vue.use(FetchAxios);
Vue.use(GlobalMixin);
Vue.use(pinyin);
Vue.use(VueQuillEditor)

// 全局组件
Vue.component('ConditionScreening', ConditionScreening);
Vue.component('AdaptionTable', AdaptionTable);

// 全局指令
Vue.directive('el-drag-dialog', dialogDrag);//对话框拖拽指令
Vue.directive('el-table-height-adaptive', tableAdaption);//表格自适应指令

// 全局过滤器
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
});

// 高德地图
/*VueAMap.initAMapApiLoader({
    key: '6ae79a0afe60b2e51857c7516b9c82f0',
    plugin: ['Autocomplete', 'Geocoder', 'PlaceSearch', 'Scale', 'OverView', 'ToolBar', 'ControlBar', 'MapType', 'PolyEditor', 'CircleEditor', 'Geolocation', 'Heatmap', 'MarkerClusterer'],
    v: '1.4.10'
});*/



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
