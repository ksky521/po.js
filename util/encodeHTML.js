/**
 * 对目标字符串进行html编码
 * @name encodeHTML
 * @function
 * @param {string} source 要转义的html string片段
 * @return {String} str 返回编码后的字符串
 */

module.exports = function (source) {
  return String(source)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};
