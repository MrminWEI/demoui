import { getDictList } from 'api/admin/system/dict'
import store from 'store'

export default {
    created() {
        this.getSysDict();
    },
    methods: {
        getSysDict(){
            getDictList().then(res => {
                store.dispatch('common/setDictData', res);
            }).catch(e => {
                console.error('字典请求失败：', e);
            })
        }
    }

}
