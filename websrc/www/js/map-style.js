var defaultStyleOptions = {
    label: {
        textOffsetX: 0,
        textOffsetY: -17
    },
    radius: 5
};

var LAST_CHECK_STATUS = {
    NORMAL: "01", DAMAGE: "02", LOSS: "03",
    getStatusNameWithCode: function (code) {
        switch (code) {
            case "01":
                return LAST_CHECK_STATUS.NORMAL;
            case "02":
                return LAST_CHECK_STATUS.DAMAGE;
            case "03":
                return LAST_CHECK_STATUS.LOSS;
            default:
                return;
        }
    }
};

var DATA_TYPE = {
    LOC: "00", RDPQ: "01", ENTRC: "02", BSIS: "03", AREA: "04",  BULD: "99", SPPN: "06", ADRDC:"07",
    getStatusNameWithCode: function (code) {
        switch (code) {
            case "00":
                return DATA_TYPE.LOC;
            case "01":
                return DATA_TYPE.RDPQ;
            case "02":
                return DATA_TYPE.ENTRC;
            case "03":
                return DATA_TYPE.BSIS;
            case "04":
                return DATA_TYPE.AREA;
            case "99":
                return DATA_TYPE.BULD;
            case "06":
                return DATA_TYPE.SPPN;
            case "07":
                return DATA_TYPE.ADRDC;
            default:
                return;
        }
    }
};
var styleCache = {};
for(var k in DATA_TYPE) {
    if(typeof(k) !== "function") {
        styleCache[DATA_TYPE[k]] = {};
    }
}

var createTextStyle = function (styleOptions) {
    return new ol.style.Text({
        text: styleOptions.label._text,
        textAlign: 'center',
        fill: new ol.style.Fill({ color: 'white' }),
        stroke: new ol.style.Stroke({ color: 'black',width: styleOptions.label.width}),
        offsetX: styleOptions.label.textOffsetX,
        offsetY: styleOptions.label.textOffsetY,
        scale : 1.3
    });
};

var getStyleLabel = function (feature, labelOptions) {
    var arr = [];
    labelOptions.data.forEach(function (obj, index) {
        arr[index] = feature.get(obj);
    });
    var strFormat = "";
    if(labelOptions.chkCondition && labelOptions.chkCondition(feature, labelOptions)) {
        strFormat = labelOptions.format[1];
    } else {
        strFormat = labelOptions.format[0];
    }

    return eval("strFormat.format('" + arr.join("','") + "')");
};

var defaultStyle = function (feature, resolution, options) {
    var features, size, style;
    var mixStyle = false;
    var index = 0;
    var styleOptions = $.extend(true, {}, defaultStyleOptions, options.style);

    // feature 정보 이용 시 다중 건 단일 건 통일
    if (options.cluster) {
        features = feature.get("features");
    } else {
        features = [feature];
    }
    size = features.length;

    var oldRdGdftySe;
    var newRdGdftySe;
    for(var i = 0 ; size > i; i++){
        var LT_CHC_YN = features[i].get("LT_CHC_YN");
        if(LT_CHC_YN == 0 && size >= 2){
            // console.log(features[i].get("RDFTYLC_SN"));
            index = i;
        }

        if(i==0){
            oldRdGdftySe = features[i].get("RD_GDFTY_SE");
        }
        
        if(oldRdGdftySe == "999"){
            mixStyle = true ;
            break;
        }else{
            newRdGdftySe = features[i].get("RD_GDFTY_SE");
            
            if(oldRdGdftySe != newRdGdftySe){
                mixStyle = true ;
                break;
            }
        }
    }
    

    // 스타일 캐쉬 처리
    var key = "";
    var _text = styleOptions.label.text;
    var clusterCnt = size;
    if( size == 1 ) {
        if(_text) {
            if( typeof(_text) === "object" ) {
                key = _text.func(features[index].get(_text.key));
            } else {
                key = _text;
            }
        } else {
                // key = getStyleLabel(features[0], styleOptions.label);
                key = '';
        }
        styleOptions.label._text = key;
    } else {
        if(_text) {
            for(var i = 0 ; size > i ; i++){
                var label = _text.func(features[i].get(_text.key));
                var cnt = parseInt(label);
                if(!isNaN(cnt)){
                    clusterCnt += cnt - 1;
                }
            }
        }else{
            key = '';
        }
        styleOptions.label._text = key = String(clusterCnt);
    }
    // style = (styleCache[options.dataType][key]) ? styleCache[options.dataType][key] : getStyle(options.dataType, styleOptions, features[0] ,mixStyle);
    // styleCache[options.dataType][key] = style;
    
    style = getStyle(options.dataType, styleOptions, features[index] ,mixStyle);

    return style;
};

var getStyle = function(dataType, styleOptions, feature, mixStyle) {
    var retStyle;
    switch (dataType) {
        case DATA_TYPE.LOC:
            retStyle = locStyle(styleOptions, feature, mixStyle);
            break;
        case DATA_TYPE.BULD:
            retStyle = buildStyle(styleOptions);
            break;
        case DATA_TYPE.SPPN:
            retStyle = sppnStyle(styleOptions, feature, mixStyle);
            break;
        case DATA_TYPE.RDPQ:
            retStyle = roadStyle(styleOptions);
            break;
        case DATA_TYPE.AREA:
            retStyle = areaStyle(styleOptions);
            break;
        case DATA_TYPE.BSIS:
            retStyle = bsisStyle(styleOptions);
            break;
        case DATA_TYPE.ENTRC:
            retStyle = entrcStyle(styleOptions);
            break;

    }
    return retStyle;
};

// 위치레이어 스타일
var locStyle = function (styleOptions, feature, mixStyle) {
    var rdGdftySe = feature.get('RD_GDFTY_SE');
    var ltChcYn = feature.get('LT_CHC_YN');
    var opt;
    if(mixStyle == true){
        opt = {
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                anchor: [0.45, 40],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: 'image/mixPos4.png'
            }))
        };
    }else if(rdGdftySe == "110" || rdGdftySe == "210" || rdGdftySe == "310"){
    // }else if(rdGdftySe == "110"){
        if(ltChcYn == 0){
            opt = {
                image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                    anchor: [0.45, 35],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    src: 'img/icon_legend01.png'
                }))
            };
        }else{
            opt = {
                image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                    anchor: [0.45, 35],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    src: 'image/check_road.png'
                }))
            };
        }
    }else if(rdGdftySe == "510"){
        if(ltChcYn == 0){
            opt = {
                image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                    anchor: [0.45, 35],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    src: 'img/icon_legend03.png'
                }))
            };
        }else{
            opt = {
                image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                    anchor: [0.45, 35],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    src: 'image/check_area.png'
                }))
            };
        }
    }else if(rdGdftySe == "610"){
        if(ltChcYn == 0){
            opt = {
                image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                    anchor: [0.45, 35],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    src: 'img/icon_legend02.png'
                }))
            };
        }else{
            opt = {
                image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                    anchor: [0.45, 35],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    src: 'image/check_bsis.png'
                }))
            };
        }
    }else if(rdGdftySe == "999"){
        opt = {
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                anchor: [0.45, 40],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: 'image/mixPos.png'
            }))
        };
    }else{
        
        opt = {
             image: new ol.style.Circle({
                radius: 0,
                fill: new ol.style.Fill({
                    color: '#ffffff'
                }),
                stroke: new ol.style.Stroke({
                    color: '#ffffff',
                    width: 0
                })
            })
        };
        
    }
    
    
    if( styleOptions.label._text)
        opt.text = createTextStyle(styleOptions);

    return new ol.style.Style(opt);
};

// 지점번호 스타일
var sppnStyle = function (styleOptions, feature, mixStyle) {
    
    var opt = {
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.45, 35],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: 'img/icon_legend04.png'
        }))
    };
    // var opt = {
    //     image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
    //         anchor: [0.45, 35],
    //         anchorXUnits: 'fraction',
    //         anchorYUnits: 'pixels',
    //         src: 'image/check_road.png'
    //     }))
    // };
    if( styleOptions.label._text)
        opt.text = createTextStyle(styleOptions);

    return new ol.style.Style(opt);
};

// 건물 스타일
var buildStyle = function (styleOptions) {
    var opt = {
        // image: new ol.style.Circle({
        //     radius: 7,
        //     fill: new ol.style.Fill({
        //         color: 'orange'
        //     }),
        //     stroke: new ol.style.Stroke({
        //         color: 'white',
        //         width: 1
        //     })
        // })
        stroke: new ol.style.Stroke({
            color: 'blue',
            width: 3
          }),
        fill: new ol.style.Fill({
            color: 'rgba(0, 0, 255, 0.1)'
          })
    };
    if( styleOptions.label._text)
        opt.text = createTextStyle(styleOptions);
    
    return new ol.style.Style(opt);
};

// 도로명판 스타일
var roadStyle = function (styleOptions) {
    var opt = {
        // image: new ol.style.Circle({
        //     radius: styleOptions.radius,
        //     fill: new ol.style.Fill({
        //         color: 'blue'
        //     }),
        //     stroke: new ol.style.Stroke({
        //         color: 'white',
        //         width: 1
        //     })
        // })
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        anchor: [0.45, 35],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: 'img/icon_legend01.png'
        }))
    };
    if( styleOptions.label._text)
        opt.text = createTextStyle(styleOptions);

    return new ol.style.Style(opt);
};

// 지역안내판 스타일
var areaStyle = function (styleOptions) {
    var opt = {
        // image: new ol.style.Circle({
        //     radius: styleOptions.radius,
        //     fill: new ol.style.Fill({
        //         color: 'green'
        //     }),
        //     stroke: new ol.style.Stroke({
        //         color: 'white',
        //         width: 1
        //     })
        // })
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        anchor: [0.45, 35],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: 'img/icon_legend03.png'
        }))
    };
    if( styleOptions.label._text)
        opt.text = createTextStyle(styleOptions);

    return new ol.style.Style(opt);
};

// 기초번호판 스타일
var bsisStyle = function (styleOptions) {
    var opt = {
        // image: new ol.style.Circle({
        //     radius: styleOptions.radius,
        //     fill: new ol.style.Fill({
        //         color: 'skyblue'
        //     }),
        //     stroke: new ol.style.Stroke({
        //         color: 'white',
        //         width: 1
        //     })
        // })
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        anchor: [0.45, 35],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: 'img/icon_legend02.png'
        }))
    };
    if( styleOptions.label._text)
        opt.text = createTextStyle(styleOptions);

    return new ol.style.Style(opt);
};

// 건물번호판(출입구) 스타일
var entrcStyle = function (styleOptions) {
    var opt = {
         image: new ol.style.Circle({
             radius: styleOptions.radius,
             fill: new ol.style.Fill({
                 color: 'blue'
             }),
             stroke: new ol.style.Stroke({
                 color: 'white',
                 width: 1
             })
         })
    };
    if( styleOptions.label._text)
        opt.text = createTextStyle(styleOptions);

    return new ol.style.Style(opt);
};

// 시설물 상태(정상)
var normalStatusStyle = function (styleOptions) {
    var opt = {
        image: new ol.style.Circle({
            radius: styleOptions.radius,
            fill: new ol.style.Fill({
                color: 'rgba(0,0,255,0.3)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0,0,255,0.8)',
                width: 1
            })
        })
    };
    if( styleOptions.label._text)
        opt.text = createTextStyle(styleOptions);

    return new ol.style.Style(opt);
};
// 시설물 상태(훼손)
var damageStatusStyle = function (styleOptions) {
    var opt = {
        image: new ol.style.Circle({
            radius: styleOptions.radius,
            fill: new ol.style.Fill({
                color: 'rgba(0,255,0,0.3)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0,255,0,0.8)',
                width: 1
            })
        })
    };
    if( styleOptions.label._text)
        opt.text = createTextStyle(styleOptions);

    return new ol.style.Style(opt);
};
// 시설물 상태(망실)
var lossStatusStyle = function (styleOptions) {
    var opt = {
        image: new ol.style.Circle({
            radius: styleOptions.radius,
            fill: new ol.style.Fill({
                color: 'rgba(255,0,0,0.3)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(255,0,0,0.8)',
                width: 1
            })
        })
    };
    if( styleOptions.label._text)
        opt.text = createTextStyle(styleOptions);
    
    return new ol.style.Style(opt);
};
// 시설물 상태 없음(기타)
var etcStatusStyle = function (styleOptions) {
    var opt = {
        image: new ol.style.Circle({
            radius: styleOptions.radius,
            fill: new ol.style.Fill({
                color: 'rgba(100,100,100,0.3)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(100,100,100,0.8)',
                width: 1
            })
        })
    };
    if( styleOptions.label._text)
        opt.text = createTextStyle(styleOptions);

    return new ol.style.Style(opt);
};
