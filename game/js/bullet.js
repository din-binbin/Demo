/**
 * 定义子弹对象
 * @param {object} obj 传入子弹参数
 */
function Bullet(obj) {
    this.x = obj.x;
    this.y = obj.y;
    this.size = 10;
    this.speed = 10;
  }
  /**
   * 定义子弹数组
   */
  var bullets = [];