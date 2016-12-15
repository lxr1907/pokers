/**
 * Created by lxr on 2016/11/21.
 */
//0到3代表4种花色的A，从0到51代表52张扑克
function getCardsColor(index) {
    var color = index % 4;
    if (color == 0) {
        return "h";//红桃
    } else if (color == 1) {
        return "d";//方块

    } else if (color == 2) {
        return "s";//黑桃

    } else if (color == 3) {
        return "c";//梅花

    }
}
//获取A到K，从0到51代表52张扑克
function getCardsValue(index) {
    var value = Math.floor(index / 4) + 1;
    if (value == 1) {
        value = "A";
    }

    if (value == 11) {
        value = "J";
    }
    if (value == 12) {
        value = "Q";
    }
    if (value == 13) {
        value = "K";
    }
    console.log(value);
    return value + "";
}
function drawPoker(texasContext, x, y, height, index) {
    var color = getCardsColor(index);
    var value = getCardsValue(index);
    texasContext.drawPokerCard(x, y, height, color, value);
}
function drawPokerBack(texasContext, x, y, height) {
    texasContext.drawPokerBack(x, y, height, '#E71159', '#F97CA6');
}