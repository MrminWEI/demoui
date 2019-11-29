import Fetch from 'fetch'

// 获取企业列表
export function page(param) {
    return Fetch.get('/system/enterprises/list', param);
}
export function addObj(obj) {
    return Fetch.post('system/user', obj);
}

export function getObj(id) {
    return Fetch.get('/system/enterprises/' + id, null);
}

export function delObjs(ids) {
    return Fetch.delete('/system/enterprises/deleteEnterprises/' + ids, null);
}

export function putObj(id, obj) {
    return Fetch.put('/system/user/' + id, obj);
}



//得到所有区域MAp
export function getAreaMap() {
    return Fetch.get('/system/enterprises/getAreaMap');
}
//得到所有区域树
export function getAreaTree() {
    return Fetch.get('/system/area/tree');
}

export function getParentsByAreaId(areaId) {
    return Fetch.get('/system/enterprises/getParentsByAreaId/'+areaId);
}


export function checkEnterprises(param) {
    return Fetch.get('/system/enterprises/checkEnterprises/', param);
}

export function addSysObj(obj) {
    return Fetch.post('/system/enterprises/addEnterprises', obj);

}
export function putSysObj(id, obj) {
    return Fetch.put('/system/enterprises/' + id, obj);
}

