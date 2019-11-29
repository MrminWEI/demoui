import Fetch from 'fetch';

export function fetchTree(query) {
    return Fetch.get("/system/menu/tree",query);

}

export function fetchAll() {
    return Fetch.get("/system/menu/tree",null);
}
export function addObj(obj) {
    return Fetch.post("/system/menu",obj);
}

export function getObj(id) {
    return Fetch.get('/system/menu/' + id,null);

}

export function delObj(id) {
    return Fetch.delete('/system/menu/' + id,null);

}

export function putObj(id, obj) {
    return Fetch.put('/system/menu/' + id, obj);

}
export function fetchUserTree() {
    return Fetch.get('/system/menu/userTree', null);

}
