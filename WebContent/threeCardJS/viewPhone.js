/**
 * Created by xll on 2016/10/30.
 */
var texasCanvas = {};
var texasContext = {};
// 屏幕的实际宽和高
var screenHeight = window.innerWidth;//oneHeight * screenScale;
var screenWidth = window.innerHeight;
// 筹码
var chipsImage = new Image();
chipsImage.src = "texasImages/chips_alpha.png";
var cardScale = 0.55 * screenScale;
// 卡牌高度
var cardHeight = 111;
// 卡牌宽度
var cardWidth = 81;
// 玩家头像等信息区域
var playerRecWidth = 50 * screenScale;
var playerRecHeight = 50 * screenScale;
var roomConfig = {
    maxPlayer: 6
}
// 进度条
var timeBar = {
    time: 10,// 10秒走完
    x: 0, y: 0, width: 100, height: 8, maxwidth: playerRecWidth * 2, color: "blue", drawing: true
}
// 画牌桌背景
var backGroundImg = new Image();
backGroundImg.src = "texasImages/pokertable2.png";
// 背景图序号,0到5 共6个桌面
var startIndexBackground = 0;
// 背景图已经绘制
var backGroundLoaded = false;
var backGroundDrawed = false;
var players = [];
// 游戏所处背景，首页login,房间room,大厅lobby
var gamebackGroundType = "login";
// 首页登陆界面
var loginBackGround = new Image();
loginBackGround.src = "texasImages/login6.jpg";
var loginBackGroundLoaded = false;
var lobbyBackGroundLoaded = false;
function drawBackground() {
    if (gamebackGroundType == "login" && !loginBackGroundLoaded) {
        if (loginBackGround.complete) {
            var x = 0, y = 0;
            loginBackGroundLoaded = true;
            texasContext.drawImage(loginBackGround, 0, 0, 1024,
                677, x, y, screenWidth, screenHeight);
            // 信息背景灰色
            texasContext.globalAlpha = 0.5;
            texasContext.fillStyle = "#604D4F";
            texasContext.fillRect(0, 0, screenWidth, screenHeight);
            drawLoginArea();
        }
    } else if (gamebackGroundType == "lobby" && !lobbyBackGroundLoaded) {
        if (backGroundImg.complete) {
            lobbyBackGroundLoaded = true;
            backGroundLoaded = true;
            // 先定义onload再定义src
            var x = 0, y = 0;
            texasContext.clearRect(0, 0, screenWidth, screenHeight);
            texasContext.drawImage(backGroundImg, 0, oneHeight * startIndexBackground, oneWidth,
                oneHeight, x, y, screenWidth, screenHeight);
            // 信息背景灰色
            texasContext.globalAlpha = 0.5;
            texasContext.fillStyle = "#604D4F";
            texasContext.fillRect(0, 0, screenWidth, screenHeight);
            drawLobbyArea();
            getRankList();
        }
    }
    else if (gamebackGroundType == "room" && !backGroundDrawed) {
        backGroundDrawed = true;
        var x = 0, y = 0;
        var startX = 0;
        texasContext.globalAlpha = 1;
        texasContext.clearRect(0, 0, screenWidth, screenHeight);
        texasContext.drawImage(backGroundImg, startX, oneHeight * startIndexBackground, oneWidth,
            oneHeight, x, y, screenWidth, screenHeight);
        drawRoomButtons();

    }
}
// 玩家登陆信息填写部分
function drawLoginArea() {
    texasContext.globalAlpha = 1;
    texasContext.font = screenScale * 16 + "px" + " 楷体";
    texasContext.fillStyle = "#fff";
    texasContext.fillText("账号", screenWidth * 0.4 - 100, screenHeight * 0.29);
    texasContext.fillText("密码", screenWidth * 0.4 - 100, screenHeight * 0.41);
    drawLoginButtons();
}
// 大厅，选房间界面
function drawLobbyArea() {
    drawLobbyButtons();
}
// 在指定位置创建timebar
function createTimeBar(player) {
    if (player == null || player.position == null) {
        return;
    }
    cancelTimeBar();
    timeBar.width = timeBar.maxwidth;
    var postion = player.position;
    timeBar.x = postion.x;
    timeBar.y = postion.y - timeBar.height;
    timeBar.color = "blue";
    timeBar.drawing = true;
}
// 画进度条
function drawTimeBar() {
    if (timeBar.drawing) {
        /* 设置填充颜色 */
        texasContext.fillStyle = timeBar.color;
        /* 边框的宽度 */
        texasContext.globalAlpha = 1;
        var sWidth = timeBar.width;
        var sHeight = timeBar.height;
        // 用背景图擦除原来的位置,修复边框像素
        var fix = 2 * screenScale;
        clearRectByBackGround(timeBar.x - fix, timeBar.y - fix, timeBar.maxwidth + fix,
            timeBar.height + fix);
        if (timeBar.x > 0 && sWidth > 0) {
            texasContext.fillRect(timeBar.x, timeBar.y, sWidth, sHeight);
        }
    }
}
// 更新进度条的位置
function updateTimeBar(modifier) {
    if (timeBar.width >= 0) {
        timeBar.width = timeBar.width - modifier * ( timeBar.maxwidth / timeBar.time);
        if (timeBar.width / timeBar.maxwidth < 0.6) {
            timeBar.color = "yellow";
        }
        if (timeBar.width / timeBar.maxwidth < 0.3) {
            timeBar.color = "red";
        }
    }
}
// 更新进度条的位置
function cancelTimeBar() {
    if (timeBar.width != 0) {
        timeBar.width = 0;
        //停止绘画
        timeBar.drawing = false;
        // 用背景图擦除原来的位置,修复边框像素
        var fix = 2 * screenScale;
        clearRectByBackGround(timeBar.x - fix, timeBar.y - fix, timeBar.maxwidth + fix,
            timeBar.height + fix);
    }
}
function createPlayer(player) {
    if (player.betChips == null) {
        player.betChips = 0;
    }
    players.push(player);
}
function removeAllPlayers() {
    while (players.length != 0) {
        removePlayer(players[0]);
    }
}
function removePlayer(player) {
    for (var i in players) {
        if (players[i].id == player.id) {
            var arrDeleted = players.splice(i, 1);
            player = arrDeleted[0];
            break;
        }
    }
    if (player.position != null) {
        // 用背景图擦除原来的位置
        clearRectByBackGround(player.position.x, player.position.y, playerRecWidth * 2, playerRecHeight);
    }

    var position = player.betPosition;
    if (position != null) {
        // 用背景图擦除原来的位置
        clearBetChips(player);
        player.betPosition = null;
    }
    clearCards(player);
    if (player.seatNum == roomInfo.nextturn) {
        cancelTimeBar();
    }
}
// 画所有玩家
function drawPlayersPhoto(width, height) {
    // 先画自己
    for (var i in players) {
        var p = {};
        var player = players[i];
        if (player.position == null) {
            if (player.index == null) {
                player.index = (player.seatNum - myInfo.seatNum + roomConfig.maxPlayer) % roomConfig.maxPlayer;
            }
            player.position = getPlayerPosition(width, height, player.index);
            drawPlayer(player.position.x, player.position.y, player);
        }
    }
}
// 获取每个人下注显示的位置
var chipsPositionArr = [];
function getChipsPosition(screenWidth, screenHeight, index) {
    if (chipsPositionArr[index] != null) {
        return chipsPositionArr[index];
    }
    var position = {};
    position.x = -500;
    position.y = -500;
    if (index == 0) {
        position.x = screenWidth / 2 - 10;
        position.y = screenHeight * 0.6;
    }
    if (index == 5) {
        position.x = screenWidth * 0.61;
        position.y = screenHeight * 0.55;
    }
    if (index == 4) {
        position.x = screenWidth * 0.61;
        position.y = screenHeight * 0.42;
    }
    if (index == 3) {
        position.x = screenWidth / 2 - 10;
        position.y = screenHeight * 0.35;
    }
    if (index == 2) {
        position.x = screenWidth * 0.34;
        position.y = screenHeight * 0.42;
    }
    if (index == 1) {
        position.x = screenWidth * 0.34;
        position.y = screenHeight * 0.55;
    }
    chipsPositionArr[index] = position;
    return position;
}
// 6个座位从自己开始逆时针p从0到5,根据屏幕大小自适应取位置
var playerPositionArr = [];
function getPlayerPosition(screenWidth, screenHeight, index) {
    if (playerPositionArr[index] != null) {
        return playerPositionArr[index];
    }
    var position = {};
    position.x = -500;
    position.y = -500;
    if (index == 0) {
        position.x = screenWidth / 2 - 10;
        position.y = screenHeight * 0.735;
    }
    if (index == 5) {
        position.x = screenWidth * 0.82;
        position.y = screenHeight * 0.56;
    }
    if (index == 4) {
        position.x = screenWidth * 0.82;
        position.y = screenHeight * 0.265;
    }
    if (index == 3) {
        position.x = screenWidth / 2 - 10;
        position.y = screenHeight * 0.09;
    }
    if (index == 2) {
        position.x = screenWidth * 0.15;
        position.y = screenHeight * 0.265;
    }
    if (index == 1) {
        position.x = screenWidth * 0.15;
        position.y = screenHeight * 0.56;
    }
    playerPositionArr[index] = position;
    return position;
}
// 用背景图擦除原来的位置
function clearRectByBackGround(x, y, width, height) {
    texasContext.drawImage(backGroundImg, x / screenScale, y / screenScale + oneHeight * startIndexBackground, width / screenScale,
        height / screenScale, x, y, width, height);
}
// 绘制玩家头像框
function drawPlayer(x, y, player) {
    // texasContext.globalAlpha = 1;
    if (player.img == null) {
        player.img = new Image();
        // 用背景图擦除原来的位置
        clearRectByBackGround(x, y, playerRecWidth, playerRecHeight);
        /* 透明度 */
        texasContext.globalAlpha = 0.7;
        /* 透明度 */
        texasContext.globalAlpha = 1;
        player.img.onload = function () {
            texasContext.drawImage(player.img, x, y, playerRecWidth, playerRecHeight);
        }
        if (player.picUrl == null) {
            setPlayerPicUrl(player);
        }
        player.img.src = player.picUrl;
    }

}

// 画已经下注的筹码和数额
function drawBetChips() {
    for (var i in players) {
        var player = players[i];
        if (player.betPosition == null) {
            player.betPosition = getChipsPosition(screenWidth, screenHeight, player.index);
        }
        var p = player.betPosition;
        var x = p.x;
        var y = p.y;
        texasContext.font = screenScale * 8 + "px" + " 楷体";
        texasContext.fillStyle = "#fff";
        // 根据dealer位置画D图标
        if (player.seatNum == roomInfo.dealer && !roomInfo.dealerDrawed) {
            roomInfo.dealerDrawed = true;
            texasContext.fillText("D ", x - 10 * screenScale, y);
        } else if (player.seatNum != roomInfo.dealer) {
            // 用背景图擦除原来的位置
            clearRectByBackGround(x - 10 * screenScale, y - 10 * screenScale, 10 * screenScale,
                10 * screenScale);
        }
        // 判断是否已经画过筹码
        if (player.betDrawed) {
            continue;
        }
        player.betDrawed = true;
        if (player.betChips != null && player.betChips != 0) {
            clearBetChips(player);
            // 写筹码数额
            texasContext.fillText(player.betChips, x + 15 * screenScale, y + screenScale * 10);
            texasContext.drawImage(chipsImage, 0, 0, 160,
                160, x, y, 15 * screenScale, 15 * screenScale);
        }
    }
}
// 清除所有玩家下注
function clearAllBetChips() {
    for (var i = 0; i < 6; i++) {
        var position = getChipsPosition(screenWidth, screenHeight, i);
        if (position != null) {
            // 用背景图擦除原来的位置
            clearRectByBackGround(position.x, position.y, 40 * screenScale, 15 * screenScale);
        }
    }
}
// 清除玩家下注
function clearBetChips(player) {
    var position = getChipsPosition(screenWidth, screenHeight, player.index);
    if (position != null) {
        // 用背景图擦除原来的位置
        clearRectByBackGround(position.x, position.y, 40 * screenScale, 15 * screenScale);
        player.betPosition = null;
    }

}
// 画底池
var potText = "0";
var pot = 0;
function drawPotChips() {
    if (pot == null) {
        pot = potText;
    }
    var x = ( screenWidth / 2 - 10);
    var y = screenHeight * 0.5;
    // 先清除该区域，防止重影
    clearRectByBackGround(x, y - 20, 80, 20)
    texasContext.font = screenScale * 10 + "px" + " 楷体";
    texasContext.fillStyle = "#F0E68C";
    texasContext.fillText("底池:" + pot, x, y);
}
// 清除底池
function clearPotChips() {
    potText = null;
    // 清除文字时Y轴变换上移
    clearRectByBackGround(( screenWidth / 2 - 10), screenHeight * 0.4 - 10 * screenScale, 50 * screenScale, 10 * screenScale);
}
// 画玩家信息
function drawPlayerInfos() {
    for (var i in players) {
        var player = players[i];
        if (player.infoDrawed) {
            continue;
        }
        player.infoDrawed = true;
        drawPlayerInfo(player);
    }
}
// 绘制玩家姓名筹码信息
function drawPlayerInfo(player) {
    var point = player.position;
    var x = point.x;
    var y = point.y;
    // 用背景图擦除原来的位置
    clearRectByBackGround(x + playerRecWidth, y, playerRecWidth, playerRecHeight);
    // 玩家信息背景灰色
    /* 设置填充颜色 */
    texasContext.fillStyle = "#604D4F";
    texasContext.fillRect(x + playerRecWidth, y, playerRecWidth, playerRecHeight);
    // 玩家名 设置字体，颜色
    texasContext.font = screenScale * 10 + "px" + " 楷体";
    texasContext.fillStyle = "#fff";
    texasContext.fillText(player.username, x + playerRecWidth + 10, y + screenScale * 10);
    // 玩家剩余筹码 设置字体，颜色
    texasContext.font = screenScale * 10 + "px" + " 楷体";
    texasContext.fillStyle = "#fff";
    if (player.ingame) {
        if (!player.isLose) {
            if (player.isLook) {
                texasContext.fillText("看牌", x + playerRecWidth + 5, y + screenScale * 40);
            } else {
                texasContext.fillText("暗牌", x + playerRecWidth + 5, y + screenScale * 40);
            }
        } else {
            texasContext.fillText("被击败", x + playerRecWidth + 5, y + screenScale * 40);
        }
    } else {
        texasContext.fillText("未入局", x + playerRecWidth + 5, y + screenScale * 40);
    }
    // 玩家剩余筹码 设置字体，颜色
    texasContext.font = screenScale * 10 + "px" + " 楷体";
    texasContext.fillStyle = "#fff";
    texasContext.fillText("$" + player.bodyChips, x + playerRecWidth + 5, y + screenScale * 20);
}
var checkOrCall = "check";
var ControllButtonsDrawed = false;
// 绘制所有控制按钮
var ControllButtonsTxtArr = ["1倍", "2倍", "4倍"];
function drawControllButtons() {
    if (!ControllButtonsDrawed) {
        ControllButtonsDrawed = true;
        // 先移除点击事件
        $(texasCanvas).unbind("click");
        drawRoomButtons();
        console.log("drawControllButtons");
        var bwidth = screenWidth * 0.09;
        var bheight = screenHeight * 0.07;
        drawControllButton(screenWidth * 0.68, screenHeight * 0.82, bwidth, bheight, "弃牌", "fold");
        drawControllButton(screenWidth * 0.79, screenHeight * 0.82, bwidth, bheight, "看牌", "look");
        drawControllButton(screenWidth * 0.9, screenHeight * 0.82, bwidth, bheight, "比牌", "compareCards");
        drawControllButton(screenWidth * 0.68, screenHeight * 0.92, bwidth, bheight, ControllButtonsTxtArr[0], "raiseSmall");
        drawControllButton(screenWidth * 0.79, screenHeight * 0.92, bwidth, bheight, ControllButtonsTxtArr[1], "raiseBig");
        drawControllButton(screenWidth * 0.9, screenHeight * 0.92, bwidth, bheight, ControllButtonsTxtArr[2], "raiseDoubleBig");
    }

}
var loginButtonsDrawed = false;
// 绘制登陆控制按钮
function drawLoginButtons() {
    if (!loginButtonsDrawed) {
        loginButtonsDrawed = true;
        // 先移除点击事件
        $(texasCanvas).unbind("click");
        var bwidth = screenWidth * 0.12;
        var bheight = screenHeight * 0.07;
        drawControllButton(screenWidth * 0.5, screenHeight * 0.6, bwidth, bheight, "登陆", "login");
        drawControllButton(screenWidth * 0.35, screenHeight * 0.6, bwidth, bheight, "注册", "regist");
    }
}
var LobbyButtonsDrawed = false;
// 选房间按钮
function drawLobbyButtons() {
    if (!LobbyButtonsDrawed) {
        LobbyButtonsDrawed = true;
        // 先移除点击事件
        $(texasCanvas).unbind("click");
        var bwidth = screenWidth * 0.2;
        var bheight = screenHeight * 0.07;
        drawControllButton(screenWidth * 0.4, screenHeight * 0.4, bwidth, bheight, "初级", "enterRoom", 0);
        drawControllButton(screenWidth * 0.4, screenHeight * 0.5, bwidth, bheight, "中级", "enterRoom", 1);
        drawControllButton(screenWidth * 0.4, screenHeight * 0.6, bwidth, bheight, "高级", "enterRoom", 2);
    }
}
// 房间控制
function drawRoomButtons() {
    // 先移除点击事件
    $(texasCanvas).unbind("click");
    var bwidth = screenWidth * 0.13;
    var bheight = screenHeight * 0.07;
    drawControllButton(screenWidth * 0.03, screenHeight * 0.02, bwidth, bheight, "返回", "exitRoom", 0);
}
// 绘制一个控制按钮
function drawControllButton(x, y, bwidth, bheight, txt, clickFunc, param) {
    var gradient = texasContext.createLinearGradient(x, y - bheight, x, y + bheight);
    gradient.addColorStop(0.2, "magenta");
    gradient.addColorStop(1, "blue");
    // 用渐变填色
    texasContext.fillStyle = gradient;
    /* 边框的宽度 */
    texasContext.globalAlpha = 1;
    /* 设置填充颜色 */
    texasContext.fillRect(x, y, bwidth, bheight);
    /* 绘制一个矩形，前两个参数决定开始位置，后两个分别是矩形的宽和高 */
    texasContext.font = screenScale * 12 + "px" + " 楷体";
    texasContext.fillStyle = "#fff";
    texasContext.fillText(txt, x + screenScale * 17, y + oneHeight * 0.05 * screenScale - screenScale * 2);
    // 绑定点击事件
    $(texasCanvas).bind("click", null, (function (e) {// 给canvas添加点击事件
        e = e || event;// 获取事件对象
        // 获取事件在canvas中发生的位置
        var cx = e.clientX - texasCanvas.offsetLeft;
        var cy = e.clientY - texasCanvas.offsetTop;
        // 如果事件位置在矩形区域中,调试会导致的浏览器坐标错误
        var transformx = window.innerWidth - y;
        var transformy = x;
        if (cx >= transformx - bheight && cx <= transformx && cy >= transformy && cy <= transformy + bwidth) {
            var func = eval(clickFunc);
            new func(param, null);
            console.log("clickFunc:" + clickFunc);
        }
    }));
}
// 绘制所有玩家的扑克牌
function drawCards() {
    for (var i in players) {
        var player = players[i];
        if (player.cardDrawed) {
            continue;
        }
        player.cardDrawed = true;
        if (player.cards != null) {
            drawHandCards(player);
        } else if (player.ingame != null && player.ingame) {
            drawCardBack(player);
        } else {
            clearCards(player);
        }
    }
}
// 绘制手牌
function drawHandCards(player) {
    var p = player.position;
    if (player == null || p == null || player.cards == null) {
        return;
    }
    var cards = player.cards;
    var x = p.x;
    var y = p.y;
    x = x - cardWidth * screenScale * 0.8;
    texasContext.globalAlpha = 1;
    drawPoker(texasContext, x - cardWidth * 0.45 * cardScale, y, cardHeight * cardScale, cards[0]);
    drawPoker(texasContext, x, y, cardHeight * cardScale, cards[1]);
    drawPoker(texasContext, x + cardWidth * 0.45 * cardScale, y, cardHeight * cardScale, cards[2]);
}
// 画卡背
function drawCardBack(player) {
    var p = player.position;
    if (player == null || p == null) {
        return;
    }
    var x = p.x;
    var y = p.y;
    x = x - cardWidth * screenScale * 0.8;
    texasContext.globalAlpha = 1;
    drawPokerBack(texasContext, x - cardWidth * 0.45 * cardScale, y, cardHeight * cardScale);
    drawPokerBack(texasContext, x, y, cardHeight * cardScale);
    drawPokerBack(texasContext, x + cardWidth * 0.45 * cardScale, y, cardHeight * cardScale);
}
// 清除手牌
function clearCards(player) {
    var position = player.position;
    if (position == null) {
        return;
    }
    if (player.cards != null) {
        // 用背景图擦除原来的位置
        clearRectByBackGround(position.x - cardWidth * screenScale * 1.2 - 2, position.y - 2, 2.2 * cardWidth * cardScale + 4,
            cardHeight * cardScale + 4);
    } else {
        // 用背景图擦除原来的位置
        clearRectByBackGround(position.x - cardWidth * screenScale * 1.2 - 2, position.y - 2, 2.2 * cardWidth * cardScale + 4,
            cardHeight * cardScale + 4);
    }
}

// 设置玩家头像前后缀
function setPlayerPicUrl(player) {
    player.picUrl = "texasImages/player" + player.pic + ".png";
}
var winnerList = {4: 500, 0: 100, 1: 200, 2: 300, 3: 400, 5: 600};
// 提示获胜玩家
function drawWinners() {
    for (var i in winnerList) {
        drawWinner(i, winnerList[i]);
    }
}
//胜利玩家赢得筹码数量提示
function drawWinner(seatNum, chips) {
    var player = getPlayerBySeatNum(seatNum);
    if (player == null || player.position == null) {
        return;
    }
    var point = player.position;
    // 获胜玩家 设置字体，颜色
    texasContext.font = screenScale * 15 + "px" + " 楷体";
    texasContext.fillStyle = "#F0E68C";
    var txt = cardTypes[player.cards[3]];
    texasContext.fillText(txt + chips, point.x + playerRecWidth * 0.5 + 5, point.y - screenScale * 5);
}
//清除胜利玩家赢得筹码数量提示
function clearWinner() {
    for (var i in players) {
        var player = players[i];
        if (player == null || player.position == null) {
            continue;
        }
        var point = player.position;
        clearRectByBackGround(point.x + playerRecWidth * 0.5, point.y - screenScale * 40, playerRecWidth + screenScale * 40, screenScale * 40);
    }
}
//大厅画排行榜
function drawRankList(rankList) {
    for (var i in rankList) {
        if (i > 4) {
            break;
        }
        var player = rankList[i];
        var point = getRankPosition(i);
        var x = point.x;
        var y = point.y;
        // 用背景图擦除原来的位置
        clearRectByBackGround(x + playerRecWidth, y, playerRecWidth, playerRecHeight);
        // 玩家名 设置字体，颜色
        texasContext.font = screenScale * 10 + "px" + " 楷体";
        texasContext.fillStyle = "#fff";
        texasContext.fillText(parseInt(i) + 1, x - 20, y + playerRecHeight / 2);
        drawPlayer(x, y, player);
        // 玩家信息背景灰色
        /* 设置填充颜色 */
        texasContext.fillStyle = "#604D4F";
        texasContext.fillRect(x + playerRecWidth, y, playerRecWidth, playerRecHeight);
        // 玩家名 设置字体，颜色
        texasContext.font = screenScale * 10 + "px" + " 楷体";
        texasContext.fillStyle = "#fff";
        texasContext.fillText(player.username, x + playerRecWidth + 10, y + screenScale * 10);
        // 玩家剩余筹码 设置字体，颜色
        texasContext.font = screenScale * 10 + "px" + " 楷体";
        texasContext.fillStyle = "#fff";
        texasContext.fillText("$" + player.chips, x + playerRecWidth + 5, y + screenScale * 40);
    }
}
function getRankPosition(rank) {
    var rankHeight = playerRecHeight * rank;
    var point = {};
    point.x = screenWidth * 0.7;
    point.y = screenHeight * 0.2 + rankHeight;
    return point;
}
var cardTypes = {
    10: "三条",
    9: "顺金",
    7: "顺子",
    6: "金花",
    3: "对子",
    2: "单张"
};