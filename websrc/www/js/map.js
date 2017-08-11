var KEY = {
    plateType: { "ROAD": 1, "BASE": 2, "LOCAL": 3, "BUILD": 4, "ENTRC": 5 },
    plateDir: { "ONE": "00100", "BI": "00200", "FORWARD": "00300", "ONE_S": "00101", "ONE_E": "00102" }
};
var MapUtil = {
    init: function() {
        MapUtil.controls.init();
        MapUtil.handler.init();
    },
    state: {
        photo: [L = { isPhoto: false, edited: false }, M = { isPhoto: false, edited: false }]
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
                $(".dataWrap").hide();
            });
        },
        photoToggleHandler: function(layerID, f) {
            $(".detailView .infoWrap .infoHeader .photo").click(function() {
                // $(".detailView .infoWrap .infoContent .infoTable, .detailView .infoWrap .infoContent .photoWrap").toggle();
                //검정막
                wrapWindowByMask('mask');
                //옵션안됨
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
                //초기화
                $(".picImg img").attr("src", '');
                $(".picImg imaFilSn").attr("value", '');

                // 사진모드
                if ($(".detailView .infoWrap .infoContent .photoWrap").css("display") != "none") {

                    switch (layerID) {
                        case DATA_TYPE.RDPQ:
                            // var sn = f.get("RD_GDFTY_SN");
                            var param = { "sn": rdGdftySn, "sigCd": app.info.sigCd, "isImages": true };
                            var url = URLs.postURL(URLs.roadsignlink, param);
                            break;
                        case DATA_TYPE.AREA:
                            // var sn = f.get("RD_GDFTY_SN");
                            var param = { "sn": rdGdftySn, "sigCd": app.info.sigCd, "isImages": true };
                            var url = URLs.postURL(URLs.roadsignlink, param);
                            break;
                        case DATA_TYPE.BSIS:
                            // var sn = f.get("RD_GDFTY_SN");
                            var param = { "sn": rdGdftySn, "sigCd": app.info.sigCd, "isImages": true };
                            var url = URLs.postURL(URLs.roadsignlink, param);
                            break;
                        case DATA_TYPE.ENTRC:
                            var sn = f.get("BUL_MAN_NO");
                            var param = { "sn": sn, "sigCd": app.info.sigCd, "isImages": true };
                            var url = URLs.postURL(URLs.entrclink, param);
                            break;
                        case DATA_TYPE.BULD:
                            var sn = f.get("BUL_MAN_NO");
                            var param = { "sn": sn, "sigCd": app.info.sigCd, "isImages": true };
                            var url = URLs.postURL(URLs.buildSelectlink, param);
                            break;
                    }

                    util.showProgress();
                    util.postAJAX({}, url).then(
                        function(context, rcode, results) {
                            // var emptyObj = "<img style='height: 220px; width: 100%; object-fit: contain' src=''/>";
                            // emptyObj+= "<input id='imaFilSn' type='hidden' value=''/>";
                            // emptyObj+= "<input id='tbGbn' type='hidden' value='{0}'/>";

                            if (rcode != 0) {
                                util.toast("사진정보 읽어오는데 실패 하였습니다", "error");
                                util.dismissProgress();
                                return;
                            }

                            var data = results.data;
                            MapUtil.state.photo = [{ isPhoto: false, edited: false }, { isPhoto: false, edited: false }];

                            if (!util.isEmpty(data)) {

                                for (var index in data.files) {
                                    var image = data.files[index];
                                    if (util.isEmpty(image.base64) === false && image.base64.length > 0) {
                                        var obj = "<img style='height: 220px; width: 100%; object-fit: contain' src='data:image;base64," + image.base64 + "'/>";
                                        obj += "<input id='imaFilSn' type='hidden' value='" + image.imageFilesSn + "'/>";
                                        obj += "<input id='tbGbn' type='hidden' value='" + image.tbGbn + "'/>";

                                        $(".picInfo." + image.tbGbn + " .picImg").html(obj);

                                        if (image.tbGbn == "L") {
                                            MapUtil.state.photo[0].isPhoto = true;
                                        } else {
                                            MapUtil.state.photo[1].isPhoto = true;
                                        }

                                    }
                                }



                                // if(data.files.length == 1 && data.files[0].tbGbn == 'L'){
                                //     var image = data.files[0];

                                //     var obj = "<img style='height: 220px; width: 100%; object-fit: contain' src='data:image;base64," + image.base64 + "'/>";
                                //     obj+= "<input id='imaFilSn' type='hidden' value='"+image.imageFilesSn+"'/>";
                                //     obj+= "<input id='tbGbn' type='hidden' value='"+image.tbGbn+"'/>";

                                //     $(".picInfo.loc .picImg").html(obj);
                                //     $(".picInfo.manage .picImg").html(emptyObj.format('M'));

                                //     MapUtil.state.photo.push({isPhoto: true, edited: false});
                                //     MapUtil.state.photo.push({isPhoto: false, edited: false});

                                // }else if(data.files.length == 1 && data.files[0].tbGbn == 'M'){

                                //     var image = data.files[0];

                                //     var obj = "<img style='height: 220px; width: 100%; object-fit: contain' src='data:image;base64," + image.base64 + "'/>";
                                //     obj+= "<input id='imaFilSn' type='hidden' value='"+image.imageFilesSn+"'/>";
                                //     obj+= "<input id='tbGbn' type='hidden' value='"+image.tbGbn+"'/>";

                                //     $(".picInfo.loc .picImg").html(emptyObj.format('L'));
                                //     $(".picInfo.manage .picImg").html(obj);

                                //     MapUtil.state.photo.push({isPhoto: true, edited: false});
                                //     MapUtil.state.photo.push({isPhoto: false, edited: false});

                                // }else if(data.files.length == 2){

                                //     for (var index in data.files) {
                                //         var image = data.files[index];
                                //         if (util.isEmpty(image.base64) === false && image.base64.length > 0) {
                                //             var obj = "<img style='height: 220px; width: 100%; object-fit: contain' src='data:image;base64," + image.base64 + "'/>";
                                //             obj+= "<input id='imaFilSn' type='hidden' value='"+image.imageFilesSn+"'/>";
                                //             obj+= "<input id='tbGbn' type='hidden' value='"+image.tbGbn+"'/>";
                                //             $($(".picImg")[index]).html(obj);

                                //             MapUtil.state.photo.push({isPhoto: true, edited: false});
                                //         }
                                //     }
                                // }

                                // switch(data.files.length) {
                                //     case 0:
                                //         MapUtil.state.photo = [{isPhoto: false, edited: false}, {isPhoto: false, edited: false}];
                                //         break;
                                //     case 1:
                                //         MapUtil.state.photo = [{isPhoto: true, edited: false}, {isPhoto: false, edited: false}];
                                //         break;
                                //     default:
                                //         MapUtil.state.photo = [{isPhoto: true, edited: false}, {isPhoto: true, edited: false}];
                                // }

                                //앞에서 부터 2건만 처리
                                // if(index == 1){
                                //     break;
                                // }


                            } else {

                                // $(".picInfo.loc .picImg").html(emptyObj.format('L'));
                                // $(".picInfo.manage .picImg").html(emptyObj.format('M'));

                                // MapUtil.state.photo = [{isPhoto: false, edited: false}, {isPhoto: false, edited: false}];
                            }

                            // util.toast('최근 사진으로 조회');
                            util.dismissProgress();

                        }
                    );
                }

            });
        },
        takePhotoHandler: function() {
            $(".photoWrap .picInfo .btnPoint").click(function(evt) {
                var _this = $(this);
                util.takePictureFromCamera(function(ret) {
                    if (_this.parent().hasClass('long')) {
                        MapUtil.state.photo[1].edited = true;
                    } else if (_this.parent().hasClass('short')) {
                        MapUtil.state.photo[0].edited = true;
                    }
                    var obj = "data:image/jpeg;base64," + ret.src;
                    $(evt.target).parent().parent().children(".picImg").children("img").attr("src", obj)
                });
            });
        },
        delPhotoHandler: function() {
            $(".photoWrap .picInfo .btnNormal").click(function(evt) {
                var _this = $(this);
                if ($(evt.target).parent().parent().children(".picImg").html() != "") {
                    navigator.notification.confirm(msg.delPhoto,
                        function(btnIndex) {
                            if (btnIndex == 1) {
                                if (_this.parent().hasClass('long')) {
                                    MapUtil.state.photo[1].edited = MapUtil.state.photo[1].isPhoto;
                                } else if (_this.parent().hasClass('short')) {
                                    MapUtil.state.photo[0].edited = MapUtil.state.photo[0].isPhoto;
                                }
                                $(evt.target).parent().parent().children(".picImg").html("");
                            }
                        }, '알림', ['삭제', '취소']);
                }

            });
        },
    },
    controls: {
        init: function() {
            ol.inherits(MapUtil.controls.legendControl, ol.control.Control);
            ol.inherits(MapUtil.controls.currentControl, ol.control.Control);
            ol.inherits(MapUtil.controls.newPointControl, ol.control.Control);

        },
        /**
         * @constructor
         * @extends {ol.control.Control}
         * @param {Object=} opt_options Control options.
         */
        legendControl: function(opt_options) {
            var options = opt_options || {};

            var legend = document.createElement('div');
            legend.className = "legend ol-unselectable ol-control";
            var legendHtml = '<ul>';
            legendHtml += '<li class="rdpq">도로명판<span class="total">0건</span></li>';
            legendHtml += '<li class="bsis">기초번호판<span class="total">0건</span></li>';
            legendHtml += '<li class="area">지역안내판<span class="total">0건</span></li>';
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
            button.innerHTML = '<img src="image/current.png" />';

            var geolocation = new ol.Geolocation( /** @type {olx.GeolocationOptions} */ {
                tracking: true,
                projection: baseProjection,
                trackingOptions: {
                    maximumAge: 10000,
                    enableHighAccuracy: true,
                    timeout: 600000
                }
            });

            var curPosition = function() {
                var coordinate = geolocation.getPosition();
                // map.getView().setCenter(coordinate);

                setPosition(coordinate);
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
        newPointControl: function(opt_options) {
            // var button = document.createElement('button');
            // button.innerHTML = '<img src="image/newPos_plus.png" />';
            var layerStateGbn = "on";
            var newPoint = function() {

                if (layerStateGbn == "on") {
                    //마커지우기
                    // clearSource('위치이동');

                    //레이어 초기화
                    removeLayers();

                    //센터 포인트 찍기
                    // var movingPoint_source = addMoveLayer();

                    // var moveingPointFeature = new ol.Feature();
                    //         moveingPointFeature.setStyle(new ol.style.Style({
                    //             image: new ol.style.Circle({
                    //                 radius: 10,
                    //                 fill: new ol.style.Fill({
                    //                     color: '#00004d'
                    //                 }),
                    //                 stroke: new ol.style.Stroke({
                    //                     color: '#fff',
                    //                     width: 2
                    //                 })
                    //             })
                    //         }));

                    // var centerPoint = new ol.geom.Point(map.getView().getCenter());
                    // moveingPointFeature.setGeometry(centerPoint);
                    // movingPoint_source.addFeature(moveingPointFeature);
                    if (map.getView().getZoom() < 14) {
                        map.getView().setZoom(14);
                    }
                    //범례숨김
                    $(".legend").hide();
                    //방위 숨김
                    $(".ol-rotate").hide();
                    //현위치 숨김
                    $(".curPosition").hide();

                    //심플팝업숨김
                    $("#popup").hide();

                    //위치마커 및 버튼 표시
                    $("#newPos").show();
                    //버튼영역 버튼 표시
                    $(".buttonDiv").show();
                    //메모초기화
                    closeNewPosMemo();

                    // $(".newPosition button img").attr("src","image/newPos_cancle.png");

                    layerStateGbn = "off";
                } else {

                    //위치마커 및 버튼 표시
                    $("#newPos").hide();
                    //버튼영역 숨김
                    $(".buttonDiv").hide();
                    //메모초기화
                    closeNewPosMemo();

                    var context = app.context;

                    layerToggle(context);

                    // $(".newPosition button img").attr("src","image/newPos_plus.png");

                    layerStateGbn = "on";
                }

            }

            // button.addEventListener('click', newPoint, false);

            var element = document.createElement('div');
            element.className = 'legend newPosition ol-unselectable ol-control';

            var newPosHtml = "<ul><li class='nPos'>신규위치등록</li></ul>";
            element.innerHTML = newPosHtml;

            element.addEventListener('click', newPoint, false);

            // element.appendChild(button);

            ol.control.Control.call(this, {
                element: element,
                target: options.target
            });

        }
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
    openDetail: function(layerID, f, rdGdftySn) {
        var detailTaget = '#detailView';

        switch (layerID) {
            case DATA_TYPE.RDPQ:
                url = pages.detail_road;
                header = "도로명판";
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
        }

        $(detailTaget).load(url.link(), function() {
            MapUtil.setDetail(layerID, f);
            MapUtil.handler.photoToggleHandler(layerID, f);
            MapUtil.handler.takePhotoHandler();
            MapUtil.handler.delPhotoHandler();
            MapUtil.handler.dataPopupCloserHandler();

            $("#detailView").popup("open", { transition: "slideup" });
        })
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
    setDetail: function(layerID, f) {
        var codeList

        switch (layerID) {
            case DATA_TYPE.RDPQ:
                // var sn = f.get("RD_GDFTY_SN");
                var link = URLs.roadsignlink;
                MapUtil.setValues(layerID, link, rdGdftySn);

                break;
            case DATA_TYPE.AREA:
                // var sn = f.get("RD_GDFTY_SN");
                var link = URLs.roadsignlink;

                MapUtil.setValues(layerID, link, rdGdftySn);

                break;
            case DATA_TYPE.BSIS:
                // var sn = f.get("RD_GDFTY_SN");
                var link = URLs.roadsignlink;

                MapUtil.setValues(layerID, link, rdGdftySn);

                break;
            case DATA_TYPE.ENTRC:
                var sn = f.get("BUL_MAN_NO");
                var link = URLs.entrclink;

                MapUtil.setValues(layerID, link, sn);

                break;

            case DATA_TYPE.BULD:
                var sn = f.get("BUL_MAN_NO");
                var link = URLs.buildSelectlink;

                MapUtil.setValues(layerID, link, sn);

                break;
        }

    },
    setValues: function(layerID, link, sn) {
        var url = URLs.postURL(link, { "sn": sn, "sigCd": app.info.sigCd, "workId": app.info.opeId });
        util.showProgress();
        util.postAJAX({}, url).then(
            function(context, rCode, results) {
                //통신오류처리
                if (rCode != 0 || results.response.status < 0) {
                    navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                    return;
                }

                var data = results.data;

                //일련번호
                $("#sn").val(sn);
                //위치일련번호
                $("#rdFtyLcSn").val(data.rdFtyLcSn);

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
                //사진건수
                $(".infoHeader .photo .photoNum").html(data.cntFiles);


                switch (layerID) {
                    case DATA_TYPE.RDPQ:

                        //제목창
                        var title = "<span class='label'>[{0}] {1} {2}{3} {4} {5}{6}<span>".format(
                            data.rdGdftySeLbl,
                            (data.bsisRnLbl ? data.bsisRnLbl : '도로명없음'),
                            (data.frontStartBaseMasterNo),
                            (data.frontStartBaseSlaveNo != "0" ? '-' + data.frontStartBaseSlaveNo : ''),
                            (data.plqDirection == '00100' ? '→' : (data.plqDirection == '00200' ? '↔' : (data.plqDirection == '00300' ? '↑' : '?'))),
                            (data.frontEndBaseMasterNo),
                            (data.frontEndBaseSlaveNo != "0" ? '-' + data.frontEndBaseSlaveNo : '')
                        );
                        $(".title").append(title);
                        //최종점검일자
                        var lastCheckDate = data.lastCheckDate == null ? "점검이력이 없습니다." : "{0}년{1}월{2}일".format(data.lastCheckDate.substr(0, 4), data.lastCheckDate.substr(4, 2), data.lastCheckDate.substr(6, 2));
                        $("#lastCheckDate").html(lastCheckDate);
                        $("#lastCheckDate").addClass("edit");
                        //도로시설물
                        $("#rdftySeLbl").html(data.rdftySeLbl);
                        $("#rdftySe").html(data.rdftySe);
                        //설치도로명
                        $("#bsisRnLbl").html(data.bsisRnLbl);
                        //설치기초번호
                        var bsis = "{0}{1}".format((data.bsisMnnm ? data.bsisMnnm : ''), (data.bsisSlno != "0" ? '-' + data.bsisSlno : ''));
                        $("#bsis").html(bsis);
                        //설치유형
                        $("#instSeLbl").html(data.instSeLbl);
                        $("#instSe").html(data.instSe);
                        //제작형식
                        $("#gdftyMnf").html(data.gdftyMnf);
                        $("#gdftyMnfLbl").html(data.gdftyMnfLbl);
                        //설치지점
                        $("#instSpotCd").html(data.instSpotCd);
                        $("#instSpotCdLbl").html(data.instSpotCdLbl);
                        $("#instSpotCdLbl").addClass("edit");
                        //교차로유형
                        $("#instCrossCd").html(data.instCrossCd);
                        $("#instCrossCdLbl").html(data.instCrossCdLbl);
                        $("#instCrossCdLbl").addClass("edit");
                        //앞면 도로명(국문)
                        $("#frontKoreanRoadNm").html(data.frontKoreanRoadNm);
                        $("#frontKoreanRoadNm").addClass("edit");
                        //앞면 도로명(로마자)
                        $("#frontRomeRoadNm").html(data.frontRomeRoadNm);
                        //앞면시작기초번호(0-0)
                        $("#frontStartBaseMasterNo").html(data.frontStartBaseMasterNo);
                        $("#frontStartBaseSlaveNo").html(data.frontStartBaseSlaveNo);
                        var frontStartBaseNo = "{0}{1}".format(data.frontStartBaseMasterNo, (data.frontStartBaseSlaveNo != "0" ? '-' + data.frontStartBaseSlaveNo : ''));
                        $("#frontStartBaseNo").html(frontStartBaseNo);
                        $("#frontStartBaseNo").addClass("edit");
                        //앞면종료기초번호(0-0)
                        $("#frontEndBaseMasterNo").html(data.frontEndBaseMasterNo);
                        $("#frontEndBaseSlaveNo").html(data.frontEndBaseSlaveNo);
                        var frontEndBaseNo = "{0}{1}".format(data.frontEndBaseMasterNo, (data.frontEndBaseSlaveNo != "0" ? '-' + data.frontEndBaseSlaveNo : ''));
                        $("#frontEndBaseNo").html(frontEndBaseNo);
                        $("#frontEndBaseNo").addClass("edit");
                        if (data.bdrclAt == 1) {
                            // $(".bk").show();
                            //뒷면 도로명(국문)
                            $("#backKoreanRoadNm").html(data.backKoreanRoadNm);
                            $("#backKoreanRoadNm").addClass("edit");
                            //뒷면 도로명(로마자)
                            $("#backRomeRoadNm").html(data.backRomeRoadNm);
                            //뒷면시작기초번호(0-0)
                            $("#backStartBaseMasterNo").html((data.backStartBaseMasterNo ? data.backStartBaseMasterNo : ''));
                            $("#backStartBaseSlaveNo").html((data.backStartBaseSlaveNo ? data.backStartBaseSlaveNo : ''));
                            var backStartBaseNo = "{0}{1}".format((data.backStartBaseMasterNo ? data.backStartBaseMasterNo : ''), (data.backStartBaseSlaveNo != "0" ? '-' + data.backStartBaseSlaveNo : ''));
                            $("#backStartBaseNo").html(backStartBaseNo);
                            $("#backStartBaseNo").addClass("edit");
                            //뒷면종료기초번호(0-0)
                            $("#backEndBaseMasterNo").html((data.backEndBaseMasterNo ? data.backEndBaseMasterNo : ''));
                            $("#backEndBaseSlaveNo").html((data.backEndBaseSlaveNo ? data.backEndBaseSlaveNo : ''));
                            var backEndBaseNo = "{0}{1}".format((data.backEndBaseMasterNo ? data.backEndBaseMasterNo : ''), (data.backEndBaseSlaveNo != "0" ? '-' + data.backEndBaseSlaveNo : ''));
                            $("#backEndBaseNo").html(backEndBaseNo);
                            $("#backEndBaseNo").addClass("edit");
                        } else {
                            $(".bk").hide();
                        }

                        //도로명판종류
                        $("#gdftyForm").html(data.gdftyForm);
                        $("#gdftyFormLbl").html(data.gdftyFormLbl);
                        //사용대상
                        $("#useTarget").html(data.useTarget);
                        $("#useTargetLbl").html(data.useTargetLbl);
                        $("#useTargetLbl").addClass("edit");
                        //사용방향
                        $("#plqDirection").html(data.plqDirection);
                        $("#plqDirectionLbl").html(data.plqDirectionLbl);
                        $("#plqDirectionLbl").addClass("edit");
                        //양면여부
                        $("#bdrclAt").html(data.bdrclAt);
                        $("#bdrclAtLbl").html(data.bdrclAtLbl);
                        //제2외국어여부
                        $("#scfggMkty").html(data.scfggMkty);
                        $("#scfggMktyLbl").html(data.scfggMktyLbl);
                        $("#scfggMktyLbl").addClass("edit");
                        //언어1
                        $("#scfggUla1").html(data.scfggUla1);
                        $("#scfggUla1Lbl").html(data.scfggUla1Lbl);
                        $("#scfggUla1Lbl").addClass("edit");
                        //언어2
                        $("#scfggUla2").html(data.scfggUla2);
                        $("#scfggUla2Lbl").html(data.scfggUla2Lbl);
                        $("#scfggUla2Lbl").addClass("edit");
                        //규격
                        $("#rdpqGdSd").html(data.rdpqGdSd);
                        $("#rdpqGdSdLbl").html(data.rdpqGdSdLbl);
                        $("#rdpqGdSdLbl").addClass("edit");
                        //가로*세로*두께
                        $("#gdftyWide").html(data.gdftyWide);
                        $("#gdftyVertical").html(data.gdftyVertical);
                        $("#gdftyThickness").html(data.gdftyThickness);
                        var gdftyWVT = "{0}*{1}*{2}".format(data.gdftyWide, data.gdftyVertical, data.gdftyThickness);
                        $("#gdftyWVT").html(gdftyWVT);
                        $("#gdftyWVT").addClass("edit");
                        //단가(원)
                        $("#gdftyUnitPrice").html(data.gdftyUnitPrice);
                        $("#gdftyUnitPrice").addClass("edit");
                        //설치상태
                        $("#delStateCd").html(data.delStateCd);
                        $("#delStateCdLbl").html(data.delStateCdLbl);
                        $("#delStateCdLbl").addClass("edit");
                        //점검내용
                        $("#checkComment").html(data.checkComment);
                        $("#checkComment").addClass("edit");

                        break;
                    case DATA_TYPE.AREA:
                        //제목창
                        var title = "<span class='label'>[{0}] {1} {2}{3}<span>".format(
                            data.rdGdftySeLbl,
                            (data.bsisRnLbl ? data.bsisRnLbl : '도로명없음'),
                            (data.bsisMnnm),
                            (data.bsisSlno != "0" ? '-' + data.bsisSlno : '')
                        );
                        $(".title").append(title);
                        //최종점검일자
                        var lastCheckDate = data.lastCheckDate == null ? "점검이력이 없습니다." : "{0}년{1}월{2}일".format(data.lastCheckDate.substr(0, 4), data.lastCheckDate.substr(4, 2), data.lastCheckDate.substr(6, 2));
                        $("#lastCheckDate").html(lastCheckDate);
                        $("#lastCheckDate").addClass("edit");
                        //도로시설물
                        // $("#rdGdftySeLbl").html(data.rdGdftySeLbl);
                        // $("#rdGdftySe").html(data.rdGdftySe);
                        $("#rdftySeLbl").html(data.rdftySeLbl);
                        $("#rdftySe").html(data.rdftySe);
                        //설치도로명
                        $("#bsisRnLbl").html(data.bsisRnLbl);
                        //설치기초번호
                        var bsis = "{0}{1}".format((data.bsisMnnm ? data.bsisMnnm : ''), (data.bsisSlno != "0" ? '-' + data.bsisSlno : ''));
                        $("#bsis").html(bsis);
                        //설치유형
                        $("#instSeLbl").html(data.instSeLbl);
                        $("#instSe").html(data.instSe);
                        //제작형식
                        $("#gdftyMnf").html(data.gdftyMnf);
                        $("#gdftyMnfLbl").html(data.gdftyMnfLbl);
                        //설치지점
                        $("#instSpotCd").html(data.instSpotCd);
                        $("#instSpotCdLbl").html(data.instSpotCdLbl);
                        $("#instSpotCdLbl").addClass("edit");
                        //교차로유형
                        $("#instCrossCd").html(data.instCrossCd);
                        $("#instCrossCdLbl").html(data.instCrossCdLbl);
                        $("#instCrossCdLbl").addClass("edit");
                        //한글도로명
                        $("#area_areaKorRn").html(data.area_areaKorRn);
                        $("#area_areaKorRn").addClass("edit");
                        //로마자
                        $("#area_romRn").html(data.area_romRn);
                        //시작기초번호(0-0)]
                        var area_stbsNo = "{0}{1}".format(data.area_stbsMn, (data.area_stbsSn != "0" ? '-' + data.area_stbsSn : ''));
                        $("#area_stbsNo").html(area_stbsNo);
                        //종료기초번호(0-0)
                        var area_edbsNo = "{0}{1}".format(data.area_edbsMn, (data.area_edbsSn != "0" ? '-' + data.area_edbsSn : ''));
                        $("#area_edbsNo").html(area_edbsNo);
                        //광고에따른 분류
                        $("#area_advrtsCd").html(data.area_advrtsCd);
                        $("#area_advrtsCdLbl").html(data.area_advrtsCdLbl);
                        $("#area_advrtsCdLbl").addClass("edit");
                        //광고내용
                        $("#area_advCn").html(data.area_advCn);
                        $("#area_advCn").addClass("edit");
                        //기타내용
                        $("#area_etcCn").html(data.area_etcCn);
                        $("#area_etcCn").addClass("edit");
                        //안내시설형식
                        $("#gdftyForm").html(data.gdftyForm);
                        $("#gdftyFormLbl").html(data.gdftyFormLbl);
                        //사용대상
                        $("#useTarget").html(data.useTarget);
                        $("#useTargetLbl").html(data.useTargetLbl);
                        $("#useTargetLbl").addClass("edit");
                        //양면여부
                        $("#bdrclAt").html(data.bdrclAt);
                        $("#bdrclAtLbl").html(data.bdrclAtLbl);
                        //제2외국어여부
                        $("#scfggMkty").html(data.scfggMkty);
                        $("#scfggMktyLbl").html(data.scfggMktyLbl);
                        $("#scfggMktyLbl").addClass("edit");
                        //언어1
                        $("#scfggUla1").html(data.scfggUla1);
                        $("#scfggUla1Lbl").html(data.scfggUla1Lbl);
                        $("#scfggUla1Lbl").addClass("edit");
                        //언어2
                        $("#scfggUla2").html(data.scfggUla2);
                        $("#scfggUla2Lbl").html(data.scfggUla2Lbl);
                        $("#scfggUla2Lbl").addClass("edit");
                        //규격
                        $("#area_areaGdSd").html(data.area_areaGdSd);
                        $("#area_areaGdSdLbl").html(data.area_areaGdSdLbl);
                        $("#area_areaGdSdLbl").addClass("edit");
                        //가로*세로*두께
                        $("#gdftyWide").html(data.gdftyWide);
                        $("#gdftyVertical").html(data.gdftyVertical);
                        $("#gdftyThickness").html(data.gdftyThickness);
                        var gdftyWVT = "{0}*{1}*{2}".format(data.gdftyWide, data.gdftyVertical, data.gdftyThickness);
                        $("#gdftyWVT").html(gdftyWVT);
                        $("#gdftyWVT").addClass("edit");
                        //단가(원)
                        $("#gdftyUnitPrice").html(data.gdftyUnitPrice);
                        $("#gdftyUnitPrice").addClass("edit");
                        //설치상태
                        $("#delStateCd").html(data.delStateCd);
                        $("#delStateCdLbl").html(data.delStateCdLbl);
                        $("#delStateCdLbl").addClass("edit");
                        //점검내용
                        $("#checkComment").html(data.checkComment);
                        $("#checkComment").addClass("edit");

                        break;
                    case DATA_TYPE.BSIS:
                        //제목창
                        var title = "<span class='label'>[{0}] {1} {2}{3}<span>".format(
                            data.rdGdftySeLbl,
                            (data.bsisRnLbl ? data.bsisRnLbl : '도로명없음'),
                            (data.bsisMnnm),
                            (data.bsisSlno != "0" ? '-' + data.bsisSlno : '')
                        );
                        $(".title").append(title);
                        //최종점검일자
                        var lastCheckDate = data.lastCheckDate == null ? "점검이력이 없습니다." : "{0}년{1}월{2}일".format(data.lastCheckDate.substr(0, 4), data.lastCheckDate.substr(4, 2), data.lastCheckDate.substr(6, 2));
                        $("#lastCheckDate").html(lastCheckDate);
                        $("#lastCheckDate").addClass("edit");
                        //도로시설물
                        $("#rdftySe").html(data.rdftySe);
                        $("#rdftySeLbl").html(data.rdftySeLbl);
                        //설치도로명
                        $("#bsisRnLbl").html(data.bsisRnLbl);
                        //설치기초번호
                        var bsis = "{0}{1}".format((data.bsisMnnm ? data.bsisMnnm : ''), (data.bsisSlno != "0" ? '-' + data.bsisSlno : ''));
                        $("#bsis").html(bsis);
                        //설치유형
                        $("#instSeLbl").html(data.instSeLbl);
                        $("#instSe").html(data.instSe);
                        //제작형식
                        $("#gdftyMnf").html(data.gdftyMnf);
                        $("#gdftyMnfLbl").html(data.gdftyMnfLbl);
                        //설치지점
                        $("#instSpotCd").html(data.instSpotCd);
                        $("#instSpotCdLbl").html(data.instSpotCdLbl);
                        $("#instSpotCdLbl").addClass("edit");
                        //교차로유형
                        $("#instCrossCd").html(data.instCrossCd);
                        $("#instCrossCdLbl").html(data.instCrossCdLbl);
                        $("#instCrossCdLbl").addClass("edit");
                        //설치장소 구분
                        $("#bsis_itlpcSe").html(data.bsis_itlpcSe);
                        $("#bsis_itlpcSeLbl").html(data.bsis_itlpcSeLbl);
                        //설치시설물
                        $("#bsis_instlFty").html(data.bsis_instlFty);
                        $("#bsis_instlFtyLbl").html(data.bsis_instlFtyLbl);
                        //곡면분류
                        $("#bsis_planeCd").html(data.bsis_planeCd);
                        $("#bsis_planeCdLbl").html(data.bsis_planeCdLbl);
                        $("#bsis_planeCdLbl").addClass("edit");
                        //한글도로명
                        $("#bsis_korRn").html((data.bsis_korRn ? data.bsis_korRn : '도로명없음'));
                        $("#bsis_korRn").addClass("edit");
                        //로마자
                        $("#area_romRn").html(data.bsis_RomRn);
                        //기초번호(0-0)
                        var bsis_ctbsNo = "{0}{1}".format(data.bsis_ctbsMn, (data.bsis_ctbsSn != "0" ? '-' + data.bsis_ctbsSn : ''));
                        $("#bsis_ctbsNo").html(bsis_ctbsNo);
                        //이전승강장번호
                        var bsis_bfbsNo = "{0}{1}".format(data.bsis_bfbsMn, (data.bsis_bfbsSn != "0" ? '-' + data.bsis_bfbsSn : ''));
                        $("#bsis_bfbsNo").html(bsis_bfbsNo);
                        //다음승강장번호
                        var bsis_ntbsNo = "{0}{1}".format(data.bsis_ntbsMn, (data.bsis_ntbsSn != "0" ? '-' + data.bsis_ntbsSn : ''));
                        $("#bsis_ntbsNo").html(bsis_ntbsNo);
                        //안내시설형식
                        $("#gdftyForm").html(data.gdftyForm);
                        $("#gdftyFormLbl").html(data.gdftyFormLbl);
                        //사용대상
                        $("#useTarget").html(data.useTarget);
                        $("#useTargetLbl").html(data.useTargetLbl);
                        //사용방향
                        $("#plqDirection").html(data.plqDirection);
                        $("#plqDirectionLbl").html(data.plqDirectionLbl);
                        //양면여부
                        $("#bdrclAt").html(data.bdrclAt);
                        $("#bdrclAtLbl").html(data.bdrclAtLbl);
                        //제2외국어여부
                        $("#scfggMkty").html(data.scfggMkty);
                        $("#scfggMktyLbl").html(data.scfggMktyLbl);
                        $("#scfggMktyLbl").addClass("edit");
                        //언어1
                        $("#scfggUla1").html(data.scfggUla1);
                        $("#scfggUla1Lbl").html(data.scfggUla1Lbl);
                        $("#scfggUla1Lbl").addClass("edit");
                        //언어2
                        $("#scfggUla2").html(data.scfggUla2);
                        $("#scfggUla2Lbl").html(data.scfggUla2Lbl);
                        $("#scfggUla2Lbl").addClass("edit");
                        //규격
                        $("#bsis_bsisGdSd").html(data.bsis_bsisGdSd);
                        $("#bsis_bsisGdSdLbl").html(data.bsis_bsisGdSdLbl);
                        $("#bsis_bsisGdSdLbl").addClass("edit");
                        //가로*세로*두께
                        $("#gdftyWide").html(data.gdftyWide);
                        $("#gdftyVertical").html(data.gdftyVertical);
                        $("#gdftyThickness").html(data.gdftyThickness);
                        var gdftyWVT = "{0}*{1}*{2}".format(data.gdftyWide, data.gdftyVertical, data.gdftyThickness);
                        $("#gdftyWVT").html(gdftyWVT);
                        $("#gdftyWVT").addClass("edit");
                        //단가(원)
                        $("#gdftyUnitPrice").html(data.gdftyUnitPrice);
                        $("#gdftyUnitPrice").addClass("edit");
                        //설치상태
                        $("#delStateCd").html(data.delStateCd);
                        $("#delStateCdLbl").html(data.delStateCdLbl);
                        $("#delStateCdLbl").addClass("edit");
                        //점검내용
                        $("#checkComment").html(data.checkComment);
                        $("#checkComment").addClass("edit");
                        break;
                    case DATA_TYPE.ENTRC:
                        //일련번호
                        $("#sn").val(data.bulNmtNo);
                        $("#entManNo").val(data.entManNo);
                        $("#imageFileSn").val(data.imageFilesSn);

                        //제목창
                        var title = "[{0}] {1} {2}{3}".format(
                            "건물번호판",
                            (data.rnCdLbl ? data.rnCdLbl : ''),
                            (data.buldMnnm ? data.buldMnnm : ''),
                            (data.buldSlno == '0' ? '' : '-' + data.buldSlno)
                        );
                        $("#entrcView_page .title").append(title);
                        //일련번호
                        // $("#sn").html(sn);
                        //일련번호
                        $("#bulNmtNo").html(data.bulNmtNo);
                        //유형
                        $("#buldNmtSe").html(data.buldNmtSe);
                        $("#buldNmtSeLbl").html(data.buldNmtSeLbl);
                        $("#buldNmtSeLbl").addClass("edit");
                        //형태
                        $("#buldNmtType").html(data.buldNmtType);
                        $("#buldNmtTypeLbl").html(data.buldNmtTypeLbl);
                        //용도
                        $("#buldNmtPurpose").html(data.buldNmtPurpose);
                        $("#buldNmtPurposeLbl").html(data.buldNmtPurposeLbl);
                        $("#buldNmtPurposeLbl").addClass("edit");
                        //규격
                        $("#buldNmtCd").html(data.buldNmtCd);
                        $("#buldNmtCdLbl").html(data.buldNmtCdLbl);
                        $("#buldNmtCdLbl").addClass("edit");
                        //가로*세로*두께
                        $("#gdftyWide").html(data.buldNmtWide);
                        $("#gdftyVertical").html(data.buldNmtVertical);
                        $("#gdftyThickness").html(data.buldNmtThickness);
                        var gdftyWVT = "{0}*{1}*{2}".format(data.buldNmtWide, data.buldNmtVertical, data.buldNmtThickness);
                        $("#gdftyWVT").html(gdftyWVT);
                        $("#gdftyWVT").addClass("edit");
                        //제작유형
                        $("#buldMnfCd").html(data.buldMnfCd);
                        $("#buldMnfCdLbl").html(data.buldMnfCdLbl);
                        $("#buldMnfCdLbl").addClass("edit");
                        //재질
                        $("#buldNmtMaterial").html(data.buldNmtMaterial);
                        $("#buldNmtMaterialLbl").html(data.buldNmtMaterialLbl);
                        $("#buldNmtMaterialLbl").addClass("edit");
                        //단가(원)
                        $("#gdftyUnitPrice").html(data.buldNmtUnitPrice);
                        $("#gdftyUnitPrice").addClass("edit");
                        //설치상태
                        $("#delStateCd").html(data.delStateCd);
                        $("#delStateCdLbl").html(data.delStateCdLbl);
                        $("#delStateCdLbl").addClass("edit");

                        break;
                    case DATA_TYPE.BULD:

                        var title = "[{0}] {1} {2}{3}".format(
                            "건물정보",
                            (data.rnCdLbl ? data.rnCdLbl : ""),
                            (data.buldMnnm),
                            (data.buldSlno == "0" ? "" : "-" + data.buldSlno)
                        );
                        $(".title").append(title);

                        //건축물용도
                        var bdtypCd = data.bdtypCd;

                        if (bdtypCd.substr(2, 5) == 000) { //대분류

                            $("#bdtypCd_main").html(data.bdtypCd);
                            $("#bdtypCd_mainLbl").html(data.bdtypCdLbl);
                            $("#bdtypCd_mainLbl").addClass("edit");

                        } else { //소분류일 경우
                            var bdtypCd_main = bdtypCd.substr(0, 2) + "000";
                            $("#bdtypCd_main").html(bdtypCd_main);
                            var codeList = app.codeMaster[CODE_GROUP["BDTYP_CD"]];
                            $("#bdtypCd_mainLbl").html(codeList[bdtypCd_main]);
                            $("#bdtypCd_mainLbl").addClass("edit");

                            $("#bdtypCd").html(data.bdtypCd);
                            $("#bdtypCdLbl").html(data.bdtypCdLbl);
                            $("#bdtypCdLbl").addClass("edit");

                        }

                        //건물종속여부
                        $("#bulDpnSe").html(data.bulDpnSe);
                        $("#bulDpnSeLbl").html(data.bulDpnSeLbl);
                        $("#bulDpnSeLbl").addClass("edit");
                        //건물명
                        $("#posBulNm").html(data.posBulNm);
                        $("#posBulNm").addClass("edit");
                        //건물명(영)
                        $("#bulEngNm").html(data.bulEngNm);
                        $("#bulEngNm").addClass("edit");
                        //상세건물명
                        $("#buldNmDc").html(data.buldNmDc);
                        $("#buldNmDc").addClass("edit");
                        //건물층수
                        //(지상)
                        $("#groFloCo").html(data.groFloCo);
                        //(지하)
                        $("#undFloCo").html(data.undFloCo);
                        var floCo = "지상층: {0} / 지하층: {1}".format(data.groFloCo, data.undFloCo);
                        $("#floCo").html(floCo);
                        $("#floCo").addClass("edit");
                        //건물상태
                        $("#buldSttus").html(data.buldSttus);
                        $("#buldSttus").addClass("edit");
                        //메모
                        $("#buldMemo").html(data.buldMemo);
                        $("#buldMemo").addClass("edit");

                        break;

                }
                util.dismissProgress();
            },
            util.dismissProgress
        );
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
var BASE_GIS_SERVICE_URL = "http://m1.juso.go.kr/tms?FIXED=TRUE";


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
        layers: [baseLayer],
        controls: ol.control.defaults({
            //rotate: false,
            attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                collapsible: false

            })
        }).extend([
            new MapUtil.controls.legendControl(),
            new MapUtil.controls.currentControl(),
            new MapUtil.controls.newPointControl(),
            new ol.control.Rotate({
                label: $("<IMG>", { src: 'image/coordinate.png', alt: '지도회전 초기화' })[0],
                autoHide: false
            })
        ]),
        overlays: [overlay, marker],
        view: new ol.View({
            projection: baseProjection,
            center: pos,
            zoom: 13,
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
                width: 3
            }
        },
        maxResolution: .5
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
            label: {
                text: { key: "USE_TRGET", func: function(text) { return app.codeMaster[CODE_GROUP["USE_TRGET"]][text].charAt(0) } },
                textOffsetX: -1,
                textOffsetY: -18,
                width: 1
            },
            radius: 12
        },
        cluster: { distance: 30 },
        maxResolution: 2
    });
    // 지역안내판 레이어
    var lyr_tl_spgf_area = getFeatureLayer({
        title: "지역안내판",
        typeName: "tlv_spgf_area",
        dataType: DATA_TYPE.AREA,
        style: {
            label: {
                text: { key: "USE_TRGET", func: function(text) { return app.codeMaster[CODE_GROUP["USE_TRGET"]][text].charAt(0) } },
                textOffsetX: -1,
                textOffsetY: -18,
                width: 1
            },
            radius: 12
        },
        cluster: { distance: 30 },
        maxResolution: 4,
        viewProgress: false
    });
    // 기초번호판 레이어
    var lyr_tl_spgf_bsis = getFeatureLayer({
        title: "기초번호판",
        typeName: "tlv_spgf_bsis",
        dataType: DATA_TYPE.BSIS,
        style: {
            label: {
                text: { key: "USE_TRGET", func: function(text) { return app.codeMaster[CODE_GROUP["USE_TRGET"]][text].charAt(0) } },
                textOffsetX: -1,
                textOffsetY: -18,
                width: 1
            },
            radius: 12
        },
        cluster: { distance: 30 },
        maxResolution: 4,
        viewProgress: false
    });
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
        cluster: { distance: 50 },
        maxResolution: 0.5,
        viewProgress: false
    });

    layers = {
        "loc": lyr_tlv_spgf_loc_skm,
        "rdpq": lyr_tl_spgf_rdpq,
        "area": lyr_tl_spgf_area,
        "bsis": lyr_tl_spgf_bsis,
        //        "entrc": lyr_tl_spbd_entrc
        "buld": lyr_tl_spbd_buld
    };

    /*********** 지도 화면 핸들러 (--start--) ***********/

    // 마우스 이동 이벤트 정의(현재 좌표 보여주기) (--start--)
    map.on('pointermove', function(event) {});
    // 마우스 이동 이벤트 정의(현재 좌표 보여주기) (--end--)

    // 선택 이벤트 정의()(--start--)
    map.on('singleclick', function(event) {
        var coordinate = event.coordinate;

        var resultHtml = "";
        var buttonHtml = "";
        var strHtml = "";

        var layerList = map.getLayers().getArray();
        var popupDiv = $("#popup-content");
        var commonDiv = "<div class='{0}'>{1}</div>";
        var commonP = "<p class='{0}'>{1}</p>";
        var commonSpan = "<span class='{0}'>{1}</span>";


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

                var RDFTYLC_SN = featureClone[featureIndex].get("RDFTYLC_SN");
                var RDFTY_SE = featureClone[featureIndex].get("RDFTY_SE");
                var pointSn = popTableP.format("위치일련번호", RDFTYLC_SN);
                var newCoodi = new ol.proj.transform(coordinate, baseProjection, sourceProjection);

                strHtml = "<b>검정(원)</b>-&gt; <span style='color:red;'>빨강(원)</span>으로 이동하고자 합니다.<br>(맞으면 저장, 틀리면 다른 위치 선택)";

                resultHtml = commonDiv.format("", strHtml);

                var param = "";
                param = $.extend({}, {
                    sn: RDFTYLC_SN,
                    // rdftySe : RDFTY_SE,
                    posX: newCoodi[0],
                    posY: newCoodi[1],
                    jobSeCd: 'M'
                });

                //버튼처리
                buttonHtml += buttonForm2.format("btnNormal", "clearMoveMode()", "취소");
                buttonHtml += buttonForm2.format("btnPoint", 'insertMoveingPoint(' + JSON.stringify(param) + ')', "저장");

                resultHtml += commonDiv.format("mapBtn", buttonHtml)

                resultHtml = commonDiv.format('mapInfo', resultHtml);

                popupDiv.html(resultHtml);

                $("#popup").show();

                overlay.setPosition(coordinate);
            }
        }
        /********** 위치이동 팝업 셋팅 end **********/

        /********** 피쳐 클릭 셋팅 (심플팝업)**********/
        var firstClick = true;
        map.forEachFeatureAtPixel(event.pixel, function(feature, layer) {

            var sn, features, rdGdftySe;

            if (feature.getKeys().indexOf('features') >= 0)
                features = feature.get('features');
            else
                features = [feature];

            //상세내용 셋팅 및 위치이동시 사용하기 위해 복사
            featureClone = features;
            //레이어ID
            layerID = layer.get('id');

            features.forEach(function(feature, index) {

                switch (layerID) {
                    case DATA_TYPE.LOC:
                        var link = URLs.selectLocLink;
                        //도로시설물위치일련번호
                        var RDFTYLC_SN = feature.get("RDFTYLC_SN");

                        var sendParam = {
                            // svcNm: 'sLOC',
                            // mode : "11",
                            sn: RDFTYLC_SN,
                            sigCd: app.info.sigCd,
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
                                    return;
                                }

                                var resultList = results.data;

                                for (var i = 0; resultList.length > i; i++) {
                                    strHtml = "";
                                    buttonHtml = "";
                                    resultHtml = "";

                                    var rdGdftySe = resultList[i].rdGdftySe;

                                    if (rdGdftySe == "110") {
                                        layerID = DATA_TYPE.RDPQ;
                                        var gbn = commonP.format("gbn", "[{0}]".format("도로명판"));
                                        var title = commonP.format("localTitle",
                                            "{0} {1}{2} {3} {4}{5}".format(
                                                resultList[i].frontKoreanRoadNm,
                                                resultList[i].frontStartBaseMasterNo,
                                                (resultList[i].frontStartBaseSlaveNo == "0" ? "" : "-" + resultList[i].frontStartBaseSlaveNo),
                                                (resultList[i].plqDirection == '00100' ? '→' : (resultList[i].plqDirection == '00200' ? '↔' : (resultList[i].plqDirection == '00300' ? '↑' : '?'))),
                                                resultList[i].frontEndBaseMasterNo,
                                                (resultList[i].frontEndBaseSlaveNo == "0" ? "" : "-" + resultList[i].frontEndBaseSlaveNo)
                                            )
                                        );

                                        //시점
                                        var FT_STBS_MN = (resultList[i].frontStartBaseMasterNo ? resultList[i].frontStartBaseMasterNo : '');

                                        var FT_STBS_SN = (resultList[i].frontStartBaseSlaveNo ? resultList[i].frontStartBaseSlaveNo : '');

                                        var ftStbsStr = baseNumberMix(FT_STBS_MN, FT_STBS_SN); // 0 - 0

                                        var ftStbs = popTableP.format("시작기초번호", ftStbsStr);

                                        //종점

                                        var BK_STBS_MN = (resultList[i].backStartBaseMasterNo ? resultList[i].backStartBaseMasterNo : '');

                                        var BK_STBS_SN = (resultList[i].backStartBaseSlaveNo ? resultList[i].backStartBaseSlaveNo : '');

                                        var bkStbsStr = baseNumberMix(BK_STBS_MN, BK_STBS_SN); // 0 - 0

                                        var bkStbs = popTableP.format("종료기초번호", bkStbsStr);

                                        //명판방향
                                        var PLQ_DRC = resultList[i].plqDirectionLbl;
                                        var plqDrc = commonSpan.format("info", PLQ_DRC);
                                        //규격
                                        var RDPQ_GD_SD = resultList[i].rdpqGdSdLbl;
                                        var rdpqGdSd = commonSpan.format("info", RDPQ_GD_SD);
                                        //양면여부
                                        var BDRCL_AT = resultList[i].bdrclAt == 0 ? "단면" : "양면";
                                        var bdrclAt = commonSpan.format("info", BDRCL_AT);

                                        // if(features.length > 1 && index >= 1){
                                        //     popupDiv.append(commonP.format("infoLine",""));
                                        // }

                                        strHtml += gbn
                                        strHtml += title
                                        strHtml += commonP.format("", bdrclAt + rdpqGdSd);

                                        resultHtml += popDiv.format("", "openDetailPopupCall(" + index + ",'" + layerID + "'," + resultList[i].rdGdftySn + ")", strHtml);

                                        //도로시설물 공간정보
                                        var geom = feature.getGeometry().getCoordinates();

                                        buttonHtml += buttonForm.format("more", "openDetailPopupCall(" + index + ",'" + layerID + "'," + resultList[i].rdGdftySn + ")", "image/more.png", "더보기");
                                        buttonHtml += buttonForm.format("addition", "moveingPoint(" + RDFTYLC_SN + "," + geom[0] + "," + geom[1] + "," + index + ")", "image/addtion.png", "이동");

                                        resultHtml += commonDiv.format("mapAdd", buttonHtml);
                                        resultHtml = commonDiv.format("mapInfo", resultHtml);

                                        popupDiv.append(resultHtml);

                                        $("#popup").show();
                                        overlay.setPosition(coordinate);
                                    } else if (rdGdftySe == "510") {
                                        layerID = DATA_TYPE.AREA;
                                        var gbn = commonP.format("gbn", "[{0}]".format("지역안내판"));
                                        var title = commonP.format("localTitle",
                                            "{0} {1}{2}".format(
                                                resultList[i].area_areaKorRn,
                                                resultList[i].area_stbsMn,
                                                (resultList[i].area_stbsSn == "0" ? "" : "-" + resultList[i].area_stbsSn)
                                            )
                                        );
                                        //규격
                                        var AREA_GD_SD = resultList[i].area_areaGdSdLbl;
                                        var areaGdSd = commonSpan.format("info", AREA_GD_SD);

                                        //양면여부
                                        var BDRCL_AT = resultList[i].bdrclAt == 0 ? "단면" : "양면";
                                        var bdrclAt = commonSpan.format("info", BDRCL_AT);

                                        strHtml += gbn
                                        strHtml += title
                                        strHtml += commonP.format("", bdrclAt + areaGdSd);

                                        // if(features.length > 1 && index == 1){
                                        //     resultHtml += commonP.format("infoLine","");
                                        // }

                                        resultHtml += popDiv.format("", "openDetailPopupCall(" + index + ",'" + layerID + "'," + resultList[i].rdGdftySn + ")", strHtml);

                                        //도로시설물 공간정보
                                        var geom = feature.getGeometry().getCoordinates();

                                        buttonHtml += buttonForm.format("more", "openDetailPopupCall(" + index + ",'" + layerID + "'," + resultList[i].rdGdftySn + ")", "image/more.png", "더보기");
                                        buttonHtml += buttonForm.format("addition", "moveingPoint(" + RDFTYLC_SN + "," + geom[0] + "," + geom[1] + "," + index + ")", "image/addtion.png", "이동");

                                        resultHtml += commonDiv.format("mapAdd", buttonHtml);
                                        resultHtml = commonDiv.format("mapInfo", resultHtml);

                                        popupDiv.append(resultHtml);

                                        $("#popup").show();
                                        overlay.setPosition(coordinate);
                                    } else if (rdGdftySe == "610") {
                                        layerID = DATA_TYPE.BSIS;
                                        var gbn = commonP.format("gbn", "[{0}]".format("기초번호판"));
                                        var title = commonP.format("localTitle",
                                            "{0} {1}{2}".format(
                                                resultList[i].bsis_korRn,
                                                resultList[i].bsis_ctbsMn,
                                                (resultList[i].bsis_ctbsSn == "0" ? "" : "-" + resultList[i].bsis_ctbsSn)
                                            )
                                        );

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

                                        strHtml += gbn
                                        strHtml += title
                                        strHtml += commonP.format("", bfbs);
                                        strHtml += commonP.format("", ntbs);

                                        // if(features.length > 1 && index == 1){
                                        //     resultHtml += commonP.format("infoLine","");
                                        // }

                                        resultHtml += popDiv.format("", "openDetailPopupCall(" + index + ",'" + layerID + "'," + resultList[i].rdGdftySn + ")", strHtml);

                                        //도로시설물 공간정보
                                        var geom = feature.getGeometry().getCoordinates();

                                        buttonHtml += buttonForm.format("more", "openDetailPopupCall(" + index + ",'" + layerID + "'," + resultList[i].rdGdftySn + ")", "image/more.png", "더보기");
                                        buttonHtml += buttonForm.format("addition", "moveingPoint(" + RDFTYLC_SN + "," + geom[0] + "," + geom[1] + "," + index + ")", "image/addtion.png", "이동");

                                        resultHtml += commonDiv.format("mapAdd", buttonHtml);
                                        resultHtml = commonDiv.format("mapInfo", resultHtml);

                                        popupDiv.append(resultHtml);

                                        $("#popup").show();
                                        overlay.setPosition(coordinate);

                                    }
                                    resultHtml = commonP.format("infoLine", "");
                                    popupDiv.append(resultHtml);

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


                        popupDiv.append(resultHtml);

                        $("#popup").show();
                        overlay.setPosition(coordinate);

                        break;
                }



            });









            /*************** 예전꺼 **************
            if(firstClick){
                var sn, features;

                if(feature.getKeys().indexOf('features') >= 0)
                    features = feature.get('features');
                else
                    features = [ feature ];

                //상세내용 셋팅 및 위치이동시 사용하기 위해 복사
                featureClone = features;

                features.forEach(function(feature, index) {

                    strHtml = "";
                    buttonHtml = "";
                    resultHtml = "";
                    layerID = layer.get('id');

                    switch(layerID) {
                        case DATA_TYPE.RDPQ:
                            var title = commonP.format("localTitle",
                                "{0} {1}{2} {3} {4}{5}".format(
                                    feature.get('FT_KOR_RN'),
                                    feature.get('FT_STBS_MN'),
                                    (feature.get('FT_STBS_SN') == "0" ? "" : "-" + feature.get('FT_STBS_SN')),
                                    (feature.get('PLQ_DRC') == '00100' ? '→' : (feature.get('PLQ_DRC') == '00200' ? '↔' : (feature.get('PLQ_DRC') == '00300' ? '↑' : '?'))),
                                    feature.get('FT_EDBS_MN'),
                                    (feature.get('FT_EDBS_SN') == "0" ? "" : "-" + feature.get('FT_EDBS_SN'))
                                )
                            );

                            //시점
                            var FT_STBS_MN = (feature.get('FT_STBS_MN') ? feature.get('FT_STBS_MN') : '');

                            var FT_STBS_SN = (feature.get('FT_STBS_SN') ? feature.get('FT_STBS_SN') : '');

                            var ftStbsStr = baseNumberMix(FT_STBS_MN,FT_STBS_SN); // 0 - 0

                            var ftStbs = popTableP.format("시작기초번호",ftStbsStr);

                            //종점

                            var BK_STBS_MN = (feature.get('BK_STBS_MN') ? feature.get('BK_STBS_MN') : '');

                            var BK_STBS_SN = (feature.get('BK_STBS_SN') ? feature.get('BK_STBS_SN') : '');

                            var bkStbsStr = baseNumberMix(BK_STBS_MN,BK_STBS_SN); // 0 - 0

                            var bkStbs = popTableP.format("종료기초번호",bkStbsStr);

                            //명판방향
                            var PLQ_DRC = setCodeValue(feature,'PLQ_DRC');
                            var plqDrc = commonSpan.format("info",PLQ_DRC);
                            //규격
                            var RDPQ_GD_SD = setCodeValue(feature,'RDPQ_GD_SD');
                            var rdpqGdSd = commonSpan.format("info",RDPQ_GD_SD);
                            //양면여부
                            var BDRCL_AT = feature.get('BDRCL_AT') == 0 ? "단면":"양면";
                            var bdrclAt = commonSpan.format("info",BDRCL_AT);

                            if(features.length > 1 && index >= 1){
                                popupDiv.append(commonP.format("infoLine",""));
                            }

                            strHtml += title
                            strHtml += commonP.format("", bdrclAt + rdpqGdSd);

                            resultHtml += popDiv.format("",'openDetailPopupCall('+index+')',strHtml);

                            //도로시설물위치일련번호
                            var RDFTYLC_SN = feature.get("RDFTYLC_SN");
                            //도로시설물 공간정보
                            var geom = feature.getGeometry().getCoordinates();

                            buttonHtml += buttonForm.format("more","openDetailPopupCall("+index+")","image/more.png","더보기");
                            buttonHtml += buttonForm.format("addition","moveingPoint("+RDFTYLC_SN+","+geom[0]+","+geom[1]+","+index+")","image/addtion.png","이동");

                            resultHtml += commonDiv.format("mapAdd",buttonHtml);
                            resultHtml = commonDiv.format("mapInfo",resultHtml);

                            popupDiv.append(resultHtml);

                            $("#popup").show();
                            overlay.setPosition(coordinate);

                            break;
                        case DATA_TYPE.AREA:
                            var title = commonP.format("localTitle",
                                "{0} {1}{2}".format(
                                    feature.get('KOR_RN'),
                                    feature.get('STBS_MN'),
                                    (feature.get('STBS_SN') == "0" ? "" : "-" + feature.get('STBS_SN'))
                                )
                            );

                            strHtml += title

                            if(features.length > 1 && index == 1){
                                resultHtml += commonP.format("infoLine","");
                            }

                            resultHtml += popDiv.format("",'openDetailPopupCall(' + index + ')', strHtml);

                            //도로시설물위치일련번호
                            var RDFTYLC_SN = feature.get("RDFTYLC_SN");
                            //도로시설물 공간정보
                            var geom = feature.getGeometry().getCoordinates();

                            buttonHtml += buttonForm.format("more","openDetailPopupCall("+index+")","image/more.png","더보기");

                            resultHtml += commonDiv.format("mapAdd",buttonHtml);
                            resultHtml = commonDiv.format("mapInfo"+index,resultHtml);

                            popupDiv.append(resultHtml);

                            $("#popup").show();
                            overlay.setPosition(coordinate);
                            break;
                        case DATA_TYPE.BSIS:
                            var title = commonP.format("localTitle",
                                "{0} {1}{2}".format(
                                    feature.get('KOR_RN'),
                                    feature.get('CTBS_MN'),
                                    (feature.get('CTBS_SN') == "0" ? "" : "-" + feature.get('CTBS_SN'))
                                )
                            );

                            //시점
                            var BFBS_MN = (feature.get('BFBS_MN') ? feature.get('BFBS_MN') : '');

                            var BFBS_SN = (feature.get('BFBS_SN') == "0" ? '' : feature.get('BFBS_SN'));

                            var bfbsStr = baseNumberMix(BFBS_MN, BFBS_SN); // 0 - 0

                            var bfbs = popTableP.format("이전승강장기초번호",bfbsStr);

                            //종점

                            var NTBS_MN = (feature.get('NTBS_MN') ? feature.get('NTBS_MN') : '');

                            var NTBS_SN = (feature.get('NTBS_SN') ? feature.get('NTBS_SN') : '');

                            var ntbsStr = baseNumberMix(NTBS_MN, NTBS_SN); // 0 - 0

                            var ntbs = popTableP.format("다음승강장기초번호",ntbsStr);


                            strHtml += title
                            strHtml += commonP.format("", bfbs);
                            strHtml += commonP.format("", ntbs);

                            if(features.length > 1 && index == 1){
                                resultHtml += commonP.format("infoLine","");
                            }

                            resultHtml += popDiv.format("",'openDetailPopupCall(' + index + ')', strHtml);

                            //도로시설물위치일련번호
                            var RDFTYLC_SN = feature.get("RDFTYLC_SN");
                            //도로시설물 공간정보
                            var geom = feature.getGeometry().getCoordinates();

                            buttonHtml += buttonForm.format("more","openDetailPopupCall("+index+")","image/more.png","더보기");

                            resultHtml += commonDiv.format("mapAdd",buttonHtml);
                            resultHtml = commonDiv.format("mapInfo"+index,resultHtml);

                            popupDiv.append(resultHtml);

                            $("#popup").show();
                            overlay.setPosition(coordinate);

                            break;
                        case DATA_TYPE.ENTRC:
                            openDetailPopupCall(0);

                            break;
                        case DATA_TYPE.BULD:
                            //건물명
                            var POS_BUL_NM = feature.get("POS_BUL_NM");

                            if(POS_BUL_NM == undefined){
                                POS_BUL_NM = "건물명 없음";
                            }

                            strHtml = commonSpan.format("titleIcon_building","");
                            strHtml += POS_BUL_NM;

                            var buldNm = commonP.format("localTitle",strHtml);

                            //팝업내용 추가
                            strHtml = buldNm

                            resultHtml = popDiv.format("","",strHtml);

                            //도로시설물 공간정보
                            var geom = feature.getGeometry().getCoordinates();

                            buttonHtml = buttonForm.format("more","openDetailPopupCall(0)","image/more.png","더보기");

                            resultHtml += commonDiv.format("mapAdd",buttonHtml);

                            resultHtml = commonDiv.format("mapInfo",resultHtml);

                            popupDiv.append(resultHtml);

                             //라인추가
                            popupDiv.append(commonP.format("infoLine",""));

                            //건물번호판
                            strHtml = commonSpan.format("titleIcon_number","");
                            strHtml += "건물번호판";

                             //팝업내용 추가
                            strHtml = commonP.format("localTile",strHtml);
                            strHtml += commonP.format("","");

                            resultHtml = popDiv.format("","",strHtml);

                            buttonHtml = buttonForm.format("more","openDetailPopupCall(1)","image/more.png","더보기");

                            resultHtml += commonDiv.format("mapAdd",buttonHtml);

                            resultHtml = commonDiv.format("mapInfo",resultHtml);


                            popupDiv.append(resultHtml);

                            $("#popup").show();
                            overlay.setPosition(coordinate);

                            break;
                    }
                    firstClick = false;

                });
            }
            */


        });
    });
    // 선택 이벤트 정의()(--end--)

    // 지도 변경시 핸들러 정의(--start--)
    map.getView().on('propertychange', function(event) {
        switch (event.key) {
            case 'resolution':
                var mapRS = map.getView().getResolution();
                var useLayers = map.getLayers().getArray();

                for (var i in useLayers) {
                    var id = useLayers[i].get("id");
                    if (mapRS == useLayers[i].getMaxResolution()) {

                        if (id == DATA_TYPE.RDPQ) {
                            $('.legend .rdpq .total').text('0건');
                            util.toast('도로명판을 조회 가능한 지도레벨이 아닙니다. 확대해 주세요.');
                        }
                        if (id == DATA_TYPE.AREA) {
                            $('.legend .area .total').text('0건');
                            util.toast('지역번호판을 조회 가능한 지도레벨이 아닙니다. 확대해 주세요.');
                        }
                        if (id == DATA_TYPE.BSIS) {
                            $('.legend .bsis .total').text('0건');
                            util.toast('기초번호판을 조회 가능한 지도레벨이 아닙니다. 확대해 주세요.');
                        }
                        if (id == DATA_TYPE.BULD) {
                            util.toast('건물정보를 조회 가능한 지도레벨이 아닙니다. 확대해 주세요.');
                        }

                    }
                }
                break;
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

    setTimeout(function() {
        def.resolve(true);
    }, 300);
    return def.promise();
};
// 지도 초기화 함수(--end--)

var getSource = function(source) {
    if (source.getSource) {
        return getSource(source.getSource());
    } else {
        if (source instanceof ol.source.Vector)
            return source;
        return;
    }
};

var getVectorSource = function(mapObj) {
    var source;
    mapObj.getLayers().forEach(function(item, index) {
        if (item instanceof ol.layer.Vector)
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

            util.showProgress();
            util.postAJAX('', urldata, true)
                .then(function(context, rCode, results) {

                    //통신오류처리
                    if (rCode != 0) {
                        navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                        return;
                    }
                    
                    var features = new ol.format.WFS().readFeatures(results, { featureProjection: baseProjection.getCode(), dataProjection: sourceProjection.getCode() });

                    var rdpqCnt = 0;
                    var areaCnt = 0;
                    var bsisCnt = 0;

                    for (var i = 0; features.length > i; i++) {
                        var rdGdftySe = features[i].get("RD_GDFTY_SE");
                        if (rdGdftySe == "110") {
                            rdpqCnt++;
                        } else if (rdGdftySe == "510") {
                            areaCnt++;
                        } else if (rdGdftySe == "610") {
                            bsisCnt++;
                        }
                    }

                    $('.legend .rdpq .total').text(rdpqCnt + '건');
                    $('.legend .area .total').text(areaCnt + '건');
                    $('.legend .bsis .total').text(bsisCnt + '건');

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

                    console.log("({2}) The number of features viewed is {0}. extent({1})".format(features.length, extent.join(','), options.typeName));

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
                    util.dismissProgress();
                });
            if (options.viewProgress != undefined && !options.viewProgress)
                util.dismissProgress();
        },
        strategy: ol.loadingstrategy.bbox
    });

    var source;

    if (options.cluster) {
        source =
            new ol.source.Cluster({
                distance: options.cluster.distance,
                geometryFunction: function(feature) {
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
var layerID = "";
//좌표이동
function moveingPoint(sn, pointX, pointY, index) {
    console.log(sn);
    console.log(pointX + " , " + pointY);

    var zoom = map.getView().getZoom();
    if (zoom < 14) {
        map.getView().setZoom(14);
        map.getView().setCenter([pointX, pointY]);
    }

    featureIndex = index;

    //팝업닫기
    $("#popup").hide();

    //기본레이어 삭제
    map.removeLayer(layers.loc);
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
    var link = URLs.moveingPoint;

    var sendParam = $.extend(param, {
        svcNm: 'iSPGF',
        sigCd: app.info.sigCd,
        workId: app.info.opeId
    });;

    var url = URLs.postURL(link, sendParam);

    util.showProgress();
    util.postAJAX({}, url)
        .then(function(context, rCode, results) {
                util.dismissProgress();
                if (rCode == 0 && results.response.status > -1) {
                    util.toast('이동한 위치 정보가 저장되었습니다.');
                    navigator.notification.alert('KAIS C/S\n (자료관리 → 도로안내시설 편집 → 도로시설물 위치이동)\n에서 저장된 위치 이동정보를 확인하세요.', '', '알림', '확인');

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
                }

            },
            msg.alert
        );
}

function clearMoveMode() {
    navigator.notification.confirm("위치 이동을 취소 하시겠습니까?", cancelMove, "알림", ['확인', '취소']);
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
var rdGdftySn;

function openDetailPopupCall(index, layer, sn) {
    rdGdftySn = sn;
    // $("#popup").hide();

    if (layerID == DATA_TYPE.BULD) {
        if (index == 0) {
            MapUtil.openDetail(DATA_TYPE.BULD, featureClone[0]);
        } else {
            MapUtil.openDetail(DATA_TYPE.ENTRC, featureClone[0]);
        }

    } else {
        MapUtil.openDetail(layer, featureClone[index]);

    }


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

    var zoom = map.getView().getZoom();
    if (zoom < 14) {
        map.getView().setZoom(14);
    }
    map.updateSize();
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
            $ul.html("<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>");          
            $ul.listview("refresh");          
            $.ajax({
                type: 'POST',
                            url: "http://www.juso.go.kr/link/mobileSearch.do",
                            dataType: "xml",
                            data: {
                    countPerPage: 4,
                    currentPage: 1,
                    keyword: app.info.sigNm + " " + value // 해당지역 검색을 위하여 시군구명 포함
                                   
                }          
            })          .then(function(xml) {            
                $.each($(xml).find("juso"), function(i, val) {
                    var label = "<span id='rnAddr'>{0} {1}{2}{3}</span><br><span id='jbAddr'>[지번]{4} {5}{6}</span>".format(
                        $(this).find("rn").text(),
                        $(this).find("buldMnnm").text(),
                        util.isEmpty($(this).find("buldSlno").text()) ? "" : "-{0}".format($(this).find("buldSlno").text()),
                        util.isEmpty($(this).find("bdNm").text()) ? "" : "({0})".format($(this).find("bdNm").text()),
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

/** 새위치등록 입력 */
function insertNewPos() {

    navigator.notification.confirm(msg.insertPos, function(btnIndex) {
        if (btnIndex == 1) {
            var param = "";
            var coordinate = map.getView().getCenter();

            var centerPoint = new ol.proj.transform(coordinate, baseProjection, sourceProjection);

            param = $.extend({}, {
                // sn : RDFTYLC_SN,
                // rdftySe : RDFTY_SE,
                posX: centerPoint[0],
                posY: centerPoint[1],
                memo: $("#newPosMemoText").val(),
                jobSeCd: 'C'
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

    $(".newPosition").click();
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