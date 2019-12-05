
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
                            layerID : options.dataType,
                            
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
        source: (vectorSource),
        renderMode: options.renderMode,
        // renderBuffer: 50
    }
    vectorOptions.style = function(feature, resolution) {
        return defaultStyle(feature, resolution, options);
    }

    return new ol.layer.Vector(vectorOptions);
};

/** 중앙 공간정보 좌표조회 */
var getFeatureCoodi_Center = function(options){
    var vectorSource = new ol.source.Vector({
        id: "vectorSource:" + options.typeName,
        // format: new ol.format(),
        loader: function(extent, resolution, projection) {
            
            var param = {
                // 중앙요청시 svcNm param안에 작성 안함
                // svcNm : URLs.coodiMapSvcCenter,
                typeName : options.typeName,
                bbox: extent,
                sigCd : app.info.sigCd,
                workId : app.info.opeId,
                mode : app.info.mode == "11"? "10" : null // 중앙테스트용
            };

            var urldata = URLs.postURL(URLs.coodiMapSvcCenter, param);
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

                    var layerType = options.typeName;
                    var features = new Array();

                    var data = results.data;
                    // console.log(data);

                    if(data == null || data.length == 0){
                        util.toast("조회된 " + options.title + " 공간정보가 없습니다.", "error");
                        util.dismissProgress();
                        return;
                    }else{
                        var spotCnt = 0;
                        var type = options.typeName;
                        if(layerType.indexOf ("sppn") > -1){
                            $('.legend .spot .total').text(data.length + '건');
                        }else if(layerType.indexOf("aot") > -1){
                            $('.legend .aot .total').text(data.length + '건');
                        }
                    }

                    for(i in data){
                        
                        var feature = new ol.Feature({
                            // layerType : layerType,
                            SIG_CD : data[i].sigCd,
                            layerID : options.dataType,
                            LT_CHC_YN : data[i].ltChcYn,
                        });

                        if(options.dataType == DATA_TYPE.SPPN){
                            var ponitX = data[i].pointX;
                            var ponitY = data[i].pointY;
    
                            var point =  new ol.geom.Point([ponitX,ponitY]);
                            feature.setGeometry(point);
                            feature.setId(options.typeName + '.' +data[i].spoNoSeq);
                            feature.setStyle(sppnStyle(options,feature));

                            feature.set("SPO_NO_SEQ",data[i].spoNoSeq);
                            // feature.set("spoNoSeq",data[i].spoNoSeq);
                            feature.set("SPO_NO_CD",data[i].spoNoCd);

                        }else if(options.dataType == DATA_TYPE.AOT){
                            var ponitX = data[i].pointX;
                            var ponitY = data[i].pointY;
                            var objMngNo = data[i].objMngNo;
                            var objKndCd = data[i].objKndCd;

                            var coodiList = new Array();
                            var coodiListResult = new Array();
                            coodiListResult[0] = new Array();

                            var geom, style;

                            var geomText = data[i].geomText;

                            // geomText.replace("POLYGON","").replace(/\(\(/g,"[[[").replace(/\)\)/g,"]]]").replace(/\,/g,"],[").replace(/ /g,",");

                            if(geomText.indexOf('POINT') > -1){
                                coodiList = geomText.split('(')[1].replace(')' ,'').split(' ');
                                
                                var geom =  new ol.geom.Point(coodiList);
                                feature.setGeometry(geom);
                                feature.setId(options.typeName + '.' + i);
                                feature.setStyle(pointStyle(options,feature));
                                // feature.setStyle(sppnStyle(options,feature));
                            }
                            else if(geomText.indexOf('POLYGON') > -1){
                                coodiList = geomText.split('((')[1].replace('))' ,'').split(',');
                                for(var j in coodiList){
                                    var coodiList2 = new Array();
                                    coodiList2 = coodiList[j].split(' ');
                                    coodiListResult[0][j] = new Array();
                                    coodiListResult[0][j] = coodiList2;
                                }
                                // coodiListResult2.push(coodiListResult);
                                // geom = new ol.geom.Polygon([[[964836.25,1760554],[964805.25,1760523.5],[964824.75,1760508],[964853.25,1760539],[964836.25,1760554]]]);
                                geom = new ol.geom.Polygon(coodiListResult);
                                feature.setGeometry(geom);
                                feature.setId(options.typeName + '.' + i);
                                feature.setStyle(polygonStyle(options,feature));
                            }
                            else if(geomText.indexOf('MULTILINESTRING') > -1){
                                coodiList = geomText.split('((')[1].replace('))' ,'').split(',');
                                for(var j in coodiList){
                                    var coodiList2 = new Array();
                                    coodiList2 = coodiList[j].split(' ');
                                    coodiListResult[0][j] = new Array();
                                    // 멀티라인스트링은 문자열로 안됨;;
                                    coodiList2[0] = parseInt(coodiList2[0]);
                                    coodiList2[1] = parseInt(coodiList2[1])
                                    coodiListResult[0][j] = coodiList2;
                                    
                                }
                                // 멀티라인스트링은 문자열로 안됨;;
                                // geom = new ol.geom.MultiLineString([[["964787.23241265","1760537.9296506"],["964809.48241265","1760538.1796506"],["964824.16991265","1760541.8046506"]]]);
                                // geom = new ol.geom.MultiLineString([[[964787.23241265","1760537.9296506],[964809.48241265,1760538.1796506],[964824.16991265,1760541.8046506]]]);
                                geom = new ol.geom.MultiLineString(coodiListResult);
                                feature.setGeometry(geom);
                                feature.setId(options.typeName + '.' + i);
                                feature.setStyle(lineStyle(options,feature));
                            }
                            
                        }
                        
                        features.push(feature);
                    }

                    // console.log("({2}) The number of features viewed is {0}. extent({1})".format(features.length, extent.join(','), options.typeName));

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
    });
    // 벡터 레이어 생성
    var vectorOptions = {
        id: options.dataType,
        title: options.title,
        maxResolution: options.maxResolution,
        source: vectorSource,
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
        if(onOffGbn == "on"){
            util.toast('기초구간을 사용하는 경우 안내시설 심볼요청이 원활하지 않을 수 있습니다.참고용으로만 사용해 주시기 바랍니다.','warning',5000);
        }
    }

    if(onOffGbn == "on"){
        map.addLayer(layerType);
    }else{
        map.removeLayer(layerType);
    }
    
    
}