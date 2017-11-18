$(document).ready(function() {
    jQuery.tab_cont = function (tab_tit, tab_conbox, affair) {
        $(tab_conbox).find("li").hide();
        $(tab_tit).find("li:first").addClass("sel-org").show();
        $(tab_conbox).find("li:first").show();
        $(tab_tit).find("li").bind(affair, function () {
            $(this).addClass("sel-org").siblings("li").removeClass("sel-org");
            var activeindex = $(tab_tit).find("li").index(this);
            $(tab_conbox).children().eq(activeindex).show().siblings().hide();
            return false;
        });
    };
    /*调用方法如下：*/
    $.tab_cont("#tabs-head", "#tab_conbox", "click");
    // $.tab_cont("#tabs2", "#tab_conbox2", "mouseenter");
});