
$(function () {
    $(document).on("pagecreate", pages.baseConfigPage.div, function () {
        
    });

    $(document).on("pagebeforeshow", pages.baseConfigPage.div, function (event, data) {
        //기본정보 표시
        var versionInfo = JSON.parse(localStorage["versionInfo"]);
        $("#versionName").text("{0}({1})".format(versionInfo.versionName,versionInfo.versionCode));

        var appInfo = JSON.parse(localStorage["appInfo"]);
        // var telNo = localStorage["telNo"];
        // localStorage["sigNm"] = appInfo.sigNm;
        $("#sigNm").text(appInfo.sigNm);
        $("#telNo").text("{0}".format(appInfo.opeId));
        

        //심볼표시 레벨설정
        var maxResolution = JSON.parse(localStorage["maxResolution"]);
        
        var zoomList = [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125] ;
        
        //슬라이더 값 셋팅 후 리플레시
        $("#slider-spgf").val(zoomList.indexOf(maxResolution.spgf)+1).slider("refresh");
        $("#slider-buld").val(zoomList.indexOf(maxResolution.buld)+1).slider("refresh");
        $("#slider-intrvl").val(zoomList.indexOf(maxResolution.intrvl)+1).slider("refresh");

        $("#slider-spgf").change(changedMaxResolution);
        $("#slider-buld").change(changedMaxResolution);
        $("#slider-intrvl").change(changedMaxResolution);

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

    

    
});
var zoomList = [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125] ;
function changedMapBaseConfig(){
        
    mapBaseConfig = {
        zoom : {
            spgf : $("#slider-spgf").val(),
            buld : $("#slider-buld").val()
        }
    }

    localStorage["mapBaseConfig"] = JSON.stringify(mapBaseConfig);

    //이미지셋팅
    // setLevelImg("spgf",mapBaseConfig.zoom.spgf);
    // setLevelImg("buld",mapBaseConfig.zoom.buld);

}

function changedMaxResolution(){
    // [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25] (0.5 = 13 level, 1 = 12 level)

    

    maxResolution = {
        spgf : zoomList[$("#slider-spgf").val() -1],
        buld : zoomList[$("#slider-buld").val() -1],
        intrvl : zoomList[$("#slider-intrvl").val() -1]
    }

    localStorage["maxResolution"] = JSON.stringify(maxResolution);

    setMapResolotion();

    MapUtil.setting.maxResolution_spgf = zoomList[$("#slider-spgf").val() -1];
    MapUtil.setting.maxResolution_buld = zoomList[$("#slider-buld").val() -1];
    MapUtil.setting.maxResolution_intrvl = zoomList[$("#slider-intrvl").val() -1];

    //이미지셋팅
    // setLevelImg("spgf",mapBaseConfig.zoom.spgf);
    // setLevelImg("buld",mapBaseConfig.zoom.buld);

}

function setMapResolotion(){
    //심볼표시 레벨설정
    var maxResolution = JSON.parse(localStorage["maxResolution"]);

    if(map != null){//맵을 연상태 일때는 직접변경
        var layerList = map.getLayers().getArray();
        for(var i in layerList){
            var id = layerList[i].get('id');
            if(id == DATA_TYPE.LOC){
                layerList[i].setMaxResolution(maxResolution.spgf);
            }else if(id == DATA_TYPE.ENTRC){
                layerList[i].setMaxResolution(maxResolution.buld);
            }else if(id == DATA_TYPE.INTRVL){
                layerList[i].setMaxResolution(maxResolution.intrvl);
            }
        }
    }
}

function setLevelImg(type, level){
    
    if(level > 12){
        $("#slider-"+type+"-img").attr("src","image/" + type + "-" + level + ".png");
    }else{
        $("#slider-"+type+"-img").attr("src","image/level-" + level + ".png");
    }
    
}

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

function refreshMaxResolution(){

    $("#slider-spgf").val(12);
    $("#slider-buld").val(13);
    $("#slider-intrvl").val(14);


    changedMaxResolution();

    //슬라이더 값 셋팅 후 리플레시
    $("#slider-spgf").val(zoomList.indexOf(maxResolution.spgf)+1).slider("refresh");
    $("#slider-buld").val(zoomList.indexOf(maxResolution.buld)+1).slider("refresh");
    $("#slider-intrvl").val(zoomList.indexOf(maxResolution.intrvl)+1).slider("refresh");

    $("#slider-spgf").change(changedMaxResolution);
    $("#slider-buld").change(changedMaxResolution);
    $("#slider-intrvl").change(changedMaxResolution);

}