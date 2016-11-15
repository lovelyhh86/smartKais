
$(function(){

var facilityOrg = {};
var editPosTop = 0;
var memoMaxLength = 100;

function buildContent(content ){
    util.showProgress();

    var categoryid = content.category;
    var sn = content.sn;
    var sig_cd = content.sigcd;
    var title = content.title;

    var link = categoryid === 'buildsign' ? URLs.buildsignlink : URLs.roadsignlink;
    var url = URLs.postURL(link, { "sn":sn, "sigCd":sig_cd , "workId" : application.info.opeId});

    $('#detailview_page').data('sn','');
    $('#detailview_page').data('category','');
    $('#detailview_page').data('sigcd','');
    $('#detailview_page').data('title','');


    var slider = $('#detail_images').data('flexslider');
    var imgCount = slider.count ;

    for (var imgInx = 0 ; imgInx < imgCount; imgInx++)
             slider.removeSlide(0);


    $('#detailview_title').text('');
    checkedAttr = $('input:radio[name="facStat"]:checked');
    if (util.isEmpty(checkedAttr) == false)
    {
    //    checkedAttr.removeAttr('checked');
     //   checkedAttr.checked = false;
        checkedAttr.prop("checked",false);
    }

    //util.getAJAX({},url)
    util.postAJAX({},url)
        .then( function(context,rcode,results) {

           var data = results.data;
           if (rcode != 0 || util.isEmpty(data) === true )
           {
                navigator.notification.alert('시설물 정보를 가져오지 못하였습니다', function (){
                                            util.goBack();
                                            },'시설물 정보 조회', '확인');
                util.dismissProgress();
                return;
           }

           if ( util.isEmpty(slider) == false)
           {
               if ( util.isEmpty(data.files) === false)
               {
                   for (var index in data.files)
                   {
                        var image = data.files[index];
                        if ( util.isEmpty(image.base64) === false && image.base64.length > 0)
                        {
                            var obj = "<li  style='position:relative;' data-id='0' data-name='"+ image.name +"' data-time=''>"+
                                        " <div class='float-camera' " +
                                                                   "style='background-color:rgba(61,65,144,0.8);position:absolute;top:20px;'   >" +
                                                                            "<i class='fa fa-trash fa-inverse '></i>" +
                                                                        "</div>" +
                                      "<img style='height: 220px; width: 100%; object-fit: contain' src='data:image;base64,"+  image.base64 +"'/></li>"  ;
                            slider.addSlide(obj);
                        }
                   }
               }
               if (util.isEmpty(data.files) == true || data.files.length == 0 || slider.count == 0)
               {
                    var obj = "<li  data-id='-1'>"+
                              "<img style='height: 220px; width: 100%; object-fit: contain' src='./images/no_image.jpg'/></li>"  ;
                    slider.addSlide(obj);
               }

                var firstslide = $('.slides li').index($('.slides li:first'));
                slider.flexslider('prev'); // This is the trick.
                slider.flexslider(firstslide);
           }

            $('#detailview_page').data('sn',sn);
            $('#detailview_page').data('category',categoryid);
            $('#detailview_page').data('sigcd',sig_cd);
            $('#detailview_page').data('title',title);

            var functor = function(data){ };
            var status ='';
            switch(categoryid)
            {
                case 'buildsign':  functor = makeBuildInfo; status = data.checkState;break;
                case 'roadsign' : functor = makeRoadInfo;  status = data.lastCheckState;break;
                case 'areasign': functor = makeLocalInfo; status = data.lastCheckState;break;
                case 'basenumsign': functor = makePointInfo; status = data.lastCheckState;break;
            }
            $('#detailview_memo').val(data.checkComment);
            if (util.isEmpty(status))
                status = '01';

            checker = $('input:radio[name="facStat"]:input[value='+status+']');
            checker.prop("checked", true);
          //  checker.checked = true;


            functor(data);
            facilityOrg = getProperties();
            util.dismissProgress();

         },function(context,xhr,error) {
            console.log("갱신실패"+ error+'   '+ xhr);
            navigator.notification.alert('시설물 정보를 가져오지 못하였습니다', function (){
                                            util.goBack();
                                            },'시설물 정보 조회', '확인');


            util.dismissProgress();
        }
    );
}


$( document ).on("pagecreate",pages.detailview.div,  function() {
   // application.scaleContentToDevice(this);

    $('#detail_images').flexslider({
        animation: "slide",
        animationLoop:false,
        controlNav:false,   // pagination off
        slideshow:false,    // slide timer off
        directionNav:false, //disable arrow navigation
        start: function(slider){
            $('body').removeClass('loading');
        }
    });

    util.registLimitText('#detailview_memo',memoMaxLength);
});

$( document ).on("pagebeforeshow",pages.detailview.div,  function(event,data) {
    var context = application.context;
    if (util.isEmpty(context))
        return;

    application.context = {};
    var attr = {
        category : context.categoryid,
        sn : context.sn,
        sigcd : application.info.sigCd,
        title : context.title
    };
    buildContent(attr);
});

$( document ).on("pageshow",pages.detailview.div,  function() {
    var slider = $('#detail_images').data('flexslider');
    slider.resize();

    var lineheight = $('#detailview_memo').css('line-height');
    var editTop = $('#detailview_memo').offset().top;
    var footerHeight = $('#detailview_footer').height();
    $('#detailview_memo').attr('rows', (($(window).height() - footerHeight)  - editTop)/parseInt(lineheight));

    //detail property
    $('#detailview_property_detail').css('height', $(window).height() - $('#detail_images_container').offset().top );
    $('#detailview_property_detail').css('top', $(window).height());

});

$(document).on('click','#detailview_property .detail', function(event){
    $('#detailview_property_detail').removeClass('display-none');
    $("#detailview_property_detail").animate({top:   $('#detail_images_container').offset().top}, 200);
});

$(document).on('click','#detailview_property_btn', function(event){
    $("#detailview_property_detail").animate({top:  $(window).height()}, 200, function(){
        $('#detailview_property_detail').addClass('display-none');
    });
});

$(document).on('click','#detail_images .fa-trash', function(event){

    var slider = $('#detail_images').data('flexslider');


    navigator.notification.confirm('현재 사진을 삭제하시겠습니까? ',function (index) {
        if (index == 2)
        {
            slider.removeSlide(slider.currentSlide);
            if (slider.count == 0){
                var obj = "<li  data-id='-1'>"+
                          "<img style='height: 220px; width: 100%; object-fit: contain' src='./images/no_image.jpg'/></li>"  ;
                slider.addSlide(obj);
            }
            facilityOrg.hasNewImage = true;
        }
    }, "사진 삭제", "취 소,삭 제");
});



$( document ).on("click","#detailview_footer a.accept_btn", function(event){
    event.preventDefault();

    var facilityCur = getProperties();
    if (util.isEmpty(facilityCur.status))
    {
        util.toast('시설물 상태 정보 입력은 필수입니다.');
        return;
    }
    if (checkModified(facilityCur) == true)
    {
        var param = $.extend({},{
                                svcNm :  (  $('#detailview_page').data('category') == 'buildsign' ? 'uSPBD' : 'uSPGF' ),
                                sn : $('#detailview_page').data('sn'),
                                sigCd : $('#detailview_page').data('sigcd'),
                                checkState : facilityCur.status,
                                checkType : '01',
                                checkComment: facilityCur.memo,
                                checkUserNm:application.info.opeNm,
                                checkDate : util.getToday(),
                                workId : application.info.opeId,//,,
                                files : facilityCur.images[0].base64.length == 0 ? []
                                            : ( (facilityCur.hasNewImage || facilityOrg.hasNewImage) ? facilityCur.images : null )
                               // images : facilityCur.images
                            },
                            facilityCur.attrs);
        updateWork(
            param
            ,
            function(){
                util.toast('변경사항이 적용되었습니다');
                var attr = {
                        category : $('#detailview_page').data('category'),
                        sn : $('#detailview_page').data('sn'),
                        sigcd : $('#detailview_page').data('sigcd'),
                        title : $('#detailview_page').data('title')
                    };


                var imageElems = $("#detail_images .slides").find("li"); //.find( " li[data-id='-1000']");

                for (var index = 0 ; index < imageElems.length; index++ )
                {
                    var elem = $(imageElems[index]);
                    var id = elem.data('id');
                    if (id != '-1' &&  util.isEmpty(elem.data('name')) )
                    {
                        var time = elem.data('time');
                        name = time + $('#detailview_page').data('title' ) +'.jpg';
                        elem.data('name',name);
                    }

                }


                facilityOrg = getProperties();
         //       buildContent(attr );
            });
    }
    else {
        util.toast('변경된 항목이 없습니다');
    }
});


$( document ).on("click","#detail_images .slides li img", function(event){
    event.preventDefault();
//   util.slide_page('left', pages.imageviewer,{ imagesrc : $(this).attr('src')   });
});

$(document).on('click','#detail_addimage', function(event) {

    var slider = $('#detail_images').data('flexslider');
    var maxPics = 2;
    if (slider.count >= maxPics) {
        navigator.notification.alert('시설물 정보 사진등록은 '+ maxPics + '개까지 입니다.', function (){ },'사진 추가', '확 인');
    }
    else
    {
        util.addPictureFromCamera('#detail_images');
    }
});

$(document).on("focus","#detailview_memo, #detailview_attr,#detailview_attr2", function(){
    editPosTop = $('#detailview_contents').position().top;
    editPosHeight = $('#detailview_contents').height();
    var top = $('.titleheader').outerHeight() + $('#bbs_page>.subtitleheader').outerHeight();

    $('#detailview_contents').css('top',top + 'px');

    $('#detail_images_container').addClass('display-none');
    $('#detail_addimage').addClass('display-none');
    $('#detailview_footer').addClass('display-none');
  //  $('#detailview_property').addClass('display-none');
    $('#detailview_property >div.detail').addClass('display-none');

    $('#detailview_keypad_opt').removeClass('display-none');
});

$(document).on("focusout","#detailview_memo,  #detailview_attr,#detailview_attr2", function(){
    var editBottom = editPosTop + $('#detailview_contents').height();
    $('#detailview_contents').css('top',editPosTop + 'px');

    $('#detail_images_container').removeClass('display-none');
    $('#detail_addimage').removeClass('display-none');
    $('#detailview_footer').removeClass('display-none');
 //   $('#detailview_property').removeClass('display-none');
    $('#detailview_property >div.detail').removeClass('display-none');

    $('#detailview_keypad_opt').addClass('display-none');

    var memo = $('#detailview_memo').val();
    if (memo.length > memoMaxLength)
    {
        $('#detailview_memo').val(memo.substr(0,memoMaxLength));
    }
});

function makeBuildInfo(data)
{
    //title
    $('#detailview_title').text(  '(건물) ' + $('#detailview_page').data('title' ) );
    //유형
    $('#detailview_property > .value').text(data.buldNmtSeLbl);

    var infolist = [
          {key:'설치일자',value:data.instDate},
          {key:'규 격',value:data.buldNmtCdLbl},
          {key:'형 태',value:data.buldNmtTypeLbl},
          {key:'재 질',value:data.buldNmtMaterialLbl},
          {key:'용 도',value:data.buldNmtPurposeLbl},
          {key:'단 가',value:data.buldNmtUnitPrice},
          {key:'제작형식',value:data.buldNmtMnfCdLbl},
          {key:'망실여부',value:data.buldNmtLossLbl},
          {key:'작업자 ID',value:data.workId},
          {key:'작업일시',value:data.workDate},
          {key:'조명여부',value:data.lightCdLbl},
          {key:'생성일자',value:data.registerDate}
      ];
    makeDetailInfo(infolist);
}

function makeFacInfo(data)
{
    $('#frontStartBaseMasterNo').val(data.frontStartBaseMasterNo);
    $('#frontStartBaseSlaveNo').val(data.frontStartBaseSlaveNo);
    $('#frontEndBaseMasterNo').val(data.frontEndBaseMasterNo);
    $('#frontEndBaseSlaveNo').val(data.frontEndBaseSlaveNo);
    $('#bdrcllbl').text(data.bdrclAt == '0' ? '단면' : '양면');

    var infolist = [
          {key:'설치지점',value:data.instSpotCdLbl ,   property:'instSpotCd', dropdown: ['시작지점','중간지점','끝지점'], dropdownAttr:['01','02','03']},
          {key:'설치/재설치 여부',value:data.isLgnYnLbl, property:'isLgnYn', dropdown: ['설치','재설치'], dropdownAttr:['01','02']},
          {key:'설치지점 설명',value:data.instSpotDesc, property:'instSpotDesc', editable:true},
          {key:'한글 도로명', value:data.frontKoreanRoadNm, property:'frontKoreanRoadNm', editable:true},
          {key:'로마자 도로명',value:data.frontRomeRoadNm, property:'frontRomeRoadNm', editable:true},
          {key:'안내시설형식',value:data.gdftyFormLbl,  property:'gdftyForm', dropdown: ['표준형','비표준형'], dropdownAttr:['01','02']},
          {key:'안내시설방향', value:data.plqDirectionLbl,       property:'plqDirection' , dropdown:['한 방향용','양 방향용', '앞쪽 방향용'], dropdownAttr:['00100','00200','00300']}
          //,
     //     {key:'양면여부',value:data.bdrclAtLbl,       property:'bdrclAt' , dropdown:['예','아니오'], dropdownAttr:['01','02']}
          /*
          ,

          {key:'설치일자',value:data.instDate},
          {key:'최종점검일자',value:data.lastCheckDate},
          {key:'설치유형',value:data.instSeLbl},
          {key:'규 격',value:data.gdftyWide + ' x ' + data.gdftyVertical + ' x ' + data.gdftyThickness },
          {key:'재 질',value:data.gdftyQualityLbl},
          {key:'사용대상',value:data.useTargetLbl},
          {key:'제작형식',value:data.gdftyMnfLbl},
          {key:'단 가',value:data.gdftyUnitPrice},
          {key:'설치기준',value:data.instCrossCdLbl},
          {key:'설치기관',value:data.instInsLbl},
          {key:'설치기관 참고',value:data.instInstDesc},
          {key:'관리기관',value:data.manageInsLbl},
          {key:'관리기관 참고',value:data.manageInstDesc},
          {key:'제2외국어 사용언어 1',value:data.scfggUla1},
          {key:'제2외국어 사용언어 2',value:data.scfggUla2},
          {key:'망실여부',value:data.lossAtLbl},
          {key:'관리번호',value:data.ftyManageNo},
          {key:'입력방법',value:data.inputMethodLbl},
          {key:'조명여부',value:data.lightCdLbl},
          {key:'생성일자',value:data.registerDate}
          //*/
      ];
    makeDetailInfo(infolist);
}

function makeRoadInfo(data)
{
    //title : 도로명판
    $('#detailview_title').text(  '(도로) ' + $('#detailview_page').data('title' ) );
    //유형
    //$('#detailview_property > .value > input').val(data.instSeLbl);



    //text(data.instSeLbl);
    makeFacInfo(data);
}
function makeLocalInfo(data)
{
    //title : 지역안내판
    $('#detailview_title').text(  '(지역) ' + $('#detailview_page').data('title' ) );
    //유형
    //$('#detailview_property > .value > input').val(data.instSeLbl);//text(data.instSeLbl);
    makeFacInfo(data);
}
function makePointInfo(data)
{
    //title : 기초번호판
    $('#detailview_title').text(  '(기초) ' + $('#detailview_page').data('title' ) );
    //유형
    //$('#detailview_property > .value > input').val(data.instSeLbl);//text(data.instSeLbl);
    makeFacInfo(data);
}
function createInput(item){
    return  '<input data-property="'+ item.property +'" name="detailattr" style="width:100%" type="text"   value="' + item.value + '">';
}

function createDropDown( items){
    var selectname = items.value;
    var options = '';
    var vals = items.vals;
    var attrs = items.attrs;
    for (var i = 0 ; i < vals.length ; i++)
    {
        var selected = "";
        if (selectname == vals[i])
            selected = "selected";
        options += '<option value="' + attrs[i] +  '" '+ selected +'>' + vals[i] + "</option>";
    }

    var elem = '<div>' +
               '<select data-property="'+ items.property +'" name="detailattr" data-native-menu="false">'+
                    options +
               '</select></div>';
    return elem;
}

function makeDetailInfo(infolist){

    $('#detailview_property_detail > ul > li').remove();
    if (util.isEmpty(infolist) === false)
    {
        var childs =[];
        for (var index = 0 ; index < infolist.length; index++)
        {
            val = infolist[index].value;
            if (val == null || val == undefined)
              val = '';

            var fieldContent = '<div>' + val + '</div>';
            if (infolist[index].dropdown) {
                fieldContent = createDropDown( {value:val, property:infolist[index].property, vals: infolist[index].dropdown, attrs:infolist[index].dropdownAttr});
            } else if (infolist[index].editable) {
                fieldContent = createInput({value:val, property:infolist[index].property});
            }
            childs.push('<li><div>' + infolist[index].key + '</div>' + fieldContent +'</li>');
        }
        $('#detailview_property_detail > ul').append(childs);
    }
}

function updateWork(data,callback){
    util.showProgress();

    var urldata = URLs.postURL(URLs.updateFacilityInfo,data);

    util.postAJAX('',urldata)
        .then( function(context,rcode,results) {

            if (results.response.status == 1){
                callback();
                util.dismissProgress();
            }
            else {
            //TODO 응답코드에 따른 에러 표현
                navigator.notification.alert('시설물 정보를 변경하지 못하였습니다', function (){ },'시설물 상태 변경', '확인');
                util.dismissProgress();
            }
         },function(context,xhr,error) {

                navigator.notification.alert('시설물 정보를 변경하지 못하였습니다', function (){ },'시설물 상태 변경', '확인');
                util.dismissProgress();
         });
}


function getProperties(){

    var properties = {
        status : '',
        memo: '',
        images:[],
        hasNewImage :false,
        attrs:{}
    };
    properties.status = $('input:radio[name="facStat"]:checked').val();
    if (properties.status == undefined)
        properties.status = '';
    properties.memo = $('#detailview_memo').val();

    var imageElems = $("#detail_images .slides").find("li"); //.find( " li[data-id='-1000']");

    for (var index = 0 ; index < imageElems.length; index++ )
    {
        var elem = $(imageElems[index]);
        var id = elem.data('id');
        if (id != '-1')
        {
            var time = elem.data('time');
            var name = elem.data('name');

            if (util.isEmpty(name)){
                name = time + $('#detailview_page').data('title' ) +'.jpg';//'rn' + 'bobn' + 'bubn' +'.jpg';
                properties.hasNewImage = true;
           //     elem.data('name',name);
            }

            var src = elem.children('img').attr('src');
            src = src.substring( src.indexOf('base64,') + 'base64,'.length);

            properties.images.push({ name:name, base64:src });
        }
        else {
            properties.images.push({ name:'emptyImage', base64:'' });
        }

    }

    var inputs = $( "#detailview_property_detail input[name*='detailattr']" );
    var selects = $( "#detailview_property_detail select[name*='detailattr']" );
    var attrs = {};
    for (var idx = 0 ; idx < inputs.length; idx++)
    {
        attrs[ $(inputs[idx]).data('property') ] = $(inputs[idx]).val();
    }

    for (var idx = 0 ; idx < selects.length; idx++)
    {
        attrs[ $(selects[idx]).data('property') ] = $(selects[idx]).val();
    }
    attrs['frontStartBaseMasterNo'] =  $('#frontStartBaseMasterNo').val();
    attrs['frontStartBaseSlaveNo'] =  $('#frontStartBaseSlaveNo').val();
    attrs['frontEndBaseMasterNo'] =  $('#frontEndBaseMasterNo').val();
    attrs['frontEndBaseSlaveNo'] =  $('#frontEndBaseSlaveNo').val();
    properties['attrs'] = attrs;

    for (var a in properties){
        console.log(properties[a]);
    }
    return properties;
}

function checkModified(obj)
{
    return facilityOrg.status !== obj.status
            || facilityOrg.memo !== obj.memo
        //    || $("#detail_images .slides").find( " li[data-id='-1000']").length > 0
            || function(){
                var ofname = '';
                var nfname = '';
                for (var i = 0 ; i < facilityOrg.images.length; i++)
                {
                    ofname += facilityOrg.images[i].name;
                }
                for (var i = 0 ; i < obj.images.length; i++)
                {
                    nfname += obj.images[i].name;
                }
                return ofname !== nfname;

            }()
            || function(){
                for (var key in facilityOrg.attrs){
                    console.log(facilityOrg.attrs[key] +'    '+ obj.attrs[key]);
                    if ( facilityOrg.attrs[key] !== obj.attrs[key] )
                        return true;
                }
                    return false;

            }();
}

});