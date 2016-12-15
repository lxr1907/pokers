/**
 * Created by xll on 2016/10/30.
 */
var myInfo = {};
var roomInfo = {};
// 注册，传入账号密码
function regist() {
    var data = {};
    data.c = mapping.regist;
    data.username = $("#name").val();
    data.userpwd = $("#password").val();
    websocket.send(JSON.stringify(data));
}
// 登陆，传入账号密码
function login() {
    var data = {};
    data.c = mapping.login;
    data.username = $("#name").val();
    data.userpwd = $("#password").val();
    websocket.send(JSON.stringify(data));
}
// 加入房间，传入房间类型
function enterRoom(level) {
    var data = {};
    data.c = mapping.enterRoom;
    data.level = $("#type option:selected").val();
    //加入游戏类型，1宝鸡拼三张，不传默认德州扑克
    data.type = 1;
    if (level != null) {
        data.level = level;
    }
    websocket.send(JSON.stringify(data));
    gamebackGroundType = "room";
    // 根据房间级别，更换桌面背景
    startIndexBackground = data.level;
    backGroundDrawed = false;
    ControllButtonsDrawed = false;
}
function exitRoom() {
    var data = {};
    data.c = mapping.exitRoom;
    websocket.send(JSON.stringify(data));
}
// 站起
function standUp() {
    var data = {};
    data.c = mapping.standUp;
    websocket.send(JSON.stringify(data));
}
// 坐下
function sitDown() {
    var data = {};
    data.c = mapping.sitDown;
    websocket.send(JSON.stringify(data));
    return false;
}
//看自己手牌
function look() {
    myInfo.isLook = true;
    var data = {};
    data.c = mapping.lookCards;
    websocket.send(JSON.stringify(data));
}
//和下家比牌
function compareCards() {
    var data = {};
    data.c = mapping.compareCards;
    websocket.send(JSON.stringify(data));
}
// 加注
function raise(chips) {
    var data = {};
    data.c = mapping.betChips;
    data.inChips = chips;
    websocket.send(JSON.stringify(data));
}
function raiseSmall() {
    if (myInfo.isLook) {
        raise(roomInfo.smallBet);
    } else {
        raise(roomInfo.smallBlindBet);
    }
}
function raiseBig() {
    if (myInfo.isLook) {
        raise(roomInfo.bigBet);
    } else {
        raise(roomInfo.bigBlindBet);
    }
}
function raiseDoubleBig() {
    if (myInfo.isLook) {
        raise(roomInfo.doubleBigBet);
    } else {
        raise(roomInfo.doubleBigBlindBet);
    }
}
// 全下
function allIn() {
    var data = {};
    data.c = mapping.betChips;
    data.inChips = myInfo.bodyChips;
    websocket.send(JSON.stringify(data));
}
// 过牌
function check() {
    if (checkOrCall == "call") {
        call();
        return;
    }
    var data = {};
    data.c = mapping.check;
    websocket.send(JSON.stringify(data));
}
// 跟注
function call() {
    if (checkOrCall == "check") {
        check();
        return;
    }
    var data = {};
    data.c = mapping.betChips;
    data.inChips = roundMaxBet - myInfo.betChips;
    if (data.inChips <= 0) {
        return;
    }
    // 身上不够则allin
    if (myInfo.bodyChips < roundMaxBet) {
        data.inChips = myInfo.bodyChips;
    }
    websocket.send(JSON.stringify(data));
}
// 弃牌
function fold() {
    var data = {};
    data.c = mapping.fold;
    websocket.send(JSON.stringify(data));
}
//获取排行榜
function getRankList() {
    var data = {};
    data.c = mapping.getRankList;
    websocket.send(JSON.stringify(data));
}
//收到排行榜数据
function onGetRankList(e, data) {
    if (data.state == 1) {
        var rankList = JSON.parse(data.message);
        drawRankList(rankList);
    }
}
// 登陆结果
function onLogin(e, data) {
    if (data.state == 1) {
        myInfo = JSON.parse(data.message);
        gamebackGroundType = "lobby";
        $("#registDiv").hide();
    } else {
        logErrorMessage('login fail');
    }
}// 注册结果
function onRegister(e, data) {
    if (data.state == 1) {
        // 注册成功后自动登陆
        login();
        $("#name").val("");
        $("#password").val("");
        logErrorMessage('register success');
    } else {
        logErrorMessage('register fail');
    }
}
function onEnterRoom(e, data) {
    if (data.state == 1) {
        $.texasMusic.stopBackMu();
        gamebackGroundType = "room";
        clearPotChips();
        roomInfo = JSON.parse(data.message);
        // 等待玩家列表
        var waitPlayers = roomInfo.waitPlayers;
        // 开局重置ingame状态
        for (var i in waitPlayers) {
            var p = waitPlayers[i];
            p.ingame = false;
            p.cards = [];
            p.cardDrawed = true;
        }
        // 游戏中玩家列表
        var ingamePlayers = roomInfo.ingamePlayers;
        // 游戏中玩家手牌赋值
        for (var i in ingamePlayers) {
            var p = ingamePlayers[i];
            p.ingame = true;
            // 清空手牌
            p.cards = null;
            p.cardDrawed = false;
        }
        // 合并房间所有玩家列表
        var allPlayers = waitPlayers.concat(ingamePlayers);
        //找到自己的信息
        for (var i in allPlayers) {
            var player = allPlayers[i];
            if (player.id == myInfo.id) {
                myInfo = player;
            }
            player.infoDrawed = false;
        }
        // 根据座位号排序
        allPlayers.sort(function (playerA, playerB) {
            return playerA.seatNum - playerB.seatNum
        });
        players = allPlayers;
        commonCards = roomInfo.communityCards;
        commonCardsDrawed = false;
        pot = roomInfo.betAmount;
        drawRoomInfos();
        //如果在游戏结束阶段
        winnerList = roomInfo.winPlayersMap;
        drawWinners();
    } else {
        logErrorMessage('进入房间失败');
    }
}
// 本人退出房间
function onOutRoom() {
    gamebackGroundType = "lobby";
    lobbyBackGroundLoaded = false;
    LobbyButtonsDrawed = false;
    removeAllPlayers();
    $.texasMusic.playBackMu();
}
// 其他玩家加入房间
function onPlayerEnterRoom(e, data) {
    if (data.state == 1) {
        var player = JSON.parse(data.message);
        createPlayer(player);
    }
}
function onPlayerLeaveRoom(e, data) {
    if (data.state == 1) {
        var player = JSON.parse(data.message);
        removePlayer(player);
    }
}
// 汇总本轮筹码
function playerChipsToPot() {
    for (var i in players) {
        if (players[i].betChips != null && players[i].betChips != 0) {
            pot = pot + players[i].betChips;
            players[i].betChips = 0;
            clearBetChips(players[i]);
        }
    }
    drawPotChips();
}
// 每轮最大下注，每轮清0
var roundMaxBet = 0;
// 游戏开始
function onGameStart(e, data) {
    //是否已经画了庄家图标D
    roomInfo.dealerDrawed = false;
    //是否已经看牌，初始值false
    myInfo.isLook = false;
    roundMaxBet = 0;
    pot = 0;
    clearWinner();
    clearAllBetChips();
    if (data.state == 1) {
        $.texasMusic.playSendCardMu();
        var retdata = JSON.parse(data.message);
        roomInfo = retdata.room;
        // 开局重置ingame状态
        for (var i in players) {
            players[i].ingame = false;
            players[i].isLook = false;
            players[i].isFold = false;
            players[i].isLose = false;
        }
        // 游戏中玩家手牌赋值
        for (var i in roomInfo.ingamePlayers) {
            var player = roomInfo.ingamePlayers[i];
            var p = getPlayerBySeatNum(player.seatNum);
            p.ingame = true;
            // 清空手牌
            p.cards = null;
            p.cardDrawed = false;
            p.infoDrawed = false;
            p.bodyChips = player.bodyChips;
        }
        // 发手牌
        myInfo.cards = retdata.handPokers;
        //下注按钮文本
        ControllButtonsTxtArr = [roomInfo.smallBlindBet, roomInfo.bigBlindBet, roomInfo.doubleBigBlindBet];
        ControllButtonsDrawed = false;
        drawRoomInfos();
    }
}
function drawRoomInfos() {
    // 玩家下注赋值
    for (var i in roomInfo.betRoundMap) {
        var p = getPlayerBySeatNum(i);
        p.betChips = roomInfo.betRoundMap[i];
        p.betDrawed = false;
        if (p.betChips > roundMaxBet) {
            roundMaxBet = p.betChips;
        }
    }
    // 操作倒计时
    timeBar.time = roomInfo.optTimeout / 1000;
    createTimeBar(getPlayerBySeatNum(roomInfo.nextturn));
}
//收到看牌结果
function onLookCards(e, data) {
    if (data.state == 1) {
        var pRoom = JSON.parse(data.message);
        myInfo.cards = pRoom.handPokers;
        drawHandCards(myInfo);
        var p = getPlayerBySeatNum(myInfo.seatNum);
        p.isLook = true;
        p.infoDrawed = false;
        //下注按钮文本
        ControllButtonsTxtArr = [roomInfo.smallBet, roomInfo.bigBet, roomInfo.doubleBigBet];
        ControllButtonsDrawed = false;
    }
}
//有玩家已经看牌
function onPlayerLookCards(e, data) {
    if (data.state == 1) {
        var player = JSON.parse(data.message);
        var p = getPlayerBySeatNum(player.seatNum);
        p.isLook = true;
        p.infoDrawed = false;
    }
}
//比牌输
function onPlayerLoseCompare(e, data) {
    if (data.state == 1) {
        var player = JSON.parse(data.message);
        var p = getPlayerBySeatNum(player.seatNum);
        p.isLose = true;
        p.infoDrawed = false;
    }
}
// 有玩家下注
function onPlayerBet(e, data) {
    if (data.state == 1) {
        // 下注声音播放
        $.texasMusic.playbetChipsMu();
        // 重画下注筹码
        var player = JSON.parse(data.message);
        var bet = player.inChips;
        var seatNum = player.seatNum;
        var p = getPlayerBySeatNum(seatNum);
        if (p.betChips == null) {
            p.betChips = 0;
        }
        p.betChips = p.betChips + bet;
        p.betDrawed = false;
        // 重画玩家个人信息筹码数量
        p.bodyChips = p.bodyChips - bet;
        p.infoDrawed = false;
        // 本轮最大下注赋值
        if (p.betChips > roundMaxBet) {
            roundMaxBet = p.betChips;
        }
        cancelTimeBar();
    }
}

// 有玩家过牌
function onPlayerCheck(e, data) {
    if (data.state == 1) {
        $.texasMusic.playCheckMu();
        var player = JSON.parse(data.message);
        cancelTimeBar();
    }
}
// 有玩家弃牌
function onPlayerFold(e, data) {
    if (data.state == 1) {
        $.texasMusic.playFoldMu();
        var player = JSON.parse(data.message);
        var seatNum = player.seatNum;
        var p = getPlayerBySeatNum(seatNum);
        p.ingame = false;
        p.isFold = true;
        p.infoDrawed = false;
        clearCards(p);
        cancelTimeBar();
    }
}
// 游戏结束
function onGameEnd(e, data) {
    if (data.state == 1) {
        // 汇总本轮筹码
        playerChipsToPot();
        var endRoomInfo = JSON.parse(data.message);
        winnerList = endRoomInfo.winPlayersMap;
        cancelTimeBar();
        // 玩家手牌列表
        var handCardsMap = endRoomInfo.handCardsMap;
        for (var seatNum in handCardsMap) {
            for (var i in players) {
                var player = players[i];
                if (player.seatNum == seatNum) {
                    player.cards = handCardsMap[seatNum];
                    player.cardDrawed = false;
                }
            }
        }
        drawWinners();
        // 玩家成牌列表
        var finalCardsMap = endRoomInfo.finalCardsMap;
        for (var seatNum in finalCardsMap) {
            for (var i in players) {
                var player = players[i];
                if (player.seatNum == seatNum) {
                    player.finalCards = finalCardsMap[seatNum].splice(0, 3);
                    // 牌力大小，同花
                    player.finalCardsLevel = finalCardsMap[seatNum][0];
                }
            }
        }
    }
}
// 其他玩家操作
function onPlayerTurn(e, data) {
    if (data.state == 1) {
        var seatNum = JSON.parse(data.message);
        var p = getPlayerBySeatNum(seatNum);
        createTimeBar(p);
    }
}
// 其他玩家发消息
function onPlayerMessage(e, data) {
    if (data.state == 1) {
        var player = JSON.parse(data.message);
    }
}
// 根据座位号获取players中的玩家
function getPlayerBySeatNum(seatNum) {
    for (var i in players) {
        if (players[i].seatNum == seatNum) {
            return players[i];
        }
    }
}