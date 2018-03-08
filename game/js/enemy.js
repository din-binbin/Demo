/**
 * 定义敌人对象
 * @param {object} obj 传入敌人参数
 */
function Enemy(obj) {
    this.x = obj.x;
    this.y = obj.y;
    this.speed = 2;
    this.size = { width: 50, height: 50 };
    this.direction = 'right';
    this.hited = false;
    this.boomNum=0;
  }
  /**
   * 定义敌人数组
   */
  var enemys = [];