/**
 * Created by xll on 2016/11/13.
 */
$.texasMusic = {
    backGroundMusic: {},
    sendCardMusic: {},
    betChipsMusic: {},
    checkMusic: {},
    initMusic: function () {
        $.texasMusic.backGroundMusic = document.createElement("audio");
        var backM = $.texasMusic.backGroundMusic;
        backM.setAttribute("src", "music/background.mp3");
        //自动播放
        backM.setAttribute("autoplay", true);
        //循环
        backM.setAttribute("loop", true);
        //默认音量为1
        backM.volume = 0.4;
        //默认速度1
        backM.playbackRate = 0.8;
        //console.log(backM.playbackRate);

        //发牌声音
        $.texasMusic.sendCardMusic = document.createElement("audio");
        var sendCardMu = $.texasMusic.sendCardMusic;
        sendCardMu.setAttribute("src", "music/sendcard.mp3");
        //下注声音
        $.texasMusic.betChipsMusic = document.createElement("audio");
        var betChipsMu = $.texasMusic.betChipsMusic;
        betChipsMu.setAttribute("src", "music/betChips2.mp3");
        //过牌声音
        $.texasMusic.checkMusic = document.createElement("audio");
        var checkMu = $.texasMusic.checkMusic;
        checkMu.setAttribute("src", "music/check.mp3");
    },
    //发牌声音播放
    playSendCardMu: function () {
        $.texasMusic.sendCardMusic.currentTime=1.8;
        $.texasMusic.sendCardMusic.play();
    },
    //下注声音
    playbetChipsMu: function () {
        $.texasMusic.betChipsMusic.play();
    },
    //过牌声音
    playCheckMu: function () {
        $.texasMusic.checkMusic.currentTime=0.27;
        $.texasMusic.checkMusic.play();
    },
    //弃牌声音
    playFoldMu: function () {
        $.texasMusic.checkMusic.currentTime=0.2;
        $.texasMusic.checkMusic.play();
    },
    //背景音乐开始
    playBackMu: function () {
        $.texasMusic.backGroundMusic.play();
    },
    //背景音乐暂停
    stopBackMu: function () {
        $.texasMusic.backGroundMusic.pause();
    }
}