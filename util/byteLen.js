/**
 * 计算字符串长度，中文及全角字符等算作两个字节长度
 * @name byteLen
 * @function
 * @param  {String} string 字符串
 * @return {Number} len 字符串字节长度
 * @example
 * alert(utils.byteLen('中国'));//4
 */

module.exports = function(string) {
    return string.replace(/[^\x00-\xff]/gi, '**').length;
};
