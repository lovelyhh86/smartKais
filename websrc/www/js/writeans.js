
$(function(){

    $( document ).on("pagebeforeshow",pages.writereplypage.div,  function() {

        $('#write_reply_subject').val('');
        $('#write_reply_memo').val('');
    });
    $( document ).on("pageshow","#write_reply",  function() {
        //var contentTop = $('#addressview_images_container').height() + $('#addressview_images_container').offset().top;

        var context = app.context;
        if (util.isEmpty(context))
            return;

        app.context = {};
        var attr = {
            sn : context.sn,
            sigCd : app.info.sigCd,
            userid : app.info.opeId,
            registName : app.info.opeNm
        };
        $('#write_reply_page').data('context',attr);
        var top = $('#write_reply_page > .titleheader').outerHeight() ;

        $('#write_reply_contents').css('top',top);
        $('#write_reply_contents').css('height',$.mobile.getScreenHeight() -top);

     });

    $(document).on("focus","#write_reply_memo", function() {

        setTimeout(function(){
            $('#write_reply_contents').css('height',$.mobile.getScreenHeight() -top);
         },100);

        $('#write_reply_keypad_opt').removeClass('display-none');
    });

    $(document).on("focusout","#write_reply_memo", function() {

        setTimeout(function(){
            $('#write_reply_contents').css('height',$.mobile.getScreenHeight() -top);
        },100);
        $('#write_reply_keypad_opt').addClass('display-none');
    });

    $(document).on("focusout","#write_reply_memo", function() {

        setTimeout(function(){
            $('#write_reply_contents').css('height',$.mobile.getScreenHeight() -top);
        },100);
        $('#write_reply_keypad_opt').addClass('display-none');
    });
    $(document).on('click','#write_reply .ui-btn.backList', function(event){
        replyToggle();
    });
    $(document).on('click','#write_reply .ui-btn.submit', function(event){

        // var data = $('#write_reply_page').data('context');
        // console.log(data);
        // data.content = $('#write_reply_memo').val();
        // data.subject = $('#write_reply_subject').val();
        var sn = $("#write_reply").data('sn');
        var content = $('#write_reply_memo').val();
        var subject = $('#write_reply_subject').val();
        
        if (subject.length == 0 ){
            util.toast('제목은 필수항목입니다');
            return;
        }

        if (content.length == 0 ){
            util.toast('내용은 필수항목입니다');
            return;
        }

        util.showProgress();

        var param = {
            sn : sn,
            content : content,
            subject : subject,
            sigCd : app.info.sigCd,
            userid : app.info.opeId,
            registName : app.info.opeNm
        };

        var urldata = URLs.postURL(URLs.helpdeskReplylink,param);

        util.postAJAX('',urldata)
            .then( function(context,rcode,results) {
                if (util.isEmpty( results.response ) == false && results.response.status == '1'){
                    navigator.notification.alert('도움센터 답변을 등록하였습니다', function (){
                        // util.goBack();
                        $(document).trigger('refresh_qna');
                    },'도움센터 답변등록', '확인');

                    replyClear();
                    replyToggle();

                    util.dismissProgress();
                }
                else {
                //TODO 응답코드에 따른 에러 표현
                    navigator.notification.alert('도움센터 답변을 등록하지 못하였습니다', function (){ },'도움센터 답변등록', '확인');
                    util.dismissProgress();
                }
             },function(context,xhr,error) {

                    navigator.notification.alert('도움센터 답변을 등록하지 못하였습니다', function (){ },'도움센터 답변등록', '확인');
                    util.dismissProgress();
             });
    });

});

function replyClear(){
    $('#write_reply_subject').val('');
    $('#write_reply_memo').val('');
}

function replyToggle(){
    
    // $('#allQna_a').click();
    $('#noReply_a').click();
}