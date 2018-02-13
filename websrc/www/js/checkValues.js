//글자수 제한
function txtMaxlength(id, size, min) {
    var targetText = $("#"+id);
    var textLength = targetText.val().length;
    
    
    if (textLength > size) {
        navigator.notification.alert("" + size + "자 제한입니다.", function () {
            targetText.val(targetText.val().substring(0, size));
            // targetText.focus();
        }, '알림', '확인');
      
    }else if(textLength <= min){
        navigator.notification.alert("빈칸을 넣을 수 없습니다.", function () {
            targetText.val(targetText.val().substring(0, size));
            // targetText.focus();
        }, '알림', '확인');
    }else{
        setInputPop();
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

    changeRdpqGdSd();

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
    }else if(trgGbn == "04"){
        changeBsisGdSd();
    }
    
}

//도로명판 규격변경
function changeRdpqGdSd(){
    var useTarget = $("#useTarget").val();
    var plqDirection = $("#plqDirection").val();
    var rdpqGdSd = $("#rdpqGdSd").val();
    var scfggMkty = $("#scfggMkty").val();

    var colume = "RDPQ_GD_SD";
    
    var useCd = useTarget.charAt(1) +  plqDirection.charAt(2);

    if(scfggMkty != "1"){
        colume = "RDPQ_GD_SD_2";
    }

    customSelectBox("rdpqGdSd",colume,useCd,1,2);

    setGdfyWide();
}

//규격정보 셋팅
function setGdfyWide(){
    
    var rdpqGdSd = $("#rdpqGdSd option:selected").text();

    rdpqGdSd.split("*");
    $("#gdftyWide").val(rdpqGdSd.split("*")[0]);
    $("#gdftyVertical").val(rdpqGdSd.split("*")[1]);

}

//단가 변경
function checkUnitPrice(id){
    var targetId = $("#targetId").val();
    var price = $("#"+id).val()
    
    var standPrice = 10000;
    if(targetId != "gdftyUnitPrice"){
        standPrice = 1000;
    }

    if(price < standPrice){
        navigator.notification.alert("단가는 " + standPrice + "원 이하로 입력할수 없습니다.", function () {
            
            
        }, '알림', '확인');

        util.toast("단가는 " + standPrice + "원 이하로 입력할수 없습니다.");
        
        return;
    }else{
        txtMaxlength(id,'10');
    }
}
//설치장소 및 사용대상에 따른 규격(기초번호판)
function changeBsisGdSd(){
    var bsis_itlpcSe = $("#bsis_itlpcSe").val();
    var useTarget = $("#useTarget").val();
    var bsis_bsisGdSd = $("#bsis_bsisGdSd").val();

    var codeValue = useTarget.charAt(1) +  bsis_itlpcSe.charAt(2);

    if(bsis_itlpcSe.charAt(2) == "7"){
        codeValue = "97";
    }

    customSelectBox("bsis_bsisGdSd","BSIS_GD_SD",codeValue,1,2);
    $("#bsis_bsisGdSd").val(bsis_bsisGdSd);
}