
var workPageReadyOK = $.Deferred();

$( document ).on("pagecreate",pages.workpage.div,  function() {
    $( "[data-role='header']" ).toolbar();  //헤더 고정
    workPageReadyOK.resolve();
});

$.when(app.deviceReadyOK, workPageReadyOK).then(function(){
    //loadHelpdesk('#panel-qna .ui-content');  //헬프데스크 메뉴 로딩 menuhelpdesk.js
    //loadAppMenu('#mainMenu');       //앱 메뉴 로딩 menuapp.js

    util.on("notification",function(json,param){

        util.toast('push:' + json.message);
    });

});
