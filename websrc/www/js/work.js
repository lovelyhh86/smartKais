
var workPageReadyOK = $.Deferred();

$( document ).on("pagecreate",pages.workpage.div,  function() {
    $( "[data-role='header']" ).toolbar();  //헤더 고정
    workPageReadyOK.resolve();
});

$.when(app.deviceReadyOK, workPageReadyOK).then(function(){
    loadHelpdesk('#panel-qna .ui-content');  //헬프데스크 메뉴 로딩 menuhelpdesk.js
    //loadAppMenu('#mainMenu');       //앱 메뉴 로딩 menuapp.js

    util.on("notification",function(json,param){

        util.toast('push:' + json.message);
    });

});

function openCommonPop(htmlName,header,type, f){
    var popHeader = "#common-pop .ui-bar";
    var container = "#common-pop .popup-content .ui-body:first";

    $(popHeader).empty();
    $(container).empty();

    $(popHeader).append("<h2>"+header+"</h2>");

    if(header == "도로명판"){
        $(popHeader).append('<a href="javascript:util.camera()" id="camera" style="right: 0;float: right;margin: 0;padding: 0;color: white;">카메라</a>');
    }
    
    $(container).load(htmlName, function() {
        MapUtil.setPopup(type, f);
        $("#common-pop").popup("open", { transition: "slideup" });
    })
}
