import Fetch from 'fetch';

export function page(query) {
    return Fetch.get("/system/dictDetail/list",query);
}

export function addObj(obj) {
    return Fetch.post("/system/dictDetail",obj);
}

export function getObj(id) {
    return Fetch.get('/system/dictDetail/' + id,null);
}

export function delObj(id) {
    return Fetch.delete('/system/dictDetail/delete/' + id ,null);
}

export function putObj(id, obj) {
    return Fetch.put('/system/dictDetail/' + id,obj);
}
