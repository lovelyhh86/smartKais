
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
        if (checkConnection())
        {
     //       alert('debug index.js');
            function gotoMain(){
                datasource.closeDB();

                var redirectUrl = "main.html";
                redirectUrl = "work.html?cn=" + cn + "&tel="+telnum;
                location.href = redirectUrl;
                util.dismissProgress();
            }





            datasource.getVersion()         //버전 체크
            .then( function(versionInfo) {  //codemaster 요청

                var  codemasterLink = URLs.postURL(URLs.updateCodelink , null);//util.isEmpty(versionInfo) ? null  : { updateDate: versionInfo });

                return util.postAJAX('',codemasterLink);
            })
            .then( function(context,rcode,results) {

                if ( rcode == 0 && !util.isEmpty(results) && results.data.length !== 0  )
                {
                    var data = results.data;
                    datasource.updateVersionInfo(util.getToday(false), data, gotoMain);
                }

                ;
            });



            /*
            datasource.getVersion()         //버전 체크
            .then( function(versionInfo) {  //codemaster 요청
                var url = URLs.getURL(URLs.versionchecklink,versionInfo);
                return util.getAJAX(versionInfo,url);
            })
            .then( function(versionInfo,results) { //codemaster 반영
                var obj =  results;//JSON.parse(results);

                if (versionInfo.appversion != obj.appversion || versionInfo.codeversion != obj.codeversion)
                {
                    datasource.updateVersionInfo(obj);
                }
                gotoMain();

            },function(versionInfo,xhr,error) {
                navigator.notification.alert("서버와의 접속이 원활하지 않습니다.\n앱을 다시 시작해 주십시오.", appExit, '알림', '확인');
            });
            //*/
        }
        else
        {
            navigator.notification.alert("서버와의 접속이 원활하지 않습니다2.\n앱을 다시 시작해 주십시오.", appExit, '알림', '확인');
        }
    },

    _dummy : function (){}
};


function onLoadIndexPage()
{
    application.initialize();
}
