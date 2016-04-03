//import Zepto
var $ = require('../base');
var bcast = require('../event/broadcast');
var extend = require('../extend');
var id = $.getId();
/**
 * @typedef RouletteOptions
 * @property {number} [stepTime=20] 步长，每步移动距离
 * @property {duration} [duration=3000] 游戏持续时间，默认3s
 * @property {fps} [fps=60] 游戏fps，默认60
 * @property {speed} [speed=1] 每秒跑x圈
 * @property {Function} onfin 解决后的回调
 * @property {easeFn} easeFn 缓动函数
 * @type {Object}
 */
var defaultOptions = {
	stepTime: 20,
	duration: 3000,
	fps: 60,
	speed: 1, //每秒跑一圈
	onfinish: function () {},
	/**
	 * @Callback easeFn
	 * @param  {Number} t current time（当前时间）
	 * @param  {Number} b beginning value（初始值）
	 * @param  {Number} c change in value（变化量）
	 * @param  {Number} d duration（持续时间）
	 * @return {Number} s 运动曲线值
	 */
	easeFn: function (t, b, c, d) {
		return c * Math.sin(t / d * (Math.PI / 2)) + b;
	}
};
/**
 * 轮盘玩法-抽奖游戏
 * @global
 * @class Roulette
 *
 * @param {Number} count 转多少圈
 * @param {RouletteOptions} opts  游戏配置
 * @example
 * ```javascript
 * var r = new Roulette();
 * r.setGoal(index).start();
 * ```
 *
 * ```html
 * <table>
 *     <tr>
 *         <td id="j-0">0</td>
 *         <td id="j-1">1</td>
 *         <td id="j-2">2</td>
 *     </tr>
 *     <tr>
 *         <td id="j-7">7</td>
 *         <td><button onclick="a.start();">开始</button></td>
 *         <td id="j-3">3</td>
 *     </tr>
 *     <tr>
 *         <td id="j-6">6</td>
 *         <td id="j-5">5</td>
 *         <td id="j-4">4</td>
 *     </tr>
 * </table>
 * <button onclick="a.setGoal(0)">设置最后为0</button>
 * <button onclick="a.setGoal(1)">设置最后为1</button>
 * <button onclick="a.setGoal(2)">设置最后为2</button>
 * <button onclick="a.setGoal(3)">设置最后为3</button>
 * <button onclick="a.setGoal(4)">设置最后为4</button>
 * <button onclick="a.setGoal(5)">设置最后为5</button>
 * <button onclick="a.setGoal(6)">设置最后为6</button>
 * <button onclick="a.setGoal(7)">设置最后为7</button>
 * <script>
 * var a = new Roulette(8,{
 *     onfinish: function(i){
 *         alert('game over：'+i);
 *     },
 *     duration:10000,
 *     speed: 2
 * });
 * a.on(function(i){
 *     $('.bg').removeClass('bg');
 *     $('#j-'+i).addClass('bg');
 * });
 * </script>
 * ```
 */
var Roulette = function (count, opts) {
	/**
	 * @memberOf Roulette
	 * @name options
	 * @type {RouletteOptions}
	 */
	this.options = extend(defaultOptions, opts);
	this.id = id++;
	this.count = count | 0;
	this.ing = false;
	this.reset();
};
Roulette.prototype = /** @lends Roulette.prototype */ {
	constructor: Roulette,
	/**
	 * 重设
	 */
	reset: function () {
		this.goal = 0;
		this.cur = 0;
		this.ing = false;
	},
	/**
	 * 设置当前是第几个
	 * @param  {Number} index 带设置的index
	 */
	goto: function (index) {
		this.cur = index;
		this.fire(index);
	},
	/**
	 * 移动到第x个，触发x个上面绑定的事件
	 * @param  {number} index index
	 */
	fire: function (index) {
		bcast.fire('Roulette_' + this.id, index);
		return this;
	},
	/**
	 * 开始
	 * @param  {easeFn} easeFunc 缓动函数
	 */
	start: function (easeFunc) {
		if (this.ing) {
			return this;
		}
		this.ing = true;
		var self = this;

		var easeF = easeFunc || this.options.easeFn;
		var curVal = 0,
			endVal = this.count * (this.options.duration / 1000 * this.options.speed) + this.goal - this.cur,
			curTime = 0,
			nextVal = 0,
			jumpCount = 0,
			dt = 1000 / this.options.fps,
			duration = this.options.duration,
			stepTime = this.options.stepTime;

		if (this.cur < 0) {
			this.goto(0);
		}
		var arr = [];
		while (curTime <= duration) {
			nextVal = Math.floor(easeF(curTime, 0, endVal, duration));
			jumpCount = nextVal - curVal;
			curTime += stepTime;
			curVal = nextVal;
			arr.push({
				time: curTime,
				value: nextVal,
				jump: jumpCount
			});
		}

		var update = function () {
			var obj = arr.shift();
			var time = obj.time,
				t = 0,
				_i = 1,
				jump = obj.jump;
			if (jump > 0) {
				var dd = stepTime / jump;
				for (var i = 1; i <= jump; i++) {
					t = dd * i;
					if (t >= dt) {
						//节流,控制在16ms一次，多余的settimeout是浪费
						setTimeout(function () {
							self.goNext();
						}, dt * _i);
						_i++;
					}
				}
			}
			if (time <= duration) {
				setTimeout(update, stepTime);
			} else {
				setTimeout(function () {
					self.ing = false;
					if (typeof self.options.onfinish) {
						self.options.onfinish(self.goal, self);
					}
				}, 300);
			}
		};
		setTimeout(update, stepTime);
		return this;
	},
	/**
	 * 进入下一个
	 */
	goNext: function () {
		var next = this.cur + 1;
		if (next >= this.count) {
			next = 0;
		}
		return this.goto(next);
	},
	/**
	 * 设置从零开始
	 */
	setStart: function () {
		this.cur = 0;
		return this;
	},
	/**
	 * 设置最终目标
	 * @param {number} index index
	 */
	setGoal: function (index) {
		this.goal = index;
		return this;
	},
	/**
	 * 绑定事件
	 * @param  {Function} fn 回调函数
	 */
	on: function (fn) {
		bcast.on('Roulette_' + this.id, fn);
		return this;
	},
	/**
	 * 解绑事件
	 * @param  {Function} fn 待解绑函数
	 */
	off: function (fn) {
		bcast.off('Roulette_' + this.id, fn);
		return this;
	},
	/**
	 * 销毁函数
	 * @todo 当前是空
	 */
	destroy: function () {}
};
module.exports = Roulette;
