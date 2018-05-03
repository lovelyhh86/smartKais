
var workPageReadyOK = $.Deferred();

$( document ).on("pagecreate",pages.workpage.div,  function() {
    $( "[data-role='header']" ).toolbar();  //헤더 고정
    workPageReadyOK.resolve();

});

$.when(app.deviceReadyOK, workPageReadyOK).then(function(){
    loadHelpdesk('#panel-qna .ui-content');  //헬프데스크 메뉴 로딩 menuhelpdesk.js
    //loadAppMenu('#mainMenu');       //앱 메뉴 로딩 menuapp.js
    addSearchUser();

    //1000m -> 1초 
    // setInterval(function(){ sendMois(); }, 600000);
    // setInterval(function(){ addSearchUser(); }, 300000);// 조사자정보 최신화 5분단위
    setInterval(function(){ checkVersion(); }, 600000); //버전조회 10분단위
    util.on("notification",function(json,param){

        util.toast('push:' + json.message);
    });

});

//사용자 조회 및 셋팅
function addSearchUser(){
    //폰번호
    var param = {
        trmnlId : app.info.opeId
    } ;
    var oldRcrSn = app.info.rcrSn;

    $("#searchUserSel").empty();
    $("#searchUserSel").prepend('<option disabled value="">조사자선택</option>');
    // if(app.info.searchId == undefined){
    //     $("#searchUserSel").val("").trigger('change');
    // }

    var link = URLs.selectResearcherInfo;
    var url = URLs.postURL(link,param);
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
                var rcrSn = data[i].rcrSn;
                var rcrNm = data[i].rcrNm;
                var rcrTyp = data[i].rcrTyp;
                var rcrTypLbl = data[i].rcrTypLbl;

                var optionForm = "<option id='row"+i+"' value={0}>{1}</option>"; 
                var rcrNmText = rcrNm + "(" + rcrTypLbl +")";

                $("#searchUserSel").append(optionForm.format(rcrSn,rcrNmText));

                $("#row"+i).data("rcrSn",rcrSn);
                $("#row"+i).data("rcrNm",rcrNm);
                $("#row"+i).data("rcrTyp",rcrTyp);
            }
            
            if(!util.isEmpty(oldRcrSn)){
                $("#searchUserSel").val(oldRcrSn).trigger('change');
            }else{
                $("#searchUserSel").val("").trigger('change');
            }
            
            util.dismissProgress();
            // console.log("조사자 조회.."+util.getToday(true));
            // util.toast('조사자 조회 완료');

        }
    );

}

//점검사용자 변경셋팅
function changeUser(){
    var rcrSn = $("#searchUserSel option:selected").val();
    var rcrNm = $("#searchUserSel option:selected").data("rcrNm");
    var rcrTyp = $("#searchUserSel option:selected").data("rcrTyp");

    app.info.rcrSn = rcrSn;
    app.info.rcrNm = rcrNm;
    app.info.rcrTyp = rcrTyp;
}

//버전정보 확인
function checkVersion(){
    var params = URLs.postURL(URLs.versionLink, null);

    util.postAJAX('', params)
            .then(function (context, resultCode, results) {
                //통신오류처리
                // if (rCode != 0) {
                //     navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                //     util.dismissProgress();
                //     return;
                // }

                var newVersion = false;
                var d = results.data;
                console.log(d);
            },function(context, xhr, error) {
                console.log("조회 error >> " + error + '   ' + xhr);
                util.dismissProgress();
            },
            util.dismissProgress
        )
                
}