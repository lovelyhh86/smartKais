var defaultStyleOptions = {
    label: {
        textOffsetX: -1,
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
    LOC: "00", RDPQ: "01", ENTRC: "02", BSIS: "03", AREA: "04",  BULD: "99", SPPN: "06", ADRDC:"07",INTRVL:"08",
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
            case "08":
                return DATA_TYPE.INTRVL;
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

    var dataType = options.dataType; //건물 : 99

    // feature 정보 이용 시 다중 건 단일 건 통일
    if (options.cluster) {
        features = feature.get("features");
    } else {
        features = [feature];
    }
    size = features.length;

    if(dataType == DATA_TYPE.LOC){
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
        style = getStyle(options.dataType, styleOptions, features[index] ,mixStyle);
    }else if(dataType == DATA_TYPE.ENTRC){
        key = features[0].get("LT_CHC_YN");
        for(var i = 0 ; size > i; i++){
            var LT_CHC_YN = features[i].get("LT_CHC_YN");
            if(LT_CHC_YN == 0 && size >= 2){
                // console.log(features[i].get("RDFTYLC_SN"));
                index = i;
            }
        }
        var clusterCnt = size;
        if(clusterCnt > 1){
            styleOptions.label._text = key = String(clusterCnt);
        }
        
        style = (styleCache[options.dataType][key]) ? styleCache[options.dataType][key] : getStyle(options.dataType, styleOptions, features[index] ,mixStyle);
        styleCache[options.dataType][key] = style;
    }else if(dataType == DATA_TYPE.BULD){
        key = features[0].get("LT_CHC_YN");
        var eqbManSn = feature.get('EQB_MAN_SN');

        if(key == 1){
            if(eqbManSn != 0){
                if(styleEqbManSnList.length != 0){
                    var gbn = true;
                    $.each(styleEqbManSnList,function( index, element ) {
                        if(eqbManSn == element){
                            gbn = false;
                        }
                    })
                    if(gbn){
                        styleEqbManSnList.push(eqbManSn);
                    }
                }else{
                    styleEqbManSnList.push(eqbManSn);
                }
            }
        }else{
            if(styleEqbManSnList.length != 0){
                $.each(styleEqbManSnList,function( index, element ) {
                    if(eqbManSn == element){
                        key = 1;
                    }
                })
            }

        }
        // 스타일 캐쉬 처리
        style = (styleCache[options.dataType][key]) ? styleCache[options.dataType][key] : getStyle(options.dataType, styleOptions, features[0] ,mixStyle);
        styleCache[options.dataType][key] = style;
    }else if(dataType == DATA_TYPE.INTRVL){
        var format = options.style.label.format;
        var text = options.style.label.text;
        
        key = text;

        styleOptions.label._text = text;
        
        style = (styleCache[options.dataType][key]) ? styleCache[options.dataType][key] : getStyle(options.dataType, styleOptions, features[0] ,mixStyle);
        styleCache[options.dataType][key] = style;
    }else{
        // var text = options.style.label.text;
        
        // key = text;

        var clusterCnt = size;
        if(clusterCnt > 1){
            styleOptions.label._text = key = String(clusterCnt);
        }

        // styleOptions.label._text = text;

        style = (styleCache[options.dataType][key]) ? styleCache[options.dataType][key] : getStyle(options.dataType, styleOptions, features[index] ,mixStyle);
        styleCache[options.dataType][key] = style;
    }

    return style;
};

var getStyle = function(dataType, styleOptions, feature, mixStyle) {
    var retStyle;
    switch (dataType) {
        case DATA_TYPE.LOC:
            retStyle = locStyle(styleOptions, feature, mixStyle);
            break;
        case DATA_TYPE.BULD:
            retStyle = buildStyle(styleOptions, feature);
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
            retStyle = entrcStyle(styleOptions,feature);
            break;
        case DATA_TYPE.INTRVL:
            retStyle = intrvlStyle(styleOptions,feature);
            break;

    }
    return retStyle;
};

// 위치레이어 스타일
var locStyle = function (styleOptions, feature, mixStyle) {
    try {
        //시설물구분
        var rdGdftySe = feature.get('RD_GDFTY_SE');
        //점검여부
        var ltChcYn = feature.get('LT_CHC_YN');
        //설치유형(벽면형 : 00002)
        var instlSe = feature.get('INSTL_SE');
        //설치일자
        var instlDe = feature.get('INSTL_DE');
        var instlDeYear ;
        if(instlDe != null){
            instlDeYear = instlDe.substr(0,4);
        }
        var newYear = util.getToday().substr(0,4);    
        var featureCnt = parseInt(feature.get("LABEL"));
        if(isNaN(featureCnt)){
            featureCnt = 0;
        }
    
        var anchorY = 44;

        var opt;
        if(mixStyle == true){
            if(ltChcYn == 0 || featureCnt > ltChcYn){
                opt = {
                    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                        anchor: [0.45, 40],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'pixels',
                        src: 'image/mix_pos.png'
                    }))
                }
            }else{
                opt = {
                    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                        anchor: [0.45, 40],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'pixels',
                        src: 'image/mix_pos_c.png'
                    }))
                }
            };
        }else if(rdGdftySe == "110" || rdGdftySe == "210" || rdGdftySe == "310"){//도로명판,예고용도로명판,이면용도로명판
            switch(instlSe){
                case "00002": //벽면형
                    if((ltChcYn == 0 && instlDeYear != newYear) || featureCnt > ltChcYn ){ // 점검 x , 올해설치 x
                        opt = {
                            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                                anchor: [0.45, 35],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'pixels',
                                src: 'image/icon_w_legend01.png'
                            }))
                        };
                    }else if(ltChcYn != 0 && instlDeYear != newYear){ // 점검 o , 올해설치 x
                        opt = {
                            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                                anchor: [0.45, 35],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'pixels',
                                src: 'image/icon_cw_legend01.png'
                            }))
                        };
                    }else if((ltChcYn == 0 && instlDeYear == newYear) || featureCnt > ltChcYn){ // 점검 x , 올해설치 o
                        opt = {
                            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                                anchor: [0.45, anchorY],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'pixels',
                                src: 'image/icon_nw_legend01.png'
                            }))
                        };
                    }else if(ltChcYn != 0 && instlDeYear == newYear){ // 점검 o , 올해설치 o
                        opt = {
                            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                                anchor: [0.45, anchorY],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'pixels',
                                src: 'image/icon_ncw_legend01.png'
                            }))
                        };
                    }
                    break;
                default: //벽면형 아님
                    if((ltChcYn == 0 && instlDeYear != newYear) || featureCnt > ltChcYn){ // 점검 x , 올해설치 x
                        opt = {
                            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                                anchor: [0.45, 35],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'pixels',
                                src: 'image/icon_legend01.png'
                            }))
                        };
                    }else if(ltChcYn != 0 && instlDeYear != newYear){ // 점검 o , 올해설치 x
                        opt = {
                            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                                anchor: [0.45, 35],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'pixels',
                                src: 'image/icon_c_legend01.png'
                            }))
                        };
                    }else if((ltChcYn == 0 && instlDeYear == newYear) || featureCnt > ltChcYn){ // 점검 x , 올해설치 o
                        opt = {
                            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                                anchor: [0.45, anchorY],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'pixels',
                                src: 'image/icon_n_legend01.png'
                            }))
                        };
                    }else if(ltChcYn != 0 && instlDeYear == newYear){ // 점검 o , 올해설치 o
                        opt = {
                            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                                anchor: [0.45, anchorY],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'pixels',
                                src: 'image/icon_nc_legend01.png'
                            }))
                        };
                    }
                    break;
            }
        }else if(rdGdftySe == "510"){ // 지역안내판
            switch(instlSe){
                case "00002": //벽면형
                    if((ltChcYn == 0 && instlDeYear != newYear) || featureCnt > ltChcYn){ // 점검 x , 올해설치 x
                        opt = {
                            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                                anchor: [0.45, 35],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'pixels',
                                src: 'image/icon_w_legend03.png'
                            }))
                        };
                    }else if(ltChcYn != 0 && instlDeYear != newYear){ // 점검 o , 올해설치 x
                        opt = {
                            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                                anchor: [0.45, 35],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'pixels',
                                src: 'image/icon_cw_legend03.png'
                            }))
                        };
                    }else if((ltChcYn == 0 && instlDeYear == newYear) || featureCnt > ltChcYn){ // 점검 x , 올해설치 o
                        opt = {
                            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                                anchor: [0.45, anchorY],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'pixels',
                                src: 'image/icon_nw_legend03.png'
                            }))
                        };
                    }else if(ltChcYn != 0 && instlDeYear == newYear){ // 점검 o , 올해설치 o
                        opt = {
                            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                                anchor: [0.45, anchorY],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'pixels',
                                src: 'image/icon_ncw_legend03.png'
                            }))
                        };
                    }
                    break;
                default: //벽면형 아님
                    if((ltChcYn == 0 && instlDeYear != newYear) || featureCnt > ltChcYn){ // 점검 x , 올해설치 x
                        opt = {
                            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                                anchor: [0.45, 35],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'pixels',
                                src: 'image/icon_legend03.png'
                            }))
                        };
                    }else if(ltChcYn != 0 && instlDeYear != newYear){ // 점검 o , 올해설치 x
                        opt = {
                            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                                anchor: [0.45, 35],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'pixels',
                                src: 'image/icon_c_legend03.png'
                            }))
                        };
                    }else if((ltChcYn == 0 && instlDeYear == newYear) || featureCnt > ltChcYn){ // 점검 x , 올해설치 o
                        opt = {
                            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                                anchor: [0.45, anchorY],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'pixels',
                                src: 'image/icon_n_legend03.png'
                            }))
                        };
                    }else if(ltChcYn != 0 && instlDeYear == newYear){ // 점검 o , 올해설치 o
                        opt = {
                            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                                anchor: [0.45, anchorY],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'pixels',
                                src: 'image/icon_nc_legend03.png'
                            }))
                        };
                    }
                    break;
            }
        }else if(rdGdftySe == "610"){
            switch(instlSe){
                case "00002": //벽면형
                    if((ltChcYn == 0 && instlDeYear != newYear) || featureCnt > ltChcYn){ // 점검 x , 올해설치 x
                        opt = {
                            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                                anchor: [0.45, 35],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'pixels',
                                src: 'image/icon_w_legend02.png'
                            }))
                        };
                    }else if(ltChcYn != 0 && instlDeYear != newYear){ // 점검 o , 올해설치 x
                        opt = {
                            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                                anchor: [0.45, 35],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'pixels',
                                src: 'image/icon_cw_legend02.png'
                            }))
                        };
                    }else if((ltChcYn == 0 && instlDeYear == newYear) || featureCnt > ltChcYn){ // 점검 x , 올해설치 o
                        opt = {
                            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                                anchor: [0.45, anchorY],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'pixels',
                                src: 'image/icon_nw_legend02.png'
                            }))
                        };
                    }else if(ltChcYn != 0 && instlDeYear == newYear){ // 점검 o , 올해설치 o
                        opt = {
                            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                                anchor: [0.45, anchorY],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'pixels',
                                src: 'image/icon_ncw_legend02.png'
                            }))
                        };
                    }
                    break;
                default: //벽면형 아님
                    if((ltChcYn == 0 && instlDeYear != newYear) || featureCnt > ltChcYn){ // 점검 x , 올해설치 x
                        opt = {
                            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                                anchor: [0.45, 35],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'pixels',
                                src: 'image/icon_legend02.png'
                            }))
                        };
                    }else if(ltChcYn != 0 && instlDeYear != newYear){ // 점검 o , 올해설치 x
                        opt = {
                            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                                anchor: [0.45, 35],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'pixels',
                                src: 'image/icon_c_legend02.png'
                            }))
                        };
                    }else if((ltChcYn == 0 && instlDeYear == newYear) || featureCnt > ltChcYn){ // 점검 x , 올해설치 o
                        opt = {
                            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                                anchor: [0.45, anchorY],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'pixels',
                                src: 'image/icon_n_legend02.png'
                            }))
                        };
                    }else if(ltChcYn != 0 && instlDeYear == newYear){ // 점검 o , 올해설치 o
                        opt = {
                            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                                anchor: [0.45, anchorY],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'pixels',
                                src: 'image/icon_nc_legend02.png'
                            }))
                        };
                    }
                    break;
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
    } catch (error) {
        navigator.notification.alert(msg.errorLoadLayer, '', '알림', '확인');
        util.dismissProgress();
        return;
    }
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

var styleEqbManSnList = new Array();
// 건물 스타일
var buildStyle = function (styleOptions, feature) {
    
    var ltChcYn = feature.get('LT_CHC_YN');
    
    var opt;
    if(ltChcYn == "1"){
        opt = {
            stroke: new ol.style.Stroke({
                color: 'red',
                width: 4
              }),
            fill: new ol.style.Fill({
                color: 'rgba(255, 0, 0, 0.1)'
              })
        };
    }else{
        opt = {
            stroke: new ol.style.Stroke({
                color: 'blue',
                width: 3
                }),
            fill: new ol.style.Fill({
                color: 'rgba(0, 0, 255, 0.1)'
                })
        };
        
    }

    
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
          src: 'image/icon_legend01.png'
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
var entrcStyle = function (styleOptions,feature) {

    try {
        //점검여부
        var ltChcYn = feature.get('LT_CHC_YN');
        //설치일자
        var instlDe = feature.get('INSTL_DE');
        var instlDeYear = instlDe.substr(0,4);
        var newYear = util.getToday().substr(0,4);    
        
        var anchorY = 44;
        var opt;
        
        
        if(instlDeYear != newYear){//올해설치 X
            if(ltChcYn != 0){ //점검 O
                opt= {
                    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                       anchor: [0.45, 35],
                       anchorXUnits: 'fraction',
                       anchorYUnits: 'pixels',
                       src: 'image/icon_c_legend04.png'
                   }))
               };
            }else{ // 점검 X
                opt= {
                    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                       anchor: [0.45, 35],
                       anchorXUnits: 'fraction',
                       anchorYUnits: 'pixels',
                       src: 'image/icon_legend04.png'
                   }))
               };
            }
            
        }else{ // 올해설치 O
            if(ltChcYn != 0){ //점검 O
                opt= {
                    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                       anchor: [0.45, anchorY],
                       anchorXUnits: 'fraction',
                       anchorYUnits: 'pixels',
                       src: 'image/icon_nc_legend04.png'
                   }))
               };
            }else{ // 점검 X
                opt= {
                    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                       anchor: [0.45, anchorY],
                       anchorXUnits: 'fraction',
                       anchorYUnits: 'pixels',
                       src: 'image/icon_n_legend04.png'
                   }))
               };
            }

        }
        
        if( styleOptions.label._text)
            opt.text = createTextStyle(styleOptions);
    
        return new ol.style.Style(opt);
    } catch (error) {
        navigator.notification.alert(msg.errorLoadLayer, '', '알림', '확인');
        util.dismissProgress();
        return;
    }
};

//기초구역
var intrvlStyle = function(styleOptions,feature){

    var startX = feature.getGeometry().getCoordinateAt(0)[0];
    var startY = feature.getGeometry().getCoordinateAt(0)[1];
    var endX = feature.getGeometry().getCoordinateAt(1)[0];
    var endY = feature.getGeometry().getCoordinateAt(1)[1];

    var offsetX = 0;
    var offsetY = 0;
    //왼쪽이 홀수
    if(startX - endX > 0){
        offsetY = 10;
    }else{
        offsetY = -10;
    }


    var text = "{0}{1}".format(feature.get("ODD_BSI_MN") , feature.get("ODD_BSI_SL") == "0"?"":"-"+feature.get("ODD_BSI_SL"));
    var opt = {
        
        stroke: new ol.style.Stroke({
            color: 'green',
            width: 2
          }),
        text: new ol.style.Text({
            textAlign: "center",
            textBaseline: "hanging",
            // font: font,
            text: text,
            fill: new ol.style.Fill({color: "red"}),
            // stroke: new ol.style.Stroke({color: outlineColor, width: outlineWidth}),
            offsetX: offsetX,
            offsetY: offsetY,
            placement: "line",
            // maxAngle: maxAngle,
            // overflow: overflow,
            // rotation: rotation
            scale : 1.3
            })
    };

    var ODD_BSI_MN = feature.get("ODD_BSI_MN");
    var ODD_BSI_SL = feature.get("ODD_BSI_SL");
    

    // opt.text = createTextStyle(styleOptions);
    return new ol.style.Style(opt);
}

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
