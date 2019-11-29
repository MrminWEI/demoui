
// 标准防抖
function debounce(fn, wait) {
    let timeout;
    return function() {
        let that = this;
        let arg = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function(){
            fn.apply(that,arg)
        }, wait);
    }
}


// 先触发式防抖
function preDebounce(fn, wait) {
    let timeout;
    return function(){
        let arg = arguments;
        let that = this;
        clearTimeout(timeout);
        !timeout && fn.apply(that,arg)
        timeout = setTimeout(function(){
            timeout = null;
        }, wait);
    }
}

// 标准节流
function throttle(fn, wait) {
    let timeout;
    return function () {
        if (!timeout) {
            timeout = setTimeout(() => {
                timeout = null;
                fn.apply(this, arguments)
            }, wait)
        }
    }
}


// 先触发式节流
function preThrottle(fn, wait) {
    let timeout;
    return function () {
        if (!timeout) {
            fn.apply(this, arguments)
            timeout = setTimeout(() => {
                timeout = null;
            }, wait)
        }
    }
}

/**
 * 时间转换
 * @param time
 * @param cFormat
 * @returns {*}
 */
export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null;
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
    let date;
    if (typeof time == 'object') {
        date = time;
    } else {
        if (('' + time).length === 10) time = parseInt(time) * 1000;
        date = new Date(time);
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    };
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key];
        if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
        if (result.length > 0 && value < 10) {
            value = '0' + value;
        }
        return value || 0;
    });
    return time_str;
}

// 根据value获取text
export function fillterText(value, arr) {
    let text = '';
    arr.some(item => {
        if((item.value+'') === (value+'')){
            text = item.text;
            return true
        }
    });
    return text
}

//子类找到父类
export function findParentNode(list, id) {
    for (let i in list) {
        if (list[i].id == id) {
            return list[i].pid;
        }
        else{
            if (list[i].children && list[i].children.length > 0) {
                let res = findParentNode(list[i].children, id);
                if(res){
                    return list[i].pid + "," + res;
                }
            }
        }
    }
}
