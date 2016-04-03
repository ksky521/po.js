var $ = require('../base');
var urlencode = encodeURIComponent;

var Monitor = function (url, opts) {
    url = url + (url.indexOf('?') < 0 ? '?' : '&');
    this.url = url;
    this.options = opts;
};
//上报
Monitor.prototype.report = function (data) {
    data = data || '';
    var img = new Image(1, 1),
        items = [];
    if ($.isObject(data)) {
        for (var i in data) {
            items.push(i + '=' + urlencode(String(data[i])));
        }
        data = items.join('&');
    }
    var imgName = '__mt' + $.getId();
    window[imgName] = img;
    img.onload = img.onerror = img.onabort = function () {
        img.onload = img.onerror = img.onabort = null;
        window[imgName] = img = null;
    };
    var url = this.url + data;
    if ($.isFunction(this.options.customHandler)) {
        url = this.options.customHandler(url);
    }
    img.src = url + '&_rnd=' + Math.floor(Math.random() * 0x80000000);
    return this;
};

Monitor.prototype.main = function (func, args) {

    if (func && $.isFunction(this[func])) {
        this[func].apply(this, $.toArray(args || []));
    }
    return this;
};

/**
 * 监控上报类
 * @param  {string} url  收集url
 * @param  {object} opts 配置项，非必填
 * @return {Monitor}      返回monitor实例
 * @example
 * var hm = monitor(HM_GIF_URI);
 * module.exports = function(){
 *    //monitor 目录下必须按照此格式来写
 *    hm.main.apply(hm, arguments);
 * };
 */
module.exports = function (url, opts) {
    return new Monitor(url, opts);
};
