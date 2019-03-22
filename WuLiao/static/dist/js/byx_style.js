//1、获取所有button对象
var button = document.getElementsByTagName("button");
//2、遍历这些对象找到name是“refresh”的对象
//3、给该对象设置唯一的id然后利用js中的方法给这个id的对象设置高度、宽度即可
for(i=0;i<button.length;i++){
    if(button[i].name=='refresh'){
        button[i].id = 'toolbar_refresh';
        var btns = document.getElementById('toolbar_refresh')
        $(btns).css("background-color","#FFFFFF").css("width","45px").css("height","26px").css("border","1px solid #27aae1").css("border-radius","2px").css("padding","4px").css("margin-right","10px").css("margin-bottom","0px").css("margin-top","15px");
        $(btns).children().css("color","#27aae1");
        console.log("init success!")
    }
}

$(".dropdown-toggle").css("background-color","#FFFFFF").css("width","45px").css("height","26px").css("border","1px solid #27aae1").css("border-radius","2px").css("padding","4px")
$(".dropdown-toggle").children().css("color","#27aae1");
$(".dropdown-toggle").parent().css("margin","0").css("padding-top","15px");
