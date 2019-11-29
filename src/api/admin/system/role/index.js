import Fetch from 'fetch'

export function page(query) {
    return Fetch.get("/system/role/list",query)
}

export function addObj(obj) {
  return Fetch.post("/system/role",obj);
}

export function getObj(id) {
  return Fetch.get( '/system/role/' + id, null)
}

export function delObj(id) {
  return Fetch.delete('/system/role/' + id,null)
}

export function putObj(id, obj) {
  return Fetch.put("/system/role/"+ id,obj)
}

export function getUsers(id) {
  return Fetch.get("/system/role/" + id + "/users");
}

export function modifyUsers(roleId, userIds) {
  const obj = {};
  obj.roleId = roleId;
  obj.userIds = userIds;
  return Fetch.post2("/system/role/" + roleId + "/users",obj)
}


export function modifyMenuAuthority(roleId, data) {
  return Fetch.post2("/system/role/" + roleId + "/authority",data);
}


export function getMenuAuthority(roleId) {
  return Fetch.get("/system/role/" + roleId + "/authority");
}


export function delObjs(ids) {
  return Fetch.delete('/system/role/delbatch/' + ids,null)
}

