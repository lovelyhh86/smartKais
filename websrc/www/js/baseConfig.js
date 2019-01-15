
$(function () {
    $(document).on("pagecreate", pages.baseConfigPage.div, function () {
        
    });

    $(document).on("pagebeforeshow", pages.baseConfigPage.div, function (event, data) {
        
        var versionInfo = JSON.parse(localStorage["versionInfo"]);
        $("#versionName").text("{0}({1})".format(versionInfo.versionName,versionInfo.versionCode));

        var appInfo = JSON.parse(localStorage["appInfo"]);
        // var telNo = localStorage["telNo"];
        // localStorage["sigNm"] = appInfo.sigNm;
        $("#sigNm").text(appInfo.sigNm);
        $("#telNo").text("{0}".format(appInfo.opeId));
        
        var mapBaseConfig = JSON.parse(localStorage["mapBaseConfig"]);
        // localStorage["autoImgRoadConf"]
        
        //슬라이더 값 셋팅 후 리플레시
        $("#slider-spgf").val(mapBaseConfig.zoom.spgf).slider("refresh");
        $("#slider-buld").val(mapBaseConfig.zoom.buld).slider("refresh");
        
        //이미지셋팅
        setLevelImg("spgf",mapBaseConfig.zoom.spgf);
        setLevelImg("buld",mapBaseConfig.zoom.buld);
        
        //슬라이더 변경시 자동저장
        $("#slider-spgf").change(changedMapBaseConfig);
        $("#slider-buld").change(changedMapBaseConfig);

        // 원본사진 자동조회
        // var autoImgRoadConf = localStorage["autoImgRoadConf"];
    
        // if(autoImgRoadConf){
            // $("#autoImgRoadConf").val(autoImgRoadConf).attr("selected","selected");
            // $("#autoImgRoadConf").trigger("change");
        // }
        // 일제점검 지도조회 기준년도
        // addResearchYear('researchYear',true);
        
    });

    $(document).on("pageshow", pages.baseConfigPage.div, function () {

    });

    function changedMapBaseConfig(){
        
        mapBaseConfig = {
            zoom : {
                spgf : $("#slider-spgf").val(),
                buld : $("#slider-buld").val()
            }
        }

        localStorage["mapBaseConfig"] = JSON.stringify(mapBaseConfig);

        //이미지셋팅
        setLevelImg("spgf",mapBaseConfig.zoom.spgf);
        setLevelImg("buld",mapBaseConfig.zoom.buld);

    }

    function setLevelImg(type, level){
        
        if(level > 12){
            $("#slider-"+type+"-img").attr("src","image/" + type + "-" + level + ".png");
        }else{
            $("#slider-"+type+"-img").attr("src","image/level-" + level + ".png");
        }
        
    }

    
});

function changeAutoImgRoading(){
    var autoImgRoadConf = $("#autoImgRoadConf").val();
    localStorage["autoImgRoadConf"] = autoImgRoadConf;
    // warnnigToast();

    if(autoImgRoadConf == "on" && !MapUtil.photo.isPhoto()){
        selectOldImg();
    }
    
}

function warnnigAlert(){
    var autoImgRoadConf = $("#autoImgRoadConf").val();
    
    if(autoImgRoadConf == "on"){
        navigator.notification.alert(msg.autoImgRoadingAlert, '', '알림', '확인');
    }
}

function warnnigToast(){
    var autoImgRoadConf = $("#autoImgRoadConf").val();
    
    if(autoImgRoadConf == "on"){
        util.toast(msg.autoImgRoadingAlert,'warning');
    }
}

function changeCheckResearchYear(){
    var researchYear = $("#researchYear").val();
    localStorage["researchYear"] = researchYear;

    if(map){
        removeLayers();
    }
}

function addResearchYear(id, option){
    $('#' + id + ' option').remove();

    // if(option){
    //     $('#'+id).append($('<option>', {
    //         value: 'ALL',
    //         text: '작년 + 올해'
    //     }));
    // }

    $('#'+id).append($('<option>', {
        value: util.getToday().substr(0,4) -1,
        text: util.getToday().substr(0,4) -1
    }));

    $('#'+id).append($('<option>', {
        value: util.getToday().substr(0,4),
        text: util.getToday().substr(0,4)
    }));

    // var researchYear = localStorage["researchYear"];

    // if(researchYear && (researchYear != 'ALL' || option)){
    //     $("#"+ id).val(researchYear).attr("selected","selected");
    // }else{
        $('#'+ id +' option:last').attr('selected','selected');
    // }
    // $('#'+id).trigger('change');
}