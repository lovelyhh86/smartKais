var sso;
var msg = {
    callCenter: "\"바로일터\"를 통하여 다시 시작해 주십시오.\n해당 메시지가 반복될 경우 도움센터(1588-0061)로 문의 주시기 바랍니다."
}
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', app.onDeviceReady, false);
    },
    onDeviceReady: function () {
        app.bindEvents();

        /** 네트워크 연결 체크 */
        /** (NET) 인터넛 연결 체크 */
        app.check.connection()

        /** (NET) 모바일 공통기반 연결 체크 */
        .then(app.check.mobileConnection)

        /** 기본환경 셋팅 및 로딩 */
        /** (ENV) 1. DB 초기화 */
        .then(app.db.init)

        /** (ENV) 2. DB 로딩 */
        .then(app.db.loading)

        /** 현재위치 확인 */
        .then(app.check.currentLocation)

        /** (VER) 버전체크 */
        .then(app.check.version)

        /** 메인 화면(페이지)로 이동 */
        .then(app.gotoMain);

    },
    bindEvents: function () {
        document.addEventListener('backbutton', function () { return false; });
    },
    gotoMain: function () {
        app.showProgress("메인 화면 로딩");
        location.href = "work.html?sso=" + JSON.stringify(sso);
    },
    /** 로딩 메시지 보여주기 */
    showProgress: function (msg) {
        if (!msg) msg = "";
        if ($(".ui-loader").css("display") == "none") {
            $.mobile.loading("show", {
                textVisible: "true",
                theme: "c",
                html: "<span class='ui-bar'><img src='img/loading.gif' width='100%'><h2 class='msg'>" + msg + "</h2></span>"
            });
        } else {
            $(".ui-bar .msg").text(msg);
        }
    },
    /** 로딩 메시지 회수 */
    dismissProgress: function () {
        $.mobile.loading("hide");
    },
    check: {
        /** 인터넷 연결 체크 */
        connection: function () {
            var def = $.Deferred();
            app.showProgress("네트워크 연결 확인");

            var networkState = navigator.connection.type;

            if (networkState == Connection.UNKNOWN || networkState == Connection.NONE) {
                navigator.notification.alert("데이터 통신이 실패 되었습니다.\n인터넷 연결 확인 후 다시 시작해 주십시오.", util.appExit, '알림', '확인');
            } else {
                setTimeout(def.resolve, 300);
            }

            return def.promise();
        },
        /** 모바일 공통기반 연결 확인 */
        mobileConnection: function () {
            var def = $.Deferred();
            app.showProgress("공통기반 연결 확인");

            if (util.isEmpty(sso)) {
                navigator.notification.alert("공통기반 연결이 실패 되었습니다.\n\"바로일터\"를 통하여 다시 시작해 주십시오.", util.appExit, '알림', '확인');
            } else {
                setTimeout(def.resolve, 300);
            }

            return def.promise();
        },
        /** 현재위치 점검 */
        currentLocation: function () {
            var def = $.Deferred();
            //app.showProgress("위치정보 확인");

            navigator.geolocation.getCurrentPosition(
                function(position) {
                    var coords = position.coords;
                    var loc = { PROJECTION: "EPSG:4326", TYPE: "GPS", X: coords.longitude, Y: coords.latitude };
                    datasource.setGeolocation(loc);
                    localStorage["loc.X"] = loc.X;
                    localStorage["loc.Y"] = loc.Y;
                    def.resolve();
                },
                function(error) {
                    var loc = { PROJECTION: "EPSG:4326", TYPE: "BASE", X: 126.89758049999996, Y: 37.57721929999922 };   // 광화문
//                    var loc = { PROJECTION: "EPSG:4326", TYPE: "BASE", X: "126.89799370772252", Y: "37.576747067786776" };   // 사업장(성암로 189)
//                    var loc = { PROJECTION: "EPSG:4326", TYPE: "BASE", X: "127.48958927737773", Y: "36.64281407121404" };   // 청주시청(상당로 155)

                    datasource.setGeolocation(loc);
                    localStorage["loc.X"] = loc.X;
                    localStorage["loc.Y"] = loc.Y;
                    def.resolve();
                },
                { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }
            );

            return def.promise();
        }
        ,
        /** 최신버전 정보 체크 */
        version: function () {
            var def = $.Deferred();
            app.showProgress("최신버전 확인");

			datasource.getVersion()
            .then( function(version) {
                var params = URLs.postURL(URLs.versionLink, null);

                util.postAJAX('', params)
                .then(function (context, resultCode, results) {
                    var newVersion = false;
                    if (resultCode == 0 && !(util.isEmpty(results) || util.isEmpty(results))) {
                        var d = results.data;
                        var res = results.response;
                        if(res.status == 1) {
                            datasource.updateVersionInfo(util.getToday(false), d);
                            if(BuildInfo.version < d.versionName) newVersion = true;
                        }
                    }

                    if (newVersion) {
                        navigator.notification.alert("서버에 최신버전이 존재 합니다.\n\"바로일터 > 행정용 앱스토어\"에서 최선버전으로 업데이트 하세요.", def.resolve, '알림', '확인');
                    } else {
                        setTimeout(def.resolve, 300);
                    }
                });
            });

            return def.promise();
        }
    },
    db: {
        /** DB 초기화 */
        init: function () {
            var def = $.Deferred();
            app.showProgress("환경구성 > DB 초기화");

            datasource.createDB().then(
                def.resolve,
                function() {
                    navigator.notification.alert("기본 환경구성에 장애가 발생하였습니다\n" + msg.callCenter, util.appExit, '알림', '확인');
                }
            );

            return def.promise();
        },
        /** DB 공통코드 로딩 */
        loading: function () {
            var def = $.Deferred();
            app.showProgress("환경구성 > DB 로딩");

            util.postAJAX('', URLs.postURL(URLs.updateCodeLink, null))
            .then(function (context, resultCode, results) {
                var loading = false;
                if (resultCode == 0 && !(util.isEmpty(results) || util.isEmpty(results))) {
                    var d = results.data;
                    var res = results.response;
                    if(res.status == 1) {
                        datasource.setCodeMaster(d);
                        loading = true;
                    }
                }

                if (!loading) {
                    navigator.notification.alert("DB 로딩 중에 장애가 발생하였습니다\n" + msg.callCenter, util.appExit, '알림', '확인');
                } else {
                    def.resolve();
                }
            });

            return def.promise();
        }
    }
};

