import Cookies from 'js-cookie'

export function getCookie(key) {
    return Cookies.get(key)
}

export function setCookie(key, value) {
    return Cookies.set(key, value, { expires: 7 })
}

export function removeCookie(key) {
    return Cookies.remove(key)
}

//设置cookie
// export function setCookie(key, value, expiredays) {
// 	let exdate = new Date();
// 	exdate.setDate(exdate.getDate() + expiredays);
// 	document.cookie = key + "=" + escape(value) + ((expiredays==null) ? "" : ";expires=" + exdate.toGMTString());
// }
 
// //取回cookie
// export function getCookie(key) {
// 	if(document.cookie.length > 0){
// 		 c_start = document.cookie.indexOf(key + "=");
// 		 if(c_start != -1){ 
// 	  	 	c_start = c_start + key.length + 1; 
// 	  	 	c_end = document.cookie.indexOf(";", c_start);
// 	  	 	if(c_end == -1){ 
// 	  	 		c_end = document.cookie.length;
// 	  	 	}
// 	  	 	return unescape(document.cookie.substring(c_start, c_end));
// 	     } 
// 	}
// 	return "";
// }