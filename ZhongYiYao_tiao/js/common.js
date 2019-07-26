 // 视口375时 1rem=100px
 (function(doc, win) {
     function change() {
         var html = document.documentElement;
         var width = html.clientWidth;
         html.style.fontSize = (width / 375) * 100 + 'px';
     }
     change();
     win.addEventListener('resize', change);
 })(document, window);


//获取系统时间
function getDate(ele) {
        var date = new Date();
        var year = date.getFullYear(); //年
        var month = date.getMonth() + 1; //月
        var day = date.getDate(); //日
        var hour = date.getHours(); //时
        var minute = date.getMinutes(); //分
        var second = date.getSeconds(); //秒

        if (month<10) {
            month='0'+month;
        }
        if (day<10) {
            day='0'+day;
        }
        if (hour<10) {
            hour='0'+hour;
        }
        if (minute<10) {
            minute='0'+minute;
        }
        if (second<10) {
            second='0'+second;
        }

        $(ele).html(year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second);
}