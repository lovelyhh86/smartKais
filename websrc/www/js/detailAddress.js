
$(function(){

    // var boardScroll;
    // var itemSize = 15;

    //목록페이지
    // $( document ).on("pagecreate",pages.detailAddressListPage.div,  function() {
    
    // });

    // $( document ).on("pagebeforeshow",pages.detailAddressListPage.div,  function(event,data) {
    //     detailAddressContent();
    // });

    // $( document ).on("pageshow",pages.detailAddressListPage.div,  function() {

    // });

    //기초조사 페이지
    $( document ).on("pagebeforeshow",pages.baseResearchPage.div,  function(event,data) {
        var context = app.context;
        
        if (util.isEmpty(context))
        return;

        app.context = {};

        $("#baseReserch_page").data('sn',context.sn);
        $("#baseReserch_page").data('sigCd',context.sigCd);
        
    });


    $( document ).on("click",".fa-search", function()
    {
        if ($('#searchoverlay').hasClass('overlay-hidden') == false)
        {
            $('#searchinput').blur();
            util.hiddenSearchPanel();
            console.log('search');

            var scroll = $('#boardlistScroll').data('infinitescroll');
            localStorage["searchText"] = $('#searchinput').val();
            searchAddress();
        }
        else
            $('#searchoverlay').removeClass('overlay-hidden');
    });

    $( document ).on("click","#detailAddressDiv .addressitem", function()
    {
        var page = pages.detailaddress;
        util.slide_page('left', page,{ sn : $(this).data('sn') ,sig_cd: $(this).data('sigcd')});
    });

    

});

//상세주소 부여신청 민원목록 조회
function detailAddressContent(){
    var param = {
        sigCd : app.info.sigCd
    } ;
    
    var url = URLs.postURL(URLs.addresslistlink, param);

    util.postAJAX("", url)
    .then(function (context, rcode, results) {
        var data = results.data;
        if (rcode != 0 || util.isEmpty(data) === true) {
            navigator.notification.alert('상세주소 부여신청 민원목록이 없습니다.', function () {
                util.goBack();
            }, '상세주소 부여신청 민원목록 조회', '확인');
            util.dismissProgress();
            return;
        } else {
            for(var i in data) {
                var rowHtml = '<tr class="adrdcRow" onclick=\"{0}\"><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td><td>{7}</td></tr>';
                var d = data[i];
                
                $("#detailAddressTable > tbody:last").append(
                    rowHtml.format("goDetail('"+d.requestSn+"')", d.pos, d.buldLabel, d.opeSttCdLbl, d.reqstDe, d.competDe, d.reqstSeLbl, d.reqManNm));
            }
        }
        
        util.dismissProgress();
    }, function(context,xhr,error) {
                console.log("갱신실패"+ error+'   '+ xhr);

                navigator.notification.alert('기초조사 목록 요청을 실패하였습니다. 잠시 후 다시 시도하십시오.',
                        function (){
                            util.goBack();
                    },'기초조사', '확인');
                    util.dismissProgress();
            });
        
}

function goDetail(sn){
    // var page = pages.baseResearchPage;
    // util.slide_page('left', page,{ sn : sn ,sigCd: app.info.sigCd});
    var url = pages.detail_adrdc;
    $('#detailView').load(url.link(), function() {
        var params;
        var sigCd = app.info.sigCd;
        
        params={
            sn : sn
            ,sigCd : sigCd
        }

        util.showProgress();
        var link = URLs.addresslink;
        var url = URLs.postURL(link, params);
        util.postAJAX({}, url).then(
            function (context, rCode, results) {
                //통신오류처리
                if (rCode != 0 || results.response.status < 0) {
                    navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                    util.dismissProgress();
                    return;
                }

                var data = results.data;

                if(data == null){
                    navigator.notification.alert(msg.noItem, '', '알림', '확인');
                    util.dismissProgress();
                    return;
                }

                $("#sn").val(sn);
                //사진건수
                $(".infoHeader .photo .photoNum").html(data.cntFiles);
                //도로명
                var title = "<span class='label'>{0}<span>".format(data.buldLabel);
                $(".title").append(title);
                
                //작업상태
                // $("#opeSttCd").val(data.opeSttCd);
                //작업상태라벨
                // $("#opeSttCdLbl").html(data.opeSttCdLbl);
                //완료일자 - 접수일자
                // $("#competReqst").val(data.competReqst);
                //완료일자
                // $("#competDe").html(data.competDe);

                //접수일자
                $("#reqstDe").html(data.reqstDe);
                //접수번호
                $("#reqstSn").html(sn);
                //기초조사일자
                $("#bsiExmDe").html(data.bsiExmDe);
                //신청인
                $("#reqManNm").html(data.reqManNm);
                //신청구분
                var reqstSe = data.reqstSe;
                $("#reqstSe").val(reqstSe);
                //신청구분라벨
                $("#reqstSeLbl").html(data.reqstSeLbl);
                //주소
                $("#buld_label").html(data.buldLabel);
                //직급
                $("#clsf").val(data.clsf);
                //조사자
                $("#opeNm").html(app.info.opeNm);
                
                //기초조사특이사항
                $("#docExmSpc").val(data.docExmSpc);

                //위치조회용
                $("#sigCd").val(data.sigCd);
                $("#emdCd").val(data.emdCd);
                $("#rnCd").val(data.rnCd);
                $("#buldMnnm").val(data.buldMnnm);
                $("#buldSlno").val(data.buldSlno);
                $("#buldSeCd").val(data.buldSeCd);

                //기초조사결과
                var der = data.docExmRes;
                if(der != null){
                    var derList = der.split("|");
                    
                    var radioLength = $(':radio[name*="radio-choice-h-"]').length / 3;
                    
                    for(var i = 0 ; i < radioLength; i ++){
                        $(":radio[name='radio-choice-h-"+i+"']:input[value='" + derList[i] + "']").attr("checked", true);
                    }

                }

                //직권처리시 4 번 5번 항목은 해당없음 처리
                if(reqstSe == "64" || reqstSe == "68" || reqstSe == "69"){
                    $(":radio[name='radio-choice-h-3']:input[value='N']").attr("checked", true);
                    $(":radio[name='radio-choice-h-4']:input[value='N']").attr("checked", true);
                    $(":radio[name='radio-choice-h-3']").attr("disabled", true);
                    $(":radio[name='radio-choice-h-4']").attr("disabled", true);
                }

                //사진이벤트
                MapUtil.handler.photoToggleHandler(DATA_TYPE.ADRDC,sn);
                MapUtil.handler.takePhotoHandler();
                MapUtil.handler.delPhotoHandler();
                MapUtil.handler.dataPopupCloserHandler();
                
    
                util.dismissProgress();
            }
        );
    })
    
}

function insertBaseResearch(){
    var params;

    var docExmRes = "";
    var radioLength = $(':radio[name|="radio-choice-h"]:checked').length;

    if(radioLength != 13){
        navigator.notification.alert(msg.selectAdrdc,'','알림', '확인');    
        return;
    }

    var reqstSe = $('#reqstSe').val();
    //완료날짜 - 접수일자
    var competReqst = $("#competReqst").val();

    var msgType = msg.completeAdrdc;
    //직원처리이고 최초등록시(완료날짜-접수일자 = 14) 메세지 변경
    if(competReqst == "14" && (reqstSe == "64" || reqstSe == "68" || reqstSe == "69")){
        msgType = msg.completeAuthAdrdc;
    }

    navigator.notification.confirm(msgType, function(btnindex){
        if(btnindex == 1){
            for(var i = 0 ; i < radioLength; i ++){
                var values = $(":radio[name='radio-choice-h-"+i+"']:checked").val();
                docExmRes += values;
                if(i < radioLength -1){
                    docExmRes += "|";
                }
            }
        
            var sn = $('#sn').val();
            var docExmSpc = $("#docExmSpc").val();
            var clsf = $("#clsf").val();
        
            params ={
                    sn : sn
                    ,reqstSe : reqstSe
                    ,clsf : clsf
                    ,sigCd : app.info.sigCd
                    ,workId : app.info.opeId
                    ,opeNm  : app.info.opeNm
                    ,docExmRes : docExmRes
                    ,docExmSpc : docExmSpc
                    }
        
            util.showProgress();
            var link = URLs.insertBaseResearch;
            var url = URLs.postURL(link, params);
            util.postAJAX({}, url).then(
                function (context, rCode, results) {
                    //통신오류처리
                    if (rCode != 0 || results.response.status < 0) {
                        navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                        util.dismissProgress();
                        return;
                    }
        
                    //민원목록화면으로 이동
                    // util.gotoTask('address');
        
                    
        
                    MapUtil.openDetail(DATA_TYPE.ADRDC);
        
                    util.toast('기초조사 내용이 적용되었습니다.');
                    util.dismissProgress();
                }
            );
        }
    }, "알림", ["확인","취소"]);
    
}

function getRadioValues(){
    var docExmRes = "";
    var radioLength = $(':radio[name*="radio-choice-h-"]').length / 3;
    
    for(var i = 0 ; i < radioLength; i ++){
        var values = $(":radio[name='radio-choice-h-"+i+"']:checked").val();
        docExmRes += values;
        if(i < radioLength -1){
            docExmRes += "|";
        }
    }
    console.log(docExmRes);
    return docExmRes;
}

function controlRadioAll(){

    var value = $(":radio[name='radio-all-choice']:checked").val();

    var radioLength = $(':radio[name*="radio-choice-h-"]').length / 3;

    

    for(var i = 0 ; i < radioLength; i ++){
        var reqstSe = $('#reqstSe').val();
        if((reqstSe == "64" || reqstSe == "68" || reqstSe == "69") && (i == 3 || i == 4)){
            continue;
        }
        //체크 초기화
        $(":radio[name='radio-choice-h-"+i+"']").prop("checked",false);

        $(":radio[name='radio-choice-h-"+i+"']:input[value='" + value + "']").prop("checked", true);
    }
}

function txtMaxlength(id, size) {
    var targetText = $("#"+id);
    var textLength = targetText.val().length;
    
    
    if (textLength > size) {
        navigator.notification.alert("글자수는 " + size + "자 제한입니다.", function () {
            targetText.val(targetText.val().substring(0, size));
            // targetText.focus();
        }, '글자수 제한', '확인');
      
    }
}

var isPopState = "on";
function toggleDetailView(){
    
    if(isPopState == "on"){
        $(".detailView").css("height","88px");
        $("#photoDialog").hide();
        $(".ui-popup-container.slideup.in.ui-popup-active").css("height","5%");
        isPopState = "off";
    }else{
        $(".detailView").css("height","830px");
        $("#photoDialog").show();
        $(".ui-popup-container.slideup.in.ui-popup-active").css("height","60%");
        isPopState = "on";
    }
}

function getLocationByFeature(layerNm, searchList){

    var andTag = "<ogc:Filter><ogc:AND>{0}</ogc:AND></ogc:Filter>";
    var isEqualToTag = "<ogc:PropertyIsEqualTo>{0}</ogc:PropertyIsEqualTo>";
    var propertyLiteral = "<ogc:PropertyName>{0}</ogc:PropertyName><ogc:Literal>{1}</ogc:Literal>";

    var fileter = "";
    var searchText = "";
    
    $.map(searchList,function(value,index){
        //index = 키 , value = 값
        searchText += isEqualToTag.format(propertyLiteral.format(index , value));
    });

    fileter = andTag.format(searchText);


    var param = {
        SERVICE: 'WFS',
        VERSION: '1.1.0',
        REQUEST: 'GetFeature',
        FILTER: fileter,
        srsName: serviceProjection.getCode(),
        typeName: layerNm
    }

    var urldata = URLs.postURL(URLs.mapServiceLink, param);

    util.showProgress();
    util.postAJAX('', urldata, true)
        .then(function(context, rCode, results) {

            //통신오류처리
            if (rCode != 0) {
                navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                util.dismissProgress();
                return;
            }

            var features = new ol.format.WFS().readFeatures(results, { featureProjection: baseProjection.getCode(), dataProjection: sourceProjection.getCode() });
            //모든점
            // var point = features[0].getGeometry().getCoordinates();
            var point = features[0].getGeometry().getInteriorPoint();

            map.getView().setCenter(point.getCoordinates());

            toggleDetailView();

            util.dismissProgress();

        },function(context, xhr, error) {
            console.log("조회 error >> " + error + '   ' + xhr);
            util.dismissProgress();
        });
}

function getAdrdcLocation(){
    
    var layerNm = "tlv_spbd_buld";

    var sigCd = $("#sigCd").val();
    var emdCd = $("#emdCd").val();
    var rnCd  = $("#rnCd").val();
    var buldMnnm = $("#buldMnnm").val();
    var buldSlno = $("#buldSlno").val();
    var buldSeCd = $("#buldSeCd").val();

    var searchList = {sig_cd: sigCd, emd_cd: emdCd, rn_cd: rnCd, buld_mnnm: buldMnnm, buld_slno: buldSlno, buld_se_cd:buldSeCd}

    getLocationByFeature(layerNm, searchList);
}