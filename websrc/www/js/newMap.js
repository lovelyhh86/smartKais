
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
var riverpkCnt = 0;
var eqoutCnt = 0;
var taxistCnt = 0;

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
                mode : app.info.mode == "11"? "10" : 00 // 중앙테스트용
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
                        }
                    }

                    for(i in data){

                        var feature = new ol.Feature({
                            // layerType : layerType,
                            SIG_CD : data[i].sigCd,
                            layerID : options.dataType,
                            LT_CHC_YN : data[i].ltChcYn,
                            LT_CHC_YN_NEW : data[i].ltChcYnNew,
                        });

                        if(options.dataType == DATA_TYPE.SPPN){
                            var ponitX = data[i].pointX;
                            var ponitY = data[i].pointY;
                            
                            var point =  new ol.geom.Point([ponitX,ponitY]);
                            feature.setGeometry(point);
                            feature.setId(options.typeName + '.' +data[i].spoNoSeq);
                            feature.set("VRIFY_DE",data[i].vrifyDe);
                            feature.set("RESEARCH_GBN",data[i].researchGbn);
                            feature.set("SPO_NO_SEQ",data[i].spoNoSeq);
                            // feature.set("spoNoSeq",data[i].spoNoSeq);
                            feature.set("SPO_NO_CD",data[i].spoNoCd);

                            feature.setStyle(sppnStyle(options,feature));

                        }else if(options.dataType == DATA_TYPE.AOT){
                            
                            var ponitX = data[i].pointX;
                            var ponitY = data[i].pointY;
                            var objMngNo = data[i].objMngNo;
                            var objKndCd = data[i].objKndCd;
                            var compositionNo = data[i].compositionNo;

                            switch (objKndCd) {
                                case 'OBJ01':
                                    riverpkCnt = data.length;
                                    break;
                                case 'OBJ02':
                                    eqoutCnt = data.length;
                                    break;
                                case 'OBJ04':
                                    taxistCnt = data.length;
                                    break;
                            
                                default:
                                    break;
                            } 

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
                                feature.setId(options.typeName + '.' + objMngNo+'_'+compositionNo);
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
                                feature.setId(options.typeName + '.' + objMngNo+'_'+compositionNo);
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
                                feature.setId(options.typeName + '.' + objMngNo+'_'+compositionNo);
                                feature.setStyle(lineStyle(options,feature));
                                
                            }
                            
                        }
                        feature.set("objMngNo",data[i].objMngNo);
                        feature.set("objNm",data[i].objNm);
                        feature.set("objKndCd",data[i].objKndCd);
                        features.push(feature);
                    }

                    if(layerType.indexOf("aot") > -1){
                        $('.legend .riverPk .total').text(riverpkCnt + '건');
                        $('.legend .eqOut .total').text(eqoutCnt + '건');
                        $('.legend .taxiSt .total').text(taxistCnt + '건');
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

    legendCntClear();

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
            util.toast('기초구간을 사용하는 경우 안내시설 표시가 원활하지 않을 수 있습니다. 참고용으로만 사용해 주시기 바랍니다.','warning',5000);
        }
    }else if(type == 'crsrdpSel'){
        
        var crsrdpRadio = $("[name*=crsrdpRadio]:checked").val();

        if(crsrdpRadio == "C"){//교차로_차량용
            map.addLayer(layers.crsrdp_c);
            map.removeLayer(layers.crsrdp_p);
            util.toast('교차로를 사용하는 경우 안내시설 표시가 원활하지 않을 수 있습니다.','warning',5000);
        }else if(crsrdpRadio == "P"){//교차로_보행자용
            map.addLayer(layers.crsrdp_p);
            map.removeLayer(layers.crsrdp_c);
            util.toast('교차로를 사용하는 경우 안내시설 표시가 원활하지 않을 수 있습니다.','warning',5000);
        }else{
            map.removeLayer(layers.crsrdp_c);
            map.removeLayer(layers.crsrdp_p);
        }
        return;
    }else if(type == 'panelGridSel'){
        layerType = layers.panelGrid;
    }else if(type == 'emdSel'){
        map.removeLayer(layers.emd);
        map.removeLayer(layers.hemd);

        layerType = layers.emd;
        var emdGbnLayer = $(':radio[name|="emdGbnLayerRadio"]:checked').val();
        if(emdGbnLayer == 'ha'){
            layerType = layers.hemd;
        }
        if(onOffGbn == "on"){
            util.toast('읍면동레이어를 사용하는 경우 안내시설 표시가 원활하지 않을 수 있습니다. 참고용으로만 사용해 주시기 바랍니다.','warning',5000);
            $(':radio[name|="emdGbnLayerRadio"]').prop( "disabled", false );
            $("#selSigLayer").prop( "disabled", false );
            $("#selEmdLayer").prop( "disabled", false );

            //시군구목록
            var guIncYn = app.info.guIncYn;
            if(guIncYn == "Y"){
                //구재시 경우에만 조회
                fnSelectSigList2('#selSigLayer');
                // $("#selSigLayer").trigger('change');
            }else{
                $("#selSigLayer").append('<option value="'+ localStorage["admCd"]+ '">'+localStorage["admNm"]+'</option>');
                $("#selSigLayer").val(localStorage["admCd"]);
                $("#selSigLayer").trigger('change');
            }
            
        }else{
            $("#selSigLayer").empty();
            $("#selEmdLayer").empty();
            $("#selSigLayer").append('<option ">시군구</option>');
            $("#selEmdLayer").append('<option ">읍면동</option>');
            $("#selSigLayer").trigger('change');
            $("#selEmdLayer").trigger('change');
            $("#selSigLayer").prop( "disabled", true );
            $("#selEmdLayer").prop( "disabled", true );
            $(':radio[name|="emdGbnLayerRadio"]').prop( "disabled", true );
        }
    }

    
    if(onOffGbn == "on"){
        map.addLayer(layerType);
    }else{
        map.removeLayer(layerType);
    }
    
    
}
function fnChangeEmdGbn(){
    layerToggleController('emdSel');
    fnSelectEmdList2('#selEmdLayer');

}
function fnCheckEmdSearch(){
    var emdSel      = $("#emdSel").val();
    var selSigLayer = $("#selSigLayer").val();
    var selEmdLayer = $("#selEmdLayer").val();

    // console.log("emdSel : " + emdSel + " selSigLayer : " + selSigLayer+" selEmdLayer : " +selEmdLayer);

    if(emdSel == "on" ){
        if(isNaN(selEmdLayer) || selEmdLayer == ""){
            util.toast('[읍면동]을 선택해 주세요.','warning',3000);
            return;
        }else{
            clickRefreschMap();
        }
    }
}

function crsrdpLayerToggle(layerType){

}

function drawSppnGrid(){
    var panelGridSource = new ol.source.Vector;

    var option = {
        style: {
            lineSt:"rgba(0, 051, 0, 0.5)"
        }
    }

    var extent = map.getView().calculateExtent();
    // var extent = map.previousExtent_;

    var zoomLevel = map.getView().getZoom();
    var gridLevel;
    switch (zoomLevel) {
        case 1:
        case 2:
        case 3:
        case 4:    
            gridLevel = 100000;
            break;
        case 5:
        case 6:
        case 7:
            gridLevel = 10000;
            break;
        case 8:
        case 9:
        case 10:
        case 11:
            gridLevel = 1000;
            break;
        case 12:
        case 13:
        case 14:
            gridLevel = 100;
            break;
        case 15:
            gridLevel = 10;
            break;
        default:
            gridLevel = 100000;
            break;
    }

    var xp = parseInt(extent[0]/gridLevel) * gridLevel - gridLevel;
    var yp = parseInt(extent[1]/gridLevel) * gridLevel - gridLevel;

    var maxX = parseInt(extent[2]/gridLevel) * gridLevel + gridLevel;
    var maxY = parseInt(extent[3]/gridLevel) * gridLevel + gridLevel;

    var baseMinXp = 700000;
    var baseMinYp = 1300000;
    var baseMaxXp = 1400000;
    var baseMaxYp = 2100000;

    if(xp < baseMinXp){xp = baseMinXp;};
    if(yp < baseMinYp){xp = baseMinYp;};
    if(maxX > baseMaxXp){maxX = baseMaxXp;};
    if(maxY > baseMaxYp){maxY = baseMaxYp;};

    var pg;
    var xpTmp = xp;
    var ypTmp = yp;
    var maxXTmp;
    var maxYTmp;
    var i = 0;

    //가로선 그리기
    while (ypTmp <= maxY) {
        maxXTmp = maxX;
        
        //정해진 격자외에는 그리지 않게 하는 규칙
        if(ypTmp >= 1700000 && ypTmp < 1800000 && maxX > 1300000){
            maxXTmp = 1300000;
        }else if(ypTmp >= 1500000 && ypTmp < 1700000 && maxX > 1200000){
            maxXTmp = 1200000;
        }else if(ypTmp >= 1400000 && ypTmp < 1500000 && maxX > 1000000){
            maxXTmp = 1000000;
        }else if(ypTmp >= 1300000 && ypTmp < 1400000 && maxX > 900000){
            maxXTmp = 900000;
        }
        pg = new ol.geom.LineString();
        pg.appendCoordinate([xp,ypTmp]);
        pg.appendCoordinate([maxXTmp,ypTmp]);

        var feature = new ol.Feature();
        feature.setGeometry(pg);
        feature.setStyle(lineStyle(option,feature));
        feature.setId(i);
        panelGridSource.addFeature(feature);

        ypTmp += gridLevel;
        i++;
    }

    //세로선 그리기
    while (xpTmp <= maxX) {
        ypTmp = yp;
        
        //정해진 격자외에는 그리지 않게 하는 규칙
        if(xpTmp > 900000 && xpTmp <= 1000000 && ypTmp < 1400000){
            ypTmp = 1400000;
        }else if(xpTmp > 1000000 && xpTmp <= 1200000 && ypTmp < 1500000){
            ypTmp = 1500000;
        }else if(xpTmp > 1200000 && xpTmp <= 1300000 && ypTmp < 1700000){
            ypTmp = 1700000;
        }else if(xpTmp > 1300000 && xpTmp <= 1400000 && ypTmp < 1800000){
            ypTmp = 1800000;
        }
        pg = new ol.geom.LineString();
        pg.appendCoordinate([xpTmp,ypTmp]);
        pg.appendCoordinate([xpTmp,maxY]);

        var feature = new ol.Feature();
        feature.setGeometry(pg);
        feature.setStyle(lineStyle(option,feature));
        feature.setId(i);
        panelGridSource.addFeature(feature);

        //라벨셋팅
        // setGridLabel(extent, panelGridSource, gridLevel, i);

        xpTmp += gridLevel;
        i++;
    }

    //격자라벨
    var isInit = true;
    var labelLevel = gridLevel/2;
    var gridLabel;
    var gridLabelStyle;

    while(ypTmp < maxY){
        xpTmp = xp;
        while(xpTmp < maxX){
            isInit = true;

            if(ypTmp >= 1700000 && ypTmp < 1800000 && xpTmp >= 1300000){
                isInit = false;
            }else if(ypTmp >= 1500000 && ypTmp < 1700000 && xpTmp >= 1200000){
                isInit = false;
            }else if(ypTmp >= 1400000 && ypTmp < 1500000 && xpTmp >= 1000000){
                isInit = false;
            }else if(ypTmp >= 1300000 && ypTmp < 1400000 && xpTmp >= 900000){
                isInit = false;
            }

            if(isInit){

                gridLabel = getKpnLabel(xpTmp + labelLevel, ypTmp + labelLevel, gridLevel);
                
                var opt = {
                    // image: new ol.style.Circle({
                    //     radius: 5,
                    //     fill: new ol.style.Fill({
                    //         color: 'red',
                    //     }),
                    //     stroke: new ol.style.Stroke({
                    //         color: 'rgba(0, 0, 0)',
                    //         width: 1
                    //     })
                    // }),
                    text : new ol.style.Text({
                        text: gridLabel,
                        textAlign: 'center',
                        fill: new ol.style.Fill({ color: 'white' }),
                        stroke: new ol.style.Stroke({ color: 'black',width: 2}),
                        offsetX: 0,
                        offsetY: 0,
                        scale : 2
                    })
                };
                var pointStlye = new ol.style.Style(opt);
                
                var pointFeature = new ol.Feature();
                var pointCd = new ol.geom.Point([xpTmp+gridLevel/2, ypTmp+gridLevel/2]);
                pointFeature.setGeometry(pointCd);
                pointFeature.setStyle(pointStlye);
                pointFeature.setId(i);
                panelGridSource.addFeature(pointFeature);

            }

            xpTmp += gridLevel;
            i++;
        }
        ypTmp += gridLevel;
    }

    layers.panelGrid.getSource().clear();
    layers.panelGrid.setSource(panelGridSource);

    // map.addLayer(lyr_panel_grid);
}

//지점번호 격자 라벨 입력
function setGridLabel(extent, panelGridSource, gridLevel, i){

    var xp = parseInt(extent[0]/gridLevel) * gridLevel - gridLevel;
    var yp = parseInt(extent[1]/gridLevel) * gridLevel - gridLevel;

    var maxX = parseInt(extent[2]/gridLevel) * gridLevel + gridLevel;
    var maxY = parseInt(extent[3]/gridLevel) * gridLevel + gridLevel;

    var baseMinXp = 700000;
    var baseMinYp = 1300000;
    var baseMaxXp = 1400000;
    var baseMaxYp = 2100000;

    if(xp < baseMinXp){xp = baseMinXp;};
    if(yp < baseMinYp){xp = baseMinYp;};
    if(maxX > baseMaxXp){maxX = baseMaxXp;};
    if(maxY > baseMaxYp){maxY = baseMaxYp;};

    var xpTmp = xp;
    var ypTmp = yp;

    var labelLevel = gridLevel/2;
    var gridLabel;
    var gridLabelStyle;

    var isInit = true;

    while(ypTmp < maxY){
        xpTmp = xp;
        while(xpTmp < maxX){
            isInit = true;

            if(ypTmp >= 1700000 && ypTmp < 1800000 && xpTmp >= 1300000){
                isInit = false;
            }else if(ypTmp >= 1500000 && ypTmp < 1700000 && xpTmp >= 1200000){
                isInit = false;
            }else if(ypTmp >= 1400000 && ypTmp < 1500000 && xpTmp >= 1000000){
                isInit = false;
            }else if(ypTmp >= 1300000 && ypTmp < 1400000 && xpTmp >= 900000){
                isInit = false;
            }

            if(isInit){

                gridLabel = getKpnLabel(xpTmp + labelLevel,ypTmp + labelLevel, gridLevel);
                
               
                
                var styleOpt= new ol.style.Text({
                    text: gridLabel,
                    textAlign: 'center',
                    fill: new ol.style.Fill({ color: 'white' }),
                    stroke: new ol.style.Stroke({ color: 'black',width: 10}),
                    offsetX: 0,
                    offsetY: 0,
                    scale : 1.3
                });
                gridLabelStyle = new ol.style.Style({
                    text :  styleOpt
                });

                var opt = {
                    image: new ol.style.Circle({
                        radius: 5,
                        fill: new ol.style.Fill({
                            color: 'red',
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'rgba(0, 0, 0)',
                            width: 1
                        })
                    })
                };
                var pointStlye = new ol.style.Style(opt);
                
                var feature = new ol.Feature();
                var point = new ol.geom.Point([xpTmp+gridLevel/2, ypTmp+gridLevel/2]);
                feature.setGeometry(point);
                // feature.setStyle(pointStlye);
                feature.setId(i+'-'+1);
                panelGridSource.addFeature(feature);

            }

            xpTmp += gridLevel;
        }
        ypTmp += gridLevel;
    }

}

//지점번호판 라벨 생성
function getKpnLabel(x,y,level){
    var hanCode = ["가","나","다","라","마","바","사","아","자","차","카","타","파","하"];
    var base_x = 700000;
    var base_y = 1300000;
    var index = (7 - level.toString().length);
    var xIndex = parseInt((x - base_x)/level).toString();
    var yIndex = parseInt((y - base_y)/level).toString();

    if(level < 1000000){
        xIndex = ("00000"+xIndex).slice(-index);
        yIndex = ("00000"+yIndex).slice(-index);
    }

    var kpnLabel = hanCode[xIndex.substr(0,1)] + hanCode[yIndex.substr(0,1)] + xIndex.substr(1,index) + yIndex.substr(1, index);

    return kpnLabel;
}