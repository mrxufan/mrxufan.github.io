/** 判断点击的是关闭按钮还是li标签卡 */
var _tag_count = 0;

/**
 *
 * @param option(oid,otitle,close,ourl,oicon)
 * @private
 */
function _addtabs(option) {
    var lists = $("#_tabs").children();
    var length = 0;
    for (var u = 0; u < lists.length; u++) {
        length += ($(lists[u]).width());
    }
    if ($("#_tabs").width() - length < 300) {
        $("#_tabs").find("li:first").remove();
        $("#flists").find("div:first").remove();
    }
    //<i class='" + option.oicon + "'>
    var id = "_tabs_" + option.oid;
    //移除所有激活样式
    $(".active").removeClass("active");
    $(".tab-pane").hide();
    if (!($("#" + id)[0])) {
        var title = "<li class='_litabs' id='" + id + "' role='presentation' onclick='clickTabs(this)'><a href='#" + id + "' aria-controls='" + id + "' role='tab' data-toggle='tab'></i><span name='_tags_tf'>" + option.otitle + "</span>";
        if (option.close == "true") {
            title += "<img class='_close_style' onclick='closetabs(this)' onmouseover='cMouseOver(this)' onmouseout='cMouseOut(this)' src='static/dist/img/close.png' width='15px' height='15px' style='margin-left: 5px;margin-bottom: 3px' />";
        }
        title += "</a></li>"
        var content = '<div role="tabpanel" class="tab-pane" id="_pan' + id + '" ><iframe id="_frame_' + id + '" onload="iframeHeight(this.id)"  src="' + option.ourl + '" width="100%" height="100%" style="min-height: 630px;background-color: #ecf0f5;overflow: scroll" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="yes" ></iframe></div>';
        $("#_tabs").append(title);
        $("#flists").append(content);
        $("#" + id).addClass('active');
    } else {
        $(".active").removeClass("active");
        $("#" + id).addClass('active');
        //隐藏所有面板
        $(".tab-pane").hide();
        //展示当前的iframe
        $("#_pan" + id).show();
    }
    //绑定右键菜单事件
    rightmouse(id);
}

/**
 * 点击标签卡切换
 */
function clickTabs(obj) {
    if (_tag_count == 1) {
        _tag_count = 0;
    } else {
        $(".active").removeClass("active");
        $(".tab-pane").hide();
        var tabs = obj.getAttribute("id");
        $("#" + tabs).addClass("active");
        $("#_pan" + tabs).show();
    }
}



/**
 * 关闭标签卡
 * @param obj
 */
function closetabs(obj) {
    _tag_count = 1;
    var lip = $(obj).parent().parent();
    var prev = 0;
    var lilists = $("#_tabs").children();
    for (var i = 0; i < lilists.length; i++) {
        //判断当前关闭的标签是否已激活
        if ($(lilists[i]).is(".active")) {
            if ($(lip).attr('id') == $(lilists[i]).attr('id')) {
                if ($(lilists[0]).attr('id') == $(lip).attr('id')) {
                    $($(lilists[i]).next()).addClass("active");
                    $("#_pan" + $($(lilists[i]).next()).attr('id')).show();
                    $("#_tabs").find("li[id='" + lip.attr('id') + "']").remove();
                    $("#flists").find("div[id='_pan" + lip.attr('id') + "']").remove();
                    break;
                } else {
                    $($(lilists[i]).prev()).addClass("active");
                    $("#_pan" + $($(lilists[i]).prev()).attr('id')).show();
                    $("#_tabs").find("li[id='" + lip.attr('id') + "']").remove();
                    $("#flists").find("div[id='_pan" + lip.attr('id') + "']").remove();
                    prev += 1;
                    break;
                }
            }
        }
    }
    if (prev == 0) {
        //判断非已激活标签
        $("#_tabs").find("li[id='" + lip.attr('id') + "']").remove();
        $("#flists").find("div[id='_pan" + lip.attr('id') + "']").remove();
    }
}








//tab选项卡右键点击事件
function rightmouse(id) {
    $('#' + id).contextmenu({
        target: '#context-menu',
        onItem: function(context, e) {
            var s = $(context).attr('id');
            if ($(e.target).text().indexOf("关闭当前") != -1 || $(e.target).parent().text().indexOf("关闭当前") != -1) {
                $("#_tabs").find("li[id='" + s + "']").remove();
                $("#flists").find("div[id='_pan" + s + "']").remove();
                var tabs = $("#_tabs").children();
                var flists = $("#flists").children();
                $($(tabs[tabs.length - 1])).addClass("active");
                $($(flists[flists.length - 1])).show();
                $("#context-menu").hide();
                console.log('关闭当前');
            } else if ($(e.target).text().indexOf("刷新当前") != -1 || $(e.target).parent().text().indexOf("刷新当前") != -1) {
                var iframeId = "_frame_" + s;
                var _body = window.parent;
                var _iframe1 = _body.document.getElementById(iframeId);
                _iframe1.contentWindow.location.reload(true);
                console.log('刷新当前')
            } else if ($(e.target).text().indexOf("关闭所有") != -1 || $(e.target).parent().text().indexOf("关闭所有") != -1) {
                console.log('关闭所有')
                closeAll();
            }
        }
    });
}



//关闭所有
function closeAll() {
    $('#_tabs li:not("#_tabs_index")').remove();
    $('#flists .tab-pane:not("#_pan_tabs_index")').remove();
    $('#flists #_pan_tabs_index').show();
    $("#context-menu").hide();
}




// 鼠标经过时更换叉号图标
function cMouseOver(obj) {
    $(obj).attr("src", "static/dist/img/close_hover.png");
}

// 鼠标离开时换回叉号图标
function cMouseOut(obj) {
    $(obj).attr("src", "static/dist/img/close.png");
}


// 获取所有菜单参数
function getElementByTemplate(obj) {
    _addtabs({
        oid: $(obj).children('._hi_1').val(),
        otitle: $(obj).children('._hi_4').val(),
        close: 'true',
        ourl: $(obj).children('._hi_2').val(),
        oicon: $(obj).children('._hi_3').val()
    });
}


// iframe 高度随屏幕高度自适应
function iframeHeight(id) {
    $('#' + id).css({ 'height': $(window).height() - 110 + 'px' });
}


// 设置左边菜单栏高度
$('#first_menu').css({ 'height': $(window).height() - 77 + 'px' });