
var workPageReadyOK = $.Deferred();

$( document ).on("pagecreate",pages.workpage.div,  function() {
    $( "[data-role='header']" ).toolbar();  //헤더 고정
    workPageReadyOK.resolve();
});

$.when(application.deviceReadyOK, workPageReadyOK).then(function(){
    loadHelpdesk('#helpdeskmenu');  //헬프데스크 메뉴 로딩 menuhelpdesk.js
    loadAppMenu('#mainMenu');       //앱 메뉴 로딩 menuapp.js

    util.on("notification",function(json){
        //alert('notification');
    })
});


