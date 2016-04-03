/* jshint -W801,-W061*/
/**
 * @name cookie
 */
module.exports = {
  /**
   * 设置cookie
   * @param {String} key  cookie名
   * @param {String} value  cookie值
   * @param {String} domain domain
   * @param {Object} date   过期时间，Date实例
   */
  set: function _cookie(key, value, domain, date) {
    if (typeof domain === 'object') {
      date = domain;
      domain = document.domain;
    }
    domain = domain || document.domain;
    if (date === undefined) {
      date = new Date();
    }
    document.cookie = key + '=' + encodeURIComponent(value) + ';domain=' + domain + ';path=/;expires=' + date.toGMTString() + ';';
    return this;
  },
  /**
   * 获取cookie值
   * @param  {String} key cookie名字
   * @return {String}   返回cookie值
   */
  get: function (key) {
    var result = '';
    if (key) {
      var cookies = document.cookie.split('; ');
      var reg = /\+/g;
      for (var i = 0, l = cookies.length; i < l; i++) {
        var parts = cookies[i].split('=');
        var name = parts[0];
        var cookie = parts[1];

        if (key === name) {
          result = decodeURIComponent(cookie.replace(reg, ' '));
          break;
        }
      }
    }
    return result;
  }
};
