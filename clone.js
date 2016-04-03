var toString = Object.prototype.toString;
var map = function (obj, callback, merge) {
  var index = 0;
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (merge) {
        callback[key] = obj[key];
      } else if (callback(key, obj[key], index++)) {
        break;
      }
    }
  }
};
var clone = function (source) {
  var ret;
  switch (toString.call(source)) {
    case '[object Object]':
      ret = {};
      map(source, function (k, v) {
        ret[k] = clone(v);
      });
      break;
    case '[object Array]':
      ret = [];
      source.forEach(function (ele) {
        ret.push(clone(ele));
      });
      break;
    default:
      ret = source;
  }
  return ret;
};

module.exports = clone;
