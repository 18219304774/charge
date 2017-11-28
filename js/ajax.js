/**
 * Created by GraceLea on 2017/10/23.
 */
window.host = "http://wx.xgyjsx.com/chargestation";
$.extend({
    /**
     * @param ele  分页容器
     * @param num_entries  //数据总数
     * @param pageselectCallback  //回调函数
     * @param per_items  //每页显示的数据条目
     */
    paging: function (ele, num_entries, pageselectCallback, per_items) {
        per_items = per_items || 10;
        ele.pagination(num_entries, {
            current_page: 0,
            callback: pageselectCallback,
            items_per_page: per_items, //每页显示10项
            load_first_page:false,
            num_edge_entries: 1, //边缘页数
            num_display_entries: 4, //主体页数
            prev_text: "上一页",
            next_text: "下一页"
        });
    },
    /**
     * get 方式，返回类型 json【包含code,对code进行处理】
     * @param url
     * @param d
     * @param callback
     */
    ajaxByGet: function (url, d, callback) {
        var loadIndex = layer.load();
        jQuery.ajax({
            url: window.host+url,
            type: 'GET',
            data: d,
            dataType: 'json',
            success: function (data) {
                if(data.code==201) {
                    layer.msg("Created");
                }else if(data.code==401) {
                    layer.msg("Unauthorized");
                }else if(data.code==403) {
                    layer.msg("Unauthorized");
                }else if(data.code==404){//过期
                    layer.msg("Not Found");
                }else if(data.code == 20007||data.code == 740) {
                    if(url != "/wechat/user/login"){
                        localStorage.current_url = window.location.href;
                    }
                    window.location.href = "login.html";
                }else{
                    callback(data);
                }
                layer.close(loadIndex);
            },
            error: function () {
                layer.close(loadIndex);
                localStorage.current_url = "";
                layer.msg('获取数据失败请稍后再试！');
            }
        });
    },
    /**pc端
     * post 方式，返回类型 json【包含code,对code进行处理】
     * @param url
     * @param d
     * @param callback
     */
    ajaxByPost: function (url, d, callback,loading) {
        loading = loading==undefined?false:true;
        var loadIndex;
        if(!loading)(
            loadIndex =layer.load()
        );
        jQuery.ajax({
            url:  window.host+url,
            type: 'POST',
            data: d,
            dataType: 'json',
            success: function (data) {
                if(data.code==201) {
                    layer.msg("Created");
                }else if(data.code==401) {
                    layer.msg("Unauthorized");
                }else if(data.code==403) {
                    layer.msg("Unauthorized");
                }else if(data.code==404){//过期
                    layer.msg("Not Found");
                }else if(data.code == 20007||data.code == 740) {
                    if(url != "/wechat/user/login"){
                        localStorage.current_url = window.location.href;
                    }
                    window.location.href = "login.html";
                }else{
                    callback(data);
                }
                layer.close(loadIndex);
            },
            error: function () {
                layer.close(loadIndex);
                localStorage.current_url = "";
                layer.msg('获取数据失败请稍后再试！');
            }
        });
    },
    onlyNum: function(ele){ //文本框只能输入数字
        ele.on('keyup',function(event){
            var $this = $(this);
            $this.val($this.val().replace(/[^\d.]/g,''));
        });
    },
    getUrlArgs: function(url){//得到地址传递的参数，返回： 参数对象
        url = url || window.location.href;
        url = decodeURIComponent(url);
        var argsString = (url.indexOf('?') === -1)?"":url.substring(url.indexOf('?')+1);
        var arrObj={};
        if(argsString !== ""){
            argsString = argsString.split('&');
            for(var i=0;i<argsString.length;i++){
                var key = argsString[i].split('=')[0];
                arrObj[key] = argsString[i].split('=')[1];
            }
        }
        return arrObj;
    },
    getTimeDetail: function (time, typeFormat) {
        var dateTime;
        if(time === 'now'){
            dateTime = new Date();
        }else{
            time = parseInt(time);
            dateTime = new Date(time);
        }
        console.log(dateTime);
        var zeroAdd = function (val) {
            if (val < 10) {
                val = "0" + val;
            }
            return val;
        };
        var detail = {
            year: dateTime.getFullYear(),  //年
            month: zeroAdd(parseInt(dateTime.getMonth() + 1)),    //月
            date: zeroAdd(dateTime.getDate()),       //日
            hour: zeroAdd(dateTime.getHours()),   //时
            minute: zeroAdd(dateTime.getMinutes()),  //分
            second: zeroAdd(dateTime.getSeconds()),  //秒
            week: dateTime.getDay()       //星期几[0:表示星期天，1-6: 星期一到星期六]

        };
        if (typeFormat == 1) {
            return detail.year + "年" + detail.month + "月" + detail.date + "日    " + detail.hour + ":" + detail.minute + ":" + detail.second;
        }else if(typeFormat == 2){
            return detail.year + "-" + detail.month + "-" + detail.date +" "+ detail.hour + ":" + detail.minute;
        }else if(typeFormat == 3){
            return detail.year + "-" + detail.month + "-" + detail.date +" 23:59";
        }else if(typeFormat == 4){
            return detail.year + "." + detail.month + "." + detail.date;
        }else {
            return detail;
        }
    },
    getTimeStr : function (time) {
        var str = {
            year : time.substring(0,4),
            month : time.substring(4,6),
            date : time.substring(6,8),
            hour : time.substring(8,10),
            minute : time.substring(10,12),
            second : time.substring(12,14)
        };
        return str.year + "-" + str.month + "-" + str.date + " " + str.hour + ":" + str.minute + ":" + str.second;
    },
    getSfm: function(seconds){
        var h = Math.floor(seconds / 3600);
        var m = Math.floor((seconds / 60 % 60));
        var s = Math.floor((seconds % 60));
        return h + ":" + m + ":" + s;
    },
    getOrderStatus : function (orderStatus) {
        var  reStatus;
        switch (orderStatus) {
            case 0:
                reStatus = "已取消";
				break;
            case 2:
                reStatus = "等待充电";
				break;
            case 3:
                reStatus = "正在充电";
				break;
            case 4:
                reStatus = "充电完成";
				break;
			case 5:
                reStatus = "充电完成";
				break;
            default:
                reStatus = "已完成";

        }
		return reStatus;
    },
    isLogin: function(){
        if(localStorage.token&&localStorage.token!=""){
            localStorage.current_url = "";
            return false;
        }else{//未登录
            localStorage.current_url = window.location.href;
            window.location.href = "login.html";
            return true;
        }
    }
});
jQuery.fn.valTrim = function(){
    return $(this).val().trim();
};