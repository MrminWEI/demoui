import Fetch from 'fetch';

export function getDictList() {
    return Fetch.get("/system/jwt/loadStaticData");
}

export function page(query) {
    return Fetch.get("/system/dict/list",query);
}

export function addObj(obj) {
    return Fetch.post("/system/dict",obj);
}

export function getObj(id) {
    return Fetch.get('/system/dict/' + id,null);
}

export function delObj(id) {
    return Fetch.delete('/system/dict/delete/' + id,null);
}

export function putObj(id, obj) {
    return Fetch.put('/system/dict/' + id,obj);
}
