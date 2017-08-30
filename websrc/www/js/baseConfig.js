
$(function () {
    $(document).on("pagecreate", pages.baseConfigPage.div, function () {
        
    });

    $(document).on("pagebeforeshow", pages.baseConfigPage.div, function (event, data) {
        
        $("#sigNm").text(localStorage["sigNm"]);
        
        var versionInfo = JSON.parse(localStorage["versionInfo"]);
        $("#versionName").text("{0}({1})".format(versionInfo.versionName,versionInfo.versionCode));

        var appInfo = JSON.parse(localStorage["appInfo"]);
        // var telNo = localStorage["telNo"];
        $("#telNo").text("{0}".format(appInfo.opeId));
        
        var mapBaseConfig = JSON.parse(localStorage["mapBaseConfig"]);
        
        //슬라이더 값 셋팅 후 리플레시
        $("#slider-spgf").val(mapBaseConfig.zoom.spgf).slider("refresh");
        $("#slider-buld").val(mapBaseConfig.zoom.buld).slider("refresh");
        
        //이미지셋팅
        setLevelImg("spgf",mapBaseConfig.zoom.spgf);
        setLevelImg("buld",mapBaseConfig.zoom.buld);
        
        //슬라이더 변경시 자동저장
        $("#slider-spgf").change(changedMapBaseConfig);
        $("#slider-buld").change(changedMapBaseConfig);
        
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