
var workPageReadyOK = $.Deferred();

$( document ).on("pagecreate",pages.workpage.div,  function() {
    $( "[data-role='header']" ).toolbar();  //헤더 고정
    addSearchUser();
    workPageReadyOK.resolve();
});

$.when(app.deviceReadyOK, workPageReadyOK).then(function(){
    loadHelpdesk('#panel-qna .ui-content');  //헬프데스크 메뉴 로딩 menuhelpdesk.js
    //loadAppMenu('#mainMenu');       //앱 메뉴 로딩 menuapp.js

    util.on("notification",function(json,param){

        util.toast('push:' + json.message);
    });

});

//사용자 추가

function addSearchUser(){
    // var param = {
    //     sigCd : app.info.sigCd
    // } ;

    $("#searchUserSel").empty();
    $("#searchUserSel").append("<option>조사자선택</option>");

    var link = URLs.searchUserSelectLink;
    var url = URLs.postURL(link);
    util.postAJAX({}, url).then(
        function (context, rCode, results) {
            //통신오류처리
            if (rCode != 0 || results.response.status < 0) {
                navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                util.dismissProgress();
                return;
            }

            var data = results.data;
            
            

            for(var i in data){
                var userId = data[i].userId;
                var userNm = data[i].userNm;
                var psitnDept = data[i].psitnDept;

                var optionForm = "<option value={0}>{1}</option>"; 
                var userNmText = userNm + "(" + psitnDept +")";

                
                $("#searchUserSel").append(optionForm.format(userId,userNmText));
            }
            

        }
    );



    // var optionForm = "<option value={0}>{1}</option>"; 

    // $("#searchUserSel").append(optionForm.format());
}

//점검사용자 변경셋팅
function changeUser(){
    var searchId = $("#searchUserSel option:selected").val();
    var searchNm = $("#searchUserSel option:selected").text();

    app.info.searchId = searchId;
    app.info.searchNm = searchNm;
}
