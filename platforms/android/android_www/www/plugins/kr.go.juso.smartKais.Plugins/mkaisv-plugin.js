cordova.define("kr.go.juso.smartKais.Plugins", function(require, exports, module) {

var exec = require('cordova/exec');
function MKaisvPlugins(){
	this.type = "unknown";
	this.triggerHandler = {
	    "notification" : []
	};


    exec(
            fireTrigger,
            function(json){},
            'MKaisvPlugins',
            'initTrigger',
            []
            );

    function fireTrigger(json) {
        var event = json.eventName;
        for (var i = 0; i < this.triggerHandler[event].length;i++)
        {
            var func = this.triggerHandler[event][i];
            if (typeof func === 'function')
            {
                func.apply(undefined,json.args);
            }
        }
    }
}



MKaisvPlugins.prototype.showProgress = function(keys, successCallback) {
	if(keys == null)
		keys = {};

	return exec(
			successCallback,    						//Success callback from the plugin
			function(e){alert(e);},     				//Error callback from the plugin
			'MKaisvPlugins',  						//Tell PhoneGap to run "EgovInterfacePlugin" Plugin
			'showProgress',              					//Tell plugin, which action we want to perform
			[keys]);        							//Passing list of args to the plugin
};

MKaisvPlugins.prototype.dismissProgress = function() {


	return exec(
			function(jsondata){},    						//Success callback from the plugin
			function(e){alert(e);},     				//Error callback from the plugin
			'MKaisvPlugins',  						//Tell PhoneGap to run "EgovInterfacePlugin" Plugin
			'dismissProgress',              					//Tell plugin, which action we want to perform
			[{}]);        							//Passing list of args to the plugin
};

MKaisvPlugins.prototype.testCallback = function() {


	return exec(
			function(jsondata){alert(jsondata);},    						//Success callback from the plugin
			function(e){alert(e);},     				//Error callback from the plugin
			'MKaisvPlugins',  						//Tell PhoneGap to run "EgovInterfacePlugin" Plugin
			'testCallback',              					//Tell plugin, which action we want to perform
			['aaa','bbbb','ccc']);        							//Passing list of args to the plugin
};

MKaisvPlugins.prototype.callServiceBroker = function(data, successFn, errorFn, direct) {
    var param = $.extend({},{scode:'MF_MOI_SMART_KAIS', timeout:30000 },data );

    var svcNm = data.svcNm;

    var reqParam;

    if(direct) {
        reqParam = data;
    } else {
        delete data.svcNm;
        reqParam = {
            svcNm :svcNm,
            req : JSON.stringify(data)
        };
    }


//return errorFn('e');
    reqParam = $.extend(reqParam,{mode:"11"});

    return exec(
                successFn,
                errorFn,
                'MKaisvPlugins',
                'callServiceBroker',
                [param, $.param(reqParam)]
                );
};

MKaisvPlugins.prototype.getSSOinfo = function(successFn) {

    var attrs = {};

     return exec(
            successFn,
            function(errors){
            },
            'MKaisvPlugins',
            'getSSOinfo',
            []
            );
}

MKaisvPlugins.prototype.callAttachViewer = function(filename, param , successFn, errorFn) {
    if (param.noticeMgtSn == null || param.noticeMgtSn == undefined || param.fileMgtSn == null || param.fileMgtSn == undefined)
    {
        errorFn("올바른 첨부파일 데이터가 아닙니다");
        return;
    }

    var data = {
                    svcNm :'dnfile',
                    req : JSON.stringify(param)
                };
    return exec(
                successFn,
                errorFn,
                'MKaisvPlugins',
                'callAttachViewer',
                [filename, $.param(data)]
                );
};

MKaisvPlugins.prototype.alertList = function( successFn, errorFn) {

    return exec(
                successFn,
                errorFn,
                'MKaisvPlugins',
                'alertList',
                ['Photo Library', 'Camera']
                );
};

MKaisvPlugins.prototype.initTrigger = function( trigger, triggerFn) {

    var successFn = function (json){
        alert('trigger' + json);

    }
    return exec(
                successFn,
                function(json){},
                'MKaisvPlugins',
                'initTrigger',
                [trigger]
                );
};

MKaisvPlugins.prototype.on = function( triggerName, triggerFunc) {
    if (this.triggerHandler.hasOwnProperty(triggerName)) {
        this.triggerHandler[triggerName].push(triggerFunc);
    }
};

MKaisvPlugins.prototype.off = function( triggerName, triggerFunc) {
    if (this.triggerHandler.hasOwnProperty(triggerName)) {
        var handleIndex = this.triggerHandler[triggerName].indexOf(triggerFunc);
        if (handleIndex >= 0) {
            this.triggerHandler[triggerName].splice(handleIndex, 1);
        }
    }
};

MKaisvPlugins.prototype.camera = function(successFn,errorFn) {

    return exec(
                successFn,
                errorFn,
                'MKaisvPlugins',
                'camera',
                []
                );
};


MKaisvPlugins.prototype.dn = function( url, successFn) {

     return exec(
            successFn,
            function(errors){
            },
            'MKaisvPlugins',
            'dn',
            [url]
            );
}


var me = new MKaisvPlugins() ;

module.exports = me;
});



