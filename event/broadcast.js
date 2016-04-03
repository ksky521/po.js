var _cache = {};
var $ = require('../base');
/**
 * 广播事件处理
 * @name broadcast
 *
 * @description 目标: 为了尽可能的减少模块之间业务逻辑的耦合度, 而开发了这个eventbus, 主要用于业务逻辑的事件传递
 * 使用规范: 每个js模块尽可能通过事件去通信, 减少模块之间的直接调用和依赖(耦合)
 * @example
 *  //触发
 *  var broadcast = require('event/broadcast');
 *  broadcast.fire('abc',{abc:1})
 *  //订阅
 *  broadcast.on('abc',function(a){
 *    console.log(a);
 *  }, scope);

 */
var broadcast = {
  /**
   * 派发
   * @param  {String} type 事件类型
   * @param  {...*} data 回调数据，支持连续传递
   * @return {this}   this   broadcast对象
   * @example
   * broadcast.fire('some event', arg1, arg2)
   */
  fire: function (type, data) {
    var listeners = _cache[type],
      len = 0;
    if (!$.isUndefined(listeners)) {
      var args = $.emptyArr.slice.call(arguments, 0);
      args = args.length > 2 ? args.splice(2, args.length - 1) : [];
      args = [data].concat(args);

      len = listeners.length;
      for (var i = 0; i < len; i++) {
        var listener = listeners[i];
        if (listener && listener.callback) {
          args = args.concat(listener.args);
          listener.callback.apply(listener.scope, args);
        }
      }
    }
    return this;
  },
  /**
   * 订阅广播事件
   * @param  {String}   types   事件类型，支持`,`分隔符
   * @param  {Function} callback 回调函数
   * @param  {Object}   [scope=undefined]  回调函数上下文
   * @return {this}  this broadcast
   * @example
   * .on('some event,someevent2', function(arg1, arg2){
   *   console.log(arg1, arg2);
   * });
   */
  on: function (types, callback, scope) {
    types = types || [];
    var args = [].slice.call(arguments);

    if ($.isString(types)) {
      types = types.split(',');
    }
    var len = types.length;
    if (len === 0) {
      return this;
    }
    args = args.length > 3 ? args.splice(3, args.length - 1) : [];
    for (var i = 0; i < len; i++) {
      var type = types[i];
      _cache[type] = _cache[type] || [];
      _cache[type].push({
        callback: callback,
        scope: scope,
        args: args
      });
    }
    return this;
  },
  /**
   * 退订
   * @param  {String}   type   退订服务的类型
   * @param  {Function} callback 假如传入则移出传入的监控事件，否则移出全部
   * @return {this} this broadcast
   * @example
   * broadcast.off('some event', callback);
   */
  off: function (type, callback, scope) {
    var listeners = _cache[type];
    if (!listeners) {
      return this;
    }
    if (callback) {
      var len = listeners.length,
        tmp = [];

      for (var i = 0; i < len; i++) {
        var listener = listeners[i];
        if (listener.callback === callback && listener.scope === scope) {} else {
          tmp.push(listener);
        }
      }
      listeners = tmp;
    } else {
      listeners.length = 0;
    }
    return this;
  },

  /**
   * 移出所有事件
   * @return {this} this broadcast对象
   */
  removeAll: function () {
    _cache = {};
    return this;
  }
};
module.exports = broadcast;
