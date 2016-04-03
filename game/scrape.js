//require('zepto');

(function (window, document, $, undefined) {
    /**
     * @typedef ScrapeOptions
     * @type {Object}
     * @property {boolean} [forceRefresh=true] 是否强制刷新，android需要，否则有问题
     * @property {string} [coverColor=@c5c5c6] 封面颜色值
     * @property {Number} [activePercent=0.4] 刮开百分之多少就可以完全打开，默认40%
     * @property {Number} [lineWidth=30] 刮开线宽度
     * @property {scrapeOptionFont} [font=scrapeOptionFont] 字体相关设置
     * @property {function} onfin 刮开后的回调函数
     */
    var defaultOpts = {
        forceRefresh: true,
        coverColor: '#c5c5c6',
        activePercent: 0.4,
        lineWidth: 30,
        /**
         * @typedef scrapeOptionFont
         * @property {string} [size=40px] 字体大小
         * @property {string} [family=微软雅黑] 字体
         * @property {string} [color=#818181] 字体颜色
         * @property {string} [text=刮开此涂层] 提示文字内容
         * @property {string|number} [x=center] x坐标
         * @property {string|number} [y=80] y坐标
         */
        font: {
            size: 40 + 'px',
            family: '微软雅黑',
            color: '#818181',
            text: '刮开此涂层',
            x: 'center',
            y: 80
        },
        onfinish: function () {}
    };
    /**
     * 刮刮乐-抽奖游戏
     * @requires Zepto
     * @global
     * @class Scrape
     *
     * @param {Element} el Element对象
     * @param {ScrapeOptions} opts  游戏配置
     * @example
     * ```html
     * <div id="box" class="box" style="margin:0 auto;width:240px;height: 240px;position:relative">
     * </div>
     * <script src="../game/scrape.js"></script>
     * <script>
     * new Scrape('#box',{
     *     onfinish: function(){
     *         alert('被你刮开了……');
     *     }
     * });
     * </script>
     * ```
     */
    var Scrape = function (el, opts) {
        var $node = this.$node = $(el);
        this.options = $.extend(defaultOpts, opts);
        var region = this.region = $node.offset();
        this.region.right = region.left + region.width;
        this.region.bottom = region.top + region.height;
        this.init();
    };
    Scrape.prototype = /** @lends Scrape.prototype */ {
        constructor: Scrape,
        /**
         * 初始化
         */
        init: function () {
            this.createCanvas()
                .refresh()
                .bindEvent();
            return this;
        },
        /**
         * 创建canvas对象
         */
        createCanvas: function () {
            var canvas = this.canvas = $('<canvas width="' + this.region.width + 'px" height="' + this.region.height + 'px" />')
                .css({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 999

                }).appendTo(this.$node)[0];
            if (canvas.getContext && (this.context = canvas.getContext('2d'))) {} else {
                throw new Error('not support context 2d');
            }

            return this;
        },
        /**
         * 刷新
         */
        refresh: function () {
            var context = this.context;
            var options = this.options,
                canvas = this.canvas;
            context.globalCompositeOperation = 'source-over';
            context.fillStyle = this.options.coverColor;
            context.fillRect(0, 0, this.region.width, this.region.height);
            var font = options.font;
            if (font) {
                context.font = font.size + ' ' + (font.family || 'serif');
                context.fillStyle = font.color;
                if (font.x === 'center') {
                    var i = context.measureText(font.text);
                    font.x = canvas.width / 2 - i.width / 2;
                }
                context.fillText(font.text, font.x || 0, font.y || 0);
            }
            context.globalCompositeOperation = 'destination-out';
            context.lineJoin = 'round';
            context.lineCap = 'round';
            context.strokeStyle = 'rgba(0,0,0,255)';
            context.lineWidth = options.lineWidth || 30;
            canvas.style.opacity = 1;
            canvas.style.webkitTransition = '';
            canvas.style.transition = '';
            this.$node.show();
            this.scraping = true;
            return this;
        },
        /**
         * 开始
         * @protected
         */
        _start: function (e) {
            var self = this;
            var canvas = this.canvas,
                context = this.context,
                options = this.options;
            var identifier = e.identifier;
            var x, y;
            var region = this.region;

            canvas.addEventListener('touchmove', move, false);
            canvas.addEventListener('touchend', end, false);
            canvas.addEventListener('touchcancel', end, false);
            if (this.range(e)) {
                x = e.clientX - region.left;
                y = e.clientY - region.top;
                context.beginPath();
                //考虑用raf优化
            }

            function move(e) {
                var touches = e.changedTouches,
                    poi, i = 0;
                for (var len = touches.length; i < len; i++) {
                    if (touches[i].identifier === identifier) {
                        poi = touches[i];
                        break;
                    }
                }
                if (poi) {
                    x && y && context.moveTo(x, y);
                    if (self.range(poi)) {
                        x = poi.clientX - region.left;
                        y = poi.clientY - region.top;
                        context.lineTo(x, y);
                        context.stroke();
                    }
                    options.forceRefresh && (canvas.style.opacity = canvas.style.opacity ? '' : .999);
                }
            }

            function end(e) {
                var poi,
                    touches = e.changedTouches,
                    i = 0;
                for (var len = touches.length; i < len; i++) {
                    if (touches[i].identifier === identifier) {
                        poi = touches[i];
                        break;
                    }
                }
                if (poi) {
                    self.getPercent() > options.activePercent && self.finish();
                }

                canvas.removeEventListener('touchmove', move, false);
                canvas.removeEventListener('touchend', end, false);
                canvas.removeEventListener('touchcancel', end, false);
            }

        },
        /**
         * 结束
         */
        finish: function () {
            var canvas = this.canvas;
            this.scraping = false;
            var options = this.options;
            canvas.style.webkitTransition = 'opacity 0.6s ease';
            canvas.style.transition = 'opacity 0.6s ease';
            canvas.style.opacity = 0;
            setTimeout(function () {
                canvas.style.display = 'none';
                (typeof options.onfinish === 'function') && options.onfinish();
            }, 600);
        },
        /**
         * 通过canvas像素点计算刮开百分比
         * @return {number} number 刮开百分比
         */
        getPercent: function () {
            var imgData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
            var len = imgData.length;
            var m = 0,
                n = len / 4;
            for (var i = 0; i < len; i += 4) {
                if (imgData[i + 3] === 0) {
                    //如果透明度是0，那么就是刮开的
                    m++;
                }
            }
            return m / n;
        },
        /**
         * 计算是否在有效范围内
         */
        range: function (e) {
            var region = this.region;
            return e.clientX > region.left && e.clientX < region.right && e.clientY > region.top && e.clientY < region.bottom;
        },
        /**
         * 处理函数统一入库
         */
        handleEvent: function (e) {
            //处理start，解决this问题
            this.start(e);
            e.preventDefault();
        },
        /**
         * 开始玩游戏
         */
        start: function (e) {
            if (this.scraping) {
                var i = 0,
                    len = e.changedTouches.length;
                for (; i < len; i++) {
                    this._start(e.changedTouches[i]);
                }
            }
        },
        /**
         * 事件绑定
         */
        bindEvent: function () {
            this.canvas.addEventListener('touchstart', this, false);
        },
        /**
         * 销毁函数
         */
        destroy: function () {
            for (var i in this) {
                delete this[i];
            }
        }
    };

    window.Scrape = Scrape;
}(window, document, Zepto));
