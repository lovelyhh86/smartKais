
$(function(){

    $( document ).on("pageshow",pages.writereplypage.div,  function() {
        //var contentTop = $('#addressview_images_container').height() + $('#addressview_images_container').offset().top;

        var context = application.context;
        if (util.isEmpty(context))
            return;

        application.context = {};
        var attr = {
            sn : context.sn,
            sigcd : application.info.sigCd,
            userid : application.info.opeId
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
    $(document).on('click','#write_reply_page .rightMenuBtn', function(event){

        var data = $('#write_reply_page').data('context');
        console.log(data);
        data.reply = $('#write_reply_memo').val();

        util.showProgress();

        var urldata = URLs.postURL(URLs.helpdeskReplylink,data);

        util.postAJAX('',urldata)
            .then( function(context,rcode,results) {

                if (true || util.isEmpty( results.data ) == false && result.data.success == '1'){
                    navigator.notification.alert('도움센터 답변을 등록하였습니다', function (){
                        util.goBack();
                        $(document).trigger('refresh_qna');
                    },'도움센터 답변등록', '확인');
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
