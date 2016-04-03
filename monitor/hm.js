var monitor = require('./monitor');
var HM_GIF_URI = '//hm.baidu.com/hm.gif';
var SITE_ID = '';

var strReplace = function(a) {
    return a.replace ? a.replace(/'/g, "'0").replace(/\*/g, "'1").replace(/!/g, "'2") : a;
};
var urlencode = encodeURIComponent;


var hm = monitor(HM_GIF_URI, {
    customHandler: function(url) {
        return url + '&si=' + SITE_ID + '&nv=0&st=4&v=pixel-1.0';
    }
});
/**
 * 初始化
 * @param  {string} siteId 百度统计申请的si
 * @return {this}        HM
 */
hm.init = function(siteId) {
    SITE_ID = siteId;
    return hm.pv();
};
/**
 * pv统计
 * @param  {string} url 统计的pv url
 * @param  {string} su  来源url，可选
 * @return {this}     HM
 */
hm.pv = function(url, su) {
    var arr = ['u=' + urlencode(url || location.href), 'et=0'];
    if (su) {
        arr.push('su=' + urlencode(su));
    }
    return hm.report(arr.join('&'));
};
/**
 *
 * @param  {string} type  类型（必选）,要监控的目标的名称
 * @param  {string} action 动作（必选）,用户跟网页进行交互的动作名称
 * @param  {tag} tag    标签（可选）,事件的一些额外信息
 * @param  {string} value  值（可选),跟事件相关的数值
 * @return {this}        HM
 *
 */
hm.event = function(type, action, tag, value) {

    //http://hm.baidu.com/hm.gif?cc=1&ck=1&cl=24-bit&ds=1680x1050&ep=download*click*page%20android%20btn1&et=4&fl=14.0&ja=1&ln=zh-CN&lo=0&lt=1406026484&nv=0&rnd=1767986467&si=316abd15ee7fe018d50f827ecbe9400f&st=4&v=1.0.59&lv=2&api=8_0
    var ep = [strReplace(type), strReplace(action)];
    if (tag) {
        ep.push(strReplace(tag));
    }
    if (value) {
        ep.push(strReplace(value));
    }
    return hm.report('ep=' + urlencode(ep.join('*')) + '&et=4');
};
/**
 * 百度统计light版本, 事件跟踪
 * @name  hm
 * @example
 * monitor.hm('init',['59f98742cad02dee9bfba364d1c03a07'])
 * monitor.hm('pv',[url])
 * onclick="monitor.hm('event',['test','click','btn'])"
 *
 *
 */
module.exports = function() {
    hm.main.apply(hm, arguments);
};
