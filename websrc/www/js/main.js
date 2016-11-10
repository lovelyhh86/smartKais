
var application = {

    // Application Constructor
    initialize: function() {
        this.pageLoad();
        this.bindEvents();

    //TODO gpki info load
        var array=location.search;
        var data = array.split("cn=");
        var divid=data[1];

        application.telNo = array.split("tel=")[1];

    },

    //페이지 preload
    pageLoad: function(){
    //    $.mobile.loadPage(pages.addressview.link,{ showLoadMsg:false});
    //    $.mobile.loadPage(pages.detailview.link,{ showLoadMsg:false});
    //    $.mobile.loadPage(pages.detailaddress.link,{ showLoadMsg:false});
     //   $.mobile.loadPage(pages.imageviewer.link,{ showLoadMsg:false});
    },
    //content 크기 갱신
    scaleContentToDevice : function(contentpage)
    {
        var content = $.mobile.getScreenHeight() - $(contentpage).children(".ui-header").outerHeight() - $(contentpage).children(".ui-footer").outerHeight()
         - $(contentpage).children(".ui-content").outerHeight() + $(contentpage).children(".ui-content").height();
        $(contentpage).children(".ui-content").height(content);
    },
    deviceReadyOK:$.Deferred(),

    bindEvents: function() {
        //cordova ready 초기화
        document.addEventListener('deviceready', function() {
            util.showProgress();

            clearTimeout();
    //    $.mobile.loadPage(pages.addressview.link(),{ showLoadMsg:false});
    //    $.mobile.loadPage(pages.detailview.link(),{ showLoadMsg:false});
    //    $.mobile.loadPage(pages.detailaddress.link(),{ showLoadMsg:false});
    //    $.mobile.loadPage(pages.imageviewer.link(),{ showLoadMsg:false});

            //DB초기화
            datasource.createDB();

            /*
            util.getUserInfo(
                function(result) {

                    application.info.sigCd = "11110";
                    application.info.sigNm = "서울특별시 종로구";
                    application.info.opeId = "KMS634090";
                    application.info.opeNm = "관리자";

                    util.dismissProgress();
                    application.deviceReadyOK.resolve();
                },
                function(xhr,error){

                    util.dismissProgress();
                    alert('사용자 정보를 가져오는데 실패했습니다. 다시 실행해주십시오.'+ xhr+ ' ' +error);
                    util.appExit();
                }
            );
            //*/
            util.getUserInfo(function(attr) {
                for (var key in attr)
                {

                }
            });
            application.historyStack = [];

            application.selectSig(application.telNo);

            application.deviceReadyOK.resolve();
            util.dismissProgress();
        }, false);

/******* Common Action Event *********/
        //뒤로가기, back class ,cancel
        document.addEventListener("backbutton", util.goBack);
        $( document ).on("click",".back",  util.goBack );

        //overlay touch
        $( document ).on( "tap", '#searchbg', function(e){
            util.hiddenSearchPanel();
            e.preventDefault();
        });

        $( document ).on( "tap", '#menuoverlay', function(e){
            util.hiddenMenuPanel('#mainMenu');
            util.hiddenHelpDeskPanel('#helpdeskmenu');
            e.preventDefault();
        });

        $(document).on('click','.menu-header-title .fa-close',util.goBack);

        $(document).on("click",'.fa-navicon', function(e){
            util.gotoTask("appmenu");
            e.preventDefault();
        });
        $(document).on("click",'.fa-comments', function(e){
            util.gotoTask("helpdesk");
            e.preventDefault();
        });
        $(document).on('touchmove','#mainMenu', function(e) {
            e.preventDefault();
        });
        $(document).on('click','#mainMenu ul li', function(e) {
            util.hiddenMenuPanel('#mainMenu');
            util.gotoTask($(this).data('link'));
        });


        $(document).on('touchend','.float-camera'
                        , function(e) {
            $(this).removeClass('button_hover');
        });
        $(document).on('touchstart','.float-camera'
                        , function(e) {
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

//        $.mobile.ajaxLinksEnabled = false;
//        $.mobile.ajaxFormEnabled = false;
//        $.mobile.ajaxEnabled = false;

    },
    selectSig: function (telNo) {
        if( telNo == "01059237764") {
            application.mode = "11";
        } else {
            application.mode = "00";
        }

        for (var index = 0 ; index < application.sigInfos.length; index++)
        {
            if (telNo === application.sigInfos[index].telNo){
                application.info = application.sigInfos[index].info;
            }
        }
    },
    sigInfos : [
        {
         telNo : "01059237764", // 사업단 테스트
         info : {
                     sigCd : "11440",
                     sigNm : "서울특별시 마포구",
                     opeId : "kais",
                     opeNm : "kais관리자"
                 }
         },
        {
         telNo : "01040599961", // 충북 청주시
         info : {
                     sigCd : "4311_",
                     sigNm : "충청북도 청주시",
                     opeId : "cjjytb00",
                     opeNm : "조영태"
                 }
         },
        {
         telNo : "01045399699", // 전북 김제시
         info : {
                     sigCd : "45210",
                     sigNm : "전라북도 김제시",
                     opeId : "kjn1235",
                     opeNm : "김정남"
                 }
         }
    ],

    context : {},
    info :   new Object(),
    mode : '00',
    historyStack : [],
    _dummy : ""
};

application.initialize();



