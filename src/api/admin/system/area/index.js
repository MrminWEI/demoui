import Fetch from 'fetch';

/**
 * 获取全部地区的树形结构数据
 * **/
export function fetchTree(query) {
    return Fetch.get('/system/area/tree',query);
}

/**
 * 获取地区的list数据
 * **/
export function page(query) {
    return Fetch.get('/system/area/list',query);
}

/**
 * 通过地区ID获取该地区的数据
 * **/
export function getArea(id) {
    return Fetch.get('/system/area/' + id,null);
}

/**
 * 提交更新的地区数据
 * **/
export function putArea(id, obj) {
    return Fetch.put('/system/area/' + id,obj);
}

/**
 * 提交新增的地区数据
 * **/
export function addArea(obj) {
    return Fetch.post('/system/area',obj);
}

/**
 * 通过地区ID删除地区
 * **/
export function delArea(id) {
    return Fetch.delete('/system/area/' + id,null);
}
/**
恢复地区

**/
export function recoverArea(id){
    return Fetch.put('/system/area/revocer/' + id,null);
}

export function checkExitsOrg(param) {
    return Fetch.get('/system/area/checkExitsOrg',param);
}

export function fetchTree1(areaId) {
    return Fetch.get('/system/area/tree/'+areaId,null);
}
