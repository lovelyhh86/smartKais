function closeDetailView(){
    var newLbl = $("p[name*='newLbl']").text();
    if(newLbl != ""){
        navigator.notification.confirm(msg.lossClose, function(btnindex){
            if(btnindex == 1){
                $("#detailView").popup("close", { transition: "slideup" });
            }
        }, "알림", ["확인","취소"]);

    }else{
            $("#detailView").popup("close", { transition: "slideup" });
    }
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
            //제목
            var titleText = '언어1';
            setTitle(titleText);

            //라디오버튼 구성
            popColume = 'SCFGG_ULA1';
            createRadioButton();
            break;
        case 'scfggUla2':
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
    if(oldCode == newRadioVal){
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


            var checkedValue = $("#"+id).text();
            var codeList = app.codeMaster[CODE_GROUP[popColume]];

            for(var c in codeList){
                if(c != "GroupNm"){
                    if(c.charAt(1) == useTarget.charAt(1)){

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
        break;
        case'bsis_bsisGdSd':
            //사용대상에 따른 분류 (기초번호판)
            var useTarget = $("#useTarget_new").text() == "" ? $("#useTarget").text() : $("#useTarget_new").text();


            var checkedValue = $("#"+id).text();
            var codeList = app.codeMaster[CODE_GROUP[popColume]];

            for(var c in codeList){
                if(c != "GroupNm"){
                    if(c.charAt(1) == useTarget.charAt(1)){

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
    navigator.notification.confirm(msg.isSave, function(btnIndex){
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
            //설치상태
            var delStateCd_new = $("#delStateCd_new").text() == ''?$("#delStateCd").text():$("#delStateCd_new").text();
            if(delStateCd_new !=""){
                sendParams = $.extend(sendParams, {delStateCd: delStateCd_new});
            }
            //점검내용
            var checkComment_new = $("#checkComment_new").text() == ''? $("#checkComment").text() : $("#checkComment_new").text();

            sendParams = $.extend(sendParams, {checkComment: checkComment_new});

            //점검상태
            var checkState = $("#delStateCd_new").text() == ''? $("#delStateCd").text() : $("#delStateCd_new").text();

            sendParams = $.extend(sendParams, {checkState: checkState});

            //점검타입
            var checkType = $("#checkType").text();

            sendParams = $.extend(sendParams, {checkType: checkType});

            //점검자명
            var checkUserNm = app.info.opeNm;

            sendParams = $.extend(sendParams, {checkUserNm: checkUserNm});


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

                    closePopupAndClearMap();

                    util.dismissProgress();

                },
                util.dismissProgress
            );

        }
    }, "알림", ["확인","취소"]);

}

function closePopupAndClearMap(){
    //심플팝업 초기화
    $("#popup-content").empty();
    $("#popup").hide();
    
    //지도 초기화
    getVectorSource(map , "위치레이어").clear();

}

function setGdft(){

    //새로운 규격 라벨이 빈칸일경우
    var newLbl = $("#"+popID+"Lbl_new").text();
    if(newLbl == ""){
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


    var rdpqGdSdLblList = newLbl.split('*');

    var gdftyWide_new = $("#gdftyWide_new").text(rdpqGdSdLblList[0]);
    var gdftyVertical_new = $("#gdftyVertical_new").text(rdpqGdSdLblList[1]);
    var gdftyThickness = $("#gdftyThickness_new").text() == ""? $("#gdftyThickness").text():$("#gdftyThickness_new").text();
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

function closePhotoView(){
   if(MapUtil.state.photo[0].edited || MapUtil.state.photo[1].edited){
       navigator.notification.confirm(msg.lossPhotoClose, function(btnIndex){
           if(btnIndex == 1){
                $("#photoDialog").hide();
                $("#mask").hide();
           }
       }, "알림", ["닫기","취소"]);
   }else{
        $("#photoDialog").hide();
        $("#mask").hide();
   }

}

function makeImg(){

   var picImg = $(".picImg");

   var files = [];

   var imgParam = "{ base64 : {0}, name : {1} }";

   var sn = $("#sn").val();
   var date = util.getToday();
   var title = $(".infoHeader .title .label").text();


   for(var index = 0 ; index < picImg.length; index++){
        var picImgTag = $(picImg[index]);
        var src = '';
        var imageFilesSn = '';
        var tbGbn = '';
        if(picImgTag[0].firstChild != null){
            src = picImgTag[0].children[0].getAttribute("src").split('base64,')[1];
            imageFilesSn = picImgTag[0].children[1].getAttribute("value");
            tbGbn = picImgTag[0].children[2].getAttribute("value");
        }
        var imgtName = '{0}_{1}_{2}.jpg'.format(date,title,tbGbn);

        var data = new Object() ;

        data.base64 = src;
        data.name = imgtName;
        data.imageFilesSn = imageFilesSn;
        data.tbGbn = tbGbn;


        files.push(data);
    }

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

    if(!MapUtil.state.photo[0].edited && !MapUtil.state.photo[1].edited){
        navigator.notification.alert(msg.noSave,'','알림', '확인');
        return;
    }

    //사진파일
    var files = makeImg();

    if(type != DATA_TYPE.SPPN){
        //사진이 없는데 촬영도 안한경우
        for(var i = 0; i < MapUtil.state.photo.length; i ++){
            if(!MapUtil.state.photo[i].edited && !MapUtil.state.photo[i].isPhoto ){
                navigator.notification.alert(msg.noPhoto,'','알림', '확인');
                return;
            }
        }

        
        if(files[0].base64 != "" && files[1].base64 == ""){
            navigator.notification.alert(msg.noPhoto,'','알림', '확인');
            return;
        }else if(files[0].base64 == "" && files[1].base64 != ""){
            navigator.notification.alert(msg.noPhoto,'','알림', '확인');
            return;
        }
    }else{
        if(files[0].base64 == ""){
            navigator.notification.alert(msg.noPhoto,'','알림', '확인');
            return;
        }
    }
    

    navigator.notification.confirm(msg.isSavePhoto, function(btnindex){
        if(btnindex == 1){
            var commomParams = {};
            var sendParams = {};
            var buldParams = {};
            var sn = $("#sn").val();
            var rdFtyLcSn = $("#rdFtyLcSn").val();
            var sigCd = app.info.sigCd;
            var workId = app.info.opeId;
            var checkUserNm = app.info.opeNm;
            var checkState = $("#delStateCd_new").text() == ''? $("#delStateCd").text() : $("#delStateCd_new").text();
            var checkType = $("#checkType").text();




            commomParams = $.extend(commomParams, {files: files});

            //사진파일
            // if(files.length>0){
            //     commomParams = $.extend(commomParams, {files: files});
            // }else{
            //     navigator.notification.alert(msg.noSave,'','알림', '확인');
            //     return;
            // }

            commomParams = $.extend(commomParams, {
                sn: sn,
                rdFtyLcSn: rdFtyLcSn,
                sigCd: sigCd,

                checkDate: util.getToday(),
                workId: workId,
                checkUserNm : checkUserNm,
                checkState : checkState,
                checkType : checkType,

            });

            if(type == DATA_TYPE.RDPQ){
                sendParams = $.extend(commomParams, {
                    type :type
                });

                var link = URLs.updateSpgfImg;
                var relink = URLs.roadsignlink;

            }else if(type == DATA_TYPE.AREA){
                sendParams = $.extend(commomParams, {
                    type :type
                });

                var link = URLs.updateSpgfImg;
                var relink = URLs.roadsignlink;

            }else if(type == DATA_TYPE.BSIS){
                sendParams = $.extend(commomParams, {
                    type :type
                });

                var link = URLs.updateSpgfImg;
                var relink = URLs.roadsignlink;

            }else if(type == DATA_TYPE.ENTRC){
                sendParams = $.extend(commomParams, {
                });
                sendParams = $.extend(commomParams, {
                    imageFilesSn: $("#imageFileSn").val()
                //     sn: sn,
                //     sigCd: sigCd,
                //     workId :app.info.opeId,
                //     //사진파일
                //     // files: files
                });

                var link = URLs.updateBuildNumberInfo;
            }else if(type == DATA_TYPE.SPPN){
                sendParams = $.extend(commomParams, {
                    imaFilSn: $("#imaFilSn").val()
                });

                var link = URLs.updateSpotInfo;
            }

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

                    util.toast('사진이 변경되었습니다.');
                    //사진건수
                    var photoNum = $(".infoHeader .photo .photoNum").html();

                    var cnt = 0 ;
                    for(var i = 0 ; i < files.length; i++ ){
                        if(files[i].base64 != ''){
                            cnt++;
                        }
                    }

                    if(photoNum <= 2){
                        $(".infoHeader .photo .photoNum").html(cnt);
                    }else{
                        $(".infoHeader .photo .photoNum").html(photoNum - 2 + cnt);
                    }

                    MapUtil.state.photo[0].edited = false;
                    MapUtil.state.photo[1].edited = false;

                    closePhotoView();

                    if(type == DATA_TYPE.RDPQ||type == DATA_TYPE.AREA||type == DATA_TYPE.BSIS){
                        MapUtil.setValues(layerID, relink, rdGdftySn);
                    }

                    //지도 초기화
                    getVectorSource(map , "위치레이어").clear();

                    util.dismissProgress();
                },
                util.dismissProgress
            );
        }
    }, "알림", ["저장","취소"]);

}

//점검날짜 update
function updateWorkDate(){
    navigator.notification.confirm(msg.updateWorkDate, function(btnindex){

        if(btnindex == 1){

            var sendParams = {};

            var sn = $("#sn").val();
            var sigCd = app.info.sigCd;
            var workId = app.info.opeId;
            var checkUserNm = app.info.opeNm;
            var checkState = $("#delStateCd_new").text() == ''? $("#delStateCd").text() : $("#delStateCd_new").text();
            var checkType = $("#checkType").text(); //01 수시점검, 02 개별점검
            var checkComment = $("#checkComment_new").text() == ''? $("#checkComment").text() : $("#checkComment_new").text();

            sendParams = $.extend({}, {
                sn: sn,
                sigCd: sigCd,
                workId : workId,
                checkUserNm: checkUserNm,
                checkState : checkState,
                checkType : checkType,
                checkComment : checkComment

            });

            var link = URLs.updateWorkDate;

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

                    closeDetailView();

                    closePopupAndClearMap();

                    util.dismissProgress();

                },
                util.dismissProgress
            );
        }
    }, "알림", ["확인","취소"]);

}