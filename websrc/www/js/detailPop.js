function closeDetailView(id){
    if(id == null){
        id = "detailView";
    }
    if(changedIdList.length != 0){
        navigator.notification.confirm(msg.lossClose, function(btnindex){
            if(btnindex == 1){
                $("#"+id).popup({
                    afterclose: function( event, ui ) {
                        null;
                    }
                })
                $("#"+id).popup("close", { transition: "slideup" });
                //팝업창 상태 초기화
                isPopState = "on";
                //리스트초기화
                changedIdList = new Array();
                //원본데이터 초기화
                $("#originDiv").empty();
            }
        }, "알림", ["확인","취소"]);
    }else{
        $("#viewMapInfo").hide();    
        $("#"+id).popup({
            afterclose: function( event, ui ) {
                null;
            }
        })
        $("#"+id).popup("close", { transition: "slideup" });
        //팝업창 상태 초기화
        isPopState = "on";
        //현위치체크
        // currentPositionLayerCheck();
        //변경값 리스트초기화
        changedIdList = new Array();
        //원본데이터 초기화
        $("#originDiv").empty();
        //주소정보시설목록 리스트초기화
        // if(id == "listView"){
            // }
        }
    app.info.searchValue = "";
        
    //주소정보시설목록 초기화
    emptyResearchList();
    //사진 변경값 초기화
    MapUtil.photo.refresh();
    //확대창 삭제
    $(".smartphoto").parents("div").remove();

    // var newLbl = $("p[name*='newLbl']").text();
    // if(newLbl != ""){
    //     navigator.notification.confirm(msg.lossClose, function(btnindex){
    //         if(btnindex == 1){
    //             $("#detailView").popup("close", { transition: "slideup" });
    //             //팝업창 상태 초기화
    //             isPopState = "on";
    //         }
    //     }, "알림", ["확인","취소"]);

    // }else{
    //     $("#viewMapInfo").hide();    
    //     $("#detailView").popup("close", { transition: "slideup" });
    //     //팝업창 상태 초기화
    //     isPopState = "on";
    //     currentPositionLayerCheck();
    // }
}

var popID;
var popColume;
function openDataIdPop(id){
    //모든팝업닫기
    $(".dataClose").click();
    //스크롤처리 초기화
    $("#scrollDiv").attr("style","");

    $("#dataForm").empty();
    popID = id;
    switch(id){
        case 'instSe':

            //제목
            var titleText = '설치유형';
            setTitle(titleText);

            //라디오버튼 구성
            popColume = 'INSTL_SE';
            createRadioButton();
            break;

        case 'instSpotCd':
            //제목
            var titleText = '설치지점';
            setTitle(titleText);

            //라디오버튼 구성
            popColume = 'INS_SPO_CD';
            createRadioButton();
            break;
        case 'instCrossCd':
            //제목
            var titleText = '교차로유형';
            setTitle(titleText);

            //라디오버튼 구성
            popColume = 'INS_CRS_CD';
            createRadioButton();
            break;
        case 'useTarget':
            //제목
            var titleText = '사용대상';
            setTitle(titleText);

            //라디오버튼 구성
            popColume = 'USE_TRGET';
            createRadioButton();
            break;
        case 'plqDirection':
            //제목
            var titleText = '안내시설 방향';
            setTitle(titleText);

            //라디오버튼 구성
            popColume = 'PLQ_DRC';
            createRadioButton();
            break;
        case 'scfggMkty':
            //제목
            var titleText = '제2외국어여부';
            setTitle(titleText);

            //라디오버튼 구성
            popColume = 'SCFGG_MKTY';
            createRadioButton();
            break;
        case 'scfggUla1':
            var scfggMkty = $("#scfggMkty_new").text() == "" ? $("#scfggMkty").text() : $("#scfggMkty_new").text();
            if(scfggMkty == "1"){
                navigator.notification.alert(msg.notScfggMkty, '', '알림', '확인');
                return;
            }
            //제목
            var titleText = '언어1';
            setTitle(titleText);

            //라디오버튼 구성
            popColume = 'SCFGG_ULA1';
            createRadioButton();
            break;
        case 'scfggUla2':
            var scfggMkty = $("#scfggMkty_new").text() == "" ? $("#scfggMkty").text() : $("#scfggMkty_new").text();
            if(scfggMkty != "3"){
                navigator.notification.alert(msg.notScfggMkty2, '', '알림', '확인');
                return;
            }
            //제목
            var titleText = '언어2';
            setTitle(titleText);

            //라디오버튼 구성
            popColume = 'SCFGG_ULA1';
            createRadioButton();
            break;
        case 'area_advrtsCd':
            //제목
            var titleText = '광고여부에따른 분류';
            setTitle(titleText);

            //라디오버튼 구성
            popColume = 'ADVRTS_CD';
            createRadioButton();
            break;
        case 'rdpqGdSd':
            //제목
            var titleText = '규격'; //도로명판
            setTitle(titleText);

            //라디오버튼 구성
            popColume = 'RDPQ_GD_SD';
            createRadioButtonCustom(id);
            break;
        case 'area_areaGdSd':
            //제목
            var titleText = '규격'; // 지역안내판
            setTitle(titleText);

            //라디오버튼 구성
            popColume = 'AREA_GD_SD';
            createRadioButton();
            break;
        case 'bsis_bsisGdSd':
            //제목
            var titleText = '규격'; // 기초번호판
            setTitle(titleText);

            //라디오버튼 구성
            popColume = 'BSIS_GD_SD';
            createRadioButtonCustom(id);
            break;
        case 'bsis_planeCd':
            //제목
            var titleText = '곡면분류';
            setTitle(titleText);

            //라디오버튼 구성
            popColume = 'PLANE_CD';
            createRadioButton();
            break;
        case 'buldNmtSe':
            //제목
            var titleText = '유형'; //건물번호판
            setTitle(titleText);

            //라디오버튼 구성
            popColume = 'BUL_NMT_SE';
            createRadioButton();
            break;
        case 'buldNmtPurpose':
            //제목
            var titleText = '용도'; //건물번호판
            setTitle(titleText);

            //라디오버튼 구성
            popColume = 'BUL_NMT_PR';
            createRadioButtonCustom(id);
            break;
        case 'buldNmtCd':
            //제목
            var titleText = '규격'; //건물번호판
            setTitle(titleText);

            //라디오버튼 구성
            popColume = 'BUL_NMT_CD';
            createRadioButton();
            break;
        case 'buldMnfCd':
            //제목
            var titleText = '제작유형'; //건물번호판
            setTitle(titleText);

            //라디오버튼 구성
            popColume = 'BUL_MNF_CD';
            createRadioButton();
            break;
        case 'buldNmtMaterial':
            //제목
            var titleText = '제질'; //건물번호판
            setTitle(titleText);

            //라디오버튼 구성
            popColume = 'BUL_NMT_QL';
            createRadioButton();
            break;
        case 'bdtypCd_main':
            //제목
            var titleText = '용도'; //건물정보
            setTitle(titleText);

            //라디오버튼 구성
            popColume = 'BDTYP_CD';
            createRadioButtonCustom(id);
            break;
       case 'bdtypCd':
            //제목
            var titleText = '용도'; //건물정보
            setTitle(titleText);

            //라디오버튼 구성
            popColume = 'BDTYP_CD';
            createRadioButtonCustom(id);
            break;
        case 'bulDpnSe':
            //제목
            var titleText = '종속여부'; //건물정보
            setTitle(titleText);

            //라디오버튼 구성
            popColume = 'BUL_DPN_SE';
            createRadioButton();
            break;
        case 'delStateCd':
            //제목
            var titleText = '설치상태'; //설치상태
            setTitle(titleText);

            //라디오버튼 구성
            popColume = 'DEL_STT_CD';
            createRadioButtonCustom(id);
            break;
        case 'rcSttCd':
            //제목
            var titleText = '점검상태'; //점검상태
            setTitle(titleText);

            //라디오버튼 구성
            popColume = 'RC_STT_CD';
            createRadioButtonCustom(id);
            break;
        case 'prtTy':
            //제목
            var titleText = '인쇄방식'; //인쇄방식
            setTitle(titleText);

            //라디오버튼 구성
            popColume = 'PRT_TY';
            createRadioButton();
            break;
        case 'bsisMthd':
            //제목
            var titleText = '표기방법';//기초번호판
            setTitle(titleText);

            //라디오버튼 구성
            popColume = 'BSIS_MTHD';
            createRadioButton();
            break;
        case 'area_insPlc':
            //제목
            var titleText = '설치장소';//지역안내판
            setTitle(titleText);

            //라디오버튼 구성
            popColume = 'INS_PLC';
            createRadioButton();
            break;
        case 'gdftyQlt':
            //제목
            var titleText = '인쇄방식'; //도로명판
            setTitle(titleText);

            //라디오버튼 구성
            popColume = 'GDFTY_QLT';
            createRadioButton();
            break;
            

            

    }

    //팝업열기
    $("#radioDataPop").show();
}

function radioDataSendParent(){
    var oldCode = $("#"+popID).text();
    var newRadioVal = $("input:radio[name='"+popID+"']:checked").val();


    //기존내용과 같을시 처리안함
    if(oldCode == newRadioVal && popID != "rdpqGdSd" && popID != "scfggUla1"){
        //새로운 데이터창 초기화
        $("#"+popID+"_new").text('');

        //새로운 라벨창 초기화 및 숨기기
        $("#"+popID+"Lbl_new").text('');
        $("#"+popID+"Lbl_new").hide();

        //기존라벨 보이기
        $("#"+popID+"Lbl").show();

    }else{
        var codeList = app.codeMaster[CODE_GROUP[popColume]];
        var newCode = codeList[newRadioVal];

        // 수정된 새로운라벨
        $("#"+popID+"Lbl_new").text(newCode);
        $("#"+popID+"Lbl_new").show();

        //수정시 필요한 코드
        $("#"+popID+"_new").text(newRadioVal);

        //이전 라벨 숨김
        $("#"+popID+"Lbl").hide();
    }

    //규격일때 처리
    if(popID == "rdpqGdSd" || popID == "buldNmtCd" || popID == "bsis_bsisGdSd"){
        setGdft();
    }

    //건물정보 용도(대분류)일때 처리
    if(popID == "bdtypCd_main"){
        setbdtypCd();
    }

    //제2외국어 처리
    if(popID == "scfggMkty"){
        setScfggMkty();
    }
    
    //사용대상 및 안내시설방향 변경시 규격을 필수 변경
    if(popID == "useTarget" || popID == "plqDirection"){
        var id = $("#detailView").children()[0].id;
        //도로명판일때만 규격 초기화
        if(id == "roadView_page"){
            var plqDirectionLbl_new = $("#plqDirectionLbl_new").text();
            var useTarget_new = $("#useTarget_new").text();

            if(oldCode == newRadioVal && plqDirectionLbl_new == "" && useTarget_new == ""){
                setGdSdReset();
            }else{
                setGdSd();
            }
        }
    }

    //팝업닫기
    $("#radioDataPop").hide();
}

function openCustomPop(type){
        $(".dataClose").click();
        var textVal = $("#"+type+"_new").text() == "" ? $("#"+type).text():$("#"+type+"_new").text();
        $("#"+type+"_fix").val(textVal);
        $("#"+type+"_pop").show();

}

function openCustomPop2(type,idList){
    $(".dataClose").click();

    for(var i in idList){

        var value = $("#"+idList[i]+"_new").text() == "" ? $("#"+idList[i]).text():$("#"+idList[i]+"_new").text();
        $("#"+idList[i]+"_fix").val(value);

    }

    $("#"+type+"_pop").show();


    // switch(type){
    //     //규격(가로*새로*두께)
    //     case 'gdftyWVT':
    //         var gdftyWide = $("#gdftyWide_new").text() == "" ? $("#gdftyWide").text():$("#gdftyWide_new").text();
    //         var gdftyVertical = $("#gdftyVertical_new").text() == "" ? $("#gdftyVertical").text():$("#gdftyVertical_new").text();
    //         var gdftyThickness = $("#gdftyThickness_new").text() == "" ? $("#gdftyThickness").text():$("#gdftyThickness_new").text();

    //         $("#gdftyWide_fix").val(gdftyWide);
    //         $("#gdftyVertical_fix").val(gdftyVertical);
    //         $("#gdftyThickness_fix").val(gdftyThickness);

    //         // $("#"+type+"_pop").show();
    //     break;
    //     //건물층수
    //     case 'floCo':
    //         var groFloCo = $("#groFloCo_new").text() == "" ? $("#groFloCo").text():$("#groFloCo_new").text();
    //         var undFloCo = $("#undFloCo_new").text() == "" ? $("#undFloCo").text():$("#undFloCo_new").text();

    //         $("#groFloCo_fix").val(groFloCo);
    //         $("#undFloCo_fix").val(undFloCo);

    //         // $("#"+type+"_pop").show();
    //     break;
    //     case 'frontStartBaseNo':
    //         var startBaseMasterNo = $("#frontStartBaseMasterNo_new").text() == "" ? $("#frontStartBaseMasterNo").text(): $("#frontStartBaseMasterNo_new").text();
    //         var startBaseSlaveNo = $("#frontStartBaseSlaveNo_new").text() == "" ? $("#frontStartBaseSlaveNo").text(): $("#frontStartBaseSlaveNo_new").text();

    //         $("#frontStartBaseMasterNo_fix").val(startBaseMasterNo);
    //         $("#frontStartBaseSlaveNo_fix").val(startBaseSlaveNo);

    //         // $("#frontStartBaseNo_pop").show();
    //     break;
    //     case 'frontEndBaseNo':
    //         var startBaseMasterNo = $("#frontEndBaseMasterNo_new").text() == "" ? $("#frontEndBaseMasterNo").text(): $("#frontEndBaseMasterNo_new").text();
    //         var startBaseSlaveNo = $("#frontEndBaseSlaveNo_new").text() == "" ? $("#frontEndBaseSlaveNo").text(): $("#frontEndBaseSlaveNo_new").text();

    //         $("#frontEndBaseMasterNo_fix").val(startBaseMasterNo);
    //         $("#frontEndBaseSlaveNo_fix").val(startBaseSlaveNo);

    //         // $("#frontStartBaseNo_pop").show();
    //     break;
    //     case 'frontStartBaseNo':
    //         var startBaseMasterNo = $("#frontStartBaseMasterNo_new").text() == "" ? $("#frontStartBaseMasterNo").text(): $("#frontStartBaseMasterNo_new").text();
    //         var startBaseSlaveNo = $("#frontStartBaseSlaveNo_new").text() == "" ? $("#frontStartBaseSlaveNo").text(): $("#frontStartBaseSlaveNo_new").text();

    //         $("#frontStartBaseMasterNo_fix").val(startBaseMasterNo);
    //         $("#frontStartBaseSlaveNo_fix").val(startBaseSlaveNo);

    //         // $("#frontStartBaseNo_pop").show();
    //     break;

    // }

    // $("#"+type+"_pop").show();

}

function textDataSendParent(type){

        var oldData = $("#"+type).text();
        var fixData = $("#"+type+"_fix").val();

        //기존내용과 같을시 처리안함
        if(oldData == fixData){
            //새로운 데이터창(라벨) 초기화
            $("#"+type+"_new").text('');

            //새로운 데이터창(라벨) 숨기기
            $("#"+type+"_new").hide();

            //기존라벨 보이기
            $("#"+type).show();

            //팝업닫기
            $("#"+type+"_pop").hide();
            return;
        }

        $("#"+type+"_new").text(fixData);
        $("#"+type).hide();
        $("#"+type+"_new").show();
        $("#"+type+"_pop").hide();

}

function textDataSendParent3(type){
    switch(type){
    case 'gdftyWVT'://규격(가로*새로*두께)

        var gdftyWide_old = $("#gdftyWide").text();
        var gdftyVertical_old = $("#gdftyVertical").text();
        var gdftyThickness_old = $("#gdftyThickness").text();

        var gdftyWide_fix = $("#gdftyWide_fix").val();
        var gdftyVertical_fix = $("#gdftyVertical_fix").val();
        var gdftyThickness_fix = $("#gdftyThickness_fix").val();

        //규격 0 입력 안됨
        if(gdftyWide_fix == "0" || gdftyVertical_fix == "0" || gdftyThickness_fix == "0" || gdftyWide_fix == "" || gdftyVertical_fix == "" || gdftyThickness_fix == ""){
            navigator.notification.alert(msg.checkZero.format("규격"), '', '알림', '확인');
            return;
        }

        //기존내용과 같을시 처리안함
        if(gdftyWide_old == gdftyWide_fix && gdftyVertical_old == gdftyVertical_fix && gdftyThickness_old == gdftyThickness_fix){

            //새로운 데이터창 초기화
            $("#gdftyWide_new").text('');
            $("#gdftyVertical_new").text('');
            $("#gdftyThickness_new").text('');

            //새로운 라벨창 초기화 및 숨기기
            $("#"+type+"_new").text('');
            $("#"+type+"_new").hide();

            //기존라벨 보이기
            $("#"+type).show();

             //팝업닫기
            $("#"+type+"_pop").hide();
            return;
        }

        $("#gdftyWide_new").text(gdftyWide_fix);
        $("#gdftyVertical_new").text(gdftyVertical_fix);
        $("#gdftyThickness_new").text(gdftyThickness_fix);

        var gdftyWVT_new = "{0}*{1}*{2}".format(gdftyWide_fix,gdftyVertical_fix,gdftyThickness_fix);

        $("#gdftyWVT_new").text(gdftyWVT_new);

        $("#"+type).hide();
        $("#"+type+"_new").show();
        $("#"+type+"_pop").hide();

        break;
    case 'floCo'://건물층수

        var groFloCo_old = $("#groFloCo").text();
        var undFloCo_old = $("#undFloCo").text();

        var groFloCo_fix = $("#groFloCo_fix").val();
        var undFloCo_fix = $("#undFloCo_fix").val();

        //기존내용과 같을시 처리안함
        if(groFloCo_old == groFloCo_fix && undFloCo_old == undFloCo_fix){

            $("#groFloCo_new").text('');
            $("#undFloCo_new").text('');

            $("#"+type+"_new").text('');
            $("#"+type+"_new").hide();

            $("#"+type).show();

             //팝업닫기
            $("#"+type+"_pop").hide();
            return;
        }


        $("#groFloCo_new").text(groFloCo_fix);
        $("#undFloCo_new").text(undFloCo_fix);


        var floCo_new = "지상층: {0} / 지하층: {1}".format(groFloCo_fix,undFloCo_fix);

        $("#floCo_new").text(floCo_new);

        $("#"+type).hide();
        $("#"+type+"_new").show();
        $("#"+type+"_pop").hide();

        break;
    }
}

//기초번호용
function textDataSendParent2(type, id1, id2){
    var baseMasterNo_old = $("#"+id1).text();
    var baseSlaveNo_old = $("#"+id2).text();

    var baseMasterNo_fix = $("#"+id1+"_fix").val();
    var baseSlaveNo_fix = $("#"+id2+"_fix").val();

    if(baseMasterNo_fix == "0" || baseMasterNo_fix == "0" || baseSlaveNo_fix == ""){
        navigator.notification.alert(msg.checkZero.format("기초번호"), '', '알림', '확인');
        return;
    }

    //기존내용과 같을시 처리안함
    if(baseMasterNo_old == baseMasterNo_fix && baseSlaveNo_old == baseSlaveNo_fix){
        $("#"+id1+"_new").text('');
        $("#"+id2+"_new").text('');

        $("#"+type+"_new").text('');
        $("#"+type+"_new").hide();

        $("#"+type).show();

        //팝업닫기
        $("#"+type+"_pop").hide();
        return;
    }

    var frontStartBaseNo = "{0} - {1}";
    var baseNoText = "";

    baseNoText = frontStartBaseNo.format(baseMasterNo_fix,baseSlaveNo_fix);


    $("#"+type+"_new").text(baseNoText);

    $("#"+id1+"_new").text(baseMasterNo_fix);
    $("#"+id2+"_new").text(baseSlaveNo_fix);

    $("#"+type).hide();
    $("#"+type+"_new").show();
    $("#"+type+"_pop").hide();

}

function createRadioButton(){
    var appendText = '';
    var cellText = '';
    var strText = '';

    var dataForm = $("#dataForm");

    var targetRow = "<div class='row'>{0}</div>"
    var dataCell = "<div class='cell auto'>{0}</div>";
    var InputRadio = '<div class="inputRadio"><input type="radio" name="{0}" value="{1}"></div>';
    var radioSpen = '<span class="label">{0}</span>';

    var checkedValue = $("#"+popID).text();
    var codeList = app.codeMaster[CODE_GROUP[popColume]];

    for(var c in codeList){
        if(c != "GroupNm"){

            strText += InputRadio.format(popID,c);
            strText += radioSpen.format(codeList[c]);
            cellText += dataCell.format(strText);

            appendText = targetRow.format(cellText);
            dataForm.append(appendText)
            appendText = '';
            cellText = '';
            strText = '';
        }
    }

    var values = $("#"+popID+"_new").text() == "" ? $("#"+popID).text() :$("#"+popID+"_new").text();

    if(values != ""){
        $('input:radio[name='+popID+']:input[value=' + values + ']').attr("checked", true);
    }
}

function createRadioButtonCustom(id){

    var appendText = '';
    var cellText = '';
    var strText = '';
    var dataForm = $("#dataForm");

    var targetRow = "<div class='row'>{0}</div>"
    var dataCell = "<div class='cell auto'>{0}</div>";
    var InputRadio = '<div class="inputRadio"><input type="radio" name="{0}" value="{1}"></div>';
    var radioSpen = '<span class="label">{0}</span>';

    switch(id){
        case 'rdpqGdSd':
            //사용대상에 따른 분류 (도로명판)
            var useTarget = $("#useTarget_new").text() == "" ? $("#useTarget").text() : $("#useTarget_new").text();
            //안내시설방향
            var plqDirection = $("#plqDirection_new").text() == "" ? $("#plqDirection").text() : $("#plqDirection_new").text();
            //제2외국어여부
            var scfggMkty = $("#scfggMkty_new").text() == "" ? $("#scfggMkty").text() : $("#scfggMkty_new").text();

            if(scfggMkty != "1"){
                popColume = "RDPQ_GD_SD_2";
            }

            var checkedValue = $("#"+id).text();
            var codeList = app.codeMaster[CODE_GROUP[popColume]];

            var codeValue = useTarget.charAt(1) +  plqDirection.charAt(2);

            var codeCnt = 0;
            for(var c in codeList){
                if(c != "GroupNm"){
                    if(c.substr(1,2) == codeValue){

                        strText += InputRadio.format(id,c);
                        strText += radioSpen.format(codeList[c]);
                        cellText += dataCell.format(strText);

                        appendText = targetRow.format(cellText);
                        dataForm.append(appendText)
                        appendText = '';
                        cellText = '';
                        strText = '';
                        codeCnt++;
                    }
                }
            }
            //코드가 없을때 예) 사용대상 차량용 -> 제2외국어 단독
            if(codeCnt == 0){
                strText = radioSpen.format("항목이 없습니다.");
                cellText += dataCell.format(strText);
                
                appendText = targetRow.format(cellText);
                dataForm.append(appendText)
                appendText = '';
                cellText = '';
                strText = '';
            }

            var values = $("#"+id+"_new").text() == "" ? $("#"+id).text() :$("#"+id+"_new").text();
            if(values != ""){
                $('input:radio[name='+id+']:input[value=' + values + ']').attr("checked", true);
            }
        break;
        case'bsis_bsisGdSd':
            //설치 장소 및 사용대상에 따른 분류 (기초번호판)
            var bsis_itlpcSe = $("#bsis_itlpcSe_new").text() == "" ? $("#bsis_itlpcSe").text() : $("#bsis_itlpcSe_new").text();
            var useTarget = $("#useTarget_new").text() == "" ? $("#useTarget").text() : $("#useTarget_new").text();


            var checkedValue = $("#"+id).text();
            var codeList = app.codeMaster[CODE_GROUP[popColume]];

            var codeValue = useTarget.charAt(1) +  bsis_itlpcSe.charAt(2);
            //승강장용 일경우 사용자여부와 상관없이 1970X 코드 사용
            if(bsis_itlpcSe.charAt(2) == "7"){
                codeValue = "97";
            }

            for(var c in codeList){
                if(c != "GroupNm"){
                    if(c.substr(1,2) == codeValue){

                        strText += InputRadio.format(id,c);
                        strText += radioSpen.format(codeList[c]);
                        cellText += dataCell.format(strText);

                        appendText = targetRow.format(cellText);
                        dataForm.append(appendText)
                        appendText = '';
                        cellText = '';
                        strText = '';

                    }
                }
            }

            var values = $("#"+id+"_new").text() == "" ? $("#"+id).text() :$("#"+id+"_new").text();
            if(values != ""){
                $('input:radio[name='+id+']:input[value=' + values + ']').attr("checked", true);
            }
        case'bdtypCd_main':
            // 용도 대분류
           var codeList = app.codeMaster[CODE_GROUP[popColume]];

            for(var c in codeList){
                if(c != "GroupNm"){
                    if(c.substr(2,5) == '000'){

                        strText += InputRadio.format(id,c);
                        strText += radioSpen.format(codeList[c]);
                        cellText += dataCell.format(strText);

                        appendText = targetRow.format(cellText);
                        dataForm.append(appendText)
                        appendText = '';
                        cellText = '';
                        strText = '';

                    }

                }
            }

            var values = $("#"+id+"_new").text() == "" ? $("#"+id).text() :$("#"+id+"_new").text();

            $('input:radio[name='+id+']:input[value=' + values + ']').attr("checked", true);

        break;
        case'bdtypCd':
            // 용도 소분류
            var codeList = app.codeMaster[CODE_GROUP[popColume]];

            var bdtypCd_main = $("#bdtypCd_main_new").text() == "" ? $("#bdtypCd_main").text() : $("#bdtypCd_main_new").text();
            var i = 0;
            for(var c in codeList){
                if(c != "GroupNm"){
                    if(c.substr(2,5) != '000'&& bdtypCd_main.substr(0,2) == c.substr(0,2)){

                        strText += InputRadio.format(id,c);
                        strText += radioSpen.format(codeList[c]);
                        cellText += dataCell.format(strText);

                        appendText = targetRow.format(cellText);
                        dataForm.append(appendText)
                        appendText = '';
                        cellText = '';
                        strText = '';
                        i++;

                    }

                }
            }

            if(i>25){
                $("#scrollDiv").attr("style","height:500px;overflow-y:scroll");
            }else{
                $("#scrollDiv").attr("style","");
            }

            var values = $("#"+id+"_new").text() == "" ? $("#"+id).text() :$("#"+id+"_new").text();

            $('input:radio[name='+id+']:input[value=' + values + ']').attr("checked", true);

        break;
        case'buldNmtPurpose':
            //건물번호판 용도
            var codeList = app.codeMaster[CODE_GROUP[popColume]];

            var buldNmtType = $("#buldNmtType").text();

            for(var c in codeList){
                    if(c != "GroupNm"){
                        if(c.substr(1,4) != '000' && buldNmtType.substr(0,1) == c.substr(0,1)){

                            strText += InputRadio.format(id,c);
                            strText += radioSpen.format(codeList[c]);
                            cellText += dataCell.format(strText);

                            appendText = targetRow.format(cellText);
                            dataForm.append(appendText)
                            appendText = '';
                            cellText = '';
                            strText = '';

                        }

                    }
                }

                var values = $("#"+id+"_new").text() == "" ? $("#"+id).text() :$("#"+id+"_new").text();

                $('input:radio[name='+id+']:input[value=' + values + ']').attr("checked", true);

        break;
        case 'delStateCd':
                var codeList = app.codeMaster[CODE_GROUP[popColume]];
                
                var delStateCd = $("#delStateCd").text();
                for(var c in codeList){
                    if(c != "GroupNm"){
                        
                        if(c == '05'){
                            continue;
                        }
                        strText += InputRadio.format(popID,c);
                        strText += radioSpen.format(codeList[c]);
                        cellText += dataCell.format(strText);
            
                        appendText = targetRow.format(cellText);
                        dataForm.append(appendText)
                        appendText = '';
                        cellText = '';
                        strText = '';
                    }
                }
            
                var values = $("#"+id+"_new").text() == "" ? $("#"+id).text() :$("#"+id+"_new").text();
            
                if(values != ""){
                    $('input:radio[name='+id+']:input[value=' + values + ']').attr("checked", true);
                }
        break;
        case 'rcSttCd':
                var codeList = app.codeMaster[CODE_GROUP[popColume]];

                for(var c in codeList){
                    if(c != "GroupNm"){
                        
                        strText += InputRadio.format(popID,c);
                        strText += radioSpen.format(codeList[c]);
                        cellText += dataCell.format(strText);
            
                        appendText = targetRow.format(cellText);
                        dataForm.append(appendText)
                        appendText = '';
                        cellText = '';
                        strText = '';
                    }
                }
            
                var values = $("#"+id+"_new").text() == "" ? $("#"+id).text() :$("#"+id+"_new").text();
            
                if(values != ""){
                    $('input:radio[name='+id+']:input[value=' + values + ']').attr("checked", true);
                }


        break;
    }

}

function setTitle(titleText){

    $("#dataTitle").text(titleText);

}

function refresh(){
    navigator.notification.confirm(msg.initInfo, function(btnIndex){
        if(btnIndex == 1){
            $("p[id*='_new']").text('');
            $("p[id*='_new']").hide();

            $("p[name*='oldLbl']").show();
        }
    }, "알림", ["확인","취소"]);
}

function submit(type){
    var msgText = msg.isSave;
    //사진데이터 확인여부
    // var picImg = $(".picImg").html();
    //상세정보 수정여부
    var newLbl = $("p[name*='newLbl']").text();

    if(newLbl == ""){

        if($("#bdtypCd_mainLbl_new").text() != ""){
            navigator.notification.alert('소분류를 선택합니다.','','알림', '확인');
        }else{
            navigator.notification.alert(msg.noSave,'','알림', '확인');
        }
        return;
    }

    if(type == DATA_TYPE.BULD){
        //건물명
        var posBulNm_new = $("#posBulNm_new").text();
        //건물명(영)
        var bulEngNm_new = $("#bulEngNm_new").text();
        //건물군번호
        var eqbManSn = $("#eqbManSn").val();

        if((posBulNm_new != "" || bulEngNm_new != "") && eqbManSn != 0){
            msgText = msg.saveBuldNm;
        }
        
    }

    //제2외국어 변경
    var scfggMkty = $("#scfggMkty").text();
    var scfggMkty_new = $("#scfggMkty_new").text();
    var scfggUla1 = $("#scfggUla1").text();
    var scfggUla2 = $("#scfggUla2").text();
    var scfggUla1_new = $("#scfggUla1_new").text();
    var scfggUla2_new = $("#scfggUla2_new").text();
    var useTarget = $("#useTarget").text();
    var useTarget_new = $("#useTarget_new").text();

    //도로명판일 경우의 외국어 및 규격 체크
    if(type == DATA_TYPE.RDPQ){
        //사용대상이 보행자용(보행자용:01000,차로용:04000,소로용:05000)이 아닐떄 제2외국어 사용못함
        if((useTarget_new == "" && useTarget != "01000" && useTarget != "04000" && useTarget != "05000") || (useTarget_new != "" && useTarget_new != "01000" && useTarget_new != "04000" && useTarget_new != "05000")) {
            if((scfggMkty_new == "" && scfggMkty != "1") || (scfggMkty_new != "" && scfggMkty_new != "1")) {
                navigator.notification.alert(msg.useTargetScfggMkty,'','알림', '확인');
                return;
            }
        }
        //규격처리
        if(scfggMkty_new != ""){
            //미표기 -> 단독언어 또는 2개언어로 변경
            if(scfggMkty == "1"){
                //규격 필수 변경
                var rdpqGdSd_new = $("#rdpqGdSd_new").text();
                if(rdpqGdSd_new == ""){
                    navigator.notification.alert(msg.checkRdpqGdSd,'','알림', '확인');
                    return;
                }
            }else if(scfggMkty != "1" && scfggMkty_new == "1"){ // 단독언어 또는 2개언어 였는데 미표기로 변경
                var rdpqGdSd_new = $("#rdpqGdSd_new").text();
                if(rdpqGdSd_new == ""){
                    navigator.notification.alert(msg.checkRdpqGdSd,'','알림', '확인');
                    return;
                }
                
            }
        }

        // 사용대상 안내시설방향 변경시 규격 수정 필수 (도로명판일 경우만)
        var plqDirectionLbl_new = $("#plqDirectionLbl_new").text();
        var useTarget_new = $("#useTarget_new").text();

        if(plqDirectionLbl_new != "" || useTarget_new != ""){
            var rdpqGdSd_new = $("#rdpqGdSd_new").text();
            if(rdpqGdSd_new == ""){
                navigator.notification.alert(msg.checkRdpqGdSd,'','알림', '확인');
                return;
            }
        }

    }

    //언어선택체크
    if(scfggMkty_new == "2"){
        if(scfggUla1_new == ""){
            navigator.notification.alert(msg.checkScfggMkty,'','알림', '확인');
            return;
        }
    }else if(scfggMkty_new == "3"){
        if(scfggUla1_new == "" || scfggUla2_new == ""){
            navigator.notification.alert(msg.checkScfggMkty,'','알림', '확인');
            return;
        }
    }

    navigator.notification.confirm(msgText, function(btnIndex){
        if(btnIndex == 1){
            var commomParams = {};
            var sendParams = {};
            var buldParams = {};
            var spotParams = {};

            var sn = $("#sn").val();
            var sigCd = app.info.sigCd;
            var workId = app.info.opeId;


            /** 공통 */
            //설치지점
            var instSpotCd_new = $("#instSpotCd_new").text();
            if(instSpotCd_new != ""){
                sendParams = $.extend(sendParams, {instSpotCd: instSpotCd_new});
            }
            //교차로유형
            var instCrossCd_new = $("#instCrossCd_new").text();
            if(instCrossCd_new !=""){
                sendParams = $.extend(sendParams, {instCrossCd: instCrossCd_new});
            }
            //사용대상
            var useTarget_new = $("#useTarget_new").text();
            if(useTarget_new !=""){
                sendParams = $.extend(sendParams, {useTarget: useTarget_new});
            }
            //제2외국어여부
            var scfggMkty_new = $("#scfggMkty_new").text();
            if(scfggMkty_new !=""){
                sendParams = $.extend(sendParams, {scfggMkty: scfggMkty_new});
            }
            //언어1
            var scfggUla1_new = $("#scfggUla1_new").text();
            if(scfggUla1_new !=""){
                sendParams = $.extend(sendParams, {scfggUla1: scfggUla1_new});
            }
            //언어2
            var scfggUla2_new = $("#scfggUla2_new").text();
            if(scfggUla2_new !=""){
                sendParams = $.extend(sendParams, {scfggUla2: scfggUla2_new});
            }
            //규격(가로)
            var gdftyWide_new = $("#gdftyWide_new").text();
            if(gdftyWide_new !=""){
                sendParams = $.extend(sendParams, {gdftyWide: gdftyWide_new});
            }
            //규격(세로)
            var gdftyVertical_new = $("#gdftyVertical_new").text();
            if(gdftyVertical_new !=""){
                sendParams = $.extend(sendParams, {gdftyVertical: gdftyVertical_new});
            }
            //규격(두께)
            var gdftyThickness_new = $("#gdftyThickness_new").text();
            if(gdftyThickness_new !=""){
                sendParams = $.extend(sendParams, {gdftyThickness: gdftyThickness_new});
            }
            //단가
            var gdftyUnitPrice_new = $("#gdftyUnitPrice_new").text();
            if(gdftyUnitPrice_new !=""){
                sendParams = $.extend(sendParams, {gdftyUnitPrice: gdftyUnitPrice_new});
            }
            // //설치상태
            // var delStateCd_new = $("#delStateCd_new").text() == ''?$("#delStateCd").text():$("#delStateCd_new").text();
            // if(delStateCd_new !=""){
            //     sendParams = $.extend(sendParams, {delStateCd: delStateCd_new});
            // }
            //점검결과
            var rcRslt_new = $("#rcRslt_new").text();
            if(rcRslt_new !=""){
                sendParams = $.extend(sendParams, {rcRslt: rcRslt_new});
            }
            //점검상태
            var rcSttCd_new = $("#rcSttCd_new").text();
            if(rcSttCd_new !=""){
                sendParams = $.extend(sendParams, {rcSttCd: rcSttCd_new});
            }
            //점검타입
            // var checkType = $("#checkType").text();
            // sendParams = $.extend(sendParams, {checkType: checkType});

            //점검자명
            var checkUserNm = app.info.opeNm;

            sendParams = $.extend(sendParams, {checkUserNm: checkUserNm});

            var prtTy_new = $("#prtTy_new").text();
            if(prtTy_new !=""){
                sendParams = $.extend(sendParams, {prtTy: prtTy_new});
            }

            sendParams = $.extend(sendParams, {
                svcNm: 'uSPGF',
                sn: sn,
                sigCd: sigCd,
                workId: workId,
                checkDate: util.getToday()
            });

            if(type == DATA_TYPE.RDPQ){
                //도로명판 규격
                var rdpqGdSd_new = $("#rdpqGdSd_new").text();
                if(rdpqGdSd_new !=""){
                    sendParams = $.extend(sendParams, {rdpqGdSd: rdpqGdSd_new});
                }
                //명판방향
                var plqDirection_new = $("#plqDirection_new").text();
                if(plqDirection_new !=""){
                    sendParams = $.extend(sendParams, {plqDirection: plqDirection_new});
                }

                //앞면도로명(국문)
                var frontKoreanRoadNm_new = $("#frontKoreanRoadNm_new").text();
                if(frontKoreanRoadNm_new !=""){
                    sendParams = $.extend(sendParams, {frontKoreanRoadNm: frontKoreanRoadNm_new});
                }

                //앞면시작기초번호 본번
                var frontStartBaseMasterNo_new = $("#frontStartBaseMasterNo_new").text();
                if(frontStartBaseMasterNo_new !=""){
                    sendParams = $.extend(sendParams, {frontStartBaseMasterNo: frontStartBaseMasterNo_new});
                }
                //앞면시작기초번호 부번
                var frontStartBaseSlaveNo_new = $("#frontStartBaseSlaveNo_new").text();
                if(frontStartBaseSlaveNo_new !=""){
                    sendParams = $.extend(sendParams, {frontStartBaseSlaveNo: frontStartBaseSlaveNo_new});
                }
                //앞면종료기초번호 본번
                var frontEndBaseMasterNo_new = $("#frontEndBaseMasterNo_new").text();
                if(frontEndBaseMasterNo_new !=""){
                    sendParams = $.extend(sendParams, {frontEndBaseMasterNo: frontEndBaseMasterNo_new});
                }
                //앞면종료기초번호 부번
                var frontEndBaseSlaveNo_new = $("#frontEndBaseSlaveNo_new").text();
                if(frontEndBaseSlaveNo_new !=""){
                    sendParams = $.extend(sendParams, {frontEndBaseSlaveNo: frontEndBaseSlaveNo_new});
                }
                //뒷면도로명(국문)
                var backKoreanRoadNm_new = $("#backKoreanRoadNm_new").text();
                if(backKoreanRoadNm_new !=""){
                    sendParams = $.extend(sendParams, {backKoreanRoadNm: backKoreanRoadNm_new});
                }

                //뒷면시작기초번호 본번
                var backStartBaseMasterNo_new = $("#backStartBaseMasterNo_new").text();
                if(backStartBaseMasterNo_new !=""){
                    sendParams = $.extend(sendParams, {backStartBaseMasterNo: backStartBaseMasterNo_new});
                }
                //뒷면시작기초번호 부번
                var backStartBaseSlaveNo_new = $("#backStartBaseSlaveNo_new").text();
                if(backStartBaseSlaveNo_new !=""){
                    sendParams = $.extend(sendParams, {backStartBaseSlaveNo: backStartBaseSlaveNo_new});
                }
                //뒷면종료기초번호 본번
                var backEndBaseMasterNo_new = $("#backEndBaseMasterNo_new").text();
                if(backEndBaseMasterNo_new !=""){
                    sendParams = $.extend(sendParams, {backEndBaseMasterNo: backEndBaseMasterNo_new});
                }
                //뒷면종료기초번호 부번
                var backEndBaseSlaveNo_new = $("#backEndBaseSlaveNo_new").text();
                if(backEndBaseSlaveNo_new !=""){
                    sendParams = $.extend(sendParams, {backEndBaseSlaveNo: backEndBaseSlaveNo_new});
                }

                commomParams = $.extend(sendParams, {
                    type :type

                    // rdpqGdSd: rdpqGdSd_new,
                    // plqDirection: plqDirection_new,

                    // frontStartBaseMasterNo: frontStartBaseMasterNo_new,
                    // frontStartBaseSlaveNo: frontStartBaseSlaveNo_new,
                    // frontEndBaseMasterNo: frontEndBaseMasterNo_new,
                    // frontEndBaseSlaveNo: frontEndBaseSlaveNo_new,

                    // backStartBaseMasterNo: backStartBaseMasterNo_new,
                    // backStartBaseSlaveNo: backStartBaseSlaveNo_new,
                    // backEndBaseMasterNo: backEndBaseMasterNo_new,
                    // backEndBaseSlaveNo: backEndBaseSlaveNo_new,

                });

                var link = URLs.updateFacilityInfo;


            }else if(type == DATA_TYPE.AREA){
                //한글도로명
                var area_areaKorRn_new = $("#area_areaKorRn_new").text();
                if(area_areaKorRn_new !=""){
                    sendParams = $.extend(sendParams, {area_areaKorRn: area_areaKorRn_new});
                }
                //지역안내판 광고여부에따른 분류
                var area_advrtsCd_new = $("#area_advrtsCd_new").text();
                if(area_advrtsCd_new !=""){
                    sendParams = $.extend(sendParams, {area_advrtsCd: area_advrtsCd_new});
                }
                //지역안내판 광고내용
                var area_advCn_new = $("#area_advCn_new").text();
                if(area_advCn_new !=""){
                    sendParams = $.extend(sendParams, {area_advCn: area_advCn_new});
                }
                //지역안내판 기타내용
                var area_etcCn_new = $("#area_etcCn_new").text();
                if(area_etcCn_new !=""){
                    sendParams = $.extend(sendParams, {area_etcCn: area_etcCn_new});
                }
                //지역안내판 규격
                var area_areaGdSd_new = $("#area_areaGdSd_new").text();
                if(area_areaGdSd_new !=""){
                    sendParams = $.extend(sendParams, {area_areaGdSd: area_areaGdSd_new});
                }
                //지역안내판 설치위치
                var area_insPlc_new = $("#area_insPlc_new").text();
                if(area_insPlc_new !=""){
                    sendParams = $.extend(sendParams, {area_insPlc: area_insPlc_new});
                }


                commomParams = $.extend(sendParams, {
                    type :type
                    // area_advrtsCd: area_advrtsCd_new,
                    // area_advCn: area_advCn_new,
                    // area_etcCn: area_etcCn_new,
                    // area_areaGdSd: area_areaGdSd_new
                });

                var link = URLs.updateFacilityInfo;
            }else if(type == DATA_TYPE.BSIS){
                //한글도로명
                var bsis_korRn_new = $("#bsis_korRn_new").text();
                if(bsis_korRn_new !=""){
                    sendParams = $.extend(sendParams, {bsis_korRn: bsis_korRn_new});
                }
                //기초번호판 곡면 분류
                var bsis_planeCd_new = $("#bsis_planeCd_new").text();
                if(bsis_planeCd_new !=""){
                    sendParams = $.extend(sendParams, {bsis_planeCd: bsis_planeCd_new});
                }
                //기초번호판 규격
                var bsis_bsisGdSdLbl_new = $("#bsis_bsisGdSd_new").text();
                if(bsis_bsisGdSdLbl_new !=""){
                    sendParams = $.extend(sendParams, {bsis_bsisGdSd: bsis_bsisGdSdLbl_new});
                }
                //표기방법
                var bsisMthd_new = $("#bsisMthd_new").text();
                if(bsisMthd_new !=""){
                    sendParams = $.extend(sendParams, {bsisMthd: bsisMthd_new});
                }
                //설치시설물 기타 상세내용
                var bsis_insFtyDc_new = $("#bsis_insFtyDc_new").text();
                if(bsis_insFtyDc_new !=""){
                    sendParams = $.extend(sendParams, {bsis_insFtyDc: bsis_insFtyDc_new});
                }
                

                commomParams = $.extend(sendParams, {
                    type :type
                    // bsis_planeCd: bsis_planeCd_new
                });

                var link = URLs.updateFacilityInfo;

            }else if(type == DATA_TYPE.ENTRC){
                //설치상태
                var delStateCd_new = $("#delStateCd_new").text();
                if(delStateCd_new !=""){
                    buldParams = $.extend(buldParams, {delStateCd: delStateCd_new});
                }
                //건물번호판 유형
                var buldNmtSe_new = $("#buldNmtSe_new").text();
                if(buldNmtSe_new !=""){
                    buldParams = $.extend(buldParams, {buldNmtSe: buldNmtSe_new});
                }
                //건물번호판 용도
                var buldNmtPurpose_new = $("#buldNmtPurpose_new").text();
                if(buldNmtPurpose_new !=""){
                    buldParams = $.extend(buldParams, {buldNmtPurpose: buldNmtPurpose_new});
                }
                //건물번호판 규격
                var buldNmtCd_new = $("#buldNmtCd_new").text();
                if(buldNmtCd_new !=""){
                    buldParams = $.extend(buldParams, {buldNmtCd: buldNmtCd_new});
                }
                //건물번호판 제작유형
                var buldMnfCd_new = $("#buldMnfCd_new").text();
                if(buldMnfCd_new !=""){
                    buldParams = $.extend(buldParams, {buldMnfCd: buldMnfCd_new});
                }
                //건물번호판 재질
                var buldNmtMaterial_new = $("#buldNmtMaterial_new").text();
                if(buldNmtMaterial_new !=""){
                    buldParams = $.extend(buldParams, {buldNmtMaterial: buldNmtMaterial_new});
                }

                //단가
                if(gdftyUnitPrice_new !=""){
                    buldParams = $.extend(buldParams, {buldNmtUnitPrice: gdftyUnitPrice_new});
                }
                //기로
                if(gdftyWide_new !=""){
                    buldParams = $.extend(buldParams, {buldNmtWide: gdftyWide_new});
                }
                //세로
                if(gdftyVertical_new !=""){
                    buldParams = $.extend(buldParams, {buldNmtVertical: gdftyVertical_new});
                }
                //두께
                if(gdftyThickness_new !=""){
                    buldParams = $.extend(buldParams, {buldNmtThickness: gdftyThickness_new});
                }


                commomParams = $.extend(buldParams, {
                    sn           : sn,
                    sigCd        : sigCd,
                    workId       : app.info.opeId,
                    // entManNo     : $("#entManNo").val(),
                    // imageFilesSn : $("#imageFileSn").val()
                    // //사진파일
                    // files: files,

                    // delStateCd : delStateCd_new,
                    // buldNmtSe: buldNmtSe_new,
                    // buldNmtPurpose: buldNmtPurpose_new,
                    // buldNmtCd: buldNmtCd_new,
                    // buldMnfCd: buldMnfCd_new,
                    // buldNmtMaterial: buldNmtMaterial_new,


                    // //단가
                    // buldNmtUnitPrice: gdftyUnitPrice_new,
                    // //가로
                    // buldNmtWide: gdftyWide_new,
                    // //세로
                    // buldNmtVertical: gdftyVertical_new,
                    // //두께
                    // buldNmtThickness: gdftyThickness_new,

                });

                var link = URLs.updateBuildNumberInfo;

            }else if(type == DATA_TYPE.BULD){
                //용도
                var bdtypCd_new = $("#bdtypCd_new").text();
                if(bdtypCd_new !=""){
                    buldParams = $.extend(buldParams, {bdtypCd: bdtypCd_new});
                }
                //건물종속여부
                var bulDpnSe_new = $("#bulDpnSe_new").text();
                if(bulDpnSe_new !=""){
                    buldParams = $.extend(buldParams, {bulDpnSe: bulDpnSe_new});
                }
                //건물명
                var posBulNm_new = $("#posBulNm_new").text();
                if(posBulNm_new !=""){
                    buldParams = $.extend(buldParams, {posBulNm: posBulNm_new});
                }
                //건물명(영)
                var bulEngNm_new = $("#bulEngNm_new").text();
                if(bulEngNm_new !=""){
                    buldParams = $.extend(buldParams, {bulEngNm: bulEngNm_new});
                }
                //상세건물명
                var buldNmDc_new = $("#buldNmDc_new").text();
                if(buldNmDc_new !=""){
                    buldParams = $.extend(buldParams, {buldNmDc: buldNmDc_new});
                }
                //건물층수(지상층)
                var groFloCo_new = $("#groFloCo_new").text();
                if(groFloCo_new !=""){
                    buldParams = $.extend(buldParams, {groFloCo: groFloCo_new});
                }
                //건물층수(지하층)
                var undFloCo_new = $("#undFloCo_new").text();
                if(undFloCo_new !=""){
                    buldParams = $.extend(buldParams, {undFloCo: undFloCo_new});
                }
                //건물상태
                var buldSttus_new = $("#buldSttus_new").text();
                if(buldSttus_new !=""){
                    buldParams = $.extend(buldParams, {buldSttus: buldSttus_new});
                }
                //메모
                var buldMemo_new = $("#buldMemo_new").text();
                if(buldMemo_new !=""){
                    buldParams = $.extend(buldParams, {buldMemo: buldMemo_new});
                }
                //건물군번호
                var eqbManSn = $("#eqbManSn").val();
                
                buldParams = $.extend(buldParams, {eqbManSn: eqbManSn});
                

                commomParams = $.extend(buldParams, {
                    bulManNo : sn,
                    sigCd: sigCd,
                    workId :workId
                    // //사진파일
                    // files: files,

                    // bdtypCd : bdtypCd_new,
                    // bulDpnSe : bulDpnSe_new,
                    // posBulNm : posBulNm_new,
                    // bulEngNm : bulEngNm_new,
                    // buldNmDc : buldNmDc_new,
                    // groFloCo : groFloCo_new,
                    // undFloCo : undFloCo_new,
                    // buldSttus : buldSttus_new,
                    // buldMemo : buldMemo_new,

                });

                var link = URLs.updateBuilingInfo;
            }else if(type == DATA_TYPE.SPPN){

                var link = URLs.updateSpotInfo;

                //메모
                var checkComment_new = $("#checkComment_new").text();
                if(checkComment_new != ""){
                    spotParams = $.extend(spotParams, {chkSum: checkComment_new});
                }
                
                commomParams = $.extend(spotParams, {
                    sn           : sn,
                    sigCd        : sigCd,
                    workId       : app.info.opeId,
                    // entManNo     : $("#entManNo").val(),
                    // imageFilesSn : $("#imageFileSn").val()
                    // //사진파일
                    // files: files,

                    // delStateCd : delStateCd_new,
                    // buldNmtSe: buldNmtSe_new,
                    // buldNmtPurpose: buldNmtPurpose_new,
                    // buldNmtCd: buldNmtCd_new,
                    // buldMnfCd: buldMnfCd_new,
                    // buldNmtMaterial: buldNmtMaterial_new,


                    // //단가
                    // buldNmtUnitPrice: gdftyUnitPrice_new,
                    // //가로
                    // buldNmtWide: gdftyWide_new,
                    // //세로
                    // buldNmtVertical: gdftyVertical_new,
                    // //두께
                    // buldNmtThickness: gdftyThickness_new,

                });
            }


            util.showProgress();
            var url = URLs.postURL(link, commomParams);
            util.postAJAX({}, url).then(
                function (context, rCode, results) {
                    //통신오류처리
                    if (rCode != 0 || results.response.status < 0) {
                        navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                        util.dismissProgress();
                        return;
                    }

                    util.toast('변경사항이 적용되었습니다');

                    $("p[name*='newLbl']").text('');

                    closeDetailView();

                    closePopupAndClearMap(type);

                    util.dismissProgress();

                },
                util.dismissProgress
            );

        }
    }, "알림", ["확인","취소"]);

}

function closePopupAndClearMap(type){
    try {
        // 심플팝업이 2개 이상 떠있는 경우 닫지 않음
        var popLength = $("#popup-content").children().length / 2; // 엘리먼트 갯수
        if(popLength > 1){
            //심플팝업 초기화
            $("#popup-content").empty();
            $("#popup").hide();
            
            var LT_CHC_YN_SUM = 0;
            for(var i in featureClone){
                LT_CHC_YN_SUM = LT_CHC_YN_SUM + parseInt(featureClone[i].get("LT_CHC_YN"));
            }
            
            if(LT_CHC_YN_SUM < popLength){
                selectFeatureInfo(featureClone);
            }
            
        }else{
            //심플팝업 초기화
            $("#popup-content").empty();
            $("#popup").hide();
        }
        //심플팝업 초기화
        $("#popup-content").empty();
        $("#popup").hide();
    } catch (error) {
        
    }

}

function setGdft(){

    
    var oldCode = $("#"+popID).text();
    var newCode = $("#"+popID+"_new").text();
    
    //새로운 규격이 빈칸일경우
    if(newCode == ""){
        //새로운 데이터창 초기화
        $("#gdftyWide_new").text('');
        $("#gdftyVertical_new").text('');
        $("#gdftyThickness_new").text('');
        //새로운 라벨창 초기화 및 숨기기
        $("#gdftyWVT_new").text('');
        $("#gdftyWVT_new").hide();
        //기존라벨 보이기
        $("#gdftyWVT").show();

        return;
    }

    var newLbl = $("#"+popID+"Lbl_new").text();

    var rdpqGdSdLblList = newLbl.split('*');

    var gdftyWide_new = $("#gdftyWide_new").text(rdpqGdSdLblList[0]);
    var gdftyVertical_new = $("#gdftyVertical_new").text(rdpqGdSdLblList[1]);
    var gdftyThickness = $("#gdftyThickness_new").text() == ""? $("#gdftyThickness").text():$("#gdftyThickness_new").text();
    $("#gdftyThickness_new").text(gdftyThickness);
    var gdftyWVT_new = "{0}*{1}*{2}".format(rdpqGdSdLblList[0],rdpqGdSdLblList[1],gdftyThickness);
    $("#gdftyWVT_new").text(gdftyWVT_new);

    $("#gdftyWVT_new").show();
    $("#gdftyWVT").hide();
}
function setbdtypCd(){
   var bdtypCd_main_old = $("#bdtypCd_main").text();
   var bdtypCd_main_new = $("#bdtypCd_main_new").text();

   if(bdtypCd_main_new == ""){
       //새로운 데이터창 초기화
       $("#bdtypCd_new").text('');
       //새로운 라벨창 초기화 및 숨기기
       $("#bdtypCdLbl_new").text('');
       $("#bdtypCdLbl_new").hide();
       //기존라벨 보이기
       $("#bdtypCdLbl").show();
       return;
   }

   $("#bdtypCdLbl_new").text('소분류를 선택해 주세요.');
   $("#bdtypCd_new").text('');

   $("#bdtypCdLbl").hide();
   $("#bdtypCdLbl_new").show();


}
function scfggUlaNewClear(){
    $("#scfggUla1_new").text("");
    $("#scfggUla2_new").text("");
    $("#scfggUla1Lbl_new").text("");
    $("#scfggUla2Lbl_new").text("");
}
function setScfggMkty(){
    var editText = "선택하세요";
    var scfggMktOld = $("#scfggMkty").text();
    var scfggMktNew = $("#scfggMkty_new").text();

    var plqDirectionLbl_new = $("#plqDirectionLbl_new").text();
    var useTarget_new = $("#useTarget_new").text();

    if(scfggMktNew == ""){
        scfggUlaNewClear();

        $("#scfggUla1Lbl_new").hide();
        $("#scfggUla2Lbl_new").hide();

        $("#scfggUla1Lbl").show();
        $("#scfggUla2Lbl").show();

        // 사용대상이나 안내시설 방향이 변경되어 있는 상태 확인
        if(plqDirectionLbl_new == "" && useTarget_new == ""){
            setGdSdReset();
            return;
        }
    }else if(scfggMktNew == "1"){
        scfggUlaNewClear();
        
        $("#scfggUla1Lbl").hide();
        $("#scfggUla2Lbl").hide();
        $("#scfggUla1Lbl_new").show();
        $("#scfggUla2Lbl_new").show();

        
    }else if(scfggMktNew == "2"){
        $("#scfggUla1Lbl_new").text(editText);
        $("#scfggUla2Lbl_new").text("");

        $("#scfggUla1Lbl_new").addClass("edit");

        $("#scfggUla1_new").text("");
        $("#scfggUla2_new").text("");
        
        $("#scfggUla1Lbl").hide();
        $("#scfggUla2Lbl").hide();

        $("#scfggUla1Lbl_new").show();
    }else if(scfggMktNew == "3"){
        $("#scfggUla1Lbl_new").text(editText);
        $("#scfggUla2Lbl_new").text(editText);

        $("#scfggUla1Lbl_new").addClass("edit");
        $("#scfggUla2Lbl_new").addClass("edit");

        $("#scfggUla1_new").text("");
        $("#scfggUla2_new").text("");

        $("#scfggUla1Lbl").hide();
        $("#scfggUla2Lbl").hide();

        $("#scfggUla1Lbl_new").show();
        $("#scfggUla2Lbl_new").show();
    }
    
    
    //규격처리
    if(scfggMktNew != ""){
        //미표기 -> 단독언어 ,2개언어  또는 단독언어, 2개언어 -> 미표기
        if((scfggMktOld == "1" && scfggMktNew != "1") || (scfggMktOld != "1" && scfggMktNew == "1")){
            var id = $("#detailView").children()[0].id;
            //도로명판일때만 규격 초기화
            if(id == "roadView_page"){
                    setGdSd();
            }
        }
    }
    
    
}
function setGdSd(){
    var editText = "선택하세요";

    $("#rdpqGdSdLbl_new").text(editText);
    $("#gdftyWVT_new").text(editText);

    $("#rdpqGdSd_new").text("");
    $("#gdftyWide_new").text("");
    $("#gdftyVertical_new").text("");
    $("#gdftyThickness_new").text("");
    
    $("#rdpqGdSdLbl_new").addClass("edit");
    $("#gdftyWVT_new").addClass("edit");

    $("#rdpqGdSdLbl").hide();
    $("#gdftyWVT").hide();
    $("#rdpqGdSdLbl_new").show();
    $("#gdftyWVT_new").show();
}
function setGdSdReset(){
    
    $("#rdpqGdSdLbl_new").text("");
    $("#rdpqGdSd_new").text("");
    
    $("#rdpqGdSdLbl").show();
    $("#rdpqGdSdLbl_new").hide();

    $("#gdftyWVT_new").text("");

    $("#gdftyWide_new").text("");
    $("#gdftyVertical_new").text("");
    $("#gdftyThickness_new").text("");

    $("#gdftyWVT_new").hide();
    $("#gdftyWVT").show();
}

function photoMode(){
   var picImg = $(".picImg");
   var length = $(".picImg").length;
   var photoModeGbn = false;
   for(var index = 0 ; index < picImg.length; index ++ ){
       if($(".picImg")[index].lastChild != null){
            photoModeGbn = true;
       }
   }

   return photoModeGbn;
}

function closePhotoView(force){
    if(MapUtil.photo.isEdited() && !force){
        navigator.notification.confirm(msg.lossPhotoClose, function(btnIndex){
            switch(btnIndex) {
                case 1: //닫기
                    $("#photoDialog").hide();
                    $("#mask").hide();
                    //확대창 삭제
                    $(".smartphoto").parents("div").remove();
                    //사진창 클리어
                    $(".picImg").children().remove();
                    MapUtil.photo.refresh();

                    break;
                case 2: //취소
                    break;
            }
        }, "알림", ["확인","취소"]);
    } else {
        $("#photoDialog").hide();
        $("#mask").hide();
        //확대창 삭제
        $(".smartphoto").parents("div").remove();
        //사진창 클리어
        $(".picImg").children().remove();
    }

}

function makeImg(){
    var files = [];
    var trgSn = $("#trgSn").val();
    var date = util.getToday();
    var title = $(".infoHeader .title .label").text();

    $(".picImg a img").each(function(i, o){
        var data = new Object() ;
        var picInfo = $(o).parent().parent().parent();
        var picType = picInfo.data('picType');
        var state;
        if(picType == "L"){
            state = MapUtil.photo.state.L;
        }else if(picType == "M"){
            state = MapUtil.photo.state.M;
        }else{
            return;
        }

        if(state.edited){
            data.base64 = $(o).attr("src").replace(/.+base64,/,'');
            data.imageFilesSn = picInfo.data('picSn');
            data.tbGbn = picInfo.data('picType');
            data.name = '{0}_{1}_{2}.jpg'.format(date, title, data.tbGbn);
            // data.name = '{0}_{1}.jpg'.format(date, data.tbGbn);

            files.push(data);
        }
        
    });

    return files;
}

function wrapWindowByMask(id){
    //화면의 높이와 너비를 구한다.
    var maskHeight = $(document).height();
    var maskWidth = $(window).width();

    var maskTop = 0;

    if(id == "memoMask"){
        var searchBarH = $(".ui-input-search").height();

        maskWidth = maskWidth + searchBarH;
    }else{
        // var openImageH = $(".openImage").height();
        // var infoHeaderH = $(".infoHeader").height();

        maskTop = 98;
    }

    //마스크의 높이와 너비를 화면 것으로 만들어 전체 화면을 채운다.
    $('#'+id).css({'width':maskWidth,'height':maskHeight,'top':maskTop});

    //애니메이션 효과
    // $('#mask').fadeIn(1000);
    $('#'+id).fadeTo("slow",0.5);
}

function clearMask(){
   $("#mask").attr("style","");
}

function saveImg(type){
    // 사진 변경(촬영) 여부 확인
    if(!MapUtil.photo.isEdited()) {
        navigator.notification.alert(msg.noSave,'','알림', '확인');
        return;
    }

    //사진파일
    var files = makeImg();
    var valid = true;

    switch(files.length) {
        case 0:
            valid = false;
            break;
        case 1:
            if(type != DATA_TYPE.SPPN && type != DATA_TYPE.ADRDC){
                valid = false;
            }
            break;
    }

    if(!valid) {
        navigator.notification.alert(msg.noPhoto,'','알림', '확인');
        return;
    }

    navigator.notification.confirm(msg.isSavePhoto, function(btnindex){
        if(btnindex == 1){
            var params = {
                sn: $("#sn").val(),
                rdFtyLcSn: $("#rdFtyLcSn").val(),
                sigCd: app.info.sigCd,
                checkDate: util.getToday(),
                workId: app.info.opeId,
                opeNm : app.info.opeNm,
                checkUserNm : app.info.opeNm,
                checkType : $("#checkType").text(),
                files: files
            };

            var link, relink;
            switch(type) {
                case DATA_TYPE.RDPQ:
                case DATA_TYPE.AREA:
                case DATA_TYPE.BSIS:
                    link = URLs.updateSpgfImg;
                    relink = URLs.roadsignlink;
                    break;
                case DATA_TYPE.ENTRC:
                    link = URLs.updateBuildNumberInfo;
                    break;
                case DATA_TYPE.SPPN:
                    link = URLs.updateSpotInfo;
                    break;
                case DATA_TYPE.ADRDC:
                    link = URLs.insertBaseResearch;
                    break;
            }

            util.showProgress();
            var url = URLs.postURL(link, params);
            util.postAJAX({}, url)
            .then(
                function (context, rCode, results) {
                    util.dismissProgress();
                    try {
                        //통신오류처리
                        if (rCode != 0 || results.response.status < 0) {
                            navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                            return;
                        }

                        util.toast('사진이 변경되었습니다.');

                        //사진건수
                        if(type == DATA_TYPE.RDPQ){
                            var link = URLs.roadsignlink;
                        }else if(type == DATA_TYPE.AREA){
                            var link = URLs.roadsignlink;
                        }else if(type == DATA_TYPE.BSIS){
                            var link = URLs.roadsignlink;
                        }else if(type == DATA_TYPE.ENTRC){
                            var link = URLs.entrclink;

                            params = $.extend(params, {
                                sn : featureClone[0].get('BUL_MAN_NO')
                            });
                        }else if(type == DATA_TYPE.SPPN){
                            var link = URLs.spotSelectlink;
                        }else if(type == DATA_TYPE.ADRDC){
                            var link = URLs.addresslink;
                        }

                        // 사진 저장 후 전체 건 수 다시 조회
                        var url = URLs.postURL(link, params);
                        util.postAJAX({}, url)
                        .then(
                            function (context, rCode, results) {
                                util.dismissProgress();
                                //통신오류처리
                                if (rCode != 0 || results.response.status < 0) {
                                    navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                                    return;
                                }

                                var data = results.data;

                                $(".infoHeader .photo .photoNum").html(data.cntFiles);
                            }
                        );
                        closePhotoView(true);   // force

                        if(type == DATA_TYPE.RDPQ||type == DATA_TYPE.AREA||type == DATA_TYPE.BSIS){
                            MapUtil.setValues(layerID, relink, rdGdftySn);

                            //지도 초기화
                            getVectorSource(map , "위치레이어").clear();
                        }
                    }catch(e) {
                        util.toast('데이터 처리에 문제가 발생 하였습니다. 잠시후 다시 시도해 주세요.');
                    }
                    util.dismissProgress();
                },
                util.dismissProgress
            );
        }
    }, "알림", ["저장","취소"]);

}
//일제점검 점검일자 update
function updateResearchWorkDate(){
    navigator.notification.confirm(msg.updateWorkDate, function(btnindex){

        if(btnindex == 1){
            
            var sendParams = {};

            var sn = $("#sn").val();
            var rdFtyLcSn = $('#rdFtyLcSn').val();
            //점검대상구분 (01: 도로명판, 02:건물번호판, 03:기초번호판, 04:지역안내판)
            var trgGbn = $("#trgGbn").text();
            //일제조사 계획 미배정시 0 배정시 1
            var plnOdr = 0;

            // var sigCd = app.info.sigCd;
            //구제시 때문에 해당 시설물 시설물코드 필요
            var sigCd = $("#sigCd").val();

            if(sigCd == ''){
                app.info.sigCd;
            }
            var workId = app.info.opeId;
            // var opeNm = app.info.opeNm;
            var rcSttCd = $("#rcSttCd_new").text() == ''? $("#rcSttCd").text() : $("#rcSttCd_new").text();

            if(rcSttCd == ''){
                navigator.notification.alert('점검상태를 선택하세요.', '', '알림', '확인');
                return;
            }
           
            //필수사항
            sendParams = $.extend(sendParams, {
                sn: sn,
                trgLocSn :rdFtyLcSn,
                plnOdr: plnOdr,
                trgGbn: trgGbn,
                sigCd: sigCd,
                rcrSn: app.info.rcrSn,
                workId : workId,
                rcSttCd : rcSttCd
            });

            //점검결과
            var rcRslt_new = $("#rcRslt_new").text();
            if(rcRslt_new != ''){
                sendParams = $.extend(sendParams, {rcRslt : rcRslt_new})
            }

            var link = URLs.updateResearchWorkDate;

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

                    util.toast('점검일자가 갱신되었습니다.');

                    // $("p[name*='newLbl']").text('');

                    // closeDetailView();

                    //시설물 번호 전역변수
                    trgSnGlobal = trgSn
                    MapUtil.openDetail(trgGbn, null);

                    closePopupAndClearMap(trgGbn);

                    util.dismissProgress();

                },
                util.dismissProgress
            );
        }
    }, "알림", ["확인","취소"]);

}

//점검날짜 update(사용안 할 예정)
function updateWorkDate(){
    navigator.notification.confirm(msg.updateWorkDate, function(btnindex){

        if(btnindex == 1){

            var sendParams = {};

            var sn = $("#sn").val();
            var sigCd = app.info.sigCd;
            var workId = app.info.opeId;
            var checkUserNm = app.info.opeNm;
            var delStateCd = $("#delStateCd_new").text() == ''? $("#delStateCd").text() : $("#delStateCd_new").text();
            var checkType = $("#checkType").text(); //01 수시점검, 02 개별점검
            var checkComment = $("#checkComment_new").text() == ''? $("#checkComment").text() : $("#checkComment_new").text();

            sendParams = $.extend({}, {
                sn: sn,
                sigCd: sigCd,
                workId : workId,
                checkUserNm: checkUserNm,
                delStateCd : delStateCd,
                checkType : checkType,
                checkComment : checkComment

            });

            var link = URLs.updateWorkDate;

            util.showProgress();
            var url = URLs.postURL(link, sendParams);
            util.postAJAX({}, url)
            .then(
                function (context, rCode, results) {
                    //통신오류처리
                    if (rCode != 0 || results.response.status < 0) {
                        navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                        util.dismissProgress();
                        return;
                    }

                    util.toast('점검일자가 갱신되었습니다.');

                    $("p[name*='newLbl']").text('');

                    closeDetailView();

                    closePopupAndClearMap();

                    util.dismissProgress();

                },
                util.dismissProgress
            );
        }
    }, "알림", ["확인","취소"]);

}


function checkPrice(type){

    var standPrice = 1000;
    if(type == "ENTRC"){
        standPrice = 1000;
    }else{
        standPrice = 10000;
    }
    
    var price =$("#gdftyUnitPrice_fix").val();

    if(standPrice > price){
        navigator.notification.alert("단가는 " + standPrice + "원 이하로 입력할수 없습니다.", function () {
            // targetText.val(targetText.val().substring(0, size));
            // targetText.focus();
            return;
        }, '알림', '확인');
    }else{
        textDataSendParent('gdftyUnitPrice');
    }

}

function goPopBuild(){
    var sn = $("#trgLocSn").val();
    trgSnGlobal = $("#trgSn").val();
    MapUtil.openDetail(DATA_TYPE.BULD, sn);
}

function goPopNmtg(){
    // var sn = $("#trgSn").val();
    // trgSnGlobal = sn;
    MapUtil.openDetail(DATA_TYPE.ENTRC, trgSnGlobal);
}

//정비내용 저장
function modify(){

    // var notNull = $(".notNull");
    // var notNullLength = $(".notNull").length;
    // for(i in notNull){
    //     var value = $(".notNull")[i].value;
    //     if(value == ""){
    //         navigator.notification.alert(msg.notNullData, '', '알림', '확인');
    //         var id = $(".notNull")[i].id;
    //         $("#"+id).focus();
    //         return;
    //     }
    // }

    if(changedIdList.length == 0){
        navigator.notification.alert(msg.noSave, '', '알림', '확인');
        return;
    }

    //재 저장 메시지(규격 정보 없는 경우 메시지 변경됨)
    var isUpdtGbn = $("#isUpdtGbn").val();
    var msgText = msg.isSave;
    if(isUpdtGbn.indexOf("D") != -1){
        msgText = msg.isSaveAgain;
    }
        
    //점검정보
    var workId = app.info.opeId;
    var rcrSn = app.info.rcrSn;
    var mtchSn = $("#mtchSn").val();
    var plnYr = util.getToday().substr(0,4);
    var plnOdr = $("#plnOdr").val();

    var trgSn = $("#trgSn").val();
    var trgLocSn = $("#trgLocSn").val();
    var trgGbn = $("#trgGbn").val();
    var sigCd = $("#sigCd").val();

    var commomParams = {
        sigCd : sigCd,
        workId : workId,
        rcrSn : rcrSn,
        plnYr : plnYr,
        plnOdr : plnOdr,
        trgSn : trgSn,
        trgLocSn : trgLocSn,
        trgGbn : trgGbn,
        mtchSn : mtchSn

    };

    //** 안내시설물 */
    if(trgGbn != "02" && trgGbn != "99"){

        //설치지점
        var instSpotCd = $("#instSpotCd").val();
        if(instSpotCd == null){
            navigator.notification.alert(msg.dontInsertNull.format("설치지점"), function(){
                util.dismissProgress();
            }, '알림', '확인');
            return;
        }
        //조명여부
        var lghtCd = $("#lghtCd").val();
        if(lghtCd == null){
            navigator.notification.alert(msg.dontInsertNull.format("조명여부"), function(){
                util.dismissProgress();
            }, '알림', '확인');
            return;
        }
        //교차로유형
        var instCrossCd = $("#instCrossCd").val();
        if(instCrossCd == null){
            navigator.notification.alert(msg.dontInsertNull.format("교차로유형"), function(){
                util.dismissProgress();
            }, '알림', '확인');
            return;
        }

        //안내시설형식(규격참고용)// 모든 시설물 공통
        var gdftyForm = $("#gdftyForm").val();

        //사용대상
        var useTarget = $("#useTarget").val();
        if(useTarget == null){
            navigator.notification.alert(msg.dontInsertNull.format("사용대상"), function(){
                util.dismissProgress();
            }, '알림', '확인');
            return;
        }
        //재질
        var gdftyQlt = $("#gdftyQlt").val();
        if(gdftyQlt == null){
            navigator.notification.alert(msg.dontInsertNull.format("재질"), function(){
                util.dismissProgress();
            }, '알림', '확인');
            return;
        }
        
        //제2외국어여부
        var scfggMkty = $("#scfggMkty").val();
        if(scfggMkty == null){
            navigator.notification.alert(msg.dontInsertNull.format("제2외국어여부"), function(){
                util.dismissProgress();
            }, '알림', '확인');
            return;
        }
        //언어1
        var scfggUla1 = $("#scfggUla1").val();
        //단독언어
        if((scfggMkty == "2" || scfggMkty == "3") && scfggUla1 == null){
            navigator.notification.alert(msg.dontInsertNull.format("언어1"), function(){
                util.dismissProgress();
            }, '알림', '확인');
            return;
        }
        //언어2
        var scfggUla2 = $("#scfggUla2").val();
        //2개언어
        if(scfggMkty == "3" && scfggUla2 == null){
            navigator.notification.alert(msg.dontInsertNull.format("언어2"), function(){
                util.dismissProgress();
            }, '알림', '확인');
            return;
        }
        
        //단가
        var gdftyUnitPrice = $("#gdftyUnitPrice").text();
        //가로세로두께
        var gdftyWide = $("#gdftyWide").val();
        //가로
        if(gdftyWide == null || gdftyWide == "" || gdftyWide == 0){
            navigator.notification.alert(msg.checkZero.format("가로"), function(){
                util.dismissProgress();
            }, '알림', '확인');
            return;
        }
        var gdftyVertical = $("#gdftyVertical").val();
        if(gdftyVertical == null || gdftyVertical == "" || gdftyVertical == 0){
            navigator.notification.alert(msg.checkZero.format("세로"), function(){
                util.dismissProgress();
            }, '알림', '확인');
            return;
        }
        var gdftyThickness = $("#gdftyThickness").val();
        if(gdftyThickness == null || gdftyThickness == "" || gdftyThickness == 0){
            navigator.notification.alert(msg.checkZero.format("두께"), function(){
                util.dismissProgress();
            }, '알림', '확인');
            return;
        }

        commomParams = $.extend(commomParams,{
            instSpotCd : instSpotCd,
            lghtCd : lghtCd,
            instCrossCd : instCrossCd,
            useTarget : useTarget,
            gdftyQlt : gdftyQlt,
            scfggMkty : scfggMkty,
            scfggUla1 : scfggUla1,
            scfggUla2 : scfggUla2,
            gdftyUnitPrice : gdftyUnitPrice,
            gdftyWide : gdftyWide,
            gdftyVertical : gdftyVertical,
            gdftyThickness : gdftyThickness
        })
    }
    
    var link = URLs.insertSpgfChange;

    if(trgGbn == DATA_TYPE.RDPQ){
        //표면처리방법
        var prtTy = $("#prtTy").val();
        if(prtTy == null){
            navigator.notification.alert(msg.dontInsertNull.format("표면처리방법"), function(){
                util.dismissProgress();
            }, '알림', '확인');
            return;
        }

        commomParams = $.extend(commomParams,{
            prtTy : prtTy,
        })
        
        var rdGdftySe = $("#rdGdftySe").val();
        if(rdGdftySe == "110"){
            //안내시설방향
            var plqDirection = $("#plqDirection").val();
            if(plqDirection == null){
                navigator.notification.alert(msg.dontInsertNull.format("안내시설방향"), function(){
                    util.dismissProgress();
                }, '알림', '확인');
                return;
            }
            //양면여부
            var bdrclAt = $("#bdrclAt").val();
            if(bdrclAt == null){
                navigator.notification.alert(msg.dontInsertNull.format("양면여부"), function(){
                    util.dismissProgress();
                }, '알림', '확인');
                return;
            }
            //앞면도로명
            var frontKoreanRoadNm = $("#frontKoreanRoadNm").val();
            if(util.isEmpty(frontKoreanRoadNm)){
                navigator.notification.alert(msg.dontInsertNull.format("앞면 도로명"), function(){
                    util.dismissProgress();
                }, '알림', '확인');
                return;
            }
            var frontRomeRoadNm = $("#frontRomeRoadNm").text();
            //시작기초번호 본번
            var frontStartBaseMasterNo = $("#frontStartBaseMasterNo").val();
            if(frontStartBaseMasterNo == "" || frontStartBaseMasterNo == 0){
                navigator.notification.alert(msg.checkZero.format("앞면 시작기초번호 본번"), function(){
                    util.dismissProgress();
                }, '알림', '확인');
                return;
            }
            //시작기초번호 부번
            var frontStartBaseSlaveNo = $("#frontStartBaseSlaveNo").val();
            if(frontStartBaseSlaveNo == ""){
                navigator.notification.alert(msg.dontInsertNull.format("앞면 시작기초번호 부번"), function(){
                    util.dismissProgress();
                }, '알림', '확인');
                return;
            }

            //종료기초번호
            var frontEndBaseMasterNo = $("#frontEndBaseMasterNo").val();
            var frontEndBaseSlaveNo = $("#frontEndBaseSlaveNo").val();
            if(frontEndBaseMasterNo == "" || frontEndBaseSlaveNo == ""){
                navigator.notification.alert(msg.dontInsertNull.format("앞면 종료기초번호"), function(){
                    util.dismissProgress();
                }, '알림', '확인');
                return;
            }
            
            //뒷면도로명
            var backKoreanRoadNm = $("#backKoreanRoadNm").val();
            //뒷면영문명
            var backRomeRoadNm = $("#backRomeRoadNm").text();
            //시작기초번호 본번
            var backStartBaseMasterNo = $("#backStartBaseMasterNo").val();
            //시작기초번호 부번
            var backStartBaseSlaveNo = $("#backStartBaseSlaveNo").val();
            //종료기초번호 본번
            var backEndBaseMasterNo = $("#backEndBaseMasterNo").val();
            //종료기초번호 부번
            var backEndBaseSlaveNo = $("#backEndBaseSlaveNo").val();

            /*
                뒷면내용은 항상 저장은 해야되지만 검증은 뒷면이 표현되는 경우에만 체크
            */

            //설치유형
            var instSe = $("#instSe").text();

            //앞쪽방향용 이면서 벽면형이 아닐경우에만 뒷면 체크
            if(plqDirection == "00300" && instSe != "00002"){
                
                if(util.isEmpty(backKoreanRoadNm)){
                    navigator.notification.alert(msg.dontInsertNull.format("뒷면도로명"), function(){
                        util.dismissProgress();
                    }, '알림', '확인');
                    return;
                }    
                
                if(backStartBaseMasterNo == "" || backStartBaseMasterNo == 0){
                    navigator.notification.alert(msg.checkZero.format("뒷면 시작기초번호 본번"), function(){
                        util.dismissProgress();
                    }, '알림', '확인');
                    return;
                }
                
                if(backStartBaseSlaveNo == ""){
                    navigator.notification.alert(msg.dontInsertNull.format("뒷면 시작기초번호 부번"), function(){
                        util.dismissProgress();
                    }, '알림', '확인');
                    return;
                }
                
                if(backEndBaseMasterNo == "" || backEndBaseMasterNo == 0){
                    navigator.notification.alert(msg.dontInsertNull.format("뒷면 종료기초번호 본번"), function(){
                        util.dismissProgress();
                    }, '알림', '확인');
                    return;
                }
                
                if(backEndBaseSlaveNo == ""){
                    navigator.notification.alert(msg.dontInsertNull.format("뒷면 종료기초번호 부번"), function(){
                        util.dismissProgress();
                    }, '알림', '확인');
                    return;
                }

                //앞,뒷면 도로내용 같으면 안됨
                if(frontKoreanRoadNm == backKoreanRoadNm
                    && frontStartBaseMasterNo == backStartBaseMasterNo 
                    && frontStartBaseSlaveNo == backStartBaseSlaveNo 
                    && frontEndBaseMasterNo == backEndBaseMasterNo 
                    && frontEndBaseSlaveNo == backEndBaseSlaveNo){
                    navigator.notification.alert("앞,뒷면의 명판내용이 같을 수 없습니다.", function(){
                        util.dismissProgress();
                    }, '알림', '확인');
                    return;
                }

            }
            // }

            //규격
            var rdpqGdSd = $("#rdpqGdSd").val();
            var gdsdCnt = checkSelectBoxLength("rdpqGdSd");
            
            //표준형이면서 규격이 없는 경우
            if(rdpqGdSd == null && gdftyForm == "10000"){
                navigator.notification.alert(msg.dontInsertNull.format("규격"), function(){
                    util.dismissProgress();
                }, '알림', '확인');
                return;
            }

            //차로용 소로용의 경우 앞쪽방향용 선택 불가
            if(gdftyForm == "10000" && (useTarget == "04000" || useTarget == "05000")){
                if(plqDirection == "00300"){
                    //최초 값으로 되돌림
                    $("#useTarget").val($("#useTarget_origin").val());
                    $("#useTarget").trigger("change");
                    // util.toast("방향이 앞쪽 방향용인 경우 사용대상을 차로용 소로용을 선택할 수 없습니다.","warning");
                    navigator.notification.alert(msg.plqUseTargetCheck, '', '알림', '확인');
                    return;
                }
            }
            
            commomParams = $.extend(commomParams,{
                plqDirection : plqDirection,
                frontKoreanRoadNm : frontKoreanRoadNm,
                frontRomeRoadNm: frontRomeRoadNm,
                frontStartBaseMasterNo : frontStartBaseMasterNo,
                frontStartBaseSlaveNo : frontStartBaseSlaveNo,
                frontEndBaseMasterNo : frontEndBaseMasterNo,
                frontEndBaseSlaveNo : frontEndBaseSlaveNo,
                backKoreanRoadNm : backKoreanRoadNm,
                backRomeRoadNm : backRomeRoadNm,
                backStartBaseMasterNo : backStartBaseMasterNo,
                backStartBaseSlaveNo : backStartBaseSlaveNo,
                backEndBaseMasterNo : backEndBaseMasterNo,
                backEndBaseSlaveNo : backEndBaseSlaveNo,
                rdpqGdSd : rdpqGdSd,
                rdGdftySe : rdGdftySe,
                bdrclAt : bdrclAt,
            })

        }else if(rdGdftySe == "210"){//이면도로용
            //안내시설방향 관리대상에서 제거
            var rddr_plqDrc = $("#rddr_plqDrc").val();
            // if(rddr_plqDrc == null){
            //     navigator.notification.alert(msg.dontInsertNull.format("안내시설방향"), function(){
            //         util.dismissProgress();
            //     }, '알림', '확인');
            //     return;
            // }
            //설치형태
            var rddr_afRdplqSe = $("#rddr_afRdplqSe").val();
            if(rddr_afRdplqSe == null){
                navigator.notification.alert(msg.dontInsertNull.format("설치형태"), function(){
                    util.dismissProgress();
                }, '알림', '확인');
                return;
            }
            //이면도로갯수
            var rddr_afRdCo = $("#rddr_afRdCo").val();
            if(rddr_afRdCo == null){
                navigator.notification.alert(msg.dontInsertNull.format("이면도로갯수"), function(){
                    util.dismissProgress();
                }, '알림', '확인');
                return;
            }
            //규격
            var rddr_rddrGdSd = $("#rddr_rddrGdSd").val();
            var gdsdCnt = checkSelectBoxLength("rddr_rddrGdSd");

            //표준형이면서 규격이 없는 경우
            if(rddr_rddrGdSd == null && gdftyForm == "10000"){
                navigator.notification.alert(msg.dontInsertNull.format("규격"), function(){
                    util.dismissProgress();
                }, '알림', '확인');
                return;
            }

            //양면여부
            var bdrclAt = $("#bdrclAt").val();
            if(bdrclAt == null){
                navigator.notification.alert(msg.dontInsertNull.format("양면여부"), function(){
                    util.dismissProgress();
                }, '알림', '확인');
                return;
            }

            //이면도로 도로내용
            //앞면1
            // var drcKorRn11 = $("#drcKorRn11").val();
            // var drcRomRn11 = $("#drcRomRn11").val();
            // var drcRdLt11 = $("#drcRdLt11").val();
            // var drcRdDrc11 = $("#drcRdDrc11").val();
            // //뒷면1
            // var drcKorRn21 = $("#drcKorRn21").val();
            // var drcRomRn21 = $("#drcRomRn21").val();
            // var drcRdLt21 = $("#drcRdLt21").val();
            // var drcRdDrc21 = $("#drcRdDrc21").val();
            // //앞면2
            // var drcKorRn12 = $("#drcKorRn12").val();
            // var drcRomRn12 = $("#drcRomRn12").val();
            // var drcRdLt12 = $("#drcRdLt12").val();
            // var drcRdDrc12 = $("#drcRdDrc12").val();
            // //뒷면2
            // var drcKorRn22 = $("#drcKorRn22").val();
            // var drcRomRn22 = $("#drcRomRn22").val();
            // var drcRdLt22 = $("#drcRdLt22").val();
            // var drcRdDrc22 = $("#drcRdDrc22").val();
            // //앞면3
            // var drcKorRn13 = $("#drcKorRn13").val();
            // var drcRomRn13 = $("#drcRomRn13").val();
            // var drcRdLt13 = $("#drcRdLt13").val();
            // var drcRdDrc13 = $("#drcRdDrc13").val();
            // //뒷면3
            // var drcKorRn23 = $("#drcKorRn23").val();
            // var drcRomRn23 = $("#drcRomRn23").val();
            // var drcRdLt23 = $("#drcRdLt23").val();
            // var drcRdDrc23 = $("#drcRdDrc23").val();


            commomParams = $.extend(commomParams,{
                rddr_plqDrc : rddr_plqDrc,
                rddr_afRdplqSe : rddr_afRdplqSe,
                rddr_afRdCo : rddr_afRdCo,
                rddr_rddrGdSd : rddr_rddrGdSd,
                rdGdftySe : rdGdftySe,
                bdrclAt : bdrclAt,

                // drcKorRn11 : drcKorRn11,
                // drcRomRn11 : drcRomRn11,
                // drcRdLt11 : drcRdLt11,
                // drcRdDrc11 : drcRdDrc11,

                // drcKorRn21 : drcKorRn21,
                // drcRomRn21 : drcRomRn21,
                // drcRdLt21 : drcRdLt21,
                // drcRdDrc21 : drcRdDrc21,

                // drcKorRn12 : drcKorRn12,
                // drcRomRn12 : drcRomRn12,
                // drcRdLt12 : drcRdLt12,
                // drcRdDrc12 : drcRdDrc12,

                // drcKorRn22 : drcKorRn22,
                // drcRomRn22 : drcRomRn22,
                // drcRdLt22 : drcRdLt22,
                // drcRdDrc22 : drcRdDrc22,

                // drcKorRn13 : drcKorRn13,
                // drcRomRn13 : drcRomRn13,
                // drcRdLt13 : drcRdLt13,
                // drcRdDrc13 : drcRdDrc13,

                // drcKorRn23 : drcKorRn23,
                // drcRomRn23 : drcRomRn23,
                // drcRdLt23 : drcRdLt23,
                // drcRdDrc23 : drcRdDrc23

            })
        }else if(rdGdftySe == "310"){//예고용
            
            //규격
            var prntGdSd = $("#prntGdSd").val();
            var gdsdCnt = checkSelectBoxLength("prntGdSd");
            //표준형이면서 규격이 없는 경우
            if(prntGdSd == null && gdftyForm == "10000"){
                navigator.notification.alert(msg.dontInsertNull.format("규격"), function(){
                    util.dismissProgress();
                }, '알림', '확인');
                return;
            }
            //양면여부
            var bdrclAt = $("#bdrclAt").val();
            if(bdrclAt == null){
                navigator.notification.alert(msg.dontInsertNull.format("양면여부"), function(){
                    util.dismissProgress();
                }, '알림', '확인');
                return;
            }

            commomParams = $.extend(commomParams,{
                prntGdSd : prntGdSd,
                rdGdftySe : rdGdftySe,
                bdrclAt : bdrclAt
            })
        }
        
    }else if(trgGbn == DATA_TYPE.AREA){
        //한글도로명
        var area_areaKorRn = $("#area_areaKorRn").val();
        if(area_areaKorRn == null){
            navigator.notification.alert(msg.dontInsertNull.format("한글도로명"), function(){
                util.dismissProgress();
            }, '알림', '확인');
            return;
        }
        //시작기초번호
        // var area_stbsMn = $("#area_stbsMn").val();
        // var area_stbsSn = $("#area_stbsSn").val();
        //종료기초번호
        // var area_edbsMn = $("#area_edbsMn").val();
        // var area_edbsSn = $("#area_edbsSn").val();
        //광고에따른 분류
        var area_advrtsCd = $("#area_advrtsCd").val();
        if(area_advrtsCd == null){
            navigator.notification.alert(msg.dontInsertNull.format("광고에따른 분류"), function(){
                util.dismissProgress();
            }, '알림', '확인');
            return;
        }
        //광고내용
        var area_advCn = $("#area_advCn").val();
        //기타내용
        var area_etcCn = $("#area_etcCn").val();
        //규격
        var area_areaGdSd = $("#area_areaGdSd").val();
        var gdsdCnt = checkSelectBoxLength("area_areaGdSd");
        //표준형이면서 규격이 없는 경우
        if(area_areaGdSd == null && gdftyForm == "10000"){
            navigator.notification.alert(msg.dontInsertNull.format("규격"), function(){
                util.dismissProgress();
            }, '알림', '확인');
            return;
        }
        
        //양면여부
        var bdrclAt = $("#bdrclAt").val();
        if(bdrclAt == null){
            navigator.notification.alert(msg.dontInsertNull.format("양면여부"), function(){
                util.dismissProgress();
            }, '알림', '확인');
            return;
        }

        //표면처리방법
        var prtTy = $("#prtTy").val();
        // if(prtTy == null){
        //     navigator.notification.alert(msg.dontInsertNull.format("표면처리방법"), function(){
        //         util.dismissProgress();
        //     }, '알림', '확인');
        //     return;
        // }

        commomParams = $.extend(commomParams,{
            area_areaKorRn : area_areaKorRn,
            // area_stbsMn : area_stbsMn,
            // area_stbsSn : area_stbsSn,
            // area_edbsMn : area_edbsMn,
            // area_edbsSn : area_edbsSn,
            area_advrtsCd : area_advrtsCd,
            area_advCn : area_advCn,
            area_etcCn : area_etcCn,
            area_areaGdSd : area_areaGdSd,
            bdrclAt : bdrclAt,
            prtTy : prtTy
        })
    }else if(trgGbn == DATA_TYPE.BSIS){
        //설치장소구분
        var bsis_itlpcSe = $("#bsis_itlpcSe").val();
        if(bsis_itlpcSe == null){
            navigator.notification.alert(msg.dontInsertNull.format("설치장소구분"), function(){
                util.dismissProgress();
            }, '알림', '확인');
            return;
        }else{
            var bsis_itlpcSe_origin = $("#bsis_itlpcSe_origin").val();
            if(bsis_itlpcSe_origin != '00700' && bsis_itlpcSe == '00700'){
                util.toast("승강장용으로 변경할 수 없습니다.",'warning');
                return;
            }
        }
        //설치시설물
        var bsis_instlFty = $("#bsis_instlFty_main").val() == '00'?$("#bsis_instlFty").val() : $("#bsis_instlFty_main").val();
        if(bsis_instlFty == null){
            navigator.notification.alert(msg.dontInsertNull.format("설치시설물"), function(){
                util.dismissProgress();
            }, '알림', '확인');
            return;
        }
        //설치시설물 기타상세
        var bsis_insFtyDc = $("#bsis_insFtyDc").val();
        //곡면분류
        var bsis_planeCd = $("#bsis_planeCd").val();
        if(bsis_planeCd == null){
            navigator.notification.alert(msg.dontInsertNull.format("곡면분류"), function(){
                util.dismissProgress();
            }, '알림', '확인');
            return;
        }
        //한글 도로명
        var bsis_korRn = $("#bsis_korRn").val();
        if(bsis_korRn == null){
            navigator.notification.alert(msg.dontInsertNull.format("한글 도로명"), function(){
                util.dismissProgress();
            }, '알림', '확인');
            return;
        }
        //기초번호
        var bsis_ctbsMn = $("#bsis_ctbsMn").val();
        //이전승강장 번호
        var bsis_bfbsMn = $("#bsis_bfbsMn").val();
        var bsis_bfbsSn = $("#bsis_bfbsSn").val();
        //다음승강장 번호
        var bsis_ntbsMn = $("#bsis_ntbsMn").val();
        var bsis_ntbsSn = $("#bsis_ntbsSn").val();
        //표면처리방법
        var bsisMthd = $("#bsisMthd").val();
        if(bsisMthd == null){
            navigator.notification.alert(msg.dontInsertNull.format("표면처리방법"), function(){
                util.dismissProgress();
            }, '알림', '확인');
            return;
        }
        //규격
        var bsis_bsisGdSd = $("#bsis_bsisGdSd").val();
        var gdsdCnt = checkSelectBoxLength("bsis_bsisGdSd");
        //표준형이면서 규격이 없는 경우
        if(bsis_bsisGdSd == null && gdftyForm == "10000"){
            navigator.notification.alert(msg.dontInsertNull.format("규격"), function(){
                util.dismissProgress();
            }, '알림', '확인');
            return;
        }

        //양면여부
        var bdrclAt = $("#bdrclAt").val();
        if(bdrclAt == null){
            navigator.notification.alert(msg.dontInsertNull.format("양면여부"), function(){
                util.dismissProgress();
            }, '알림', '확인');
            return;
        }

        //표면처리방법
        var prtTy = $("#prtTy").val();
        // if(prtTy == null){
        //     navigator.notification.alert(msg.dontInsertNull.format("표면처리방법"), function(){
        //         util.dismissProgress();
        //     }, '알림', '확인');
        //     return;
        // }

        commomParams = $.extend(commomParams,{
            bsis_itlpcSe : bsis_itlpcSe,
            bsis_instlFty : bsis_instlFty,
            bsis_insFtyDc : bsis_insFtyDc,
            bsis_planeCd : bsis_planeCd,
            bsis_korRn : bsis_korRn,
            bsis_ctbsMn : bsis_ctbsMn,
            bsis_bfbsMn : bsis_bfbsMn,
            bsis_bfbsSn : bsis_bfbsSn,
            bsis_ntbsMn : bsis_ntbsMn,
            bsis_ntbsSn : bsis_ntbsSn,
            bsisMthd : bsisMthd,
            bsis_bsisGdSd : bsis_bsisGdSd,
            bdrclAt : bdrclAt,
            prtTy : prtTy

        })

    }else if(trgGbn == DATA_TYPE.ENTRC){
        //표면처리방법
        var prtTy = $("#prtTy").val();
        if(prtTy == null){
            navigator.notification.alert(msg.dontInsertNull.format("표면처리방법"), function(){
                util.dismissProgress();
            }, '알림', '확인');
            return;
        }
        //제작형식
        var lghtCd = $("#lghtCd").val();
        if(lghtCd == null){
            navigator.notification.alert(msg.dontInsertNull.format("제작형식"), function(){
                util.dismissProgress();
            }, '알림', '확인');
            return;
        }
        //유형
        var buldNmtSe = $("#buldNmtSe").val();
        // if(buldNmtSe == null){
        //     navigator.notification.alert(msg.dontInsertNull.format("유형"), function(){
        //         util.dismissProgress();
        //     }, '알림', '확인');
        //     return;
        // }
        //용도
        var buldNmtPurpose = $("#buldNmtPurpose").val();
        if(buldNmtPurpose == null){
            navigator.notification.alert(msg.dontInsertNull.format("용도"), function(){
                util.dismissProgress();
            }, '알림', '확인');
            return;
        }
        //제작유형
        var buldMnfCd = $("#buldMnfCd").val();
        if(buldMnfCd == null){
            navigator.notification.alert(msg.dontInsertNull.format("제작유형"), function(){
                util.dismissProgress();
            }, '알림', '확인');
            return;
        }
        //재질
        var buldNmtMaterial = $("#buldNmtMaterial").val();
        if(buldNmtMaterial == null){
            navigator.notification.alert(msg.dontInsertNull.format("재질"), function(){
                util.dismissProgress();
            }, '알림', '확인');
            return;
        }
        //형태
        var buldNmtType = $("#buldNmtType").val();

        //규격
        var buldNmtCd = $("#buldNmtCd").val();
        var gdsdCnt = checkSelectBoxLength("buldNmtCd");
        // var buldNmtType = $("#buldNmtType").val();

        //표준형이면서 규격이 없는 경우
        if(buldNmtCd == null && buldNmtType == "1000"){
            navigator.notification.alert(msg.dontInsertNull.format("규격"), function(){
                util.dismissProgress();
            }, '알림', '확인');
            return;
        }

        //가로
        var buldNmtWide = $("#buldNmtWide").val();
        if(buldNmtWide == null || buldNmtWide == 0){
            navigator.notification.alert(msg.checkZero.format("가로"), function(){
                util.dismissProgress();
            }, '알림', '확인');
            return;
        }
        //세로
        var buldNmtVertical = $("#buldNmtVertical").val();
        if(buldNmtVertical == null || buldNmtVertical == 0){
            navigator.notification.alert(msg.checkZero.format("세로"), function(){
                util.dismissProgress();
            }, '알림', '확인');
            return;
        }
        //두께
        var buldNmtThickness = $("#buldNmtThickness").val();
        if(buldNmtThickness == null || buldNmtThickness == 0){
            navigator.notification.alert(msg.checkZero.format("두께"), function(){
                util.dismissProgress();
            }, '알림', '확인');
            return;
        }
        //단가
        var buldNmtUnitPrice = $("#buldNmtUnitPrice").text();
        //자율형 한글자 크기(가로)
        var bulNmtFtWi = $("#bulNmtFtWi").val();
        if(buldNmtPurpose == '2100' && (bulNmtFtWi == null || bulNmtFtWi == 0)){
            navigator.notification.alert(msg.checkZero.format("자율형 한글자 크기(가로)"), function(){
                util.dismissProgress();
            }, '알림', '확인');
            return;
        }
        //자율형 한글자 크기(세로)
        var bulNmtFtVe = $("#bulNmtFtVe").val();
        if(buldNmtPurpose == '2100' && (bulNmtFtVe == null || bulNmtFtVe == 0)){
            navigator.notification.alert(msg.checkZero.format("자율형 한글자 크기(세로)"), function(){
                util.dismissProgress();
            }, '알림', '확인');
            return;
        }

        commomParams = $.extend(commomParams,{
            lghtCd : lghtCd,
            buldNmtType : buldNmtType,
            buldNmtSe : buldNmtSe,
            buldNmtPurpose : buldNmtPurpose,
            buldMnfCd : buldMnfCd,
            buldNmtMaterial : buldNmtMaterial,
            buldNmtCd : buldNmtCd,
            buldNmtWide : buldNmtWide,
            buldNmtVertical : buldNmtVertical,
            buldNmtThickness : buldNmtThickness,
            buldNmtUnitPrice : buldNmtUnitPrice,
            bulNmtFtWi : bulNmtFtWi,
            bulNmtFtVe : bulNmtFtVe,
            prtTy : prtTy,
        })

        link = URLs.insertSpbdChange;
    }else if(trgGbn == DATA_TYPE.BULD){
        //용도
        var bdtypCd = $("#bdtypCd").val();
        //건물종속여부
        var bulDpnSe = $("#bulDpnSe").val();
        //건물층수
        var groFloCo = $("#groFloCo").val();
        var undFloCo = $("#undFloCo").val();
        //건물명
        var posBulNm = $("#posBulNm").val();
        //건물명(영)
        var bulEngNm = $("#bulEngNm").val();
        //건물상태
        var buldSttus = $("#buldSttus").val();
        //상세건물명
        var buldNmDc = $("#buldNmDc").val();
        //메모
        var buldMemo = $("#buldMemo").val();
        var buldMemoSize = buldMemo.length
        if(buldMemoSize > 200){
            navigator.notification.alert("건물메모는 200자 제한입니다.", function () {
            }, '알림', '확인');

            $("#buldMemo").val(buldMemo.substring(0, 200));
            return;
        }

        commomParams = $.extend(commomParams,{
            bdtypCd : bdtypCd,
            bulDpnSe : bulDpnSe,
            groFloCo : groFloCo,
            undFloCo : undFloCo,
            posBulNm : posBulNm,
            bulEngNm : bulEngNm,
            buldSttus : buldSttus,
            buldNmDc : buldNmDc,
            buldMemo : buldMemo,

        })

        link = URLs.insertSpbdChange;
    }
    
    navigator.notification.confirm(msgText, function(btnIndex){
        if(btnIndex == 1){
            
            util.showProgress();
            var url = URLs.postURL(link, commomParams);
            util.postAJAX({}, url).then(
                function (context, rCode, results) {
                    //통신오류처리
                    if (rCode != 0 || results.response.status < 0) {
                        navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                        util.dismissProgress();
                        return;
                    }

                    navigator.notification.alert(msg.successModify,
                        function (){
                            
                            // closeDetailView();

                            //지도초기화
                            // closePopupAndClearMap(trgGbn);

                            //시설물 번호 전역변수
                            if(trgGbn == "99"){
                                // trgSnGlobal = trgLocSn;
                                MapUtil.openDetail(trgGbn, trgLocSn);
                            }else{
                                // trgSnGlobal = trgSn;
                                MapUtil.openDetail(trgGbn, trgSn);
                            }
                            
                            util.dismissProgress();
        
                            
                        },'알림', '확인');

                    util.dismissProgress();

                },
                util.dismissProgress
            );

        }
    }, "알림", ["확인","취소"]);
}

function submitFitUpdt(commomParams){
    var isUpdtGbn = $("#isUpdtGbn").val();
    var msgText = msg.isSave;
    if(isUpdtGbn.indexOf("D") != -1){
        msgText = msg.isSaveAgain;
    }
    var trgGbn = commomParams.trgGbn;
    var trgLocSn = commomParams.trgLocSn;
    var trgSn = commomParams.trgSn;
    
    navigator.notification.confirm(msgText, function(btnIndex){
        if(btnIndex == 1){
            
            util.showProgress();
            var url = URLs.postURL(link, commomParams);
            util.postAJAX({}, url).then(
                function (context, rCode, results) {
                    //통신오류처리
                    if (rCode != 0 || results.response.status < 0) {
                        navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                        util.dismissProgress();
                        return;
                    }

                    navigator.notification.alert(msg.successModify,
                        function (){
                            
                            // closeDetailView();

                            //지도초기화
                            // closePopupAndClearMap(trgGbn);

                            //시설물 번호 전역변수
                            if(trgGbn == "02" || trgGbn == "99"){
                                trgSnGlobal = trgLocSn;
                            }else{
                                trgSnGlobal = trgSn;
                            }
                            
                            MapUtil.openDetail(trgGbn, null);
        
                            util.dismissProgress();
        
                            
                        },'알림', '확인');

                    util.dismissProgress();

                },
                util.dismissProgress
            );

        }
    }, "알림", ["확인","취소"]);
}
//점검 된 임시 정보 조회
function loadUpdtData(isImages){
    // navigator.notification.confirm(msg.loadUpdtData, function(btnindex){
    //     if(btnindex == 1){
            util.showProgress();
            var isUpdtGbn = $("#isUpdtGbn").val();

            if(isUpdtGbn == "0"){
                if(isImages == "true"){
                    navigator.notification.alert(msg.notHaveLoadUpdt, '', '알림', '확인');
                }
                
                util.dismissProgress();
                return;
            }
    
            var plnYr = $("#plnYr").val() == ""? util.getToday().substr(0,4) : $("#plnYr").val();
            var plnOdr = $("#plnOdr").val();
            var trgLocSn = $("#trgLocSn").val();
            var trgSn = $("#trgSn").val();
            var trgGbn = $("#trgGbn").val();
            var sigCd = $("#sigCd").val();
            var rdGdftySe = $("#rdGdftySe").val();

            var commomParams = {
                plnYr : plnYr,
                plnOdr : plnOdr,
                trgLocSn : trgLocSn,
                trgSn : trgSn,
                trgGbn : trgGbn,
                sigCd : sigCd,
                isImages : isImages,
                rdGdftySe : rdGdftySe

            };

            var link = URLs.selectSpgfChange;
            if(trgGbn == "02" || trgGbn == "99"){
                link = URLs.selectSpbdChange;
            }
            
            var url = URLs.postURL(link, commomParams);
            util.showProgress();
            util.postAJAX({}, url).then(
                function (context, rCode, results) {
                    //통신오류처리
                    try {
                        if (rCode != 0 || results.response.status < 0) {
                            navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                            util.dismissProgress();
                            return;
                        }    
                    } catch (error) {
                        navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                        util.dismissProgress();
                        return;
                    }
                    var data = results.data;

                    if (util.isEmpty(data) == true) {
                        navigator.notification.alert(msg.noItem,
                            function() {
                                // util.goBack();
                            }, '알림', '확인');
                        util.dismissProgress();
                        return;
                    }

                    if(isImages == "true"){
                        //확대창 삭제
                        $(".smartphoto").parents("div").remove();
                        $(".js-smartPhoto").remove();
                        // 사진 조회 및 편집 상태 초기화
                        MapUtil.photo.state.init();

                        for (var index in data.files) {
                            var image = data.files[index];
                            if (util.isEmpty(image.base64) === false && image.base64.length > 0) {

                                var obj = "<a href = 'data:image;base64," + image.base64 + "' class='js-smartPhoto'>" 
                                    obj += "<input id='imaFilSn' type='hidden' value='" + image.imageFilesSn + "'/>";
                                    obj += "<input id='tbGbn' type='hidden' value='" + image.tbGbn + "'/>";
                                    obj += "<img style='height: 220px; width: 100%; object-fit: contain' src='data:image;base64," + image.base64 + "'/>";
                                    obj += "</a>";

                                $(".picInfo." + image.tbGbn + " .picImg").html('');
                                $(".picInfo." + image.tbGbn + " .picImg").html(obj);
                                MapUtil.photo.doEdit(true, image.tbGbn);
                            } else {
                                util.toast(msg.wrongPhoto);
                            }
                        }
                        $(".js-smartPhoto").SmartPhoto();
                        
                    }else{
                        for(var d in data){
                            if(data[d] != null){

                                if(d == "bsis_instlFty"){//기초번호판 설치위치
                                    if(data[d].charAt(0) < 2){
                                        $("#"+d+"_main").val(data[d]);
                                        changeBsisInstlFty('bsis_instlFty_main');
                                        $("#"+d+"_main").attr("style","color:red");
                                    }else{
                                        $("#"+d+"_main").val('00');
                                        $("#"+d).val(data[d]);
                                        changeBsisInstlFty('bsis_instlFty');

                                        $("#"+d+"_main").attr("style","color:red");
                                        $("#"+d).attr("style","color:red");
                                    }
                                    continue;
                                }else if(d == "bdtypCd"){//건물용도
                                    var bdtypCd_main = data[d].substr(0, 2) + "000";
                                    // customSelectBox("bdtypCd_main","BDTYP_CD","000",2,4);
                                    $("#bdtypCd_main").val(bdtypCd_main);
                                    customSelectBox2("bdtypCd","BDTYP_CD",data[d].substr(0,2),0,2,2,5);
                                    $("#bdtypCd").val(data[d]);

                                    $("#"+d+"_main").attr("style","color:red");
                                    $("#"+d).attr("style","color:red");
                                    
                                }else{
                                    $("#"+d).val(data[d]);
                                    $("#"+d).attr("style","color:red");
                                }
                                
                                if(d != "bsis_instlFty"){
                                    //셀렉트박스 변경을 위한 적용
                                    $("#"+d).trigger('change');
                                    $("#"+d).trigger('input');
                                    $("#"+d).attr("style","color:red");
                                }
                                
                                //변경 체크를 위한 셋팅
                                $("#"+d+"_origin").val(data[d]);
                                changedIdList = jQuery.grep(changedIdList, function(value) {
                                    return value != d;
                                });
                            }else{
                                if(d == "buldMemo"){//건물메모
                                    $("#"+d).val(data[d]);
                                    $("#"+d).attr("style","color:red");
                                }
                            }
                        }

                        //건물번호판인 경우 마지막에 규격 한번더 셋팅(파라미터 명칭 순서상 규격이 최초에 셋팅되고 나중에 영향이 가는 값이 셋팅되어 규격이 없어짐)
                        var trgGbn = $("#trgGbn").val();
                        if(trgGbn == "02" && data["buldNmtPurpose"] != "" && data["buldNmtCd"]){
                            $("#buldNmtCd").val(data["buldNmtCd"]);
                            changeBuldNmtCd("buldNmtCd");
                            $("#buldNmtCd").attr("style","color:red");
                        }
                    }
                    util.toast(msg.successLoadUpdt);
                    util.dismissProgress();

                },
                util.dismissProgress
            );
                    

        // }else{
        //     if(isImages == "true"){
        //         var photoNum = $(".infoHeader .photo .photoNum").text();
        //         selectOldImg(photoNum);
        //     }
        // }
    // }, "알림", ["확인","취소"]);
            
        
}

function deleteUpdtData(isImages){
    var isUpdtGbn = $("#isUpdtGbn").val();

    if(isUpdtGbn.indexOf("D") == -1){
        navigator.notification.alert(msg.notHaveLoadUpdt, '', '알림', '확인');
        return;
    }

    navigator.notification.confirm(msg.deleteUpdtData, function(btnindex){
        if(btnindex == 1){

            var plnYr = $("#plnYr").val() == ""? util.getToday().substr(0,4) : $("#plnYr").val();
            var plnOdr = $("#plnOdr").val();
            var trgLocSn = $("#trgLocSn").val();
            var trgSn = $("#trgSn").val();
            var trgGbn = $("#trgGbn").val();
            var sigCd = $("#sigCd").val();
            var rdGdftySe = $("#rdGdftySe").val();

            var commomParams = {
                plnYr : plnYr,
                plnOdr : plnOdr,
                trgLocSn : trgLocSn,
                trgSn : trgSn,
                trgGbn : trgGbn,
                sigCd : sigCd,
                isImages : isImages,
                rdGdftySe : rdGdftySe

            };

            var link = URLs.deleteUpdtChange;
            
            var url = URLs.postURL(link, commomParams);
            util.showProgress();
            util.postAJAX({}, url).then(
                function (context, rCode, results) {
                    //통신오류처리
                    if (rCode != 0 || results.response.status < 0) {
                        navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                        util.dismissProgress();
                        return;
                    }

                    // var data = results.data;

                    // if (util.isEmpty(data) == true) {
                    //     navigator.notification.alert(msg.noItem,
                    //         function() {
                    //             // util.goBack();
                    //         }, '알림', '확인');
                    //     util.dismissProgress();
                    //     return;
                    // }
                    
                    util.toast(msg.successDeleteUpdt);
                    util.dismissProgress();

                    //시설물 번호 전역변수
                    if(trgGbn == "99"){
                        // trgSnGlobal = trgLocSn;
                        MapUtil.openDetail(trgGbn, trgLocSn);
                    }else{
                        // trgSnGlobal = trgSn;
                        MapUtil.openDetail(trgGbn, trgSn);
                    }
                },
                util.dismissProgress
            );
        }
    },"알림", ["확인","취소"]);
        
}

//사진 정비 저장
function modifyImg(type){
    // 사진 변경(촬영) 여부 확인
    if(!MapUtil.photo.isEdited()) {
        navigator.notification.alert(msg.noPhotoSave,'','알림', '확인');
        return;
    }

    //현재 선택한 점검상태
    var rcSttCd_new = $("#rcSttCd_new").text();
    if(util.isEmpty(rcSttCd_new) || rcSttCd_new == "1000"){
        //원본사진 건수에 따른 촬영 체크
        if(MapUtil.photo.isEdited("M") && !MapUtil.photo.isEdited("L")){ //근거리만 수정 
            var cntLphoto = $("#cntLphoto").text(); //원거리건수
            if(cntLphoto == "0"){
                navigator.notification.alert(msg.checkOtherPhoto.format("원거리"),'','알림', '확인');
                return;
            }

        }else if(!MapUtil.photo.isEdited("M") && MapUtil.photo.isEdited("L")){ // 원거리만 수정
            var cntMphoto = $("#cntMphoto").text(); //근거리건수
            if(cntMphoto == "0"){
                navigator.notification.alert(msg.checkOtherPhoto.format("근거리"),'','알림', '확인');
                return;
            }
        }
    }else{
        if(!MapUtil.photo.isEdited("M") || !MapUtil.photo.isEdited("L")){
            navigator.notification.alert(msg.checkOtherPhoto.format("두장의"),'','알림', '확인');
            return;
        }
    }

    //사진파일
    var files = makeImg();
    // var valid = true;

    // switch(files.length) {
    //     case 0:
    //         valid = false;
    //         break;
    //     case 1:
    //         if(type != DATA_TYPE.SPPN && type != DATA_TYPE.ADRDC){
    //             valid = false;
    //         }
    //         break;
    // }

    // if(!valid) {
    //     navigator.notification.alert(msg.noPhoto,'','알림', '확인');
    //     return;
    // }

    var isUpdtGbn = $("#isUpdtGbn").val();
    var msgText = msg.isSavePhoto;
    if(isUpdtGbn.indexOf("I") != -1){
        msgText = msg.isSaveAgain;
    }
    
    navigator.notification.confirm(msgText, function(btnindex){
        if(btnindex == 1){
            var plnYr = $("#plnYr").val();
            var plnOdr = $("#plnOdr").val();
            var trgLocSn = $("#trgLocSn").val();
            var trgSn = $("#trgSn").val();
            var trgGbn = $("#trgGbn").val();
            var sigCd = $("#sigCd").val();
            var rcrSn = app.info.rcrSn;
            var mtchSn = $("#mtchSn").val();
            
            var params = {
                plnYr : plnYr,
                plnOdr : plnOdr,
                trgLocSn : trgLocSn,
                trgSn : trgSn,
                trgGbn : trgGbn,
                sigCd : sigCd,
                rcrSn : rcrSn,
                mtchSn : mtchSn,
                workId: app.info.opeId,
                files: files,
                isImages : "true"
            };

            var link, relink;
            // switch(type) {
            //     case DATA_TYPE.RDPQ:
            //     case DATA_TYPE.AREA:
            //     case DATA_TYPE.BSIS:
            //         link = URLs.updateSpgfImg;
            //         relink = URLs.roadsignlink;
            //         break;
            //     case DATA_TYPE.ENTRC:
            //         link = URLs.updateBuildNumberInfo;
            //         break;
            //     case DATA_TYPE.SPPN:
            //         link = URLs.updateSpotInfo;
            //         break;
            //     case DATA_TYPE.ADRDC:
            //         link = URLs.insertBaseResearch;
            //         break;
            // }

            var link = URLs.insertSpgfChange;

            util.showProgress();
            var url = URLs.postURL(link, params);
            util.postAJAX({}, url)
            .then(
                function (context, rCode, results) {
                    util.dismissProgress();
                    try {
                        //통신오류처리
                        if (rCode != 0 || results.response.status < 0) {
                            navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                            return;
                        }

                        navigator.notification.alert(msg.successModify,
                            function (){
                                
                                //점검 사진 저장 후 사진건수 N으로 표시
                                $(".infoHeader .photo .photoNum").html("N");
                                var oldIsUpdtGbn = $("#isUpdtGbn").val();
                                $("#isUpdtGbn").val(oldIsUpdtGbn + "I");
                                closePhotoView(true);   // force
                                //승인대기 사진조회 버튼 보이기
                                $("#updtPhotoBtn").show();

                                var rcSttCd_new = $("#rcSttCd_new").text();
                                if(rcSttCd_new != ""){
                                    submitResearch();
                                }
                                
                            },'알림', '확인');

                            

                        // //사진건수
                        // if(type == DATA_TYPE.RDPQ){
                        //     var link = URLs.roadsignlink;
                        // }else if(type == DATA_TYPE.AREA){
                        //     var link = URLs.roadsignlink;
                        // }else if(type == DATA_TYPE.BSIS){
                        //     var link = URLs.roadsignlink;
                        // }else if(type == DATA_TYPE.ENTRC){
                        //     var link = URLs.entrclink;

                        //     params = $.extend(params, {
                        //         sn : featureClone[0].get('BUL_MAN_NO')
                        //     });
                        // }else if(type == DATA_TYPE.SPPN){
                        //     var link = URLs.spotSelectlink;
                        // }else if(type == DATA_TYPE.ADRDC){
                        //     var link = URLs.addresslink;
                        // }

                        // // 사진 저장 후 전체 건 수 다시 조회
                        // var url = URLs.postURL(link, params);
                        // util.postAJAX({}, url)
                        // .then(
                        //     function (context, rCode, results) {
                        //         util.dismissProgress();
                        //         //통신오류처리
                        //         if (rCode != 0 || results.response.status < 0) {
                        //             navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                        //             return;
                        //         }

                        //         var data = results.data;

                        //         $(".infoHeader .photo .photoNum").html(data.cntFiles);
                        //     }
                        // );
                        // closePhotoView(true);   // force

                        // if(type == DATA_TYPE.RDPQ||type == DATA_TYPE.AREA||type == DATA_TYPE.BSIS){
                        //     MapUtil.setValues(layerID, relink, rdGdftySn);

                        //     //지도 초기화
                        //     getVectorSource(map , "위치레이어").clear();
                        // }
                    }catch(e) {
                        util.toast('데이터 처리에 문제가 발생 하였습니다. 잠시후 다시 시도해 주세요.');
                    }
                    util.dismissProgress();
                },
                util.dismissProgress
            );
        }
    }, "알림", ["저장","취소"]);

}
function selectOriImg(){
    var photoNum = $(".infoHeader .photo .photoNum").text();
    // 속성 조회 시 사진 건수가 없는 경우 서버로 부터 조회 하지 않음.
    if(photoNum == 0){
        util.toast("사진정보가 없습니다.");
        return;
    } else {
        var url="", param="";
        // if(layerID == ""){
        layerID = $("#trgGbn").val();
        // }
        switch (layerID) {
            case DATA_TYPE.RDPQ:
                // var sn = f.get("RD_GDFTY_SN");
                param = { "sn": trgSnGlobal, "sigCd": app.info.sigCd, "isImages": true };
                url = URLs.postURL(URLs.roadsignlink, param);
                break;
            case DATA_TYPE.AREA:
                // var sn = f.get("RD_GDFTY_SN");
                param = { "sn": trgSnGlobal, "sigCd": app.info.sigCd, "isImages": true };
                url = URLs.postURL(URLs.roadsignlink, param);
                break;
            case DATA_TYPE.BSIS:
                // var sn = f.get("RD_GDFTY_SN");
                param = { "sn": trgSnGlobal, "sigCd": app.info.sigCd, "isImages": true };
                url = URLs.postURL(URLs.roadsignlink, param);
                break;
            case DATA_TYPE.ENTRC:
                var sn = $("#trgLocSn").val();
                param = { "sn": sn, "sigCd": app.info.sigCd, "isImages": true };
                var url = URLs.postURL(URLs.entrclink, param);
                break;
            case DATA_TYPE.BULD:
                var sn = $("#trgLocSn").val();
                param = { "sn": sn, "sigCd": app.info.sigCd, "isImages": true };
                url = URLs.postURL(URLs.buildSelectlink, param);
                break;
            case DATA_TYPE.SPPN:
                var sn = $("#trgSn").val();
                param = { "sn": sn, "sigCd": app.info.sigCd, "isImages": true };
                url = URLs.postURL(URLs.spotSelectlink, param);
                break;
            case DATA_TYPE.ADRDC:
                var sn = $("#sn").val();
                param = { "sn": sn, "sigCd": app.info.sigCd, "isImages": true };
                url = URLs.postURL(URLs.addresslink, param);
                break;
        }
        

        util.showProgress();
        util.postAJAX({}, url).then(
            function(context, rcode, results) {

                var data = results.data;
                // var emptyObj = "<img style='height: 220px; width: 100%; object-fit: contain' src=''/>";
                // emptyObj+= "<input id='imaFilSn' type='hidden' value=''/>";
                // emptyObj+= "<input id='tbGbn' type='hidden' value='{0}'/>";

                if (rcode != 0 || util.isEmpty(data) || util.isEmpty(data.files)) {
                    util.dismissProgress();
                    // util.toast("사진정보 읽어오는데 실패 하였습니다", "error");
                    util.toast(msg.wrongPhoto);
                    return;
                }else{
                    util.toast(msg.successImg);
                    // 사진 조회 및 편집 상태 초기화
                    MapUtil.photo.state.init();
                }

                for (var index in data.files) {
                    var image = data.files[index];
                    if (util.isEmpty(image.base64) === false && image.base64.length > 0) {
                        var obj = "<a href = 'data:image;base64," + image.base64 + "' class='js-smartPhoto'>";
                            obj += "<input id='imaFilSn' type='hidden' value='" + image.imageFilesSn + "'/>";
                            obj += "<input id='tbGbn' type='hidden' value='" + image.tbGbn + "'/>";
                            obj += "<img style='height: 220px; width: 100%; object-fit: contain' src='data:image;base64," + image.base64 + "'/>";
                            obj += "</a>";
                        $(".picInfo." + image.tbGbn + " .picImg").html('');
                        $(".picInfo." + image.tbGbn + " .picImg").html(obj);
                        MapUtil.photo.doLoaded(true, image.tbGbn);
                        
                    } else {
                        util.toast(msg.wrongPhoto);
                    }
                }
                
                util.dismissProgress();
            }
        );
    }
}
function selectOldImg(){

    // navigator.notification.confirm(msg.loadOldImg, function(btnindex){
    //     if(btnindex == 1){
            // warnnigToast();
            util.toast("원본사진을 조회합니다. 잠시만 기다려주세요.");
            //확대창 삭제
            $(".smartphoto").parents("div").remove();
            $(".js-smartPhoto").remove();

            var photoNum = $(".infoHeader .photo .photoNum").text();
            // 속성 조회 시 사진 건수가 없는 경우 서버로 부터 조회 하지 않음.
            if(photoNum == 0){
                util.toast("사진정보가 없습니다.");
                return;
            } else {
                var url="", param="";
                // if(layerID == ""){
                layerID = $("#trgGbn").val();
                // }
                switch (layerID) {
                    case DATA_TYPE.RDPQ:
                        // var sn = f.get("RD_GDFTY_SN");
                        param = { "sn": trgSnGlobal, "sigCd": app.info.sigCd, "isImages": true };
                        url = URLs.postURL(URLs.roadsignlink, param);
                        break;
                    case DATA_TYPE.AREA:
                        // var sn = f.get("RD_GDFTY_SN");
                        param = { "sn": trgSnGlobal, "sigCd": app.info.sigCd, "isImages": true };
                        url = URLs.postURL(URLs.roadsignlink, param);
                        break;
                    case DATA_TYPE.BSIS:
                        // var sn = f.get("RD_GDFTY_SN");
                        param = { "sn": trgSnGlobal, "sigCd": app.info.sigCd, "isImages": true };
                        url = URLs.postURL(URLs.roadsignlink, param);
                        break;
                    case DATA_TYPE.ENTRC:
                        // var sn = $("#trgLocSn").val();
                        var sn = trgSnGlobal
                        param = { "sn": sn, "sigCd": app.info.sigCd, "isImages": true };
                        
                        // var url = URLs.postURL(URLs.entrclink, param);
                        var url = URLs.postURL(URLs.nmtglink, param);
                        break;
                    case DATA_TYPE.BULD:
                        var sn = $("#trgLocSn").val();
                        param = { "sn": sn, "sigCd": app.info.sigCd, "isImages": true };
                        url = URLs.postURL(URLs.buildSelectlink, param);
                        break;
                    case DATA_TYPE.SPPN:
                        var sn = $("#trgSn").val();
                        param = { "sn": sn, "sigCd": app.info.sigCd, "isImages": true };
                        url = URLs.postURL(URLs.spotSelectlink, param);
                        break;
                    case DATA_TYPE.ADRDC:
                        var sn = $("#sn").val();
                        param = { "sn": sn, "sigCd": app.info.sigCd, "isImages": true };
                        url = URLs.postURL(URLs.addresslink, param);
                        break;
                }
                

                util.showProgress();
                util.postAJAX({}, url).then(
                    function(context, rcode, results) {

                        var data = results.data;
                        // var emptyObj = "<img style='height: 220px; width: 100%; object-fit: contain' src=''/>";
                        // emptyObj+= "<input id='imaFilSn' type='hidden' value=''/>";
                        // emptyObj+= "<input id='tbGbn' type='hidden' value='{0}'/>";

                        if (rcode != 0 || util.isEmpty(data) || util.isEmpty(data.files)) {
                            util.dismissProgress();
                            // util.toast("사진정보 읽어오는데 실패 하였습니다", "error");
                            util.toast(msg.wrongPhoto);
                            return;
                        }else{
                            util.toast(msg.successImg);
                            // 사진 조회 및 편집 상태 초기화
                            MapUtil.photo.state.init();
                        }

                        for (var index in data.files) {
                            var image = data.files[index];
                            if (util.isEmpty(image.base64) === false && image.base64.length > 0) {
                                var obj = "<a href = 'data:image;base64," + image.base64 + "' class='js-smartPhoto'>" 
                                    obj += "<input id='imaFilSn' type='hidden' value='" + image.imageFilesSn + "'/>";
                                    obj += "<input id='tbGbn' type='hidden' value='" + image.tbGbn + "'/>";
                                    obj += "<img style='height: 220px; width: 100%; object-fit: contain' src='data:image;base64," + image.base64 + "'/>";
                                    obj += "</a>";

                                $(".picInfo." + image.tbGbn + " .picImg").html('');
                                $(".picInfo." + image.tbGbn + " .picImg").html(obj);
                                $(".picInfo." + image.tbGbn + " .opertDe").html('촬영일자 : '+ image.opertDe);
                                
                                MapUtil.photo.doLoaded(true, image.tbGbn);
                                
                            } else {
                                util.toast(msg.wrongPhoto);
                            }
                        }
                        $(".js-smartPhoto").SmartPhoto();
                        // setSmartPhoto();
                        
                        
                        util.dismissProgress();
                    }
                );
            }


    //     }else{
    //         return;
    //     }
    // }, "알림", ["확인","취소"]);
    
}

//입력창 가림 방지를 위한 화면 스크롤
function scrollDown(size){
    $('.infoContent').scrollTop(size);
}

//명판모양 변경
function setNameplateView(){
    var plqDirection = $("#plqDirection").val();

    var korRnView = $("#frontKoreanRoadNm").val();
    // var romRnView = $("#frontRomeRoadNm").val();
    var romRnView = $("#frontRomeRoadNm").text();
    var frontStartBaseMasterNo = $("#frontStartBaseMasterNo").val();
    var frontStartBaseSlaveNo = $("#frontStartBaseSlaveNo").val();
    var frontEndBaseMasterNo = $("#frontEndBaseMasterNo").val();
    var frontEndBaseSlaveNo = $("#frontEndBaseSlaveNo").val();

    
    var rdGdftySe = $("#rdGdftySe").val();
    //이면도로용
    if(rdGdftySe == "210"){
        plqDirection = $("#rddr_plqDrc").val();
        korRnView = $("#rddr_korRn").text();
        romRnView = $("#rddr_romRn").text();
        frontStartBaseMasterNo = $("#rddr_stbsMn").text();
        frontStartBaseSlaveNo = $("#rddr_stbsSn").text();
        frontEndBaseMasterNo = $("#rddr_edbsMn").text();
        frontEndBaseSlaveNo = $("#rddr_edbsSn").text();

        var rddrCn_drcKorRn_11 = $("#rddrCn_drcKorRn_11").val();
        var rddrCn_drcRomRn_11 = $("#rddrCn_drcRomRn_11").val();
        var rddrCn_drcRdLt_11 = $("#rddrCn_drcRdLt_11").val();
        var rddrCn_drcRdDrc_11 = $("#rddrCn_drcRdDrc_11").val();

        $("#korRn_11").text(rddrCn_drcKorRn_11);
        $("#romRn11").text(rddrCn_drcRomRn_11);
        $("#drcRdLt_11").text(rddrCn_drcRdLt_11 + "M");
        $("#drcRdDrc_11").text(rddrCn_drcRdDrc_11);

        var rddrCn_drcKorRn_12 = $("#rddrCn_drcKorRn_12").val();
        var rddrCn_drcRomRn_12 = $("#rddrCn_drcRomRn_12").val();
        var rddrCn_drcRdLt_12 = $("#rddrCn_drcRdLt_12").val();
        var rddrCn_drcRdDrc_12 = $("#rddrCn_drcRdDrc_12").val();

        $("#korRn_12").text(rddrCn_drcKorRn_12);
        $("#romRn12").text(rddrCn_drcRomRn_12);
        $("#drcRdLt_12").text(rddrCn_drcRdLt_12 + "M");
        $("#drcRdDrc_12").text(rddrCn_drcRdDrc_12);

        var rddrCn_drcKorRn_13 = $("#rddrCn_drcKorRn_13").val();
        var rddrCn_drcRomRn_13 = $("#rddrCn_drcRomRn_13").val();
        var rddrCn_drcRdLt_13 = $("#rddrCn_drcRdLt_13").val();
        var rddrCn_drcRdDrc_13 = $("#rddrCn_drcRdDrc_13").val();

        $("#korRn_13").text(rddrCn_drcKorRn_13);
        $("#romRn13").text(rddrCn_drcRomRn_13);
        $("#drcRdLt_13").text(rddrCn_drcRdLt_13 + "M");
        $("#drcRdDrc_13").text(rddrCn_drcRdDrc_13);

    }

    var strarNum = "{0}{1}".format(frontStartBaseMasterNo, (frontStartBaseSlaveNo != "0" ? '-' + frontStartBaseSlaveNo : ''));
    var endNum = "{0}{1}".format(frontEndBaseMasterNo, (frontEndBaseSlaveNo != "0" ? '-' + frontEndBaseSlaveNo : ''));
    
    $(".namePlateTable td>h1").empty();
    $(".namePlateTable td>h2").empty();
    $(".namePlateTable td>h3").empty();

    // 앞면
    $(".korRnTd1").removeAttr("colspan");
    $(".korRnTd1").removeAttr("rowspan");
    
    $(".korRnTd2").removeAttr("colspan");
    $(".korRnTd2").removeAttr("rowspan");

    $(".romRnTd1").removeAttr("colspan");
    $(".romRnTd2").removeAttr("colspan");
    // 뒷면
    $(".bk_korRnTd1").removeAttr("colspan");
    $(".bk_korRnTd1").removeAttr("rowspan");
    
    $(".bk_korRnTd2").removeAttr("colspan");
    $(".bk_korRnTd2").removeAttr("rowspan");

    $(".bk_romRnTd1").removeAttr("colspan");
    $(".bk_romRnTd2").removeAttr("colspan");
    
    var plqDirText = "";

    if(plqDirection == '00100'){
        $("#korRnView1").html(korRnView);
        $(".korRnTd1").attr("colspan","4");
        $(".korRnTd1").attr("rowspan","2");

        $(".romRnTd1").attr("colspan","4");

        $("#romRnView1").html(romRnView);

        plqDirText = "→";
        $("#plqDir").html(plqDirText);

        $("#num1").html(strarNum);
        $("#num2").html(endNum);

        $(".namePlateTable").css("background-image","url('./img/main/img_road_plate_1.png')")
    }else if(plqDirection == '00200'){
        $(".korRnTd2").attr("colspan","2");
        $(".korRnTd2").attr("rowspan","2");

        $(".romRnTd2").attr("colspan","2");

        $("#korRnView2").html(korRnView);
        $("#romRnView2").html(romRnView);

        $("#num1").html(strarNum);
        $("#num6").html(endNum);

        $(".namePlateTable").css("background-image","url('./img/main/img_road_plate_m.png')")
    }else if(plqDirection == '00300'){
        $(".korRnTd1").attr("colspan","5");
        $(".korRnTd1").attr("rowspan","2");

        $(".romRnTd1").attr("colspan","5");

        $("#korRnView1").html(korRnView);
        $("#romRnView1").html(romRnView);

        plqDirText = "↑";
        $("#plqDir").html(plqDirText);

        $("#num7").html(strarNum);
        $("#num9").html(endNum);
        
        $(".namePlateTable").css("background-image","url('./img/main/img_road_plate_f.png')")
    }else{

    }

    //양면여부
    var bdrclAt = $("#bdrclAt").val();
    if(bdrclAt == "1"){
        var korRnView = $("#backKoreanRoadNm").val();
        // var romRnView = $("#backRomeRoadNm").val();
        var romRnView = $("#backRomeRoadNm").text();
        var backStartBaseMasterNo = $("#backStartBaseMasterNo").val();
        var backStartBaseSlaveNo = $("#backStartBaseSlaveNo").val();
        var backEndBaseMasterNo = $("#backEndBaseMasterNo").val();
        var backEndBaseSlaveNo = $("#backEndBaseSlaveNo").val();

        var strarNum = "{0}{1}".format(backStartBaseMasterNo, (backStartBaseSlaveNo != "0" ? '-' + backStartBaseSlaveNo : ''));
        var endNum = "{0}{1}".format(backEndBaseMasterNo, (backEndBaseSlaveNo != "0" ? '-' + backEndBaseSlaveNo : ''));

        if(plqDirection == '00100'){
            $("#bk_korRnView1").html(korRnView);
            $(".bk_korRnTd1").attr("colspan","4");
            $(".bk_korRnTd1").attr("rowspan","2");
    
            $(".bk_romRnTd1").attr("colspan","4");
    
            $("#bk_romRnView1").html(romRnView);
    
            plqDirText = "→";
            $("#bk_plqDir").html(plqDirText);
    
            $("#bk_num1").html(strarNum);
            $("#bk_num2").html(endNum);
    
            // $(".namePlateTable").css("background-image","url('./img/main/img_road_plate_1.png')")
        }else if(plqDirection == '00200'){
            $(".bk_korRnTd2").attr("colspan","2");
            $(".bk_korRnTd2").attr("rowspan","2");
    
            $(".bk_romRnTd2").attr("colspan","2");
    
            $("#bk_korRnView2").html(korRnView);
            $("#bk_romRnView2").html(romRnView);
    
            $("#bk_num1").html(strarNum);
            $("#bk_num6").html(endNum);
    
            // $(".namePlateTable").css("background-image","url('./img/main/img_road_plate_m.png')")
        }else if(plqDirection == '00300'){
            $(".bk_korRnTd1").attr("colspan","5");
            $(".bk_korRnTd1").attr("rowspan","2");
    
            $(".bk_romRnTd1").attr("colspan","5");
    
            $("#bk_korRnView1").html(korRnView);
            $("#bk_romRnView1").html(romRnView);
    
            plqDirText = "↑";
            $("#bk_plqDir").html(plqDirText);
    
            $("#bk_num7").html(strarNum);
            $("#bk_num9").html(endNum);
    
            
            // $(".bk_namePlateTable").css("background-image","url('./img/main/img_road_plate_f.png')")
        }else{
    
        }
    }
    
    
}


function goSppnDetail(i){
    var targetE = $("#row"+i);

    var layerId = DATA_TYPE.SPPN;
    var spoNoCd = targetE.data("spoNoSeq");
    var sigCd = targetE.data("sigCd");

    $("#listView").popup({
        afterclose: function( event, ui ) {
            MapUtil.openDetailSigCd(layerId, spoNoCd, sigCd);
        }
    });

    $("#listView").popup("close");

    
}
//교차로 사용여부 변경 체크
function changeCrsUseYn(){
    var crsUseYn = $("#crsUseYn").val();
    
    if(crsUseYn == "1"){
        $(".crsNotUseCdRow").show();
        util.toast("교차로 [사용안함] 선택 시 증빙자료(사진) 필수입니다.");
        //변경사유
        customSelectBox("notUseCd","NOT_USE_CD","03","0","2");
    }else{
        $(".crsNotUseCdRow").hide();
        //변경사유 초기화
        $("#notUseCd").empty();
        //이미지 초기화
        $(".picImg").empty();
    }
}

//교차로 정보 수정
function submitCrsrdp(){
    var changeGbn = false;
    //보행자용 소요량 변경
    var reqamtP = $("#reqamtP").val();
    var REQAMT_P_origin = $("#REQAMT_P_origin").val();
    var reqamtPrn = $("#reqamtPrn").val();
    var reqamtP_h = $("#reqamtP_h").text();
    
    if(reqamtP != REQAMT_P_origin){
        if(reqamtPrn == ""){
            util.toast("보행자용 소요량을 변경한 사유를 입력하세요.");
            return;
        }
        changeGbn = true;
    }

     //차량용 소요량 변경
     var reqamtC = $("#reqamtC").val();
     var REQAMT_C_origin = $("#REQAMT_C_origin").val();
     var reqamtCrn = $("#reqamtCrn").val();
     var reqamtC_h = $("#reqamtC_h").text();

     if(reqamtC != REQAMT_C_origin){
         if(reqamtCrn == ""){
             util.toast("차량용 소요량을 변경한 사유를 입력하세요.");
             return;
         }
         changeGbn = true;
     }

     //교차로 사용여부
     var crsUseYn = $("#crsUseYn").val();
     var notUseCd = $("#notUseCd").val();
     var CRS_USE_YN_origin = $("#CRS_USE_YN_origin").val();
     if(crsUseYn != CRS_USE_YN_origin){
        var files = makeImg();
        if(files.length < 1){
            util.toast("증빙자료는 필수입니다.");
            return;
        }else{
            var base64 = files[0].base64;
            var fileNm = files[0].name;
        }
        changeGbn = true;
     }else{
        notUseCd = null;
     }


     

     //변경여부
     if(!changeGbn){
        util.toast("변경된 항목이 없습니다.");
        return;
     }else{
        
        navigator.notification.confirm(msg.isSave, function(btnindex){
            
            if(btnindex == 1){
                var crsrdSn = $("#crsrdSn").text();
                var sigCd = $("#sigCd").val();
                
                var sendParams = {
                    crsrdSn     : crsrdSn
                    ,sigCd      : sigCd
                    ,reqamtP    : reqamtP
                    ,reqamtPrn  : reqamtPrn
                    ,reqamtC    : reqamtC
                    ,reqamtCrn  : reqamtCrn
                    ,crsUseYn   : crsUseYn
                    ,notUseCd   : notUseCd
                    
                    ,base64      : base64
                    ,fileNm      : fileNm

                    ,opeManId   : app.info.opeId
                }

                var link = URLs.updateCrsrdp;

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
    
                        util.toast("저장이 완료 되었습니다.");
    
                        util.dismissProgress();

                        //창닫기
                        changedIdList = new Array();
                        closeDetailView();

                        //사용여부 변경시 지도 초기화
                        if(crsUseYn != CRS_USE_YN_origin){
                            $('.refreshMap button').click();
                        }
    
                    },
                    util.dismissProgress
                );
            }

        }, "알림", ["확인","취소"]);

     }

}
