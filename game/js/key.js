/**
 * 定义键盘对象，记录用户键盘事件
 */
var userKey = {};
document.addEventListener('keydown', function (e) {
  userKey[e.keyCode] = true;
}, false);
document.addEventListener('keyup', function (e) {
  userKey[e.keyCode] = false;
}, false);