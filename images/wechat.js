var shareLink = 'http://wx.xgyjsx.com/charge/get-hb.html';
var lineLink = window.location.href;
//var host=window.location.host;
var host = "http://wx.xgyjsx.com/chargestation";
var urlimage = 'http://' + host + '/images/code.png';
var tilist = [{title: "test好友邀请标题", content: "test好友邀请内容"},
    {title: "test好友邀请标题。1", content: "111111"},
    {title: "test好友邀请标题2", content: "222222222222"}
];
var nu = Math.floor(Math.random() * 3);
$(function () {
    $.ajax({
        type: "get",
        url: host + "/wechat/auth/getAuthInfo",
        data: {url: lineLink},
        dataType: "json",
        success: function (datas) {
            wx.config({
                debug: false,
                appId: datas.data.appId,
                timestamp: datas.data.timestamp,
                nonceStr: datas.data.nonceStr,
                signature: datas.data.signature,
                jsApiList: [
                    // 所有要调用的 API 都要加到这个列表中
                    'checkJsApi',
                    'onMenuShareTimeline', //分享到朋友圈
                    'onMenuShareAppMessage',//分享给好友
                    'hideMenuItems',//隐藏部分分享
                    'scanQRCode'//扫一扫
                ]
            });
            wx.ready(function () {
                var scanCharge = document.querySelector('#scanCharge');
                console.log(scanCharge);
                if (scanCharge){
                    $(scanCharge).on("click",function () {
                        var isLogin = $.isLogin();
                        if(isLogin){return false;}
                        wx.scanQRCode({
                            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                            scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                            desc: 'scanQRCode desc',
                            success: function (res) {
                                var url = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                                if (url) {
                                    var codeQr = url;
                                    $.ajaxByPost("/wechat/charge/stake/scanCharging", {
                                        qrcode: codeQr,//二维码编号
                                        token: localStorage.token
                                    }, function (data) {
                                        
                                        if (data.code == 200) {//成功
                                            var d = data["data"];
                                            window.location.href = "order-detail.html";
                                            console.log(data);
                                        } else {
                                            layer.msg(data["message"]);
                                        }
                                    });
                                } else {
                                    layer.msg("扫码失败");
                                }
                            }
                        });
                    });
                }
                //隐藏
                wx.hideMenuItems({
                    menuList: ['menuItem:share:qq',
                        'menuItem:share:weiboApp',
                        'menuItem:favorite',
                        'menuItem:share:facebook',
                        'menuItem:share:QZone'], // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                    success: function (res) {
                        //alert("隐藏");
                    }
                });

                // 检查接口
                wx.checkJsApi({
                    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'scanQRCode'],
                    success: function (res) {
                        console.log(JSON.stringify(res));
                    }
                });
                wx.onMenuShareTimeline({//分享到朋友圈
                    title: tilist[nu].title,//分享标题
                    link: shareLink,//分享链接
                    imgUrl: urlimage,//分享图标
                    success: function () {
                        //用户确认分享后执行的回调函数
                        console.log('ok');
                    },
                    error: function () {
                        //用户取消分享后执行的回调函数
                        console.log('error');
                    }
                });

                wx.onMenuShareAppMessage({//分享给朋友
                    title: tilist[nu].title,//分享标题
                    desc: tilist[nu].content,//分享描述
                    link: shareLink,//分享链接
                    imgUrl: urlimage,//分享图标
                    type: 'link',//分享类型,music,video或link,不填默认为link
                    dataUrl: '',//如果type是music或video，则要提供数据，默认为空
                    success: function () {
                        //用户确认分享后执行的回调函数
                        console.log('ok');
                    },
                    error: function () {
                        //用户取消分享后执行的回调函数
                        console.log('error');
                    }
                });

            });
            wx.error(function (res) {
                //config信息验证失败
                console.log(res.errMsg);
            });
        },
        error: function () {
            console.log("error");
        }

    });

});
