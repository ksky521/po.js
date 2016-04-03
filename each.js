var $ = require('base');
var type = $.type;
/**
 * each方法
 * @function each
 * @param  {Object} obj    要遍历的对象
 * @param  {Function} iterator 处理函数
 * @param  {Object} context  选填上下文
 * @example
 * each([1,2,3], function(v, i){console.log(v,i)});
 * 1,0
 * 2,1
 * 3,2
 * //注意和jQuery和zepto的each不同，第一个参数是索引
 */
module.exports = function (obj, iterator, context) {
  if (typeof obj !== 'object') {
    return;
  }

  var i, l, t = type(obj);
  context = context || obj;
  if (t === 'array' || t === 'arguments' || t === 'nodelist') {
    for (i = 0, l = obj.length; i < l; i++) {
      if (iterator.call(context, obj[i], i, obj) === false) return;
    }
  } else {
    for (i in obj) {
      if (obj.hasOwnProperty(i)) {
        if (iterator.call(context, obj[i], i, obj) === false) return;
      }
    }
  }
}
