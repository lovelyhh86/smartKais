
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
                    var data = results.data;

                    if(data == null || data.length == 0){
                        util.toast("데이터 없음", "error");
                        util.dismissProgress();
                        return;
                    }
                    var features = new Array();

                    console.log("({2}) The number of features viewed is {0}. extent({1})".format(features.length, extent.join(','), options.typeName));

                    for(i in data){
                        var ponitX = data[i].pointX;
                        var ponitY = data[i].pointY;

                        var feature = new ol.Feature({
                            rdFtyLcSn : data[i].rdFtyLcSn,
                            rdGdftySn : data[i].rdGdftySn
                        });

                        var point =  new ol.geom.Point([ponitX,ponitY]);

                        feature.setGeometry(point);
                        var color = 'red';
                        if(options.dataType == DATA_TYPE.ENTRC){
                            color = 'blue';
                        }

                        feature.setStyle(new ol.style.Style({
                            image: new ol.style.Circle({
                                radius: 10,
                                fill: new ol.style.Fill({
                                    color: color
                                }),
                                stroke: new ol.style.Stroke({
                                    color: '#fff',
                                    width: 2
                                })
                            })
                        }));

                        // feature.setId(options.dataType + '_' +data[i].rdGdftySn);
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
    });

    var vectorOptions = {
        id: 'a',
        title: 'b',
        source: vectorSource
    }
    return new ol.layer.Vector(vectorOptions);
};