/**
 * 简单模板
 * @name template
 * @param  {String} html 模板String内容
 * @param  {Object} data 模板data对象
 * @return {String}      返回处理后的模板
 * @example
 * var t = utils.template('I am <%=name%>', {name:'Theo Wang'});
 * // I am Theo Wang
 * console.log(t);
 */
module.exports = function(html, data) {
  for (var i in data) {
    html = html.replace(new RegExp('<%=\\s*' + i + '\\s*%>', 'g'), data[i]);
  }
  return html;
};
