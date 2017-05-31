var sso;
var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', app.onDeviceReady, false);

        //TODO gpki info load
        if (!sso) {
            sso = JSON.parse(decodeURI(location.search.match(/\{.*/)));
        }
        if (sso.TEL)
            app.telNo = sso.TEL;

    },
    onDeviceReady: function () {
        app.bindEvents();
    },
    bindEvents: function () {
        /******* Common Action Event *********/
        //뒤로가기, back class ,cancel
        document.addEventListener("backbutton", util.goBack);
        $(document).on("click", ".back", util.goBack);

        //overlay touch
        $(document).on("tap", '#searchbg', function (e) {
            util.hiddenSearchPanel();
            e.preventDefault();
        });

        $(document).on("tap", '#menuoverlay', function (e) {
            util.hiddenMenuPanel('#mainMenu');
            util.hiddenHelpDeskPanel('#helpdeskmenu');
            e.preventDefault();
        });

        $(document).on('click', '.menu-header-title .fa-close', util.goBack);

        $(document).on("click", '.fa-navicon', function (e) {
            util.gotoTask("appmenu");
            e.preventDefault();
        });
        $(document).on("click", '.fa-comments', function (e) {
            util.gotoTask("helpdesk");
            e.preventDefault();
        });
        $(document).on('touchmove', '#mainMenu', function (e) {
            e.preventDefault();
        });
        $(document).on('click', '#mainMenu ul li', function (e) {
            util.hiddenMenuPanel('#mainMenu');
            util.gotoTask($(this).data('link'));
        });


        $(document).on('touchend', '.float-camera'
            , function (e) {
                $(this).removeClass('button_hover');
            });
        $(document).on('touchstart', '.float-camera'
            , function (e) {
                $(this).addClass('button_hover');
            });
        $(document).on('touchend', ' .addressview_status_btn', function (e) {
            $(this).removeClass('button_hover');
        });
        $(document).on('touchstart', ' .addressview_status_btn', function (e) {
            $(this).addClass('button_hover');
        });
        $(document).on('touchend', ' .addressitem', function (e) {
            $(this).removeClass('button_hover');
        });
        $(document).on('touchstart', ' .addressitem', function (e) {
            $(this).addClass('button_hover');
        });
        $(document).on('touchend', '.helpdeskitem', function (e) {
            $(this).removeClass('button_hover-b');
        });
        $(document).on('touchstart', '.helpdeskitem-b', function (e) {
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
        datasource.createDB().then(function(){
            datasource.getCodeMaster(function (result) {
                app.codeMaster = result;
                app.deviceReadyOK.resolve();
                util.dismissProgress();
            });
        });



    },
    //content 크기 갱신
    scaleContentToDevice: function (contentpage) {
        var content = $.mobile.getScreenHeight() - $(contentpage).children(".ui-header").outerHeight() - $(contentpage).children(".ui-footer").outerHeight()
            - $(contentpage).children(".ui-content").outerHeight() + $(contentpage).children(".ui-content").height();
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
