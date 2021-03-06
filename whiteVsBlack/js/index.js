//获取元素
function $(ele) {
    return document.getElementById(ele);
}

var clock = null;
var flag = false;
var speed = 6;

//
function start() {
    if (!flag) {
        flag = true;
        init();
    }
}

//初始化
function init() {
    for (var i = 0; i < 4; i++) {
        createRow();
    }
    $('main').onclick = function(ev) {
        ev = ev || event;
        jduge(ev);
    }

    clock = window.setInterval('move()', 30);
}

//创建行
function createRow() {
    var con = $('con');
    var row = createDiv('row');
    var cell = createCell();
    for (var j = 0; j < 4; j++) {
        row.appendChild(cell[j]);
    }
    if (con.firstChild == null) {
        con.appendChild(row); //init()
    } else {
        con.insertBefore(row, con.firstChild); //move()
    }
}

//创建格子
function createCell() {
    var arr = new Array;
    for (var i = 0; i < 4; i++) {
        arr[i] = createDiv('cell');
    }
    var balck = Math.floor(Math.random() * 4);
    arr[balck].setAttribute('class', 'cell black');
    return arr;
}

//创建div
function createDiv(attr) {
    var newDiv = document.createElement('div');
    newDiv.setAttribute('class', attr);
    return newDiv;
}

//删除行
function delRow() {
    var con = $('con');
    //当行数=6时才删行
    if (con.childNodes.length == 6) {
        con.removeChild(con.lastChild);
    }
    //debugger;
}
//判断点击块颜色
function jduge(ev) {
    //如果不是黑色，over()
    if (ev.target.className.indexOf('black') == -1) {
        ev.target.parentNode.pass_white = 1;
        over();
    }
    if (ev.target.className.indexOf('black') !== -1) {
        ev.target.className = 'cell';
        ev.target.parentNode.pass_black = 1;
        score();
    }
}
//成绩记录
function score() {
    var scorenum = parseInt($('score').innerHTML);
    scorenum += 1;
    $('score').innerHTML = scorenum;
    if (scorenum % 10 == 0) {
        //speed += 2;
        win();
    }
}
//奖励图像
function win() {
    $('img0').style.opacity = 1;
    //setInterval("$('img0').style.opacity = 0", 2500);
}
//最高成绩记录
function highscore(scorenum) {
    var num = parseInt(sessionStorage.high);
    if (!isNaN(num)) {
        if (num < scorenum) {
            num = scorenum;
        }
    } else {
        num = 0;
        num = scorenum;
    }
    sessionStorage.high = num;
    $('highscore').innerHTML = num;
}
//移动
function move() {
    var con = $('con');
    var top = parseInt(window.getComputedStyle(con, null)['top']);
    if (top + speed > 0) {
        top = 0;
    } else {
        top += speed;
    }
    con.style.top = top + 'px';
    over();
    //debugger;
    if (top == 0) {
        createRow();
        con.style.top = '-102px';
        delRow();
    }
}

function over() {
    var row = $('con').childNodes;
    //黑块触底
    if ((row[row.length - 1].pass_black !== 1) && (row.length == 5)) {
        fail();
    }
    //点击白块
    for (let i = 0; i < row.length; i++) {
        if (row[i].pass_white == 1) {
            fail();
        }
    }
}

function fail() {
    clearInterval(clock);
    var scorenum = $('score').innerHTML;
    alert('最终成绩： ' + scorenum);
    var con = $('con');
    con.style.top = '-408px';
    flag = false;
    highscore(scorenum);
    speed = 6;
    con.innerHTML = '';
    $('score').innerHTML = 0;
}