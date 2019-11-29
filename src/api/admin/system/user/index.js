import Fetch from 'fetch'

// 获取用户列表
export function page(param) {
    return Fetch.get('/system/user/list', param);
}
export function addObj(obj) {
    return Fetch.post('system/user', obj);
}

export function getObj(id) {
    return Fetch.get('/system/user/' + id, null);
}

export function delObj(id) {
    return Fetch.delete('/system/user/' + id, null);
}

export function putObj(id, obj) {
    return Fetch.put('/system/user/' + id, obj);
}

//删除用户及用户绑定角色(t_s_user,t_coustomer)
export function delObjs(ids) {
    return Fetch.delete('/system/user/all/' + ids, null);

}

export function checkMobile(param) {
    return Fetch.get('/system/user/checkMobile', param);
}

export function getAllUserMap(param) {
    return Fetch.get('/system/user/getAllUserMap', param);

}
//得到所有企业信息
export function getAllEnterpisesMap(param) {
    return Fetch.get('/api/admin/enterprise/getAllEnterpriseMap', param);

}

//得到所有企业信息(带enterprieTypeId)
export function getAllEnterpriseMap2(param) {
    return Fetch.get('/api/admin/enterprise/getAllEnterpriseMap2', param);

}
export function pageCompUser(query) {
    return Fetch.get('/system/user/CompUserlist', query);

}
//删除用户
export function delUserObjs(ids) {
    return Fetch.delete('/system/user/all/user/' + ids, null);

}
//修改密码
export function updateUserPwd(obj) {
    return Fetch.put('/system/user/updateUserPwd', obj);

}

export function checkUserName(param) {
    return Fetch.get('/system/user/checkUserName', param);
}

export function addSysObj(obj) {
    return Fetch.post('/system/user', obj);

}
export function putSysObj(id, obj) {
    return Fetch.put('/system/user/' + id, obj);
}

export function checkPassword(param) {
    return Fetch.get('/system/user/checkPassword', param);

}

//修改手机号
export function updateUserPhone(obj) {
    return Fetch.put('/system/user/updateUserPhone', obj);
}

// export function checkUserType(param) {
//   return Fetch({
//     url: '/system/user/checkUserType',
//     params: param,
//     method: 'get'
//   })
// }

export function getExtObj(id) {
    return Fetch.get('/system/user/ext/' + id);

}
