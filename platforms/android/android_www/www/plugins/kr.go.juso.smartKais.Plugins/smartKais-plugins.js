cordova.define("kr.go.juso.smartKais.plugins", function (require, exports, module) {
    var exec = require('cordova/exec');
    var SmartKaisPlugins = function () {
        this.type = "unknown";
        this.triggerHandler = {
            "notification": []
        };
        exec(
            fireTrigger,
            function (json) { },
            'SmartKaisPlugins',
            'initTrigger',
            []
        );
        function fireTrigger(json) {
            var event = json.eventName;
            console.log(me.triggerHandler);
            for (var i = 0; i < me.triggerHandler[event].length; i++) {
                var func = me.triggerHandler[event][i];
                if (typeof func === 'function') {
                    func(json.args);
                }
            }
        }
    };

    SmartKaisPlugins.prototype.showProgress = function (keys, successCallback) {
        if (keys == null)
            keys = {};

        return exec(
            successCallback,    						//Success callback from the plugin
            function (e) { alert(e); },     				//Error callback from the plugin
            'SmartKaisPlugins',  						//Tell PhoneGap to run "EgovInterfacePlugin" Plugin
            'showProgress',              					//Tell plugin, which action we want to perform
            [keys]);        							//Passing list of args to the plugin
    };

    SmartKaisPlugins.prototype.dismissProgress = function () {
        return exec(
            function (jsondata) { },    						//Success callback from the plugin
            function (e) { alert(e); },     				//Error callback from the plugin
            'SmartKaisPlugins',  						//Tell PhoneGap to run "EgovInterfacePlugin" Plugin
            'dismissProgress',              					//Tell plugin, which action we want to perform
            [{}]);        							//Passing list of args to the plugin
    };

    SmartKaisPlugins.prototype.testCallback = function () {
        return exec(
            function (jsondata) { alert(jsondata); },    						//Success callback from the plugin
            function (e) { alert(e); },     				//Error callback from the plugin
            'SmartKaisPlugins',  						//Tell PhoneGap to run "EgovInterfacePlugin" Plugin
            'testCallback',              					//Tell plugin, which action we want to perform
            ['aaa', 'bbbb', 'ccc']);        							//Passing list of args to the plugin
    };

    SmartKaisPlugins.prototype.callServiceBroker = function (data, successFn, errorFn, direct) {
        var param = $.extend({}, { scode: 'MF_MOI_SMART_KAIS', timeout: 30000 }, data);

        var svcNm = data.svcNm;
        var mode = data.mode;
        var reqParam;

        if (direct) {
            reqParam = data;
        } else {
            delete data.svcNm;
            delete data.mode;
            reqParam = {
                svcNm: svcNm,
                mode: mode,
                req: JSON.stringify(data)
            };
        }

        if (data.brokerMode == 0) { //MODE.DEBUG) {
            $.ajax({
                type: "POST",
                url: "http://api.juso.go.kr/gis/proxyGeo4mkais.jsp?",
                dataType: "json",
                data: reqParam
            })
            .done(successFn)
            .fail(errorFn);
        } else {
            return exec(
                successFn,
                errorFn,
                'SmartKaisPlugins',
                'callServiceBroker',
                [param, $.param(reqParam).replace(/\+/gi, '%20')]
            );
        }
    };

    SmartKaisPlugins.prototype.getSSOInfo = function (successFn) {
        var attrs = {};

        return exec(
            successFn,
            function (errors) {
            },
            'SmartKaisPlugins',
            'getSSOinfo',
            []
        );
    }

    SmartKaisPlugins.prototype.callAttachViewer = function (filename, param, successFn, errorFn) {
        if (param.noticeMgtSn == null || param.noticeMgtSn == undefined || param.fileMgtSn == null || param.fileMgtSn == undefined) {
            errorFn("올바른 첨부파일 데이터가 아닙니다");
            return;
        }

        var data = {
            svcNm: 'dnfile',
            req: JSON.stringify(param)
        };
        return exec(
            successFn,
            errorFn,
            'SmartKaisPlugins',
            'callAttachViewer',
            [filename, $.param(data)]
        );
    };

    SmartKaisPlugins.prototype.alertList = function (successFn, errorFn) {
        return exec(
            successFn,
            errorFn,
            'SmartKaisPlugins',
            'alertList',
            ['Photo Library', 'Camera']
        );
    };

    SmartKaisPlugins.prototype.initTrigger = function (trigger, triggerFn) {
        var successFn = function (json) {
            alert('trigger' + json);

        }
        return exec(
            successFn,
            function (json) { },
            'SmartKaisPlugins',
            'initTrigger',
            [trigger]
        );
    };

    SmartKaisPlugins.prototype.on = function (triggerName, triggerFunc) {
        if (this.triggerHandler.hasOwnProperty(triggerName)) {
            this.triggerHandler[triggerName].push(triggerFunc);
        }
    };

    SmartKaisPlugins.prototype.off = function (triggerName, triggerFunc) {
        if (this.triggerHandler.hasOwnProperty(triggerName)) {
            var handleIndex = this.triggerHandler[triggerName].indexOf(triggerFunc);
            if (handleIndex >= 0) {
                this.triggerHandler[triggerName].splice(handleIndex, 1);
            }
        }
    };

    SmartKaisPlugins.prototype.camera = function (successFn, errorFn) {
        return exec(
            successFn,
            errorFn,
            'SmartKaisPlugins',
            'camera',
            []
        );
    };


    SmartKaisPlugins.prototype.dn = function (url, successFn) {
        return exec(
            successFn,
            function (errors) {
            },
            'SmartKaisPlugins',
            'dn',
            [url]
        );
    }

    var me = new SmartKaisPlugins();

    module.exports = me;
});
