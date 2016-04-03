var $ = require('../base');
/**
 * 利用postMessage跨域消息实现
 * @name  xMessage
 */

var messageListeners = {},
    handlers = {};

var isWindowObject = function (source) {
    return '[object global]' == Object.prototype.toString.call(source) || source.toString() == '[object Window]';
};

var getContentWindow = function (obj) {
    /**
     * 如果是window对象，直接返回
     * eg. top, parent, window
     */
    if (isWindowObject(obj)) {
        return obj;
    }

    if ($.isString(obj)) {
        /*只返回选择器返回的第一个dom节点*/
        obj = document.querySelector(obj);
    }

    /*如果是iframe，获取contentWindow*/
    if (obj.nodeName === 'IFRAME') {
        return obj.contentWindow;
    }

    return obj;
};



window.addEventListener('message', function (e) {
    var message = e.data,
        type = message._mType,
        handlers = messageListeners[type],
        i = 0,
        l;
    if (!handlers || !(l = handlers.length)) {
        return;
    }
    for (; i < l; i += 1) {
        var obj = handlers[i];

        obj.fn(message.args);
        if (obj.once) {
            /*一次*/
            handlers.splice(i--, 1);
            l--;
        }
    }

}, true);

var xMessage = {
    /**
     * postMessage iframe之间通信方法
     * @function
     * @param {Object|string} target 接收message的对象，可以为iframe element 或 window，parent，或选择器
     * @param {Object} type 事件类型
     * @param {Mix} [data=''] 传递的数据
     * @param {String} [targetOrigin=*] 来源 默认为 *
     *
     * @example
     * //iframe的页面使用parent
     * xMessage.fire(parent, 'invoke.ready', data);
     * //主框架使用
     * xMessage.fire(iframeObj, 'invoke.ready', data);
     */
    fire: function (target, type, data, targetOrigin) {
        var contentWindow = getContentWindow(target);

        if (!contentWindow) {
            throw Error('cannot get contentWindow');
        }
        /*没有给出targetOrigin时，默认为统配，不限制通信域*/
        targetOrigin = targetOrigin || '*';

        var msg = {
            _mType: type,
            _time: +new Date(),
            args: data
        };

        /*处理msg为event或者window对象或者循环引用的问题，保证传递的层级是一级*/
        var dealMsg = {};
        for (var i in msg) {
            if (msg.hasOwnProperty(i)) {
                dealMsg[i] = censor(msg[i]);
            }
        }
        contentWindow.postMessage(JSON.parse(JSON.stringify(msg, dealMsg)), targetOrigin);
        return this;
    },
    /**
     * 绑定事件监听
     * @param  {String} type 类型
     * @param  {Function} handler     监听函数
     * @param {Boolean} [once=false] 是否只执行一次
     * @example
     * xMessage.on('invoke.command', function(){
     *      console.log('iframe invoke command');
     *      console.log(arguments);
     *  });
     */
    on: function (type, handler, once) {
        if (!$.isFunction(handler)) {
            return this;
        }
        if (!messageListeners[type]) {
            messageListeners[type] = [];
        }

        messageListeners[type].push({
            fn: handler,
            once: !!once
        });

        return this;
    },
    /**
     * 执行一次
     * @param  {String} type    事件类型
     * @param  {Function} handler 事件处理函数
     * @example
     * xMessage.once('invoke.command', function(){
     *      console.log('iframe invoke command');
     *      console.log(arguments);
     *  });
     */
    once: function (type, handler) {
        return this.on(type, handler, true);
    },
    /**
     * 移除事件
     * @param  {string} type 事件类型
     * @param  {function} [handler=]     处理函数或者函数名
     * @example
     * //移除具体函数
     * xMessage.off('invoke.command', handlerFunction);
     * //移除整个事件所有函数
     * xMessage.off('invoke.command');
     */
    off: function (type, handler) {
        var handlers = messageListeners[type],
            i = 0,
            l;

        if (!handlers || !(l = handlers.length)) {
            return;
        }
        if (!handler) {
            handlers.length = 0;
            return this;
        }
        for (; i < l; i += 1) {
            if (handlers[i].fn === handler) {
                handlers.splice(i, 1);
                return this;
            }
        }
        return this;
    }
};
module.exports = xMessage;


function censor(censor) {
    var i = 0;

    return function (key, value) {
        if (i !== 0 && $.isObject(censor) && $.isObject(value) && censor == value) {
            return '[Circular]';
        }

        if (i >= 30) {
            return '[Unknown]';
        }

        ++i;

        return value;
    };
}
