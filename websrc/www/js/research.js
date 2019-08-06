
$(function(){

    // var boardScroll;
    // var itemSize = 15;

    //목록페이지
    $(document).on("pagecreate",pages.detail_researchList.div,function() {
        var pos = 0;
        var size = 9;
        console.log("pos : "+ pos + "size : " +size);
        $(".tableListDiv").scroll(function() {
            var scrollTop = $('.tableListDiv').scrollTop();
            var tableHeight = $(".tableListDiv").height();
            var resultHeight = $('#myResearchTable').height();

            if(scrollTop == resultHeight - tableHeight){
                pos = size;

                console.log("pos : "+ pos + " size : " +size);

                selectResearchContent(null,pos,size);
            }else{
                console.log("scrollTop : "+ scrollTop);
                console.log("tableHeight : "+ tableHeight);
                console.log("resultHeight : "+ resultHeight);
            }
        }); 
    });

    // $( document ).on("pagebeforeshow",pages.detailAddressListPage.div,  function(event,data) {
    //     detailAddressContent();
    // });

    // $( document ).on("pageshow",pages.detail_researchList.div,  function() {
        
    //     addResearchYear('searchOptPlnYr',false);
        
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
//스크롤 처리
function tableListDivScroll(event){
    // $(".tableListDiv").scroll(function() {
        var scrollTop = $('.tableListDiv').scrollTop();
        var tableHeight = $(".tableListDiv").height();
        var resultHeight = $('#myResearchTable').height();
        var rowSize = parseInt($("#rowSize").text());
        var resultSize = $("#myResearchTable > tbody > tr").size();
        var mod = rowSize - (pos + size);

        //초기화
        // if(scrollTop == 0){
        //     pos = 0;
        //     selectResearchContent(null,pos,size);
        // }

        var buttonText = event.target.textContent;
        var tagName = event.target.tagName;

        if(mod > 0 && rowSize >= resultSize){
            if(scrollTop >= resultHeight - tableHeight){
                var paramPos = pos;
                var paramSize = size;
                if(pos < rowSize){
                    pos += size;
                    paramPos = pos;
                    
                }else{
                    paramPos = pos - size;
                    paramSize = mod;
                }
                // console.log("paramPos : "+ paramPos + " paramSize : " +paramSize);

                if(checkChangeSearchOption()){
                    paramPos = null;
                };
    
                selectResearchContent(null,paramPos,paramSize);
            }else{
                var buttonText = event.target.textContent;
                var tagName = event.target.tagName;
                if(tagName !='IMG' && buttonText != '정비' ){
                    util.toast("페이지 하단 끝에서 스크롤을 아래로 내리면 다음 데이터가 조회됩니다.");

                }
                // console.log("scrollTop : "+ scrollTop);
                // console.log("tableHeight : "+ tableHeight);
                // console.log("resultHeight : "+ resultHeight);
            }
        }else if(rowSize == resultSize){
            if(scrollTop >= resultHeight - tableHeight && tagName !='IMG' && buttonText != '정비'){
                util.toast("마지막 페이지입니다.","warning");
            }
        }
    // }); 
}
//검색옵션 변경 시 체크
function checkChangeSearchOption(){
    if(app.info.searchValue){

        var searchOptTrgGbn = $("#searchOptTrgGbn").val() == "" ? null : $("#searchOptTrgGbn").val();
        var searchOptRcSttCd = $("#searchOptRcSttCd").val() == "" ? null : $("#searchOptRcSttCd").val();
        var searchOptDelSttCd = $("#searchOptDelSttCd").val() == "" ? null : $("#searchOptDelSttCd").val();
        var searchOptPlnYr = $("#searchOptPlnYr").val() == "" ? null : $("#searchOptPlnYr").val();
        var searchOptTrgSn = $("#searchOptTrgSn").val() == "" ? null : $("#searchOptTrgSn").val();

        if(searchOptTrgGbn != app.info.searchValue.searchOptTrgGbn){return true;}
        if(searchOptRcSttCd != app.info.searchValue.searchOptRcSttCd){return true;}
        if(searchOptDelSttCd != app.info.searchValue.searchOptDelSttCd){return true;}
        if(searchOptPlnYr != app.info.searchValue.searchOptPlnYr){return true;}
        if(searchOptTrgSn != app.info.searchValue.searchOptTrgSn){return true;}
    }
    
};

var pos = 0;
var size = 9;
//점검대상 조회
function selectResearchContent(trgGbn,posParam,sizeParam){
    util.showProgress();
    if(posParam == null){
        $("#myResearchTable > tbody").empty();
        $("#rowSize").text(0);
        pos = 0;
        posParam = 0;
        sizeParam = 9;
    }
    
    //조사자일련번호
    var rcrSn = app.info.rcrSn;
    var searchOptRcrSn = $("#searchOptRcrSn").val();
    if(searchOptRcrSn == ""){
        rcrSn = null;
    }else if(searchOptRcrSn == "N"){
        rcrSn = searchOptRcrSn;
    }

    if(trgGbn == null){
        var searchOptTrgGbn = $("#searchOptTrgGbn").val() == "" ? null : $("#searchOptTrgGbn").val();
    }else{
        var searchOptTrgGbn = trgGbn;
    }
    
    var searchOptRcSttCd = $("#searchOptRcSttCd").val() == "" ? null : $("#searchOptRcSttCd").val();
    var searchOptDelSttCd = $("#searchOptDelSttCd").val() == "" ? null : $("#searchOptDelSttCd").val();

    //기준년도
    var searchOptPlnYr =  $("#searchOptPlnYr").val() == "" ? null : $("#searchOptPlnYr").val();
    //일련번호
    var searchOptTrgSn = $("#searchOptTrgSn").val() == "" ? null : $("#searchOptTrgSn").val();
    //설치위치 도로명
    var searchOptRnCdLbl = $("#searchOptRnCdLbl").val() == "" ? null : $("#searchOptRnCdLbl").val();
    //설치위치 기초번호
    var searchOptBsisMnnm = $("#searchOptBsisMnnm").val() == "" ? null : $("#searchOptBsisMnnm").val();
    var searchOptBsisSlno = $("#searchOptBsisSlno").val() == "" ? null : $("#searchOptBsisSlno").val();

    //시군구 코드
    var searchOptSigCd = $("#selSig").val() == null ? app.info.sigCd : $("#selSig").val();
    if(app.info.guIncYn == "Y" && localStorage["admCd"] == searchOptSigCd){
        searchOptSigCd = app.info.sigCd;
    }
    //읍면동 구분
    var searchOptEmdGbn = $("#emdGbn").val() == "" ? null : $("#emdGbn").val();
    //읍면동 코드
    var searchOptEmdHaCd = $("#selEmd").val() == "" ? null : $("#selEmd").val();

    if(searchOptBsisMnnm != null || searchOptBsisSlno != null){
        if(searchOptRnCdLbl == null){
            util.toast('[설치위치 도로명]을 입력하고\n검색해 주세요.');
            util.dismissProgress();
            return;
        }
    }

    app.info.searchValue = {
        searchOptRcrSn : searchOptRcrSn,
        searchOptTrgGbn : searchOptTrgGbn,
        searchOptRcSttCd : searchOptRcSttCd,
        searchOptDelSttCd : searchOptDelSttCd,
        searchOptPlnYr : searchOptPlnYr,
        searchOptTrgSn : searchOptTrgSn,
        searchOptRnCdLbl : searchOptRnCdLbl,
        searchOptBsisMnnm : searchOptBsisMnnm,
        searchOptBsisSlno : searchOptBsisSlno,
        searchOptSigCd : searchOptSigCd,
        searchOptEmdGbn : searchOptEmdGbn,
        searchOptEmdHaCd : searchOptEmdHaCd
    }

    var param = {
        sigCd : searchOptSigCd
        ,rcrSn : rcrSn
        ,rdGdftySe : searchOptTrgGbn
        ,trgGbn : searchOptTrgGbn
        ,rcSttCd : searchOptRcSttCd
        ,delStateCd : searchOptDelSttCd
        ,pos : posParam
        ,size : sizeParam
        ,plnYr : searchOptPlnYr
        ,trgSn : searchOptTrgSn
        ,workId : app.info.opeId
        ,bsisRnLbl :searchOptRnCdLbl
        ,bsisMnnm : searchOptBsisMnnm
        ,bsisSlno : searchOptBsisSlno
        ,emdGbn : searchOptEmdGbn
        ,emdHaCd : searchOptEmdHaCd
    } ;

    var url = URLs.postURL(URLs.researchListLink, param);

    util.postAJAX("", url)
    .then(function (context, rcode, results) {
        
        // $("#myResearchTable > tbody").empty();
        // $("#rowSize").empty();
        var data = results.data;
        
        if (rcode != 0 || util.isEmpty(data) === true) {
            $("#myResearchTable > tbody").empty();
            var rowHtml = '<tr class=""><td colspan="7">검색된 목록이 없습니다.</td></tr>';
            $("#myResearchTable > tbody:last").append(rowHtml);
            $("#rowSize").text('0');
            util.dismissProgress();
            return;
        } else {
            for(var i in data) {
                var rowHtml = '<tr id={0}><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td><td>{7}{8}</td></tr>';
                var d = data[i];
                $("#row"+d.pos).removeData();
                $("#row"+d.pos).data("rnCd",d.rnCd);
                if(d.rdGdftySe == null){
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
                        researchOkBtn = researchOkBtn.format("insertResearchForList("+d.pos+")","");
                    }else{
                        researchOkBtn = researchOkBtn.format("impossibleAlert()","disabled");
                    }

                    var fixDetailBtn = "<button class='ui-btn ui-corner-all ui-shadow btnPossible cell80' onclick='goResearchDetail("+d.pos+")'>정비</button>";
                    var locBtn = "<img onclick='getResearchLocation("+d.pos+")' src='./image/iconNumber.png'></img>";

                    $("#myResearchTable > tbody:last").append(
                        rowHtml.format(
                            "row"+d.pos
                            ,locBtn
                            ,'건물번호판'
                            // ,posBulNm
                            ,korRnLbl
                            ,korRnLbl
                            ,d.delStateCdLbl
                            ,d.rcSttCdLbl
                            // ,researchOkBtn
                            ,""
                            ,fixDetailBtn
                            ));

                    
                    $("#row"+d.pos).data("rnCd",d.rnCd);
                    $("#row"+d.pos).data("emdCd",d.emdCd);
                    $("#row"+d.pos).data("buldMnnm",d.buldMnnm);
                    $("#row"+d.pos).data("buldSlno",d.buldSlno);
                    $("#row"+d.pos).data("buldSeCd",d.buldSeCd);

                    $("#row"+d.pos).data("bulNmtNo",d.bulNmtNo);
                    $("#row"+d.pos).data("bulManNo",d.bulManNo);
                        
                }else{
                    //설치 도로명
                    var rnLbl = "{0} {1}{2}".format(
                        d.bsisRnLbl,
                        d.bsisMnnm == null? "": d.bsisMnnm,
                        d.bsisSlno == "0"? "" : "-" + d.bsisSlno
                    );
                    //시설물구분
                    var rdGdftySe = d.rdGdftySe;
                    //설치유형(벽면형 : 00002)
                    var instSe = d.instSe;
                    var useTarget = d.useTarget;
                    //명판내용
                    var korRnLbl = createRnNm(rdGdftySe,d);
                    if(rdGdftySe == "210"){
                        korRnLbl
                    }
                    
                    var researchOkBtn = "<button class='ui-btn ui-corner-all ui-shadow btnPossible cell80' onclick='{0}' {1}>정상</button>";
                    
                    if(d.delStateCd == '01' && d.rcSttCd == null){
                    // if(d.rcSttCd != null){//임시로 열어둠
                        researchOkBtn = researchOkBtn.format("insertResearchForList("+d.pos+")","");
                    }else{
                        researchOkBtn = researchOkBtn.format("impossibleAlert()","disabled");
                    }

                    var fixDetailBtn = "<button class='ui-btn ui-corner-all ui-shadow btnPossible cell80' onclick='goResearchDetail("+d.pos+")'>정비</button>";
                    var locBtn = "<button class='' onclick='getResearchLocation("+d.pos+")'><img src='image/icon_curr.png'></img></button>";

                    if(rdGdftySe == '110'|| rdGdftySe == "210" || rdGdftySe == "310"){
                    // if(rdGdftySe == '110'){
                        var imgNm = 'icon_legend01.png';
                        if(instSe == "00002" && (useTarget == "01000" || useTarget == "04000" || useTarget == "05000")){
                            imgNm = 'icon_legend01_w.png';
                        }
                        locBtn = "<img onclick='getResearchLocation("+d.pos+")' src='./image/"+imgNm+"'></img>";
                    }else if(rdGdftySe == '510'){
                        var imgNm = 'icon_legend03.png';
                        // if(instSe == "00002"){
                        //     imgNm = 'icon_w_legend03.png';
                        // }
                        locBtn = "<img onclick='getResearchLocation("+d.pos+")' src='./image/"+imgNm+"'></img>";
                    }else if(rdGdftySe == '610'){
                        var imgNm = 'icon_legend02.png';
                        // if(instSe == "00002"){
                        //     imgNm = 'icon_w_legend02.png';
                        // }
                        locBtn = "<img onclick='getResearchLocation("+d.pos+")' src='./image/"+imgNm+"'></img>";
                    }else{
                        locBtn = "<img onclick='getResearchLocation("+d.pos+")' src='./image/iconNumber.png'></img>";
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
                            "row"+d.pos
                            ,locBtn
                            ,d.rdGdftySeLbl
                            ,rnLbl
                            ,korRnLbl
                            ,d.delStateCdLbl
                            ,d.rcSttCdLbl
                            // ,researchOkBtn
                            ,""
                            ,fixDetailBtn
                            ));
                            
                        
                    }

                    //사용 데이터 셋팅
                    // $("#row"+d.pos).data("trgGbnLbl",d.trgGbnLbl);
                    $("#row"+d.pos).data("korRnLbl",korRnLbl);
                    // $("#row"+d.pos).data("trgGbn",d.trgGbn);
                    $("#row"+d.pos).data("rdGdftySe",rdGdftySe);
                    $("#row"+d.pos).data("plnYr",d.plnYr);
                    $("#row"+d.pos).data("plnOdr",d.plnOdr);
                    $("#row"+d.pos).data("sigCd",d.sigCd);
                    $("#row"+d.pos).data("mtchSn",d.mtchSn);
                    $("#row"+d.pos).data("rdGdftySn",d.rdGdftySn);
                    $("#row"+d.pos).data("rdFtyLcSn",d.rdFtyLcSn);
                    // $("#row"+d.pos).data("trgGbn",d.trgGbn);

                    var totalCnt = d.cntMFiles;    
                    $("#rowSize").text(totalCnt);
                }
                
            // var size = $("#myResearchTable > tbody > tr").size();
            
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
    var trgGbn;
    switch(rdGdftySe){
        case "110":
        case "210":
        case "310":
        trgGbn = "01";
        break;
        case "510":
        trgGbn = "04";
        break;
        case "610":
        trgGbn = "03";
        break;
        default :
        trgGbn = "02";
        break;
    }

    //시설물 번호 전역변수
    trgSnGlobal = targetE.data("rdGdftySn");
    
    var bulNmtNo = targetE.data("bulNmtNo");
    var bulManNo = targetE.data("bulManNo");
    if(bulNmtNo != null){
        //시설물 번호 전역변수
        trgSnGlobal = bulNmtNo;
        trgGbn = "02"
    }else{
        
    }
    $("#listView").popup({
        afterclose: function( event, ui ) {
            MapUtil.openDetail(trgGbn, trgSnGlobal, rdGdftySe);
        }
    });

    $("#listView").popup("close");
}
//상세 -> 점검목록 이동
function goResearchList(type){

    var listSize = $("#myResearchTable tbody tr").length;
    var rowSize = $("#rowSize").text();

    if(listSize > 0 && rowSize > 0){
        $("#detailView").popup({
            afterclose: function( event, ui ) {
                $("#listView").popup("open", { transition: "slideup" });
            }
        });
    }else{
        $("#detailView").popup({
            afterclose: function( event, ui ) {
                MapUtil.openList(type);
            }
        });
        
    }
    
    changedIdList = new Array();
    $("#detailView").popup("close");
}
//사진창 활성화 여부
function isPhotoDialogGbn(){
    try {
        var displayGbn = $("#photoDialog").attr("style");
        var displayTxt = "display: none;";
        if(displayGbn != null && displayGbn.indexOf(displayTxt) == -1){
            return true;
        }else{
            return false;
        }
    } catch (error) {
        
    }
}
//상세정보 위치찾기
function getDetailLocation(){
    if(isPhotoDialogGbn()){
        return;
    }
    //사진창 닫기
    closePhotoView();
    //심플정보창 숨김
    $("#popup").hide();
    //대상일련번호
    var trgLocSn = $("#trgLocSn").val();
    //대상구분
    var trgGbn = $("#trgGbn").val();

    var layerNm = "tlv_spgf_loc_skm";
    var searchList = {rdftylc_sn: trgLocSn}

    if(trgGbn == "02" || trgGbn == "99"){
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

    //위치일련번호
    var rdFtyLcSn = targetID.data('rdFtyLcSn');
    //대상구분
    var rdGdftySe = targetID.data('rdGdftySe');

    var layerNm = "tlv_spgf_loc_skm";
    var searchList = {rdftylc_sn: rdFtyLcSn}

    if(rdGdftySe == null){
        layerNm = "tl_spbd_buld";

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
                    // if(trgGbn == '02'){
                    //     layer = DATA_TYPE.BULD;
                    //     index = 1;
                    //     trgSn = trgLocSn;

                        changeOneFeatherStyle(trgGbn,rcSttCdSel);
                    // }else{
                        closePopupAndClearMap(trgGbn);
                    // }
                    
                    //시설물 번호 전역변수
                    // trgSnGlobal = trgSn
                    // MapUtil.openDetail(trgGbn, null);
                    
                    var listSize = $("#myResearchDiv tbody tr").length;
                    var rowSize = $("#rowSize").text();

                    var searchType = "myResearch";
                    // if(trgGbn == '02'){
                    //     searchType = "myResearchSpbd";
                    // }
                    if(listSize > 0 && rowSize > 0){
                        goResearchList(searchType);
                        selectResearchContent();
                    }else{
                        closeDetailView();
                    }
                    
                    util.dismissProgress();
    
                },
                util.dismissProgress
            );
        }
        
    }, "알림", ["확인","취소"]);
    
}

//검색 옵션 추가
function makeOptSelectBox(target,colume,unUsed,defaultText,defaultValue){
    try {
        var targetId = $("#"+target);
        targetId.empty();
        
        if(defaultText != ""){
            targetId.append("<option value='"+defaultValue+"'>"+defaultText+"</option>");
        }

        var optionFormat = "<option value='{0}'>{1}</option>";

        var optionTxt = ""; 
        // var colume = "DEL_STT_CD";
        var codeList = app.codeMaster[CODE_GROUP[colume]];
        
        var keys = Object.keys(codeList);
        keys.sort();
        
        for(var k in keys){
            var c = keys[k];
            if(c != "GroupNm"){

                if(c != unUsed){
                    optionTxt = optionFormat.format(c,codeList[c]);
                    targetId.append(optionTxt); 
                }
            
            }
        }
    } catch (error) {
        
    }
    
}
//커스텀 셀렉트박스 만들기
function customSelectBox(target, colume, useCode, startIndex, endIndex){
    var targetId = $("#"+target);
    targetId.empty();

    var optionFormat = "<option value='{0}'>{1}</option>";

    var optionTxt = ""; 
    var codeList = app.codeMaster[CODE_GROUP[colume]];
    
    var keys = Object.keys(codeList);
        keys.sort();
        
    for(var k in keys){
        var c = keys[k];
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
    
    var keys = Object.keys(codeList);
    keys.sort();
    
    for(var k in keys){
        var c = keys[k];
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
    
    var keys = Object.keys(codeList);
    keys.sort();
    
    for(var k in keys){
        var c = keys[k];
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

//커스텀 셀렉트박스 만들기4
function customSelectBox4(target, colume, useCode, startIndex, endIndex ,defaultValue ,defaultText){
    var targetId = $("#"+target);
    targetId.empty();

    var optionFormat = "<option value='{0}'>{1}</option>";

    var optionTxt = ""; 
    var codeList = app.codeMaster[CODE_GROUP[colume]];
    
    var keys = Object.keys(codeList);
    keys.sort();
    
    for(var k in keys){
        var c = keys[k];
        if(c != "GroupNm"){

            if(c.substr(startIndex,endIndex) < useCode){
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

//커스텀 셀렉트박스 만들기5
function customSelectBox5(target, colume, useCode, startIndex, endIndex ,defaultValue ,defaultText){
    var targetId = $("#"+target);
    targetId.empty();

    var optionFormat = "<option value='{0}'>{1}</option>";

    var optionTxt = ""; 
    var codeList = app.codeMaster[CODE_GROUP[colume]];
    
    var keys = Object.keys(codeList);
    keys.sort();
    
    for(var k in keys){
        var c = keys[k];
        if(c != "GroupNm"){

            if(c.substr(startIndex,endIndex) > useCode){
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
    $("#submitRcBnt").attr("style","background-color: gray;");

    $(".infoContent select").attr("disabled","disabled");
    $(".infoContent input").attr("disabled","disabled");
    $(".infoContent textarea").attr("disabled","disabled");
    $("#modifyBtn").attr("disabled","disabled");
    $("#modifyBtn").attr("style","background-color: gray;");
    $("#delUpdtBtn").hide();
    
    //사진
    $("#photoDialog .btnPoint").hide();

    //점검 안됨 안내 글씨
    $("#rcrNotice").show();
}
//점검항목 막기
function disableResearch(){
    $("#rcSttCdSel").attr("disabled","disabled");
    $("#rcRslt").attr("disabled","disabled");
    $("#submitRcBnt").attr("disabled","disabled");
}

//피처 한건만 점검 업데이트
function changeOneFeatherStyle(trgGbn, rcSttCd){
    try {
        var type = DATA_TYPE.LOC;
        if(trgGbn == "02"){
            type = DATA_TYPE.ENTRC;
        }
        // var layerOption = {
        //     title: "위치레이어",
        //     typeName: "tlv_spgf_loc_skm",
        //     dataType: DATA_TYPE.LOC,
        //     style: {
        //         label: {
        //             text: { key: "LABEL", func: function(text) { return text } },
        //             textOffsetX: -1,
        //             textOffsetY: -18,
        //             width: 1
        //         },
        //         radius: 12
        //     },
        //     cluster: { distance: 50 },
        //     // maxResolution: MapUtil.setting.maxResolution,
        //     maxResolution: 1,
        //     viewProgress: false,
        //     renderMode: 'vector',
        //     zIndex : 1}

        // if(trgGbn == "02"){
        //     type = DATA_TYPE.ENTRC;
        //     option = {
        //         title: "출입구",
        //         // typeName: "tl_spbd_entrc",
        //         typeName: "tlv_spbd_entrc_skm",
        //         dataType: DATA_TYPE.ENTRC,
        //         style: {
        //             radius: 15,
        //             // label: {
        //                 // format: ["{0}({1}-{2})"],
        //                 // data: ["BUL_MAN_NO", "ENTRC_SE", "NMT_INS_YN"],
        //                 // text: { key: "ENTRC_SE", func: function(text) { return text } },
        //                 // textOffsetY: -20
        //             // }
        //         },
        //         cluster: { distance: 50 },
        //         maxResolution: MapUtil.setting.maxResolution,
        //         viewProgress: false,
        //         renderMode: 'vector',
        //         zIndex : 1}
        // }
        var layerList = map.getLayers().getArray();
        for(var i in layerList){
            var title = layerList[i].get('title');
            var layerId = layerList[i].get('id');
            
            // if(title == "건물"){
            //     if(featureClone == null){
            //         layerList[layer].get("source").clear(); //전체 초기화
            //     }else{
            //         var featureId = featureClone[0].id_;
            //         var eqbManSn = featureClone[0].get("EQB_MAN_SN");
            //         if(eqbManSn == 0){
            //             featureClone[0].set("LT_CHC_YN",1);
            //             layerList[layer].get("source").getFeatureById(featureId).setStyle(buildStyle(defaultStyleOptions, featureClone[0])); //단건 스타일 변경
            //         }else{
            //             layerList[layer].get("source").clear(); //전체 초기화
            //         }
            //     }
            //     return;
            // }

            if(layerId == type){
                if(featureClone != null){
                    var featureId = featureClone[featureIndex].id_;
                    var featureLtChcYn = parseInt(featureClone[featureIndex].get("LT_CHC_YN"));
                    var featureReSttSum = parseInt(featureClone[featureIndex].get("RE_STT_SUM"));
                    var featureLabel = parseInt(featureClone[featureIndex].get("LABEL"));
                    var sumCount = 0;

                    //2건 이상인경우
                    if(featureLabel > 1){
                        if(featureLabel > featureLtChcYn){
                            sumCount = 1;
                        }
                        
                        var sum = featureLtChcYn + sumCount;
                        if((featureLabel != NaN && sum > featureLabel) || (featureLabel == NaN && sum > featureClone.length)){
                            sum = featureLtChcYn;
                        }

                        featureClone[featureIndex].set("LT_CHC_YN",sum);

                        if(rcSttCd == '1000'){
                            featureClone[featureIndex].set("RE_STT_SUM",featureReSttSum + sumCount);
                        }else{
                            featureClone[featureIndex].set("RE_STT_SUM",featureReSttSum);
                        }

                    }else{

                        featureClone[featureIndex].set("LT_CHC_YN",1);

                        if(rcSttCd == '1000'){
                            featureClone[featureIndex].set("RE_STT_SUM",1);
                        }else{
                            featureClone[featureIndex].set("RE_STT_SUM",0);
                        }    
                    }

                    
                    

                    var layerFeature = layerList[i].get("source").getFeatureById(featureId);

                    if(layerId == DATA_TYPE.LOC){
                        layerFeature.setStyle(locStyle(null, layerFeature));
                    }else if(layerId == DATA_TYPE.ENTRC){
                        layerFeature.setStyle(entrcStyle(null, layerFeature));
                    }
                    

                    // for(var i  in layerFeatures){
                    //     var id_ = layerFeatures[i].get("features")[0].id_;
                    //     if(id_ == featureId){
                    //         if(type == DATA_TYPE.LOC){
                    //             layerFeatures[i].setStyle(defaultStyle(featureClone, null,option));
                    //         }else{
                    //             layerFeatures[i].setStyle(defaultStyle(featureClone, null, option));
                    //         }
                            
                    //     }
                    // }
                }
            }
        }
    } catch (error) {
        util.dismissProgress();
    }
    
}

//팝업상태 정상점검
function insertResearchForPopup(index,rdGdftySn,rdFtyLcSn,rdGdftySe){
    try {
        //조사자일련번호
        var rcrSn = app.info.rcrSn;
        if(rcrSn == null || rcrSn == ""){
            util.toast("조사자를 선택해 주세요","error");
            return;
        }

        var msgForm = "정상 상태로 점검하시겠습니까?";
    
        navigator.notification.confirm(msgForm, function(btnindex){
    
            if(btnindex == 1){
                // var targetID = $("#row" + i);
    
                //배정년도
                var plnYr = util.getToday().substr(0,4);
                //배정차수
                var plnOdr = "1";
                //시군구
                var sigCd = featureClone[index].get("SIG_CD");
                //배정일련번호
                var mtchSn = "";
                //대상일련번호
                var trgSn = featureClone[index].get("BUL_NMT_NO");
                if(rdGdftySn != null){
                    trgSn = rdGdftySn;
                }
                //대상위치일련번호
                var trgLocSn = featureClone[index].get("BUL_MAN_NO");
                if(rdFtyLcSn != null){
                    trgLocSn = rdFtyLcSn;
                }
                //대상구분
                var trgGbn = "02";
                if(rdGdftySe != null){
                    switch(rdGdftySe){
                        case 110:
                        case 210:
                        case 310:
                        trgGbn = "01";
                        break;
                        case 510:
                        trgGbn = "04";
                        break;
                        case 610:
                        trgGbn = "03";
                        break;
                        default :
                        trgGbn = "02";
                        break;
                    }
                }
                //점검상태(무조건 정상)
                var rcSttCd = '1000';
                
                //조사자일련번호
                var rcrSn = app.info.rcrSn;
                if(rcrSn == null){
                    util.toast("조사자를 선택해 주세요","error");
                    return;
                }

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
    
                        // selectResearchContent();
                        featureIndex = index;
                        changeOneFeatherStyle(trgGbn,rcSttCd);
                        closePopupAndClearMap(trgGbn);
    
                        util.dismissProgress();
    
                    },
                    util.dismissProgress
                );
                
            }
        }, "알림", ["확인","취소"]);
        
    } catch (error) {
        util.toast("점검실패","error");
    }
}

function emptyResearchList(){
    $("#myResearchTable > tbody").empty();
    $("#rowSize").text(0);
    pos = 0;
    posParam = 0;
    sizeParam = 9;
    // $('.tableListDiv').scrollTop(0);
}