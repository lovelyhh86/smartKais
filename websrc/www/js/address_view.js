
$(function(){
var editPosTop;
var editPosHeight;
var memoMaxLength = 500;


function buildContent( sn, sig_cd){
    util.showProgress();
    $('#addressview_contents').scrollTop();


    $('#addressview_page').data('sn','');
    $('#addressview_page').data('sigcd','');

    var slider = $('#addressview_images').data('flexslider');
    var imgCount = slider.count ;

    for (var imgInx = 0 ; imgInx < imgCount; imgInx++)
             slider.removeSlide(0);

    var param = {"sn":sn,"sigCd":sig_cd};
    var url = URLs.postURL(URLs.addresslink,  param  );
    util.postAJAX({},url)
        .then( function(context,rcode,results) {  //detailinfo response

           var data = results.data;
           if (rcode != 0  )
           {
                navigator.notification.alert('기초조사 항목 정보를 가져오는데 실패하였습니다.',
                    function (){
                    util.goBack();
                },'기초조사', '확인');
                util.dismissProgress();
                return;
           }


           if ( util.isEmpty(slider) == false)
           {
               if (util.isEmpty(data) == false &&  data.images !== 'undefined' && data.images !== '[]')
               {
                   for (var index in data.images)
                   {
                        var image = data.images[index];
                        var obj = "<li style='position:relative;' data-id='0'  data-name='"+ image.name +"' data-time='"+ image.time +"'>"+
                        " <div class='float-camera' " +
                                                              "style='background-color:rgba(61,65,144,0.8);position:absolute;top:20px;'   >" +
                                                                       "<i class='fa fa-trash fa-inverse '></i>" +
                                                                   "</div>" +
                                  "<img style='height: 200px; width: 100%; object-fit: contain' src='data:image;base64,"+  image.src +"'/></li>"  ;
                        slider.addSlide(obj);
                   }
               }
               if (util.isEmpty(data.files) == true || data.files.length == 0)
               {
                    var obj = "<li  data-id='-1'>"+
                              "<img style='height: 200px; width: 100%; object-fit: contain' src='./images/no_image.jpg'/></li>"  ;
                    slider.addSlide(obj);
               }

                var firstslide = $('.slides li').index($('.slides li:first'));
                slider.flexslider('prev'); // This is the trick.
                slider.flexslider(firstslide);
           }

            $('#addressview_page').data('sn',sn);
            $('#addressview_page').data('sigcd',sig_cd);
            $('#address_memo').val('');
            $('#addressview_title').text( ''  );
            if (util.isEmpty(data) == false ) {
                $('#addressview_title').text( data.buldLabel  );
                $('#address_memo').val(util.isEmpty(data.docSurveyEtc) ? '' : data.docSurveyEtc );

                if ( util.isEmpty(data.docSurveyResult) == false) {
                    var state = data.docSurveyResult.split('|');
                    for (var index in state)
                    {
                        var icon = state[index] === 'N' ? 'fa-circle-o' :
                                                          state[index] === '1' ? 'fa-check-circle-o' : 'fa-times-circle-o';
                        var selector =$('#address_item_' + index);
                        selector.removeClass('fa-check-circle-o');
                        selector.addClass(icon);
                    }
                }
            }


            util.dismissProgress();
         },function(context,xhr,error) {
            console.log("갱신실패"+ error+'   '+ xhr);

            navigator.notification.alert('기초조사 항목 정보를 가져오는데 실패하였습니다.',
                    function (){
                    util.goBack();
                },'기초조사', '확인');

            util.dismissProgress();
        }
    );
}

$( document ).on("pagecreate",pages.detailaddress.div,  function() {

     $('#addressview_images').flexslider({
            animation: "slide",
            animationLoop: false,
            controlNav:false,    // pagination off
            slideshow:false,     // slide timer off
            directionNav: false, //disable arrow navigation
            start: function(slider){

            }
          });
    util.registLimitText('#address_memo',memoMaxLength);
});

$( document ).on("pagehide",pages.detailaddress.div,  function(event,data) {

});

$( document ).on("pagebeforeshow",pages.detailaddress.div,  function(event,data) {
    var context = app.context;
    if (util.isEmpty(context))
        return;

    app.context = {};

    buildContent(context.sn, context.sig_cd );

});

$( document ).on("pageshow",pages.detailaddress.div,  function() {
    var slider = $('#addressview_images').data('flexslider');
    slider.resize();

    //var contentTop = $('#addressview_images_container').height() + $('#addressview_images_container').offset().top;

    var contentTop = $('#addressview_state_remark').height() + $('#addressview_state_remark').offset().top;


    $('#addressview_contents').css('top', contentTop);
    $('#addressview_contents').css('height', ( $(window).height() - contentTop - parseInt($('#addressview_contents').css('padding-top')) - parseInt($('#addressview_contents').css('padding-bottom'))  ) + 'px');
});

$(document).on("focus","#address_memo", function(){

    editPosTop = $('#addressview_contents').position().top;
    editPosHeight = $('#addressview_contents').height();
    var top = $('.titleheader').outerHeight() + $('#bbs_page>.subtitleheader').outerHeight();

    $('#addressview_contents').css('top',top + 'px');

    $('#addressview_images_container').addClass('display-none');
    $('#address_addimage').addClass('display-none');

    $('#addressview_contents > ul').addClass('display-none');
    $('#addressview_contents a.accept_btn').addClass('display-none');
    $('#addresslview_keypad_opt').removeClass('display-none');
});

$(document).on("focusout","#address_memo", function(){
    var editBottom = editPosTop + $('#addressview_contents').height();
    $('#addressview_contents').css('top',editPosTop + 'px');

    $('#addressview_images_container').removeClass('display-none');
    $('#address_addimage').removeClass('display-none');

    $('#addressview_contents > ul').removeClass('display-none');
    $('#addressview_contents a.accept_btn').removeClass('display-none');
    $('#addresslview_keypad_opt').addClass('display-none');

    var memo = $('#address_memo').val();
    if (memo.length > memoMaxLength)
    {
        $('#address_memo').val(memo.substr(0,memoMaxLength));
    }
});


$( document ).on("click","#addressview_images .slides li img", function(event){
    event.preventDefault();
 //  util.slide_page('left', pages.imageviewer,{ imagesrc : $(this).attr('src')   });
});



$(document).on('click','#addressview_page .fa-map-marker', function(e) {

    var sn = $('#addressview_page').data('sn');
    var category = 'address';
    var sigcd = $('#addressview_page').data('sigcd');

    var page = pages.map;
    util.slide_page('left', page, { sn: sn, type: category, sigcd: sigcd });
    e.preventDefault();
});

$(document).on('click','#addressview_contents > ul .addressviewCheck'  , function(e) {
    var btn = $(this).children('i');
    if (btn.hasClass('fa-check-circle-o'))
    {
        btn.removeClass('fa-check-circle-o');
        btn.addClass('fa-times-circle-o');
    }
    else if (btn.hasClass('fa-times-circle-o'))
    {
        btn.removeClass('fa-times-circle-o');
        btn.addClass('fa-circle-o');
    }
    else
    {
        btn.removeClass('fa-circle-o');
        btn.addClass('fa-check-circle-o');
    }
});


function updateWork(){
    util.showProgress();
    var param = {
        sidCd : $('#addressview_page').data('sigcd'),
        sn : $('#addressview_page').data('sn'),
        docSurveyResult : "",
        docSurveyEtc : $('#address_memo').val(),
        ope_id: app.info.opeId ,
        bsiSurveyDate : util.getToday(),
        images:[]
    };

    var docexmres="";
    var elems = $('#addressview_contents > ul .addressviewCheck');
    var eleLen = elems.length;
    for (var index = 0; index < eleLen; index++)
    {
        if (docexmres !== '')
            docexmres += '|';
        var item = $('#address_item_'+index);
        docexmres += (item.hasClass('fa-circle-o') ? 'N' : item.hasClass('fa-check-circle-o') ?  '1' : '0');
    }
    param.docExmRes = docexmres;

    var imageElems = $("#addressview_images .slides").find("li"); //find( " li[data-id='-1000']");

    for (var index = 0 ; index < imageElems.length; index++ )
    {
        var elem = $(imageElems[index]);
        var id = elem.data('id');
        if (id != '-1')
        {
            var time = elem.data('time');
            var name = elem.data('name');
            name = time + 'rn' + 'bobn' + 'bubn' +'.jpg';
            var src = elem.children('img').attr('src');
            src = src.substring( src.indexOf('base64,') + 'base64,'.length);
            param.images.push({ name:name, base64:src});
        }
    }

    var urldata = URLs.postURL(URLs.updateAddressInfo,param);

    util.postAJAX('',urldata)
        .then( function(context,rcode,results) {

            if (results.response.status == 1){
                navigator.notification.alert('기초조사 결과를 등록하였습니다',
                    function (){
                        app.context = { categoryid:'address', sig_cd:app.info.sigCd };
                        util.goBack();
                    },'기초조사', '확인');
            }
            else {
            //TODO 응답 코드반영
                navigator.notification.alert('기초조사 결과를 등록하지 못하였습니다',
                    function (){
                     //   alert('실패처리 / 초기화 등');
                    },'기초조사', '확인');
            }

            util.dismissProgress();
         },function(context,xhr,error) {
            navigator.notification.alert('기초조사 결과를 등록하지 못하였습니다',
                    function (){
                        //TODO 실패처리 / 초기화
                  //       util.goBack();
                    },'기초조사', '확인');
            util.dismissProgress();
         });
}

$(document).on('click','#addressview_contents a.accept_btn',function(e){

    //TODO 항목 체크 후 경고 진행
    navigator.notification.confirm('기초조사 결과를 등록하시겠습니까?',
                                    function (btnIndex){
                                        if (btnIndex == 1)
                                            updateWork();
                                    },'기초조사', ['등록','취소']);
});

$(document).on('click','#address_addimage', function(event) {
    var slider = $('#addressview_images').data('flexslider');
    var maxPics = 3;
    if (slider.count >= maxPics) {
        navigator.notification.alert('기초조사 사진등록은 '+ maxPics + '개까지 입니다.', function (){ },'사진 추가', '확 인');
    }
    else
    {
        util.addPictureFromCamera('#addressview_images');
    }
});

$(document).on('click','#address_addimage .fa-trash', function(event){

    var slider = $('#address_addimage').data('flexslider');


    navigator.notification.confirm('현재 사진을 삭제하시겠습니까? ',function (index) {
        if (index == 2)
        {
            slider.removeSlide(slider.currentSlide);
            if (slider.count == 0){
                var obj = "<li  data-id='-1'>"+
                          "<img style='height: 220px; width: 100%; object-fit: contain' src='./images/no_image.jpg'/></li>"  ;
                slider.addSlide(obj);
            }
        }
    }, "사진 삭제", "취 소,삭 제");
});


});