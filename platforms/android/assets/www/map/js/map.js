var MODE = { RUNTIME: 1, DEBUG: 0};
var mode = MODE.RUNTIME;
// 서비스 정보

// UTM-K(GRS80) 도로명 배경지도 좌표계(네이버지도)
proj4.defs("EPSG:5179", "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs");
// 보정된 서부원점(Bessel) - KLIS에서 서부지역에 사용중
proj4.defs("EPSG:5173", "+proj=tmerc +lat_0=38 +lon_0=125.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43");
// 보정된 중부원점(Bessel): KLIS에서 중부지역에 사용중
proj4.defs("EPSG:5174","+proj=tmerc +lat_0=38 +lon_0=127.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43");
// 보정된 제주원점(Bessel): KLIS에서 제주지역에 사용중
proj4.defs("EPSG:5175", "+proj=tmerc +lat_0=38 +lon_0=127.0028902777778 +k=1 +x_0=200000 +y_0=550000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43");
// 보정된 동부원점(Bessel): KLIS에서 동부지역에 사용중
proj4.defs("EPSG:5176", "+proj=tmerc +lat_0=38 +lon_0=129.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43");
// 보정된 동해(울릉)원점(Bessel): KLIS에서 울릉지역에 사용중
proj4.defs("EPSG:5177","+proj=tmerc +lat_0=38 +lon_0=131.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43");
//UTM-K(GRS80) 중부원점
proj4.defs("SR-ORG:6640", "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs");

var GIS_SERVICE_URL, baseProjection, sourceProjection, serviceProjection;
var BASE_GIS_SERVICE_URL = "http://m1.juso.go.kr/tms?FIXED=TRUE";


switch(mode) {
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
var mapInit = function(init) {
  
  

  if(!initial)
    initial = true;
  else{
      var layerList = map.getLayers().getArray();
      for(var layer in layerList){
        var title = layerList[layer].get('title');
        if(title != "Mobile Kais Map"){
              map.removeLayer(layerList[layer]);
          }
      }
      return;
  }

    

  $(".ui-page").height("100%");

    // 도로안내시설물위치 레이어
    // 건물번호판 레이어
    var lyr_tl_spbd_buld = getFeatureLayer({
        title: "건물번호판",
//        typeName: "tl_spbd_buld",
        typeName: "tl_spbd_entrc",
        dataType: DATA_TYPE.BULD,
//        style: {
//            label: {
//                format: "{0}({1}-{2})",
//                data: ["BUL_MAN_NO", "ENTRC_SE", "NMT_INS_YN"],
//                textOffsetY: -20
//            }
//        },
        maxResolution: 0.5
    });
    // 도로명판 레이어
    var lyr_tl_spgf_rdpq = getFeatureLayer({
        title: "도로명판",
        typeName: "tlv_spgf_rdpq",
        dataType: DATA_TYPE.RDPQ,
        style: {
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
        maxResolution: 16
    });
    // 기초번호판 레이어
    var lyr_tl_spgf_bsis = getFeatureLayer({
        title: "기초번호판",
        typeName: "tlv_spgf_bsis",
        dataType: DATA_TYPE.BSIS,
        maxResolution: 16
    });

  layers = {
    "buld" : lyr_tl_spbd_buld,
    "rdpq" : lyr_tl_spgf_rdpq,
    "area" : lyr_tl_spgf_area,
    "bsis" : lyr_tl_spgf_bsis
  };


  //기본레이어 생성
  var baseLayer = new ol.layer.Tile({
    title: 'Mobile Kais Map',
    source: new ol.source.TileWMS({
      url : BASE_GIS_SERVICE_URL,
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
  var overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
    id: 'popup',
    element: document.getElementById('popup'),
    position: undefined,
    autoPan: true,
    autoPanAnimation: {
      duration: 250
    }
  }));

  // 현재위치 마커 생성
  var makerOverlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
    id: 'marker',
    position: undefined,
    element: document.getElementById('marker'),
    autoPan: true,
    autoPanAnimation: {
      duration: 250
    }
  }));

  // 성암로 189(사업장)
   var pos = [946842.8750, 1953211.2031];  //EPSG:5179
  // 상당로 155(청주시청)
//   var pos = [999069.3800380124,1849434.7981913204];  //EPSG:5179
  // 중앙로 40(김제시청)
//   var pos = [944131.2044213761, 1756634.1104898946];  //EPSG:5179

    getCurrentLocation(function(location){
        pos = ol.proj.fromLonLat([location.coords.longitude, location.coords.latitude], baseProjection.getCode());
    });


  map = new ol.Map({
    target: 'map',
    logo: false,
    layers: [ baseLayer ],
    interactions: ol.interaction.defaults({
        altShiftDragRotate: false,
        pinchRotate: false
    }),
    controls: ol.control.defaults({
        rotate:false
    }),
    overlays: [overlay, makerOverlay],
    view: new ol.View({
      projection: baseProjection,
      center: pos,
      zoom: 12,
      maxZoom: 15,
      minZoom: 6,
      maxResolution: 2048
    })
  });


/*********** 지도 화면 핸들러 (--start--) ***********/

  // 마우스 이동 이벤트 정의(현재 좌표 보여주기) (--start--)
  map.on('pointermove', function(event) {
  });
  // 마우스 이동 이벤트 정의(현재 좌표 보여주기) (--end--)

  // 선택 이벤트 정의()(--start--)
  map.on('singleclick', function(event) {
    map.forEachFeatureAtPixel(event.pixel, function(feature, layer){
      var sn, features;

      if(feature.getKeys().indexOf('features') >= 0)
        features = feature.get('features');
      else
        features = [ feature ];

      if(features.length > 1) {
        var itemHtml = "<li onclick=\"{4}\">{0}({1}-{2},{3})</li>";
        var strHtml = "", resultHtml = "<ul>{0}</ul>";

        features.forEach(function(feature, index) {
            switch(layer.get('id')) {
                case DATA_TYPE.BULD:
                    var categoryid = "buildsign";
                    var title = "{0} {1}-{2}".format(feature.get('FT_KOR_RN'), feature.get('BULD_MNNM'), feature.get('BULD_SLNO'));
                    var data = []
                    strHtml += itemHtml.format(
                        feature.get('BUL_MAN_NO'),
                        feature.get('BULD_MNNM'),
                        feature.get('BULD_SLNO'),
                        feature.get('BULD_NM'),
                        "util.slide_page('left', pages.detailview, { sn : '" + feature.get('BUL_MAN_NO') + "', categoryid: '" + categoryid  + "', title: '" + title + "' })"
                    );
                    break;
                case DATA_TYPE.RDPQ:
                    var categoryid = "roadsign";
                    var title = "{0} {1}-{2}".format(feature.get('FT_KOR_RN'), feature.get('BSIS_MNNM'), feature.get('BSIS_SLNO'));

                    strHtml += itemHtml.format(
                        feature.get('RD_GDFTY_SN'),
                        feature.get('BSIS_MNNM'),
                        feature.get('BSIS_SLNO'),
                        feature.get('FT_KOR_RN'),
                        "util.slide_page('left', pages.detailview, { sn : '" + feature.get('RD_GDFTY_SN') + "', categoryid: '" + categoryid + "', title: '" + title + "' })"
                    );
                    break;
                case DATA_TYPE.AREA:
                    var categoryid = "areasign";
                    var title = "{0} {1}-{2}".format(feature.get('FT_KOR_RN'), feature.get('BSIS_MNNM'), feature.get('BSIS_SLNO'));

                    strHtml += itemHtml.format(
                        feature.get('RD_GDFTY_SN'),
                        feature.get('FT_KOR_RN'),
                        '',
                        '',
                        "util.slide_page('left', pages.detailview, { sn : '" + feature.get('RD_GDFTY_SN') + "', categoryid: '" + categoryid + "', title: '" + title + "' })"
                    );
                    break;
                case DATA_TYPE.BSIS:
                    var categoryid = "basenumsign";
                    var title = "{0} {1}-{2}".format(feature.get('FT_KOR_RN'), feature.get('BSIS_MNNM'), feature.get('BSIS_SLNO'));

                    strHtml += itemHtml.format(
                        feature.get('RD_GDFTY_SN'),
                        feature.get('FT_KOR_RN'),
                        '',
                        '',
                        "util.slide_page('left', pages.detailview, { sn : '" + feature.get('RD_GDFTY_SN') + "', categoryid: '" + categoryid + "', title: '" + title + "' })"
                    );
                    break;
            }
        });

        $("#popup-content").html(resultHtml.format(strHtml));
        overlay.setPosition(event.coordinate);
      } else {
        feature = features[0];
        switch(layer.get('id')) {
            case DATA_TYPE.BULD:
                var categoryid = "buildsign";
                var title = "{0} {1}-{2}".format(feature.get('FT_KOR_RN'), feature.get('BULD_MNNM'), feature.get('BULD_SLNO'));
                sn = feature.get('BUL_MAN_NO');
                util.slide_page('left', pages.detailview, { sn : sn, categoryid: categoryid, title : title });
                break;
            case DATA_TYPE.RDPQ:
                var categoryid = "roadsign";
                var title = "{0} {1}-{2}".format(feature.get('FT_KOR_RN'), feature.get('BSIS_MNNM'), feature.get('BSIS_SLNO'));
                sn = feature.get('RD_GDFTY_SN');
                util.slide_page('left', pages.detailview, { sn : sn, categoryid: categoryid, title : title });
                break;
            case DATA_TYPE.AREA:
                var categoryid = "areasign";
                var title = "{0} {1}-{2}".format(feature.get('FT_KOR_RN'), feature.get('BSIS_MNNM'), feature.get('BSIS_SLNO'));
                sn = feature.get('RD_GDFTY_SN');
                util.slide_page('left', pages.detailview, { sn : sn, categoryid: categoryid, title : title });
                break;
            case DATA_TYPE.BSIS:
                var categoryid = "basenumsign";
                var title = "{0} {1}-{2}".format(feature.get('FT_KOR_RN'), feature.get('BSIS_MNNM'), feature.get('BSIS_SLNO'));
                sn = feature.get('RD_GDFTY_SN');
                util.slide_page('left', pages.detailview, { sn : sn, categoryid: categoryid, title : title });
                break;
        }
      }
    });
  });
  // 선택 이벤트 정의()(--end--)

  // 지도 변경시 핸들러 정의(--start--)
  map.getView().on('propertychange', function(event) {
    switch (event.key) {
      case 'resolution':
        if(map.getView().getResolution() > 0.5)
            util.toast("정보를 조회 하시려면 확대해 주세요")
        var source = getVectorSource(map);
        if(source)
          source.clear();
        popupCloser(event);
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

//  var geolocation = new ol.Geolocation({
//    tracking: true,
//    projection: map.getView().getProjection()
//  });
//
//  geolocation.on('change', function(evt) {
//    var coord = geolocation.getPosition();
//      iconFeature.getGeometry().setCoordinates(coord);
//      map.getView().setCenter(coord);
//  });


  $("#map_current").on("click", function() {
    getCurrentLocation(locationCallback);
  });


  var locationCallback = function(pos){
    map.getView().setCenter(ol.proj.fromLonLat([pos.coords.longitude, pos.coords.latitude], baseProjection.getCode()));
    setTimeout(function() {
        makerOverlay.setPosition(ol.proj.fromLonLat([pos.coords.longitude, pos.coords.latitude], baseProjection.getCode()));
    }, 1000);
   }

  // 지도 변경시 핸들러 정의(--end--)

  // topMenu 핸들러 정의(--start--)
  $(".ui-controlgroup-controls  .ui-checkbox input:checkbox").bind("change", function(event) {
    var element = event.currentTarget;
    if($(element).is(":checked")) {
      if(map.getView().getResolution() >= eval("layers.{0}.getMaxResolution()".format(element.name)))
        eval("map.getView().setResolution(layers.{0}.getMaxResolution() / 2)".format(element.name));
      eval("map.addLayer(layers.{0})".format(element.name));
    } else {
      eval("map.removeLayer(layers.{0})".format(element.name));
    }
    element.blur();
    return false;
  });

  // topMenu 핸들러 정의(--end--)


/*********** 지도 화면 핸들러 (-- end --) ***********/

    setTimeout(function() {
        if(init) {
            switch(init) {
            case 'roadsign':
                $(".ui-controlgroup-controls  .ui-checkbox input:checkbox[name='rdpq']").click();
                break;
            case 'areasign':
                $(".ui-controlgroup-controls  .ui-checkbox input:checkbox[name='area']").click();
                break;
            case 'basenumsign':
                $(".ui-controlgroup-controls  .ui-checkbox input:checkbox[name='bsis']").click();
                break;
            case 'buildsign':
                $(".ui-controlgroup-controls  .ui-checkbox input:checkbox[name='buld']").click();
                break;
            }
        }
    }, 1500);
};
// 지도 초기화 함수(--end--)

var getSource = function(source) {
  if(source.getSource) {
    return getSource(source.getSource());
  } else {
    if(source instanceof ol.source.Vector)
      return source;
    return;
  }
};

var getVectorSource = function(mapObj) {
  var source;
  mapObj.getLayers().forEach(function(item, index) {
    if(item instanceof ol.layer.Vector)
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
          srName: serviceProjection.getCode(),
          typeName: options.typeName
        };

        var urldata = URLs.postURL(URLs.mapServiceLink,param);

        util.showProgress();
        util.postAJAX('', urldata, true)
        .then(function(context,rcode,results) {
            util.dismissProgress();
            var features = new ol.format.WFS().readFeatures(results, {featureProjection: baseProjection.getCode(), dataProjection:sourceProjection.getCode()});
            console.log("Count of loaded features are " + features.length);
            vectorSource.addFeatures(features);
        },function(context,xhr,error) {
            console.log("조회 error >> " + error +'   '+ xhr);
            util.dismissProgress();
        });
    },
    strategy: ol.loadingstrategy.tile(new ol.tilegrid.createXYZ({
      maxZoom: 19
    }))
  });

  var source;

  if(options.cluster) {
    source =
        new ol.source.Cluster({
            distance: options.cluster.distance,
            geometryFunction: function(feature) {
                if(feature.getGeometry().getType() != "Point")
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
//    id: "vectorLayer:" + options.typeName,
    id: options.dataType,
    title: options.title,
    maxResolution: options.maxResolution,
    source: source
  }
//  if(options.style) {
      vectorOptions.style = function(feature, resolution) {
        return defaultStyle(feature, resolution, options);
//      }
  }

  return new ol.layer.Vector(vectorOptions);
};

var getCurrentLocation = function(callback_func) {
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
        var fn_msg = function(){};

        if (error.code == 1) {
        if (isAndroid()) {
            navigator.notification.alert('"주소찾아"에서 위치 정보를 사용하려면 위치 서비스 권한을 허용해 주세요.', fn_msg, '위치 서비스 사용 설정', '확인');
        } else {
            navigator.notification.alert('"주소찾아"에서 위치정보를 사용하려면, 단말기의 ‘설정 > 개인 정보 보호’에서 위치서비스를 켜주세요.', fn_msg, '위치 서비스 사용 설정', '확인');
        }
        } else if (error.code == 2) {
            navigator.notification.alert('"주소찾아"에서 위치정보를 사용할 수 없습니다.\n잠시 후에 다시 시도해 주세요.', fn_msg, '위치 서비스 사용 설정', '확인');
        } else if (error.code == 3) {
            navigator.notification.alert("위치 서비스 찾는데 시간을 초과하였습니다. 다시 시도 하십시오.", fn_msg, '알림', '확인');
        }
    },
    geolocationOptions
  );
}
