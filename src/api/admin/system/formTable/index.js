import Fetch from 'fetch'

// 获取表的信息
export function page(param) {
    return Fetch.get('/system/cgformHead/list', param);
}

export function addObj(obj) {
    return Fetch.post('system/cgformHead', obj);
}

export function checkCgformHead(param) {
    return Fetch.get('/system/cgformHead/checkCgformHead/',param);
}
export function delObjs(ids) {
    return Fetch.delete('/system/cgformHead/delbatch/' + ids);
}

export function getObj(id) {
    return Fetch.get('/system/cgformHead/' + id, null);
}

export function putObj(id, obj) {
    return Fetch.put('/system/cgformHead/' + id, obj);
}

//获取表的字段详细信息
export function pageCgformField(param) {
    return Fetch.get('/system/cgformField/listAll', param);
}

//新增或修改字段详细信息
export function addCgformField(id,obj) {
    return Fetch.post('/system/cgformField/addList/'+id, obj);
}
//删除一条字段信息
export function delCgformField(id) {
    return Fetch.delete('/system/cgformField/' + id);
}

//获取控件字典数据
export function getFieldType() {
    return Fetch.get('/system/config/fieldType');
}
//建表
export function createTable(param) {
    return Fetch.get('/form/createTable/',param);
}
