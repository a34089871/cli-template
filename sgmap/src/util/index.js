export const getCode=function (url) {
  if(url.indexOf('?')==-1){
    url = '?' + window.location.hash.split('?')[1]
  }
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=');
      let key = decodeURIComponent(tempArr[0]);
      let val = decodeURIComponent(tempArr[1]);
      obj[key] = val;
    });
  }
  
  return obj;
}
  
export const typeJudge=function(url) {
  const portal=url.indexOf('imap-service-portal'),maintain=url.indexOf('imap-service-maintain')
    ,i=url.indexOf('imap-service-i')
  let state=-1
  if(portal>-1){
    state=portal
  }else if(maintain>-1){
    state=maintain
  }else if (i>-1){
    state=i
  }
  return state
}
export const addToken=function(url) {
  const type=typeJudge(url)
  let src=''
  if(type<0){
    src=url
  }else {
    src=url+'?token='+JSON.parse(window.top.localStorage.getItem('loginTicket'))['access_token']
  }
  return src
}
/**
   * 校验密码强度
   * @param {} type 
   * 1:密码长度至少6位，大、小写字母，数字，符号组合至少3种，且同种类不能出现3个及以上相同或顺序排列的字符
   * 2:密码长度至少8位，大、小写字母，数字，符号组合都出现，且同种类不能出现3个及以上相同或顺序排列的字符
   * @param {} password 
   */
export const validPass=function(type,password){
  let ret = false;
  let ret1 = validPassAz09W(type,password);
  if(ret1){
    let ret2 = validPassSame3(password);
    if(!ret2){
      let ret3 = validPassSameOrder(password);
      if(ret3){
        ret = true;
      }
    }
  }
  return ret;
}
/**
   * 校验密码的组成类型
   */
export const validPassAz09W=function(type,password){
  if(type==2){
    //密码长度至少6位，大、小写字母，数字，符号组合至少3种
    let reg = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{6,}$/;
    return reg.test(password);
  }else if(type==3){
    //密码长度至少8位，大、小写字母，数字，符号组合都出现
    let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[1-9])(?=.*[\W]).{8,}$/
    return reg.test(password);
  }
}
/**
   * 连续三位相同
   * @param {*} password 
   */
export const validPassSame3=function(password){
  let reg = /(.)*(.)\2{2}(.)*/g;
  return reg.test(password);
}
/**
   * 顺序排序
   * @param {} password 
   */
export const validPassSameOrder=function(password){
  let arr = password.split('');
  let flag = true;
  for (var i = 1; i < arr.length-1; i++) {
    let firstIndex = arr[i-1].charCodeAt();
    let secondIndex = arr[i].charCodeAt();
    let thirdIndex = arr[i+1].charCodeAt();
    if(thirdIndex - secondIndex == 1&&secondIndex - firstIndex==1){
      flag = false;
    }
  }
  return flag;
}