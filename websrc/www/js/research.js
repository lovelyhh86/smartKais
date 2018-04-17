
$(function(){

    // var boardScroll;
    // var itemSize = 15;

    //목록페이지
    // $(document).on("pagecreate",pages.detail_researchList.div,  function() {
        
        
    // });

    // $( document ).on("pagebeforeshow",pages.detailAddressListPage.div,  function(event,data) {
    //     detailAddressContent();
    // });

    // $( document ).on("pageshow",pages.detail_researchList.div,  function() {
        
    // });

    // $( document ).on("pagebeforeshow",pages.baseResearchPage.div,  function(event,data) {
    //     var context = app.context;
        
    //     if (util.isEmpty(context))
    //     return;

    //     app.context = {};

    //     $("#baseReserch_page").data('sn',context.sn);
    //     $("#baseReserch_page").data('sigCd',context.sigCd);
        
    // });


    // $( document ).on("click",".fa-search", function()
    // {
    //     if ($('#searchoverlay').hasClass('overlay-hidden') == false)
    //     {
    //         $('#searchinput').blur();
    //         util.hiddenSearchPanel();
    //         console.log('search');

    //         var scroll = $('#boardlistScroll').data('infinitescroll');
    //         localStorage["searchText"] = $('#searchinput').val();
    //         searchAddress();
    //     }
    //     else
    //         $('#searchoverlay').removeClass('overlay-hidden');
    // });

    // $( document ).on("click","#detailAddressDiv .addressitem", function()
    // {
    //     var page = pages.detailaddress;
    //     util.slide_page('left', page,{ sn : $(this).data('sn') ,sig_cd: $(this).data('sigcd')});
    // });

    

});

//점검대상 조회
function selectResearchContent(trgGbn){
    util.showProgress();
    
    //조사자일련번호
    var rcrSn = app.info.rcrSn;

    if(trgGbn == null){
        var searchOptTrgGbn = $("#searchOptTrgGbn").val() == "" ? null : $("#searchOptTrgGbn").val();
    }else{
        var searchOptTrgGbn = trgGbn;
    }
    
    var searchOptRcSttCd = $("#searchOptRcSttCd").val() == "" ? null : $("#searchOptRcSttCd").val();
    var searchOptDelSttCd = $("#searchOptDelSttCd").val() == "" ? null : $("#searchOptDelSttCd").val();

    var param = {
        sigCd : app.info.sigCd
        ,rcrSn : rcrSn
        ,trgGbn : searchOptTrgGbn
        ,rcSttCd : searchOptRcSttCd
        ,delStateCd : searchOptDelSttCd
    } ;

    var url = URLs.postURL(URLs.researchListLink, param);

    util.postAJAX("", url)
    .then(function (context, rcode, results) {
        
        $("#myResearchTable > tbody").empty();
        $("#rowSize").empty();
        var data = results.data;
        
        if (rcode != 0 || util.isEmpty(data) === true) {
            var rowHtml = '<tr class=""><td colspan="7">검색된 목록이 없습니다.</td></tr>';
            $("#myResearchTable > tbody:last").append(rowHtml);
            $("#rowSize").append('0');
            util.dismissProgress();
            return;
        } else {
            for(var i in data) {

                var rowHtml = '<tr id={0}><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td><td>{7}{8}</td></tr>';
                var d = data[i];

                if(d.trgGbn == "02"){
                    //명판내용
                    var korRnLbl = "{0} {1}{2}".format(
                        d.rnCdLbl,
                        d.buldMnnm,
                        d.buldSlno == "0"? "" : "-" + d.buldSlno
                    );

                    //건물명
                    var posBulNm = d.posBulNm == null ? '-' : d.posBulNm;

                    var researchOkBtn = "<button class='ui-btn ui-corner-all ui-shadow btnPossible cell80' onclick='{0}' {1}>정상</button>";
                    
                    if(d.delStateCd == '01' && d.rcSttCd == null){
                    // if(d.rcSttCd != null){//임시로 열어둠
                        researchOkBtn = researchOkBtn.format("insertResearchForList("+i+")","");
                    }else{
                        researchOkBtn = researchOkBtn.format("impossibleAlert()","disabled");
                    }

                    var fixDetailBtn = "<button class='ui-btn ui-corner-all ui-shadow btnPossible cell80' onclick='goResearchDetail("+i+")'>정비</button>";
                    var locBtn = "<img onclick='getResearchLocation("+i+")' src='./image/iconNumber.png'></img>";

                    $("#myResearchTable > tbody:last").append(
                        rowHtml.format(
                            "row"+i
                            ,locBtn
                            ,d.trgGbnLbl
                            ,posBulNm
                            ,korRnLbl
                            ,d.delStateCdLbl
                            ,d.rcSttCdLbl
                            // ,researchOkBtn
                            ,""
                            ,fixDetailBtn
                            ));
                            
                    $("#row"+i).data("rnCd",d.rnCd);
                    $("#row"+i).data("emdCd",d.emdCd);
                    $("#row"+i).data("buldMnnm",d.buldMnnm);
                    $("#row"+i).data("buldSlno",d.buldSlno);
                    $("#row"+i).data("buldSeCd",d.buldSeCd);
                        
                }else{
                    //설치 도로명
                    var rnLbl = "{0} {1}{2}".format(
                        d.bsisRnLbl,
                        d.bsisMnnm,
                        d.bsisSlno == "0"? "" : "-" + d.bsisSlno
                    );
                    //시설물구분
                    var rdGdftySe = d.rdGdftySe;
                    //명판내용
                    var korRnLbl = createRnNm(rdGdftySe,d);
                    
                    var researchOkBtn = "<button class='ui-btn ui-corner-all ui-shadow btnPossible cell80' onclick='{0}' {1}>정상</button>";
                    
                    if(d.delStateCd == '01' && d.rcSttCd == null){
                    // if(d.rcSttCd != null){//임시로 열어둠
                        researchOkBtn = researchOkBtn.format("insertResearchForList("+i+")","");
                    }else{
                        researchOkBtn = researchOkBtn.format("impossibleAlert()","disabled");
                    }

                    var fixDetailBtn = "<button class='ui-btn ui-corner-all ui-shadow btnPossible cell80' onclick='goResearchDetail("+i+")'>정비</button>";
                    var locBtn = "<button class='' onclick='getResearchLocation("+i+")'><img src='image/icon_curr.png'></img></button>";

                    if(rdGdftySe == '110'|| rdGdftySe == "210" || rdGdftySe == "310"){
                    // if(rdGdftySe == '110'){
                        locBtn = "<img onclick='getResearchLocation("+i+")' src='./img/icon_legend01.png'></img>";
                    }else if(rdGdftySe == '510'){
                        locBtn = "<img onclick='getResearchLocation("+i+")' src='./img/icon_legend03.png'></img>";
                    }else if(rdGdftySe == '610'){
                        locBtn = "<img onclick='getResearchLocation("+i+")' src='./img/icon_legend02.png'></img>";
                    }else{
                        locBtn = "<img onclick='getResearchLocation("+i+")' src='./image/iconNumber.png'></img>";
                    }
                    
                    
                    // var selectFormat = "<select id='sel{0}' onchange='insertResearchForList("+d.rdGdftySn+","+d.sigCd+")'>{1}</select>";
                    // var optionFormat = "<option value='{0}'>{1}</option>";

                    // var optionTxt = "<option disabled selected='selected' value=''>선택</option>"; 
                    // var colume = "RC_STT_CD";
                    // var codeList = app.codeMaster[CODE_GROUP[colume]];
                    
                    // for(var c in codeList){
                    //     if(c != "GroupNm"){
                    //         optionTxt += optionFormat.format(c,codeList[c]);
                    //     }
                    // }

                    // var researchSelect = selectFormat.format(i,optionTxt);
                    
                    $("#myResearchTable > tbody:last").append(
                        rowHtml.format(
                            "row"+i
                            ,locBtn
                            ,d.trgGbnLbl
                            ,rnLbl
                            ,korRnLbl
                            ,d.delStateCdLbl
                            ,d.rcSttCdLbl
                            // ,researchOkBtn
                            ,""
                            ,fixDetailBtn
                            ));
                            
                        $("#row"+i).data("rdGdftySe",rdGdftySe);
                    }

                    //사용 데이터 셋팅    
                    $("#row"+i).data("trgGbnLbl",d.trgGbnLbl);
                    $("#row"+i).data("korRnLbl",korRnLbl);
                    $("#row"+i).data("trgGbn",d.trgGbn);

                    $("#row"+i).data("plnYr",d.plnYr);
                    $("#row"+i).data("plnOdr",d.plnOdr);
                    $("#row"+i).data("sigCd",d.sigCd);
                    $("#row"+i).data("mtchSn",d.mtchSn);
                    $("#row"+i).data("trgSn",d.trgSn);
                    $("#row"+i).data("trgLocSn",d.trgLocSn);
                    $("#row"+i).data("trgGbn",d.trgGbn);
                }
                
            var size = $("#myResearchTable > tbody > tr").size();

            $("#rowSize").append(size);
            
        }
        
        util.dismissProgress();
    }, function(context,xhr,error) {
                console.log("갱신실패"+ error+'   '+ xhr);

                navigator.notification.alert('점검대상 목록 요청을 실패하였습니다. 잠시 후 다시 시도하십시오.',
                        function (){
                            util.goBack();
                    },'알림', '확인');
                    util.dismissProgress();
            });
        
}
//배정대상 상세보기
function goResearchDetail(i){
    var targetE = $("#row"+i);
    var rdGdftySe = targetE.data("rdGdftySe");
    //시설물 번호 전역변수
    trgSnGlobal = targetE.data("trgSn");
    
    var trgGbn = targetE.data("trgGbn");
    if(trgGbn == "02"){
        //시설물 번호 전역변수
        trgSnGlobal = targetE.data("trgLocSn");
    }else{
        
    }
    
    MapUtil.openDetail(trgGbn, null, rdGdftySe);
}
//상세정보 위치찾기
function getDetailLocation(){
    //대상일련번호
    var trgLocSn = $("#trgLocSn").val();
    //대상구분
    var trgGbn = $("#trgGbn").val();

    var layerNm = "tlv_spgf_loc_skm";
    var searchList = {rdftylc_sn: trgLocSn}

    if(trgGbn == "02"){
        layerNm = "tlv_spbd_buld_skm";

        var sigCd = $("#sigCd").val();
        var emdCd = $("#emdCd").val();
        var rnCd  = $("#rnCd").val();
        var buldMnnm = $("#buldMnnm").val() == "" ?$("#buldMnnm").html() : $("#buldMnnm").val();
        var buldSlno = $("#buldSlno").val() == "" ?$("#buldSlno").html() : $("#buldSlno").val();
        var buldSeCd = $("#buldSeCd").val() == "" ?$("#buldSeCd").html() : $("#buldSeCd").val();

        searchList = {sig_cd: sigCd, emd_cd: emdCd, rn_cd: rnCd, buld_mnnm: buldMnnm, buld_slno: buldSlno, buld_se_cd:buldSeCd}
    }

    getLocationByFeature(layerNm, searchList);
}
//배정대상 위치찾기
function getResearchLocation(i){

    var targetID = $("#row" + i);

    //대상일련번호
    var trgLocSn = targetID.data('trgLocSn');
    //대상구분
    var trgGbn = targetID.data('trgGbn');

    var layerNm = "tlv_spgf_loc_skm";
    var searchList = {rdftylc_sn: trgLocSn}

    if(trgGbn == "02"){
        layerNm = "tlv_spbd_buld_skm";

        var sigCd = targetID.data('sigCd');
        var emdCd = targetID.data('emdCd');
        var rnCd  = targetID.data('rnCd');
        var buldMnnm = targetID.data('buldMnnm');
        var buldSlno = targetID.data('buldSlno');
        var buldSeCd = targetID.data('buldSeCd');

        searchList = {sig_cd: sigCd, emd_cd: emdCd, rn_cd: rnCd, buld_mnnm: buldMnnm, buld_slno: buldSlno, buld_se_cd:buldSeCd}
    }
    
    getLocationByFeature(layerNm, searchList);
}

//리스트 점검상태 저장
function insertResearchForList(i){
    var targetID = $("#row" + i);

    var trgGbnLbl = targetID.data('trgGbnLbl');
    var korRnLbl = targetID.data('korRnLbl');

    var msgForm = "[{0}] {1}\n\n정상 상태로 점검하시겠습니까?";

    navigator.notification.confirm(msgForm.format(trgGbnLbl,korRnLbl), function(btnindex){

        if(btnindex == 1){
            // var targetID = $("#row" + i);

            //배정년도
            var plnYr = targetID.data('plnYr');
            //배정차수
            var plnOdr = targetID.data('plnOdr');
            //시군구
            var sigCd = targetID.data('sigCd');
            //배정일련번호
            var mtchSn = targetID.data('mtchSn');
            //대상일련번호
            var trgSn = targetID.data('trgSn');
            //대상위치일련번호
            var trgLocSn = targetID.data('trgLocSn');
            //대상구분
            var trgGbn = targetID.data('trgGbn');
            //점검상태(무조건 정상)
            var rcSttCd = '1000';
            
            //조사자일련번호
            var rcrSn = app.info.rcrSn;
            //작업자ID
            var workId = app.info.opeId;

            var sendParams = {
                plnYr : plnYr,
                plnOdr : plnOdr,
                sigCd : sigCd,
                mtchSn : mtchSn,
                trgSn : trgSn,
                trgLocSn : trgLocSn,
                trgGbn : trgGbn,
                rcSttCd : rcSttCd,
                rcrSn : rcrSn,
                workId : workId,
            };

            var link = URLs.insertResearchState;

            util.showProgress();
            var url = URLs.postURL(link, sendParams);
            util.postAJAX({}, url).then(
                function (context, rCode, results) {
                    //통신오류처리
                    if (rCode != 0 || results.response.status < 0) {
                        navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                        util.dismissProgress();
                        return;
                    }

                    util.toast(msg.successResearch);

                    selectResearchContent();

                    closePopupAndClearMap(trgGbn);

                    util.dismissProgress();

                },
                util.dismissProgress
            );
            
        }
    }, "알림", ["확인","취소"]);
}

//점검상태저장
function submitResearch(){
    //점검상태
    var rcSttCdOld = $("#rcSttCdOld").text();
    var rcSttCd = $("#rcSttCd_new").text();
    var rcSttCdSel = $("#rcSttCdSel").val();
    //점검결과
    var rcRsltOld = $("#rcRsltOld").text();
    var rcRslt = $("#rcRslt").val();

    //변경상태
    var isUpdtGbn = $("#isUpdtGbn").val();

    //점검상태가 없는 경우
    if(rcSttCdSel == "" || rcSttCdSel == null){
        navigator.notification.alert(msg.checkRcSttCd,'','알림','확인');
        return;
    }
    
    //정상점검이 아닌경우 사진 필수
    if(rcSttCdSel !="1000" && rcSttCd != "1000" && isUpdtGbn.indexOf("I") == -1){
        
        navigator.notification.confirm(msg.researchCheckPhoto, function(btnindex){

            if(btnindex == 1){
                $("#rcSttCd_new").text(rcSttCdSel);//재점검시 누락되는 점검값 떄문
                $(".photo").click();
            }
        }, "알림", ["확인","취소"]);

        return;
    }

    var photoNum = $(".infoHeader .photo .photoNum").html();
    var cntMphoto = $("#cntMphoto").text();
    var cntLphoto = $("#cntLphoto").text();

    //정상이지만 사진건수가 0건 (원근 하나라도 0 인경우 사진 필수)
    if(rcSttCdSel == "1000" && (photoNum == "0" || cntMphoto == "0" || cntLphoto == "0") && isUpdtGbn.indexOf("I") == -1){
        var msgText = msg.researchCheckPhotoCnt.format("원본");

        
        if(cntMphoto == "0" && cntLphoto != "0"){
            msgText = msg.researchCheckPhotoCnt.format("근거리");
        }else if(cntMphoto != "0" && cntLphoto == "0"){
            msgText = msg.researchCheckPhotoCnt.format("원거리");
        }

        navigator.notification.confirm(msgText , function(btnindex){

            if(btnindex == 1){
                $("#rcSttCd_new").text(rcSttCdSel);//재점검시 누락되는 점검값 떄문
                $(".photo").click();
            }
        }, "알림", ["확인","취소"]);
        return;

    }

    
    //시설물 일련번호
    var trgSn = $("#trgSn").val();
    //시설물 위치일련번호
    var trgLocSn = $("#trgLocSn").val();
    //구분
    var trgGbn = $("#trgGbn").val();
    //시군구
    var sigCd = $("#sigCd").val();
    //배정차수
    var plnOdr = $("#plnOdr").val();
    //배정일련번호
    var mtchSn = $("#mtchSn").val();
    //조사자일련번호
    var rcrSn = app.info.rcrSn;
    try {
        if(util.isEmpty(rcrSn)){

            //조사자 재 셋팅
            rcrSn = $("#searchUserSel").val();
    
            changeUser();
    
            if(util.isEmpty(rcrSn)){
                rcrSn = $("#rcrSn_new").html();
                if(util.isEmpty(rcrSn)){
                    navigator.notification.alert(msg.noRearcher, function(){
                        closeDetailView();
                    }, '알림', '확인');
                    return;
                }
            }
        }
    } catch (error) {
        navigator.notification.alert(msg.noRearcher, function(){
            closeDetailView();
        }, '알림', '확인');
        return;
    }
    
    //작업자ID
    var workId = app.info.opeId;

    navigator.notification.confirm(msg.updateResearch, function(btnindex){

        if(btnindex == 1){
            var sendParams = {
                plnYr : util.getToday().substr(0,4),
                plnOdr : plnOdr,
                sigCd : sigCd,
                mtchSn : mtchSn,
                trgSn : trgSn,
                trgLocSn : trgLocSn,
                trgGbn : trgGbn,
                rcSttCd : rcSttCdSel,
                rcRslt : rcRslt,
                rcrSn : rcrSn,
                workId : workId,
            };
    
            var link = URLs.insertResearchState;
    
            util.showProgress();
            var url = URLs.postURL(link, sendParams);
            util.postAJAX({}, url).then(
                function (context, rCode, results) {
                    //통신오류처리
                    if (rCode != 0 || results.response.status < 0) {
                        navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                        util.dismissProgress();
                        return;
                    }
    
                    util.toast(msg.successResearch);
    
                    $("p[name*='newLbl']").text('');

                    var index = 0;
                    var layer = trgGbn;
                    if(trgGbn == '02'){
                        layer = DATA_TYPE.BULD;
                        index = 1;
                        trgSn = trgLocSn;

                        changeOneFeatherStyle();
                    }else{
                        closePopupAndClearMap(trgGbn);
                    }
                    
                    //시설물 번호 전역변수
                    // trgSnGlobal = trgSn
                    // MapUtil.openDetail(trgGbn, null);
                    
                    closeDetailView();
                    
                    util.dismissProgress();
    
                },
                util.dismissProgress
            );
        }
        
    }, "알림", ["확인","취소"]);
    
}

//검색 옵션 추가
function makeOptSelectBox(target,colume,unUsed,defaultText,defaultValue){

    var targetId = $("#"+target);
    targetId.empty();
    
    if(defaultText != ""){
        targetId.append("<option value='"+defaultValue+"'>"+defaultText+"</option>");
    }

    var optionFormat = "<option value='{0}'>{1}</option>";

    var optionTxt = ""; 
    // var colume = "DEL_STT_CD";
    var codeList = app.codeMaster[CODE_GROUP[colume]];
    
    for(var c in codeList){
        if(c != "GroupNm"){

            if(c != unUsed){
                optionTxt = optionFormat.format(c,codeList[c]);
                targetId.append(optionTxt); 
            }
        
        }
    }
}
//커스텀 셀렉트박스 만들기
function customSelectBox(target, colume, useCode, startIndex, endIndex){
    var targetId = $("#"+target);
    targetId.empty();

    var optionFormat = "<option value='{0}'>{1}</option>";

    var optionTxt = ""; 
    var codeList = app.codeMaster[CODE_GROUP[colume]];
    
    for(var c in codeList){
        if(c != "GroupNm"){

            if(c.substr(startIndex,endIndex) == useCode){
                optionTxt = optionFormat.format(c,codeList[c]);
                targetId.append(optionTxt); 
            }
        
        }
    }
}

//커스텀 셀렉트박스 만들기2
function customSelectBox2(target, colume, useCode, startIndex, endIndex,unUsedStr, unUsedEnd){
    var targetId = $("#"+target);
    targetId.empty();

    var optionFormat = "<option value='{0}'>{1}</option>";

    var optionTxt = ""; 
    var codeList = app.codeMaster[CODE_GROUP[colume]];
    
    for(var c in codeList){
        if(c != "GroupNm"){

            if(c.substr(startIndex,endIndex) == useCode && c.substr(unUsedStr,unUsedEnd) != "000"){
                optionTxt = optionFormat.format(c,codeList[c]);
                targetId.append(optionTxt); 
            }
        
        }
    }
}

//커스텀 셀렉트박스 만들기3
function customSelectBox3(target, colume, unUseCode, startIndex, endIndex ,defaultValue ,defaultText){
    var targetId = $("#"+target);
    targetId.empty();

    var optionFormat = "<option value='{0}'>{1}</option>";

    var optionTxt = ""; 
    var codeList = app.codeMaster[CODE_GROUP[colume]];
    
    for(var c in codeList){
        if(c != "GroupNm"){

            if(c.substr(startIndex,endIndex) != unUseCode){
                optionTxt = optionFormat.format(c,codeList[c]);
                targetId.append(optionTxt); 
            }
        
        }
    }
    if(defaultText != null){
        optionTxt = optionFormat.format(defaultValue, defaultText);
        targetId.append(optionTxt);
    }
}

function impossibleAlert(){
    navigator.notification.alert(msg.impossibleNormal,
        function(){

        },'알림', '확인');
}

//점검상태 변경처리
function checkRcSttCd(){
    //신규점검상태
    var rcSttCdSel = $("#rcSttCdSel").val();
    if(rcSttCdSel == ""){
        navigator.notification.alert(msg.checkRcSttCd, function(){
            
        }, '알림', '확인');
    }
    //기존점검상태
    var rcSttCd =$("#rcSttCd").text();
    if(rcSttCdSel == "" || rcSttCd == rcSttCdSel){
        //변경된 점검정보들 전체 리셋
        resetResearchInfo();
        return;
    }
    //점검상태 셋팅
    $("#rcSttCd_new").text(rcSttCdSel);

    //설치상태
    var delStateCd = $("#delStateCd").html();
    
    //설치상태가 설치가 아닌데 정상으로 하려고 할떄
    if(delStateCd != "01" && rcSttCdSel =="1000"){
        navigator.notification.alert(msg.impossibleNormal, function(){
            $("#rcSttCdSel").val($("#rcSttCd").text());//기존상태로 변경
            
        }, '알림', '확인');
    }else{
        //점검자 셋팅
        setResearcher();
        //점검일자 셋팅
        setResearchDate();
    }

}
//점검내용 변경처리
function checkRcRslt(){
    var rcRslt = $("#rcRslt").val();
    var rcRsltOld = $("#rcRsltOld").text();

    if(rcRslt == rcRsltOld){
        //변경된 점검정보들 전체 리셋
        resetResearchInfo();
        return;
    }

    //점검자 셋팅
    setResearcher();
    //점검일자 셋팅
    setResearchDate();
    //글자수 체크
    txtMaxlength('rcRslt',50);

}

//점검자 셋팅
function setResearcher(){
    var rcrNm = app.info.rcrNm;
    var rcrSn = app.info.rcrSn;
    
    $("#rcrSn_new").html(rcrSn);
    $("#rcrNm_new").html(rcrNm);
    $("#reRcrNm").hide();
    $("#rcrNm_new").show();
}
//점검일자 셋팅
function setResearchDate(){
    var today = util.getToday();
    var year = today.substr(0,4);
    var month = today.substr(4,2);
    var day = today.substr(6,2);

    var dateTxt = "{0}년{1}월{2}일";

    $("#rcDeLbl_new").text(dateTxt.format(year,month,day));

    $("#rcDe").hide();
    $("#rcDeLbl_new").show();
}

//점검내용 리셋
function resetResearchInfo(){
    $("p[name*='newRcLbl']").text('');
    $("p[name*='newRcLbl']").hide();
    $("p[name*='oldRcLbl']").show();

    var rcRsltOld = $("#rcRsltOld").text();
    $("#rcRslt").val(rcRsltOld);
}

//화면 모든항목 막기
function disabledAll(){
    $("#submitRcBnt").attr("disabled","disabled");
    $(".infoContent select").attr("disabled","disabled");
    $(".infoContent input").attr("disabled","disabled");
    $(".infoContent textarea").attr("disabled","disabled");
    $("#modifyBtn").attr("disabled","disabled");
    $("#delUpdtBtn").hide();

    //사진
    $("#photoDialog .btnPoint").hide();
}
//점검항목 막기
function disableResearch(){
    $("#rcSttCdSel").attr("disabled","disabled");
    $("#rcRslt").attr("disabled","disabled");
    $("#submitRcBnt").attr("disabled","disabled");
}

//건물 한건만 점검 업데이트
function changeOneFeatherStyle(){
    try {
        var layerList = map.getLayers().getArray();
        for(var layer in layerList){
            var title = layerList[layer].get('title');
            if(title == "건물"){
                if(featureClone == null){
                    layerList[layer].get("source").clear(); //전체 초기화
                }else{
                    var featureId = featureClone[0].id_;
                    var eqbManSn = featureClone[0].get("EQB_MAN_SN");
                    if(eqbManSn == 0){
                        featureClone[0].set("LT_CHC_YN",1);
                        layerList[layer].get("source").getFeatureById(featureId).setStyle(buildStyle(defaultStyleOptions, featureClone[0])); //단건 스타일 변경
                    }else{
                        layerList[layer].get("source").clear(); //전체 초기화
                    }
                }
                return;
            }
        }
    } catch (error) {
        util.dismissProgress();
    }
    
}