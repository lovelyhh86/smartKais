var KEY = {
    plateType: { "ROAD": 1, "BASE": 2, "LOCAL": 3, "BUILD": 4, "ENTRC": 5 },
    plateDir: { "ONE": "00100", "BI": "00200", "FORWARD": "00300", "ONE_S": "00101", "ONE_E": "00102" }
};
var MapUtil = {
    init: function() {
        MapUtil.controls.init();
        MapUtil.handler.init();
    },
    setting:{ maxResolution_spgf : JSON.parse(localStorage["maxResolution"]).spgf , // [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25] (0.5 = 13 level, 1 = 12 level)
              maxResolution_buld : JSON.parse(localStorage["maxResolution"]).buld,
              cluster : 30},
    photo: {
        // 사진 조회 및 촬영에 대한 상태 코드(L: 원거리(tl_spgf_loc), M: 근거리(tn_spgf_manage))
        state: {
            L: { isPhoto: false, edited: false },
            M: { isPhoto: false, edited: false },
            init: function(type) {
                var picInfo = $(".photoTable .picInfo" + (type ? "."+type : ""));

                picInfo.find(".picImg IMG").remove();   // 기존 사진 화면 제거
                picInfo.find(".opertDe").html('-');
                picInfo.each(function(i, o){
                    $(o).data('picSn', '');  // 기존 사진 일련번호 초기화
                });

                if(type) {
                    MapUtil.photo.doLoaded(false, type);
                    MapUtil.photo.doEdit(false, type);
                } else {
                    MapUtil.photo.state.L.isPhoto = MapUtil.photo.state.L.edited = false;
                    MapUtil.photo.state.M.isPhoto = MapUtil.photo.state.M.edited = false;
                }
            }
        },
        refresh: function(){
            MapUtil.photo.state.L.isPhoto = false;
            MapUtil.photo.state.L.edited = false;
            MapUtil.photo.state.M.isPhoto = false;
            MapUtil.photo.state.M.edited = false;
        },
        isEdited: function(type) {
            if(type) {
                return Function("return MapUtil.photo.state.{0}.edited".format(type))();
            } else {
                return MapUtil.photo.state.L.edited || MapUtil.photo.state.M.edited;
            }
        },
        isPhoto: function(type) {
            if(type) {
                return Function("return MapUtil.photo.state.{0}.isPhoto".format(type))();
            } else {
                return MapUtil.photo.state.L.isPhoto || MapUtil.photo.state.M.isPhoto;
            }
        },
        doEdit: function(isEdited, type) {
            if(type) {
                Function("MapUtil.photo.state.{0}.edited={1}".format(type, isEdited))();
            } else {
                MapUtil.photo.state.L.edited = MapUtil.photo.state.M.edited = isEdited;
            }
        },
        doLoaded: function(isLoaded, type) {
            if(type) {
                Function("MapUtil.photo.state.{0}.isPhoto={1}".format(type, isLoaded))();
            } else {
                MapUtil.photo.state.L.isPhoto = MapUtil.photo.state.M.isPhoto = isLoaded;
            }
        },
        doDelete: function(isDeleted, type) {
            MapUtil.photo.doEdit(Boolean(MapUtil.photo.isPhoto(type) ^ !isDeleted), type);
        }
    },
    handler: {
        init: function() {
            MapUtil.handler.popupHandler();
        },
        popupHandler: function() {
            $("#popup-road .ui-body:last .ui-radio input:radio").on("change", function() {
                $(this).parent().parent().children("label").each(function() {
                    if ($(this).hasClass("ui-radio-on")) {
                        var src = $(this).children("img").attr("src");
                        $(this).children("img").attr("src", src.replace(/(.*_.*)_.*\.(png)/, "$1_on.$2"));
                    } else {
                        $(this).children("img").attr("src", src.replace(/(.*_.*)_.*\.(png)/, "$1_off.$2"));
                    }
                });
            });
        },
        dataPopupCloserHandler: function() {
            $(".dataPopCloser").on("click", function() {
                $(".dataWrap").hide()
                clearMask();
            });
        },
        // 사진 조회 버튼
        photoToggleHandler: function(layerID, f) {
            $(".detailView .infoWrap .infoHeader .photo").click(function() {
                //팝업창 최소화 되어있을 경우 대비 (무조건 켜기)
                isPopState = "off";
                toggleDetailView();

                // 사진 조회 및 편집 상태 초기화
                MapUtil.photo.state.init();

                //검정막
                wrapWindowByMask('mask');

                //옵션 적용안됨
                $("#photoDialog").dialog({
                    modal: true,
                    draggable: false,
                    resizable: false,
                    position: ['center', 'top'],
                    buttons: {
                        "I've read and understand this": function() {
                            $(this).dialog("close");
                        }
                    }
                });

                //2번쨰 클릭부터 표출이 안되서 추가
                $("#photoDialog").show();

                var photoNum = $(".infoHeader .photo .photoNum").text();
                var cntMphoto = $("#cntMphoto").text();
                var cntLphoto = $("#cntLphoto").text();

                var autoImgRoadConf = localStorage["autoImgRoadConf"];

                //원본사진 자동조회
                $("#autoImgRoadConf").val(autoImgRoadConf);
                $("#autoImgRoadConf").trigger('changed');

                if((cntMphoto > 0 || cntLphoto > 0) && autoImgRoadConf == "on"){
                    // selectOriImg();
                    selectOldImg();
                }

                // 사진모드
                // if ($(".detailView .infoWrap .infoContent .photoWrap").css("display") != "none") {
                //     if($("#isUpdtGbn").val().indexOf("I") != -1){
                //         loadUpdtData("true");
                //     }else{
                //         selectOldImg(photoNum);
                //     }

                // }

            });
        },
        takePhotoHandler: function() {
            $(".photoWrap .picInfo .btnPoint").click(function(evt) {
                var _this = $(this);
                util.takePictureFromCamera(function(ret) {
                    // <img style='height: 220px; width: 100%; object-fit: contain' src=''/>
                    var imgHtml = "<img style='height: 220px; width: 100%; object-fit: contain' src='data:image/jpeg;base64," + ret.src +"'/>";
                    var picInfo = $(evt.target).parent().parent(); // class="picInfo"
                    var photoType = picInfo.data("picType");   // 구분(원거리: L, 근거리: M)

                    picInfo.find(".picImg IMG").remove();   // 기존 사진 화면 제거
                    picInfo.find(".opertDe").html('-');   // 기존 사진 저장일자 제거
                    picInfo.find(".picImg").append(imgHtml);
                    MapUtil.photo.doEdit(true, photoType);    // 편집 상태 반영
                });
            });
        },
        delPhotoHandler: function() {
            $(".photoWrap .picInfo .btnNormal").click(function(evt) {
                var _this = $(this);

                navigator.notification.confirm(msg.delPhoto,
                    function(btnIndex) {
                        switch(btnIndex) {
                            case 1: // 삭제
                                var picInfo = $(evt.target).parent().parent(); // class="picInfo"
                                var photoType = picInfo.data("picType");   // 구분(원거리: L, 근거리: M)

                                picInfo.find(".picImg IMG").remove();   // 기존 사진 화면 제거
                                MapUtil.photo.doDelete(true, photoType);

                                break;
                            case 2: // 취소
                                break;
                        }
                    }, '알림', ['삭제', '취소']
                );
            });
        },
    },
    controls: {
        init: function() {
            ol.inherits(MapUtil.controls.legendControl, ol.control.Control);        // 범례
            ol.inherits(MapUtil.controls.legendEntrcControl, ol.control.Control);   // 범례(건물번호판)
            ol.inherits(MapUtil.controls.currentControl, ol.control.Control);       // 내위치
            ol.inherits(MapUtil.controls.locManageControl, ol.control.Control); // 안내시설 위치관리
            ol.inherits(MapUtil.controls.locManageSpbdNmtgControl, ol.control.Control); // 건물번호판 위치관리
            ol.inherits(MapUtil.controls.selectAdrdcControl, ol.control.Control);   // 상세주소 기초조사
            ol.inherits(MapUtil.controls.returnZoomControl, ol.control.Control);    // 기본 축척으로 변경
            ol.inherits(MapUtil.controls.refreshMapControl, ol.control.Control);    // 지도 새로고침
            ol.inherits(MapUtil.controls.researchControl, ol.control.Control);      // 나의배정목록(안내시설물)
            ol.inherits(MapUtil.controls.researchSpbdControl, ol.control.Control);  // 나의배정목록(건물번호판)
            ol.inherits(MapUtil.controls.measureControl, ol.control.Control);       // 거리측정
            ol.inherits(MapUtil.controls.oldResearchCheckControl, ol.control.Control);  // 작년점검여부표시
            ol.inherits(MapUtil.controls.layerOnOffControl, ol.control.Control);  // 레이어컨트롤
            
            // ol.inherits(MapUtil.controls.selectSearchUser, ol.control.Control);
        },
        /**
         * @constructor
         * @extends {ol.control.Control}
         * @param {Object=} opt_options Control options.
         */
        legendControl: function(opt_options) {
            var options = opt_options || {};

            var legend = document.createElement('div');
            legend.className = "legend spgf ol-unselectable ol-control";
            var legendHtml = '<ul>';
            legendHtml += '<li class="rdpq">도로명판<span class="total">0건</span></li>';
            legendHtml += '<li class="rdpqW">도로명판(벽)<span class="total">0건</span></li>';
            legendHtml += '<li class="bsis">기초번호판<span class="total">0건</span></li>'
            // legendHtml += '<li class="bsisW">기초번호판(벽)<span class="total">0건</span></li>';
            legendHtml += '<li class="area">지역안내판<span class="total">0건</span></li>';
            legendHtml += '<li class="entrc">건물번호판<span class="total">0건</span></li>';
            // legendHtml += '<li class="intrvl">기초구간<span class="total">0건</span></li>';
            legendHtml += '<li class="mixPoint">다중설치시설</li>';
            // legendHtml += '<li class="spot">지점번호판<span class="total">0건</span></li>';
            legendHtml += '</ul>';
            legend.innerHTML = legendHtml;

            var this_ = this;

            ol.control.Control.call(this, {
                element: legend,
                target: options.target
            });

        },
        legendEntrcControl: function(opt_options) {
            var options = opt_options || {};

            var legend = document.createElement('div');
            legend.className = "legend spbd ol-unselectable ol-control";
            var legendHtml = '<ul>';
            legendHtml += '<li class="entrc">건물번호판<span class="total">0건</span></li>';
            // legendHtml += '<li class="entrc" onclick = "removeLayers('+"'intrvl'"+')">기초구간<span class="total">0건</span></li>';
            legendHtml += '</ul>';
            legend.innerHTML = legendHtml;

            var this_ = this;

            ol.control.Control.call(this, {
                element: legend,
                target: options.target
            });

        },
        currentControl: function(opt_options) {
            var options = opt_options || {};

            var button = document.createElement('button');
            button.innerHTML = '<img src="image/icon_curr.png" />';

            var geolocation = new ol.Geolocation( /** @type {olx.GeolocationOptions} */ {
                tracking: true,
                projection: baseProjection,
                trackingOptions: {
                    maximumAge: 0,
                    enableHighAccuracy: true,
                    timeout: 600000
                }
            });

            var curPosition = function() {
                var coordinate = geolocation.getPosition();
                // map.getView().setCenter(coordinate);

                setPosition(coordinate);

                //심플팝업 초기화
                $("#popup-content").empty();
                $("#popup").hide();
            }

            button.addEventListener('click', curPosition, false);
            button.addEventListener('touchstart', curPosition, false);

            var element = document.createElement('div');
            element.className = 'curPosition ol-unselectable ol-control';
            element.appendChild(button);

            ol.control.Control.call(this, {
                element: element,
                target: options.target
            });
        },
        locManageControl: function(opt_options) {

            var potisionManage = function() {
                if(util.isEmpty(app.info.rcrSn)){
                    navigator.notification.alert(msg.noRearcher, function () {
                        // util.goBack();
                        // return;
                    }, '알림', '확인');
                }else if(app.info.rcrTyp != "01"){
                    navigator.notification.alert(msg.notPubRearcher, function () {
                        // util.goBack();
                        // return;
                    }, '알림', '확인');
                    
                }else{
                    MapUtil.openList('locationManage');

                    //심플팝업 초기화
                    $("#popup-content").empty();
                    $("#popup").hide();
                }
            }

            var element = document.createElement('div');
            element.className = 'legend locManageSpgf ol-unselectable ol-control';

            var buttonHtml = "<ul><li class='nPos'>위치이동관리</li></ul>";
            element.innerHTML = buttonHtml;

            element.addEventListener('click', potisionManage, false);

            ol.control.Control.call(this, {
                element: element,
                target: options.target
            });

        },
        locManageSpbdNmtgControl: function(opt_options) {

            var potisionManage = function() {
                if(util.isEmpty(app.info.rcrSn)){
                    navigator.notification.alert(msg.noRearcher, function () {
                        // util.goBack();
                        // return;
                    }, '알림', '확인');
                }else if(app.info.rcrTyp != "01"){
                    navigator.notification.alert(msg.notPubRearcher, function () {
                        // util.goBack();
                        // return;
                    }, '알림', '확인');
                    
                }else{
                    MapUtil.openList('locationManageSpbdNmtg');

                    //심플팝업 초기화
                    $("#popup-content").empty();
                    $("#popup").hide();
                }
            }

            var element = document.createElement('div');
            element.className = 'legend locManageSpbd ol-unselectable ol-control';

            var buttonHtml = "<ul><li class='nPos'>위치이동관리</li></ul>";
            element.innerHTML = buttonHtml;

            element.addEventListener('click', potisionManage, false);

            ol.control.Control.call(this, {
                element: element,
                target: options.target
            });

        },
        selectAdrdcControl: function(opt_options) {
            var selectAdrdc = function(){
                if(util.isEmpty(app.info.rcrSn)){
                    navigator.notification.alert(msg.noRearcher, function () {
                        // util.goBack();
                        // return;
                    }, '조사자', '확인');
                }else if(app.info.rcrTyp != "01"){
                    navigator.notification.alert(msg.notPubRearcher, function () {
                        // util.goBack();
                        // return;
                    }, '알림', '확인');
                    
                }else{
                    MapUtil.openDetail(DATA_TYPE.ADRDC);
                    //심플팝업 초기화
                    $("#popup-content").empty();
                    $("#popup").hide();
                }
                
            }
            
            var element = document.createElement('div');
            element.className = 'legend selectAdrdc ol-unselectable ol-control';
    
            var newPosHtml = "<ul><li class='sAdr'>상세주소 기초조사</li></ul>";
            element.innerHTML = newPosHtml;
    
            element.addEventListener('click', selectAdrdc, false);
    
            ol.control.Control.call(this, {
                element: element,
                target: options.target
            });
        },
        returnZoomControl: function(opt_options) {
            var returnZoom = function(){
                var useLayers = map.getLayers().getArray();
                
                for (var i in useLayers) {
                    var id = useLayers[i].get("id");

                    // if (id == DATA_TYPE.LOC) {
                    // }

                    var mapBaseConfig = JSON.parse(localStorage["mapBaseConfig"]);

                    if (id == DATA_TYPE.ENTRC) {
                        map.getView().setZoom(mapBaseConfig.zoom.buld);
                    }else if( id == DATA_TYPE.LOC){
                        map.getView().setZoom(mapBaseConfig.zoom.spgf);
                    }

                }

                //심플팝업 초기화
                $("#popup-content").empty();
                $("#popup").hide();
            }
            var button = document.createElement('button');
            button.innerHTML = '<img src="image/icon_base_scale.png" />';

            button.addEventListener('click', returnZoom, false);
            button.addEventListener('touchstart', returnZoom, false);

            var element = document.createElement('div');
            element.className = 'returnZoom ol-unselectable ol-control';
            element.appendChild(button);

            ol.control.Control.call(this, {
                element: element,
                target: options.target
            });
        },
        refreshMapControl: function(opt_options){
            var refreshMap = function(){

                var layerList = map.getLayers().getArray();
                for (var i = 0; i < layerList.length; i++) {
                    var title = layerList[i].get("title");
                    if(title != "Mobile Kais Map"){
                        util.showProgress();
                        getVectorSource(map , title).clear();
                        util.dismissProgress();

                        // var source = layerList[i].getSource();
                        // source.clear();    
                    }

                    // getVectorSource(map , "위치레이어").clear();
                                
                }
                
                //심플팝업 초기화
                $("#popup-content").empty();
                $("#popup").hide();
            }
            var button = document.createElement('button');
            button.innerHTML = '<img src="image/refreshMap.png" />';

            button.addEventListener('click', refreshMap, false);
            button.addEventListener('touchstart', refreshMap, false);

            var element = document.createElement('div');
            element.className = 'refreshMap ol-unselectable ol-control';
            element.appendChild(button);

            ol.control.Control.call(this, {
                element: element,
                target: options.target
            });
        },
        researchControl: function(opt_options){
            var researchList = function(){
                //조사자일련번호
                if(util.isEmpty(app.info.rcrSn)){
                    navigator.notification.alert(msg.noRearcher, function () {
                        // util.goBack();
                        // return;
                    }, '조사자', '확인');
                }else{
                    MapUtil.openList('myResearch');
                    //심플팝업 초기화
                    $("#popup-content").empty();
                    $("#popup").hide();
                }
            }
            
            var element = document.createElement('div');
            element.className = 'legend selectResearch ol-unselectable ol-control';
    
            var newPosHtml = "<ul><li class='sRes'>점검목록</li></ul>";
            element.innerHTML = newPosHtml;
    
            element.addEventListener('click', researchList, false);
    
            ol.control.Control.call(this, {
                element: element,
                target: options.target
            });
        },
        researchSpbdControl: function(opt_options){
            var researchList = function(){
                //조사자일련번호
                if(util.isEmpty(app.info.rcrSn)){
                    navigator.notification.alert(msg.noRearcher, function () {
                        // util.goBack();
                        // return;
                    }, '조사자', '확인');
                }else{
                    MapUtil.openList('myResearchSpbd');
                    //심플팝업 초기화
                    $("#popup-content").empty();
                    $("#popup").hide();
                }
            }
            
            var element = document.createElement('div');
            element.className = 'legend selectResearchSpbd ol-unselectable ol-control';
    
            var newPosHtml = "<ul><li class='sRes'>점검목록</li></ul>";
            element.innerHTML = newPosHtml;
    
            element.addEventListener('click', researchList, false);
    
            ol.control.Control.call(this, {
                element: element,
                target: options.target
            });
        },
        measureControl: function(opt_options){
            
            var measureToggle = function(){
                var measureGbn = $("#measureGbn").val();
                if(measureGbn == "0"){
                    $("#measureGbn").val("1");
                    $("#popup").hide();
                }else{
                    $("#measureGbn").val("0");
                }
                $("#measureGbn").trigger("change");
                $("#measureMapInfo").toggle();
            }

            var button = document.createElement('button');
            button.innerHTML = '<img src="image/icon_rule_n.png" />';
            button.addEventListener('click', measureToggle, false);
            // button.addEventListener('touchstart', measureToggle, false);

            var element = document.createElement('div');
            element.className = 'measure ol-unselectable ol-control';
            element.appendChild(button);

            ol.control.Control.call(this, {
                element: element,
                target: options.target
            });
            
        },
        oldResearchCheckControl: function(opt_options){
            var oldResearchCheck = function(){
                
                var researchCheckGbn = $('#oResChk').is( ":checked" );//체크여부

                // if(researchCheckGbn){
                //     $('#oResChk' ).prop('checked','checked');
                // }else{
                //     $('#oResChk' ).prop('checked','');
                // }
                
                localStorage["researchCheckGbn"] = researchCheckGbn;

                if(map){
                    $('.refreshMap button').click();
                    util.toast('점검상태를 다시 표시합니다.');
                }

            }
            
            
            var element = document.createElement('div');
            element.className = 'legend oldResearchCheck ol-unselectable ol-control';
    
            var buttonHtml = "<ul><li class='oRes'><input type='checkBox' id='oResChk'></input><span id='oResSpan'>18년 점검여부 표시</span></li></ul>";
            element.innerHTML = buttonHtml;
    
            element.addEventListener('change', oldResearchCheck, false);
    
            ol.control.Control.call(this, {
                element: element,
                target: options.target
            });
        },
        layerOnOffControl: function(opt_options){
            var layerOnOff = function(){
                
                $("#layerTogglePop").toggle();

            }
            
            
            var element = document.createElement('div');
            element.className = 'legend layerOnOffBtn ol-unselectable ol-control';
    
            var buttonHtml = "<ul><li class='mLayer'>레이어관리</li></ul>";
            element.innerHTML = buttonHtml;
    
            element.addEventListener('click', layerOnOff, false);
    
            ol.control.Control.call(this, {
                element: element,
                target: options.target
            });
        },

    },
    openPopup: function(type, f) {
        var popHeader = "#common-pop .ui-bar";
        var container = "#common-pop .popup-content .ui-body:first";
        var url = "",
            header = "",
            headerFunc = "";

        $(popHeader).empty();
        $(container).empty();

        switch (type) {
            case KEY.plateType.ROAD:
                url = pages.detail_road;
                header = "도로명판";
                headerFunc = '<a href="javascript:util.camera()" id="camera" style="right: 0;float: right;margin: 0;padding: 0;color: white;">카메라</a>';

                break;
            case KEY.plateType.BUILD:
                url = pages.detail_buld;
                header = "건물정보";

                break;
            case KEY.plateType.ENTRC:
                url = pages.detail_entrc;
                header = "건물번호판";

                break;
        }

        $(popHeader).html("<h2>{0}</h2>".format(header));
        $(popHeader).html(headerFunc);

        $(container).load(url.link(), function() {
            MapUtil.setPopup(type, f);
            $("#common-pop").popup("open", { transition: "slideup" });
        })
    },
    openList:function(type){
        var detailTaget = '#detailView';
        switch (type) {
            case "myResearch":
                url = pages.detail_researchList;
                detailTaget = '#listView';
            break;
            case "myResearchSpbd":
                url = pages.detail_researchList;
                detailTaget = '#listView';
            break;
            case "locationManage":
                url = pages.locationManagePage;
            break;
            case "locationManageSpgf":
                url = pages.locationManageSpgfPage;
            break;
            case "locationManageSpbdNmtg":
                url = pages.locationManageSpbdNmtgPage;
            break;
            
        }
        $(detailTaget).load(url.link(), function() {
            MapUtil.setList(type);
            // MapUtil.handler.photoToggleHandler(layerID, f);
            // MapUtil.handler.takePhotoHandler();
            // MapUtil.handler.delPhotoHandler();
            MapUtil.handler.dataPopupCloserHandler();

            $(detailTaget).popup("open", { transition: "slideup" });
        })
    },
    openDetail: function(layerID, sn, rdGdftySe) {
        //조사자일련번호
        if(util.isEmpty(app.info.rcrSn)){
            navigator.notification.alert(msg.noRearcher, function () {
                // util.goBack();
                // return;
            }, '조사자', '확인');
        }else{
            var detailTaget = '#detailView';

            switch (layerID) {
                case DATA_TYPE.RDPQ:
                    if(rdGdftySe == "110"){
                        url = pages.detail_road;
                        header = "도로명판";
                    }else if(rdGdftySe == "210"){
                        url = pages.detail_road_rddr;
                        header = "이면 도로명판";
                    }else if(rdGdftySe == "310"){
                        url = pages.detail_road_prnt;
                        header = "예고용 도로명판";
                    }
                    
                    // url = pages.detail_spot;
                    
                    // headerFunc = '<a href="javascript:util.camera()" id="camera" style="right: 0;float: right;margin: 0;padding: 0;color: white;">카메라</a>';

                    break;
                case DATA_TYPE.AREA:
                    url = pages.detail_area;
                    header = "지역안내판";
                    // headerFunc = '<a href="javascript:util.camera()" id="camera" style="right: 0;float: right;margin: 0;padding: 0;color: white;">카메라</a>';

                    break;
                case DATA_TYPE.BSIS:
                    url = pages.detail_base;
                    header = "기초번호판";
                    // headerFunc = '<a href="javascript:util.camera()" id="camera" style="right: 0;float: right;margin: 0;padding: 0;color: white;">카메라</a>';

                    break;
                case DATA_TYPE.ENTRC:
                    url = pages.detail_entrc;
                    header = "건물번호판";

                    break;
                case DATA_TYPE.BULD:
                    url = pages.detail_buld;
                    header = "건물정보";

                    break;
                case DATA_TYPE.SPPN:
                    url = pages.detail_spot;
                    header = "지점번호판";

                    break;
                case DATA_TYPE.ADRDC:
                    // url = pages.detail_adrdc;
                    url = pages.detail_adrdcList;
                    header = "기초조사";

                    break;
            }

            $(detailTaget).load(url.link(), function() {
                MapUtil.setDetail(layerID, sn, rdGdftySe);
                MapUtil.handler.photoToggleHandler();
                MapUtil.handler.takePhotoHandler();
                MapUtil.handler.delPhotoHandler();
                MapUtil.handler.dataPopupCloserHandler();
                
                $(detailTaget).popup("open", { transition: "slideup" });
            })
        }
        
    },
    getPlateDir: function(f) {
        var ft_stbs_mn = parseInt(f.get("FT_STBS_MN"));
        var ft_stbs_sn = parseInt(f.get("FT_STBS_SN"));
        var ft_edbs_mn = parseInt(f.get("FT_EDBS_MN"));
        var ft_edbs_sn = parseInt(f.get("FT_EDBS_SN"));

        var ft_stbs = ft_stbs_mn + ft_stbs_sn * .1;
        var ft_edbs = ft_edbs_mn + ft_edbs_sn * .1;

        var ret = {
            ft_stbs: ft_stbs.toString().replace(/\./g, "-"),
            ft_edbs: ft_edbs.toString().replace(/\./g, "-"),
            ft_all: function(dir) {
                var format = "";
                switch (dir) {
                    case KEY.plateDir.ONE_S:
                        format = "{0} → {1}";
                        break;
                    case KEY.plateDir.ONE_E:
                        format = "{1} ← {0}";
                        break;
                    case KEY.plateDir.FORWARD:
                        format = "{1}<br>↑<br>{0}";
                        break;
                    default:
                        format = "";
                }
                return format.format(this.ft_stbs, this.ft_edbs);
            },
            direct: null
        }

        if (ft_stbs > ft_edbs) {
            ret.direct = KEY.plateDir.ONE_E;
        } else if (ft_stbs < ft_edbs) {
            ret.direct = KEY.plateDir.ONE_S;
        } else {
            console.error("Equal's FT_STBS({0}) and FT_EDBS({1})".format(ft_stbs, ft_edbs));
        }
        return ret;
    },
    setList: function(type){
        switch (type) {
            case "myResearch":
                addResearchYear('searchOptPlnYr',false);
                //점검목록
                pos = 0;
                // selectResearchContent(null,0,9);
                /**검색조건 */
                $("#searchOptTrgGbn").empty();
                // $("#searchOptTrgGbn").append('<option value="">전체</option>');
                $("#searchOptTrgGbn").append('<option value="02">건물번호판</option>');
                $("#searchOptTrgGbn").append('<option value="110">도로명판</option>');
                $("#searchOptTrgGbn").append('<option value="210">도로명판(이면)</option>');
                $("#searchOptTrgGbn").append('<option value="310">도로명판(예고)</option>');
                $("#searchOptTrgGbn").append('<option value="510">지역안내판</option>');
                $("#searchOptTrgGbn").append('<option value="610">기초번호판</option>');
                //시설구분
                // makeOptSelectBox("searchOptTrgGbn","TRG_GBN","02","전체","");
                //삭제상태코드
                // makeOptSelectBox("searchOptDelSttCd","DEL_STT_CD","","전체","");
                //시군구목록
                var guIncYn = app.info.guIncYn;
                if(guIncYn == "Y"){
                    //구재시 경우에만 조회
                    fnSelectSigList('#selSig');
                }else{
                    $("#selSig").append('<option value="'+ localStorage["admCd"]+ '">'+localStorage["admNm"]+'</option>');
                    $("#selSig").trigger('change');
                }


                var searchValue = app.info.searchValue;

                if(searchValue != null && searchValue != ""){
                    $("#searchOptRcrSn").val(searchValue.searchOptRcrSn);
                    $("#searchOptTrgGbn").val(searchValue.searchOptTrgGbn);
                    $("#searchOptRcSttCd").val(searchValue.searchOptRcSttCd);
                    $("#searchOptDelSttCd").val(searchValue.searchOptDelSttCd);
                }

            break;
            case "myResearchSpbd":
                addResearchYear('searchOptPlnYr',false);
                //점검목록
                pos = 0;
                // selectResearchContent("02",0,9);
                /**검색조건 */
                $("#searchOptTrgGbn").empty();
                // $("#searchOptTrgGbn").append('<option value="">전체</option>');
                // $("#searchOptTrgGbn").append('<option value="110">건물번호판</option>');
                // $("#searchOptTrgGbn").append('<option value="310">도로명판(예고)</option>');
                // $("#searchOptTrgGbn").append('<option value="510">지역안내판</option>');
                // $("#searchOptTrgGbn").append('<option value="610">기초번호판</option>');
                //시설구분
                makeOptSelectBox("searchOptTrgGbn","","","건물번호판","02");
                //삭제상태코드
                // makeOptSelectBox("searchOptDelSttCd","DEL_STT_CD","","전체","");
                var guIncYn = app.info.guIncYn;
                if(guIncYn == "Y"){
                    //구재시 경우에만 조회
                    fnSelectSigList('#selSig');
                }else{
                    $("#selSig").append('<option value="'+ localStorage["admCd"]+ '">'+localStorage["admNm"]+'</option>');
                    $("#selSig").trigger('change');
                }
                
                var searchValue = app.info.searchValue;

                if(searchValue != null && searchValue != ""){
                    $("#searchOptRcrSn").val(searchValue.searchOptRcrSn);
                    $("#searchOptTrgGbn").val(searchValue.searchOptTrgGbn);
                    $("#searchOptRcSttCd").val(searchValue.searchOptRcSttCd);
                    $("#searchOptDelSttCd").val(searchValue.searchOptDelSttCd);
                }
            break;
            case "locationManage":
                // selectLocationMoveContent();
            break;
            case "locationManageSpgf":
                selectLocationMoveSpgfContent();
            break;
            case "locationManageSpbdNmtg":
                selectLocationMoveSpbdNmgtContent();
            break;
        }
    },
    setDetail: function(layerID, sn) {
        var codeList
        isPopState = "off";
        toggleDetailView();
        switch (layerID) {
            case DATA_TYPE.RDPQ:
                // var sn = f.get("RD_GDFTY_SN");
                var link = URLs.roadsignlink;
                MapUtil.setValues(layerID, link, trgSnGlobal);

                break;
            case DATA_TYPE.AREA:
                // var sn = f.get("RD_GDFTY_SN");
                var link = URLs.roadsignlink;

                MapUtil.setValues(layerID, link, trgSnGlobal);

                break;
            case DATA_TYPE.BSIS:
                // var sn = f.get("RD_GDFTY_SN");
                var link = URLs.roadsignlink;

                MapUtil.setValues(layerID, link, trgSnGlobal);

                break;
            case DATA_TYPE.ENTRC:
                // if(f != null){
                //     var sn = f.get("BUL_MAN_NO");
                //     var sn = f.get("bulManNo");
                // }else{
                    // var sn = trgSnGlobal
                // }
                // var link = URLs.entrclink;
                var link = URLs.nmtglink;

                MapUtil.setValues(layerID, link, sn);

                break;

            case DATA_TYPE.BULD:
                // if(f != null){
                //     var sn = f.get("BUL_MAN_NO");
                // }else{
                //     var sn = trgSnGlobal
                // }
                var link = URLs.buildSelectlink;

                try{
                    MapUtil.setValuesBuld(layerID, link, sn);
                }catch(error){
                    util.toast(msg.checkSetObjectError,"error");
                    util.dismissProgress();
                }

                break;
            case DATA_TYPE.SPPN:
                var link = URLs.spotSelectlink;
                try{
                    MapUtil.setValuesSppn(layerID, link, trgSnGlobal);
                }catch(error){
                    util.toast(msg.checkSetObjectError,"error");
                    util.dismissProgress();
                }

                break;
            case DATA_TYPE.ADRDC:
                // var link = URLs.spotSelectlink;

                // MapUtil.setValues(layerID, link, rdGdftySn);

                detailAddressContent();

                break;
            // case DATA_TYPE.RESEARCH:

            //     selectResearchContent();

            //     break;

        }

    },
    setValues: function(layerID, link, sn) {
        var url = URLs.postURL(link, { "sn": sn, "sigCd": app.info.sigCd, "workId": app.info.opeId });
        util.showProgress();
        util.postAJAX({}, url).then(
            function(context, rCode, results) {
                try {
                    
                    //통신오류처리
                    if (rCode != 0 || results.response.status < 0) {
                        navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                        util.dismissProgress();
                        return;
                    }

                    var data = results.data;

                    //원본 데이터 셋팅
                    setOriginData(data);

                    var msgText = msg.noItem;

                    if(layerID == DATA_TYPE.ENTRC){
                        msgText = msg.noItemSpbdNmtg;
                    }
                    //데이터 오류 처리
                    if (data == null) {
                        navigator.notification.alert(msgText,
                            function() {
                                $("#detailView").popup("close", { transition: "slideup" });
                            },
                            '알림', '확인'
                        );
                        util.dismissProgress();
                        return;
                    }

                    //*****************공통*****************
                    
                    var rdGdftySe = data.rdGdftySe;
                    $("#rdGdftySe").val(rdGdftySe);
                    if(rdGdftySe == null){
                        //일련번호
                        $("#trgSn").val(data.bulNmtNo);
                        $("#bulNmtNoLbl").text(data.bulNmtNo);
                        //위치일련번호
                        $("#trgLocSn").val(data.bulManNo);
                        $("#bulManNoLbl").text(data.bulManNo);
                        $("#eqbManSnLbl").text(data.eqbManSn);
                        if(data.eqbManSn != 0){
                            $(".eqbLbl").show();
                        }else{
                            $(".bulLbl").show();
                        }
                        //표면처리방법
                        makeOptSelectBox("prtTy","PRT_TY","","","");
                        $("#prtTy").val(data.prtTy);
                    }else{ //도로안내시설물인 경우
                        //일련번호
                        $("#trgSn").val(sn);
                        $("#rdGdftySnLbl").text(sn);
                        //위치일련번호
                        $("#trgLocSn").val(data.rdFtyLcSn);
                        $("#rdFtyLcSnLbl").text(data.rdFtyLcSn);

                        //****도로안내시설 위치정보****
                        //도로시설물
                        $("#rdftySeLbl").html(data.rdftySeLbl);
                        $("#rdftySe").html(data.rdftySe);
                        //설치도로명
                        $("#bsisRnLbl").html(data.bsisRnLbl);
                        //설치기초번호
                        var bsis = "{0}{1}".format((data.bsisMnnm ? data.bsisMnnm : ''), (data.bsisSlno != "0" ? '-' + data.bsisSlno : ''));
                        $("#bsis").html(bsis);

                        //****도로안내시설 기본정보****
                        //설치유형
                        $("#instSeLbl").html(data.instSeLbl);
                        $("#instSe").html(data.instSe);
                        //제작형식
                        var gdftyMnf = data.gdftyMnf;
                        $("#gdftyMnf").html(gdftyMnf);
                        $("#gdftyMnfLbl").html(data.gdftyMnfLbl);
                        //설치지점
                        makeOptSelectBox("instSpotCd","INS_SPO_CD","","","");
                        $("#instSpotCd").val(data.instSpotCd);
                        //조명여부
                        // if(gdftyMnf == "1"){
                        //     customSelectBox("lghtCd","LGHT_CD","2",0,1);
                        // }else{
                            makeOptSelectBox("lghtCd","LGHT_CD","","","");
                        // }
                        $("#lghtCd").val(data.lghtCd);
                        //교차로유형
                        makeOptSelectBox("instCrossCd","INS_CRS_CD","","","");
                        $("#instCrossCd").val(data.instCrossCd);

                        //설치일자
                        var instDate = data.instDate;
                        try {
                            var instDateText = "{0}년{1}월{2}일".format(instDate.substr(0, 4), instDate.substr(4, 2), instDate.substr(6, 2));
                            $("#instDate").html(instDateText);    
                        } catch (error) {
                            util.toast(msg.checkObject.format("설치일자"),"error");
                        }

                        // if(instDate.substr(0, 4) == util.getToday().substr(0, 4)){
                        //     //올해설치건은 점검불가
                        //     disableResearch();
                        //     $("#rcRslt").attr("placeholder","올해에 설치한 시설물은 점검 불가")
                        // }

                        //****도로안내시설 속성****
                        //안내시설형식
                        // $("#gdftyFormLbl").html(data.gdftyFormLbl);
                        if(rdGdftySe == "610"){
                            makeOptSelectBox("gdftyForm","BSIS_GDFTY_FOM","","","");
                        }else{
                            makeOptSelectBox("gdftyForm","GDFTY_FOM","","","");
                        }
                        $("#gdftyForm").val(data.gdftyForm);
                        // $("#gdftyForm").hide();
                        //사용대상
                        var useTarget = data.useTarget;
                        makeOptSelectBox("useTarget","USE_TRGET","","","");
                        $("#useTarget").val(useTarget);
                        
                        //도로명판 벽면형일 경우 사용대상은 보행자용으로만 처리되게 변경 + 이면도로명판도 보행자용만 선택
                        var instSe = data.instSe;
                        var rdGdftySe = data.rdGdftySe;
                        if((rdGdftySe == "110" && instSe == "00002") || rdGdftySe == "210"){
                            customSelectBox("useTarget","USE_TRGET","1","1","1");
                            checkChangeOrigin("useTarget");
                        }
                        
                        //양면여부
                        makeOptSelectBox("bdrclAt","BDRCL_AT","","","");
                        
                        // $("#bdrclAtLbl").html(data.bdrclAtLbl);
                        $("#bdrclAt").val(data.bdrclAt);

                        // changeBdrclAt();
                        //제2외국어여부
                        var scfggMkty = data.scfggMkty;
                        makeOptSelectBox("scfggMkty","SCFGG_MKTY","","","");
                        $("#scfggMkty").val(scfggMkty);
                        //언어1
                        makeOptSelectBox("scfggUla1","SCFGG_ULA1","","","");
                        $("#scfggUla1").val(data.scfggUla1);
                        //언어2
                        makeOptSelectBox("scfggUla2","SCFGG_ULA1","","","");
                        $("#scfggUla2").val(data.scfggUla2);
                        if(scfggMkty == "1"){
                            $("#scfggUla1").attr("disabled","disabled")
                            $("#scfggUla2").attr("disabled","disabled")
                        }else if(scfggMkty == "2"){
                            $("#scfggUla2").attr("disabled","disabled")
                        }
                        //단가(원)
                        $("#gdftyUnitPrice").text(data.gdftyUnitPrice);
                        //재질
                        makeOptSelectBox("gdftyQlt","GDFTY_QLT","","","");
                        $("#gdftyQlt").val(data.gdftyQlt);
                        //표면처리방법
                        makeOptSelectBox("prtTy","PRT_TY","","","");
                        $("#prtTy").val(data.prtTy);

                        // //가로*세로*두께
                        // $("#gdftyWide").val(data.gdftyWide);
                        // $("#gdftyVertical").val(data.gdftyVertical);
                        // $("#gdftyThickness").val(data.gdftyThickness);
                        // //표준형 일때
                        // if(data.gdftyForm == "10000"){
                        //     $("#gdftyWide").attr("disabled","disabled");
                        //     $("#gdftyVertical").attr("disabled","disabled");
                        // }

                    }

                    //시군구코드
                    $("#sigCd").val(data.sigCd);

                    //임시데이터 여부
                    var isUpdtGbn = data.isUpdtGbn;
                    
                    //사진건수
                    var cntMphoto = data.cntMFiles;//근거리
                    var cntLphoto = data.cntLFiles;//원거리

                    var cntFiles = cntMphoto + cntLphoto;

                    if(cntFiles == 0){
                        $("#orginPhotoBtn").hide();
                    }

                    $("#cntMphoto").text(cntMphoto);
                    $("#cntLphoto").text(cntLphoto);

                    try{
                        //임시사진 있을경우 N으로 표시
                        if(isUpdtGbn.indexOf("I") != -1){
                            cntFiles = "N";
                        }else{
                            $("#updtPhotoBtn").hide();
                        }
                    } catch (error) {
                        util.toast(msg.checkObject.format("임시데이터 여부"),"error");
                    }
                    //사진건수
                    $(".infoHeader .photo .photoNum").html(cntFiles);
                    //*****************공통*****************

                    
                    switch (layerID) {
                        case DATA_TYPE.RDPQ:
                            //제목창
                            var title = '';
                            //명판방향
                            var plqDirection = data.plqDirection;
                            //도로명
                            var frontKoreanRoadNm = data.frontKoreanRoadNm;
                            //시작기초번호
                            var frontStartBaseMasterNo = data.frontStartBaseMasterNo;
                            var frontStartBaseSlaveNo = data.frontStartBaseSlaveNo;
                            //종료기초번호
                            var frontEndBaseMasterNo = data.frontEndBaseMasterNo;
                            var frontEndBaseSlaveNo = data.frontEndBaseSlaveNo;

                            //이면도로용
                            if(rdGdftySe == "210"){
                                plqDirection = data.rddr_plqDrc;
                                frontKoreanRoadNm = data.rddr_korRn;
                                frontStartBaseMasterNo = data.rddr_stbsMn;
                                frontStartBaseSlaveNo = data.rddr_stbsSn;
                                frontEndBaseMasterNo = data.rddr_edbsMn;
                                frontEndBaseSlaveNo = data.rddr_edbsSn;

                                //이면도로명판 독립형인 경우 첫번째 도로명 표시
                                var rddr_afRdplqSe = data.rddr_afRdplqSe;
                                if(rddr_afRdplqSe == "01000"){
                                    //이면도로명판 내용
                                    var rddrCnList = data.rddrCn;
                                    try {
                                        if(rddrCnList != null && rddrCnList.length > 0){
                                            //방향
                                            var drcRdDrc =rddrCnList[0].drcRdDrc;

                                            var drcRdDrcLbl = "";
                                            if(drcRdDrc == "1"){
                                                drcRdDrcLbl = "⇳";
                                            }else if(drcRdDrc == "2"){
                                                drcRdDrcLbl == "↑";
                                            }else if(drcRdDrc == "3"){
                                                drcRdDrcLbl == "↓";
                                            }

                                            frontKoreanRoadNm = rddrCnList[0].drcKorRn + " " + rddrCnList[0].drcRdLt+ "m " + drcRdDrcLbl;

                                            }
                                    } catch (error) {
                                        util.toast(msg.checkObject.format("이면도로명판 내용"),"error");
                                    }
                                }

                            }else if(rdGdftySe == "310"){
                                plqDirection = "";
                                var prnt_ftRdLt = data.prnt_ftRdLt == null ? "" : data.prnt_ftRdLt + "M";
                                frontKoreanRoadNm = data.prnt_ftKorRn + " " + prnt_ftRdLt;
                                frontStartBaseMasterNo = "";
                                frontStartBaseSlaveNo = "";
                                frontEndBaseMasterNo = "";
                                frontEndBaseSlaveNo = "";
                            }

                            
                            var frontStartBaseNo = "{0}{1}".format(frontStartBaseMasterNo, (frontStartBaseSlaveNo != "0" ? '-' + frontStartBaseSlaveNo : ''));
                            var frontEndBaseNo = "{0}{1}".format(frontEndBaseMasterNo, (frontEndBaseSlaveNo != "0" ? '-' + frontEndBaseSlaveNo : ''));

                            //도로명,시작번호,종료번호가 null 일경우 도로명없음으로 표시
                            if(frontKoreanRoadNm == null ||frontStartBaseMasterNo == null || frontEndBaseMasterNo == null || frontStartBaseSlaveNo == null || frontEndBaseSlaveNo == null){
                                title = "도로명없음";
                            }else if(rdGdftySe == "210"){
                                title = "<span class='label'>[{0}] {1}<span>".format(
                                    data.rdGdftySeLbl,
                                    frontKoreanRoadNm ? frontKoreanRoadNm : '도로명없음'
                                );
                            }else{
                                if(plqDirection == '00200'){
                                    title = "<span class='label'>[{0}] {1} {2} {3}<span>".format(
                                        data.rdGdftySeLbl,
                                        frontStartBaseNo,
                                        frontKoreanRoadNm ? frontKoreanRoadNm : '도로명없음',
                                        frontEndBaseNo
                                    );
                                }else if(plqDirection == '00100' || plqDirection == '00300'){
                                    title = "<span class='label'>[{0}] {1} {2} {3} {4}<span>".format(
                                        data.rdGdftySeLbl,
                                        frontKoreanRoadNm ? frontKoreanRoadNm : '도로명없음',
                                        frontStartBaseNo,
                                        plqDirection == '00100' ? '→' : (plqDirection == '00300' ? '↑' : '?'),
                                        frontEndBaseNo
                                    );
                                }else{
                                    title = "<span class='label'>[{0}] {1}<span>".format(
                                        data.rdGdftySeLbl,
                                        frontKoreanRoadNm ? frontKoreanRoadNm : '도로명없음'
                                    );
                                }
                            }
                            var imgNm = 'icon_legend01.png';
                            var instSe = data.instSe;
                            var useTarget = data.useTarget;
                            if(instSe == '00002' && (useTarget == "01000")){
                                imgNm = 'icon_legend01_w.png'
                            }
                            var titleIcon = '<span class="titleIcon"><img src="image/'+imgNm+'" title="도로명판"></span>';
                            $(".title").empty();
                            $(".title").append(titleIcon);
                            $(".title").append(title);

                            
                            if(rdGdftySe == "110"){

                                //양면여부 체크
                                // changeBdrclAt();

                                //앞면 도로명(국문)
                                $("#frontKoreanRoadNm").val(data.frontKoreanRoadNm);
                                //앞면 도로명(로마자)
                                // $("#frontRomeRoadNm").val(data.frontRomeRoadNm);
                                $("#frontRomeRoadNm").text(data.frontRomeRoadNm);
                                //앞면시작기초번호(0-0)
                                $("#frontStartBaseMasterNo").val(data.frontStartBaseMasterNo);
                                $("#frontStartBaseSlaveNo").val(data.frontStartBaseSlaveNo);
                                //앞면종료기초번호(0-0)
                                $("#frontEndBaseMasterNo").val(data.frontEndBaseMasterNo);
                                $("#frontEndBaseSlaveNo").val(data.frontEndBaseSlaveNo);
                                
                                // if (data.bdrclAt == 1) {
                                //뒷면 도로명(국문)
                                $("#backKoreanRoadNm").val(data.backKoreanRoadNm);
                                //뒷면 도로명(로마자)
                                // $("#backRomeRoadNm").val(data.backRomeRoadNm);
                                $("#backRomeRoadNm").text(data.backRomeRoadNm);
                                //뒷면시작기초번호(0-0)
                                $("#backStartBaseMasterNo").val(data.backStartBaseMasterNo);
                                $("#backStartBaseSlaveNo").val(data.backStartBaseSlaveNo);
                                //뒷면종료기초번호(0-0)
                                $("#backEndBaseMasterNo").val(data.backEndBaseMasterNo);
                                $("#backEndBaseSlaveNo").val(data.backEndBaseSlaveNo);
                                // if (data.bdrclAt == 0) {
                                    // $(".bk").hide();
                                // }
                                // $("#bdrclAt").show();
                                
                                //안내시설방향
                                var plqDirection = data.plqDirection;
                                makeOptSelectBox("plqDirection","PLQ_DRC","","","");
                                $("#plqDirection").val(plqDirection);
                                if(plqDirection == "00300" && data.instSe != "00002"){//앞쪽방향용 이고 벽부착식이 아닐 경우에만 뒷면
                                    // $("#bdrclAt").val("1"); //양면 예
                                    // $("#bdrclAt").removeAttr("disabled");
                                }else{
                                    $(".bk").hide();
                                    // $("#bdrclAt").val("0"); //양면 아니오
                                    // $("#bdrclAt").attr("disabled","disabled");
                                }
                                //규격
                                var useTarget = data.useTarget;
                                var rdpqGdSd = data.rdpqGdSd;
                                try {
                                    var useCd = useTarget.charAt(1) +  plqDirection.charAt(2);
                                } catch (error) {
                                    util.toast(msg.checkObject.format("사용대상 및 안내시설방향"),"error");
                                }
                                
                                var colume = "RDPQ_GD_SD";
                                if(scfggMkty != "1"){
                                    colume = "RDPQ_GD_SD_2"
                                }
                                customSelectBox("rdpqGdSd",colume,useCd,1,2);
                                $("#rdpqGdSd").val(rdpqGdSd);
                                changeUseTarget();
                                // setNameplateView();
                            }else if(rdGdftySe == "210"){//이면도로용
                            
                                //도로명(국문)
                                $("#rddr_korRn").html(data.rddr_korRn);
                                //도로명(로마자)
                                $("#rddr_romRn").html(data.rddr_romRn);
                                //앞면시작기초번호(0-0)
                                $("#rddr_stbsMn").html(data.rddr_stbsMn);
                                $("#rddr_stbsSn").html(data.rddr_stbsSn);
                                //앞면종료기초번호(0-0)
                                $("#rddr_edbsMn").html(data.rddr_edbsMn);
                                $("#rddr_edbsSn").html(data.rddr_edbsSn);
                                //이면도로용 도로명판 유형
                                var rddr_afRdplqSe = data.rddr_afRdplqSe;
                                makeOptSelectBox("rddr_afRdplqSe","AF_RDPLQ_SE","","","");
                                $("#rddr_afRdplqSe").val(rddr_afRdplqSe);

                                //통합형인 경우 한방향 용만 가능
                                if(rddr_afRdplqSe == "02000"){
                                    //명판방향
                                    customSelectBox("rddr_plqDrc","PLQ_DRC","00100",0,5);
                                }else{
                                    //명판방향
                                    makeOptSelectBox("rddr_plqDrc","PLQ_DRC","","","");
                                }
                                $("#rddr_plqDrc").val(data.rddr_plqDrc);
                                
                                //이면도로갯수
                                var rddr_afRdCo = data.rddr_afRdCo;
                                makeOptSelectBox("rddr_afRdCo","AF_RD_CD","","","");
                                $("#rddr_afRdCo").val(rddr_afRdCo);

                                //규격
                                // var useTarget = data.useTarget;
                                // var rddr_rddrGdSd = data.rddr_rddrGdSd;
                                try{
                                    var useCd = rddr_afRdplqSe.charAt(1) +  rddr_afRdCo.charAt(2);    
                                } catch (error) {
                                    util.toast(msg.checkObject.format("도로명판 유형 및 이면도로갯수"),"error");
                                }
                                
                                customSelectBox("rddr_rddrGdSd","RDDR_GD_SD",useCd,1,2);
                                $("#rddr_rddrGdSd").val(data.rddr_rddrGdSd);

                                changeAfRdplqSe('rddr_afRdplqSe');
                                changeAfrdCo('rddr_afRdCo');

                                //이면도로명판 내용
                                var rddrCnList = data.rddrCn;
                                try {
                                    if(rddrCnList != null && rddrCnList.length > 0){
                                        for(i in rddrCnList){
                                            //위치구분
                                            var plqLcSe =rddrCnList[i].plqLcSe;
                                            //한글도로명
                                            var drcKorRn =rddrCnList[i].drcKorRn;
                                            //로마자도로명
                                            var drcRomRn =rddrCnList[i].drcRomRn;
                                            //이면도로거리
                                            var drcRdLt =rddrCnList[i].drcRdLt;
                                            //방향
                                            var drcRdDrc =rddrCnList[i].drcRdDrc;
                                            var drcRdDrcLbl = rddrCnList[i].drcRdDrcLbl;

                                            // $("#drcKorRn"+plqLcSe).val(drcKorRn);
                                            // $("#drcRomRn"+plqLcSe).val(drcRomRn);
                                            // $("#drcRdLt"+plqLcSe).val(drcRdLt);
                                            $("#drcKorRn"+plqLcSe).text(drcKorRn);
                                            $("#drcRomRn"+plqLcSe).text(drcRomRn);
                                            $("#drcRdLt"+plqLcSe).text(drcRdLt + "M");
                                            
                                            // makeOptSelectBox("drcRdDrc"+plqLcSe,"DRC_RD_DRC","","","");
                                            // $("#drcRdDrc"+plqLcSe).val(drcRdDrc);
                                            $("#drcRdDrcLbl"+plqLcSe).text(drcRdDrcLbl);
                                        }
                                    }
                                } catch (error) {
                                    util.toast(msg.checkObject.format("이면도로명판 내용"),"error");
                                }
                                
                                
                                // setNameplateView();

                            }else if(rdGdftySe == "310"){//예고용
                                //앞면 도로명(국문)
                                $("#prnt_ftKorRn").html(data.prnt_ftKorRn);
                                //앞면 도로명(로마자)
                                $("#prnt_ftRomRn").html(data.prnt_ftRomRn);
                                //앞면 도로거리
                                $("#prnt_ftRdLt").html(data.prnt_ftRdLt);
                                
                                //뒷면 도로명(국문)
                                $("#prnt_bkKorRn").html(data.prnt_bkKorRn);
                                //뒷면 도로명(로마자)
                                $("#prnt_bkRomRn").html(data.prnt_bkRomRn);
                                //뒷면 도로거리
                                $("#prnt_bkRdLt").html(data.prnt_bkRdLt);
                                
                                if (data.bdrclAt == 0) {
                                    $(".bk").hide();
                                }
                                //규격
                                var useTarget = data.useTarget;
                                var useCd = useTarget.charAt(1);
                                
                                customSelectBox("prntGdSd","PRNT_GD_SD",useCd,1,1);
                                $("#prntGdSd").val(data.prntGdSd);
                            }

                            // //임시데이터 존재 여부
                            // var isUpdtGbn = data.isUpdtGbn;
                            // $("#isUpdtGbn").val(isUpdtGbn);

                            // if(isUpdtGbn.indexOf("D") != -1){
                            //     // navigator.notification.confirm(msg.loadUpdtData, function(btnindex){
                            //         // if(btnindex == 1){
                            //             loadUpdtData();
                            //         // }
                            //     // }, "알림", ["확인","취소"]);
                            // }

                            break;
                        case DATA_TYPE.AREA:
                            //제목창
                            var title = '';

                            //시작기초번호(0-0)]
                            var area_stbsNo = "{0}{1}".format(data.area_stbsMn, (data.area_stbsSn != "0" ? '-' + data.area_stbsSn : ''));
                            //종료기초번호(0-0)
                            var area_edbsNo = "{0}{1}".format(data.area_edbsMn, (data.area_edbsSn != "0" ? '-' + data.area_edbsSn : ''));
                            
                            //도로명,시작번호,종료번호가 null 일경우 도로명없음으로 표시
                            if(data.area_areaKorRn == null ||data.area_stbsMn == null || data.area_stbsSn == null || data.area_edbsMn == null || data.area_edbsSn == null){
                                title = "도로명없음";
                            }else{
                                title = "<span class='label'>[{0}] ←{1} {2} {3}→<span>".format(
                                    data.rdGdftySeLbl,
                                    area_stbsNo,
                                    data.area_areaKorRn,
                                    area_edbsNo
                                );
                            }
                            var imgNm = 'icon_legend03.png';
                            // if(data.instSe == '00002'){
                            //     imgNm = 'icon_w_legend03.png'
                            // }
                            var titleIcon = '<span class="titleIcon"><img src="image/'+imgNm+'" title="지역안내판"></span>';
                            $(".title").empty();
                            $(".title").append(titleIcon);
                            $(".title").append(title);
                            
                            //한글도로명
                            $("#area_areaKorRn").val(data.area_areaKorRn);
                            //로마자
                            $("#area_romRn").html(data.area_romRn);
                            //시작기초번호(0-0)]
                            $("#area_stbsNo").html(area_stbsNo);
                            // $("#area_stbsMn").val(data.area_stbsMn);
                            // $("#area_stbsSn").val(data.area_stbsSn);
                            //종료기초번호(0-0)
                            $("#area_edbsNo").html(area_edbsNo);
                            // $("#area_edbsMn").val(data.area_edbsMn);
                            // $("#area_edbsSn").val(data.area_edbsSn);
                            //광고에따른 분류
                            makeOptSelectBox("area_advrtsCd","ADVRTS_CD","","","");
                            $("#area_advrtsCd").val(data.area_advrtsCd);
                            changeAdvrtsCd();
                            //광고내용
                            $("#area_advCn").val(data.area_advCn);
                            //기타내용
                            $("#area_etcCn").val(data.area_etcCn);

                            //규격
                            var colume = "AREA_GD_SD";
                            var area_areaGdSd = data.area_areaGdSd;
                            makeOptSelectBox("area_areaGdSd",colume,"","","");
                            $("#area_areaGdSd").val(area_areaGdSd);

                            var areaGbnLbl = "-";
                            switch (area_areaGdSd) {
                                case '10001':
                                    areaGbnLbl = '소형'
                                    break;
                                case '10002':
                                    areaGbnLbl = '중형'
                                    break;
                                case '10003':
                                    areaGbnLbl = '대형'
                                    break;
                                default:
                                    break;
                            }

                            $("#areaGbnLbl").text(areaGbnLbl);
                            //임시데이터 존재 여부
                            var isUpdtGbn = data.isUpdtGbn;
                            $("#isUpdtGbn").val(isUpdtGbn);

                            // if(isUpdtGbn.indexOf("D") != -1){
                            //     // navigator.notification.confirm(msg.loadUpdtData, function(btnindex){
                            //         // if(btnindex == 1){
                            //             loadUpdtData();
                            //         // }
                            //     // }, "알림", ["확인","취소"]);
                            // }

                            //설치장소
                            // $("#area_insPlc").html(data.area_insPlc);
                            // $("#area_insPlc_lbl").html(data.area_insPlc_lbl);
                            // $("#checkComment").addClass("edit");

                            break;
                        case DATA_TYPE.BSIS:
                            //제목창
                            var title = '';
                            //기초번호(0-0)
                            var bsis_ctbsNo = "{0}{1}".format(data.bsis_ctbsMn, (data.bsis_ctbsSn != "0" ? '-' + data.bsis_ctbsSn : ''));
                            
                            //도로명,시작번호,종료번호가 null 일경우 도로명없음으로 표시
                            if(data.bsis_korRn == null ||data.bsis_ctbsMn == null || data.bsis_ctbsSn == null){
                                title = "도로명없음";
                            }else{  
                                title = "<span class='label'>[{0}] {1} {2}<span>".format(
                                    data.rdGdftySeLbl,
                                    data.bsis_korRn ? data.bsis_korRn : '도로명없음',
                                    bsis_ctbsNo
                                );
                            }
                            var imgNm = 'icon_legend02.png';
                            // if(data.instSe == '00002'){
                            //     imgNm = 'icon_w_legend02.png'
                            // }
                            var titleIcon = '<span class="titleIcon"><img src="image/'+imgNm+'" title="기초번호판"></span>';
                            $(".title").empty();
                            $(".title").append(titleIcon);
                            $(".title").append(title);

                            //설치장소 구분
                            // $("#bsis_itlpcSeLbl").html(data.bsis_itlpcSeLbl);
                            makeOptSelectBox("bsis_itlpcSe","ITLPC_SE","","","");
                            $("#bsis_itlpcSe").val(data.bsis_itlpcSe);
                            // $("#bsis_itlpcSe").hide();
                            //설치시설물
                            var bsis_instlFty = data.bsis_instlFty;
                            // customSelectBox("bsis_instlFty_main","INSTL_FTY","0",0,1);
                            customSelectBox4("bsis_instlFty_main","INSTL_FTY","2",0,1);
                            $("#bsis_instlFty_main").append("<option value='00'>기타</option>");
                            customSelectBox5("bsis_instlFty","INSTL_FTY","2",0,1);
                            
                            if(bsis_instlFty.charAt(0) < '2'){
                                $("#bsis_instlFty_main").val(bsis_instlFty);
                                
                                changeBsisInstlFty();
                                // $("#bsis_instlFty").attr("disabled","disabled");
                            }else{
                                $("#bsis_instlFty_main").val("00");
                                $("#bsis_instlFty").val(data.bsis_instlFty);
                                changeBsisInstlFty();

                                // customSelectBox3("bsis_instlFty","INSTL_FTY","0",0,1); 
                            }
                            // changeBsisInstlFty();
                            //설치시설물 기타 상세내용
                            $("#bsis_insFtyDc").val(data.bsis_insFtyDc);
                            //곡면분류
                            makeOptSelectBox("bsis_planeCd","PLANE_CD","","","");
                            $("#bsis_planeCd").val(data.bsis_planeCd);
                            //한글도로명
                            $("#bsis_korRn").val((data.bsis_korRn ? data.bsis_korRn : '도로명없음'));
                            //로마자
                            $("#bsis_romRn").html(data.bsis_romRn);
                            //기초번호(0-0)
                            $("#bsis_ctbsNo").html(bsis_ctbsNo);
                            // $("#bsis_ctbsMn").val(data.bsis_ctbsMn);
                            // $("#bsis_ctbsSn").val(data.bsis_ctbsSn);
                            //이전승강장번호
                            var bsis_bfbsNo = "{0}{1}".format(data.bsis_bfbsMn, (data.bsis_bfbsSn != "0" ? '-' + data.bsis_bfbsSn : ''));
                            $("#bsis_bfbsNo").html(bsis_bfbsNo);
                            // $("#bsis_bfbsMn").val(data.bsis_bfbsMn);
                            // $("#bsis_bfbsSn").val(data.bsis_bfbsSn);
                            //다음승강장번호
                            var bsis_ntbsNo = "{0}{1}".format(data.bsis_ntbsMn, (data.bsis_ntbsSn != "0" ? '-' + data.bsis_ntbsSn : ''));
                            $("#bsis_ntbsNo").html(bsis_ntbsNo);
                            // $("#bsis_ntbsMn").val(data.bsis_ntbsMn);
                            // $("#bsis_ntbsSn").val(data.bsis_ntbsSn);
                            //규격
                            try{
                                 var codeValue = data.gdftyForm.charAt(0) + data.useTarget.charAt(1) +  data.bsis_itlpcSe.charAt(2);
                                 if(data.bsis_itlpcSe.charAt(2) == "7"){
                                    codeValue = data.gdftyForm.charAt(0) +"97";
                                 }
                                 customSelectBox("bsis_bsisGdSd","BSIS_GD_SD",codeValue,0,3);
                            } catch (error) {
                                util.toast(msg.checkObject.format("안내시설형식 및 사용대상 및 설치장소구분"),"error");
                            }
                            // changeBsisGdSd("bsis_bsisGdSd");
                            $("#bsis_bsisGdSd").val(data.bsis_bsisGdSd);

                            //표면처리방법
                            makeOptSelectBox("bsisMthd","BSIS_MTHD","","","");
                            $("#bsisMthd").val(data.bsisMthd);

                            //임시데이터 존재 여부
                            var isUpdtGbn = data.isUpdtGbn;
                            $("#isUpdtGbn").val(isUpdtGbn);

                            // if(isUpdtGbn.indexOf("D") != -1){
                            //     // navigator.notification.confirm(msg.loadUpdtData, function(btnindex){
                            //         // if(btnindex == 1){
                            //             loadUpdtData();
                            //         // }
                            //     // }, "알림", ["확인","취소"]);
                            // }
                            break;
                        case DATA_TYPE.ENTRC:
                            //일련번호
                            // $("#sn").val(data.bulNmtNo);
                            // $("#entManNo").val(data.entManNo);
                            $("#imageFileSn").val(data.imageFilesSn);

                            //제목창
                            var title = "<span class='label'>[{0}] {1} {2}{3}<span>".format(
                                "건물번호판",
                                (data.rnCdLbl ? data.rnCdLbl : ''),
                                (data.buldMnnm ? data.buldMnnm : ''),
                                (data.buldSlno == '0' ? '' : '-' + data.buldSlno)
                            );

                            if(data.rnCdLbl == null){
                                title = "<span class='label'>[{0}] {1}<span>".format(
                                    "건물번호판",
                                    (data.rnCdLbl ? data.rnCdLbl : '정보없음')
                                )
                            }

                            $("#entrcView_page .title").append(title);
                            
                            //위치찾기용
                            $("#emdCd").val(data.emdCd);
                            $("#rnCd").val(data.rnCd);
                            $("#buldSeCd").val(data.buldSeCd);

                            //설치도로명
                            $("#rnCdLbl").html(data.rnCdLbl);
                            //건물번호
                            $("#buldMnnm").html(data.buldMnnm);
                            $("#buldSlno").html(data.buldSlno);
                            //일련번호
                            $("#bulNmtNo").html(data.bulNmtNo);

                            //설치일자
                            var instDate = data.instDate;
                            try{
                                var instDateText = "{0}년{1}월{2}일".format(instDate.substr(0, 4), instDate.substr(4, 2), instDate.substr(6, 2));
                                $("#instDate").html(instDateText);
                            } catch (error) {
                               util.toast(msg.checkObject.format("설치일자"),"error");
                            }
                            // if(instDate.substr(0, 4) == util.getToday().substr(0, 4)){
                            //     //올해설치건은 점검불가
                            //     disableResearch();
                            //     $("#rcRslt").attr("placeholder","올해에 설치한 시설물은 점검 불가")
                            // }
                            
                            //유형
                            var buldNmtSe = data.buldNmtSe;
                            makeOptSelectBox("buldNmtSe","BUL_NMT_SE","","","");
                            $("#buldNmtSe").val(data.buldNmtSe);
                            //설치유형
                            makeOptSelectBox("buldMnfCd","BUL_MNF_CD","","","");
                            $("#buldMnfCd").val(data.buldMnfCd);
                            changeMnf("buldMnfCd");
                            //조명여부
                            // makeOptSelectBox("lghtCd","LGHT_CD","","","");
                            $("#lghtCd").val(data.lghtCd);

                            //형태
                            var buldNmtType = data.buldNmtType;
                            $("#buldNmtTypeLbl").html(data.buldNmtTypeLbl);
                            customSelectBox("buldNmtType","BUL_NMT_TY","000",1,3);
                            $("#buldNmtType").val(data.buldNmtType);
                            // $("#buldNmtType").hide();
                            if(buldNmtType == '1000'){
                                $("#buldNmtWide").attr("disabled","disabled");
                                $("#buldNmtVertical").attr("disabled","disabled");
                            }
                            //용도
                            try{
                                customSelectBox2("buldNmtPurpose","BUL_NMT_PR",buldNmtType.substr(0,1),0,1,1,3);
                            } catch (error) {
                               util.toast(msg.checkObject.format("용도"),"error");
                            }
                            //종류
                            var buldNmtPurpose = data.buldNmtPurpose;
                            // var buldNmtPurposeLbl = data.buldNmtPurposeLbl;
                            $("#buldNmtPurpose").val(buldNmtPurpose);
                            // $("#buldNmtPurposeLbl").text(buldNmtPurposeLbl);
                            // changeBuldNmtPurpose("buldNmtPurpose");
                            if(buldNmtPurpose == '2100'){
                                $("#bulNmtFt").show();
                            }else{
                                $("#bulNmtFt").hide();
                            }
                             //자율형건물번호판 가로 한글자크기
                             $("#bulNmtFtWi").val(data.bulNmtFtWi);
                             //자율형건물번호판 세로 한글자크기
                             $("#bulNmtFtVe").val(data.bulNmtFtVe);

                            //규격
                            try{
                                customSelectBox("buldNmtCd","BUL_NMT_CD",buldNmtPurpose.substr(0,2),0,2);
                            } catch (error) {
                               util.toast(msg.checkObject.format("규격"),"error");
                            }
                            // changeBuldNmtCd();
                            $("#buldNmtCd").val(data.buldNmtCd);
                            //단가(원)
                            $("#buldNmtUnitPrice").text(data.buldNmtUnitPrice);

                            //가로*세로*두께
                            $("#buldNmtWide").val(data.buldNmtWide);
                            $("#buldNmtVertical").val(data.buldNmtVertical);
                            $("#buldNmtThickness").val(data.buldNmtThickness);

                            //재질
                            makeOptSelectBox("buldNmtMaterial","BUL_NMT_QL","","","");
                            $("#buldNmtMaterial").val(data.buldNmtMaterial);
                           
                    }

                    //가로*세로*두께
                    $("#gdftyWide").val(data.gdftyWide);
                    $("#gdftyVertical").val(data.gdftyVertical);
                    $("#gdftyThickness").val(data.gdftyThickness);
                    //표준형 일때
                    if(data.gdftyForm == "10000"){
                        $("#gdftyWide").attr("disabled","disabled");
                        $("#gdftyVertical").attr("disabled","disabled");
                    }
                    
                    //*****************점검정보*****************
                    //****배정정보*****
                    //계획년도
                    var plnYr = data.plnYr;
                    //계획차수
                    var plnOdr = data.plnOdr;
                    //배정일련번호
                    var mtchSn = data.mtchSn;
                    //배정자
                    var rcrSn = data.rcrSn;
                    var rcrNm = data.rcrNm;

                    //조사자
                    var researchSn = app.info.rcrSn;
                    var rcrType = app.info.rcrTyp;

                    if(plnYr == null || plnOdr == null || mtchSn == null){
                        $("#plnOdrLbl").html('미배정');
                        try{
                            $("#plnYr").val(util.getToday().substr(0,4));
                        } catch (error) {
                           util.toast(msg.checkObject.format("시스템날짜"),"error");
                        }
                        
                        $("#plnOdr").val('1');
                        $("#mtchSn").val(data.mtchSn);

                        $("#rcrNm").html('-');

                        //공무원이 아니면 점검 정비정보 수정안됨
                        // if(rcrType != 01){
                            // disabledAll();
                        // }
                    }else{
                        $("#plnOdrLbl").html('배정');

                        $("#plnYr").val(plnYr);
                        $("#plnOdr").val(plnOdr);
                        $("#mtchSn").val(data.mtchSn);

                        $("#rcrSn").html(rcrSn);
                        $("#rcrNm").html(rcrNm);

                        
                        if(rcrSn != researchSn){
                            disabledAll();
                        }else if(rcrSn == researchSn){
                            // disabledAll();
                            // $("#rcSttCdSel").removeAttr("disabled");
                            // $("#rcRslt").removeAttr("disabled");
                            // $("#submitRcBnt").removeAttr("disabled");
                            // //사진
                            // $("#photoDialog .btnPoint").show();
                        }
                    }

                    //*****점검정보*****
                    //점검된 계획년도
                    var rePlnYr = data.rePlnYr;
                    //점검된 계획차수
                    var rePlnOdr = data.rePlnOdr;
                    //점검된 배정일련번호
                    var reMtchSn = data.reMtchSn;
                    //점검자
                    var reRcrNm = data.reRcrNm;
                    // var reRcrSn = data.reRcrSn;

                    //점검상태 및 점검결과
                    var rcSttCd = data.rcSttCd; // 점검상태
                    var rcRslt = data.rcRslt; //점검결과
                    try{
                        var rcDe = data.rcDe == null ? "점검이력이 없습니다." : "{0}년{1}월{2}일".format(data.rcDe.substr(0, 4), data.rcDe.substr(4, 2), data.rcDe.substr(6, 2));
                    } catch (error) {
                       util.toast(msg.checkObject.format("점검날짜"),"error");
                    }

                    //설치상태
                    var delStateCd = data.delStateCd;
                    $("#delStateCd").html(data.delStateCd);
                    $("#delStateCdLbl").html(data.delStateCdLbl);

                    if(delStateCd == "01"){
                        makeOptSelectBox("rcSttCdSel","RC_STT_CD","","선택","");
                    }else if(delStateCd == "04"){//망실일 경우 망실만
                        customSelectBox("rcSttCdSel","RC_STT_CD","1201",0,4);
                        $("#rcSttCdSel").val($("#rcSttCdSel option:first").val());
                    }else{
                        //설치상태가 정상이 아닐경우 정상으로 변경 불가
                        makeOptSelectBox("rcSttCdSel","RC_STT_CD","1000","선택","");
                    }

                    if(plnYr != null){ // 배정된 건은 현재 배정차수에 해당하는 점검 이력을 보여준다.
                        if(rePlnYr == plnYr && rePlnOdr == plnOdr && reMtchSn == mtchSn){
                            $("#rcDe").html(rcDe);
                            $("#reRcrNm").html(rcrNm);
                            
                            $("#rcSttCdSel").val(rcSttCd);
                            $("#rcSttCd").html(rcSttCd);

                            $("#rcRslt").val(rcRslt);
                            $("#rcRsltOld").text(rcRslt);

                        }else{
                            $("#rcDe").html(rcDe);
                            $("#reRcrNm").html("-");
                        }
                        
                    }else{ //배정되지 않은 건은 조회된 이전 이력을 보여준다
                        $("#rcDe").html(rcDe);
                        $("#reRcrNm").html(reRcrNm);
                        
                        $("#rcSttCdSel").val(rcSttCd);
                        $("#rcSttCd").html(rcSttCd);

                        $("#rcRslt").val(rcRslt);
                        $("#rcRsltOld").text(rcRslt);
                    }

                    //*****************점검정보*****************

                    //임시데이터 존재 여부
                    var isUpdtGbn = data.isUpdtGbn;
                    $("#isUpdtGbn").val(isUpdtGbn);
                    try {
                        if(isUpdtGbn.indexOf("D") != -1){
                            // navigator.notification.confirm(msg.loadUpdtData, function(btnindex){
                                // if(btnindex == 1){
                                    loadUpdtData();
                                    $("#updtNotice").show();
                                // }
                            // }, "알림", ["확인","취소"]);
                        }else{
                            $("#delUpdtBtn").hide();
                        }    
                    } catch (error) {
                        util.toast(msg.checkObject.format("임시데이터 여부"),"error");
                    }
                    
                    util.dismissProgress();
                } catch (error) {
                    navigator.notification.alert(msg.checkSetObjectError, 
                        function(){
                            disabledAll();
                            util.dismissProgress();
                    }, '알림', '확인');

                }

            },
            util.dismissProgress
        );
    },
    setValuesBuld:function(layerID, link, sn) {
        var rcrType = app.info.rcrTyp;
        if(rcrType != 01){
            disabledAll();
        }
        var url = URLs.postURL(link, { "sn": sn, "sigCd": app.info.sigCd, "workId": app.info.opeId });
        util.showProgress();

        util.postAJAX({}, url).then(
            function(context, rCode, results) {
                //통신오류처리
                if (rCode != 0 || results.response.status < 0) {
                    navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                    util.dismissProgress();
                    return;
                }

                var data = results.data;

                //데이터 오류 처리
                if (data == null) {
                    navigator.notification.alert(msg.noItem,
                        function() {
                            $("#detailView").popup("close", { transition: "slideup" });
                        },
                        '알림', '확인'
                    );
                    util.dismissProgress();
                    return;
                }

                if(layerID == DATA_TYPE.BULD){
                    var title = "[{0}] {1} {2}{3}".format(
                        "건물정보",
                        (data.rnCdLbl ? data.rnCdLbl : ""),
                        (data.buldMnnm),
                        (data.buldSlno == "0" ? "" : "-" + data.buldSlno)
                    );
                    $(".title").append(title);

                    //일련번호
                    $("#trgSn").val(trgSnGlobal);
                    //위치일련번호
                    $("#trgLocSn").val(sn);
                    //시군구코드
                    $("#sigCd").val(data.sigCd);

                    //건축물용도
                    var bdtypCd = data.bdtypCd;
                    try {
                        var bdtypCdSub =bdtypCd.substr(2, 5);
                        if (bdtypCd.substr(2, 5) == 000) { //대분류
                            customSelectBox("bdtypCd_main","BDTYP_CD",bdtypCdSub,0,2);
                            $("#bdtypCd_main").val(data.bdtypCd);
    
                        } else { //소분류일 경우
                            var bdtypCd_main = bdtypCd.substr(0, 2) + "000";
                            customSelectBox("bdtypCd_main","BDTYP_CD","000",2,4);
                            $("#bdtypCd_main").val(bdtypCd_main);
                            customSelectBox2("bdtypCd","BDTYP_CD",bdtypCd.substr(0,2),0,2,2,5);
                            $("#bdtypCd").val(data.bdtypCd);
    
                        }
                    } catch (error) {
                        util.toast(msg.checkObject.format("건축물용도"),"error");
                    }
                    //건축물용도
                    // makeOptSelectBox("bdtypCd","BDTYP_CD","","","");
                    // $("#bdtypCd").val(data.bdtypCd);

                    //건물종속여부
                    makeOptSelectBox("bulDpnSe","BUL_DPN_SE","","","");
                    $("#bulDpnSe").val(data.bulDpnSe);
                    //건물명
                    $("#posBulNm").val(data.posBulNm);
                    //건물명(영)
                    $("#bulEngNm").val(data.bulEngNm);
                    //상세건물명
                    $("#buldNmDc").val(data.buldNmDc);
                    //건물층수
                    //(지상)
                    $("#groFloCo").val(data.groFloCo);
                    //(지하)
                    $("#undFloCo").val(data.undFloCo);
                    // var floCo = "지상층: {0} / 지하층: {1}".format(data.groFloCo, data.undFloCo);
                    // $("#floCo").html(floCo);
                    // $("#floCo").addClass("edit");
                    //건물상태
                    $("#buldSttus").val(data.buldSttus);
                    //메모
                    $("#buldMemo").val(data.buldMemo);

                    //건물군번호
                    $("#eqbManSn").val(data.eqbManSn);

                    //위치찾기용
                    $("#emdCd").val(data.emdCd);
                    $("#rnCd").val(data.rnCd);
                    $("#buldSeCd").val(data.buldSeCd);
                    //설치도로명
                    $("#rnCdLbl").html(data.rnCdLbl);
                    //건물번호
                    $("#buldMnnm").html(data.buldMnnm);
                    $("#buldSlno").html(data.buldSlno);

                    util.dismissProgress();

                    if(rcrType != 01){
                        disabledAll();
                    }

                    //임시데이터 존재 여부
                    var isUpdtGbn = data.isUpdtGbn;
                    $("#isUpdtGbn").val(isUpdtGbn);
                    try{
                        if(isUpdtGbn.indexOf("D") != -1){
                            // navigator.notification.confirm(msg.loadUpdtData, function(btnindex){
                                // if(btnindex == 1){
                                    loadUpdtData();
                                    $("#updtNotice").show();
                                // }
                            // }, "알림", ["확인","취소"]);
                        }else{
                            $("#delUpdtBtn").hide();
                        }    
                    } catch (error) {
                        util.toast(msg.checkObject.format("건축물용도"),"error");
                    }
                    return;
                }
              
            },
            util.dismissProgress
        )
    },
    setValuesSppn:function(layerID, link, sn) {
        var url = URLs.postURL(link, { "sn": sn, "sigCd": app.info.sigCd, "workId": app.info.opeId });
        util.showProgress();
        util.postAJAX({}, url).then(
            function(context, rCode, results) {
                //통신오류처리
                if (rCode != 0 || results.response.status < 0) {
                    navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                    util.dismissProgress();
                    return;
                }

                var data = results.data;

                //데이터 오류 처리
                if (data == null) {
                    navigator.notification.alert(msg.noItem,
                        function() {
                            $("#detailView").popup("close", { transition: "slideup" });
                        },
                        '알림', '확인'
                    );
                    util.dismissProgress();
                    return;
                }

                if(layerID == DATA_TYPE.SPPN){
                    $("#imaFilSn").val(data.imaFilSn);
                    //제목
                    var title = "<span class='label'>[{0}] {1}<span>".format("지점번호판",data.spoNoCd);
                    $(".title").append(title);
                    try{
                        //점검일자
                        var lastCheckDate = data.chkDe == null ? "점검이력이 없습니다." : "{0}년{1}월{2}일".format(data.chkDe.substr(0, 4), data.chkDe.substr(4, 2), data.chkDe.substr(6, 2));
                        $("#lastCheckDate").html(lastCheckDate);
                    } catch (error) {
                        util.toast(msg.checkObject.format("점검이력"),"error");
                    }
                    // $("#lastCheckDate").addClass("edit");
                    //메모
                    $("#checkComment").html(data.chkSum);
                    $("#checkComment").addClass("edit");
                    //설치상태
                    //토지소재지
                    // var sigCd = data.sigCd;
                    // $("#landAddress").html(sigCd);
                    //시설물종류
                    $("#fcltylcCd").html(data.fcltylcCd);
                    $("#fcltylcCdLbl").html(data.fcltylcCdLbl);
                    //설치기관
                    $("#insttCd").html(data.insttCd);
                    $("#insttCdLbl").html(data.insttCdLbl);
                    //상세기관명
                    $("#dtorNm").html(data.dtorNm);
                    //좌표
                    $("#xGrs80").html(data.xGrs80);
                    $("#yGrs80").html(data.yGrs80);
                    //검증일자
                    var vrifyDe = data.vrifyDe;
                    try{
                        $("#vrifyDe").html("{0}년{1}월{2}일".format(vrifyDe.substr(0,4),vrifyDe.substr(4,2),vrifyDe.substr(6,2)));
                    } catch (error) {
                        util.toast(msg.checkObject.format("건축물용도"),"error");
                    }
                    //설치일자
                    var spoInsDe = data.spoInsDe;
                    try{
                        $("#spoInsDe").html("{0}년{1}월{2}일".format(spoInsDe.substr(0,4),spoInsDe.substr(4,2),spoInsDe.substr(6,2)));
                    } catch (error) {
                        util.toast(msg.checkObject.format("설치일자"),"error");
                    }
                    //변경사유
                    $("#chghy").html(data.chghy);
                    $("#chghyLbl").html(data.chghyLbl);
                    //표기지역내여부
                    $("#mkareaIn").html(data.mkareaIn);
                    $("#mkareaInLbl").html(data.mkareaInLbl);
                    //경도
                    $("#longitude").html(data.longitude);
                    //위도
                    $("#latitude").html(data.latitude);
                    util.dismissProgress();
                    return;
                }
              
            },
            util.dismissProgress
        )
        
    },
    setPopup: function(type, f) {
        switch (type) {
            case KEY.plateType.ROAD:
                // var pDir = f.get("PLQ_DRC");
                // var pDirDetail = MapUtil.getPlateDir(f);

                // $(".popup-content .roadName .kor-rn").html(f.get("FT_KOR_RN"));
                // $(".popup-content .roadName .rom-rn").html(f.get("FT_ROM_RN"));
                // var bgUrl = "";

                // $(".popup-content .img-plate .base-area").css("width", "");
                // $(".popup-content .img-plate .base-area").html("");
                // $(".popup-content .roadName").css("text-align", "left");
                // switch (pDir) {
                //     case KEY.plateDir.ONE:
                //         switch (pDirDetail.direct) {
                //             case KEY.plateDir.ONE_S:
                //                 bgUrl = "img_road_plate_1.png";
                //                 $(".popup-content .img-plate .base-left").css("width", "17%");
                //                 $(".popup-content .img-plate .base-right").html(pDirDetail.ft_all(pDirDetail.direct));
                //                 break;
                //             case KEY.plateDir.ONE_E:
                //                 $(".popup-content .img-plate .base-right").css("width", "17%");
                //                 $(".popup-content .img-plate .base-left").html(pDirDetail.ft_all(pDirDetail.direct));
                //                 bgUrl = "img_road_plate_e.png";
                //                 break;
                //         }
                //         break;
                //     case KEY.plateDir.BI:
                //         bgUrl = "img_road_plate_m.png";
                //         $(".popup-content .roadName").css("text-align", "center");
                //         $(".popup-content .img-plate .base-left").html(pDirDetail.ft_stbs);
                //         $(".popup-content .img-plate .base-right").html(pDirDetail.ft_edbs);
                //         break;
                //     case KEY.plateDir.FORWARD:
                //         bgUrl = "img_road_plate_f.png";
                //         $(".popup-content .img-plate .base-left").css("width", "17%");
                //         $(".popup-content .img-plate .base-right").html(pDirDetail.ft_all(pDir));
                //         break;
                // }
                // $(".popup-content .img-plate").css('background-image', 'url("img/main/{0}")'.format(bgUrl));

                //설치지점
                appendSelectBox("INS_SPO_CD", "instSpotCd", f);

                //설치재설치 여부
                appendSelectBox("ISLGN_YN", "isLgnYn", f);

                //설치지점명

                //한글도로명
                $("#frontKoreanRoadNm").val(f.get("FT_KOR_RN"));
                // document.getElementById("").value = f.get("FT_KOR_RN");

                //로마자 도로명
                $("#frontRomeRoadNm").val(f.get("FT_ROM_RN"));
                // document.getElementById("frontRomeRoadNm").value = f.get("FT_ROM_RN");

                //안내시설형식
                appendSelectBox("GDFTY_FOM", "gdftyForm", f);

                //안내시설방향
                appendSelectBox("PLQ_DRC", "plqDirection", f);

                /** 상태(정상,훼손,망실) 정보 표현 */
                $("#popup-road .ui-body:last input:radio").each(function() {
                    var src = $(this).prev().children().attr("src");
                    var lt_chc_stt = f.get("LT_CHC_STT");

                    if (this.value == lt_chc_stt) {
                        $(this).prev().children().attr("src", src.replace(/(.*_.*)_.*\.(png)/, "$1_on.$2"));
                    }
                });

                break;
            case KEY.plateType.BASE:

                break;
            case KEY.plateType.LOCAL:

                break;
            case KEY.plateType.ENTRC:

                //출입구 일련번호
                var sn = f.get("ENT_MAN_NO");

                var url = URLs.postURL(URLs.entrclink, { "sn": sn, "sigCd": app.info.sigCd, "workId": app.info.opeId });

                util.postAJAX({}, url).then(function(context, rCode, results) {
                        //통신오류처리
                        if (rCode != 0 || results.response.status < 0) {
                            navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                            util.dismissProgress();
                            return;
                        }

                        var data = results.data;
                        if (rcode != 0 || util.isEmpty(data) === true) {
                            navigator.notification.alert(msg.noItem,
                                function() {
                                    util.goBack();
                                }, '알림', '확인');
                            util.dismissProgress();
                            return;
                        }


                        $("#instlDe").val(data.instDate);

                        appendSelectBox2("BUL_NMT_CD", "bulNmtCd", data.buldNmtCd);

                        appendSelectBox2("BUL_NMT_TY", "buldNmtType", data.buldNmtType);

                        appendSelectBox2("BUL_NMT_QL", "buldNmtMaterial", data.buldNmtMaterial);

                        appendSelectBox2("BUL_NMT_PR", "buldNmtPurpose", data.buldNmtPurpose);

                        $("#buldNmtUnitPrice").val(data.buldNmtUnitPrice);

                        appendSelectBox2("BUL_MNF_CD", "buldMnfCd", data.buldMnfCd);

                        appendSelectBox2("BUL_NMT_LO", "buldNmtLoss", data.buldNmtLoss);

                        $("#workId").val(data.workId);

                        $("#workDate").val(data.workDate);

                        appendSelectBox2("LGHT_CD", "lightCd", data.lightCd);

                        $("#registerDate").val(data.registerDate);

                    }),
                    function(context, xhr, error) {
                        console.log("갱신실패" + error + '   ' + xhr);
                        navigator.notification.alert(msg.noItem,
                            function() {
                                util.goBack();
                            }, '알림', '확인');
                        util.dismissProgress();
                    }

                break;
            case KEY.plateType.BUILD:

                //**************************** 건물정보 시작 *********************************** */
                //건축물용도
                appendSelectBox("BDTYP_CD", "bdtypCd", f);

                //지하건물여부
                appendSelectBox("BULD_SE_CD", "buldSeCd", f);

                //건물종속여부
                appendSelectBox("BUL_DPN_SE", "bulDpnSe", f);

                //건물명
                $("#buldNm").val(getFeatherValue("POS_BUL_NM", f));

                //건물명(영)
                $("#bulEngNm").val(getFeatherValue("BUL_ENG_NM", f));

                //상세건물명
                $("#etcBulNm").val(getFeatherValue("ETC_BUL_NM", f));

                //건물층수(지상)
                $("#groFloCo").val(getFeatherValue("GRO_FLO_CO", f));

                //건물층수(지상)
                $("#undFloCo").val(getFeatherValue("UND_FLO_CO", f));

                //건물상태
                $("#buldSttus").val(getFeatherValue("BULD_STTUS", f));

                //메모
                $("#buldMemo").val(getFeatherValue("BULD_MEMO", f));
                //**************************** 건물정보 끝 *********************************** */

                break;
        }

    }
};

function getFeatherValue(colume, f) {

    var valueText = f.get(colume);
    if (valueText == undefined) {
        valueText = "";
    }
    return valueText;
}

function appendSelectBox(colume, selectBoxID, f) {
    var codeList = app.codeMaster[CODE_GROUP[colume]];
    var code = f.get(colume);
    var codeValue = app.codeMaster[CODE_GROUP[colume]][f.get(colume)];
    $("#" + selectBoxID).empty();

    for (var c in codeList) {
        if (c != "GroupNm") {
            if (c == code) {
                $("#" + selectBoxID).append("<option value='{0}' selected='selected'>{1}</option>".format(c, codeList[c]));
            } else {
                $("#" + selectBoxID).append("<option value='{0}'>{1}</option>".format(c, codeList[c]));
            }

        }
    }
    // $("#"+selectBoxID).selectmenu("refresh", true);
}

function appendSelectBox2(colume, selectBoxID, data) {
    var codeList = app.codeMaster[CODE_GROUP[colume]];

    $("#" + selectBoxID).empty();

    for (var c in codeList) {
        if (c != "GroupNm") {
            $("#" + selectBoxID).append("<option value='{0}'>{1}</option>".format(c, codeList[c]));
        }
    }

    $("#" + selectBoxID).val(data).attr("selected", "selected");

    // $("#"+selectBoxID).selectmenu("refresh", true);
}


var MODE = { RUNTIME: 1, DEBUG: 0 };
var mode = MODE.RUNTIME;
// 서비스 정보

// UTM-K(GRS80) 도로명 배경지도 좌표계(네이버지도)
proj4.defs("EPSG:5179", "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs");
// 보정된 서부원점(Bessel) - KLIS에서 서부지역에 사용중
proj4.defs("EPSG:5173", "+proj=tmerc +lat_0=38 +lon_0=125.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43");
// 보정된 중부원점(Bessel): KLIS에서 중부지역에 사용중
proj4.defs("EPSG:5174", "+proj=tmerc +lat_0=38 +lon_0=127.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43");
// 보정된 제주원점(Bessel): KLIS에서 제주지역에 사용중
proj4.defs("EPSG:5175", "+proj=tmerc +lat_0=38 +lon_0=127.0028902777778 +k=1 +x_0=200000 +y_0=550000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43");
// 보정된 동부원점(Bessel): KLIS에서 동부지역에 사용중
proj4.defs("EPSG:5176", "+proj=tmerc +lat_0=38 +lon_0=129.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43");
// 보정된 동해(울릉)원점(Bessel): KLIS에서 울릉지역에 사용중
proj4.defs("EPSG:5177", "+proj=tmerc +lat_0=38 +lon_0=131.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43");
//UTM-K(GRS80) 중부원점
proj4.defs("SR-ORG:6640", "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs");
//WGS84
proj4.defs("EPSG:4326", "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs");

//*동부원점(Bessel): 강원도 등 동부지역
proj4.defs("EPSG:2096", "+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43");
//*중부원점(Bessel): 서울 등 중부지역
proj4.defs("EPSG:2097", "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43");
//*서부원점(Bessel): 서해5도 등 서부지역
proj4.defs("EPSG:2098", "+proj=tmerc +lat_0=38 +lon_0=125 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43");
//제주
proj4.defs("SR-ORG:6640JEJU", "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=550000 +ellps=GRS80 +units=m +no_defs");




var GIS_SERVICE_URL, baseProjection, sourceProjection, serviceProjection;
// var BASE_GIS_SERVICE_URL = "http://m1.juso.go.kr/tms?FIXED=TRUE&rnd=" + Math.random();
var BASE_GIS_SERVICE_URL = "http://m1.juso.go.kr/tms.do";

switch (mode) {
    case MODE.RUNTIME:
        baseProjection = ol.proj.get('EPSG:5179');
        sourceProjection = ol.proj.get(localStorage["sourceProj"]);
        serviceProjection = ol.proj.get(localStorage["serviceProj"]);
        break;
    case MODE.DEBUG:
        baseProjection = ol.proj.get('EPSG:5179');
        sourceProjection = ol.proj.get('EPSG:5174');
        serviceProjection = ol.proj.get('SR-ORG:6640');
        break;
}

// 레이어 리스트(/** @type {json} */ )
var layers, map;
var initial = false;

// 지도 초기화 함수(--start--)
var mapInit = function(mapId, pos) {
    var def = $.Deferred();

    if (!initial) {
        initial = true;
    } else {
        setTimeout(function() {
            def.resolve(true);
        }, 300);
        return def.promise();
    }

    //기본레이어 생성
    var baseLayer = new ol.layer.Tile({
        title: 'Mobile Kais Map',
        source: new ol.source.TileWMS({
            url: BASE_GIS_SERVICE_URL,
            params: {
                // layers: 'ROOT',
                // format: 'image/png',
                // bgcolor: '0x5F93C3',
                // exceptions: 'BLANK',
                // text_anti: 'true',
                // label: 'HIDE_OVERLAP',
                // graphic_buffer: '64'
                TYPE:"KOR"
            },
            tileGrid: new ol.tilegrid.TileGrid({
                extent: [213568, 1213568, 1786432, 2786432],
                resolutions: [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25]
            })
        })
    });

    //기초구간
    var lyr_tl_sprd_intrvl = getFeatureLayer({
        title: "기초구간",
        typeName: "tl_sprd_intrvl",
        dataType: DATA_TYPE.INTRVL,
        style: {
            label: {
                // format: ["{1}-{2}"],
                // data: ["ODD_BSI_MN", "ODD_BSI_SL"],
                // text: { key: "ODD_BSI_MN", func: function(text) { return text } },
                // textOffsetY: -20
            },
            radius: 12
        },
        maxResolution: 0.5,
        viewProgress: false,
        renderMode: 'image',
        zIndex : 0
    });


    // Feature 정보보기 레이어 생성
    var overlay = new ol.Overlay( /** @type {olx.OverlayOptions} */ ({
        id: 'popup',
        element: document.getElementById('popup'),
        position: undefined,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    }));

    // 현재위치 마커 생성
    var marker = new ol.Overlay({ /** @type {olx.OverlayOptions} */
        positioning: 'center-center',
        element: document.getElementById('marker'),
        stopEvent: false
    });

    MapUtil.init();
    map = new ol.Map({
        target: mapId,
        logo: false,
        // layers: [baseLayer, lyr_tl_sprd_intrvl],
        layers: [baseLayer],
        controls: ol.control.defaults({
            //rotate: false,
            attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                collapsible: false

            })
        }).extend([
            new MapUtil.controls.legendControl(),
            new MapUtil.controls.legendEntrcControl(),
            new MapUtil.controls.currentControl(),
            new MapUtil.controls.locManageControl(),
            new MapUtil.controls.locManageSpbdNmtgControl(),
            new MapUtil.controls.selectAdrdcControl(),
            new MapUtil.controls.returnZoomControl(),
            new MapUtil.controls.refreshMapControl(),
            new MapUtil.controls.researchControl(),
            new MapUtil.controls.researchSpbdControl(),
            new MapUtil.controls.measureControl(),
            new MapUtil.controls.oldResearchCheckControl(),
            new MapUtil.controls.layerOnOffControl(),
            // new MapUtil.controls.selectSearchUser(),


            new ol.control.Rotate({
                label: $("<IMG>", { src: 'image/icon_compass.png', alt: '지도회전 초기화' })[0],
                autoHide: false
            })
        ]),
        moveTolerance: 5,
        overlays: [overlay, marker],
        view: new ol.View({
            projection: baseProjection,
            center: pos,
            zoom: 13,
            maxZoom: 15,
            minZoom: 6,
            maxResolution: 2048,
        }),
        interactions: ol.interaction.defaults({}).extend([
            new ol.interaction.PinchZoom({
                constrainResolution: true
            })
        ])
    });

    // 도로안내시설물위치 레이어
    // 건물 레이어
    // var lyr_tl_spbd_buld = getFeatureLayer({
    //     title: "건물",
    //     // typeName: "tlv_spbd_buld",
    //     typeName: "tlv_spbd_buld_skm",
    //     dataType: DATA_TYPE.BULD,
    //     // style: {
    //     //     label: {
    //     //         chkCondition: function(f, o) { return (parseInt(f.get(o.data[2])) == 0) },
    //     //         format: ["{1}-{2}({0})", "{1}({0})"],
    //     //         data: ["BUL_MAN_NO", "BULD_MNNM", "BULD_SLNO"],
    //     //         textOffsetY: 0,
    //     //         width: 3
    //     //     }
    //     // },
    //     // maxResolution: MapUtil.setting.maxResolution,
    //     viewProgress: false,
    //     renderMode: 'image',
    // });
    // 출입구 레이어
    var lyr_tl_spbd_entrc = getFeatureLayer({
        title: "출입구",
        // typeName: "tl_spbd_entrc",
        typeName: "tlv_spbd_entrc_skm",
        // typeName: "tn_spbd_entrc_position",
        dataType: DATA_TYPE.ENTRC,
        style: {
            radius: 15,
            // label: {
                // format: ["{0}({1}-{2})"],
                // data: ["BUL_MAN_NO", "ENTRC_SE", "NMT_INS_YN"],
                // text: { key: "ENTRC_SE", func: function(text) { return text } },
                // textOffsetY: -20
            // }
        },
        // cluster: { distance: MapUtil.setting.cluster },
        maxResolution: MapUtil.setting.maxResolution_buld,
        viewProgress: false,
        renderMode: 'vector',
        zIndex : 1
    });
    // 건물번호판 레이어(좌표계)
    // var lyr_tl_spbd_entrc = getFeatureLayer({
    var lyr_tl_spbd_entrc_pos = getFeatureLayer_new({
            title: "건물번호판",
            // typeName: "tn_spbd_nmtg",
            typeName: "tlv_spbd_entrc_pos_skm",
            // typeName: "tlv_spbd_entrc_skm",
            // typeName: "tn_spbd_entrc_position",
            dataType: DATA_TYPE.ENTRC,
            style: {
                radius: 15,
                // label: {
                    // format: ["{0}({1}-{2})"],
                    // data: ["BUL_MAN_NO", "ENTRC_SE", "NMT_INS_YN"],
                    // text: { key: "ENTRC_SE", func: function(text) { return text } },
                    // textOffsetY: -20
                // }
            },
            cluster: { distance: MapUtil.setting.cluster },
            maxResolution: MapUtil.setting.maxResolution_buld,
            viewProgress: false,
            renderMode: 'vector',
            zIndex : 1
        });
    // 도로명판 레이어
    // var lyr_tl_spgf_rdpq = getFeatureLayer({
    //     title: "도로명판",
    //     typeName: "tlv_spgf_rdpq",
    //     dataType: DATA_TYPE.RDPQ,
    //     style: {
    //         label: {
    //             text: { key: "USE_TRGET", func: function(text) { return app.codeMaster[CODE_GROUP["USE_TRGET"]][text].charAt(0) } },
    //             textOffsetX: -1,
    //             textOffsetY: -18,
    //             width: 1
    //         },
    //         radius: 12
    //     },
    //     cluster: { distance: 30 },
    //     maxResolution: 2
    // });
    // 지역안내판 레이어
    // var lyr_tl_spgf_area = getFeatureLayer({
    //     title: "지역안내판",
    //     typeName: "tlv_spgf_area",
    //     dataType: DATA_TYPE.AREA,
    //     style: {
    //         label: {
    //             text: { key: "USE_TRGET", func: function(text) { return app.codeMaster[CODE_GROUP["USE_TRGET"]][text].charAt(0) } },
    //             textOffsetX: -1,
    //             textOffsetY: -18,
    //             width: 1
    //         },
    //         radius: 12
    //     },
    //     cluster: { distance: 30 },
    //     maxResolution: 4,
    //     viewProgress: false
    // });
    // 기초번호판 레이어
    // var lyr_tl_spgf_bsis = getFeatureLayer({
    //     title: "기초번호판",
    //     typeName: "tlv_spgf_bsis",
    //     dataType: DATA_TYPE.BSIS,
    //     style: {
    //         label: {
    //             text: { key: "USE_TRGET", func: function(text) { return app.codeMaster[CODE_GROUP["USE_TRGET"]][text].charAt(0) } },
    //             textOffsetX: -1,
    //             textOffsetY: -18,
    //             width: 1
    //         },
    //         radius: 12
    //     },
    //     cluster: { distance: 30 },
    //     maxResolution: 4,
    //     viewProgress: false
    // });
    // 위치레이어
    var lyr_tlv_spgf_loc_skm = getFeatureLayer({
        title: "위치레이어",
        typeName: "tlv_spgf_loc_skm",
        dataType: DATA_TYPE.LOC,
        style: {
            label: {
                text: { key: "LABEL", func: function(text) { return text } },
                textOffsetX: -1,
                textOffsetY: -18,
                width: 1
            },
            radius: 12
        },
        // cluster: { distance: MapUtil.setting.cluster },
        // maxResolution: MapUtil.setting.maxResolution,
        maxResolution: MapUtil.setting.maxResolution_spgf,
        viewProgress: false,
        renderMode: 'vector',
        zIndex : 1
    });
    //위치레이어_좌표계
    var lyr_tl_spgf_loc_pos = getFeatureLayer_new({
        title: "위치레이어",
        typeName: "tlv_spgf_loc_pos_skm",
        dataType: DATA_TYPE.LOC,
        style: {
            label: {
                text: { key: "LABEL", func: function(text) { return text } },
                textOffsetX: -1,
                textOffsetY: -18,
                width: 1
            },
            radius: 12
        },
        cluster: { distance: MapUtil.setting.cluster },
        // maxResolution: MapUtil.setting.maxResolution,
        maxResolution: MapUtil.setting.maxResolution_spgf,
        viewProgress: false,
        renderMode: 'vector',
        zIndex : 1
    });
    
    //지점번호판 레이어
    // var lyr_tl_sppn_paninfo = getFeatureLayer({
    //     title: "지점번호판",
    //     typeName: "tl_sppn_paninfo",
    //     dataType: DATA_TYPE.SPPN,
    //     style: {
    //         // label: {
    //         //     text: { key: "LABEL", func: function(text) { return text } },
    //         //     textOffsetX: -1,
    //         //     textOffsetY: -18,
    //         //     width: 1
    //         // },
    //         radius: 12
    //     },
    //     cluster: { distance: MapUtil.setting.cluster },
    //     maxResolution: 2,
    //     viewProgress: false,
    //     renderMode: 'vector',
    //     zIndex : 1
    // });
    

    layers = {
        "loc": lyr_tlv_spgf_loc_skm,
        // "rdpq": lyr_tl_spgf_rdpq,
        // "area": lyr_tl_spgf_area,
        // "bsis": lyr_tl_spgf_bsis,
        "entrc": lyr_tl_spbd_entrc,
        // "buld": lyr_tl_spbd_buld,
        // "sppn": lyr_tl_sppn_paninfo,
        "intrvl":lyr_tl_sprd_intrvl,
        // "loc_pos": lyr_tl_spgf_loc_pos,
        // "entrc_pos": lyr_tl_spbd_entrc_pos
    };

    /*********** 지도 화면 핸들러 (--start--) ***********/

//    마우스 이동 이벤트 정의 (거리측정) (--start--)
      /**
       * Currently drawn feature.
       * @type {ol.Feature}
       */
      var sketch;


      /**
       * The help tooltip element.
       * @type {Element}
       */
      var helpTooltipElement;


      /**
       * Overlay to show the help messages.
       * @type {ol.Overlay}
       */
      var helpTooltip;


      /**
       * The measure tooltip element.
       * @type {Element}
       */
      var measureTooltipElement;


      /**
       * Overlay to show the measurement.
       * @type {ol.Overlay}
       */
      var measureTooltip;

    /**
     * Message to show when the user is drawing a polygon.
     * @type {string}
     */
    var continuePolygonMsg = 'Click to continue drawing the polygon';


    /**
     * Message to show when the user is drawing a line.
     * @type {string}
     */
    var continueLineMsg = '종료 하시려면 같은 지점을 두번 클릭하세요.';
    /**
     * Handle pointer move.
     * @param {ol.MapBrowserEvent} evt The event.
     */
    var pointerMoveHandler = function(evt) {
        if (evt.dragging) {
        return;
        }
        /** @type {string} */
        var helpMsg = '거리를 측정할 지점을 선택하세요.';

        if (sketch) {
        var geom = (sketch.getGeometry());
        if (geom instanceof ol.geom.Polygon) {
            helpMsg = continuePolygonMsg;
        } else if (geom instanceof ol.geom.LineString) {
            helpMsg = continueLineMsg;
        }
        }

        // helpTooltipElement.innerHTML = helpMsg;
        // helpTooltip.setPosition(evt.coordinate);

        $("#measureMapInfo span").html(helpMsg);

        helpTooltipElement.classList.remove('hidden');
    };

    // map.on('pointermove', pointerMoveHandler);

    // var getCoodiMapService = function(evt){
    //     var bbox = map.previousExtent_;
    //     console.log('지도 이동' + bbox);

    // }

    // //지도이동
    // map.on('moveend', getCoodiMapService);
    
    // map.getViewport().addEventListener('touchend', function() {
    //     helpTooltipElement.classList.add('hidden');
    // });

    //   var typeSelect = document.getElementById('type');
    var typeSelect = 'LineString';

    var draw; // global so we can remove it later


    /**
     * Format length output.
     * @param {ol.geom.LineString} line The line.
     * @return {string} The formatted length.
     */
    var formatLength = function(line) {
      var length = ol.Sphere.getLength(line);
      var output;
      if (length > 100) {
        output = (Math.round(length / 1000 * 100) / 100) +
            ' ' + 'km';
      } else {
        output = (Math.round(length * 100) / 100) +
            ' ' + 'm';
      }
      return output;
    };


    /**
     * Format area output.
     * @param {ol.geom.Polygon} polygon The polygon.
     * @return {string} Formatted area.
     */
    var formatArea = function(polygon) {
      var area = ol.Sphere.getArea(polygon);
      var output;
      if (area > 10000) {
        output = (Math.round(area / 1000000 * 100) / 100) +
            ' ' + 'km<sup>2</sup>';
      } else {
        output = (Math.round(area * 100) / 100) +
            ' ' + 'm<sup>2</sup>';
      }
      return output;
    };
    // var source = new ol.source.Vector();
    var source = getVectorSource(map , "현위치");

    function addInteraction() {
      var type = (typeSelect.value == 'area' ? 'Polygon' : 'LineString');
      draw = new ol.interaction.Draw({
        source: source,
        type: type,
        style: new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          }),
          stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 0, 0.5)',
            lineDash: [10, 10],
            width: 2
          }),
          image: new ol.style.Circle({
            radius: 5,
            stroke: new ol.style.Stroke({
              color: 'rgba(0, 0, 0, 0.7)'
            }),
            fill: new ol.style.Fill({
              color: 'rgba(255, 255, 255, 0.2)'
            })
          })
        })
      });
      map.addInteraction(draw);

      createMeasureTooltip();
    //   createHelpTooltip();

      var listener;
      draw.on('drawstart',
          function(evt) {
            // set sketch
            sketch = evt.feature;

            /** @type {ol.Coordinate|undefined} */
            var tooltipCoord = evt.coordinate;

            listener = sketch.getGeometry().on('change', function(evt) {
              var geom = evt.target;
              var output;
              if (geom instanceof ol.geom.Polygon) {
                output = formatArea(geom);
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
              } else if (geom instanceof ol.geom.LineString) {
                output = formatLength(geom);
                tooltipCoord = geom.getLastCoordinate();
              }
              measureTooltipElement.innerHTML = output;
              measureTooltip.setPosition(tooltipCoord);
            });
          }, this);

      draw.on('drawend',
          function() {
            // measureTooltipElement.className = 'tooltip tooltip-static';
            // measureTooltip.setOffset([0, -7]);
            //거리측정 후 지우기
            map.removeOverlay(measureTooltip);
            // unset sketch
            sketch = null;
            // unset tooltip so that a new one can be created
            measureTooltipElement = null;
            createMeasureTooltip();
            ol.Observable.unByKey(listener);
            
          }, this);
    }


    /**
     * Creates a new help tooltip
     */
    function createHelpTooltip() {
      if (helpTooltipElement) {
        helpTooltipElement.parentNode.removeChild(helpTooltipElement);
      }
      helpTooltipElement = document.createElement('div');
      helpTooltipElement.className = 'tooltip hidden';
      helpTooltip = new ol.Overlay({
        element: helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left'
      });
      map.addOverlay(helpTooltip);
    }


    /**
     * Creates a new measure tooltip
     */
    function createMeasureTooltip() {
      if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
      }
      measureTooltipElement = document.createElement('div');
      measureTooltipElement.className = 'tooltip tooltip-measure';
      measureTooltip = new ol.Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center'
      });
      map.addOverlay(measureTooltip);
    }


    /**
     * Let user change the geometry type.
     */
    $("#measureGbn").change(function(){
        var gbn = $("#measureGbn").val();
        if(gbn == "1"){
            addInteraction();
        }else{
            map.removeInteraction(draw);
            map.removeOverlay(measureTooltip);
        }
    })

    typeSelect.onchange = function() {
      map.removeInteraction(draw);
      addInteraction();
    };

    // addInteraction();
//    마우스 이동 이벤트 정의(거리측정) (--end--)

//     선택 이벤트 정의()(--start--)
    map.on('click', function(event) {
//    map.getViewport().addEventListener('click', function(event) {

        //거리측정 모드 일 경우 터치 이벤트 발생 무시
        var measureGbn = $("#measureGbn").val();
        if(measureGbn == "1"){
            return;
        }

        var coordinate = event.coordinate;

        //클릭위치 임시저장
        clickPoint = coordinate;

        var resultHtml = "";
        var buttonHtml = "";
        var strHtml = "";

        var layerList = map.getLayers().getArray();
        var popupDiv = $("#popup-content");
        var commonDiv = "<div class='{0}'>{1}</div>";
        var commonP = "<p class='{0}'>{1}</p>";
        var commonSpan = "<span class='{0}'>{1}</span>";
        var commonButton = "<button class='{0}'onclick='{1}'>{2}</button>"


        var popDiv = "<div class='{0}' onclick =\"{1}\">{2}</div>"
        var popTableP = "<p>{0} : {1}</p>";
        var buttonForm = "<span class = {0} onclick=\"{1}\"><img src='{2}' title='{3}'></span>";
        var buttonForm2 = "<span class = {0} onclick='{1}'>{2}</span>";

        //심플팝업 초기화
        popupDiv.empty();
        $("#popup").hide();

        /********** 위치이동 팝업 셋팅 start **********/

        for (var i = 0; i < layerList.length; i++) {
            if (layerList[i].get('title') == '위치이동') {

                var movingPoint_source = layerList[i].getSource();

                movingPoint_source.clear();

                var oldPointFeature = new ol.Feature();
                oldPointFeature.setStyle(new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 10,
                        fill: new ol.style.Fill({
                            color: '#00004d'
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#fff',
                            width: 2
                        })
                    })
                }));
                var oldGeom = featureClone[featureIndex].getGeometry().getCoordinates();
                var oldPoint = new ol.geom.Point([oldGeom[0], oldGeom[1]]);

                oldPointFeature.setGeometry(oldPoint);

                movingPoint_source.addFeature(oldPointFeature);

                var newPointFeature = new ol.Feature();
                newPointFeature.setStyle(new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 10,
                        fill: new ol.style.Fill({
                            color: '#ff0000'
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#fff',
                            width: 2
                        })
                    })
                }));

                var newPoint = new ol.geom.Point(coordinate);
                newPointFeature.setGeometry(newPoint);
                movingPoint_source.addFeature(newPointFeature);

                // var SIG_CD = featureClone[featureIndex].get("SIG_CD");
                // var RDFTYLC_SN = featureClone[featureIndex].get("RDFTYLC_SN");
                var sn = localStorage["moveTrgSn"];
                
                // var RDFTY_SE = featureClone[featureIndex].get("RDFTY_SE");
                // var pointSn = popTableP.format("위치일련번호", RDFTYLC_SN);
                var newCoodi = new ol.proj.transform(coordinate, baseProjection, sourceProjection);

                strHtml = "<b>검정(원)</b>-&gt; <span style='color:red;'>빨강(원)</span>으로 이동하고자 합니다.<br>(맞으면 저장, 틀리면 다른 위치 선택)";

                resultHtml = commonDiv.format("", strHtml);

                var param = "";
                param = $.extend({}, {
                    sn: sn,
                    // sigCd : SIG_CD,
                    // rdftySe : RDFTY_SE,
                    posX: newCoodi[0],
                    posY: newCoodi[1],
                    jobSeCd: 'C'
                });

                //버튼처리
                buttonHtml += buttonForm2.format("btnNormal", "clearMoveMode()", "취소");
                buttonHtml += buttonForm2.format("btnPoint", 'insertMoveingPoint(' + JSON.stringify(param) + ')', "저장");

                resultHtml += commonDiv.format("mapBtn", buttonHtml)

                resultHtml = commonDiv.format('mapInfo', resultHtml);

                popupDiv.html(resultHtml);

                $("#popup").show();

                overlay.setPosition(coordinate);
                return;
            }
        }
        /********** 위치이동 팝업 셋팅 end **********/

        /********** 피쳐 클릭 셋팅 (심플팝업)**********/
        var firstClick = true;
        featureClone = null;
        map.forEachFeatureAtPixel(event.pixel, function(feature, layer) {

            // console.log(feature, layer);

            var zoomLevel = map.getView().getZoom();
            if(zoomLevel < 13){
                util.toast("지도를 확대하신 후 심볼을 클릭해 주세요");
                return;
            }

            if(layer == null){
                currentPositionLayerCheck();
                return;
            }

            var sn, features, rdGdftySe;

            if (feature.getKeys().indexOf('features') >= 0)
                features = feature.get('features');
            else
                features = [feature];

            //상세내용 셋팅 및 위치이동시 사용하기 위해 복사
            // if(localStorage['engineUse'] = 'Y'){
                if(featureClone){
                    featureIndex = featureClone.length;
                    featureClone.push(feature);
                }else{
                    featureClone = features;
                    featureIndex = 0;
                }
            // }else{
            //     featureClone = features;
            // }
            //레이어ID
            layerID = layer.get('id');

            //간략정보 조회
            selectFeatureInfo(features,featureIndex);

            // features.forEach(function(feature, index) {

            //     switch (layerID) {
            //         case DATA_TYPE.LOC:
            //             var link = URLs.selectLocLink;
            //             //도로시설물위치일련번호
            //             var RDFTYLC_SN = feature.get("RDFTYLC_SN");

            //             var sendParam = {
            //                 // svcNm: 'sLOC',
            //                 // mode : "11",
            //                 sn: RDFTYLC_SN,
            //                 sigCd: app.info.sigCd,
            //                 workId: app.info.opeId
            //             };

            //             var url = URLs.postURL(link, sendParam);

            //             util.showProgress();
            //             util.postAJAX({}, url)
            //                 .then(function(context, rCode, results) {
            //                     util.dismissProgress();

            //                     //통신오류처리
            //                     if (rCode != 0 || results.response.status < 0) {
            //                         navigator.notification.alert(msg.callCenter, '', '알림', '확인');
            //                         util.dismissProgress();
            //                         return;
            //                     }

            //                     var resultList = results.data;

            //                     for (var i = 0; resultList.length > i; i++) {
            //                         strHtml = "";
            //                         buttonHtml = "";
            //                         resultHtml = "";

            //                         var rdGdftySe = resultList[i].rdGdftySe;
            //                         //울릉군 점검용
            //                         // var rdGdftySn = resultList[i].rdGdftySn;
            //                         // var rdFtyLcSn = resultList[i].rdFtyLcSn;

            //                         // if (rdGdftySe == "110") {
            //                         if(rdGdftySe == "110" || rdGdftySe == "210" || rdGdftySe == "310"){
            //                             layerID = DATA_TYPE.RDPQ;
            //                             var instSe = resultList[i].instSe;
            //                             var rdGdftySeLbl = resultList[i].rdGdftySeLbl;
            //                             var useTarget = resultList[i].useTarget;
            //                             if(instSe == '00002' && useTarget == '01000'){
            //                                 rdGdftySeLbl = rdGdftySeLbl + '(벽)';
            //                             }
            //                             var gbn = commonP.format("gbn", "[{0}]".format(rdGdftySeLbl));
            //                             //제목창
            //                             var title = '';
            //                             //명판방향
            //                             var plqDirection = resultList[i].plqDirection;
            //                             //도로명
            //                             var frontKoreanRoadNm = resultList[i].frontKoreanRoadNm;
            //                             //시작기초번호
            //                             var frontStartBaseMasterNo = resultList[i].frontStartBaseMasterNo;
            //                             var frontStartBaseSlaveNo = resultList[i].frontStartBaseSlaveNo;
            //                             //종료기초번호
            //                             var frontEndBaseMasterNo = resultList[i].frontEndBaseMasterNo;
            //                             var frontEndBaseSlaveNo = resultList[i].frontEndBaseSlaveNo;
            //                             //명판방향라벨
            //                             var PLQ_DRC = resultList[i].plqDirectionLbl;

            //                             //이면도로용
            //                             if(rdGdftySe == "210"){
            //                                 plqDirection = resultList[i].rddr_plqDrc;
            //                                 frontKoreanRoadNm = resultList[i].rddr_korRn;
            //                                 frontStartBaseMasterNo = resultList[i].rddr_stbsMn;
            //                                 frontStartBaseSlaveNo = resultList[i].rddr_stbsSn;
            //                                 frontEndBaseMasterNo = resultList[i].rddr_edbsMn;
            //                                 frontEndBaseSlaveNo = resultList[i].rddr_edbsSn;
            //                                 PLQ_DRC = resultList[i].rddr_plqDrcLbl;

            //                             }else if(rdGdftySe == "310"){
            //                                 // plqDirection = data.rddr_plqDrc;
            //                                 var prnt_ftRdLt = resultList[i].prnt_ftRdLt == null ? "" : resultList[i].prnt_ftRdLt + "M";
            //                                 frontKoreanRoadNm = resultList[i].prnt_ftKorRn + " " + prnt_ftRdLt;
            //                                 // frontKoreanRoadNm = resultList[i].prnt_ftKorRn;
            //                                 frontStartBaseMasterNo = "0";
            //                                 frontStartBaseSlaveNo = "0";
            //                                 frontEndBaseMasterNo = "0";
            //                                 frontEndBaseSlaveNo = "0";
            //                             }


            //                             //시작기초번호
            //                             var frontStartBaseNo = "{0}{1}".format(frontStartBaseMasterNo == "0"? "" : frontStartBaseMasterNo, (frontStartBaseSlaveNo != "0" ? '-' + frontStartBaseSlaveNo : ''));
            //                             //종료기초번호
            //                             var frontEndBaseNo = "{0}{1}".format(frontEndBaseMasterNo == "0"? "" : frontEndBaseMasterNo, (frontEndBaseSlaveNo != "0" ? '-' + frontEndBaseSlaveNo : ''));
                                        

            //                             //도로명,시작번호,종료번호가 null 일경우 도로명없음으로 표시
            //                             if(frontKoreanRoadNm == null ||frontStartBaseMasterNo == null || frontEndBaseMasterNo == null || frontStartBaseSlaveNo == null || frontEndBaseSlaveNo == null){
            //                                 title = "도로명없음";
            //                             }else{
            //                                 if(plqDirection == '00200'){
            //                                     title = commonP.format("localTitle",
            //                                         "{0} {1} {2}".format(
            //                                             frontStartBaseNo,
            //                                             frontKoreanRoadNm ? frontKoreanRoadNm : '도로명없음',
            //                                             frontEndBaseNo
            //                                         )
            //                                     );
            //                                 }else if(plqDirection == '00100' || plqDirection == '00300'){
            //                                     title = commonP.format("localTitle",
            //                                         "{0} {1} {2} {3}".format(
            //                                             frontKoreanRoadNm ? frontKoreanRoadNm : '도로명없음',
            //                                             frontStartBaseNo,
            //                                             (plqDirection == '00100' ? '→' : (plqDirection == '00300' ? '↑' : '')),
            //                                             frontEndBaseNo
            //                                         )
            //                                     );
            //                                 }else{
            //                                     title = commonP.format("localTitle",
            //                                         "{0}".format(frontKoreanRoadNm ? frontKoreanRoadNm : '도로명없음')
            //                                         )
            //                                 };
            //                             }

                                        
            //                             var plqDrc = commonSpan.format("info", PLQ_DRC);

            //                             var scfggMkty = resultList[i].scfggMkty;

            //                             //규격
            //                             var RDPQ_GD_SD = resultList[i].rdpqGdSdLbl;
            //                             if(scfggMkty != "1"){
            //                                 //규격(제2외국어용 규격)
            //                                 RDPQ_GD_SD = resultList[i].rdpqGdSdScfggMktyLbl;
            //                             }
            //                             //이면도로용
            //                             if(rdGdftySe == "210"){
            //                                 RDPQ_GD_SD = resultList[i].rddrGdSdLbl;

            //                             }else if(rdGdftySe == "310"){
            //                                 RDPQ_GD_SD = resultList[i].prntGdSdLbl;
            //                             }
            //                             if(RDPQ_GD_SD == null){
            //                                 RDPQ_GD_SD = '규격정보없음';
            //                             }
            //                             var rdpqGdSd = commonSpan.format("info", RDPQ_GD_SD);
            //                             //양면여부
            //                             var BDRCL_AT = resultList[i].bdrclAt == 0 ? "단면" : "양면";
            //                             var bdrclAt = commonSpan.format("info", BDRCL_AT);

            //                             // if(features.length > 1 && index >= 1){
            //                             //     popupDiv.append(commonP.format("infoLine",""));
            //                             // }

            //                             //근거리 사진건수
            //                             // var CNT_M_FILES = feature.get("CNT_M_FILES");
            //                             var CNT_M_FILES = resultList[i].cntMFiles;
            //                             //원거리 사진건수
            //                             // var CNT_L_FILES = feature.get("CNT_L_FILES");
            //                             var CNT_L_FILES = resultList[i].cntLFiles;

            //                             //설치상태
            //                             // var DEL_STT_CD = feature.get("DEL_STT_CD");
            //                             var DEL_STT_CD = resultList[i].delStateCd;
            //                             var delStateCdLbl = resultList[i].delStateCdLbl;
            //                             //점검상태
            //                             var rcSttCdLbl = resultList[i].rcSttCdLbl;
            //                             var rcsttCdClass = "info";
            //                             if(rcSttCdLbl == null){
            //                                 rcSttCdLbl = "미점검";
            //                                 rcsttCdClass = "info redText";
            //                             }

            //                             var text0 = commonSpan.format("info", "설치상태 : " + delStateCdLbl);
            //                             var text1 = commonSpan.format(rcsttCdClass, "점검상태 : " + rcSttCdLbl);
            //                             var text2 = commonSpan.format("info", "원거리사진 : " + CNT_L_FILES);
            //                             var text3 = commonSpan.format("info", "근거리사진 : " + CNT_M_FILES);

            //                             // var text4 = commonSpan.format("info", "위치일련번호 : " + rdFtyLcSn);
            //                             // var text5 = commonSpan.format("info", "안내시설일련번호 : " + rdGdftySn);

            //                             var button1 = "" ;
            //                             var mtchRcrSn = resultList[i].rcrSn;
            //                             var nowRcrSn = app.info.rcrSn;
            //                             //설치상태 정상 근거리 원거리 사진 1개 이상인 경우 점검가능
            //                             if(DEL_STT_CD == "01" && CNT_M_FILES > 0 && CNT_L_FILES > 0 && (mtchRcrSn == null || mtchRcrSn == nowRcrSn)){
            //                                 button1 = commonButton.format("ui-btn ui-corner-all ui-shadow btnPossible",'insertResearchForPopup('+index+','+resultList[i].rdGdftySn+','+resultList[i].rdFtyLcSn+','+rdGdftySe+')',"정상점검");
            //                             }
        

            //                             strHtml += gbn
            //                             strHtml += title
            //                             // strHtml += commonP.format("", bdrclAt + rdpqGdSd);
            //                             // strHtml += commonP.format("", text4);
            //                             // strHtml += commonP.format("", text5);
            //                             strHtml += commonP.format("", text0);
            //                             strHtml += commonP.format("", text1);
            //                             strHtml += commonP.format("", text2 + text3);

            //                             resultHtml += popDiv.format("", "openDetailPopupCall(" + index + ",'" + layerID + "'," + resultList[i].rdGdftySn + "," +rdGdftySe +")", strHtml);

            //                             //도로시설물 공간정보
            //                             var geom = feature.getGeometry().getCoordinates();

            //                             buttonHtml += buttonForm.format("more", "openDetailPopupCall(" + index + ",'" + layerID + "'," + resultList[i].rdGdftySn + "," + rdGdftySe +")", "image/more.png", "더보기");
            //                             buttonHtml += buttonForm.format("addition", "moveingPoint(" + resultList[i].rdFtyLcSn + "," + geom[0] + "," + geom[1] + "," + index + ")", "image/addtion.png", "이동");

            //                             resultHtml += commonDiv.format("mapAdd", buttonHtml);
            //                             resultHtml += button1;
            //                             resultHtml = commonDiv.format("mapInfo", resultHtml);

            //                             popupDiv.append(resultHtml);

            //                             $("#popup").show();
            //                             overlay.setPosition(coordinate);
                                        
            //                             resultHtml = commonP.format("infoLine", "");
            //                             popupDiv.append(resultHtml);
            //                         // }else if (rdGdftySe == "210") {

            //                         // }else if (rdGdftySe == "310") {

            //                         }else if (rdGdftySe == "510") {
            //                             layerID = DATA_TYPE.AREA;
            //                             var gbn = commonP.format("gbn", "[{0}]".format("지역안내판"));

            //                             //제목창
            //                             var title = '';

            //                             //시작기초번호(0-0)]
            //                             var area_stbsNo = "{0}{1}".format(resultList[i].area_stbsMn, (resultList[i].area_stbsSn != "0" ? '-' + resultList[i].area_stbsSn : ''));
            //                             //종료기초번호(0-0)
            //                             var area_edbsNo = "{0}{1}".format(resultList[i].area_edbsMn, (resultList[i].area_edbsSn != "0" ? '-' + resultList[i].area_edbsSn : ''));
                                        
            //                             //도로명,시작번호,종료번호가 null 일경우 도로명없음으로 표시
            //                             if(resultList[i].area_areaKorRn == null ||resultList[i].area_stbsMn == null || resultList[i].area_stbsSn == null || resultList[i].area_edbsMn == null || resultList[i].area_edbsSn == null){
            //                                 title = "도로명없음";
            //                             }else{
            //                                 title = commonP.format("localTitle",
            //                                     "←{0} {1} {2}→".format(
            //                                         area_stbsNo,
            //                                         resultList[i].area_areaKorRn ? resultList[i].area_areaKorRn : '도로명없음',
            //                                         area_edbsNo
            //                                     )
            //                                 );
            //                             }

            //                             // var title = commonP.format("localTitle",
            //                             //     "{0} {1}{2}".format(
            //                             //         resultList[i].area_areaKorRn,
            //                             //         resultList[i].area_stbsMn,
            //                             //         (resultList[i].area_stbsSn == "0" ? "" : "-" + resultList[i].area_stbsSn)
            //                             //     )
            //                             // );
            //                             //규격
            //                             var AREA_GD_SD = resultList[i].area_areaGdSdLbl;
            //                             var areaGdSd = commonSpan.format("info", AREA_GD_SD);

            //                             //양면여부
            //                             var BDRCL_AT = resultList[i].bdrclAt == 0 ? "단면" : "양면";
            //                             var bdrclAt = commonSpan.format("info", BDRCL_AT);

            //                             //근거리 사진건수
            //                             // var CNT_M_FILES = feature.get("CNT_M_FILES");
            //                             var CNT_M_FILES = resultList[i].cntMFiles;
            //                             //원거리 사진건수
            //                             // var CNT_L_FILES = feature.get("CNT_L_FILES");
            //                             var CNT_L_FILES = resultList[i].cntLFiles;

            //                             //설치상태
            //                             // var DEL_STT_CD = feature.get("DEL_STT_CD");
            //                             var DEL_STT_CD = resultList[i].delStateCd;
            //                             var delStateCdLbl = resultList[i].delStateCdLbl;
            //                             //점검상태
            //                             var rcSttCdLbl = resultList[i].rcSttCdLbl;
            //                             var rcsttCdClass = "info";
            //                             if(rcSttCdLbl == null){
            //                                 rcSttCdLbl = "미점검";
            //                                 rcsttCdClass = "info redText";
            //                             }

            //                             var text0 = commonSpan.format("info", "설치상태 : " + delStateCdLbl);
            //                             var text1 = commonSpan.format(rcsttCdClass, "점검상태 : " + rcSttCdLbl);
            //                             var text2 = commonSpan.format("info", "원거리사진 : " + CNT_L_FILES);
            //                             var text3 = commonSpan.format("info", "근거리사진 : " + CNT_M_FILES);

            //                             // var text4 = commonSpan.format("info", "위치일련번호 : " + rdFtyLcSn);
            //                             // var text5 = commonSpan.format("info", "안내시설일련번호 : " + rdGdftySn);

            //                             var button1 = "" ;

            //                             var mtchRcrSn = resultList[i].rcrSn;
            //                             var nowRcrSn = app.info.rcrSn;
            //                             //설치상태 정상 근거리 원거리 사진 1개 이상인 경우 점검가능
            //                             if(DEL_STT_CD == "01" && CNT_M_FILES > 0 && CNT_L_FILES > 0 && (mtchRcrSn == null || mtchRcrSn == nowRcrSn)){
            //                                 button1 = commonButton.format("ui-btn ui-corner-all ui-shadow btnPossible",'insertResearchForPopup('+index+','+resultList[i].rdGdftySn+','+resultList[i].rdFtyLcSn+','+rdGdftySe+')',"정상점검");
            //                             }

            //                             strHtml += gbn
            //                             strHtml += title
            //                             // strHtml += commonP.format("", bdrclAt + areaGdSd);
            //                             // strHtml += commonP.format("", text4);
            //                             // strHtml += commonP.format("", text5);
            //                             strHtml += commonP.format("", text0);
            //                             strHtml += commonP.format("", text1);
            //                             strHtml += commonP.format("", text2 + text3);



            //                             // if(features.length > 1 && index == 1){
            //                             //     resultHtml += commonP.format("infoLine","");
            //                             // }

            //                             resultHtml += popDiv.format("", "openDetailPopupCall(" + index + ",'" + layerID + "'," + resultList[i].rdGdftySn + ")", strHtml);

            //                             //도로시설물 공간정보
            //                             var geom = feature.getGeometry().getCoordinates();

            //                             buttonHtml += buttonForm.format("more", "openDetailPopupCall(" + index + ",'" + layerID + "'," + resultList[i].rdGdftySn + ")", "image/more.png", "더보기");
            //                             buttonHtml += buttonForm.format("addition", "moveingPoint(" + resultList[i].rdFtyLcSn + "," + geom[0] + "," + geom[1] + "," + index + ")", "image/addtion.png", "이동");

            //                             resultHtml += commonDiv.format("mapAdd", buttonHtml);
            //                             resultHtml += button1;
            //                             resultHtml = commonDiv.format("mapInfo", resultHtml);

            //                             popupDiv.append(resultHtml);

            //                             $("#popup").show();
            //                             overlay.setPosition(coordinate);

            //                             resultHtml = commonP.format("infoLine", "");
            //                             popupDiv.append(resultHtml);
            //                         } else if (rdGdftySe == "610") {
            //                             layerID = DATA_TYPE.BSIS;
            //                             var gbn = commonP.format("gbn", "[{0}]".format("기초번호판"));

            //                             //제목창
            //                             var title = '';
            //                             //기초번호(0-0)
            //                             var bsis_ctbsNo = "{0}{1}".format(resultList[i].bsis_ctbsMn, (resultList[i].bsis_ctbsSn != "0" ? '-' + resultList[i].bsis_ctbsSn : ''));
                                        
            //                             //도로명,시작번호,종료번호가 null 일경우 도로명없음으로 표시
            //                             if(resultList[i].bsis_korRn == null ||resultList[i].bsis_ctbsMn == null || resultList[i].bsis_ctbsSn == null){
            //                                 title = "도로명없음";
            //                             }else{  
            //                                 title = commonP.format("localTitle",
            //                                     "{0} {1}".format(
            //                                         resultList[i].bsis_korRn ? resultList[i].bsis_korRn : '도로명없음',
            //                                         bsis_ctbsNo
            //                                     )
            //                                 );
            //                             }

            //                             // var title = commonP.format("localTitle",
            //                             //     "{0} {1}{2}".format(
            //                             //         resultList[i].bsis_korRn,
            //                             //         resultList[i].bsis_ctbsMn,
            //                             //         (resultList[i].bsis_ctbsSn == "0" ? "" : "-" + resultList[i].bsis_ctbsSn)
            //                             //     )
            //                             // );

            //                             //시점
            //                             var BFBS_MN = (resultList[i].bsis_bfbsMn ? resultList[i].bsis_bfbsMn : '');

            //                             var BFBS_SN = (resultList[i].bsis_bfbsSn == "0" ? '' : resultList[i].bsis_bfbsSn);

            //                             var bfbsStr = baseNumberMix(BFBS_MN, BFBS_SN); // 0 - 0

            //                             var bfbs = popTableP.format("이전승강장기초번호", bfbsStr);

            //                             //종점

            //                             var NTBS_MN = (resultList[i].bsis_ntbsMn ? resultList[i].bsis_ntbsMn : '');

            //                             var NTBS_SN = (resultList[i].bsis_ntbsSn ? resultList[i].bsis_ntbsSn : '');

            //                             var ntbsStr = baseNumberMix(NTBS_MN, NTBS_SN); // 0 - 0

            //                             var ntbs = popTableP.format("다음승강장기초번호", ntbsStr);

            //                             //근거리 사진건수
            //                             // var CNT_M_FILES = feature.get("CNT_M_FILES");
            //                             var CNT_M_FILES = resultList[i].cntMFiles;
            //                             //원거리 사진건수
            //                             // var CNT_L_FILES = feature.get("CNT_L_FILES");
            //                             var CNT_L_FILES = resultList[i].cntLFiles;

            //                             //설치상태
            //                             // var DEL_STT_CD = feature.get("DEL_STT_CD");
            //                             var DEL_STT_CD = resultList[i].delStateCd;
            //                             var delStateCdLbl = resultList[i].delStateCdLbl;
            //                             //점검상태
            //                             var rcSttCdLbl = resultList[i].rcSttCdLbl;
            //                             var rcsttCdClass = "info";
            //                             if(rcSttCdLbl == null){
            //                                 rcSttCdLbl = "미점검";
            //                                 rcsttCdClass = "info redText";
            //                             }
            //                             // var text4 = commonSpan.format("info", "위치일련번호 : " + rdFtyLcSn);
            //                             // var text5 = commonSpan.format("info", "안내시설일련번호 : " + rdGdftySn);
            //                             var text0 = commonSpan.format("info", "설치상태 : " + delStateCdLbl);
            //                             var text1 = commonSpan.format(rcsttCdClass, "점검상태 : " + rcSttCdLbl);
            //                             var text2 = commonSpan.format("info", "원거리사진 : " + CNT_L_FILES);
            //                             var text3 = commonSpan.format("info", "근거리사진 : " + CNT_M_FILES);
            //                             var button1 = "" ;

            //                             var mtchRcrSn = resultList[i].rcrSn;
            //                             var nowRcrSn = app.info.rcrSn;
            //                             //설치상태 정상 근거리 원거리 사진 1개 이상인 경우 점검가능
            //                             if(DEL_STT_CD == "01" && CNT_M_FILES > 0 && CNT_L_FILES > 0 && (mtchRcrSn == null || mtchRcrSn == nowRcrSn)){
            //                                 button1 = commonButton.format("ui-btn ui-corner-all ui-shadow btnPossible",'insertResearchForPopup('+index+','+resultList[i].rdGdftySn+','+resultList[i].rdFtyLcSn+','+rdGdftySe+')',"정상점검");
            //                             }

            //                             strHtml += gbn
            //                             strHtml += title
            //                             // strHtml += commonP.format("", bfbs);
            //                             // strHtml += commonP.format("", ntbs);
            //                             // strHtml += commonP.format("", text4);
            //                             // strHtml += commonP.format("", text5);
            //                             strHtml += commonP.format("", text0);
            //                             strHtml += commonP.format("", text1);
            //                             strHtml += commonP.format("", text2 + text3);

            //                             // if(features.length > 1 && index == 1){
            //                             //     resultHtml += commonP.format("infoLine","");
            //                             // }

            //                             resultHtml += popDiv.format("", "openDetailPopupCall(" + index + ",'" + layerID + "'," + resultList[i].rdGdftySn + ")", strHtml);

            //                             //도로시설물 공간정보
            //                             var geom = feature.getGeometry().getCoordinates();

            //                             buttonHtml += buttonForm.format("more", "openDetailPopupCall(" + index + ",'" + layerID + "'," + resultList[i].rdGdftySn + ")", "image/more.png", "더보기");
            //                             buttonHtml += buttonForm.format("addition", "moveingPoint(" + resultList[i].rdFtyLcSn + "," + geom[0] + "," + geom[1] + "," + index + ")", "image/addtion.png", "이동");

            //                             resultHtml += commonDiv.format("mapAdd", buttonHtml);
            //                             resultHtml += button1;
            //                             resultHtml = commonDiv.format("mapInfo", resultHtml);

            //                             popupDiv.append(resultHtml);

            //                             $("#popup").show();
            //                             overlay.setPosition(coordinate);

            //                             resultHtml = commonP.format("infoLine", "");
            //                             popupDiv.append(resultHtml);

            //                         }

            //                     }

            //                 }, msg.alert);
            //             break;
            //         case DATA_TYPE.BULD:
            //             //건물명
            //             var POS_BUL_NM = feature.get("POS_BUL_NM");

            //             if (POS_BUL_NM == undefined) {
            //                 POS_BUL_NM = "건물명 없음";
            //             }

            //             strHtml = commonSpan.format("titleIcon_building", "");
            //             strHtml += POS_BUL_NM;

            //             var buldNm = commonP.format("localTitle", strHtml);

            //             //팝업내용 추가
            //             strHtml = buldNm

            //             resultHtml = popDiv.format("", "openDetailPopupCall(0)", strHtml);

            //             //도로시설물 공간정보
            //             var geom = feature.getGeometry().getCoordinates();

            //             buttonHtml = buttonForm.format("more", "openDetailPopupCall(0)", "image/more.png", "더보기");

            //             resultHtml += commonDiv.format("mapAdd", buttonHtml);

            //             resultHtml = commonDiv.format("mapInfo", resultHtml);

            //             popupDiv.append(resultHtml);

            //             //건물번호판
            //             strHtml = commonSpan.format("titleIcon_number", "");
            //             strHtml += "건물번호판";

            //             //팝업내용 추가
            //             strHtml = commonP.format("localTile", strHtml);
            //             strHtml += commonP.format("", "");

            //             resultHtml = popDiv.format("", "openDetailPopupCall(1)", strHtml);

            //             buttonHtml = buttonForm.format("more", "openDetailPopupCall(1)", "image/more.png", "더보기");

            //             resultHtml += commonDiv.format("mapAdd", buttonHtml);

            //             resultHtml = commonDiv.format("mapInfo", resultHtml);

            //             // popupDiv.append(resultHtml);

            //             // $("#popup").show();
            //             // overlay.setPosition(coordinate);

            //             openDetailPopupCall(1);

            //             break;
            //         case DATA_TYPE.ENTRC:
            //             var link = URLs.entrclink;
            //             //건물일련번호
            //             var BUL_MAN_NO = feature.get("BUL_MAN_NO");
            //             //건물번호판일련번호
            //             var BUL_NMT_NO = feature.get("BUL_NMT_NO");
            //             //시군구코드
            //             var SIG_CD = feature.get("SIG_CD");

            //             var sendParam = {
            //                 // svcNm: 'sEntrc',
            //                 // mode : "11",
            //                 bulNmtNo : BUL_NMT_NO,
            //                 sn: BUL_MAN_NO,
            //                 sigCd: SIG_CD,
            //                 workId: app.info.opeId
            //             };

            //             var url = URLs.postURL(link, sendParam);

            //             util.showProgress();
            //             util.postAJAX({}, url)
            //                 .then(function(context, rCode, results) {
            //                     util.dismissProgress();

            //                     //통신오류처리
            //                     if (rCode != 0 || results.response.status < 0) {
            //                         navigator.notification.alert(msg.callCenter, '', '알림', '확인');
            //                         util.dismissProgress();
            //                         return;
            //                     }

            //                     var data = results.data;

            //                     var gbn = commonP.format("gbn", "[{0}]".format("건물번호판"));
            //                     //건물번호판 일련번호
            //                     var BUL_NMT_NO = feature.get("BUL_NMT_NO");
            //                     //건물일련번호
            //                     var BUL_MAN_NO = feature.get("BUL_MAN_NO");

            //                     //근거리 사진건수
            //                     // var CNT_M_FILES = feature.get("CNT_M_FILES");
            //                     var CNT_M_FILES = data.cntMFiles;
            //                     //원거리 사진건수
            //                     // var CNT_L_FILES = feature.get("CNT_L_FILES");
            //                     var CNT_L_FILES = data.cntLFiles;

            //                     //설치상태
            //                     // var DEL_STT_CD = feature.get("DEL_STT_CD");
            //                     var DEL_STT_CD = data.delStateCd;
            //                     var delStateCdLbl = data.delStateCdLbl;
            //                     //점검상태
            //                     var rcSttCdLbl = data.rcSttCdLbl;
            //                     var rcsttCdClass = "info";
            //                     if(rcSttCdLbl == null){
            //                         rcSttCdLbl = "미점검";
            //                         rcsttCdClass = "info redText";
            //                     }

            //                     var text0 = commonSpan.format("info", "설치상태 : " + delStateCdLbl);
            //                     var text1 = commonSpan.format(rcsttCdClass, "점검상태 : " + rcSttCdLbl);
            //                     var text2 = commonSpan.format("info", "원거리사진 : " + CNT_L_FILES);
            //                     var text3 = commonSpan.format("info", "근거리사진 : " + CNT_M_FILES);

            //                     //설치 건물명
            //                     var rnCdLbl = data.rnCdLbl;
            //                     //설치 건물본번
            //                     var buldMnnm = data.buldMnnm;
            //                     //설치 건물부번
            //                     var buldSlno = data.buldSlno;
                                
            //                     var titleTxt = "{0} {1}{2}".format(
            //                         (data.rnCdLbl ? data.rnCdLbl : ''),
            //                         (data.buldMnnm ? data.buldMnnm : ''),
            //                         (data.buldSlno == '0' ? '' : '-' + data.buldSlno)
            //                     )

            //                     if(rnCdLbl == null && rnCdLbl == ""){
            //                         titleTxt = "설치건물명 없음";
            //                     }
            //                     //제목창
            //                     var title = '';
                                
            //                     title = commonP.format("localTitle",titleTxt);
                                
            //                     var button1 = "" ;

            //                     var mtchRcrSn = data.rcrSn;
            //                     var nowRcrSn = app.info.rcrSn;
            //                     //설치상태 정상 근거리 원거리 사진 1개 이상인 경우 점검가능
            //                     if(DEL_STT_CD == "01" && CNT_M_FILES > 0 && CNT_L_FILES > 0 && (mtchRcrSn == null || mtchRcrSn == nowRcrSn)){
            //                         button1 = commonButton.format("ui-btn ui-corner-all ui-shadow btnPossible",'insertResearchForPopup('+index+')',"정상점검");
            //                     }
                                
            //                     strHtml = gbn
            //                     strHtml += title
            //                     strHtml += commonP.format("", text0);
            //                     strHtml += commonP.format("", text1);
            //                     strHtml += commonP.format("", text2 + text3);

            //                     resultHtml = popDiv.format("", "openDetailPopupCall("+index+")", strHtml);

            //                     buttonHtml = buttonForm.format("more", "openDetailPopupCall("+index+")", "image/more.png", "더보기");

            //                     resultHtml += commonDiv.format("mapAdd", buttonHtml);
                                
            //                     resultHtml += button1;

            //                     resultHtml = commonDiv.format("mapInfo", resultHtml);

            //                     popupDiv.append(resultHtml);

            //                     $("#popup").show();
            //                     overlay.setPosition(coordinate);

            //                     resultHtml = commonP.format("infoLine", "");
            //                     popupDiv.append(resultHtml);

            //                 }, msg.alert);
            //             break;

            //         case DATA_TYPE.SPPN:
            //             resultHtml = "";
            //             strHtml = "";
            //             buttonHtml = "";
            //             //지점번호_시설물일련번호
            //             var SPO_FCL_SN = feature.get("SPO_FCL_SN");
            //             //지점번호코드
            //             var SPO_NO_CD = feature.get("SPO_NO_CD");
            //             //상세기관명
            //             // var DTOR_NM = feature.get("DTOR_NM");

            //             var gbn = commonP.format("gbn", "[{0}]".format("지점번호판"));
            //             var title = commonP.format("localTitle",SPO_NO_CD);

            //             strHtml += gbn
            //             strHtml += title
            //             // strHtml += commonP.format("",DTOR_NM);

            //             resultHtml += popDiv.format("", "openDetailPopupCall(" + index + ",'" + layerID + "'," + SPO_FCL_SN + ")", strHtml);

            //             //도로시설물 공간정보
            //             var geom = feature.getGeometry().getCoordinates();

            //             buttonHtml += buttonForm.format("more", "openDetailPopupCall(" + index + ",'" + layerID + "'," + SPO_FCL_SN + ")", "image/more.png", "더보기");
            //             // buttonHtml += buttonForm.format("addition", "moveingPoint(" + SPO_NO_CD + "," + geom[0] + "," + geom[1] + "," + index + ")", "image/addtion.png", "이동");

            //             resultHtml += commonDiv.format("mapAdd", buttonHtml);
                        
            //             resultHtml = commonDiv.format("mapInfo", resultHtml);

            //             popupDiv.append(resultHtml);

            //             if(features.length > 1){
            //                 resultHtml = commonP.format("infoLine", "");
            //                 popupDiv.append(resultHtml);
            //             }

            //             $("#popup").show();
            //             overlay.setPosition(coordinate);

            //             break;
            //     }

            // });
        }, { hitTolerance: 3 }); // Hit-detection tolerance in pixels

        event.preventDefault();
    });
    // 선택 이벤트 정의()(--end--)

    // 지도 변경시 핸들러 정의(--start--)
    map.getView().on('propertychange', function(event) {
        switch (event.key) {
            case 'resolution':
                var mapRS = map.getView().getResolution();
                // var useLayers = map.getLayers().getArray();
                var mapZoom = map.getView().getZoom();
                //심볼표시 레벨설정
                var maxResolution = JSON.parse(localStorage["maxResolution"]);

                if(mapRS >= maxResolution.spgf && mapRS >= maxResolution.buld){
                    util.toast('심볼조회가 가능한 지도 레벨을<br/>초과하였습니다. 확대해 주세요.');
                    return;
                }else if(mapRS >= maxResolution.spgf){
                    util.toast('도로안내시설 조회 지도 레벨을<br/>초과하였습니다. 확대해 주세요.');
                    return;
                }else if(mapRS >= maxResolution.buld){
                    util.toast('건물번호판 조회 지도 레벨을<br/>초과하였습니다. 확대해 주세요.');
                    return;
                }

                // for (var i in useLayers) {
                
                //     if (mapRS >= useLayers[i].getMaxResolution()) {

                //         if (id == DATA_TYPE.LOC) {
                //             $('.legend .rdpq .total').text('0건');
                //             $('.legend .area .total').text('0건');
                //             $('.legend .bsis .total').text('0건');
                //             $('.legend .spot .total').text('0건');
                //             $('.legend .rdpqW .total').text('0건');
                //             $('.legend .areaW .total').text('0건');
                //             $('.legend .bsisW .total').text('0건');
                            
                //         }else if(id == DATA_TYPE.ENTRC){
                //             $('.legend .entrc .total').text('0건');
                //             util.toast('건물번호판 조회 가능한 지도레벨이 <br/>아닙니다. 확대해 주세요.');
                //         }
                //         if (id == DATA_TYPE.BULD) {
                //             util.toast('건물정보를 조회 가능한 지도레벨이 아닙니다. 확대해 주세요.');
                //         }

                //     }
                // }
                
                

                if(mapZoom == 10){
                    if (maxResolution.spgf == 4) {
                        util.toast(msg.maxResolutionWarning,'warning');
                    }
                }else if(mapZoom == 12){
                    if (maxResolution.buld == 1) {
                        util.toast(msg.maxResolutionWarning,'warning');
                    }
                }
                
                break;
        }
    });

    // FeatureInfo 정보 팝업 닫기 핸들러 정의(--start--)
    var popupCloser = function(event) {
        overlay.setPosition(undefined);
        $("#popup-closer").blur();
        event.preventDefault();
    };
    $("#popup-closer").on("click", popupCloser);
    // FeatureInfo 정보 팝업 닫기 핸들러 정의(--end--)

    var ori = true;
    var watchID;
    $("#map_cordova").on("click", function() {
        console.log('map_cordova');
        //html5
        //getCurrentLocation(locationCallback);

        if (ori) {
            //기기 방향값 얻기 이벤트
            // window.addEventListener("deviceorientation", handleOrientation, true);

            watchID = navigator.compass.watchHeading(onSuccessHeading, onError, options);
            ori = false;
        } else {
            //window.removeEventListener("deviceorientation", handleOrientation, true);
            navigator.compass.clearWatch(watchID);
            map.getView().setRotation(0);
            ori = true;
        }

    });

    // Geolocation Control
    var geolocation = new ol.Geolocation( /** @type {olx.GeolocationOptions} */ ({
        //tracking: true,
        projection: map.getView().getProjection(),
        trackingOptions: {
            maximumAge: 10000,
            enableHighAccuracy: true,
            timeout: 600000
        }
    }));


    var accuracyFeature = new ol.Feature();
    geolocation.on('change:accuracyGeometry', function() {
        accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
    });

    var positionFeature = new ol.Feature();
    positionFeature.setStyle(new ol.style.Style({
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#3399CC'
            }),
            stroke: new ol.style.Stroke({
                color: '#fff',
                width: 2
            })
        })
    }));


    var cnt = 0;
    geolocation.on('change:position', function() {
        console.log('change:position');
        var coordinates = geolocation.getPosition();
        positionFeature.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);

        console.log('coord ' + coordinates);
        var html = [
            ++cnt + ' Position: ' + coordinates
        ].join('<br />');
        document.getElementById('info').innerHTML = html;

        map.getView().setCenter(coordinates);

    });

    var geolocation_source = new ol.source.Vector({});

    var geolocation_layer = new ol.layer.Vector({
        map: map,
        source: geolocation_source
    });

    geolocation.on('error', function() {
        alert('geolocation error');
        // FIXME we should remove the coordinates in positions
    });

    var isCheck = true;
    $("#map_current").click(function() {
        if (isCheck) {
            geolocation.setTracking(true);
            var coordinates = geolocation.getPosition();
            geolocation_source.addFeature(accuracyFeature);
            geolocation_source.addFeature(positionFeature);
            isCheck = false;
            console.log('isCheck ' + isCheck);

            //기기 방향값 얻기 이벤트
            // window.addEventListener("deviceorientation", handleOrientation, true);

            //map.on('postcompose', updateView);
            map.render();
        } else {
            geolocation.setTracking(false);
            geolocation_source.removeFeature(accuracyFeature);
            geolocation_source.removeFeature(positionFeature);
            // map.getView().setRotation(0);
            isCheck = true;
            console.log('isCheck ' + isCheck);

        }
    });
    /** 위치이동 레이어 end */
    /*********** 지도 화면 핸들러 (-- end --) ***********/

    setTimeout(function() {
        def.resolve(true);
    }, 300);
    return def.promise();
};
// 지도 초기화 함수(--end--)

var getSource = function(layer) {
    if (layer.getSource) {
        return getSource(layer.getSource());
    } else {
        if (layer instanceof ol.source.Vector)
            return layer;
        return;
    }
};

var getVectorSource = function(mapObj, name) {
    var source;
    mapObj.getLayers().forEach(function(item, index) {
        if (item instanceof ol.layer.Vector && item.get("title") == name)
            source = getSource(item);
    });

    return source;
};


var getFeatureLayer = function(options) {
    var vectorSource = new ol.source.Vector({
        id: "vectorSource:" + options.typeName,
        format: new ol.format.WFS(),
        loader: function(extent, resolution, projection) {
            extent = ol.proj.transformExtent(extent, baseProjection.getCode(), sourceProjection.getCode());
            var param = {
                SERVICE: 'WFS',
                VERSION: '1.1.0',
                REQUEST: 'GetFeature',
                bbox: extent.join(','),
                srsName: serviceProjection.getCode(),
                typeName: options.typeName
            };

            var urldata = URLs.postURL(URLs.mapServiceLink, param);
            // util.toast("지도요청시작","success");
            // alert(JSONtoString(urldata));
            util.showProgress();
            util.postAJAX('', urldata, true)
                .then(function(context, rCode, results) {

                    //통신오류처리
                    if (rCode != 0) {
                        navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                        util.dismissProgress();
                        return;
                    }
                
                    //엔진오류시 메세지 처리
                    if(results.indexOf("Can not connect to server") != -1){
                        // navigator.notification.alert(msg.errorGeoEngine, '', '알림', '확인');
                        util.toast(msg.errorGeoEngine, "error");
                        util.dismissProgress();
                        return;
                    }

                    //레이어서비스 에러
                    if(results.indexOf("Not Service Table") != -1){
                        // navigator.notification.alert(msg.errorLoadLayer, '', '알림', '확인');
                        util.toast(msg.errorLoadLayer, "error");
                        util.dismissProgress();
                        return;
                    }
                    
                    var features = new ol.format.WFS().readFeatures(results, { featureProjection: baseProjection.getCode(), dataProjection: sourceProjection.getCode() });

                    var rdpqCnt = 0;
                    var areaCnt = 0;
                    var bsisCnt = 0;
                    var spotCnt = 0;
                    var rdpqWCnt = 0;
                    var areaWCnt = 0;
                    var bsisWCnt = 0;

                    var entrcCnt = 0;
                    var lntrvlCnt = 0;

                    var layerType = options.typeName;
                    for (var i = 0; features.length > i; i++) {
                        if(layerType == "tl_sppn_paninfo"){
                        
                            var SPO_NO_CD = features[i].get("SPO_NO_CD");
                            if(SPO_NO_CD){
                                spotCnt++;
                            }

                            $('.legend .spot .total').text(spotCnt + '건');
                        }else if(layerType == "tlv_spbd_entrc_skm"){
                            entrcCnt++;
                            $('.legend .entrc .total').text(entrcCnt + '건');
                        }else if(layerType == "tlv_spgf_loc_skm"){
                            for (var i = 0; features.length > i; i++) {
                                var rdGdftySe = features[i].get("RD_GDFTY_SE");
                                //설치유형(벽면형 : 00002)
                                var instlSe = features[i].get('INSTL_SE');
                                var useTarget = features[i].get('USE_TRGET');
                                if (rdGdftySe == "110") {
                                    if(instlSe == "00002" && useTarget == "01000"){
                                        rdpqWCnt++;
                                    }else{
                                        rdpqCnt++;
                                    }
                                }else if(rdGdftySe == "210" || rdGdftySe == "310"){
                                    rdpqCnt++;
                                }else if (rdGdftySe == "510") {
                                    areaCnt++;
                                } else if (rdGdftySe == "610") {
                                    bsisCnt++;
                                }
                            }

                            $('.legend .rdpq .total').text(rdpqCnt + '건');
                            $('.legend .area .total').text(areaCnt + '건');
                            $('.legend .bsis .total').text(bsisCnt + '건');
                            $('.legend .rdpqW .total').text(rdpqWCnt + '건');
                            // $('.legend .areaW .total').text(areaWCnt + '건');
                            // $('.legend .bsisW .total').text(bsisWCnt + '건');
                        }else if(layerType == "tl_sprd_intrvl"){
                            lntrvlCnt++;
                            $('.legend .intrvl .total').text(lntrvlCnt + '건');
                        }
                    }

                    // for(var i = 0 ; features.length > i ; i++){
                    //     var fid = features[i].id_;
                    //     if(fid == 'tlv_spgf_loc_skm.8143'){
                    //         var LABEL = features[i].get('LABEL');
                    //         var LT_CHC_YN = features[i].get('LT_CHC_YN');
                    //         var RDFTYLC_SN = features[i].get('RDFTYLC_SN');
                    //         var RD_GDFTY_SE = features[i].get('RD_GDFTY_SE');
                    //         var SIG_CD = features[i].get('SIG_CD');
                    //         console.log('위치일련번호 '+RDFTYLC_SN+' 의 최종변경 상태 < ' + LT_CHC_YN + ' >');
                    //     }
                    // }

                    // console.log("({2}) The number of features viewed is {0}. extent({1})".format(features.length, extent.join(','), options.typeName));
                    // util.toast(options.typeName + " : " + features.length + "건")
                    // util.toast("레이어표출완료","success");
                    //피처 추가시 기존피처는 변경하지 않음

                    // if(options.typeName == "tlv_spgf_loc_skm"){
                    //     vectorSource.clear();
                    // }
                    vectorSource.addFeatures(features);
                    //피처 추가 후 리플레시 기능(건수 표현때문에 추가.. 확실치 않음)
                    map.changed();
                    util.dismissProgress();
                }, function(context, xhr, error) {
                    console.log("조회 error >> " + error + '   ' + xhr);
                    util.toast("레이어표출에러","success");
                    // alert(JSONtoString(error));
                    // alert(JSONtoString(xhr));
                    util.dismissProgress();
                });
            if (options.viewProgress != undefined && !options.viewProgress)
                util.dismissProgress();
        },
        strategy: ol.loadingstrategy.bbox,
    });

    var source;

    if (options.cluster) {
        source =
            new ol.source.Cluster({
                distance: options.cluster.distance,
                geometryFunction: function(feature) {
                    if (feature.getGeometry().getType() == "Polygon")
                        return feature.getGeometry().getInteriorPoint();
                    else
                        return feature.getGeometry();
                },
                source: vectorSource
            });
    } else {
        source = vectorSource;
    }

    // 벡터 레이어 생성
    var vectorOptions = {
        id: options.dataType,
        title: options.title,
        maxResolution: options.maxResolution,
        source: source,
        renderMode: options.renderMode,
        // renderBuffer: 50
    }
    vectorOptions.style = function(feature, resolution) {
        return defaultStyle(feature, resolution, options);
    }

    return new ol.layer.Vector(vectorOptions);
};



var getCurrentLocation = function(callback_func) {
    console.log('getCurrentLocation');
    var geolocationOptions = {
        maximumAge: 0,
        timeout: 8000,
        enableHighAccuracy: true
    };

    util.showProgress();

    navigator.geolocation.getCurrentPosition(
        function(position) {

            util.dismissProgress();
            if (callback_func != undefined) {
                callback_func(position);
            }
        },
        function(error) {
            util.dismissProgress();

            // PositionError.PERMISSION_DENIED = 1;
            // PositionError.POSITION_UNAVAILABLE = 2;
            // PositionError.TIMEOUT = 3;
            var fn_msg = function() {};

            if (error.code == 1) {
                if (isAndroid()) {
                    navigator.notification.alert('위치 정보를 사용하려면 위치 서비스 권한을 허용해 주세요.', fn_msg, '위치 서비스 사용 설정', '확인');
                } else {
                    navigator.notification.alert('위치정보를 사용하려면, 단말기의 ‘설정 > 개인 정보 보호’에서 위치서비스를 켜주세요.', fn_msg, '위치 서비스 사용 설정', '확인');
                }
            } else if (error.code == 2) {
                navigator.notification.alert('위치정보를 사용할 수 없습니다.\n잠시 후에 다시 시도해 주세요.', fn_msg, '위치 서비스 사용 설정', '확인');
            } else if (error.code == 3) {
                navigator.notification.alert("위치 서비스 찾는데 시간을 초과하였습니다. 다시 시도 하십시오.", fn_msg, '알림', '확인');
            }
        },
        geolocationOptions
    );
}


//******************geoloction*************** *

// convert radians to degrees
function radToDeg(rad) {
    return rad * 360 / (Math.PI * 2);
}
// convert degrees to radians
function degToRad(deg) {
    return deg * Math.PI * 2 / 360;
}
// modulo for negative values
function mod(n) {
    return ((n % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
}
//디바이스 위치(사용안함)
function handleOrientation(event) {
    if (window.DeviceOrientationEvent) {
        console.log("DeviceOrientation is supported");
    }
    if (window.DeviceOrientationEvent) {
        console.log("DeviceOrientation is supported");
    }
    var absolute = event.absolute;
    var alpha = event.alpha;
    var beta = event.beta;
    var gamma = event.gamma;

    console.log('absolute ' + absolute);
    console.log('alpha ' + alpha);
    console.log('beta ' + beta);
    console.log('gamma ' + gamma);

    var html = [
        ' absolute: ' + absolute,
        ' alpha: ' + alpha,
        ' beta: ' + beta,
        ' gamma: ' + gamma,
    ].join('<br />');
    document.getElementById('info').innerHTML = html;

    // map.getView().setRotation(alpha);
    var heading = compassHeading(alpha, beta, gamma);
    // var heading = alpha * 0.01745329251;
    map.getView().setRotation(heading);

    // 0.01745329251
    // Math.PI / 180
}

var degtorad = Math.PI / 180; // Degree-to-Radian conversion
//디바이스 좌표 변환 (사용안함)
function compassHeading(alpha, beta, gamma) {

    var _x = beta ? beta * degtorad : 0; // beta value
    var _y = gamma ? gamma * degtorad : 0; // gamma value
    var _z = alpha ? alpha * degtorad : 0; // alpha value

    var cX = Math.cos(_x);
    var cY = Math.cos(_y);
    var cZ = Math.cos(_z);
    var sX = Math.sin(_x);
    var sY = Math.sin(_y);
    var sZ = Math.sin(_z);

    // Calculate Vx and Vy components
    var Vx = -cZ * sY - sZ * sX * cY;
    var Vy = -sZ * sY + cZ * sX * cY;

    // Calculate compass heading
    var compassHeading = Math.atan(Vx / Vy);

    // Convert compass heading to use whole unit circle
    if (Vy < 0) {
        compassHeading += Math.PI;
    } else if (Vx < 0) {
        compassHeading += 2 * Math.PI;
    }

    // return compassHeading * (180 / Math.PI); // Compass Heading (in degrees)
    return compassHeading;

}
//코르도바 heading 성공 함수
function onSuccessHeading(heading) {

    var html = [
        ' heading: ' + heading.magneticHeading
    ].join('<br />');
    document.getElementById('info').innerHTML = html;

    map.getView().setRotation(-heading.magneticHeading * 0.01745329251);

    // 0.01745329251
    // Math.PI / 180
};
//코르도바 heading 실패 함수
function onError(compassError) {
    alert('Compass error: ' + compassError.code);
};

var options = {
    frequency: 100
}; // Update every 3 seconds


var featureClone;
var featureIndex;
// var layerID = "";
var clickPoint;
//좌표이동
function moveingPoint(sn, pointX, pointY, index) {
    // console.log(sn);
    // console.log(pointX + " , " + pointY);
    localStorage["moveTrgSn"] = sn ;

    $("#moveInfo").show();

    var zoom = map.getView().getZoom();
    if (zoom < 14) {
        map.getView().setZoom(14);
        map.getView().setCenter([pointX, pointY]);
    }

    featureIndex = index;

    //팝업닫기
    $("#popup").hide();

    //기본레이어 삭제
    // map.removeLayer(layers.loc);
    // map.removeLayer(layers.rdpq);
    // map.removeLayer(layers.bsis);
    // map.removeLayer(layers.area);

    var movingPoint_source = addMoveLayer();
    // /** 위치이동 레이어 start */
    // var movingPoint_source = new ol.source.Vector({});

    // var moveingPoint_layer = new ol.layer.Vector({
    //     map: map,
    //     title : '위치이동',
    //     source: movingPoint_source
    // });

    // map.addLayer(moveingPoint_layer);
    // layers.move = moveingPoint_layer;

    var moveingPointFeature = new ol.Feature();
    moveingPointFeature.setStyle(new ol.style.Style({
        image: new ol.style.Circle({
            radius: 10,
            fill: new ol.style.Fill({
                color: '#00004d'
            }),
            stroke: new ol.style.Stroke({
                color: '#fff',
                width: 2
            })
        })
    }));


    var oldPoint = new ol.geom.Point([pointX, pointY]);

    moveingPointFeature.setGeometry(oldPoint);
    movingPoint_source.addFeature(moveingPointFeature);

}

function insertMoveingPoint(param) {

    var trgGbn = param.trgGbn;
    
    var link = URLs.moveingPointSpgf;
    if(trgGbn != "02"){
        link = URLs.moveingPointSpgf;
    }else if(trgGbn == "02"){
        link = URLs.moveingPointSpbdNmtg;
    }

    var sendParam = $.extend(param, {
        // svcNm: 'iSPGF',
        sigCd: app.info.sigCd,
        workId: app.info.opeId
    });;

    var url = URLs.postURL(link, sendParam);

    util.showProgress();
    util.postAJAX({}, url)
        .then(function(context, rCode, results) {
                util.dismissProgress();
                try {
                    if (rCode == 0 && results.response.status > -1) {
                        util.toast('이동한 위치 정보가 저장되었습니다.');
                        var msgText = msg.successSpgfInsertPoint;
                        
                        if(trgGbn == "02"){
                            msgText = msg.successNmtgInsertPoint;
                        }
                        
                        navigator.notification.alert(msgText, '', '알림', '확인');
    
                        clearSource('위치이동');
    
                        map.removeLayer(layers.move);
                        $("#popup").hide();
    
                        var context = app.context;
    
                        // if (util.isEmpty(context)){
                        //     map.updateSize();
                        //     return;
                        // }
    
                        layerToggle(context);
                        // if (layerID != DATA_TYPE.BULD || layerID != DATA_TYPE.ENTRC) {
                        //     $(".legend").toggle(true);
                        //     map.removeLayer(layers.buld);
                        //     // map.removeLayer(layers.entrc);
                        //     map.addLayer(layers.rdpq);
                        //     map.addLayer(layers.bsis);
                        //     map.addLayer(layers.area);
                        // } else {
                        //     $(".legend").toggle(false);
                        //     map.removeLayer(layers.rdpq);
                        //     map.removeLayer(layers.bsis);
                        //     map.removeLayer(layers.area);
                        //     map.addLayer(layers.buld);
                        //     // map.addLayer(layers.entrc);
                        // }
                    } else {
                        navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                        util.dismissProgress();
                        return;
                    }
                } catch (error) {
                    navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                    util.dismissProgress();
                }
                

            },
            msg.alert
        );
}

function clearMoveMode() {
    navigator.notification.confirm("위치 이동을 취소 하시겠습니까?", cancelMove, "알림", ['예', '아니오']);
}

function cancelMove(btnIndex) {
    if (btnIndex == 1) {
        layerClear();
        $("#popup").hide();
    }
}

function layerClear() {
    var layerList = map.getLayers().getArray();
    for (var i = 0; i < layerList.length; i++) {
        if (layerList[i].get('title') == '위치이동') {
            var movingPoint_source = layerList[i].getSource();

            movingPoint_source.clear();
            // map.removeLayer(layers.move);

        }
    }
    var context = app.context;
    layerToggle(context);
    // if (layerID != DATA_TYPE.BULD|| layerID != DATA_TYPE.ENTRC) {
    //     map.removeLayer(layers.buld);
    //     map.removeLayer(layers.entrc);
    //     map.addLayer(layers.rdpq);
    //     map.addLayer(layers.bsis);
    //     map.addLayer(layers.area);
    // } else {
    //     map.removeLayer(layers.rdpq);
    //     map.removeLayer(layers.bsis);
    //     map.removeLayer(layers.area);
    //     map.addLayer(layers.buld);
    //     map.addLayer(layers.entrc);
    // }

}


//상세정보 열기
var trgSnGlobal;

function openDetailPopupCall(index, layer, sn, rdGdftySe) {
    trgSnGlobal = sn;
    // $("#popup").hide();

    // if (layerID == DATA_TYPE.BULD) {
    //     if (index == 0) {
    //         MapUtil.openDetail(DATA_TYPE.BULD, featureClone[0]);
    //     } else if(index == 1) {
    //         MapUtil.openDetail(DATA_TYPE.ENTRC, featureClone[0]);
    //     } else{
    //         MapUtil.openDetail(DATA_TYPE.ADRDC, featureClone[0]);
    //     }

    // }else if(layerID == DATA_TYPE.ENTRC){
    //     featureIndex = index;
    //     MapUtil.openDetail(DATA_TYPE.ENTRC, featureClone[index]);
    // }else {
        featureIndex = index;
        MapUtil.openDetail(layer, sn, rdGdftySe);

    // }


    // util.camera = function() {
    //     var title = "{0} {1}-{2}".format(featureClone[index].get('FT_KOR_RN'), featureClone[index].get('BSIS_MNNM'), featureClone[index].get('BSIS_SLNO'));
    //     util.slide_page('up', pages.detailview, { sn : featureClone[index].get('RD_GDFTY_SN'), categoryid: "roadsign", title: title});
    // };


}

function setCodeValue(feature, colume) {

    // var popTableP = "<p>{0} : {1}</p>";

    var codeValue = feature.get(colume);
    var codeList = app.codeMaster[CODE_GROUP[colume]];
    var label = codeList[codeValue];

    if (label == undefined) {
        label = "미등록";
    }

    return label;

}

function baseNumberMix(mn, sn) {
    var baseNum = "";
    baseNum += mn;
    if (sn != 0) {
        baseNum += "-";
        baseNum += sn;
    }

    return baseNum;
}

function moveToXy(x, y) {
    var cood = [x, y];
    setPosition(cood)
    map.getView().setCenter(cood);

    // var zoom = map.getView().getZoom();
    // if (zoom < 14) {
    //     map.getView().setZoom(14);
    // }
    // map.updateSize();

    // util.toast("이동완료","success");
}



function setPosition(coordinates) {

    var geolocation_source = currentPositionLayerCheck();

    var positionFeature = new ol.Feature();
    // positionFeature.setStyle(new ol.style.Style({
    //     image: new ol.style.Circle({
    //         radius: 10,
    //         fill: new ol.style.Fill({
    //             color: 'red'
    //         }),
    //         stroke: new ol.style.Stroke({
    //             color: '#fff',
    //             width: 2
    //         })
    //     })
    // }));

    positionFeature.setStyle(new ol.style.Style({
        image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
            // anchor: [0.45, 35],
            // anchorXUnits: 'fraction',
            // anchorYUnits: 'pixels',
            src: 'image/currentPos1.png'
        }))
    }));




    geolocation_source.addFeature(positionFeature);

    positionFeature.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);
    map.getView().setCenter(coordinates);
}

function currentPositionLayerCheck() {
    var layerList = map.getLayers().getArray();
    var gbn = false;

    var geolocation_source;


    for (var i = 0; i < layerList.length; i++) {

        if (layerList[i].get('title') == '현위치') {

            geolocation_source = layerList[i].getSource();

            geolocation_source.clear();

            gbn = true;
        }
    }


    if (!gbn) {
        geolocation_source = new ol.source.Vector({});

        var geolocation_layer = new ol.layer.Vector({
            map: map,
            title: '현위치',
            source: geolocation_source
        });

        map.addLayer(geolocation_layer);

    }

    return geolocation_source;
}

$(document).on("pagecreate", pages.map.div, function() {
    
    $("#autocomplete").on("filterablebeforefilter", function(e, data) {        
        var $ul = $(this),
                      $input = $(data.input),
                      value = $input.val().trim(),
                      html = "";        
        $ul.html("");
        
        if (value && value.length > 2) {          
            
            var koreanList = ["ㄱ","ㄴ","ㄷ","ㄹ","ㅁ","ㅂ","ㅅ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
            for(var i in koreanList ){
                if(value.charAt(value.length - 1) == koreanList[i]){
                    return;
                }            
            }

            $ul.html("<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>");          
            $ul.listview("refresh");          
            $.ajax({
                type: 'POST',
                            url: "http://www.juso.go.kr/link/mobileSearch.do",
                            dataType: "xml",
                            data: {
                    countPerPage: 7,
                    currentPage: 1,
                    keyword: app.info.sigNm + " " + value // 해당지역 검색을 위하여 시군구명 포함
                                   
                }          
            })          .then(function(xml) {
                var totalCount = $(xml).find("results").find("totalCount").text();

                if(totalCount > 0){
                    $.each($(xml).find("juso"), function(i, val) {
                        var label = "<span id='rnAddr'>{0} {1}{2}{3}</span><br><span id='jbAddr'>{4} {5} {6} {7}{8}</span>"
                        // var label = "<span id='rnAddr'>{0} {1}{2}{3}</span><br><span id='jbAddr'>{4}</span>"
                        .format(
                            $(this).find("rn").text(),
                            $(this).find("buldMnnm").text(),
                            util.isEmpty($(this).find("buldSlno").text()) ? "" : "-{0}".format($(this).find("buldSlno").text()),
                            util.isEmpty($(this).find("bdNm").text()) ? "" : "({0})".format($(this).find("bdNm").text()),
                            // $(this).find("relJibun").text()
                            $(this).find("siNm").text(),
                            $(this).find("sggNm").text(),
                            $(this).find("emdNm").text(),
                            $(this).find("lnbrMnnm").text(),
                            util.isEmpty($(this).find("lnbrSlno").text()) ? "" : "-{0}".format($(this).find("lnbrSlno").text())
                        );
                        var xy = decrypt($(this).find("nX").text(), $(this).find("nY").text());
                        var jsCmd = "javascript:moveToXy({0},{1})".format(xy[0], xy[1]);              
                        html += "<li class='icon' onclick=\"" + jsCmd + "\">" + label + "</li>";            
                    });            
                    $ul.html(html);            
                    $ul.listview("refresh");            
                    $ul.trigger("updatelayout");

                }else{
                    var label = "<span id='rnAddr' class='noResult'>결과가 없습니다.</span>";
                    html += "<li class='noIcon'>" + label + "</li>";

                    $ul.html(html);            
                    $ul.listview("refresh");            
                    $ul.trigger("updatelayout");            
                    $("#autocomplete .noIcon").removeClass("ui-screen-hidden");
                }  
                     
            });        
        }    
    });

    $("#autocomplete").on("click", "li", function() {
        /* selected option */
        var text = $("a", this).text();
        /* update input with selected option */
        $("#autocomplete-input").val(text);
        /* hide all options */
        $(this).siblings().addBack().addClass("ui-screen-hidden");
    });
});

function autocompleteRd(){
    // $("#autocomplete").on("filterablebeforefilter", function(e, data) {        
        var $ul = $("#autocomplete"),
                      $input = $("#autocomplete-input"),
                      value = $input.val().trim(),
                      html = "";        
        $ul.html("");        
        if (value && value.length > 2) {          
            $ul.html("<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>");          
            $ul.listview("refresh");          
            $.ajax({
                type: 'POST',
                            url: "http://www.juso.go.kr/link/mobileSearch.do",
                            dataType: "xml",
                            data: {
                    countPerPage: 7,
                    currentPage: 1,
                    keyword: app.info.sigNm + " " + regExpCheckJuso(value) // 해당지역 검색을 위하여 시군구명 포함
                                   
                }          
            })          .then(function(xml) {
                var totalCount = $(xml).find("results").find("totalCount").text();

                if(totalCount > 0){
                    $.each($(xml).find("juso"), function(i, val) {
                        var label = "<span id='rnAddr'>{0} {1}{2}{3}</span><br><span id='jbAddr'>{4} {5} {6} {7}{8}</span>"
                        .format(
                            $(this).find("rn").text(),
                            $(this).find("buldMnnm").text(),
                            util.isEmpty($(this).find("buldSlno").text()) ? "" : "-{0}".format($(this).find("buldSlno").text()),
                            util.isEmpty($(this).find("bdNm").text()) ? "" : "({0})".format($(this).find("bdNm").text()),
                            $(this).find("siNm").text(),
                            $(this).find("sggNm").text(),
                            $(this).find("emdNm").text(),
                            $(this).find("lnbrMnnm").text(),
                            util.isEmpty($(this).find("lnbrSlno").text()) ? "" : "-{0}".format($(this).find("lnbrSlno").text())
                        );
                        var xy = decrypt($(this).find("nX").text(), $(this).find("nY").text());
                        var jsCmd = "javascript:moveToXy({0},{1})".format(xy[0], xy[1]);              
                        html += "<li class='icon' onclick=\"" + jsCmd + "\">" + label + "</li>";            
                    });            
                    $ul.html(html);            
                    $ul.listview("refresh");            
                    $ul.trigger("updatelayout");       
                    
                }else{
                    var label = "<span id='rnAddr' class='noResult'>결과가 없습니다.</span>";
                    html += "<li class='noIcon'>" + label + "</li>";

                    $ul.html(html);            
                    $ul.listview("refresh");            
                    $ul.trigger("updatelayout");            
                    $("#autocomplete .noIcon").removeClass("ui-screen-hidden");
                }   
                // util.toast("검색완료","success");
                     
            },function(context, xhr, error) {
                    console.log("조회 error >> " + error + '   ' + xhr);
                    util.toast("검색에러","error");
                    // alert(JSONtoString(error));
                    // alert(JSONtoString(xhr));
                    util.dismissProgress();
            });        
        }
        $("#autocomplete-input").val(regExpCheckJuso(value));    
    // });
}

/** 위치이동 레이어 추가 */
function addMoveLayer() {

    var movingPoint_source = new ol.source.Vector({});

    var moveingPoint_layer = new ol.layer.Vector({
        map: map,
        title: '위치이동',
        source: movingPoint_source
    });

    map.addLayer(moveingPoint_layer);
    layers.move = moveingPoint_layer;

    return movingPoint_source;
}
/** 메모창 띄우기 */
function showNewPosMemo() {
    wrapWindowByMask('memoMask');
    $("#newPosMemo").show();
}

function closeNewPosMemo() {
    $("#newPosMemoText").val('');
    $("#newPosMemo").hide();
    $("#memoMask").hide();
}

function closePopup(id){
    $("#"+id).hide();
}

/** 새위치등록 입력 */
function insertNewPos() {
    
    navigator.notification.confirm(msg.insertPos, function(btnIndex) {
        if (btnIndex == 1) {
            var param = "";
            var coordinate = map.getView().getCenter();

            var centerPoint = new ol.proj.transform(coordinate, baseProjection, sourceProjection);

            var newPosTrgGbn = $("#newPosTrgGbn").val();

            param = $.extend({}, {
                // sn : RDFTYLC_SN,
                // rdftySe : RDFTY_SE,
                posX: centerPoint[0],
                posY: centerPoint[1],
                memo: $("#newPosMemoText").val(),
                jobSeCd: 'N',
                trgGbn : newPosTrgGbn
            });

            insertMoveingPoint(param);

            cancleNewPos();
        }
    }, "알림", ["확인", "취소"]);
}

/** 새위치등록 div 취소 */
function cancleNewPos() {
    // clearSource('위치이동');

    var context = app.context;

    layerToggle(context);

    // $(".newPosition").click();
    newPoint(insertPointType);
}

/** 위치이동 마커 삭제 */
function clearSource(title) {
    var layerList = map.getLayers().getArray();
    for (var i = 0; i < layerList.length; i++) {
        if (layerList[i].get('title') == title) {
            var movingPoint_source = layerList[i].getSource();
            movingPoint_source.clear();
        }
    }
}

//지도 간략정보 표시
function selectFeatureInfo(features,popIndex){
    try {
        var coordinate = clickPoint;
        // var layerID = DATA_TYPE.LOC;
        //레이어 id 확인
        // var layerList = map.getLayers().getArray();
        // for (var i = 0; i < layerList.length; i++) {
        //     if (layerList[i].get('title') == '위치레이어') {
        //         layerID = DATA_TYPE.LOC;
        //     }else if(layerList[i].get('title') == '출입구'){
        //         layerID = DATA_TYPE.ENTRC;
        //     }
        // }
        //레이어 id 확인 190522(엔진사용)
        // for(var i in features){
        //     var layerType = features[i].getId().split('.')[0];
        //     if(layerType == "tlv_spbd_entrc_skm" || layerType == "tn_spbd_nmtg"){
        //         layerID = DATA_TYPE.ENTRC;
        //     }else if(layerType == "tlv_spgf_loc_skm" || layerType == "tl_spgf_loc"){
        //         layerID = DATA_TYPE.LOC;
        //     }
        // }
        // for(var i in features){
        //     var layerType = features[i].get('type');
        //     if(layerType == "tlv_spbd_entrc_skm" || layerType == "tlv_spbd_entrc_pos_skm"){
        //         layerID = DATA_TYPE.ENTRC;
        //     }else if(layerType == "tlv_spgf_loc_skm" || layerType == "tlv_spgf_loc_pos_skm"){
        //         layerID = DATA_TYPE.LOC;
        //     }
        // }


        var resultHtml = "";
        var buttonHtml = "";
        var strHtml = "";

        var layerList = map.getLayers().getArray();
        var popupDiv = $("#popup-content");
        var commonDiv = "<div class='{0}'>{1}</div>";
        var commonP = "<p class='{0}'>{1}</p>";
        var commonSpan = "<span class='{0}'>{1}</span>";
        var commonButton = "<button class='{0}'onclick='{1}'>{2}</button>"


        var popDiv = "<div class='{0}' onclick =\"{1}\">{2}</div>"
        var popTableP = "<p>{0} : {1}</p>";
        var buttonForm = "<span class = {0} onclick=\"{1}\"><img src='{2}' title='{3}'></span>";
        var buttonForm2 = "<span class = {0} onclick='{1}'>{2}</span>";

        var overlay = map.getOverlayById('popup');

        features.forEach(function(feature, index) {
            var layerID;
            if(popIndex){
                index = popIndex;
            }

            if(localStorage['engineUse'] == 'Y'){
                var layerId = feature.id_.split('.')[0];
                if(layerId == "tlv_spbd_entrc_skm"){
                    layerID = DATA_TYPE.ENTRC;
                }else if(layerId == "tlv_spgf_loc_skm"){
                    layerID = DATA_TYPE.LOC;
                }
            }else{
                var layerType = feature.get('type');    
                if(layerType == "tlv_spbd_entrc_pos_skm"){
                    layerID = DATA_TYPE.ENTRC;
                }else if(layerType == "tlv_spgf_loc_pos_skm"){
                    layerID = DATA_TYPE.LOC;
                }
            }
            
            

            switch (layerID) {
                case DATA_TYPE.LOC:
                    var link = URLs.selectLocLink;
                    //도로시설물위치일련번호
                    var RDFTYLC_SN = feature.get("RDFTYLC_SN");

                    var SIG_CD = feature.get("SIG_CD");

                    var sendParam = {
                        // svcNm: 'sLOC',
                        // mode : "11",
                        sn: RDFTYLC_SN,
                        sigCd: SIG_CD,
                        workId: app.info.opeId
                    };

                    var url = URLs.postURL(link, sendParam);

                    util.showProgress();
                    util.postAJAX({}, url)
                        .then(function(context, rCode, results) {
                            util.dismissProgress();

                            //통신오류처리
                            if (rCode != 0 || results.response.status < 0) {
                                navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                                util.dismissProgress();
                                return;
                            }

                            var resultList = results.data;

                            for (var i = 0; resultList.length > i; i++) {
                                strHtml = "";
                                buttonHtml = "";
                                resultHtml = "";

                                var rdGdftySe = resultList[i].rdGdftySe;
                                //울릉군 점검용
                                // var rdGdftySn = resultList[i].rdGdftySn;
                                // var rdFtyLcSn = resultList[i].rdFtyLcSn;

                                // if (rdGdftySe == "110") {
                                if(rdGdftySe == "110" || rdGdftySe == "210" || rdGdftySe == "310"){
                                    layerID = DATA_TYPE.RDPQ;
                                    var instSe = resultList[i].instSe;
                                    var rdGdftySeLbl = resultList[i].rdGdftySeLbl;
                                    var useTarget = resultList[i].useTarget;
                                    if(instSe == '00002' && useTarget == '01000'){
                                        rdGdftySeLbl = rdGdftySeLbl + '(벽)';
                                    }
                                    var gbn = commonP.format("gbn", "[{0}]".format(rdGdftySeLbl));
                                    //제목창
                                    var title = '';
                                    //명판방향
                                    var plqDirection = resultList[i].plqDirection;
                                    //도로명
                                    var frontKoreanRoadNm = resultList[i].frontKoreanRoadNm;
                                    //시작기초번호
                                    var frontStartBaseMasterNo = resultList[i].frontStartBaseMasterNo;
                                    var frontStartBaseSlaveNo = resultList[i].frontStartBaseSlaveNo;
                                    //종료기초번호
                                    var frontEndBaseMasterNo = resultList[i].frontEndBaseMasterNo;
                                    var frontEndBaseSlaveNo = resultList[i].frontEndBaseSlaveNo;
                                    //명판방향라벨
                                    var PLQ_DRC = resultList[i].plqDirectionLbl;

                                    //이면도로용
                                    if(rdGdftySe == "210"){
                                        plqDirection = resultList[i].rddr_plqDrc;
                                        frontKoreanRoadNm = resultList[i].rddr_korRn;
                                        frontStartBaseMasterNo = resultList[i].rddr_stbsMn;
                                        frontStartBaseSlaveNo = resultList[i].rddr_stbsSn;
                                        frontEndBaseMasterNo = resultList[i].rddr_edbsMn;
                                        frontEndBaseSlaveNo = resultList[i].rddr_edbsSn;
                                        PLQ_DRC = resultList[i].rddr_plqDrcLbl;

                                        //이면도로명판 독립형인 경우
                                        if(frontKoreanRoadNm == null && resultList[i].rddr_afRdplqSe == "01000"){
                                            
                                            plqDirection = null;
                                            // frontStartBaseSlaveNo = resultList[i].rddr_stbsSn;
                                            // frontEndBaseMasterNo = resultList[i].rddr_edbsMn;
                                            // frontEndBaseSlaveNo = resultList[i].rddr_edbsSn;
                                            // PLQ_DRC = resultList[i].rddrCn[0];
                                            //이면도로명판 독립형인 경우 첫번째 도로명 표시
                                            //이면도로명판 내용
                                            var rddrCnList = resultList[i].rddrCn;
                                            try {
                                                if(rddrCnList != null && rddrCnList.length > 0){
                                                    //방향
                                                    var drcRdDrc =rddrCnList[0].drcRdDrc;

                                                    var drcRdDrcLbl = "";
                                                    if(drcRdDrc == "1"){
                                                        drcRdDrcLbl = "⇳";
                                                    }else if(drcRdDrc == "2"){
                                                        drcRdDrcLbl == "↑";
                                                    }else if(drcRdDrc == "3"){
                                                        drcRdDrcLbl == "↓";
                                                    }

                                                    frontKoreanRoadNm = rddrCnList[0].drcKorRn + " " + rddrCnList[0].drcRdLt+ "m " + drcRdDrcLbl;

                                                    }
                                            } catch (error) {
                                                util.toast(msg.checkObject.format("이면도로명판 내용"),"error");
                                            }
                                    }

                                    }else if(rdGdftySe == "310"){
                                        // plqDirection = data.rddr_plqDrc;
                                        var prnt_ftRdLt = resultList[i].prnt_ftRdLt == null ? "" : resultList[i].prnt_ftRdLt + "M";
                                        frontKoreanRoadNm = resultList[i].prnt_ftKorRn + " " + prnt_ftRdLt;
                                        // frontKoreanRoadNm = resultList[i].prnt_ftKorRn;
                                        frontStartBaseMasterNo = "0";
                                        frontStartBaseSlaveNo = "0";
                                        frontEndBaseMasterNo = "0";
                                        frontEndBaseSlaveNo = "0";
                                    }


                                    //시작기초번호
                                    var frontStartBaseNo = "{0}{1}".format(frontStartBaseMasterNo == "0"? "" : frontStartBaseMasterNo, (frontStartBaseSlaveNo != "0" ? '-' + frontStartBaseSlaveNo : ''));
                                    //종료기초번호
                                    var frontEndBaseNo = "{0}{1}".format(frontEndBaseMasterNo == "0"? "" : frontEndBaseMasterNo, (frontEndBaseSlaveNo != "0" ? '-' + frontEndBaseSlaveNo : ''));
                                    

                                    //도로명,시작번호,종료번호가 null 일경우 도로명없음으로 표시
                                    if(frontKoreanRoadNm == null ||frontStartBaseMasterNo == null || frontEndBaseMasterNo == null || frontStartBaseSlaveNo == null || frontEndBaseSlaveNo == null){
                                        title = "도로명없음";
                                    }else{
                                        if(plqDirection == '00200'){
                                            title = commonP.format("localTitle",
                                                "{0} {1} {2}".format(
                                                    frontStartBaseNo,
                                                    frontKoreanRoadNm ? frontKoreanRoadNm : '도로명없음',
                                                    frontEndBaseNo
                                                )
                                            );
                                        }else if(plqDirection == '00100' || plqDirection == '00300'){
                                            title = commonP.format("localTitle",
                                                "{0} {1} {2} {3}".format(
                                                    frontKoreanRoadNm ? frontKoreanRoadNm : '도로명없음',
                                                    frontStartBaseNo,
                                                    (plqDirection == '00100' ? '→' : (plqDirection == '00300' ? '↑' : '')),
                                                    frontEndBaseNo
                                                )
                                            );
                                        }else{
                                            title = commonP.format("localTitle",
                                                "{0}".format(frontKoreanRoadNm ? frontKoreanRoadNm : '도로명없음')
                                                )
                                        };
                                    }

                                    
                                    var plqDrc = commonSpan.format("info", PLQ_DRC);

                                    var scfggMkty = resultList[i].scfggMkty;

                                    //규격
                                    var RDPQ_GD_SD = resultList[i].rdpqGdSdLbl;
                                    if(scfggMkty != "1"){
                                        //규격(제2외국어용 규격)
                                        RDPQ_GD_SD = resultList[i].rdpqGdSdScfggMktyLbl;
                                    }
                                    //이면도로용
                                    if(rdGdftySe == "210"){
                                        RDPQ_GD_SD = resultList[i].rddrGdSdLbl;

                                    }else if(rdGdftySe == "310"){
                                        RDPQ_GD_SD = resultList[i].prntGdSdLbl;
                                    }
                                    if(RDPQ_GD_SD == null){
                                        RDPQ_GD_SD = '규격정보없음';
                                    }
                                    var rdpqGdSd = commonSpan.format("info", RDPQ_GD_SD);
                                    //양면여부
                                    var BDRCL_AT = resultList[i].bdrclAt == 0 ? "단면" : "양면";
                                    var bdrclAt = commonSpan.format("info", BDRCL_AT);

                                    // if(features.length > 1 && index >= 1){
                                    //     popupDiv.append(commonP.format("infoLine",""));
                                    // }

                                    //근거리 사진건수
                                    // var CNT_M_FILES = feature.get("CNT_M_FILES");
                                    var CNT_M_FILES = resultList[i].cntMFiles;
                                    //원거리 사진건수
                                    // var CNT_L_FILES = feature.get("CNT_L_FILES");
                                    var CNT_L_FILES = resultList[i].cntLFiles;

                                    //설치상태
                                    // var DEL_STT_CD = feature.get("DEL_STT_CD");
                                    var DEL_STT_CD = resultList[i].delStateCd;
                                    var delStateCdLbl = resultList[i].delStateCdLbl;
                                    //점검상태
                                    var rcSttCdLbl = resultList[i].rcSttCdLbl;
                                    var rcsttCdClass = "info";
                                    if(rcSttCdLbl == null){
                                        rcSttCdLbl = "미점검";
                                        rcsttCdClass = "info redText";
                                    }

                                    var text0 = commonSpan.format("info", "설치상태 : " + delStateCdLbl);
                                    var text1 = commonSpan.format(rcsttCdClass, "점검상태 : " + rcSttCdLbl);
                                    var text2 = commonSpan.format("info", "원거리사진 : " + CNT_L_FILES);
                                    var text3 = commonSpan.format("info", "근거리사진 : " + CNT_M_FILES);

                                    // var text4 = commonSpan.format("info", "위치일련번호 : " + rdFtyLcSn);
                                    // var text5 = commonSpan.format("info", "안내시설일련번호 : " + rdGdftySn);

                                    var button1 = "" ;
                                    var mtchRcrSn = resultList[i].rcrSn;
                                    var nowRcrSn = app.info.rcrSn;
                                    //설치상태 정상 근거리 원거리 사진 1개 이상인 경우 점검가능
                                    if(DEL_STT_CD == "01" && CNT_M_FILES > 0 && CNT_L_FILES > 0 && (mtchRcrSn == null || mtchRcrSn == nowRcrSn)){
                                        button1 = commonButton.format("ui-btn ui-corner-all ui-shadow btnPossible",'insertResearchForPopup('+index+','+resultList[i].rdGdftySn+','+resultList[i].rdFtyLcSn+','+rdGdftySe+')',"정상점검");
                                    }


                                    strHtml += gbn
                                    strHtml += title
                                    // strHtml += commonP.format("", bdrclAt + rdpqGdSd);
                                    // strHtml += commonP.format("", text4);
                                    // strHtml += commonP.format("", text5);
                                    strHtml += commonP.format("", text0);
                                    strHtml += commonP.format("", text1);
                                    strHtml += commonP.format("", text2 + text3);

                                    resultHtml += popDiv.format("", "openDetailPopupCall(" + index + ",'" + layerID + "'," + resultList[i].rdGdftySn + "," +rdGdftySe +")", strHtml);

                                    //도로시설물 공간정보
                                    var geom = feature.getGeometry().getCoordinates();

                                    buttonHtml += buttonForm.format("more", "openDetailPopupCall(" + index + ",'" + layerID + "'," + resultList[i].rdGdftySn + "," + rdGdftySe +")", "image/more.png", "더보기");
                                    buttonHtml += buttonForm.format("addition", "moveingPoint(" + resultList[i].rdFtyLcSn + "," + geom[0] + "," + geom[1] + "," + index + ")", "image/addtion.png", "이동");

                                    resultHtml += commonDiv.format("mapAdd", buttonHtml);
                                    resultHtml += button1;
                                    resultHtml = commonDiv.format("mapInfo", resultHtml);

                                    popupDiv.append(resultHtml);

                                    $("#popup").show();
                                    overlay.setPosition(coordinate);
                                    
                                    resultHtml = commonP.format("infoLine", "");
                                    popupDiv.append(resultHtml);
                                // }else if (rdGdftySe == "210") {

                                // }else if (rdGdftySe == "310") {

                                }else if (rdGdftySe == "510") {
                                    layerID = DATA_TYPE.AREA;
                                    var gbn = commonP.format("gbn", "[{0}]".format("지역안내판"));

                                    //제목창
                                    var title = '';

                                    //시작기초번호(0-0)]
                                    var area_stbsNo = "{0}{1}".format(resultList[i].area_stbsMn, (resultList[i].area_stbsSn != "0" ? '-' + resultList[i].area_stbsSn : ''));
                                    //종료기초번호(0-0)
                                    var area_edbsNo = "{0}{1}".format(resultList[i].area_edbsMn, (resultList[i].area_edbsSn != "0" ? '-' + resultList[i].area_edbsSn : ''));
                                    
                                    //도로명,시작번호,종료번호가 null 일경우 도로명없음으로 표시
                                    if(resultList[i].area_areaKorRn == null ||resultList[i].area_stbsMn == null || resultList[i].area_stbsSn == null || resultList[i].area_edbsMn == null || resultList[i].area_edbsSn == null){
                                        title = "도로명없음";
                                    }else{
                                        title = commonP.format("localTitle",
                                            "←{0} {1} {2}→".format(
                                                area_stbsNo,
                                                resultList[i].area_areaKorRn ? resultList[i].area_areaKorRn : '도로명없음',
                                                area_edbsNo
                                            )
                                        );
                                    }

                                    // var title = commonP.format("localTitle",
                                    //     "{0} {1}{2}".format(
                                    //         resultList[i].area_areaKorRn,
                                    //         resultList[i].area_stbsMn,
                                    //         (resultList[i].area_stbsSn == "0" ? "" : "-" + resultList[i].area_stbsSn)
                                    //     )
                                    // );
                                    //규격
                                    var AREA_GD_SD = resultList[i].area_areaGdSdLbl;
                                    var areaGdSd = commonSpan.format("info", AREA_GD_SD);

                                    //양면여부
                                    var BDRCL_AT = resultList[i].bdrclAt == 0 ? "단면" : "양면";
                                    var bdrclAt = commonSpan.format("info", BDRCL_AT);

                                    //근거리 사진건수
                                    // var CNT_M_FILES = feature.get("CNT_M_FILES");
                                    var CNT_M_FILES = resultList[i].cntMFiles;
                                    //원거리 사진건수
                                    // var CNT_L_FILES = feature.get("CNT_L_FILES");
                                    var CNT_L_FILES = resultList[i].cntLFiles;

                                    //설치상태
                                    // var DEL_STT_CD = feature.get("DEL_STT_CD");
                                    var DEL_STT_CD = resultList[i].delStateCd;
                                    var delStateCdLbl = resultList[i].delStateCdLbl;
                                    //점검상태
                                    var rcSttCdLbl = resultList[i].rcSttCdLbl;
                                    var rcsttCdClass = "info";
                                    if(rcSttCdLbl == null){
                                        rcSttCdLbl = "미점검";
                                        rcsttCdClass = "info redText";
                                    }

                                    var text0 = commonSpan.format("info", "설치상태 : " + delStateCdLbl);
                                    var text1 = commonSpan.format(rcsttCdClass, "점검상태 : " + rcSttCdLbl);
                                    var text2 = commonSpan.format("info", "원거리사진 : " + CNT_L_FILES);
                                    var text3 = commonSpan.format("info", "근거리사진 : " + CNT_M_FILES);

                                    // var text4 = commonSpan.format("info", "위치일련번호 : " + rdFtyLcSn);
                                    // var text5 = commonSpan.format("info", "안내시설일련번호 : " + rdGdftySn);

                                    var button1 = "" ;

                                    var mtchRcrSn = resultList[i].rcrSn;
                                    var nowRcrSn = app.info.rcrSn;
                                    //설치상태 정상 근거리 원거리 사진 1개 이상인 경우 점검가능
                                    if(DEL_STT_CD == "01" && CNT_M_FILES > 0 && CNT_L_FILES > 0 && (mtchRcrSn == null || mtchRcrSn == nowRcrSn)){
                                        button1 = commonButton.format("ui-btn ui-corner-all ui-shadow btnPossible",'insertResearchForPopup('+index+','+resultList[i].rdGdftySn+','+resultList[i].rdFtyLcSn+','+rdGdftySe+')',"정상점검");
                                    }

                                    strHtml += gbn
                                    strHtml += title
                                    // strHtml += commonP.format("", bdrclAt + areaGdSd);
                                    // strHtml += commonP.format("", text4);
                                    // strHtml += commonP.format("", text5);
                                    strHtml += commonP.format("", text0);
                                    strHtml += commonP.format("", text1);
                                    strHtml += commonP.format("", text2 + text3);



                                    // if(features.length > 1 && index == 1){
                                    //     resultHtml += commonP.format("infoLine","");
                                    // }

                                    resultHtml += popDiv.format("", "openDetailPopupCall(" + index + ",'" + layerID + "'," + resultList[i].rdGdftySn + ")", strHtml);

                                    //도로시설물 공간정보
                                    var geom = feature.getGeometry().getCoordinates();

                                    buttonHtml += buttonForm.format("more", "openDetailPopupCall(" + index + ",'" + layerID + "'," + resultList[i].rdGdftySn + ")", "image/more.png", "더보기");
                                    buttonHtml += buttonForm.format("addition", "moveingPoint(" + resultList[i].rdFtyLcSn + "," + geom[0] + "," + geom[1] + "," + index + ")", "image/addtion.png", "이동");

                                    resultHtml += commonDiv.format("mapAdd", buttonHtml);
                                    resultHtml += button1;
                                    resultHtml = commonDiv.format("mapInfo", resultHtml);

                                    popupDiv.append(resultHtml);

                                    $("#popup").show();
                                    overlay.setPosition(coordinate);

                                    resultHtml = commonP.format("infoLine", "");
                                    popupDiv.append(resultHtml);
                                } else if (rdGdftySe == "610") {
                                    layerID = DATA_TYPE.BSIS;
                                    var gbn = commonP.format("gbn", "[{0}]".format("기초번호판"));

                                    //제목창
                                    var title = '';
                                    //기초번호(0-0)
                                    var bsis_ctbsNo = "{0}{1}".format(resultList[i].bsis_ctbsMn, (resultList[i].bsis_ctbsSn != "0" ? '-' + resultList[i].bsis_ctbsSn : ''));
                                    
                                    //도로명,시작번호,종료번호가 null 일경우 도로명없음으로 표시
                                    if(resultList[i].bsis_korRn == null ||resultList[i].bsis_ctbsMn == null || resultList[i].bsis_ctbsSn == null){
                                        title = "도로명없음";
                                    }else{  
                                        title = commonP.format("localTitle",
                                            "{0} {1}".format(
                                                resultList[i].bsis_korRn ? resultList[i].bsis_korRn : '도로명없음',
                                                bsis_ctbsNo
                                            )
                                        );
                                    }

                                    // var title = commonP.format("localTitle",
                                    //     "{0} {1}{2}".format(
                                    //         resultList[i].bsis_korRn,
                                    //         resultList[i].bsis_ctbsMn,
                                    //         (resultList[i].bsis_ctbsSn == "0" ? "" : "-" + resultList[i].bsis_ctbsSn)
                                    //     )
                                    // );

                                    //시점
                                    var BFBS_MN = (resultList[i].bsis_bfbsMn ? resultList[i].bsis_bfbsMn : '');

                                    var BFBS_SN = (resultList[i].bsis_bfbsSn == "0" ? '' : resultList[i].bsis_bfbsSn);

                                    var bfbsStr = baseNumberMix(BFBS_MN, BFBS_SN); // 0 - 0

                                    var bfbs = popTableP.format("이전승강장기초번호", bfbsStr);

                                    //종점

                                    var NTBS_MN = (resultList[i].bsis_ntbsMn ? resultList[i].bsis_ntbsMn : '');

                                    var NTBS_SN = (resultList[i].bsis_ntbsSn ? resultList[i].bsis_ntbsSn : '');

                                    var ntbsStr = baseNumberMix(NTBS_MN, NTBS_SN); // 0 - 0

                                    var ntbs = popTableP.format("다음승강장기초번호", ntbsStr);

                                    //근거리 사진건수
                                    // var CNT_M_FILES = feature.get("CNT_M_FILES");
                                    var CNT_M_FILES = resultList[i].cntMFiles;
                                    //원거리 사진건수
                                    // var CNT_L_FILES = feature.get("CNT_L_FILES");
                                    var CNT_L_FILES = resultList[i].cntLFiles;

                                    //설치상태
                                    // var DEL_STT_CD = feature.get("DEL_STT_CD");
                                    var DEL_STT_CD = resultList[i].delStateCd;
                                    var delStateCdLbl = resultList[i].delStateCdLbl;
                                    //점검상태
                                    var rcSttCdLbl = resultList[i].rcSttCdLbl;
                                    var rcsttCdClass = "info";
                                    if(rcSttCdLbl == null){
                                        rcSttCdLbl = "미점검";
                                        rcsttCdClass = "info redText";
                                    }
                                    // var text4 = commonSpan.format("info", "위치일련번호 : " + rdFtyLcSn);
                                    // var text5 = commonSpan.format("info", "안내시설일련번호 : " + rdGdftySn);
                                    var text0 = commonSpan.format("info", "설치상태 : " + delStateCdLbl);
                                    var text1 = commonSpan.format(rcsttCdClass, "점검상태 : " + rcSttCdLbl);
                                    var text2 = commonSpan.format("info", "원거리사진 : " + CNT_L_FILES);
                                    var text3 = commonSpan.format("info", "근거리사진 : " + CNT_M_FILES);
                                    var button1 = "" ;

                                    var mtchRcrSn = resultList[i].rcrSn;
                                    var nowRcrSn = app.info.rcrSn;
                                    //설치상태 정상 근거리 원거리 사진 1개 이상인 경우 점검가능
                                    if(DEL_STT_CD == "01" && CNT_M_FILES > 0 && CNT_L_FILES > 0 && (mtchRcrSn == null || mtchRcrSn == nowRcrSn)){
                                        button1 = commonButton.format("ui-btn ui-corner-all ui-shadow btnPossible",'insertResearchForPopup('+index+','+resultList[i].rdGdftySn+','+resultList[i].rdFtyLcSn+','+rdGdftySe+')',"정상점검");
                                    }

                                    strHtml += gbn
                                    strHtml += title
                                    // strHtml += commonP.format("", bfbs);
                                    // strHtml += commonP.format("", ntbs);
                                    // strHtml += commonP.format("", text4);
                                    // strHtml += commonP.format("", text5);
                                    strHtml += commonP.format("", text0);
                                    strHtml += commonP.format("", text1);
                                    strHtml += commonP.format("", text2 + text3);

                                    // if(features.length > 1 && index == 1){
                                    //     resultHtml += commonP.format("infoLine","");
                                    // }

                                    resultHtml += popDiv.format("", "openDetailPopupCall(" + index + ",'" + layerID + "'," + resultList[i].rdGdftySn + ")", strHtml);

                                    //도로시설물 공간정보
                                    var geom = feature.getGeometry().getCoordinates();

                                    buttonHtml += buttonForm.format("more", "openDetailPopupCall(" + index + ",'" + layerID + "'," + resultList[i].rdGdftySn + ")", "image/more.png", "더보기");
                                    buttonHtml += buttonForm.format("addition", "moveingPoint(" + resultList[i].rdFtyLcSn + "," + geom[0] + "," + geom[1] + "," + index + ")", "image/addtion.png", "이동");

                                    resultHtml += commonDiv.format("mapAdd", buttonHtml);
                                    resultHtml += button1;
                                    resultHtml = commonDiv.format("mapInfo", resultHtml);

                                    popupDiv.append(resultHtml);

                                    $("#popup").show();
                                    overlay.setPosition(coordinate);

                                    resultHtml = commonP.format("infoLine", "");
                                    popupDiv.append(resultHtml);

                                }

                            }

                        }, msg.alert);
                    break;
                case DATA_TYPE.BULD:
                    //건물명
                    var POS_BUL_NM = feature.get("POS_BUL_NM");

                    if (POS_BUL_NM == undefined) {
                        POS_BUL_NM = "건물명 없음";
                    }

                    strHtml = commonSpan.format("titleIcon_building", "");
                    strHtml += POS_BUL_NM;

                    var buldNm = commonP.format("localTitle", strHtml);

                    //팝업내용 추가
                    strHtml = buldNm

                    resultHtml = popDiv.format("", "openDetailPopupCall(0)", strHtml);

                    //도로시설물 공간정보
                    var geom = feature.getGeometry().getCoordinates();

                    buttonHtml = buttonForm.format("more", "openDetailPopupCall(0)", "image/more.png", "더보기");

                    resultHtml += commonDiv.format("mapAdd", buttonHtml);

                    resultHtml = commonDiv.format("mapInfo", resultHtml);

                    popupDiv.append(resultHtml);

                    //건물번호판
                    strHtml = commonSpan.format("titleIcon_number", "");
                    strHtml += "건물번호판";

                    //팝업내용 추가
                    strHtml = commonP.format("localTile", strHtml);
                    strHtml += commonP.format("", "");

                    resultHtml = popDiv.format("", "openDetailPopupCall(1)", strHtml);

                    buttonHtml = buttonForm.format("more", "openDetailPopupCall(1)", "image/more.png", "더보기");

                    resultHtml += commonDiv.format("mapAdd", buttonHtml);

                    resultHtml = commonDiv.format("mapInfo", resultHtml);

                    // popupDiv.append(resultHtml);

                    // $("#popup").show();
                    // overlay.setPosition(coordinate);

                    openDetailPopupCall(1);

                    break;
                case DATA_TYPE.ENTRC:
                    layerID = DATA_TYPE.ENTRC;
                    // var link = URLs.entrclink;
                    var link = URLs.nmtglink;
                    //건물일련번호
                    var BUL_MAN_NO = feature.get("BUL_MAN_NO");
                    //건물번호판일련번호
                    var BUL_NMT_NO = feature.get("BUL_NMT_NO");
                    //시군구코드
                    var SIG_CD = feature.get("SIG_CD");

                    var sendParam = {
                        // svcNm: 'sEntrc',
                        // mode : "11",
                        // bulNmtNo : BUL_NMT_NO,
                        sn: BUL_NMT_NO,
                        sigCd: SIG_CD,
                        workId: app.info.opeId
                    };

                    var url = URLs.postURL(link, sendParam);

                    util.showProgress();
                    util.postAJAX({}, url)
                        .then(function(context, rCode, results) {
                            util.dismissProgress();

                            //통신오류처리
                            if (rCode != 0 || results.response.status < 0) {
                                navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                                util.dismissProgress();
                                return;
                            }

                            var data = results.data;

                            var gbn = commonP.format("gbn", "[{0}]".format("건물번호판"));
                            //건물번호판 일련번호
                            var bulNmtNo = feature.get("BUL_NMT_NO");
                            //건물일련번호
                            var bulManNo = feature.get("BUL_MAN_NO");

                            //근거리 사진건수
                            // var CNT_M_FILES = feature.get("CNT_M_FILES");
                            var CNT_M_FILES = data.cntMFiles;
                            //원거리 사진건수
                            // var CNT_L_FILES = feature.get("CNT_L_FILES");
                            var CNT_L_FILES = data.cntLFiles;

                            //설치상태
                            // var DEL_STT_CD = feature.get("DEL_STT_CD");
                            var DEL_STT_CD = data.delStateCd;
                            var delStateCdLbl = data.delStateCdLbl;
                            //점검상태
                            var rcSttCdLbl = data.rcSttCdLbl;
                            var rcsttCdClass = "info";
                            if(rcSttCdLbl == null){
                                rcSttCdLbl = "미점검";
                                rcsttCdClass = "info redText";
                            }

                            var text0 = commonSpan.format("info", "설치상태 : " + delStateCdLbl);
                            var text1 = commonSpan.format(rcsttCdClass, "점검상태 : " + rcSttCdLbl);
                            var text2 = commonSpan.format("info", "원거리사진 : " + CNT_L_FILES);
                            var text3 = commonSpan.format("info", "근거리사진 : " + CNT_M_FILES);

                            //설치 건물명
                            var rnCdLbl = data.rnCdLbl;
                            //설치 건물본번
                            var buldMnnm = data.buldMnnm;
                            //설치 건물부번
                            var buldSlno = data.buldSlno;
                            
                            var titleTxt = "{0} {1}{2}".format(
                                (data.rnCdLbl ? data.rnCdLbl : ''),
                                (data.buldMnnm ? data.buldMnnm : ''),
                                (data.buldSlno == '0' ? '' : '-' + data.buldSlno)
                            )

                            if(rnCdLbl == null && rnCdLbl == ""){
                                titleTxt = "설치건물명 없음";
                            }
                            //제목창
                            var title = '';
                            
                            title = commonP.format("localTitle",titleTxt);
                            
                            var button1 = "" ;

                            var mtchRcrSn = data.rcrSn;
                            var nowRcrSn = app.info.rcrSn;
                            //설치상태 정상 근거리 원거리 사진 1개 이상인 경우 점검가능
                            if(DEL_STT_CD == "01" && CNT_M_FILES > 0 && CNT_L_FILES > 0 && (mtchRcrSn == null || mtchRcrSn == nowRcrSn)){
                                button1 = commonButton.format("ui-btn ui-corner-all ui-shadow btnPossible",'insertResearchForPopup('+index+')',"정상점검");
                            }
                            
                            strHtml = gbn
                            strHtml += title
                            strHtml += commonP.format("", text0);
                            strHtml += commonP.format("", text1);
                            strHtml += commonP.format("", text2 + text3);

                            resultHtml = popDiv.format("", "openDetailPopupCall(" + index + ",'" + layerID + "'," + bulNmtNo + ")", strHtml);

                            buttonHtml = buttonForm.format("more", "openDetailPopupCall(" + index + ",'" + layerID + "'," + bulNmtNo + ")", "image/more.png", "더보기");

                            resultHtml += commonDiv.format("mapAdd", buttonHtml);
                            
                            resultHtml += button1;

                            resultHtml = commonDiv.format("mapInfo", resultHtml);

                            popupDiv.append(resultHtml);

                            $("#popup").show();
                            overlay.setPosition(coordinate);

                            resultHtml = commonP.format("infoLine", "");
                            popupDiv.append(resultHtml);

                        }, msg.alert);
                    break;

                case DATA_TYPE.SPPN:
                    resultHtml = "";
                    strHtml = "";
                    buttonHtml = "";
                    //지점번호_시설물일련번호
                    var SPO_FCL_SN = feature.get("SPO_FCL_SN");
                    //지점번호코드
                    var SPO_NO_CD = feature.get("SPO_NO_CD");
                    //상세기관명
                    // var DTOR_NM = feature.get("DTOR_NM");

                    var gbn = commonP.format("gbn", "[{0}]".format("지점번호판"));
                    var title = commonP.format("localTitle",SPO_NO_CD);

                    strHtml += gbn
                    strHtml += title
                    // strHtml += commonP.format("",DTOR_NM);

                    resultHtml += popDiv.format("", "openDetailPopupCall(" + index + ",'" + layerID + "'," + SPO_FCL_SN + ")", strHtml);

                    //도로시설물 공간정보
                    var geom = feature.getGeometry().getCoordinates();

                    buttonHtml += buttonForm.format("more", "openDetailPopupCall(" + index + ",'" + layerID + "'," + SPO_FCL_SN + ")", "image/more.png", "더보기");
                    // buttonHtml += buttonForm.format("addition", "moveingPoint(" + SPO_NO_CD + "," + geom[0] + "," + geom[1] + "," + index + ")", "image/addtion.png", "이동");

                    resultHtml += commonDiv.format("mapAdd", buttonHtml);
                    
                    resultHtml = commonDiv.format("mapInfo", resultHtml);

                    popupDiv.append(resultHtml);

                    if(features.length > 1){
                        resultHtml = commonP.format("infoLine", "");
                        popupDiv.append(resultHtml);
                    }

                    $("#popup").show();
                    overlay.setPosition(coordinate);

                    break;
            }

        });
    } catch (error) {
        util.toast('심볼 간략정보 조회시 오류가 발생했습니다. 다시 클릭해주세요','error');
    }
     
}