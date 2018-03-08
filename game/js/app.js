// 元素
var container = document.getElementById('game');
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var scoreHtml = document.getElementsByClassName('game-failed')[0];
var scoreNum = scoreHtml.getElementsByClassName('score')[0];
var score = 0;
var curLevel = 1;
var allLevel = 7;
/**
 * 整个游戏对象
 */
var GAME = {
  /**
   * 初始化函数,这个函数只执行一次
   * @param  {object} opts 
   * @return {[type]}      [description]
   */
  init: function (opts) {
    var self = this;
    this.status = 'start';
    this.bindEvent();
    // 载入飞机图片
    self.planeImg = new Image();
    self.planeImgReady = false;
    self.planeImg.src = './img/plane.png';
    self.planeImg.onload = function () {
      self.planeImgReady = true;
    };
    // 载入敌人图片
    self.enemyImg = new Image();
    self.enemyImgReady = false;
    self.enemyImg.src = './img/enemy.png';
    self.enemyImg.onload = function () {
      self.enemyImgReady = true;
    };
    // 载入敌人爆炸图片
    self.boomImg = new Image();
    self.boomImgReady = false;
    self.boomImg.src = './img/boom.png';
    self.boomImg.onload = function () {
      self.boomImgReady = true;
    };
    // 载入成绩
    score = 0;
  },
  bindEvent: function () {
    var self = this;
    var playBtn = document.querySelector('.js-play');
    var playNextBtn = document.querySelector('.js-next');
    var replayBtn = document.querySelector('.js-replay');
    var playAgainBtn = document.querySelector('.js-playagain');
    /**
     * 进行游戏
     */
    function playGame() {
      self.play();
      canvas.style.display = 'block';
    }
    // 开始游戏按钮绑定
    playBtn.onclick = function () {
      playGame();
    };
    // 继续游戏按钮绑定
    playNextBtn.onclick = function () {
      curLevel++;
      playGame();
    };
    // 失败后后重新开始游戏按钮绑定
    replayBtn.onclick = function () {
      score = 0;
      curLevel = 1;
      playGame();
    };
    // 通关后重新开始游戏按钮绑定
    playAgainBtn.onclick = function () {
      score = 0;
      curLevel = 1;
      playGame();
    };
  },
  /**
   * 更新游戏状态，分别有以下几种状态：
   * start  游戏前
   * playing 游戏中
   * failed 游戏失败
   * success 游戏成功
   * stop 游戏暂停
   */
  setStatus: function (status) {
    this.status = status;
    container.setAttribute("data-status", status);
  },
  /**
   * 开始前的游戏准备
   */
  play: function () {
    this.setStatus('playing');
    // 初始化飞机和敌人、子弹
    enenemys = [];
    bullets = [];
    plane.x = 320;
    plane.y = 470;
    //往敌人数组里添加敌人（根据关卡数）
    for (var j = 0; j < curLevel; j++) {
      for (var i = 0; i < 7; i++) {
        enemys.push(new Enemy({
          x: i * 60 + 30,
          y: 30 * (j + 1) + j * 20,
        }));
      }
    }
    // 执行游戏逻辑
    this.animate();
  },
  /**
   * 更新飞机、敌人及子弹对象
   */
  update: function () {
    // 敌人自动运动
    for (var i = 0, len = enemys.length; i < len; i++) {
      var enemy = enemys[i];
      if (enemy.direction === 'right') {
        if (enemy.x < 620) {
          enemy.x += enemy.speed;
        } else {
          for (var j = 0; j < len; j++) {
            var enemy = enemys[j];
            enemy.direction = 'left';
            enemy.y += 50;
          }
        }
      } else if (enemy.direction === 'left') {
        if (enemy.x > 30) {
          enemy.x -= enemy.speed;
        } else {
          for (var j = 0; j < len; j++) {
            var enemy = enemys[j];
            enemy.direction = 'right';
            enemy.y += 50;
          }
        }
      }
    }
    // 键盘控制飞机移动
    if (userKey['37']) {
      if (plane.x > 30) {
        plane.x -= plane.speed;
      }
    }
    if (userKey['39']) {
      if (plane.x < 610) {
        plane.x += plane.speed;
      }
    }
    // 键盘控制子弹发射
    if (userKey['32']) {
      bullets.push(new Bullet({
        x: plane.x + 30,
        y: plane.y
      }));
      userKey[32] = false;
    }
    // 子弹飞行
    for (var i = 0, len = bullets.length; i < len; i++) {
      var bullet = bullets[i];
      bullet.y -= bullet.speed;
    }
    // 检测子弹是否击中敌人
    for (var i = len - 1, len = bullets.length; i >= 0; i--) {
      var bullet = bullets[i];
      for (var j = enemys.length - 1; j >= 0; j--) {
        var enemy = enemys[j];
        if (enemy.x <= bullet.x && bullet.x <= enemy.x + enemy.size.width && bullet.y <= enemy.y + enemy.size.height && enemy.y <= bullet.y) {
          enemy.hited = true;
          bullets.splice(i, 1);
        }
      }
    }
  },
  /**
   * 渲染函数，在canvas上绘制游戏对象
   */
  render: function () {
    var self = this;
    // 清除画布
    context.clearRect(0, 0, canvas.width, canvas.height);
    // 绘制飞机
    if (self.planeImgReady) {
      context.drawImage(self.planeImg, plane.x, plane.y, plane.size.width, plane.size.height);
    }
    // 绘制敌人
    if (self.enemyImgReady) {
      for (var i = enemys.length - 1; i >= 0; i--) {
        var enemy = enemys[i];
        if (enemy.hited) {
          context.drawImage(self.boomImg, enemy.x, enemy.y, enemy.size.width, enemy.size.height);
          enemy.boomNum++;
          if (enemy.boomNum > 5) {
            enemys.splice(i, 1);
            score++;
          }
        } else {
          context.drawImage(self.enemyImg, enemy.x, enemy.y, enemy.size.width, enemy.size.height);
        }
      }
    }
    // 绘制子弹
    for (var i = 0, len = bullets.length; i < len; i++) {
      var bullet = bullets[i];
      context.beginPath();
      context.strokeStyle = '#fff';
      context.moveTo(bullet.x, bullet.y);
      context.lineTo(bullet.x, bullet.y - bullet.size);
      context.stroke();
    }
    // 绘制成绩和关卡
    context.fillStyle = '#fff';
    context.font = '20px 微软雅黑';
    context.fillText('分数 : ' + score + ' ' + ' 关卡 ：' + curLevel, 30, 30);
  },
  /**
   * 游戏运行逻辑
   */
  animate: function () {
    this.update(); //更新敌人、飞机、子弹的坐标等状态
    this.render(); //渲染
    // 敌人触底检测
    for (var i = 0, len = enemys.length; i < len; i++) {
      if (enemys[i].y > 470) {
        this.setStatus('failed');
        scoreNum.innerHTML = score;
        enemys = [];
        canvas.style.display = 'none';
      }
    }
    // 检测游戏状态决定是否循环
    if (enemys.length > 0 && this.status === 'playing') {
      requestAnimationFrame(this.animate.bind(this));
    } else {
      // 如果全部消灭敌人
      if (enemys.length === 0) {
        this.setStatus('all-success');
        if (curLevel !== allLevel) {
          this.setStatus('success');
        }
      }
      canvas.style.display = 'none';
    }
  }
};

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
// 初始化
GAME.init();