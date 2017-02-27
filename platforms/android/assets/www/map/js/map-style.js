var defaultStyleOptions = {
    label: {
        textOffsetX: 0,
        textOffsetY: 0
    },
    radius: 5
};

var LAST_CHECK_STATUS = { NORMAL: "01", DAMAGE: "02", LOSS: "03",
  getStatusNameWithCode: function(code) {
    switch(code) {
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

var DATA_TYPE = { BULD: "01", RDPQ: "02", AREA: "03", BSIS: "04",
  getStatusNameWithCode: function(code) {
    switch(code) {
      case "01":
        return DATA_TYPE.BULD;
      case "02":
        return DATA_TYPE.RDPQ;
      case "03":
        return DATA_TYPE.AREA;
      case "04":
        return DATA_TYPE.BSIS;
      default:
        return;
    }
  }
};

var createTextStyle = function(styleOptions) {
  return new ol.style.Text({
    text: styleOptions.label,
    textAlign: 'center',
    fill: new ol.style.Fill({ color: 'white' }),
    stroke: new ol.style.Stroke({ color: 'black' }),
    offsetX: styleOptions.textOffsetX,
    offsetY: styleOptions.textOffsetY
  });
};

var getStyleLabel = function(feature, labelOptions) {
  var arr = [];
  labelOptions.data.forEach(function(obj, index) {
    arr[index] = feature.get(obj);
  });
  return eval("labelOptions.format.format('" + arr.join("','") + "')");
};


var styleCache = {};
var defaultStyle = function(feature, resolution, options) {
  var features, size, style;
  var styleOptions = $.extend(true, {}, defaultStyleOptions, options.style);

  if(options.cluster) {
    features = feature.get("features");
  } else {
    features = [ feature ];
  }
  size = features.length;

//  중복 데이터 중 상태가 가장 안좋은 스타일로 지정
//  features.forEach(function(f, index) {
//    var name = DATA_TYPE.getStatusNameWithCode(f.get(lastCheckStatus));
//    if(maxStatus < name)
//      maxStatus = name;
//  });

  if(size == 1) {
  } else {
      style = styleCache;
  }
  styleOptions.label = size.toString();

  switch(options.dataType) {
    case DATA_TYPE.BULD:
        style = buildStyle(styleOptions);
        break;
    case DATA_TYPE.RDPQ:
        style = roadStyle(styleOptions);
        break;
    case DATA_TYPE.AREA:
        style = areaStyle(styleOptions);
        break;
    case DATA_TYPE.BSIS:
        style = bsisStyle(styleOptions);
        break;
    default:
      style = etcStatusStyle(styleOptions);
  }
  return style;
};

// 건물번호판 스타일
var buildStyle = function(styleOptions) {
	return new ol.style.Style({
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
	});
};

// 도로명판 스타일
var roadStyle = function(styleOptions) {
	return new ol.style.Style({
		image: new ol.style.Circle({
			radius: styleOptions.radius,
	        fill: new ol.style.Fill({
	            color: 'blue'
	        }),
	        stroke: new ol.style.Stroke({
	            color: 'white',
	            width: 1
	        })
		}),
		text: createTextStyle(styleOptions)
	});
};

// 지역안내판 스타일
var areaStyle = function(styleOptions) {
	return new ol.style.Style({
		image: new ol.style.Circle({
			radius: styleOptions.radius,
	        fill: new ol.style.Fill({
	            color: 'green'
	        }),
	        stroke: new ol.style.Stroke({
	            color: 'white',
	            width: 1
	        })
		}),
		text: createTextStyle(styleOptions)
	});
};

// 기초번호판 스타일
var bsisStyle = function(styleOptions) {
	return new ol.style.Style({
		image: new ol.style.Circle({
			radius: styleOptions.radius,
	        fill: new ol.style.Fill({
	            color: 'skyblue'
	        }),
	        stroke: new ol.style.Stroke({
	            color: 'white',
	            width: 1
	        })
		}),
		text: createTextStyle(styleOptions)
	});
};

// 시설물 상태(정상)
var normalStatusStyle = function(styleOptions) {
	return new ol.style.Style({
	    image: new ol.style.Circle({
	        radius: styleOptions.radius,
	        fill: new ol.style.Fill({
	            color: 'rgba(0,0,255,0.3)'
	    }),
	    stroke: new ol.style.Stroke({
	        color: 'rgba(0,0,255,0.8)',
	            width: 1
	        })
	    }),
	    text: createTextStyle(styleOptions)
	});
};
// 시설물 상태(훼손)
var damageStatusStyle = function(styleOptions) {
	return new ol.style.Style({
	    image: new ol.style.Circle({
	        radius: styleOptions.radius,
	        fill: new ol.style.Fill({
	            color: 'rgba(0,255,0,0.3)'
	        }),
	        stroke: new ol.style.Stroke({
	            color: 'rgba(0,255,0,0.8)',
	            width: 1
	        })
	    }),
	    text: createTextStyle(styleOptions)
	});
};
// 시설물 상태(망실)
var lossStatusStyle = function(styleOptions) {
  return new ol.style.Style({
    image: new ol.style.Circle({
        radius: styleOptions.radius,
        fill: new ol.style.Fill({
            color: 'rgba(255,0,0,0.3)'
        }),
        stroke: new ol.style.Stroke({
            color: 'rgba(255,0,0,0.8)',
            width: 1
        })
    }),
    text: createTextStyle(styleOptions)
  });
};
// 시설물 상태 없음(기타)
var etcStatusStyle = function(styleOptions) {
  return new ol.style.Style({
    image: new ol.style.Circle({
        radius: styleOptions.radius,
        fill: new ol.style.Fill({
            color: 'rgba(100,100,100,0.3)'
        }),
        stroke: new ol.style.Stroke({
            color: 'rgba(100,100,100,0.8)',
            width: 1
        })
    }),
    text: createTextStyle(styleOptions)
  });
};
