/**
 * 对传入url query 部分转成json格式
 * @name queryToJson
 * @function
 * @param {string} url 待处理的url
 * @return {Object} obj 返回处理后的json
 */
module.exports = function (url) {
  try {
    url = !!url ? decodeURIComponent(url) : '';
  } catch (e) {
    url = '';
  }

  var locse = url.split('?'),
    search = locse[1] ? locse[1] : locse[0],
    pairs = search.split('&'),
    result = {};

  pairs.forEach(function (pair) {
    pair = pair.split('=');
    if (pair[0].length > 0) {
      result[pair[0]] = pair[1] || '';
    }
  });

  return result;
};
