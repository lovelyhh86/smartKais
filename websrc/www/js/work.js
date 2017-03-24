
var workPageReadyOK = $.Deferred();

$( document ).on("pagecreate",pages.workpage.div,  function() {
    $( "[data-role='header']" ).toolbar();  //헤더 고정
    workPageReadyOK.resolve();
});

$.when(app.deviceReadyOK, workPageReadyOK).then(function(){
    //loadHelpdesk('#helpdeskmenu');  //헬프데스크 메뉴 로딩 menuhelpdesk.js
    //loadAppMenu('#mainMenu');       //앱 메뉴 로딩 menuapp.js

    util.on("notification",function(json,param){

        util.toast('push:' + json.message);
    });
});

$(function() {
    // 패널 초기화
    $( "body>[data-role='panel']" ).panel();

    // 타이틀 메뉴 버튼 클릭
    $("#menu_btn").on("click", function(evt) {
        evt.preventDefault();

        $("#menu_panel").panel("open");
    });
    // 타이틀 도움센터 버튼 클릭
    $("#push_btn").on("click", function(evt) {
        evt.preventDefault();

        $("#push_panel").panel("open");
    });
});