/**
 * 时间字符串转成Date对象
 * @name dateParse
 * @function
 */
function dateParse(source) {
  var reg = new RegExp("^\\d+(\\-|\\/)\\d+(\\-|\\/)\\d+\x24");
  if ('string' == typeof source) {
    if (reg.test(source) || isNaN(Date.parse(source))) {
      var d = source.split(/ |T/),
        d1 = d.length > 1
            ? d[1].split(/[^\d]/)
            : [0, 0, 0],
        d0 = d[0].split(/[^\d]/);
      return new Date(d0[0] - 0,
              d0[1] - 1,
              d0[2] - 0,
              d1[0] - 0,
              d1[1] - 0,
              d1[2] - 0);
    } else {
      return new Date(source);
    }
  }

  return new Date();
};

module.exports = dateParse;
