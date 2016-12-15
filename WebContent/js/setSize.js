/**
 * 
 * @authors matelo
 * @date    2015-04-25 14:58:58
 * @version $Id$
 */

(function(win,doc){
     var timer;
     win.addEventListener('resize',function() {
      clearTimeout(timer);
      timer = setTimeout(setUnitA, 10);
      // location.reload()
    }, false);
    win.addEventListener('pageshow',function(e) {
        if (e.persisted) {
            clearTimeout(timer);
            timer = setTimeout(setUnitA, 10);
        }
    }, false);
    var setUnitA=function(){
        var clientWidth = doc.documentElement.clientWidth;
        var pageWidth = clientWidth > 640 ? 640 : clientWidth;
        doc.documentElement.style.fontSize = pageWidth * 0.9765625 + '%';
    };
    setUnitA();
})(window,document);


window.onload = function(){
  var oDiv = document.getElementById('web_top');
  if(!oDiv){
    return;
  }
  var timer = null;
  window.onscroll = function(){
    var Top  = document.documentElement.scrollTop||document.body.scrollTop;
    if(Top<=100){
      // startMove(oDiv,{opacity:0},function(){
          
      // });
      oDiv.style.display = 'none';
    }else if(Top>100){
      oDiv.style.display = 'block'; 
      //startMove(oDiv,{opacity:100})
    }
    // document.title = Top;
  }
  window.onmousewheel = function(){
    clearInterval(timer); 
  }
  oDiv.onclick =function(){
    //var scrollTop  = document.documentElement.scrollTop||document.body.scrollTop;
    //document.documentElement.scrollTop=document.body.scrollTop=0;
    timer = setInterval(function(){
      var scrollTop  = document.documentElement.scrollTop||document.body.scrollTop;
      var speed = -scrollTop/3;
      //speed = Math.floor(speed);
      //console.log(speed)
      document.documentElement.scrollTop=document.body.scrollTop = (scrollTop+speed);
      if(scrollTop === 0){
        clearInterval(timer);
        // startMove(oDiv,{opacity:0},function(){
            
        // });
        oDiv.style.display = 'none';
      }
    },30)
  }
}