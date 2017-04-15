var defaultStyleOptions = {
    label: {
        textOffsetX: 0,
        textOffsetY: 0
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
    BULD: "01", RDPQ: "02", AREA: "03", BSIS: "04", ENTRC: "05",
    getStatusNameWithCode: function (code) {
        switch (code) {
            case "01":
                return DATA_TYPE.BULD;
            case "02":
                return DATA_TYPE.RDPQ;
            case "03":
                return DATA_TYPE.AREA;
            case "04":
                return DATA_TYPE.BSIS;
            case "05":
                return DATA_TYPE.ENTRC;
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
        stroke: new ol.style.Stroke({ color: 'black' }),
        offsetX: styleOptions.textOffsetX,
        offsetY: styleOptions.textOffsetY
    });
};

var getStyleLabel = function (feature, labelOptions) {
    var arr = [];
    labelOptions.data.forEach(function (obj, index) {
        arr[index] = feature.get(obj);
    });
    return eval("labelOptions.format.format('" + arr.join("','") + "')");
};

var defaultStyle = function (feature, resolution, options) {
    var features, size, style;
    var styleOptions = $.extend(true, {}, defaultStyleOptions, options.style);

    // feature 정보 이용 시 다중 건 단일 건 통일
    if (options.cluster) {
        features = feature.get("features");
    } else {
        features = [feature];
    }
    size = features.length;

    // 스타일 캐쉬 처리
    var key = "";
    if( size == 1 ) {
        var _text = styleOptions.label.text;
        if( typeof(_text) === "object" ) {
            key = _text.func(features[0].get(_text.key));
        } else {
            key = _text;
        }
        styleOptions.label._text = key;
    } else {
        styleOptions.label._text = key = String(size);
    }
    style = (styleCache[options.dataType][key]) ? styleCache[options.dataType][key] : getStyle(options.dataType, styleOptions);
    styleCache[options.dataType][key] = style;

    return style;
};

var getStyle = function(dataType, styleOptions) {
    var retStyle;
    switch (dataType) {
        case DATA_TYPE.BULD:
            retStyle = buildStyle(styleOptions);
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
    }
    return retStyle;
};

// 건물번호판 스타일
var buildStyle = function (styleOptions) {
    var opt = {
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: 'orange'
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

// 도로명판 스타일
var roadStyle = function (styleOptions) {
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

// 지역안내판 스타일
var areaStyle = function (styleOptions) {
    var opt = {
        image: new ol.style.Circle({
            radius: styleOptions.radius,
            fill: new ol.style.Fill({
                color: 'green'
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

// 기초번호판 스타일
var bsisStyle = function (styleOptions) {
    var opt = {
        image: new ol.style.Circle({
            radius: styleOptions.radius,
            fill: new ol.style.Fill({
                color: 'skyblue'
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
