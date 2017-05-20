var KEY = {
    plateType: { "ROAD": 1, "BASE": 2, "LOCAL": 3, "BUILD": 4, "ENTRC": 5 },
    plateDir: { "ONE": "00100", "BI": "00200", "FORWARD": "00300", "ONE_S": "00101", "ONE_E": "00102" }
};
var MapUtil = {
    init: function () {
        MapUtil.controls.init();
        MapUtil.handler.init();
    }, handler: {
        init: function() {
            MapUtil.handler.popupHandler();
        },
        popupHandler: function() {
            $("#popup-road .ui-body:last .ui-radio input:radio").on("change", function() {
                $(this).parent().parent().children("label").each(function() {
                    if( $(this).hasClass("ui-radio-on") ) {
                        var src = $(this).children("img").attr("src");
                        $(this).children("img").attr("src", src.replace(/(.*_.*)_.*\.(png)/,"$1_on.$2"));
                    } else {
                        $(this).children("img").attr("src", src.replace(/(.*_.*)_.*\.(png)/,"$1_off.$2"));
                    }
                });
            });
        }
    },
    controls: {
        init: function () {
            ol.inherits(MapUtil.controls.legendControl, ol.control.Control);
            ol.inherits(MapUtil.controls.currentControl, ol.control.Control);
        },
        /**
        * @constructor
        * @extends {ol.control.Control}
        * @param {Object=} opt_options Control options.
        */
        legendControl : function (opt_options) {
            var options = opt_options || {};

            var button = document.createElement('a');
            // button.innerHTML = '<img src="img/btn_legend_on.png" />';
            var legend = document.createElement('div');
            legend.className = "legendBody";
            var legendHtml = '';
                // legendHtml += '<p class="title">범 례</p>';
                legendHtml += '<p href="#" id="legendRdpq" class="ui-btn ui-icon-rdpq">도로명판</p>';
                legendHtml += '<a href="#" id="legendBsis" class="ui-btn ui-icon-bsis">기초번호판</a>';
                legendHtml += '<a href="#" id="legendArea"class="ui-btn ui-icon-area">지역안내판</a>';
            legend.innerHTML = legendHtml;

            var this_ = this;
            var handleRotateNorth = function(e) {
                this_.getMap().getView().setRotation(0);
            };

            button.addEventListener('click', handleRotateNorth, false);
            button.addEventListener('touchstart', handleRotateNorth, false);

            var element = document.createElement('div');
            element.className = 'legend ol-unselectable ol-control';
            element.appendChild(button);
            element.appendChild(legend);

            ol.control.Control.call(this, {
                element: element,
                target: options.target
            });

        },
        currentControl: function (opt_options) {
            var options = opt_options || {};

            var button = document.createElement('button');
            button.innerHTML = '<img src="img/icon_curPos.png" />';

            var geolocation = new ol.Geolocation( /** @type {olx.GeolocationOptions} */{
                tracking: true,
                projection: baseProjection,
                trackingOptions: {
                    maximumAge: 10000,
                    enableHighAccuracy: true,
                    timeout: 600000
                }
            });

            var curPosition = function () {
                var coordinate = geolocation.getPosition();
                coordinate = [946695.6653704424, 1953211.8303461187];
                map.getView().setCenter(coordinate);
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
        }
    },
    openPopup: function (type, f) {
        var popHeader = "#common-pop .ui-bar";
        var container = "#common-pop .popup-content .ui-body:first";
        var url = "", header = "", headerFunc = "";

        $(popHeader).empty();
        $(container).empty();

        switch(type) {
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

        $(popHeader).append("<h2>{0}</h2>".format(header));
        $(popHeader).append(headerFunc);

        $(container).load(url.link(), function() {
            MapUtil.setPopup(type, f);
            $("#common-pop").popup("open", { transition: "slideup" });
        })
    },
    openDetail: function (type, f) {
        var detailTaget = '#detailView';
        switch(type) {
            case KEY.plateType.ROAD:
                url = pages.detail_road;
                header = "도로명판";
                // headerFunc = '<a href="javascript:util.camera()" id="camera" style="right: 0;float: right;margin: 0;padding: 0;color: white;">카메라</a>';

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

        $(detailTaget).load(url.link(), function() {
            MapUtil.setDetail(type, f);
            $("#detailView").popup("open", { transition: "slideup" });
        })
    },
    getPlateDir: function (f) {
        var ft_stbs_mn = parseInt(f.get("FT_STBS_MN"));
        var ft_stbs_sn = parseInt(f.get("FT_STBS_SN"));
        var ft_edbs_mn = parseInt(f.get("FT_EDBS_MN"));
        var ft_edbs_sn = parseInt(f.get("FT_EDBS_SN"));

        var ft_stbs = ft_stbs_mn + ft_stbs_sn * .1;
        var ft_edbs = ft_edbs_mn + ft_edbs_sn * .1;

        var ret = {
            ft_stbs: ft_stbs.toString().replace(/\./g, "-"),
            ft_edbs: ft_edbs.toString().replace(/\./g, "-"),
            ft_all: function (dir) {
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
    setDetail: function(type, f){
        var codeList

        switch (type) {
            case KEY.plateType.ROAD:
                var sn = f.get("RD_GDFTY_SN");
                var link = URLs.roadsignlink;
                
                var url = URLs.postURL(link, { "sn": sn, "sigCd": app.info.sigCd, "workId": app.info.opeId });

                util.postAJAX({}, url)
                    .then(function (context, rcode, results) {
                        var data = results.data;
                        console.log(data);
                        //제목창
                        var title = "[{0}] {1} {2}-{3}".format(data.rdGdftySeLbl, f.get('FT_KOR_RN'), f.get('BSIS_MNNM'), f.get('BSIS_SLNO'));
                        $(".title").append(title);
                        
                        //도로시설물
                        // $("#rdGdftySeLbl").append(data.rdGdftySeLbl);
                        // $("#rdGdftySe").append(data.rdGdftySe);
                        $("#rdftySeLbl").append(data.rdftySeLbl);
                        $("#rdftySe").append(data.rdftySe);
                        //설치도로명

                        //설치기초번호
                        var bsis = "{0} - {1}".format(data.bsisMnnm,data.bsisSlno);
                        $("#bsis").append(bsis);             
                        //설치유형
                        $("#instSeLbl").append(data.instSeLbl);
                        $("#instSe").append(data.instSe);
                        //제작형식
                        $("#gdftyMnf").append(data.gdftyMnf);
                        $("#gdftyMnfLbl").append(data.gdftyMnfLbl);
                        //설치지점
                        $("#instSpotCd").append(data.instSpotCd);
                        $("#instSpotCdLbl").append(data.instSpotCdLbl);
                        //교차로유형
                        $("#instCrossCd").append(data.instCrossCd);
                        $("#instCrossCdLbl").append(data.instCrossCdLbl);
                        //앞면 도로명(국문)
                        $("#frontKoreanRoadNm").append(data.frontKoreanRoadNm);
                        //앞면 도로명(로마자)
                        $("#frontRomeRoadNm").append(data.frontRomeRoadNm);
                        //앞면시작기초번호(0-0)
                        // $("#frontStartBaseMasterNo").append(data.frontStartBaseMasterNo);
                        // $("#frontStartBaseSlaveNo").append(data.frontStartBaseSlaveNo);
                        var frontStartBaseNo = "{0} - {1}".format(data.frontStartBaseMasterNo,data.frontStartBaseSlaveNo);
                        $("#frontStartBaseNo").append(frontStartBaseNo);                             
                        //앞면종료기초번호(0-0)
                        // $("#frontEndBaseMasterNo").append(data.frontEndBaseMasterNo);
                        // $("#frontEndBaseSlaveNo").append(data.frontEndBaseSlaveNo);
                        var frontEndBaseNo = "{0} - {1}".format(data.frontEndBaseMasterNo,data.frontEndBaseSlaveNo);
                        $("#frontEndBaseNo").append(frontEndBaseNo);
                        //뒷면 도로명(국문)
                        $("#backKoreanRoadNm").append(data.backKoreanRoadNm);
                        //뒷면 도로명(로마자)
                        $("#backRomeRoadNm").append(data.backRomeRoadNm);
                        //뒷면시작기초번호(0-0)
                        var backStartBaseNo = "{0} - {1}".format(data.backStartBaseMasterNo,data.backStartBaseSlaveNo);
                        $("#backStartBaseNo").append(backStartBaseNo);                             
                        //뒷면종료기초번호(0-0)
                        var backEndBaseNo = "{0} - {1}".format(data.backEndBaseMasterNo,data.backEndBaseSlaveNo);
                        $("#backEndBaseNo").append(backEndBaseNo);        
                        //도로명판종류
                        $("#gdftyForm").append(data.gdftyForm);
                        $("#gdftyFormLbl").append(data.gdftyFormLbl);
                        //사용대상
                        $("#useTarget").append(data.useTarget);
                        $("#useTargetLbl").append(data.useTargetLbl);
                        //사용방향
                        $("#plqDirection").append(data.plqDirection);
                        $("#plqDirectionLbl").append(data.plqDirectionLbl);
                        //양면여부
                        $("#bdrclAt").append(data.bdrclAt);
                        $("#bdrclAtLbl").append(data.bdrclAtLbl);
                        //제2외국어여부
                        $("#scfggMkty").append(data.scfggMkty);
                        $("#scfggMktyLbl").append(data.scfggMktyLbl);
                        //언어1
                        $("#scfggUla1").append(data.scfggUla1);
                        $("#scfggUla1Lbl").append(data.scfggUla1Lbl);
                        //언어2
                        $("#scfggUla2").append(data.scfggUla2);
                        $("#scfggUla2Lbl").append(data.scfggUla2Lbl);
                        //규격
                        $("#rdpqGdSd").append(data.rdpqGdSd);
                        $("#rdpqGdSdLbl").append(data.rdpqGdSdLbl);
                        //단가(원)
                        $("#gdftyUnitPrice").append(data.gdftyUnitPrice);
                        //가로*새로*두꺠

                        //설치상태

                    });
                break;
            case KEY.plateType.BUILD:
                break;
            case KEY.plateType.ENTRC:
                break;
        }
                



    },
    setPopup: function (type, f) {
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
                appendSelectBox("INS_SPO_CD","instSpotCd",f);

                //설치재설치 여부
                appendSelectBox("ISLGN_YN","isLgnYn",f);

                //설치지점명
                
                //한글도로명
                $("#frontKoreanRoadNm").val(f.get("FT_KOR_RN"));
                // document.getElementById("").value = f.get("FT_KOR_RN");

                //로마자 도로명
                $("#frontRomeRoadNm").val(f.get("FT_ROM_RN"));
                // document.getElementById("frontRomeRoadNm").value = f.get("FT_ROM_RN");

                //안내시설형식
                appendSelectBox("GDFTY_FOM","gdftyForm",f);
                
                //안내시설방향
                appendSelectBox("PLQ_DRC","plqDirection",f);

                /** 상태(정상,훼손,망실) 정보 표현 */
                $("#popup-road .ui-body:last input:radio").each(function() {
                    var src = $(this).prev().children().attr("src");
                    var lt_chc_stt = f.get("LT_CHC_STT");

                    if( this.value == lt_chc_stt ) {
                        $(this).prev().children().attr("src", src.replace(/(.*_.*)_.*\.(png)/,"$1_on.$2"));
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

                var url = URLs.postURL(URLs.entrclink, { "sn":sn, "sigCd":app.info.sigCd , "workId" : app.info.opeId});

                util.postAJAX({},url).then( function(context,rcode,results) {
                    var data = results.data;
                    if (rcode != 0 || util.isEmpty(data) === true ){
                        navigator.notification.alert('시설물 정보를 가져오지 못하였습니다', function (){
                                                util.goBack();
                                                },'시설물 정보 조회', '확인');
                        util.dismissProgress();
                        return;
                    }


                    $("#instlDe").val(data.instDate);

                    appendSelectBox2("BUL_NMT_CD","bulNmtCd",data.buldNmtCd);

                    appendSelectBox2("BUL_NMT_TY","buldNmtType",data.buldNmtType);

                    appendSelectBox2("BUL_NMT_QL","buldNmtMaterial",data.buldNmtMaterial);

                    appendSelectBox2("BUL_NMT_PR","buldNmtPurpose",data.buldNmtPurpose);

                    $("#buldNmtUnitPrice").val(data.buldNmtUnitPrice);

                    appendSelectBox2("BUL_MNF_CD","buldMnfCd",data.buldMnfCd);

                    appendSelectBox2("BUL_NMT_LO","buldNmtLoss",data.buldNmtLoss);

                    $("#workId").val(data.workId);

                    $("#workDate").val(data.workDate);

                    appendSelectBox2("LGHT_CD","lightCd",data.lightCd);

                    $("#registerDate").val(data.registerDate);

                }),function(context,xhr,error) {
                    console.log("갱신실패"+ error+'   '+ xhr);
                    navigator.notification.alert('시설물 정보를 가져오지 못하였습니다', function (){
                                                    util.goBack();
                                                    },'시설물 정보 조회', '확인');


                    util.dismissProgress();
                }

                break;
            case KEY.plateType.BUILD:

            //**************************** 건물정보 시작 *********************************** */
                //건축물용도
                appendSelectBox("BDTYP_CD","bdtypCd",f);

                //지하건물여부
                appendSelectBox("BULD_SE_CD","buldSeCd",f);

                //건물종속여부
                appendSelectBox("BUL_DPN_SE","bulDpnSe",f);

                //건물명
                $("#buldNm").val(getFeatherValue("BULD_NM",f));

                //건물명(영)
                $("#bulEngNm").val(getFeatherValue("BUL_ENG_NM",f));

                //상세건물명
                $("#etcBulNm").val(getFeatherValue("ETC_BUL_NM",f));

                //건물층수(지상)
                $("#groFloCo").val(getFeatherValue("GRO_FLO_CO",f));

                //건물층수(지상)
                $("#undFloCo").val(getFeatherValue("UND_FLO_CO",f));

                //건물상태
                $("#buldSttus").val(getFeatherValue("BULD_STTUS",f));

                //메모
                $("#buldMemo").val(getFeatherValue("BULD_MEMO",f));
                //**************************** 건물정보 끝 *********************************** */

                break;
        }
    }
};

function getFeatherValue(colume, f){
    
    var valueText = f.get(colume);
    if(valueText == undefined){
        valueText = "";
    }
    return valueText;

}

function appendSelectBox(colume,selectBoxID,f){
    var codeList =app.codeMaster[CODE_GROUP[colume]];
                var code = f.get(colume);
                var codeValue =app.codeMaster[CODE_GROUP[colume]][f.get(colume)];
                $("#"+selectBoxID).empty();

                for(var c in codeList){
                    if(c != "GroupNm"){
                        if(c == code){
                             $("#"+selectBoxID).append("<option value='{0}' selected='selected'>{1}</option>".format(c, codeList[c]));
                        }else{
                            $("#"+selectBoxID).append("<option value='{0}'>{1}</option>".format(c, codeList[c]));
                        }
                        
                    }
                }
                // $("#"+selectBoxID).selectmenu("refresh", true);
}

function appendSelectBox2(colume,selectBoxID,data){
    var codeList =app.codeMaster[CODE_GROUP[colume]];
                
    $("#"+selectBoxID).empty();

    for(var c in codeList){
        if(c != "GroupNm"){
            
            $("#"+selectBoxID).append("<option value='{0}'>{1}</option>".format(c, codeList[c]));
            
        }
    }

    $("#"+selectBoxID).val(data).attr("selected","selected");

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

var GIS_SERVICE_URL, baseProjection, sourceProjection, serviceProjection;
var BASE_GIS_SERVICE_URL = "http://m1.juso.go.kr/tms?FIXED=TRUE";


switch (mode) {
    case MODE.RUNTIME:
        baseProjection = ol.proj.get('EPSG:5179');
        sourceProjection = ol.proj.get('EPSG:5174');
        serviceProjection = ol.proj.get('SR-ORG:6640');
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
var mapInit = function (mapId, pos) {
    var def = $.Deferred();

    if (!initial) {
        initial = true;
    } else {
        setTimeout(function(){
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
                layers: 'ROOT',
                format: 'image/png',
                bgcolor: '0x5F93C3',
                exceptions: 'BLANK',
                text_anti: 'true',
                label: 'HIDE_OVERLAP',
                graphic_buffer: '64'
            },
            tileGrid: new ol.tilegrid.TileGrid({
                extent: [213568, 1213568, 1786432, 2786432],
                resolutions: [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25]
            })
        })
    });


    // Feature 정보보기 레이어 생성
    var overlay = new ol.Overlay( /** @type {olx.OverlayOptions} */({
        id: 'popup',
        element: document.getElementById('popup'),
        position: undefined,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    }));

    // 현재위치 마커 생성
    var marker = new ol.Overlay({  /** @type {olx.OverlayOptions} */
        positioning: 'center-center',
        element: document.getElementById('marker'),
        stopEvent: false
    });

    MapUtil.init();
    map = new ol.Map({
        target: mapId,
        logo: false,
        layers: [baseLayer],
        controls: ol.control.defaults({
            //rotate: false,
            attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                collapsible: false
            })
        }).extend([
            new MapUtil.controls.legendControl(),
            new MapUtil.controls.currentControl()
        ]),
        overlays: [overlay, marker],
        view: new ol.View({
            projection: baseProjection,
            center: pos,
            zoom: 14,
            maxZoom: 15,
            minZoom: 6,
            maxResolution: 2048
        })
    });

    // 도로안내시설물위치 레이어
    // 건물 레이어
    var lyr_tl_spbd_buld = getFeatureLayer({
        title: "건물",
        typeName: "tlv_spbd_buld",
        dataType: DATA_TYPE.BULD,
        style: {
            label: {
                chkCondition: function(f, o) { return (parseInt(f.get(o.data[2])) == 0) },
                format: ["{1}-{2}({0})", "{1}({0})"],
                data: ["BUL_MAN_NO", "BULD_MNNM", "BULD_SLNO"],
                textOffsetY: 0,
                width : 3
            }
        },
        maxResolution: .25
    });
    // 출입구 레이어
    var lyr_tl_spbd_entrc = getFeatureLayer({
        title: "건물번호판",
        typeName: "tl_spbd_entrc",
        dataType: DATA_TYPE.ENTRC,
        style: {
            radius: 15,
            label: {
                format: ["{0}({1}-{2})"],
                data: ["BUL_MAN_NO", "ENTRC_SE", "NMT_INS_YN"],
                textOffsetY: -20
            }
        },
        maxResolution: .25
    });
    // 도로명판 레이어
    var lyr_tl_spgf_rdpq = getFeatureLayer({
        title: "도로명판",
        typeName: "tlv_spgf_rdpq",
        dataType: DATA_TYPE.RDPQ,
        style: {
            // label: {
            //     text: { key: "USE_TRGET", func: function(text) { return app.codeMaster[CODE_GROUP["USE_TRGET"]][text].charAt(0)} },
            //     textOffsetX: 21,
            //     textOffsetY: -23
            // },
            radius: 12
        },
        cluster: { distance: 15 },
        maxResolution: 1
    });
    // 지역안내판 레이어
    var lyr_tl_spgf_area = getFeatureLayer({
        title: "지역안내판",
        typeName: "tlv_spgf_area",
        dataType: DATA_TYPE.AREA,
        maxResolution: 16,
        viewProgress: false
    });
    // 기초번호판 레이어
    var lyr_tl_spgf_bsis = getFeatureLayer({
        title: "기초번호판",
        typeName: "tlv_spgf_bsis",
        dataType: DATA_TYPE.BSIS,
        maxResolution: 16,
        viewProgress: false
    });

    layers = {
        "buld": lyr_tl_spbd_buld,
        "rdpq": lyr_tl_spgf_rdpq,
        "area": lyr_tl_spgf_area,
        "bsis": lyr_tl_spgf_bsis,
        "entrc": lyr_tl_spbd_entrc
    };

    /*********** 지도 화면 핸들러 (--start--) ***********/

    // 마우스 이동 이벤트 정의(현재 좌표 보여주기) (--start--)
    map.on('pointermove', function (event) { });
    // 마우스 이동 이벤트 정의(현재 좌표 보여주기) (--end--)
    
    // 선택 이벤트 정의()(--start--)
    map.on('singleclick', function (event) {
        var coordinate = event.coordinate;

        var resultHtml = "";
        var buttonHtml = "";
        
        var layerList = map.getLayers().getArray();
        var popupDiv = $("#popup-content");
        var buttonDiv = "<div id='buttonDiv'>{0}</div>";

        var popDiv = "<div onclick =\"{0}\">{1}</div>"
        var popTableHead = "<h2>{0}</h2>";
        var popTableP = "<p>{0} : {1}</p>";
        var buttonForm ="<button onclick=\"{0}\">{1}</button>" 
        
        //심플팝업 초기화
        popupDiv.empty();
        $("#popup").hide();
        
        /********** 위치이동 팝업 셋팅 start **********/
        
        for(var i = 0 ; i < layerList.length; i++){
            if(layerList[i].get('title') == '위치이동'){
                console.log(layerList[i].get('title'));

                var moveingPoint_source = layerList[i].getSource();

                moveingPoint_source.clear();

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
                var oldPoint = new ol.geom.Point([oldGeom[0],oldGeom[1]]);
                
                oldPointFeature.setGeometry(oldPoint);

                moveingPoint_source.addFeature(oldPointFeature);



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

                moveingPoint_source.addFeature(newPointFeature);
                


                var RDFTYLC_SN = featureClone[featureIndex].get("RDFTYLC_SN");

                var pointSn = popTableP.format("위치일련번호",RDFTYLC_SN);

                var pointX = popTableP.format("X",coordinate[0]);

                var pointY = popTableP.format("Y",coordinate[1]);

                resultHtml = pointSn;
                resultHtml+= pointX;
                resultHtml+= pointY;

                popupDiv.append(resultHtml);

                //버튼처리
                buttonHtml = buttonForm.format("insertMoveingPoint("+RDFTYLC_SN+","+coordinate[0]+","+coordinate[1]+")","저장");
                buttonHtml += buttonForm.format("clearMoveMode()","취소");
                
                buttonHtml = buttonDiv.format(buttonHtml);

                popupDiv.append(buttonHtml);

                $("#popup").show();

                overlay.setPosition(coordinate);

            }
        }
        /********** 위치이동 팝업 셋팅 end **********/

        var firstClick = true;
        map.forEachFeatureAtPixel(event.pixel, function (feature, layer) {
            if(firstClick){
                var sn, features;
                
                // map.getView().setCenter(coordinate);
                

                if(feature.getKeys().indexOf('features') >= 0)
                    features = feature.get('features');
                else
                    features = [ feature ];
                
                //상세내용 셋팅 및 위치이동시 사용하기 위해 복사
                featureClone = features;
                
                features.forEach(function(feature, index) {
                    
                    var strHtml = "";

                    switch(layer.get('id')) {
                        case DATA_TYPE.RDPQ:

                            var pDir = feature.get("PLQ_DRC");
                            var pDirDetail = MapUtil.getPlateDir(feature);
                            var pDirDetailText = "";

                            var bgUrl = "";

                            switch (pDir) {
                                case KEY.plateDir.ONE:
                                    pDirDetailText = pDirDetail.ft_all(pDirDetail.direct);
                                    break;
                                case KEY.plateDir.BI:
                                    pDirDetailText = pDirDetail.ft_stbs;
                                    // $(".popup-content .img-plate .base-left").html(pDirDetail.ft_stbs);
                                    // $(".popup-content .img-plate .base-right").html(pDirDetail.ft_edbs);
                                    break;
                                case KEY.plateDir.FORWARD:
                                    pDirDetailText = pDirDetail.ft_all(pDir);
                                    break;
                            }


                            var FT_KOR_RN = popTableHead.format(feature.get('FT_KOR_RN'));
                            var PLQ_DRC = popTableP.format("시점", pDirDetailText);
                            var RDPQ_GD_SD = popTableP.format("규격", feature.get('RDPQ_GD_SD'));
                            
                            strHtml += FT_KOR_RN
                            strHtml += PLQ_DRC
                            strHtml += RDPQ_GD_SD

                            strHtml += "<hr/>"

                            layerType = KEY.plateType.ROAD;

                            resultHtml = popDiv.format('openDetailPopupCall('+index+')',strHtml);

                            //도로시설물위치일련번호
                            var RDFTYLC_SN = feature.get("RDFTYLC_SN");
                            //도로시설물 공간정보
                            var geom = feature.getGeometry().getCoordinates();

                            buttonHtml = buttonDiv.format(buttonForm.format("moveingPoint("+RDFTYLC_SN+","+geom[0]+","+geom[1]+","+index+")","이동"));

                            buttonHtml += "<hr/>"

                            popupDiv.append(resultHtml);
                            popupDiv.append(buttonHtml);
                            $("#popup").show();
                            overlay.setPosition(coordinate);

                            break;
                    case DATA_TYPE.ENTRC:
                        MapUtil.openPopup(KEY.plateType.ENTRC, features[0]);
                            break;
                    case DATA_TYPE.BULD:
                        MapUtil.openPopup(KEY.plateType.BUILD, features[0]);
                            break;
                    }

                    firstClick = false;

                });
            }
            
            
                /** 팝업처리 end */

           
            
            

            // if(gbn){
            //     var sn, features;

            //     if (feature.getKeys().indexOf('features') >= 0)
            //         features = feature.get('features');
            //     else
            //         features = [feature];

            //     var layerNm = layer.get("title");

            //     if(layerNm == "도로명판"){//도로명판
            //         MapUtil.openPopup(KEY.plateType.ROAD, features[0]);
            //         util.camera = function() {
            //             var title = "{0} {1}-{2}".format(features[0].get('FT_KOR_RN'), features[0].get('BSIS_MNNM'), features[0].get('BSIS_SLNO'));
            //             util.slide_page('up', pages.detailview, { sn : features[0].get('RD_GDFTY_SN'), categoryid: "roadsign", title: title});
            //         };
            //     }else if(layerNm == "건물번호판"){//건물번호판(출입구)
            //         MapUtil.openPopup(KEY.plateType.ENTRC, features[0]);
            //     }else if(layerNm == "건물"){//건물정보
            //         MapUtil.openPopup(KEY.plateType.BUILD, features[0]);
            //     }else{//건물상세
            //         MapUtil.openPopup(KEY.plateType.LOCAL, features[0]);
            //     }

            //     gbn = false;
            // }

            // return;

            // ********************사용안함 ********************

            // if (features.length > 1) {
            //     var itemHtml = "<li onclick=\"{4}\">{0}({1}-{2},{3})</li>";
            //     var strHtml = "",
            //         resultHtml = "<ul>{0}</ul>";

            //     features.forEach(function (feature, index) {
            //         switch (layer.get('id')) {
            //             case DATA_TYPE.BULD:
            //                 var categoryid = "buildsign";
            //                 var title = "{0} {1}-{2}".format(feature.get('FT_KOR_RN'), feature.get('BULD_MNNM'), feature.get('BULD_SLNO'));
            //                 var data = []
            //                 strHtml += itemHtml.format(
            //                     feature.get('BUL_MAN_NO'),
            //                     feature.get('BULD_MNNM'),
            //                     feature.get('BULD_SLNO'),
            //                     feature.get('BULD_NM'),
            //                     "util.slide_page('left', pages.detailview, { sn : '" + feature.get('BUL_MAN_NO') + "', categoryid: '" + categoryid + "', title: '" + title + "' })"
            //                 );
            //                 break;
            //             case DATA_TYPE.RDPQ:
            //                 var categoryid = "roadsign";
            //                 var title = "{0} {1}-{2}".format(feature.get('FT_KOR_RN'), feature.get('BSIS_MNNM'), feature.get('BSIS_SLNO'));

            //                 strHtml += itemHtml.format(
            //                     feature.get('RD_GDFTY_SN'),
            //                     feature.get('BSIS_MNNM'),
            //                     feature.get('BSIS_SLNO'),
            //                     feature.get('FT_KOR_RN'),
            //                     "util.slide_page('up', pages.detailview, { sn : '" + feature.get('RD_GDFTY_SN') + "', categoryid: '" + categoryid + "', title: '" + title + "' })"
            //                 );
            //                 break;
            //             case DATA_TYPE.AREA:
            //                 var categoryid = "areasign";
            //                 var title = "{0} {1}-{2}".format(feature.get('FT_KOR_RN'), feature.get('BSIS_MNNM'), feature.get('BSIS_SLNO'));

            //                 strHtml += itemHtml.format(
            //                     feature.get('RD_GDFTY_SN'),
            //                     feature.get('FT_KOR_RN'),
            //                     '',
            //                     '',
            //                     "util.slide_page('left', pages.detailview, { sn : '" + feature.get('RD_GDFTY_SN') + "', categoryid: '" + categoryid + "', title: '" + title + "' })"
            //                 );
            //                 break;
            //             case DATA_TYPE.BSIS:
            //                 var categoryid = "basenumsign";
            //                 var title = "{0} {1}-{2}".format(feature.get('FT_KOR_RN'), feature.get('BSIS_MNNM'), feature.get('BSIS_SLNO'));

            //                 strHtml += itemHtml.format(
            //                     feature.get('RD_GDFTY_SN'),
            //                     feature.get('FT_KOR_RN'),
            //                     '',
            //                     '',
            //                     "util.slide_page('left', pages.detailview, { sn : '" + feature.get('RD_GDFTY_SN') + "', categoryid: '" + categoryid + "', title: '" + title + "' })"
            //                 );
            //                 break;
            //         }
            //     });

            //     $("#popup-content").html(resultHtml.format(strHtml));
            //     overlay.setPosition(event.coordinate);
            // } else {
            //     feature = features[0];
            //     switch (layer.get('id')) {
            //         case DATA_TYPE.BULD:
            //             var categoryid = "buildsign";
            //             var title = "{0} {1}-{2}".format(feature.get('FT_KOR_RN'), feature.get('BULD_MNNM'), feature.get('BULD_SLNO'));
            //             sn = feature.get('BUL_MAN_NO');
            //             util.slide_page('left', pages.detailview, { sn: sn, categoryid: categoryid, title: title });
            //             break;
            //         case DATA_TYPE.RDPQ:
            //             var categoryid = "roadsign";
            //             var title = "{0} {1}-{2}".format(feature.get('FT_KOR_RN'), feature.get('BSIS_MNNM'), feature.get('BSIS_SLNO'));
            //             sn = feature.get('RD_GDFTY_SN');
            //             util.slide_page('up', pages.detailview, { sn: sn, categoryid: categoryid, title: title });
            //             break;
            //         case DATA_TYPE.AREA:
            //             var categoryid = "areasign";
            //             var title = "{0} {1}-{2}".format(feature.get('FT_KOR_RN'), feature.get('BSIS_MNNM'), feature.get('BSIS_SLNO'));
            //             sn = feature.get('RD_GDFTY_SN');
            //             util.slide_page('left', pages.detailview, { sn: sn, categoryid: categoryid, title: title });
            //             break;
            //         case DATA_TYPE.BSIS:
            //             var categoryid = "basenumsign";
            //             var title = "{0} {1}-{2}".format(feature.get('FT_KOR_RN'), feature.get('BSIS_MNNM'), feature.get('BSIS_SLNO'));
            //             sn = feature.get('RD_GDFTY_SN');
            //             util.slide_page('left', pages.detailview, { sn: sn, categoryid: categoryid, title: title });
            //             break;
            //     }
            // }
        });
    });
    // 선택 이벤트 정의()(--end--)



    // 지도 변경시 핸들러 정의(--start--)
    map.getView().on('propertychange', function (event) {
        switch (event.key) {
//            case 'resolution':
//                if (map.getView().getResolution() > .25)
//                    util.toast("정보를 조회 가능한 레벨이 아닙니다. 확대해 주세요.")
//                var source = getVectorSource(map);
//                if (source)
//                    source.clear();
//                popupCloser(event);
//                break;
        }
    });

    // FeatureInfo 정보 팝업 닫기 핸들러 정의(--start--)
    var popupCloser = function (event) {
        overlay.setPosition(undefined);
        $("#popup-closer").blur();
        event.preventDefault();
    };
    $("#popup-closer").on("click", popupCloser);
    // FeatureInfo 정보 팝업 닫기 핸들러 정의(--end--)

    var ori = true;
    var watchID;
    $("#map_cordova").on("click", function () {
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
    // var onOff = false;
    // $("#map_current").on("click", function() {
    //     //cordova location!!
    //     //getCurrentLocation(locationCallback);

    //     //openLayers geolocation

    //     var geolocation = new ol.Geolocation({
    //         tracking: true,
    //         projection: map.getView().getProjection()
    //     });
    //     if (onOff) {
    //         onOff = false;

    //     } else {
    //         onOff = true;

    //         geolocation.on('change', function(evt) {
    //             var coord = geolocation.getPosition();

    //             var iconFeature = new ol.Feature({
    //                 geometry: new ol.geom.Point(coord)
    //             });
    //             iconFeature.getGeometry().setCoordinates(coord);

    //             console.log('coord ' + coord);
    //             map.getView().setCenter(coord);
    //         });
    //     }

    //     console.log('onOff ' + onOff);

    // });

    // Geolocation Control
    var geolocation = new ol.Geolocation( /** @type {olx.GeolocationOptions} */({
        //tracking: true,
        projection: map.getView().getProjection(),
        trackingOptions: {
            maximumAge: 10000,
            enableHighAccuracy: true,
            timeout: 600000
        }
    }));


    var accuracyFeature = new ol.Feature();
    geolocation.on('change:accuracyGeometry', function () {
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
    geolocation.on('change:position', function () {
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

    geolocation.on('error', function () {
        alert('geolocation error');
        // FIXME we should remove the coordinates in positions
    });

    var isCheck = true;
    $("#map_current").click(function () {
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


    // 지도 변경시 핸들러 정의(--end--)

    // topMenu 핸들러 정의(--start--)
    //    $(".ui-controlgroup-controls  .ui-checkbox input:checkbox").bind("change", function(event) {
    //        var element = event.currentTarget;
    //        if ($(element).is(":checked")) {
    //            if (map.getView().getResolution() >= eval("layers.{0}.getMaxResolution()".format(element.name)))
    //                eval("map.getView().setResolution(layers.{0}.getMaxResolution() / 2)".format(element.name));
    //            eval("map.addLayer(layers.{0})".format(element.name));
    //        } else {
    //            eval("map.removeLayer(layers.{0})".format(element.name));
    //        }
    //        element.blur();
    //        return false;
    //    });

    // topMenu 핸들러 정의(--end--)


    /*********** 지도 화면 핸들러 (-- end --) ***********/

    //    setTimeout(function() {
    //        if (init) {
    //            switch (init) {
    //                case 'roadsign':
    //                    $(".ui-controlgroup-controls  .ui-checkbox input:checkbox[name='rdpq']").click();
    //                    break;
    //                case 'areasign':
    //                    $(".ui-controlgroup-controls  .ui-checkbox input:checkbox[name='area']").click();
    //                    break;
    //                case 'basenumsign':
    //                    $(".ui-controlgroup-controls  .ui-checkbox input:checkbox[name='bsis']").click();
    //                    break;
    //                case 'buildsign':
    //                    $(".ui-controlgroup-controls  .ui-checkbox input:checkbox[name='buld']").click();
    //                    break;
    //            }
    //        }
    //    }, 1500);

    setTimeout(function(){
        def.resolve(true);
    }, 300);
    return def.promise();
};
// 지도 초기화 함수(--end--)

var getSource = function (source) {
    if (source.getSource) {
        return getSource(source.getSource());
    } else {
        if (source instanceof ol.source.Vector)
            return source;
        return;
    }
};

var getVectorSource = function (mapObj) {
    var source;
    mapObj.getLayers().forEach(function (item, index) {
        if (item instanceof ol.layer.Vector)
            source = getSource(item);
    });

    return source;
};


var getFeatureLayer = function (options) {
    var vectorSource = new ol.source.Vector({
        id: "vectorSource:" + options.typeName,
        format: new ol.format.WFS(),
        loader: function (extent, resolution, projection) {
            extent = ol.proj.transformExtent(extent, baseProjection.getCode(), sourceProjection.getCode());
            var param = {
                SERVICE: 'WFS',
                VERSION: '1.1.0',
                REQUEST: 'GetFeature',
                bbox: extent.join(','),
                srName: serviceProjection.getCode(),
                typeName: options.typeName
            };

            var urldata = URLs.postURL(URLs.mapServiceLink, param);

            util.showProgress();
            util.postAJAX('', urldata, true)
                .then(function (context, rcode, results) {
                    util.dismissProgress();
                    var features = new ol.format.WFS().readFeatures(results, { featureProjection: baseProjection.getCode(), dataProjection: sourceProjection.getCode() });
                    // util.toast("{0} 데이터 {1}건 조회".format(options.title, features.length))
                    if(options.title =='도로명판'){
                        $("#legendRdpq").text('도로 ' + features.length + ' 건');
                    }else if(options.title =='기초번호판'){
                        $("#legendBsis").text('기초 ' + features.length + ' 건');
                    }else if(options.title =='지역안내판'){
                        $("#legendArea").text('지역 ' + features.length + ' 건');
                    }
                    
                    console.log("The number of features viewed is {0}. extent({1})".format(features.length, extent.join(',')));
                    vectorSource.addFeatures(features);
                }, function (context, xhr, error) {
                    console.log("조회 error >> " + error + '   ' + xhr);
                    util.dismissProgress();
                });
            if(options.viewProgress != undefined && !options.viewProgress)
                util.dismissProgress();
        },
        strategy: ol.loadingstrategy.bbox
    });

    var source;

    if (options.cluster) {
        source =
            new ol.source.Cluster({
                distance: options.cluster.distance,
                geometryFunction: function (feature) {
                    if (feature.getGeometry().getType() != "Point")
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
        source: source
    }
    vectorOptions.style = function (feature, resolution) {
        return defaultStyle(feature, resolution, options);
    }

    return new ol.layer.Vector(vectorOptions);
};

var getCurrentLocation = function (callback_func) {
    console.log('getCurrentLocation');
    var geolocationOptions = {
        maximumAge: 0,
        timeout: 8000,
        enableHighAccuracy: true
    };

    util.showProgress();

    navigator.geolocation.getCurrentPosition(
        function (position) {

            util.dismissProgress();
            if (callback_func != undefined) {
                callback_func(position);
            }
        },
        function (error) {
            util.dismissProgress();

            // PositionError.PERMISSION_DENIED = 1;
            // PositionError.POSITION_UNAVAILABLE = 2;
            // PositionError.TIMEOUT = 3;
            var fn_msg = function () { };

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

//좌표이동
var featureClone;
var featureIndex;
var layerType = "";
function moveingPoint(sn,pointX,pointY,index){
    console.log(sn);
    console.log(pointX + " , " + pointY);

    featureIndex = index;

    //팝업닫기
    $("#popup").hide();

    //기본레이어 삭제
    map.removeLayer(layers.rdpq);
    map.removeLayer(layers.bsis);
    map.removeLayer(layers.area);

    /** 위치이동 레이어 start */
    var moveingPoint_source = new ol.source.Vector({});

    var moveingPoint_layer = new ol.layer.Vector({
        map: map,
        title : '위치이동',
        source: moveingPoint_source
    });

    map.addLayer(moveingPoint_layer);
    layers.move = moveingPoint_layer;

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


    var oldPoint = new ol.geom.Point([pointX,pointY]);

    moveingPointFeature.setGeometry(oldPoint);
    moveingPoint_source.addFeature(moveingPointFeature);
    
}

function insertMoveingPoint(sn, pointX, pointY){
    if (confirm('시설물의 위치를 이동하시겠습니까?') == true){
        var param = {sigCd : app.info.sigCd , rdftylcSn : sn, posX : pointX, posY : pointY, workId : app.info.opeId ,mode:'11'};
        var movePointUrl = URLs.postURL(URLs.moveingPoint, param);
        util.postAJAX('',movePointUrl)
        .then( function(context, rCode, results) {

            console.log(results);

            var layerList = map.getLayers().getArray();
            for(var i = 0 ; i < layerList.length; i++){
                if(layerList[i].get('title') == '위치이동'){
                    var moveingPoint_source = layerList[i].getSource();

                    moveingPoint_source.clear();
                    map.removeLayer(layers.move);
                    $("#popup").hide();
                }
            }
            
            if (layerType != KEY.plateType.BUILD || layerType != KEY.plateType.ENTRC) {
                map.removeLayer(layers.buld);
                map.removeLayer(layers.entrc);
                map.addLayer(layers.rdpq);
                map.addLayer(layers.bsis);
                map.addLayer(layers.area);
            } else {
                map.removeLayer(layers.rdpq);
                map.removeLayer(layers.bsis);
                map.removeLayer(layers.area);
                map.addLayer(layers.buld);
                map.addLayer(layers.entrc);
            }
            
        });

    }
    
}

function clearMoveMode(){
    if (confirm('시설물의 위치를 이동을 취소하시겠습니까?') == true){
        layerClear();
        $("#popup").hide();
    }
}

function layerClear(){
    var layerList = map.getLayers().getArray();
        for(var i = 0 ; i < layerList.length; i++){
            if(layerList[i].get('title') == '위치이동'){
                var moveingPoint_source = layerList[i].getSource();

                moveingPoint_source.clear();
                map.removeLayer(layers.move);
                
            }
        }
        if (layerType != KEY.plateType.BUILD || layerType != KEY.plateType.ENTRC) {
            map.removeLayer(layers.buld);
            map.removeLayer(layers.entrc);
            map.addLayer(layers.rdpq);
            map.addLayer(layers.bsis);
            map.addLayer(layers.area);
        } else {
            map.removeLayer(layers.rdpq);
            map.removeLayer(layers.bsis);
            map.removeLayer(layers.area);
            map.addLayer(layers.buld);
            map.addLayer(layers.entrc);
        }
        
}


//상세정보 열기
function openDetailPopupCall(index){

    // $("#popup").hide();

    MapUtil.openDetail(layerType, featureClone[index]);
    // util.camera = function() {
    //     var title = "{0} {1}-{2}".format(featureClone[index].get('FT_KOR_RN'), featureClone[index].get('BSIS_MNNM'), featureClone[index].get('BSIS_SLNO'));
    //     util.slide_page('up', pages.detailview, { sn : featureClone[index].get('RD_GDFTY_SN'), categoryid: "roadsign", title: title});
    // };

    
}

function setSimplePop(coordinate){

        
}

