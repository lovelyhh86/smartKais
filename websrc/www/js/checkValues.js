//공통 입풋창 열기
function openInputPop(id){
    $("#inputPop").show();
    $("#targetId").val(id);
    var type = $("#"+id).attr("type");
    var value = $("#"+id).val();
    var onchange = $("#"+id).attr("onchange");
    var oninput = $("#"+id).attr("oninput");
    var onfocusout = $("#"+id).attr("onfocusout");

    $("#fixedValue").removeAttr("onchange");
    $("#fixedValue").removeAttr("oninput");

    $("#fixedValue").attr("type",type);
    // $("#fixedValue").attr("onchange",onchange);
    $("#fixedValue").attr("oninput",oninput);
    $("#fixedValue").attr("onfocusout",onchange);
    

    // $("#comInputBtn").attr("onclick",onchange);
    
    $("#fixedValue").val(value);

    wrapWindowByMask('mask');

    $("#fixedValue").focus();

}

//변경된 값 셋팅
function setInputPop(){
    //변경된 값
    var fixedValue = $("#fixedValue").val();
    //원래 인풋에 셋팅
    var targetId = $("#targetId").val();
    $("#"+targetId).val(fixedValue);

    // $("#fixedValue").change();
    closeInput();
}

//인풋창 변경 체크
function fixedValueChecked(){
    // $("#fixedValue").change();
    var targetId = $("#targetId").val();
    // $("#"+targetId).attr("onchange");
    // $("#fixedValue").focus();
}

//글자수 제한
function txtMaxlength(id, size, min) {
    var targetText = $("#"+id);
    var textLength = targetText.val().length;
    
    
    if (textLength > size) {
        navigator.notification.alert("" + size + "자 제한입니다.", function () {
            targetText.val(targetText.val().substring(0, size));
            // openInputPop(id);
            $("#"+id).focus();
        }, '알림', '확인');
      
    }else if(textLength <= min){
        navigator.notification.alert("빈칸을 넣을 수 없습니다.", function () {
            targetText.val(targetText.val().substring(0, size));
            $("#"+id).focus();
        }, '알림', '확인');
    }else{
        setInputPop();
    }

}
function closeInput(){
    $("#inputPop").hide();
    clearMask();
}

//첫글자 0 제거
function firstTextZero(id){
    var targetText = $("#"+id);
    var targetVal = targetText.val();
    var targetlength = targetVal.length;
    var firstText = targetVal.charAt(0);
    if(targetlength > 1 && firstText == "0"){
        targetText.val(targetVal.substring(1, targetlength));
    }

    if(targetVal.indexOf(".") != -1){
        targetText.val(targetVal.substring(0,targetVal.indexOf("."))+targetVal.substring(targetVal.indexOf(".")+1,targetlength));
    }

    $("#"+id).val(parseInt(targetVal));
    // checkDot(id);
}

function checkDot(id){
    var targetText = $("#"+id);
    var targetVal = targetText.val();
    var targetlength = targetVal.length;

    for(i in targetVal){
        if(targetVal[i] == "."){
            targetText.val(targetVal.substring(0,targetVal.indexOf("."))+targetVal.substring(targetVal.indexOf(".")+1,targetlength));
            checkDot(id);
            return;
        }
    }
}
//바이트계산
function getTextLength(str) {
    var len = 0;
    for (var i = 0; i < str.length; i++) {
        if (escape(str.charAt(i)).length == 6) {
            len++;
        }
        len++;
    }
    return len;
}

//제2외국어여부 변경
function changeScfggMkty(){
    var scfggMkty = $("#scfggMkty").val();
    $("#scfggUla1").empty();
    $("#scfggUla2").empty();

    if(scfggMkty == "1"){
        $("#scfggUla1").attr("disabled","disabled")
        $("#scfggUla2").attr("disabled","disabled")
    }else if(scfggMkty == "2"){
        makeOptSelectBox("scfggUla1","SCFGG_ULA1","","","");
        $("#scfggUla1").removeAttr("disabled")
        $("#scfggUla2").attr("disabled","disabled")
    }else{
        makeOptSelectBox("scfggUla1","SCFGG_ULA1","","","");
        makeOptSelectBox("scfggUla2","SCFGG_ULA1","","","");
        $("#scfggUla1").removeAttr("disabled")
        $("#scfggUla2").removeAttr("disabled")
    }

    var trgGbn = $("#trgGbn").val();
    var rdGdftySe = $("#rdGdftySe").val();
    if(trgGbn == "01" && rdGdftySe =="110"){
        changeRdpqGdSd();
    }else if(trgGbn == "03"){
        changeBsisGdSd();
    }

}

//사용대상 변경
function changeUseTarget(){
    var useTarget = $("#useTarget").val();

    if(useTarget != "01000"){//보행자가 아닐때 제2외국어 선택못함
        customSelectBox("scfggMkty","SCFGG_MKTY","1",0,1);
        $("#scfggMkty").val("1");
        changeScfggMkty();
    }else{
        var scfggMkty = $("#scfggMkty").val();
        makeOptSelectBox("scfggMkty","SCFGG_MKTY","","","");
        $("#scfggMkty").val(scfggMkty);
        changeScfggMkty();
    }
    var trgGbn = $("#trgGbn").val();
    if(trgGbn == "01"){
        changeRdpqGdSd();
    }else if(trgGbn == "03"){
        changeBsisGdSd();
    }
    
}

//도로명판 
function changeRdpqGdSd(){
    var gdftyForm = $("#gdftyForm").val();
    var useTarget = $("#useTarget").val();
    var plqDirection = $("#plqDirection").val();
    var rdpqGdSd = $("#rdpqGdSd").val();
    var scfggMkty = $("#scfggMkty").val();

    var colume = "RDPQ_GD_SD";
    
    var useCd = gdftyForm.charAt(0) + useTarget.charAt(1) +  plqDirection.charAt(2);

    if(scfggMkty != "1"){
        colume = "RDPQ_GD_SD_2";
    }

    customSelectBox("rdpqGdSd",colume,useCd,0,3);

    setGdfyWide('rdpqGdSd');
}

//규격정보 셋팅
function setGdfyWide(id){
    var trgGbn = $("#trgGbn").val();
    var gdftyForm = $("#gdftyForm").val();
    var buldNmtType = $("#buldNmtType").val();
    var gdfyWide = $("#"+id+" option:selected").text();

    if(trgGbn == "02"){
        if(buldNmtType == "1000"){
            $("#buldNmtWide").val(gdfyWide.split("*")[0]);
            $("#buldNmtVertical").val(gdfyWide.split("*")[1]);
    
            $("#buldNmtWide").attr("disabled","disabled");
            $("#buldNmtVertical").attr("disabled","disabled");
        }else{
            $("#buldNmtWide").removeAttr("disabled");
            $("#buldNmtVertical").removeAttr("disabled");
        }  
    }else{
        if(gdftyForm == "10000"){
            $("#gdftyWide").val(gdfyWide.split("*")[0]);
            $("#gdftyVertical").val(gdfyWide.split("*")[1]);
    
            $("#gdftyWide").attr("disabled","disabled");
            $("#gdftyVertical").attr("disabled","disabled");
        }else{
            $("#gdftyWide").removeAttr("disabled");
            $("#gdftyVertical").removeAttr("disabled");
        }    
    }

}

//단가 변경
function checkUnitPrice(id){
    var targetId = $("#targetId").val();
    var price = $("#"+id).val();
    
    var standPrice = 10000;
    if(targetId != "gdftyUnitPrice"){
        standPrice = 1000;
    }

    if(price < standPrice){
        navigator.notification.alert("단가는 " + standPrice + "원 이하로 입력할수 없습니다.", function () {}, '알림', '확인');
        $("#fixedValue").focus();
        // util.toast("단가는 " + standPrice + "원 이하로 입력할수 없습니다.");
        
        return;
    }else{
        txtMaxlength("fixedValue",'10');
    }
}
//설치장소 및 사용대상에 따른 규격(기초번호판)
function changeBsisGdSd(){
    var gdftyForm = $("#gdftyForm").val();
    var bsis_itlpcSe = $("#bsis_itlpcSe").val();
    var useTarget = $("#useTarget").val();
    var bsis_bsisGdSd = $("#bsis_bsisGdSd").val();

    var codeValue = gdftyForm.charAt(0) + useTarget.charAt(1) +  bsis_itlpcSe.charAt(2);
    var lastNum = 3;
    if(bsis_itlpcSe.charAt(2) == "7"){
        codeValue = gdftyForm.charAt(0) +"97";
        lastNum = 3;
    }else if(useTarget == "01000" || useTarget == "04000" || useTarget == "05000"){
        codeValue = "12"
        lastNum = 2;
    }else if(useTarget == "02000" || useTarget == "03000" || useTarget == "06000"){
        codeValue = "13"
        lastNum = 2;
    }

    customSelectBox("bsis_bsisGdSd","BSIS_GD_SD",codeValue,0,lastNum);
    $("#bsis_bsisGdSd").val(bsis_bsisGdSd);
}
//설치시설물_메인 변경(기초번호판)
function changeBsisInstlFtyMain(){
    var bsis_instlFty_main = $("#bsis_instlFty_main").val();

    if(bsis_instlFty_main == "00"){ //메인의 기타 코드없음;;

        customSelectBox("bsis_instlFty_main","INSTL_FTY","0",0,1);
        $("#bsis_instlFty_main").append("<option value='00'>기타</option>");
        $("#bsis_instlFty_main").val(bsis_instlFty_main);

        customSelectBox3("bsis_instlFty","INSTL_FTY","0",0,1); 
        changeBsisInstlFty();

        $("#bsis_instlFty_td").show();
    }else{
        customSelectBox("bsis_instlFty_main","INSTL_FTY","0",0,1);
        $("#bsis_instlFty_main").append("<option value='00'>기타</option>");

        //서브 초기화
        $("#bsis_instlFty").val('');
        changeBsisInstlFty();

        $("#bsis_instlFty_td").hide();
    }
}
//설치시설물 변경(기초번호판)
function changeBsisInstlFty(){
    var bsis_instlFty_main = $("#bsis_instlFty_main").val();
    var bsis_instlFty = $("#bsis_instlFty").val();

    if(bsis_instlFty_main == "00"){

        customSelectBox("bsis_instlFty_main","INSTL_FTY","0",0,1);
        $("#bsis_instlFty_main").append("<option value='00'>기타</option>");
        $("#bsis_instlFty_main").val(bsis_instlFty_main);

        customSelectBox3("bsis_instlFty","INSTL_FTY","0",0,1); 
        if(bsis_instlFty != null){
            $("#bsis_instlFty").val(bsis_instlFty);
        }

        // $("#bsis_instlFty").removeAttr("disabled");
        $("#bsis_instlFty").show();
    }else{
        customSelectBox("bsis_instlFty_main","INSTL_FTY","0",0,1);
        $("#bsis_instlFty_main").append("<option value='00'>기타</option>");
        $("#bsis_instlFty_main").val(bsis_instlFty_main);

        //서브 초기화
        // $("#bsis_instlFty").val('');

        // $("#bsis_instlFty").attr("disabled","disabled");
        $("#bsis_instlFty").hide();
    }

    if($("#bsis_instlFty").val() != "99"){
        $("#bsis_insFtyDc").attr("disabled","disabled");
        $("#insFtyDc").hide();
    }else{
        $("#bsis_insFtyDc").removeAttr("disabled");
        $("#insFtyDc").show();
    }
    
}
//광고에따른 분류변경(지역안내판)
function changeAdvrtsCd(){
    var area_advrtsCd = $("#area_advrtsCd").val();

    if(area_advrtsCd == "9"){
        $("#area_advCn").attr("disabled","disabled");
    }else{
        $("#area_advCn").removeAttr("disabled");
    }
}
//제작형식에 따른 조명
function changeMnf(id){
    var thisValue = $("#"+id).val();
    if(thisValue == "1"){//판자형
        customSelectBox("lghtCd","LGHT_CD","2",0,1);
    }else{
        makeOptSelectBox("lghtCd","LGHT_CD","2","","");
    }
}
//건물번호판 용도
function changeBuldNmtPurpose(){
    var buldNmtType = $("#buldNmtType").val();

    // customSelectBox("buldNmtPurpose","BUL_NMT_PR",buldNmtType.substr(0,1),0,1);
    customSelectBox2("buldNmtPurpose","BUL_NMT_PR",buldNmtType.substr(0,1),0,1,1,3);
    changeBuldNmtCd();

}
//건물번호판 규격
function changeBuldNmtCd(){
    var buldNmtPurpose = $("#buldNmtPurpose").val();
    var usedCode = buldNmtPurpose.substr(0,2);
    if(usedCode.substr(0,1) == "1"){
        customSelectBox("buldNmtCd","BUL_NMT_CD",buldNmtPurpose.substr(0,2),0,2);
        $("#buldNmtCd").removeAttr("disabled");

        $("#buldNmtWide").attr("disabled","disabled");
        $("#buldNmtVertical").attr("disabled","disabled");
    }else{
        customSelectBox("buldNmtCd","BUL_NMT_CD",buldNmtPurpose.substr(0,2),0,2);
        $("#buldNmtCd").attr("disabled","disabled");
        setGdfyWide('buldNmtCd');

        $("#buldNmtWide").removeAttr("disabled");
        $("#buldNmtVertical").removeAttr("disabled");
    }
    
}

//안내시설형식변경
function changeGdftyForm(){
    var gdftyForm = $("#gdftyForm").val();
    var trgGbn = $("#trgGbn").val();

    if(gdftyForm == "10000"){
        
        if(trgGbn == "01"){
            changeRdpqGdSd();
            $("#rdpqGdSd").removeAttr("disabled");
        }else if(trgGbn == "03"){
            changeBsisGdSd();
            $("#bsis_bsisGdSd").removeAttr("disabled");
        }else if(trgGbn == "04"){
            makeOptSelectBox("area_areaGdSd","AREA_GD_SD","","","");
            $("#area_areaGdSd").removeAttr("disabled");
        }
        
        $("#gdftyWide").attr("disabled","disabled");
        $("#gdftyVertical").attr("disabled","disabled");
    }else{
        if(trgGbn == "01"){
            changeRdpqGdSd();
            
            $("#rdpqGdSd").attr("disabled","disabled");
        }else if(trgGbn == "03"){
            changeBsisGdSd();
            $("#bsis_bsisGdSd").attr("disabled","disabled");
        }else if(trgGbn == "04"){
            customSelectBox("area_areaGdSd","AREA_GD_SD","",0,5);
            $("#area_areaGdSd").attr("disabled","disabled");
        }
        
        $("#gdftyWide").removeAttr("disabled");
        $("#gdftyVertical").removeAttr("disabled");
    }
}
//이면도로용 도로명판 규격
function checkRddrRdsd(){
    var rddr_afRdplqSe = $("#rddr_afRdplqSe").val();
    var rddr_afRdCo = $("#rddr_afRdCo").val();
    var rddr_rddrGdSd = $("#rddr_rddrGdSd").val();

    var useCd = rddr_afRdplqSe.charAt(1) + rddr_afRdCo.charAt(2);
    
    customSelectBox("rddr_rddrGdSd","RDDR_GD_SD",useCd,1,2);
    $("#rddr_rddrGdSd").val(rddr_rddrGdSd);

}
//예고용 도로명판 규격
function checkPrntRdsd(){
    var useTarget = $("#useTarget").val();
    var useCd = useTarget.charAt(1);

    customSelectBox("prntGdSd","PRNT_GD_SD",useCd,1,1);
    $("#prntGdSd").val(prntGdSd);

}

function checkScfggUla2(){

    var scfggUla1 = $("#scfggUla1").val();
    var scfggUla2 = $("#scfggUla2").val();

    if((scfggUla1 != "99" && scfggUla2 != "99") && scfggUla1 == scfggUla2){
        navigator.notification.alert(msg.notSameScfggMkty, '', '알림', '확인');
        $("#scfggUla2").val("99");
    }
}
//양면여부 변경
function changeBdrclAt(){
    var bdrclAt = $("#bdrclAt").val();

    if(bdrclAt == '0'){//단면
        $(".bk").hide();
    }else{
        $(".bk").show();
    }
}

//건물용도 변경
function changeBdtypCd(){
    var bdtypCd_main = $("#bdtypCd_main").val();

    customSelectBox2("bdtypCd","BDTYP_CD",bdtypCd_main.substr(0,2),0,2,2,5);

    $("#bdtypCd").val(bdtypCd_main);
}