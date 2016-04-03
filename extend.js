var $ = require('base');
var isPlainObject = $.isPlainObject,
  isArray = $.isArray,
  isBoolean = $.isBoolean,
  isUndefined = $.isUndefined;

function extend(target, source, deep) {
  for (var key in source)
    if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
      if (isPlainObject(source[key]) && !isPlainObject(target[key]))
        target[key] = {};
      if (isArray(source[key]) && !isArray(target[key]))
        target[key] = [];
      extend(target[key], source[key], deep);
    } else if (!isUndefined(source[key])) {
    target[key] = source[key];
  }
}
/**
 * extend方法
 * @function extend
 * @example
 * $.extend(target, [source, [source2, ...]])  ⇒ target
 * $.extend(true, target, [source, ...]) ⇒ target
 * var target = { one: 'patridge' },
 *   source = { two: 'turtle doves' }
 * $.extend(target, source)
 * //=> { one: 'patridge',
 * //     two: 'turtle doves' }
 */
module.exports = function (target) {
  var deep, args = $.emptyArr.slice.call(arguments, 1);
  if (isBoolean(target)) {
    deep = target;
    target = args.shift();
  }
  args.forEach(function (arg) {
    extend(target, arg, deep);
  });
  return target;
};
