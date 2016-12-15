/**
 * Created by xll on 2016/11/12.
 */
var DrawSlipBar = {
    betChips: 0,
    betChipsMax: 0,
    betChipsMin: 0,
    p: {
        isDown:false
    },
    toolbar: {w: 200},
    position: {
        startx: screenWidth * 0.7,
        endx: screenWidth * 0.7 + 200 - 25,
        x: screenWidth * 0.7,
        y: screenHeight * 0.92,
        w: 25,
        h: 25
    },
    init: function () {
        this.event();
        DrawSlipBar.draw(DrawSlipBar.position.x, DrawSlipBar.position.y, DrawSlipBar.position.w, DrawSlipBar.position.h, "blue");
    },
    draw: function (x, y, w, h, color) {
        clearRectByBackGround(screenWidth * 0.7 - 1, DrawSlipBar.position.y - 1, DrawSlipBar.toolbar.w + 100, 25);
        //拖动条背景色
        texasContext.globalAlpha = 1;
        texasContext.fillStyle = color;
        texasContext.fillStyle = "#F0E68C";
        texasContext.fillRect(screenWidth * 0.7, DrawSlipBar.position.y + 9, DrawSlipBar.toolbar.w, 6);
        if (x < DrawSlipBar.position.startx) {
            x = DrawSlipBar.position.startx;
        }
        if (x > DrawSlipBar.position.endx + 2) {
            x = DrawSlipBar.position.endx + 2;
        }
        //拖动滑块
        texasContext.drawImage(chipsImage, 0, 0, 160,
            160, x, y, w, h);
        //计算筹码数额
        DrawSlipBar.betChips = (DrawSlipBar.betChipsMax - DrawSlipBar.betChipsMin) * ((DrawSlipBar.position.x - DrawSlipBar.position.startx) / (DrawSlipBar.position.endx - DrawSlipBar.position.startx));
        DrawSlipBar.betChips = DrawSlipBar.betChips + DrawSlipBar.betChipsMin;
        DrawSlipBar.betChips = Math.ceil(DrawSlipBar.betChips);
        //加注是大盲注的倍数
        //已下注加当前下注是大盲注的倍数
        DrawSlipBar.betChips = Math.floor((DrawSlipBar.betChips + myInfo.betChips) / roomInfo.bigBet) * roomInfo.bigBet - myInfo.betChips;

        //如果下注额度大于最大值，赋值为最大值
        if (DrawSlipBar.betChips > DrawSlipBar.betChipsMax) {
            DrawSlipBar.betChips = DrawSlipBar.betChipsMax;
        }
        // 写筹码数额
        texasContext.font = screenScale * 14 + "px" + " 楷体";
        texasContext.fillStyle = "#F0E68C";
        texasContext.fillText("$" + DrawSlipBar.betChips, screenWidth * 0.7 + 220, DrawSlipBar.position.y + 15);
    },
    OnMouseMove: function (evt) {
        if (DrawSlipBar.p.isDown) {
            var x = evt.layerX - DrawSlipBar.position.w / 2;

            if (x < DrawSlipBar.position.startx) {
                x = DrawSlipBar.position.startx;
            }
            if (x > DrawSlipBar.position.endx + 2) {
                x = DrawSlipBar.position.endx + 2;
            }
            DrawSlipBar.position.x = x;
        }
    },
    OnMouseDown: function (evt) {
        var X = evt.layerX;
        var Y = evt.layerY;
        if (X < DrawSlipBar.position.x + DrawSlipBar.position.w && X > DrawSlipBar.position.x) {
            if (Y < DrawSlipBar.position.y + DrawSlipBar.position.h && Y > DrawSlipBar.position.y) {
                DrawSlipBar.p.isDown = true;
            }
        }
        else {
            DrawSlipBar.p.isDown = false;
        }
    },
    OnMouseUp: function () {
        DrawSlipBar.p.isDown = false
    },
    event: function () {
        var canvas = texasCanvas;
        canvas.addEventListener("mousedown", this.OnMouseDown.bind(this), false);
        canvas.addEventListener("mousemove", this.OnMouseMove.bind(this), false);
        canvas.addEventListener("mouseup", this.OnMouseUp.bind(this), false);
    }
}