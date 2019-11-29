import Fetch from 'fetch';
// 查询表单数据
export function getFormPage(param) {
    return Fetch.get('/form/list', param);
}
//新增表单数据
export function addForm(obj) {
    return Fetch.post('/form/add', obj);
}
//修改表单数据
export function updateForm(obj) {
    return Fetch.post('/form/save', obj);
}
