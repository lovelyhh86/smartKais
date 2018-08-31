var sso;
var msg = {
    callCenter: "비 정상적인 작업이 수행 되었습니다.\n\n\"바로일터\"를 통하여 다시 시작해 주십시오.\n해당 메시지가 반복될 경우 도움센터(02-3703-3600)로 문의 주시기 바랍니다.",
    exit: "\n\n스마트KAIS 종료합니다.",
    alert: function() {
        navigator.notification.alert(msg.callCenter, '', '알림', '확인');
    },
    wrongPhoto: "'잘못된 사진 데이터 입니다.\n확인 후 다시 시도해 주세요.'",
    noItem: "조회된 정보가 없습니다.",
    noPhoto: "비어있는 사진이 있습니다.\n2장(근거리, 원거리) 모두 촬영해 주세요.",
    noPhotoSave: "변경한 사진이 없습니다.\n새로운 사진을 촬영해 주세요.",
    noSave: "변경한 항목이 없습니다.",
    isSave: "저장 하시겠습니까?",
    isSaveAgain : "저장 하시겠습니까? \n(기존 승인대기 상태의 정보는 현재 정보로 대체됩니다.) ",
    isSavePhoto: "사진을 저장 하시겠습니까?",
    // isSavePhotoUpdate : "변경한 사진이 있습니다. 저장 하시겠습니까?",
    lossClose: "변경한 항목이 있습니다.\n저장하지 않고 창을 닫으시겠습니까?",
    lossPhotoClose: "변경한 사진이 있습니다.\n저장하지 않고 창을 닫으시겠습니까?",
    initInfo: "정보를 다시 조회 하시겠습니까?",
    delPhoto: "사진을 삭제합니다. 다시 촬영해 주세요.\n\n(서버에 반영되지 않음)",
    insertPos: "이 위치에 새로운 시설물을 등록 하시겠습니까?",
    updateWorkDate: "해당시설물을 점검하셨습니까?",
    selectAdrdc: "기초 조사 결과를 선택하십시오.",
    completeAuthAdrdc: "기초조사 결과를 등록하면 금일로부터 5일이내에 기초조사 결과 통보서를 출력해야합니다.\n등록 하시겠습니까?",
    completeAdrdc: "기초조사 결과를 등록 하시겠습니까?",
    saveBuldNm: "건물군에 속한 건물명 변경(일괄로 변경됨)이 있습니다.\n\n저장 하시겠습니까?",
    notScfggMkty: "제2외국어여부를 [단독언어]나 [2개언어]로 변경해주세요.",
    notScfggMkty2: "제2외국어여부를 [2개언어]로 변경해주세요.",
    notSameScfggMkty: "다른 언어를 선택해 주세요.",
    checkRdpqGdSd : "규격을 선택해 주세요.",
    checkZero : "{0}에 0 이나 빈칸을 넣을 수 없습니다.",
    checkScfggMkty : "제2외국어 언어를 선택해 주세요.",
    useTargetScfggMkty : "사용대상이 [보행자용]이 아닐경우 제2외국어를여부는 [미표기]만 가능합니다.",
    noRearcher: "조사자를 선택해 주세요.",
    notPubRearcher: "공무원만 이용할 수 있습니다.",
    impossibleNormal: "정상처리 할 수 없는 시설물 입니다.\n정비를 통해 점검해 주십시요.",
    updateResearch: "해당 시설물을 점검하시겠습니까?",
    successResearch: "정상적으로 점검되었습니다.",
    successModify: "정상적으로 저장 되었습니다. \n해당 내용은 [KAIS웹]을 통한 승인 후 적용됩니다.",
    loadUpdtData: "승인 대기중인 데이터를 불러오시겠습니까?",
    loadUpdtPhoto: "승인 대기중인 사진을 불러오시겠습니까?",
    deleteUpdtData: "승인 대기중인 데이터를 삭제하시겠습니까?\n데이터는 복구 할 수 없습니다.",
    successLoadUpdt : "승인 대기 데이터 불러오기 완료.",
    successDeleteUpdt : "승인 대기 데이터 삭제 완료.",
    notHaveLoadUpdt : "승인 대기중인 데이터가 없습니다.",
    checkRcSttCd : "점검상태를 선택하세요.",
    researchCheckPhoto : "정상처리 이외의 점검상태는 사진 촬영이 필수 입니다.\n사진촬영으로 이동하시겠습니까?",
    researchCheckPhotoCnt : "저장된 {0} 사진이 없습니다.\n사진을 촬영해야 점검이 가능합니다. 이동하시겠습니까?",
    loadOldImg : "원본 사진을 조회 하시겠습니까?",
    successImg : "사진조회 완료",
    notNullData : "빈 값을 넣을 수 없습니다.\n항목을 선택해 주세요.",
    successSpgfInsertPoint : "KAIS C/S\n(자료관리>도로안내시설 편집>도로시설물 위치이동/생성)\n에서 저장된 위치 이동정보를 확인하세요.",
    successNmtgInsertPoint : "KAIS C/S\n(자료관리>건물번호판 편집>건물번호판 위치이동/생성)\n에서 저장된 위치 이동정보를 확인하세요.",
    errorFeather : "위치 찾기를 실패했습니다.",
    errorGeoEngine : "공간정보 엔진 접속을 실패했습니다.\n해당 메시지가 반복될 경우 도움센터(02-3703-3600)로 문의 주시기 바랍니다.",
    errorLoadLayer : "레이어 정보 조회를 실패 했습니다.\n해당 메시지가 반복될 경우 도움센터(02-3703-3600)로 문의 주시기 바랍니다.",
    noItemSpbdNmtg : "등록된 건물번호판이 없습니다. 점검 및 정보조회가 불가합니다.\nKAIS C/S에서 건물번호판을 등록하시기 바랍니다.",
    checkOtherPhoto : "{0} 사진을 촬영 하셔야 저장하실 수 있습니다.",
    checkObject : "비정상적인 {0} 값 입니다.\n도움센터(02-3703-3600)로 문의 주시기 바랍니다.",
    checkSetObjectError : "항목 중 정비대상이 있습니다.\n도움센터(02-3703-3600)로 문의 주시기 바랍니다.",
    dontInsertNull : "{0} 에 빈값을 넣을 수 없습니다.",
    checkGdSd : "규격정보가 없습니다. 그래도 저장 하시겠습니까?",
    autoImgRoadingAlert : "사진창을 열때마다 항상 자동으로 원본사진이 조회됩니다.\n데이터 사용량이 증가합니다.",
    plqUseTargetCheck: "[표준형]중에서 사용대상이 [차로용] 또는 [소로용] 이고\n안내시설방향이 [앞쪽 방향용] 일 수 없습니다.\n속성정보를 확인하여 주시기 바랍니다."
    
};
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', app.onDeviceReady, false);

        //사용자 기본정보 셋팅

        app.info = JSON.parse(localStorage["appInfo"]);
        try {
            app.info.guIncYn = localStorage["guIncYn"];    
        } catch (error) {
            
        }
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
        $(document).on('touchend', '#myResearchTable', function(e) {
            tableListDivScroll(e);
        });
        
        // $(document).on('touchmove', '#myResearchTable', function(e) {
        //     // e.preventDefault(); 
        //     var event = e.originalEvent; 
        //     // startTouchX = event.targetTouches[0].pageX; 
        //     startTouchY = event.targetTouches[0].pageY;

        //     if(event.targetTouches[0].pageY > startTouchY){
        //         var scrollTop = $('.tableListDiv').scrollTop();
        //         //초기화
        //         if(scrollTop == 0){
        //             pos = 0;
        //             $("#myResearchTable > tbody").empty();
        //             selectResearchContent(null,pos,size);
        //         }
        //     }

        //     console.log(event.targetTouches[0].pageY + " , " + startTouchY);
        // });

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