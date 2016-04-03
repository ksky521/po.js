var now = (+new Date());
var _id = (now + '').slice(-3);
var ua = navigator.userAgent;

var $ = {
  _id: id,
  ua: ua,
  /**
   * 当前系统是否为iOS
   * @type {Boolean}
   */
  isIOS: /(iPhone|iPod|iPad)/.test(ua),
  /**
   * 当前系统是否为android
   * @type {Boolean}
   */
  isAndroid: /(Android);?[\s\/]+([\d.]+)?/.test(ua),
  /**
   * 获取唯一id，用于一些随机数
   * @return {Number} id 随机数
   * @example
   * var jsonpFnName = '_x_' + $.getId();
   */
  getId: function () {
    return _id++;
  },
  /**
   * 空数组
   * @type {Array}
   */
  emptyArr: [],
  /**
   * 空function，用于一些回调函数默认函数
   * @return {Undefined} undefined 未定义
   */
  emptyFn: function () {},
  /**
   * 空object
   * @type {Object}
   */
  cleanObj: {},
  /**
   * document.getElementById实现
   * @param  {String} id nodeID，不带#
   * @return {Object} domlist  DOM节点
   * @example
   * $.getId('id').style.display = 'none';
   */
  byId: function (id) {
    return $.isString(id) ? document.getElementById(id) : id;
  },
  /**
   * 泛数组转换为数组
   * @description 转换后的数组可以用数组方法
   * @param  {Object} arrayLike 类似数组的对象
   * @return {Array}  array 转成数组类型的数组
   * $.toArray(document.querySelectorAll('*')).forEach(function(node){
   *   console.log(node);
   * });
   */
  toArray: function (arrayLike) {
    return $.emptyArr.slice.call(arrayLike);
  },
  /**
   * querySelectorAll选择器
   * @param  {String} selector 选择器
   * @param  {DOM} [context=document]  上下文
   * @return {DomList}   array  返回toArray处理好的dom节点数组
   */
  $: function (selector, context) {
    context = (context && context.nodeType === 1) ? context : document;
    return $.toArray(context.querySelectorAll(selector));
  }
};

/**
 * 是否是function类型
 * @name isFunction
 * @function
 * @param  {Object} obj 要判断的对象
 * @return {Boolean} bool  true|false
 */
/**
 * 是否是string类型
 * @name isString
 * @function
 * @param  {Object} obj 要判断的对象
 * @return {Boolean} bool true|false
 */
/**
 * 是否是array类型
 * @name isArray
 * @function
 * @param  {Object} obj 要判断的对象
 * @return {Boolean} bool 返回true|false
 */
/**
 * 是否是一个Number类型
 * @name isNumber
 * @function
 * @param  {Object} obj 要判断的对象
 * @return {Boolean} bool  返回true|false
 */
/**
 * 是否是一个RegExp类型
 * @name isRegExp
 * @function
 * @param  {Object} obj 要判断的对象
 * @return {Boolean} bool  返回true|false
 */
'Function,String,Array,Number,RegExp'.replace(/[^, ]+/g, function (t) {
  $['is' + t] = function (s) {
    return type(s, t);
  };
});
/**
 * 是否为布尔
 * @function
 * @name isBoolean
 * @param  {Object}  obj 要判断的对象
 * @return {Boolean}  bool true|false
 */
$.isBoolean = function (obj) {
  return obj === true || obj === false;
};
/**
 * 是否为object
 * @function
 * @name isObject
 * @param  {Object}  obj 要判断的对象
 * @return {Boolean} bool true|false
 */
$.isObject = function (obj) {
  return typeof obj === 'object';
};
/**
 * 是否为undefined
 * @function
 * @name isUndefined
 * @param  {Object}  obj 要判断的对象
 * @return {Boolean} bool  true|false
 */
$.isUndefined = function (obj) {
  return obj === undefined;
};
/**
 * 是否是window对象
 * @function
 * @name isWindow
 * @param  {Object}  obj 要判断的对象
 * @type {Boolean}
 */
$.isWindow = function (obj) {
  return obj != null && obj == obj.window
}

/**
 * 是否是纯object对象
 * @function
 * @name isPlainObject
 * @param  {Object}  obj 要判断的对象
 * @type {Boolean}
 */
$.isPlainObject = function (obj) {
  return $.isObject(obj) && !$.isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
}

function type(obj, type) {
  var t;
  if (obj == null) {
    t = String(obj);
  } else {
    t = Object.prototype.toString.call(obj).toLowerCase();
    t = t.substring(8, t.length - 1);
  }
  if (type) {
    return t === type
  }
  return t;
}
$.type = type;

$.id = $.getId;

module.exports = $;
