/**
 * 格式化日期
 * @name dateFormat
 * @function
 * @param {Date} d 日期对象
 * @param {string} pattern 日期格式(y年M月d天h时m分s秒)，默认为"yyyy-MM-dd"
 * @return {string}  str 返回format后的字符串
 * @example
 *	var d=new Date();
 *	alert(format(d," yyyy年M月d日\n yyyy-MM-dd\n MM-dd-yy\n yyyy-MM-dd hh:mm:ss"));
 */
function dateFormat(d, pattern) {
	pattern = pattern || 'yyyy-MM-dd';
	var y = d.getFullYear().toString(),
		o = {
			M: d.getMonth() + 1, //month
			d: d.getDate(), //day
			h: d.getHours(), //hour
			m: d.getMinutes(), //minute
			s: d.getSeconds() //second
		};
	pattern = pattern.replace(/(y+)/ig, function(a, b) {
		return y.substr(4 - Math.min(4, b.length));
	});
	for (var i in o) {
		pattern = pattern.replace(new RegExp('(' + i + '+)', 'g'), function(a, b) {
			return (o[i] < 10 && b.length > 1) ? '0' + o[i] : o[i];
		});
	}
	return pattern;
}

module.exports = dateFormat;
