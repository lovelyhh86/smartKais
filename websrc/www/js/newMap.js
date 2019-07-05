
//bbox 얻기
function getBbox(){
    return map.previousExtent_;
}

//feature 조회
function makeLayer(){
    var bbox = getBbox();
    var param = {
        bbox: bbox,
        sigCd : app.info.sigCd,
        workId : app.info.opeId
    };

    var urldata = URLs.postURL(URLs.coodiMapSvc, param);

    util.showProgress();

    var vector_source = new ol.source.Vector({
        // features : new ol.Collection({
        //     array : selectFeature()
        // })
    });

    util.postAJAX('', urldata)
                .then(function(context, rCode, results) {

                    //통신오류처리
                    if (rCode != 0) {
                        navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                        util.dismissProgress();
                        return;
                    }

                    var data = results.data;

                    if(data == null || data.length == 0){
                        util.toast("데이터 없음", "error");
                        util.dismissProgress();
                        return;
                    }
                    var features = new Array();

                    // var vector_source = new ol.source.Vector({
                    //     // features : new ol.Collection({
                    //     //     array : selectFeature()
                    //     // })
                    // });

                    for(i in data){
                        var ponitX = data[i].pointX;
                        var ponitY = data[i].pointY;

                        var feature = new ol.Feature({
                            rdFtyLcSn : data[i].rdFtyLcSn,
                            rdGdftySn : data[i].rdGdftySn
                        });

                        var point =  new ol.geom.Point([ponitX,ponitY]);

                        feature.setGeometry(point);

                        feature.setStyle(new ol.style.Style({
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
                        features.push(feature);
                    }

                    vector_source.addFeatures(features);

                    console.log("({2}) The number of features viewed is {0}. extent({1})".format(features.length, bbox.join(','), options.typeName));

                    var vector_layer = new ol.layer.Vector({
                        map: map,
                        title: "test_rdpq",
                        source: vector_source
                    });

                    map.addLayer(vector_layer);

                    util.dismissProgress();
                    util.toast("공간정보 조회 완료","success");

                    return vector_layer;


                }, function(context, xhr, error) {
                    console.log("조회 error >> " + error + '   ' + xhr);
                    util.toast("공간정보 조회 에러","error");
                    util.dismissProgress();
                });


                var vectorOptions = {
                    id: 'a',
                    title: 'b',
                    source: vector_source
                }
                return new ol.layer.Vector(vectorOptions);

}
//소스 추가
function makeSource(){
    var vector_source = new ol.source.Vector({
        // features : new ol.Collection({
        //     array : selectFeature()
        // })
    });

    return vector_source;
}

//레이어 추가
function addLayer(title){
    var vector_source = makeSource();

    var vector_layer = new ol.layer.Vector({
        map: map,
        title: title,
        source: vector_source
    });

    map.addLayer(vector_layer);
    // layers.rdpq = vector_layer;
    
}



var getFeatureLayer_new = function(options) {
    var vectorOptions;

    var vectorSource = new ol.source.Vector({
        id: "vectorSource:" + options.typeName,
        format: new ol.format.GeoJSON(),
        loader: function(extent, resolution, projection) {
            // extent = ol.proj.transformExtent(extent, baseProjection.getCode(), sourceProjection.getCode());
            var param = {
                typeName : options.typeName,
                bbox: extent,
                sigCd : app.info.sigCd,
                workId : app.info.opeId
            };

            var urldata = URLs.postURL(URLs.coodiMapSvc, param);
            util.showProgress();
            util.postAJAX('', urldata)
                .then(function(context, rCode, results) {

                    //통신오류처리
                    if (rCode != 0) {
                        navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                        util.dismissProgress();
                        return;
                    }
                    
                    var layerType = options.typeName;
                    var features = new Array();

                    var rdpqCnt = 0;
                    var areaCnt = 0;
                    var bsisCnt = 0;
                    var spotCnt = 0;
                    var rdpqWCnt = 0;
                    var areaWCnt = 0;
                    var bsisWCnt = 0;

                    var entrcCnt = 0;
                    var lntrvlCnt = 0;

                    var data = results.data;

                    if(data == null || data.length == 0){
                        util.toast("조회된 " + options.title + " 공간정보가 없습니다.", "error");

                        //범례건수 체크
                        if(layerType == "tlv_spbd_entrc_pos_skm"){
                            $('.legend .entrc .total').text(entrcCnt + '건');
                        }else if(layerType == "tlv_spgf_loc_pos_skm"){
                            $('.legend .rdpq .total').text(rdpqCnt + '건');
                            $('.legend .area .total').text(areaCnt + '건');
                            $('.legend .bsis .total').text(bsisCnt + '건');
                            $('.legend .rdpqW .total').text(rdpqWCnt + '건');
                        }else if(layerType == "tl_sprd_intrvl"){
                            $('.legend .intrvl .total').text(lntrvlCnt + '건');
                        }

                        util.dismissProgress();
                        return;
                    }

                    for(i in data){
                        var ponitX = data[i].pointX;
                        var ponitY = data[i].pointY;

                        var feature = new ol.Feature({
                            type : layerType,
                            SIG_CD : data[i].sigCd,
                            
                            LT_CHC_YN : data[i].ltChcYn,
                            RE_STT_SUM : data[i].reSttSum,
                            INSTL_DE : data[i].instlDe,

                            USE_TRGET : data[i].useTrg,
                            
                            LABEL : data[i].label,
                            INSTL_SE : data[i].instlSe,
                            USE_TRGET : data[i].useTrg,
                        });
                        
                        // if(typeName == "tlv_spgf_loc_pos_skm"){
                        //     feature.setId(options.typeName + '.' +data[i].rdFtyLcSn);
                        // }else if(typeName == "tlv_spbd_entrc_pos_skm"){
                        //     feature.setId(options.typeName + '.' +data[i].bulNmtNo);
                        // }

                        var point =  new ol.geom.Point([ponitX,ponitY]);

                        feature.setGeometry(point);
                        if(options.dataType == DATA_TYPE.ENTRC){
                            feature.set("BUL_NMT_NO",data[i].bulNmtNo);
                            feature.set("BUL_MAN_NO",data[i].bulManNo);

                            feature.setStyle(entrcStyle(options, feature));
                            feature.setId(options.typeName + '.' +data[i].bulNmtNo);
                        }else if(options.dataType == DATA_TYPE.LOC){
                            feature.set("RDFTYLC_SN",data[i].rdFtyLcSn);
                            feature.set("RD_GDFTY_SE",data[i].rdGdftySe);

                            feature.setStyle(locStyle(options, feature));
                            feature.setId(options.typeName + '.' +data[i].rdFtyLcSn);
                        }

                        //범례건수 체크
                        if(layerType == "tlv_spbd_entrc_pos_skm"){
                            entrcCnt++;
                            $('.legend .entrc .total').text(entrcCnt + '건');
                        }else if(layerType == "tlv_spgf_loc_pos_skm"){
                            // for (var i = 0; features.length > i; i++) {
                                var rdGdftySe = data[i].rdGdftySe;
                                //설치유형(벽면형 : 00002)
                                var instlSe = data[i].instlSe;
                                var useTarget = data[i].useTrg;
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
                            // }

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

                        
                        features.push(feature);
                    }
                    // vectorSource.clear(); // 계속 새로고침 됨
                    vectorSource.addFeatures(features);
                    
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
    })

    // var clusterSource = new ol.source.Cluster({
    //     distance: 1,
    //     geometryFunction: function(feature) {
    //                     if (feature.getGeometry().getType() == "Polygon")
    //                         return feature.getGeometry().getInteriorPoint();
    //                     else
    //                         return feature.getGeometry();
    //                 },
    //     source: vectorSource
    // });

    // if (options.cluster) {
        // source =
        //     new ol.source.Cluster({
        //         distance: 1,
        //         geometryFunction: function(feature) {
        //             if (feature.getGeometry().getType() == "Polygon")
        //                 return feature.getGeometry().getInteriorPoint();
        //             else
        //                 return feature.getGeometry();
        //         },
        //         source: vectorSource
        //     });
    // } else {
    //     source = vectorSource;
    // }
    // // 벡터 레이어 생성
    vectorOptions = {
        id: options.dataType,
        title: options.title,
        maxResolution: options.maxResolution,
        // source: vectorSource,
        source: vectorSource,
        renderMode: options.renderMode,
        // renderBuffer: 50
    }
    vectorOptions.style = function(feature, resolution) {
        return defaultStyle(feature, resolution, options);
    }

    return new ol.layer.Vector(vectorOptions);
};


var getFeatureCoodi = function(options){
    var vectorSource = new ol.source.Vector({
        id: "vectorSource:" + options.typeName,
        // format: new ol.format(),
        loader: function(extent, resolution, projection) {
            // extent = ol.proj.transformExtent(extent, baseProjection.getCode(), sourceProjection.getCode());
            var param = {
                // SERVICE: 'WFS',
                // VERSION: '1.1.0',
                // REQUEST: 'GetFeature',
                bbox: extent,
                // srsName: serviceProjection.getCode(),
                // typeName: options.typeName,
                sigCd : app.info.sigCd
            };

            var urldata = URLs.postURL(URLs.coodiMapSvc, param);
            // util.toast("지도요청시작","success");
            // alert(JSONtoString(urldata));
            util.showProgress();
            util.postAJAX('', urldata)
                .then(function(context, rCode, results) {

                    //통신오류처리
                    if (rCode != 0) {
                        navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                        util.dismissProgress();
                        return;
                    }

                    var data = results.data;

                    var features = new Array();

                    if(data == null || data.length == 0){
                        util.toast("데이터 없음", "error");
                        util.dismissProgress();
                        return;
                    }else{
                        console.log(data);

                        for(i in data){
                            var ponitX = data[i].pointX;
                            var ponitY = data[i].pointY;

                            var feature = new ol.Feature({
                                geometry : new ol.geom.Point([ponitX,ponitY])
                            });

                            features.push(feature);
                        }
                    }


                    console.log("({2}) The number of features viewed is {0}. extent({1})".format(features.length, extent.join(','), options.typeName));

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



function layerToggleController(type){
    var onOffGbn = $("#"+type).val();
    var layerType;

    if(type == 'locSel'){
        //위치(좌표계)
        layerType = layers.loc_pos;
        if(localStorage['engineUse'] == 'Y'){
            //위치(엔진)
            layerType = layers.loc;
        }
        
    }else if(type == 'nmtgSel'){
        //건판(좌표계)
        layerType = layers.entrc_pos;
        if(localStorage['engineUse'] == 'Y'){
            //건판(엔진)
            layerType = layers.entrc
        }
    }else if(type == 'intrvlSel'){
        //기초구간
        layerType = layers.intrvl;
    }

    if(onOffGbn == "on"){
        map.addLayer(layerType);
    }else{
        map.removeLayer(layerType);
    }
    
    
}