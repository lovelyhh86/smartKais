var sso;
var msg = {
    callCenter: "비 정상적인 작업이 수행 되었습니다.\n\n\"바로일터\"를 통하여 다시 시작해 주십시오.\n해당 메시지가 반복될 경우 도움센터(02-3703-3600)로 문의 주시기 바랍니다.",
    exit: "\n\n스마트KAIS 종료합니다.",
    alert: function() {
        navigator.notification.alert(msg.callCenter, '', '알림', '확인');
    },
    noItem: "조회된 정보가 없습니다.",
    noPhoto: "비어있는 사진이 있습니다.\n2장(근거리, 원거리) 모두 촬영해 주세요.",
    noSave: "변경한 항목이 없습니다.",
    isSave: "변경한 항목이 있습니다. 저장 하시겠습니까?",
    isSavePhoto: "변경한 사진이 있습니다. 저장 하시겠습니까?",
    lossClose: "변경한 항목이 있습니다. 닫기를 누르면 저장되지 않습니다.",
    lossPhotoClose: "변경한 사진이 있습니다(단, 삭제된 사진 상태 저장 불가).\n\n닫기를 누르면 저장되지 않습니다.",
    initInfo: "정보를 다시 조회 하시겠습니까?",
    delPhoto: "사진을 삭제합니다(서버에 반영하지 않음).\n다시 촬영해 주세요.",
    insertPos: "이 위치에 새로운 시설물을 등록 하시겠습니까?",
    updateWorkDate: "해당시설물을 점검하셨습니까?",
    selectAdrdc: "기초 조사 결과를 선택하십시오.",
    completeAuthAdrdc: "기초조사 결과를 등록하면 금일로부터 5일이내에 기초조사 결과 통보서를 출력해야합니다.\n등록 하시겠습니까?",
    completeAdrdc: "기초조사 결과를 등록 하시겠습니까?",
    saveBuldNm: "건물군 내 건물명이 일괄로 변경됩니다. 저장 하시겠습니까?",
    notScfggMkty: "제2외국어여부를 [단독언어]나 [2개언어]로 변경해주세요.",
    notScfggMkty2: "제2외국어여부를 [2개언어]로 변경해주세요.",
    checkRdpqGdSd : "규격을 선택해 주세요.",
    checkZero : "{0}에 0 이나 빈칸을 넣을 수 없습니다.",
    checkScfggMkty : "제2외국어 언어를 선택해 주세요.",
    useTargetScfggMkty : "사용대상이 [보행자용]이 아닐경우 제2외국어를여부는 [미표기]만 가능합니다."
};
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', app.onDeviceReady, false);

        //사용자 기본정보 셋팅

        app.info = JSON.parse(localStorage["appInfo"]);
        // app.info.sigNm = localStorage["sigNm"];
    },
    onDeviceReady: function() {
        app.bindEvents();
    },
    bindEvents: function() {
        /******* Common Action Event *********/
        //뒤로가기, back class ,cancel
        document.addEventListener("backbutton", util.goBack);
        $(document).on("click", ".back", util.goBack);

        //overlay touch
        $(document).on("tap", '#searchbg', function(e) {
            util.hiddenSearchPanel();
            e.preventDefault();
        });

        $(document).on("tap", '#menuoverlay', function(e) {
            util.hiddenMenuPanel('#mainMenu');
            util.hiddenHelpDeskPanel('#helpdeskmenu');
            e.preventDefault();
        });

        $(document).on('click', '.menu-header-title .fa-close', util.goBack);

        $(document).on("click", '.fa-navicon', function(e) {
            util.gotoTask("appmenu");
            e.preventDefault();
        });
        $(document).on("click", '.fa-comments', function(e) {
            util.gotoTask("helpdesk");
            e.preventDefault();
        });
        $(document).on('touchmove', '#mainMenu', function(e) {
            e.preventDefault();
        });
        $(document).on('click', '#mainMenu ul li', function(e) {
            util.hiddenMenuPanel('#mainMenu');
            util.gotoTask($(this).data('link'));
        });


        $(document).on('touchend', '.float-camera', function(e) {
            $(this).removeClass('button_hover');
        });
        $(document).on('touchstart', '.float-camera', function(e) {
            $(this).addClass('button_hover');
        });
        $(document).on('touchend', ' .addressview_status_btn', function(e) {
            $(this).removeClass('button_hover');
        });
        $(document).on('touchstart', ' .addressview_status_btn', function(e) {
            $(this).addClass('button_hover');
        });
        $(document).on('touchend', ' .addressitem', function(e) {
            $(this).removeClass('button_hover');
        });
        $(document).on('touchstart', ' .addressitem', function(e) {
            $(this).addClass('button_hover');
        });
        $(document).on('touchend', '.helpdeskitem', function(e) {
            $(this).removeClass('button_hover-b');
        });
        $(document).on('touchstart', '.helpdeskitem-b', function(e) {
            $(this).addClass('button_hover');
        });

        clearTimeout();
        //    $.mobile.loadPage(pages.addressview.link(),{ showLoadMsg:false});
        //    $.mobile.loadPage(pages.detailview.link(),{ showLoadMsg:false});
        //    $.mobile.loadPage(pages.detailaddress.link(),{ showLoadMsg:false});
        //    $.mobile.loadPage(pages.imageviewer.link(),{ showLoadMsg:false});

        app.historyStack = [];

        //DB초기화
        util.showProgress();
        datasource.createDB().then(function() {
            datasource.getCodeMaster(function(result) {
                app.codeMaster = result;
                app.deviceReadyOK.resolve();
                util.dismissProgress();
            });
        });



    },
    //content 크기 갱신
    scaleContentToDevice: function(contentpage) {
        var content = $.mobile.getScreenHeight() - $(contentpage).children(".ui-header").outerHeight() - $(contentpage).children(".ui-footer").outerHeight() -
            $(contentpage).children(".ui-content").outerHeight() + $(contentpage).children(".ui-content").height();
        $(contentpage).children(".ui-content").height(content);
    },
    deviceReadyOK: $.Deferred(),
    codeMaster: {},
    context: {},
    info: new Object(),
    mode: '00',
    historyStack: [],
    _dummy: ""
};

app.initialize();