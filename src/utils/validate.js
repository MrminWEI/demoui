/**
 * Created by jiachenpan on 16/11/18.
 */

/* 是否是公司邮箱*/
export function isWscnEmail(str) {
  const reg = /^[a-z0-9](?:[-_.+]?[a-z0-9]+)*@wallstreetcn\.com$/i;
  return reg.test(str.trim());
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return urlregex.test(textval);
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}

/* 验证key*/
// export function validateKey(str) {
//     var reg = /^[a-z_\-:]+$/;
//     return reg.test(str);
// }

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str);
}

//检查是否是正整数
export function validateNumber(str) {
  const reg = /^\+?[1-9][0-9]*$/;
  return reg.test(str);
}
//检查邮件格式
export function validateEmail(str) {

  const myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
  return myreg.test(str);
}
//检查手机号
export function validateMobile(str) {

  const mymobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
  return mymobile.test(str);
}
//验证手机号(手机号不是必填项时)
export function validatPhone2(rule, value, callback) {
  let reg = /^1[3|4|5|7|8][0-9]\d{8}$/
  if (!value) {
    callback()
  } else if (!reg.test(value)) {
    callback(new Error('请输入正确的11位手机号码'))
  } else {
    callback()
  }
}
//值 不能为空格或空串
export function spacelValidator(rule, value, callback) {
  if (!value) {
    callback("不能为空");
  } else if (/^\s+$/gi.test(value)) {
    return callback("不能为空");
  } else {
    callback();
  }
}

export function validateLowerCase2(rule, value, callback) {
    let reg = /^[a-z]+$/;
    if (!value){
        callback("不能为空");
    } else if (!reg.test(value)){
        return callback("只能输入小写字母");
    } else {
        callback();
    }

}

