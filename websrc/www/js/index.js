var sso;
var versionCode;
var versionName;
var tmDevice;
var tmSerial
var msg = {
    callCenter: "\n해당 메시지가 반복될 경우 도움센터(02-3703-3600)로 문의 주시기 바랍니다.",
    appRun: "\n\"바로일터\"를 통해 다시 시작해 주십시오.",
    server: "\n서버에 연결할 수 없습니다({0}).",
    exit: "\n\n스마트KAIS를 종료합니다."
};

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
        .then(app.check.mobileConnection, util.appExit)

        /** 스마트KAIS 등록여부 확인 */
        .then(app.check.authUser, util.appExit)
        
        /** 자치단체 정보 조회 */
        .then(app.check.sggInfo, util.appExit)

        /** 기본환경 셋팅 및 로딩 */
        /** (ENV) 1. DB 초기화 */
        .then(app.db.init, util.appExit)

        /** (ENV) 2. DB 로딩 */
        .then(app.db.loading, util.appExit)

        /** 현재위치 확인 */
        .then(app.check.currentLocation, util.appExit)

        /** 기본설정체크 */
        .then(app.check.checkBaseConfig, util.appExit)

        /** (VER) 버전체크 */
        .then(app.check.version, util.appExit)

        /** 메인 화면(페이지)로 이동 */
        .then(app.gotoMain, util.appExit);

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
                navigator.notification.alert("데이터 통신이 실패 하였습니다.\n인터넷 연결 확인 후 다시 시작해 주십시오." + msg.exit, def.reject, '알림', '확인');
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
                navigator.notification.alert("공통기반 연결이 실패 되었습니다." + msg.appRun + msg.exit, def.reject, '알림', '확인');
            } else {
                setTimeout(def.resolve, 300);
            }

            return def.promise();
        },
        /** 스마트KAIS 등록여부 확인 */
        authUser: function() {
            var def = $.Deferred();
            app.showProgress("접속정보 조회");

            var sendParams = {
                dn : sso.DN,
                machineNo : sso.TEL,
                uuid : sso.UUID
            }

            var params = URLs.postURL(URLs.authLink, sendParams);

            util.postAJAX('', params).then(
                function (context, resultCode, results) {
                    if (resultCode == 0 && !(util.isEmpty(results.data))) {
                        var d = results.data;

                        app.info = {
                            sigCd: d.sigCd,
                            opeId: "{1}".format(d.userId, d.machineNo),
                            opeNm: d.userNm
                        }

                        if(d.testYn == "Y") {
                            app.info.mode = "11";
                            app.mode = "11";
                        } else {
                            app.info.mode = "00";
                            app.mode = "00";
                        }

                        localStorage["appInfo"] = JSON.stringify(app.info);
                        

                        setTimeout(def.resolve, 300);
                    } else {
                        navigator.notification.alert("해당 단말기가 KAIS에 등록되지 않았거나\n접속 가능한 자치단체를 찾을 수 없습니다." + msg.callCenter + msg.exit, def.reject, '알림', '확인');
                    }
                }, function(context, resultCode, results) {
                    navigator.notification.alert(msg.server.format(resultCode) + msg.callCenter + msg.exit, def.reject, '알림', '확인');
                }
            );

            return def.promise();
        },
        /** 자치단체 정보 조회 */
        sggInfo: function() {
            var def = $.Deferred();
            app.showProgress("자치단체 정보 조회");

            var params = URLs.postURL(URLs.sggInfo, '');

            util.postAJAX('', params).then(
                function (context, resultCode, results) {
                    if (resultCode == 0 && !(util.isEmpty(results.data))) {
                        var d = results.data;

                        localStorage["sigNm"] = d.admNm;
                        localStorage["serviceProj"] = d.trgnptLbl;
                        if(d.trgnpt == "01") {
                            localStorage["sourceProj"] = "EPSG:5176";
                        } else if(d.trgnpt == "02"){
                            localStorage["sourceProj"] = "EPSG:5174";
                        } else if(d.trgnpt == "03"){
                            localStorage["sourceProj"] = "EPSG:5173";
                        } else if(d.trgnpt == "08"){
                            localStorage["sourceProj"] = "EPSG:5175";
                        } else {
                            navigator.notification.alert("자치단체 정보가 조회되지 않습니다." + msg.callCenter + msg.exit, util.appExit, '알림', '확인');
                        }
                        setTimeout(def.resolve, 300);
                    } else {
                        navigator.notification.alert("해당 단말기가 KAIS에 등록되지 않았거나\n접속 가능한 자치단체를 찾을 수 없습니다." + msg.callCenter + msg.exit, def.reject, '알림', '확인');
                    }
                }, function(context, resultCode, results) {
                    navigator.notification.alert(msg.server.format(resultCode) + msg.callCenter + msg.exit, def.reject, '알림', '확인');
                }
            );

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
                    datasource.setGeolocation(loc);
                    localStorage["loc.X"] = loc.X;
                    localStorage["loc.Y"] = loc.Y;
                    def.resolve();
                },
                { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }
            );

            return def.promise();
        },
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
                        navigator.notification.alert("서버에 최신버전이 존재 합니다.\n\"바로일터 > 행정용 앱스토어\"에서 최선버전으로 업데이트 하세요." + msg.exit, util.appExit, '알림', '확인');
                    } else {
                        setTimeout(def.resolve, 300);
                    }
                });
            });

            return def.promise();
        },

        /** 기본환경설정 기본셋팅 */
        checkBaseConfig: function(){
            var def = $.Deferred();
            app.showProgress("환경구성 > 기본환경셋팅");
            if(localStorage.getItem('mapBaseConfig') == null){
                
                mapBaseConfig = {
                    zoom : {
                        spgf : 14,
                        buld : 13
                    }
                }
                localStorage["mapBaseConfig"] = JSON.stringify(mapBaseConfig);
            }

            versionInfo = {
                versionName : versionName,
                versionCode : versionCode
            }

            localStorage["versionInfo"] = JSON.stringify(versionInfo);

            // localStorage["telNo"] = sso.TEL;

            setTimeout(def.resolve, 300);

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
                    navigator.notification.alert("기본 환경구성에 장애가 발생하였습니다\n" + msg.callCenter + msg.exit, util.appExit, '알림', '확인');
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
                    navigator.notification.alert("DB 로딩 중에 장애가 발생하였습니다\n" + msg.callCenter + msg.exit, util.appExit, '알림', '확인');
                } else {
                    def.resolve();
                }
            });

            return def.promise();
        }
    }
};

