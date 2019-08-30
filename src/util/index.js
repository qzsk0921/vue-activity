export function checkMobile (phoneNum) {
    if(/^1[1-9]\d{9}$/.test(phoneNum)) {
        return true
    } else {
        return false
    }
}

/*
* @name
* @return string
* */
export function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"),
        reg_rewrite = new RegExp("(^|/)" + name + "/([^/]*)(/|$)", "i"),
        r = window.location.search.substr(1).match(reg),
        q = window.location.pathname.substr(1).match(reg_rewrite);
    if(r != null){
        return unescape(r[2]);
    }else if(q != null){
        return unescape(q[2]);
    }else{
        return null;
    }
}

export function checkMobileSystem () {
    var u = navigator.userAgent
    if (/(iPhone|iPad|iPod|iOS)/i.test(u)) {
        return 'apple';
    } else if (/(Android)/i.test(u)) {
        return 'android';
    } else {
       return 'pc';
    }
  }