
var application = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('backbutton',function(){ return false;});
    },
    onDeviceReady: function() {
        util.showProgress();

        //default native transition option
        //    window.plugins.nativepagetransitions.globalOptions.duration = 700;
        //    window.plugins.nativepagetransitions.globalOptions.androiddelay = 150;
        //    window.plugins.nativepagetransitions.globalOptions.slowdownfactor = 8;
        // these are used for slide left/right only currently
        //     window.plugins.nativepagetransitions.globalOptions.fixedPixelsTop = 64;
        //     window.plugins.nativepagetransitions.globalOptions.fixedPixelsBottom = 48;


        $("#app-object_splash .app_version").text("Version " + BuildInfo.version);
        clearTimeout();

        //db초기화
        datasource.createDB();

        //네트워크 체크 : 공통기반 접속 초기화
        function checkConnection() {
            var networkState = navigator.connection.type;

            if (networkState == Connection.UNKNOWN || networkState == Connection.NONE) {
                return false;
            }
            return true;
        }

        //로딩 출력개선
        //버전 체크 & 접속 초기화
        if (checkConnection()) {
            function gotoMain(){
                datasource.closeDB();
                location.href = "work.html?sso=" + JSON.stringify(sso);
                util.dismissProgress();
            }

            datasource.getVersion()         //버전 체크
            .then( function(version) {
                var versionLink = URLs.postURL(URLs.versionLink , null);

                util.postAJAX('', versionLink)
                .then( function(context, resCode, results) {
                    if (resCode == 0 && !(util.isEmpty(results) || util.isEmpty(results))) {
                        var data = results.data;
                        datasource.updateVersionInfo(util.getToday(false), data, gotoMain);
                    }
                })
            });
        } else {
            navigator.notification.alert("서버와의 접속이 원활하지 않습니다2.\n앱을 다시 시작해 주십시오.", appExit, '알림', '확인');
        }
    },

    _dummy : function (){}
};


function onLoadIndexPage()
{
    application.initialize();
}
