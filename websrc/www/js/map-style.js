var defaultStyleOptions = {
    label: {
        text: { key: "LABEL", func: function(text) { return text } },
                textOffsetX: -1,
                textOffsetY: -18,
                width: 1
    },
    radius: 12
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
    LOC: "00", RDPQ: "01", ENTRC: "02", BSIS: "03", AREA: "04",  BULD: "99", SPPN: "06", ADRDC:"07",INTRVL:"08",AOT:"10",
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
            case "10":
                return DATA_TYPE.AOT;
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

var createTextStyle_new = function (label) {
    return new ol.style.Text({
        text: label,
        textAlign: 'center',
        fill: new ol.style.Fill({ color: 'white' }),
        stroke: new ol.style.Stroke({ color: 'black',width: defaultStyleOptions.label.width}),
        offsetX: defaultStyleOptions.label.textOffsetX,
        offsetY: defaultStyleOptions.label.textOffsetY,
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
        var oldInstlSe;
        var newInstlSe;
        for(var i = 0 ; size > i; i++){
            var LT_CHC_YN = features[i].get("LT_CHC_YN");
            var RE_STT_SUM = features[i].get("RE_STT_SUM");

            if(size >= 2){
                // console.log(features[i].get("RDFTYLC_SN"));
                if(LT_CHC_YN == 0){ //미점건 우선
                    index = i;
                }else if(LT_CHC_YN > RE_STT_SUM){ //비정상건 차순위
                    index = i;
                }else{
                    //일반 삼순위
                }
            }

            if(i==0){
                oldRdGdftySe = features[i].get("RD_GDFTY_SE");
                oldInstlSe = features[i].get("INSTL_SE");
            }
            
            if(oldRdGdftySe == "999"){
                mixStyle = true ;
                break;
            }else{
                newRdGdftySe = features[i].get("RD_GDFTY_SE");
                newInstlSe = features[i].get("INSTL_SE");
                
                if(oldRdGdftySe != newRdGdftySe){
                    mixStyle = true ;
                    break;
                }else if(oldInstlSe != newInstlSe && (oldInstlSe == "00002" || newInstlSe == "00002")){
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
            var RE_STT_SUM = features[i].get("RE_STT_SUM");

            if(size >= 2){
                if(LT_CHC_YN == 0){ //미점건 우선
                    index = i;
                }else if(LT_CHC_YN > RE_STT_SUM){ //비정상건 차순위
                    index = i;
                }else{
                    //일반 삼순위
                }
            }
        }
        var clusterCnt = size;
        if(clusterCnt > 1){
            styleOptions.label._text = key = String(clusterCnt);
        }
        style = styleCache[options.dataType];
        if(style){
            style = getStyle(options.dataType, styleOptions, features[index] ,mixStyle);
        }
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
        
        style = getStyle(options.dataType, styleOptions, features[0] ,mixStyle);
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
        //올해정상점검건수
        var reSttSum = feature.get('RE_STT_SUM');
        //작년정상점검건수
        var reSttSumOld = feature.get('RE_STT_SUM_OLD');
        //올해점검여부
        var ltChcYn = feature.get('LT_CHC_YN');
        //작년점검여부
        var ltChcYnOld = feature.get('LT_CHC_YN_OLD');

        //작년 점검여부 표시 + 올해 점검 포함
        // if(localStorage["researchCheckGbn"] != null && localStorage["researchCheckGbn"] == "true"){
        //     ltChcYn == 0 ? ltChcYn = ltChcYnOld : ltChcYn = ltChcYn;
        //     reSttSum == 0 ? reSttSum = reSttSumOld : reSttSum = reSttSum;
        // }

        //설치유형(벽면형 : 00002)
        var instlSe = feature.get('INSTL_SE');
        //설치일자
        var instlDe = feature.get('INSTL_DE');
        //사용대상
        var useTarget = feature.get('USE_TRGET');
        var instlDeYear ;
        if(instlDe != null){
            instlDeYear = instlDe.substr(0,4);
        }
        var newYear = util.getToday().substr(0,4);    
        var featureCnt = parseInt(feature.get("LABEL"));
        if(isNaN(featureCnt)){
            featureCnt = 0;
        }
    
        var anchorY = 44; // 아이콘 위치
        var iconNm = 'image/icon_legend01.png'; // 아이콘 명칭

        var opt;
        if(mixStyle == true || rdGdftySe == "999"){
            if(ltChcYn == 0 || featureCnt > ltChcYn){
                iconNm = 'image/icon_mixPos.png';
                anchorY = 35;
                // opt = {
                //     image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                //         anchor: [0.45, 35],
                //         anchorXUnits: 'fraction',
                //         anchorYUnits: 'pixels',
                //         src: 'image/icon_mixPos.png'
                //     }))
                // }
            }else{
                if(reSttSum == ltChcYn){//정상점검
                    iconNm = 'image/icon_mixPos_c.png';
                }else{
                    iconNm = 'image/icon_mixPos_c2.png';
                }
                anchorY = 35;
                // opt = {
                //     image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                //         anchor: [0.45, 35],
                //         anchorXUnits: 'fraction',
                //         anchorYUnits: 'pixels',
                //         src: 'image/c_mixPos.png'
                //     }))
                // }
            };
        }else if(rdGdftySe == "110" || rdGdftySe == "210" || rdGdftySe == "310"){//도로명판,예고용도로명판,이면용도로명판
            if(useTarget == "01000"){ // 사용대상이 보행자용이 맞는 경우에만 벽면형 표현
                switch(instlSe){
                    case "00002": //벽면형
                        if((ltChcYn == 0 && instlDeYear == newYear) || featureCnt > ltChcYn){ // 점검 x , 올해설치 o
                            iconNm = 'image/icon_legend01_wn.png';
                            // opt = {
                            //     image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                            //         anchor: [0.45, 35],
                            //         anchorXUnits: 'fraction',
                            //         anchorYUnits: 'pixels',
                            //         src: 'image/icon_legend01_w.png'
                            //     }))
                            // };
                        }else if(ltChcYn != 0 && instlDeYear != newYear){ // 점검 o , 올해설치 x
                            if(reSttSum == ltChcYn){//정상점검
                                iconNm = 'image/icon_legend01_wc.png';
                            }else{
                                iconNm = 'image/icon_legend01_wc2.png';
                            }
                            anchorY = 35;
                            // opt = {
                            //     image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                            //         anchor: [0.45, 35],
                            //         anchorXUnits: 'fraction',
                            //         anchorYUnits: 'pixels',
                            //         src: 'image/icon_legend01_wc.png'
                            //     }))
                            // };
                        }else if((ltChcYn == 0 && instlDeYear != newYear) || featureCnt > ltChcYn ){ // 점검 x , 올해설치 x
                            iconNm = 'image/icon_legend01_w.png';
                            anchorY = 35;
                            // opt = {
                            //     image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                            //         anchor: [0.45, anchorY],
                            //         anchorXUnits: 'fraction',
                            //         anchorYUnits: 'pixels',
                            //         src: 'image/icon_legend01_wn.png'
                            //     }))
                            // };
                        }else if(ltChcYn != 0 && instlDeYear == newYear){ // 점검 o , 올해설치 o
                            if(reSttSum == ltChcYn){//정상점검
                                iconNm = 'image/icon_legend01_wnc.png';
                            }else{
                                iconNm = 'image/icon_legend01_wnc2.png';
                            }
                            // opt = {
                            //     image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                            //         anchor: [0.45, anchorY],
                            //         anchorXUnits: 'fraction',
                            //         anchorYUnits: 'pixels',
                            //         src: 'image/icon_legend01_wnc.png'
                            //     }))
                            // };
                        }
                        break;
                    default: //벽면형 아님
                        if((ltChcYn == 0 && instlDeYear != newYear) || featureCnt > ltChcYn){ // 점검 x , 올해설치 x
                            iconNm = 'image/icon_legend01.png';
                            anchorY = 35;
                            // opt = {
                            //     image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                            //         anchor: [0.45, 35],
                            //         anchorXUnits: 'fraction',
                            //         anchorYUnits: 'pixels',
                            //         src: 'image/icon_legend01.png'
                            //     }))
                            // };
                        }else if(ltChcYn != 0 && instlDeYear != newYear){ // 점검 o , 올해설치 x
                            if(reSttSum == ltChcYn){//정상점검
                                iconNm = 'image/icon_legend01_c.png';
                            }else{
                                iconNm = 'image/icon_legend01_c2.png';
                            }
                            anchorY = 35;
                            // opt = {
                            //     image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                            //         anchor: [0.45, 35],
                            //         anchorXUnits: 'fraction',
                            //         anchorYUnits: 'pixels',
                            //         src: 'image/icon_legend01_c.png'
                            //     }))
                            // };
                        }else if((ltChcYn == 0 && instlDeYear == newYear) || featureCnt > ltChcYn){ // 점검 x , 올해설치 o
                            iconNm = 'image/icon_legend01_n.png';
                            // opt = {
                            //     image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                            //         anchor: [0.45, anchorY],
                            //         anchorXUnits: 'fraction',
                            //         anchorYUnits: 'pixels',
                            //         src: 'image/icon_legend01_n.png'
                            //     }))
                            // };
                        }else if(ltChcYn != 0 && instlDeYear == newYear){ // 점검 o , 올해설치 o
                            if(reSttSum == ltChcYn){//정상점검
                                iconNm = 'image/icon_legend01_nc.png';
                            }else{
                                iconNm = 'image/icon_legend01_nc2.png';
                            }
                            // opt = {
                            //     image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                            //         anchor: [0.45, anchorY],
                            //         anchorXUnits: 'fraction',
                            //         anchorYUnits: 'pixels',
                            //         src: 'image/icon_legend01_nc.png'
                            //     }))
                            // };
                        }
                        break;
                }
            }else{
                if((ltChcYn == 0 && instlDeYear != newYear) || featureCnt > ltChcYn){ // 점검 x , 올해설치 x
                    iconNm = 'image/icon_legend01.png';
                    anchorY = 35;
                    // opt = {
                    //     image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                    //         anchor: [0.45, 35],
                    //         anchorXUnits: 'fraction',
                    //         anchorYUnits: 'pixels',
                    //         src: 'image/icon_legend01.png'
                    //     }))
                    // };
                }else if(ltChcYn != 0 && instlDeYear != newYear){ // 점검 o , 올해설치 x
                    if(reSttSum == ltChcYn){//정상점검
                        iconNm = 'image/icon_legend01_c.png';
                    }else{
                        iconNm = 'image/icon_legend01_c2.png';
                    }
                    anchorY = 35;
                    // opt = {
                    //     image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                    //         anchor: [0.45, 35],
                    //         anchorXUnits: 'fraction',
                    //         anchorYUnits: 'pixels',
                    //         src: 'image/icon_legend01_c.png'
                    //     }))
                    // };
                }else if((ltChcYn == 0 && instlDeYear == newYear) || featureCnt > ltChcYn){ // 점검 x , 올해설치 o
                    iconNm = 'image/icon_legend01_n.png';
                    // opt = {
                    //     image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                    //         anchor: [0.45, anchorY],
                    //         anchorXUnits: 'fraction',
                    //         anchorYUnits: 'pixels',
                    //         src: 'image/icon_legend01_n.png'
                    //     }))
                    // };
                }else if(ltChcYn != 0 && instlDeYear == newYear){ // 점검 o , 올해설치 o
                    if(reSttSum == ltChcYn){//정상점검
                        iconNm = 'image/icon_legend01_nc.png';
                    }else{
                        iconNm = 'image/icon_legend01_nc2.png';
                    }
                    // opt = {
                    //     image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                    //         anchor: [0.45, anchorY],
                    //         anchorXUnits: 'fraction',
                    //         anchorYUnits: 'pixels',
                    //         src: 'image/icon_legend01_nc.png'
                    //     }))
                    // };
                }
            }
        }else if(rdGdftySe == "510"){ // 지역안내판
            switch(instlSe){
                // case "00002": //벽면형
                //     if((ltChcYn == 0 && instlDeYear != newYear) || featureCnt > ltChcYn){ // 점검 x , 올해설치 x
                //         opt = {
                //             image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                //                 anchor: [0.45, 35],
                //                 anchorXUnits: 'fraction',
                //                 anchorYUnits: 'pixels',
                //                 src: 'image/icon_w_legend03.png'
                //             }))
                //         };
                //     }else if(ltChcYn != 0 && instlDeYear != newYear){ // 점검 o , 올해설치 x
                //         opt = {
                //             image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                //                 anchor: [0.45, 35],
                //                 anchorXUnits: 'fraction',
                //                 anchorYUnits: 'pixels',
                //                 src: 'image/icon_cw_legend03.png'
                //             }))
                //         };
                //     }else if((ltChcYn == 0 && instlDeYear == newYear) || featureCnt > ltChcYn){ // 점검 x , 올해설치 o
                //         opt = {
                //             image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                //                 anchor: [0.45, anchorY],
                //                 anchorXUnits: 'fraction',
                //                 anchorYUnits: 'pixels',
                //                 src: 'image/icon_nw_legend03.png'
                //             }))
                //         };
                //     }else if(ltChcYn != 0 && instlDeYear == newYear){ // 점검 o , 올해설치 o
                //         opt = {
                //             image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                //                 anchor: [0.45, anchorY],
                //                 anchorXUnits: 'fraction',
                //                 anchorYUnits: 'pixels',
                //                 src: 'image/icon_ncw_legend03.png'
                //             }))
                //         };
                //     }
                //     break;
                default: //벽면형 아님
                    if((ltChcYn == 0 && instlDeYear != newYear) || featureCnt > ltChcYn){ // 점검 x , 올해설치 x
                        iconNm = 'image/icon_legend03.png';
                        anchorY = 35;
                        // opt = {
                        //     image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                        //         anchor: [0.45, 35],
                        //         anchorXUnits: 'fraction',
                        //         anchorYUnits: 'pixels',
                        //         src: 'image/icon_legend03.png'
                        //     }))
                        // };
                    }else if(ltChcYn != 0 && instlDeYear != newYear){ // 점검 o , 올해설치 x
                        if(reSttSum == ltChcYn){//정상점검
                            iconNm = 'image/icon_legend03_c.png';
                        }else{
                            iconNm = 'image/icon_legend03_c2.png';
                        }
                        anchorY = 35;
                        // opt = {
                        //     image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                        //         anchor: [0.45, 35],
                        //         anchorXUnits: 'fraction',
                        //         anchorYUnits: 'pixels',
                        //         src: 'image/icon_legend03_c.png'
                        //     }))
                        // };
                    }else if((ltChcYn == 0 && instlDeYear == newYear) || featureCnt > ltChcYn){ // 점검 x , 올해설치 o
                        iconNm = 'image/icon_legend03_n.png';
                        // opt = {
                        //     image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                        //         anchor: [0.45, anchorY],
                        //         anchorXUnits: 'fraction',
                        //         anchorYUnits: 'pixels',
                        //         src: 'image/icon_legend03_n.png'
                        //     }))
                        // };
                    }else if(ltChcYn != 0 && instlDeYear == newYear){ // 점검 o , 올해설치 o
                        if(reSttSum == ltChcYn){//정상점검
                            iconNm = 'image/icon_legend03_nc.png';
                        }else{
                            iconNm = 'image/icon_legend03_nc2.png';
                        }
                        // opt = {
                        //     image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                        //         anchor: [0.45, anchorY],
                        //         anchorXUnits: 'fraction',
                        //         anchorYUnits: 'pixels',
                        //         src: 'image/icon_legend03_nc.png'
                        //     }))
                        // };
                    }
                    break;
            }
        }else if(rdGdftySe == "610"){
            switch(instlSe){
                // case "00002": //벽면형
                //     if((ltChcYn == 0 && instlDeYear != newYear) || featureCnt > ltChcYn){ // 점검 x , 올해설치 x
                //         opt = {
                //             image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                //                 anchor: [0.45, 35],
                //                 anchorXUnits: 'fraction',
                //                 anchorYUnits: 'pixels',
                //                 src: 'image/icon_w_legend02.png'
                //             }))
                //         };
                //     }else if(ltChcYn != 0 && instlDeYear != newYear){ // 점검 o , 올해설치 x
                //         opt = {
                //             image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                //                 anchor: [0.45, 35],
                //                 anchorXUnits: 'fraction',
                //                 anchorYUnits: 'pixels',
                //                 src: 'image/icon_cw_legend02.png'
                //             }))
                //         };
                //     }else if((ltChcYn == 0 && instlDeYear == newYear) || featureCnt > ltChcYn){ // 점검 x , 올해설치 o
                //         opt = {
                //             image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                //                 anchor: [0.45, anchorY],
                //                 anchorXUnits: 'fraction',
                //                 anchorYUnits: 'pixels',
                //                 src: 'image/icon_nw_legend02.png'
                //             }))
                //         };
                //     }else if(ltChcYn != 0 && instlDeYear == newYear){ // 점검 o , 올해설치 o
                //         opt = {
                //             image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                //                 anchor: [0.45, anchorY],
                //                 anchorXUnits: 'fraction',
                //                 anchorYUnits: 'pixels',
                //                 src: 'image/icon_ncw_legend02.png'
                //             }))
                //         };
                //     }
                //     break;
                default: //벽면형 아님
                    if((ltChcYn == 0 && instlDeYear != newYear) || featureCnt > ltChcYn){ // 점검 x , 올해설치 x
                        iconNm = 'image/icon_legend02.png';
                        anchorY = 35;
                        // opt = {
                        //     image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                        //         anchor: [0.45, 35],
                        //         anchorXUnits: 'fraction',
                        //         anchorYUnits: 'pixels',
                        //         src: 'image/icon_legend02.png'
                        //     }))
                        // };
                    }else if(ltChcYn != 0 && instlDeYear != newYear){ // 점검 o , 올해설치 x
                        if(reSttSum == ltChcYn){//정상점검
                            iconNm = 'image/icon_legend02_c.png';
                        }else{
                            iconNm = 'image/icon_legend02_c2.png';
                        }
                        anchorY = 35;
                        // opt = {
                        //     image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                        //         anchor: [0.45, 35],
                        //         anchorXUnits: 'fraction',
                        //         anchorYUnits: 'pixels',
                        //         src: 'image/icon_legend02_c.png'
                        //     }))
                        // };
                    }else if((ltChcYn == 0 && instlDeYear == newYear) || featureCnt > ltChcYn){ // 점검 x , 올해설치 o
                        iconNm = 'image/icon_legend02_n.png';
                        // opt = {
                        //     image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                        //         anchor: [0.45, anchorY],
                        //         anchorXUnits: 'fraction',
                        //         anchorYUnits: 'pixels',
                        //         src: 'image/icon_legend02_n.png'
                        //     }))
                        // };
                    }else if(ltChcYn != 0 && instlDeYear == newYear){ // 점검 o , 올해설치 o
                        if(reSttSum == ltChcYn){//정상점검
                            iconNm = 'image/icon_legend02_nc.png';
                        }else{
                            iconNm = 'image/icon_legend02_nc2.png';
                        }
                        // opt = {
                        //     image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                        //         anchor: [0.45, anchorY],
                        //         anchorXUnits: 'fraction',
                        //         anchorYUnits: 'pixels',
                        //         src: 'image/icon_legend02_nc.png'
                        //     }))
                        // };
                    }
                    break;
            }
        }else if(rdGdftySe == "999"){
            iconNm = 'image/icon_mixPos.png';
            anchorY = 35;
            // opt = {
            //     image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            //         anchor: [0.45, 40],
            //         anchorXUnits: 'fraction',
            //         anchorYUnits: 'pixels',
            //         src: 'image/icon_w_legend03.png'
            //     }))
            // };
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

            return new ol.style.Style(opt);
            
        }

        opt = {
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                anchor: [0.45, anchorY],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: iconNm
            }))
        };
        
        // if(localStorage['engineUse'] == 'Y'){
        //     if( styleOptions.label._text)
        //         opt.text = createTextStyle(styleOptions);
        // }else{
            if(feature.get("LABEL"))
                opt.text = createTextStyle_new(feature.get("LABEL"));
            
        // }
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

    var ltChcYn = feature.get('LT_CHC_YN');

    if(ltChcYn != null){
        opt = {
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                anchor: [0.45, 35],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: 'img/check_spot.png'
            }))
        };
    }

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
        //올해정상점검건수
        var reSttSum = feature.get('RE_STT_SUM');
        //작년정상점검건수
        var reSttSumOld = feature.get('RE_STT_SUM_OLD');
        //점검여부
        var ltChcYn = feature.get('LT_CHC_YN');
        //작년점검여부
        var ltChcYnOld = feature.get('LT_CHC_YN_OLD');
        
        //작년 점검여부 표시 + 올해 점검 포함
        // if(localStorage["researchCheckGbn"] != null && localStorage["researchCheckGbn"] == "true"){
        //     ltChcYn == 0 ? ltChcYn = ltChcYnOld : ltChcYn = ltChcYn;
        //     reSttSum == 0 ? reSttSum = reSttSumOld : reSttSum = reSttSum;
        // }
        
        //설치일자
        var instlDe = feature.get('INSTL_DE');
        var instlDeYear = instlDe.substr(0,4);
        var newYear = util.getToday().substr(0,4);    
        
        var anchorY = 44; // 아이콘 위치
        var iconNm = 'image/icon_legend04.png'; // 아이콘 명칭
        var opt;

        if(instlDeYear != newYear){//올해설치 X
            anchorY = 35;
            if(ltChcYn != 0){ //점검 O
                if(reSttSum == ltChcYn){ // 정상점검
                    iconNm = 'image/icon_legend04_c.png';
                }else{
                    iconNm = 'image/icon_legend04_c2.png';
                }
                // opt= {
                //     image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                //        anchor: [0.45, 35],
                //        anchorXUnits: 'fraction',
                //        anchorYUnits: 'pixels',
                //        src: 'image/icon_legend04_c.png'
                //    }))
                // };
            }
            // else{ // 점검 X
            //     opt= {
            //         image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            //            anchor: [0.45, 35],
            //            anchorXUnits: 'fraction',
            //            anchorYUnits: 'pixels',
            //            src: 'image/icon_legend04.png'
            //        }))
            //    };
            // }
            
        }else{ // 올해설치 O
            if(ltChcYn != 0){ //점검 O
                if(reSttSum == ltChcYn){ // 정상점검
                    iconNm = 'image/icon_legend04_nc.png';
                }else{
                    iconNm = 'image/icon_legend04_nc2.png';
                }
            //     opt= {
            //         image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            //            anchor: [0.45, anchorY],
            //            anchorXUnits: 'fraction',
            //            anchorYUnits: 'pixels',
            //            src: 'image/icon_legend04_nc.png'
            //        }))
            //    };
            }else{ // 점검 X
                iconNm = 'image/icon_legend04_n.png';
            //     opt= {
            //         image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            //            anchor: [0.45, anchorY],
            //            anchorXUnits: 'fraction',
            //            anchorYUnits: 'pixels',
            //            src: 'image/icon_legend04_n.png'
            //        }))
            //    };
            }

        }

        opt= {
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
               anchor: [0.45, anchorY],
               anchorXUnits: 'fraction',
               anchorYUnits: 'pixels',
               src: iconNm
           }))
        };
        
        // if( styleOptions.label._text)
        //     opt.text = createTextStyle(styleOptions);
    
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
    var oddOffsetY = 0;
    var eveOffsetY = 0;
    
    //왼쪽이 홀수
    if(startX - endX > 0){
        oddOffsetY = 10;
        eveOffsetY = -10;
    }else{
        oddOffsetY = -10;
        eveOffsetY = 10;
    }


    var oddText = "{0}{1}".format(feature.get("ODD_BSI_MN") , feature.get("ODD_BSI_SL") == "0"?"":"-"+feature.get("ODD_BSI_SL"));
    var opt1 = {
        
        stroke: new ol.style.Stroke({
            color: 'black',
            width: 2
          }),
        text: new ol.style.Text({
            textAlign: "center",
            textBaseline: "middle",
            // font: font,
            text: oddText,
            fill: new ol.style.Fill({color: "red"}),
            // stroke: new ol.style.Stroke({color: outlineColor, width: outlineWidth}),
            offsetX: offsetX,
            offsetY: oddOffsetY,
            placement: "line",
            // maxAngle: maxAngle,
            // overflow: overflow,
            // rotation: rotation
            scale : 1.3
            })
    };
    var eveText = "{0}{1}".format(feature.get("EVE_BSI_MN") , feature.get("EVE_BSI_SL") == "0"?"":"-"+feature.get("EVE_BSI_SL"));
    var opt2 = {
        
        stroke: new ol.style.Stroke({
            color: 'black',
            width: 2
          }),
        text: new ol.style.Text({
            textAlign: "center",
            textBaseline: "middle",
            // font: font,
            text: eveText,
            fill: new ol.style.Fill({color: "blue"}),
            // stroke: new ol.style.Stroke({color: outlineColor, width: outlineWidth}),
            offsetX: offsetX,
            offsetY: eveOffsetY,
            placement: "line",
            // maxAngle: maxAngle,
            // overflow: overflow,
            // rotation: rotation
            scale : 1.3
            })
    };
    
    var dx = endX - startX;
    var dy = endY - startY;
    var rotation = Math.atan2(dy, dx);

    var opt3 = {
            geometry: new ol.geom.Point([endX,endY]),
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            //    anchor: [0.45, 35],
            //    anchorXUnits: 'fraction',
            //    anchorYUnits: 'pixels',
               src: 'image/blocksLine.png',
            rotateWithView: true,
            rotation: -rotation
           }))
    }

    var style1 = new ol.style.Style(opt1);
    var style2 = new ol.style.Style(opt2);
    var style3 = new ol.style.Style(opt3);

    // opt.text = createTextStyle(styleOptions);
    return [style1,style2,style3];
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

//포인트
var pointStyle = function(styleOptions,feature){
    var opt = {
        image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({
                color: 'rgba(255, 0, 0 , 0.1)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(255, 0, 0)',
                width: 1
            })
        })
    };
    return new ol.style.Style(opt);
}

//폴리곤
var polygonStyle = function(styleOptions,feature){
    var opt = {
        stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 255)',
            width: 1
            }),
        fill: new ol.style.Fill({
            color: 'rgba(1, 0, 255 , 0.1)'
            })
    };
    return new ol.style.Style(opt);
}

//라인
var lineStyle = function(styleOptions,feature){
    var opt = {
            // fill: new ol.style.Fill({
            //     color: 'green'
            // }),
            stroke: new ol.style.Stroke({
                color: 'black',
                width: 3
            })
    };
    return new ol.style.Style(opt);
}
