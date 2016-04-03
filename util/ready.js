/**
 * dom ready方法
 *
 * @function
 * @name ready
 * @param  {Array} ready的回调函数队列
 * @example
 * utils.ready(function() {
 *   console.log('dom is ready');
 * });
 */

var funList = [];
var isReady = false;

function onReady() {
  funList.forEach(function (fun) {
    fun();
  });

  funList.length = 0;
  isReady = true;
}

function ready(fun) {
  if (typeof fun !== 'function') {
    return;
  }

  if (isReady) {
    fun();
  } else {
    funList.push(fun);
  }
}

if ('complete,loaded,interactive'.indexOf(document.readyState) > -1 && document.body) {
  onReady();
} else {
  document.addEventListener('DOMContentLoaded', onReady, false);
}

module.exports = ready;
