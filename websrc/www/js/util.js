String.prototype.format = function() {
  var str = this;
  for (var i = 0; i < arguments.length; i++) {
    var reg = new RegExp("\\{" + i + "\\}", "gm");
    str = str.replace(reg, arguments[i]);
  }
  return str;
}

var app;
var util = {
    //ajax call
    getAJAX: function (context, url) {
        var def = $.Deferred();
        $.ajax({
            type: "get",
            url: url,
            dataType: "json",
            timeout: 100000,
            data: {},
            success: function (results) {
                def.resolve(context, results);
            },
            complete: function (results) { },
            error: function (xhr, status, error) {
                def.reject(context, xhr, error);
                return false;
            }
        });

        return def.promise();
    },
    /** @return jQuery deferred promise object */
    postAJAX: function (context, params, direct) {
        var def = $.Deferred();
        if (app != undefined && app.info)   //시군구 코드 필수 추가
            params = $.extend({}, { mode: app.mode, brokerMode: 1, sigCd: app.info.sigCd }, params);
        else
            params = $.extend({}, { mode: '00', brokerMode: 1 }, params);

        SmartKaisPlugins.callServiceBroker(
            params,
            // success
            function (results) {
                def.resolve(context, results.resultCode, results.resultData);
            },
            // error
            function (errorResults) {
                util.dismissProgress();
                util.toast("서비스 요청 에러, 다시 시도해 주세요");
                console.dir(errorResults);
                def.reject(context, errorResults.resultCode, errorResults.resultData);
            },
            direct
        );

        return def.promise();
    },
    //Element 검증
    isEmpty: function (element) {
        return (element === "" ||
            element === 0 ||
            element === "0" ||
            element === null ||
            element === "NULL" ||
            element === undefined ||
            element === "undefined" ||
            element === false ||
            element === '[]' ||
            $.isEmptyObject(element) === true) ? true : false;
    },
    //뒤로가기
    goBack: function () {
        util.dismissProgress();

        if ($( "[data-role='panel']" ).hasClass("ui-panel-open")) {
            $( "[data-role='panel']" ).panel("close");
            return;
        }

        if ($( "body>.ui-popup-container").hasClass("ui-popup-active")) {
            $(".popup-wrap").popup("close");
            return;
        }

        var activePage = $.mobile.activePage.attr('id');
        if ('#' + activePage == pages.workpage.div) {
            if (confirm('현장조사 Smart KAIS를 종료하시겠습니까?') == true)
                util.appExit();
            return;
        }
        else if (app.historyStack.length == 1) {
            app.historyStack.pop();
            util.slide_page('right', pages.workpage);
        }
        else {
            app.historyStack.pop();
            navigator.app.backHistory();
            util.doSlide("right");
        }
    },
    clearHistory: function () {
        var spliceIndex = 0;
        for (var index in $.mobile.navigate.history.stack) {
            if (pages.workpage === $.mobile.navigate.history.stack[index]['url']) {
                spliceIndex = index + 1;
            }
        }
        if (spliceIndex < $.mobile.navigate.history.stack.length) {
            $.mobile.navigate.history.stack.splice(spliceIndex, $.mobile.navigate.history.stack.length - spliceIndex);
        }
    },
    //native transition
    doSlide: function (direction) {
        if (direction === undefined)
            direction = "left";
        var options = {
            "direction": direction,
            //"slowdownfactor"   :    5, // overlap views (higher number is more) or no overlap (1). -1 doesn't slide at all. Default 4
            //"slidePixels"      :   20, // optional, works nice with slowdownfactor -1 to create a 'material design'-like effect. Default not set so it slides the entire page.
            "duration": 500, // in milliseconds (ms), default 400
            "slowdownfactor": 4, // overlap views (higher number is more) or no overlap (1), default 3
        };
        window.plugins.nativepagetransitions.slide(
            options,
            function (msg) { console.log("success: " + msg) }, // called when the animation has finished
            function (msg) { console.log("error: " + msg) } // called in case you pass in weird values
        );
    },
    //native transition
    slide_page: function (direction, href, param) {

        //page url + #page selector
        var link = href.link() + href.div;
        app.historyStack.push(link);

        app.context = param;
        var pageParam = {
            transition: "slide",
            reverse: direction === 'left' ? false : true,
            changeHash: true,
            reloadPage: false
        };
        ( param && param.reloadPage ) ? pageParam.reloadPage = param.reloadPage : "";
        $.mobile.pageContainer.pagecontainer("change", link, pageParam);

        return;
    },
    //메뉴 생성
    createNavPanel: function (navid, contents) {
        function generateNavNode(contents) {
            var nav = "<ul>";
            $.each(contents, function (index, content) {
                var data = {
                    fastclick: "true",
                    href: "#",
                    onclick: "",
                    iconsrc: "",
                    label: "",
                    child: ""
                };

                for (key in content) {
                    data[key] = content[key];
                }

                var li = "<li><a " + (data.fastclick == true ? "data-fastClick='YES' " : "") + (data.href != "" ? ("href='" + data.href + "' ") : "") + (data.onclick != "" ? ("onclick='" + data.onclick + "' ") : "") + ">";

                if (data.iconsrc != "") {
                    li += "<span class='ico'><img src='" + data.iconsrc + "' alt='' /></span>";
                }
                li += data.label + "</a>";

                if (data.child != "")
                    li += generateNavNode(data.child);
                li += "</li>";
                nav += li;

            });
            nav += "</ul>";
            return nav;
        }
        var navelem = document.getElementById(navid);
        navelem.innerHTML = generateNavNode(contents);
    },
    gotoTask: function (tasktype) {
        var url = pages.map;
        var param = {
            categoryid: tasktype,
            sig_cd: app.info.sigCd
        };
        var activePage = $.mobile.activePage.attr('id');

        switch (tasktype) {
            case "home":
                app.historyStack = [];
                url = pages.workpage.link();
                document.location.href = url + '?sso=' + JSON.stringify(sso);
                param = "";
                return;
            case "buildsign":
            case "roadsign":
            case "areasign":
            case "basenumsign":
            case "mapservice":
                app.historyStack = [];
                url = pages.map;
                param.type = "map";
                break;
            case "mapservice2":
                app.historyStack = [];
                url = pages.map;
                param.type = "map2";
                break;
            case "minwon":
                url = pages.minwonListPage;
                break;
            case "address":
                if (activePage == 'bbs_page')
                    return;
                app.historyStack = [];
                url = pages.addressview;
                param = "";
                break;
            case "memolist":
                url = pages.memolistpage;
                param = "refresh";
                break;
            case "helpdesk":
                util.showHelpDeskPanel('#helpdeskmenu');
                return;
            case "appmenu":
                util.showMenuPanel('#mainMenu');
                return;
            case "download":
                SmartKaisPlugins.dn('http://api.juso.go.kr/gis/dnSmartKaisApp.jsp', function (msg) {
                    alert(msg.message);
                });
                return;
            case "camera":

                SmartKaisPlugins.camera(function (result) {
                    ;
                });
                return;
            case "debug":
                return;
        }
        util.slide_page('left', url, param);
        //옆메뉴에있는 지도 바로가기 클릭시 지도 초기화 시켜주는 부분 추가
        if(url.div == "#mapview_page"  /*링크주소가 지도이고*/
                          && initial ){  /*이미 지도가 초기화 되어있고*/

            $("[data-role=panel]").panel("close");
            var context = app.context;

            if (util.isEmpty(context)){
                map.updateSize();
                return;
            }

            var pos = ol.proj.fromLonLat([localStorage["loc.X"], localStorage["loc.Y"]], baseProjection);

            mapInit("map", pos).then(function() {
                if (context.type == "map") {
                    map.removeLayer(layers.buld);
                    map.removeLayer(layers.entrc);
                    map.addLayer(layers.rdpq);
                    map.addLayer(layers.bsis);
                    map.addLayer(layers.area);
                } else {
                    map.removeLayer(layers.rdpq);
                    map.removeLayer(layers.bsis);
                    map.removeLayer(layers.area);
                    map.addLayer(layers.buld);
                    map.addLayer(layers.entrc);
                }
            });
            app.context = {};
        }

    },
    takePictureFromCamera: function (returnFn) {
        SmartKaisPlugins.camera(function (result) {
            returnFn(result);
        });
    },
    takePictureFromAlbum: function (returnFn) {
        function readImage(url) {
            var deferred = $.Deferred();

            function toDataUrl(url, callback) {
                var xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = function () {
                    var reader = new FileReader();
                    reader.onloadend = function () {
                        callback(reader.result);
                    }
                    reader.readAsDataURL(xhr.response);
                };
                xhr.open('GET', url);
                xhr.send();
            }
            toDataUrl(url, function (base64img) {

                base64img = base64img.substring(base64img.indexOf('base64,') + 'base64,'.length);
                deferred.resolve(base64img);
            });
            return deferred.promise();
        }


        plugins.imagePicker.getPictures(function (results) {
            if (results.length > 0) {
                readImage(results[0]).done(function (base64) {
                    returnFn({ src: base64, metadata: '' });
                });
            }
            else {
                returnFn('');
            }
        },
            function (fails) {
                console.log('Error: ' + fails);
            }, {
                maxImages: 1,
                quality: 50,
                width: 1024,
                height: 768

            });
    },
    getCameraPicture: function (fnResult) {

        var selectCallback = function (index) {

            var Camera = navigator.camera;
            var cameraOption = {
                quality: 50,
                targetWidth: 1024,
                targetHeight: 768,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                encodingType: Camera.EncodingType.JPEG,
                mediaType: Camera.MediaType.PICTURE,
                correctOrientation: true,
                saveToPhotoAlbum: false
            };

            var functor = function (param) { };
            if (index == 0) {
                return;
            }
            else if (index == 2) {
                cameraOption.sourceType = Camera.PictureSourceType.CAMERA;
                functor = util.takePictureFromCamera;
            }
            else if (index == 1) {
                cameraOption.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
                functor = util.takePictureFromAlbum;
            }
            functor(fnResult);
            /*
                        navigator.camera.getPicture(function(imgData) {
                            fnResult(imgData);
                        }, function(errorData){}, cameraOption);
                        */

        };
        navigator.notification.confirm('사진을 가져올 방법을 선택하십시오 ', selectCallback, "사진 추가", "포토 앨범,카메라");
    },
    addPictureFromCamera: function (selector) {
        util.getCameraPicture(function (imgData) {
            var datetime = util.isEmpty(imgData.metadata.datetime) ? util.getToday(true) : imgData.metadata.datetime;
            datetime = datetime.replace(/:/g, '');
            datetime = datetime.replace(/ /g, '_');

            var obj = "<li  data-id='-1000' data-name='' style='position:relative;' data-type='jpeg' data-time='" + datetime + "'>" +
                " <div class='float-camera' " +
                "style='background-color:rgba(61,65,144,0.8);position:absolute;top:20px;'   >" +
                "<i class='fa fa-trash fa-inverse '></i>" +
                "</div>" +
                "<img style='height: 220px; width: 100%; object-fit: contain' src='data:image/jpeg;base64,"
                + imgData.src + "'/></li>";

            var slider = $(selector).data('flexslider');

            if ($(selector + ' ul>li:eq(0)').data('id') == -1) {
                slider.removeSlide(0);
            }
            slider.addSlide(obj);
            slider.flexAnimate(slider.count - 1); // go back to the first slide
        });
    },
    toast: function (msg) {
//        toastr.remove();
        toastr.options.positionClass = 'toast-bottom-center';
        toastr.options.timeOut = 1500;
        toastr.info(msg);
    },
    showProgress: function () {
        SmartKaisPlugins.showProgress("", function (jsondata) { });
    },
    dismissProgress: function () {
        SmartKaisPlugins.dismissProgress();
    },
    getToday: function (withHMS) {
        var date = new Date();

        var year = date.getFullYear();
        var month = date.getMonth() + 1; // 0부터 시작하므로 1더함 더함
        var day = date.getDate();

        if (("" + month).length == 1) { month = "0" + month; }
        if (("" + day).length == 1) { day = "0" + day; }

        var result = ("" + year + month + day);
        if (withHMS === true) {
            var hour = date.getHours();
            var min = date.getMinutes();
            var sec = date.getSeconds();

            if (("" + hour).length == 1) { hour = "0" + hour; }
            if (("" + min).length == 1) { min = "0" + min; }
            if (("" + sec).length == 1) { sec = "0" + sec; }

            result += '_' + hour + min + sec;
        }

        return result;
    },
    registLimitText: function (selector, limit) {
        var elem = $(selector);
        elem.bind('keyup keydown', function () {
            var text = elem.val();
            if (text.length > limit + 1) {
                elem.val(text.substr(0, limit));
                util.toast('최대입력 ' + limit + '글자를 넘을 수 없습니다');
                return false;
            }
        });
    },
    getUserInfo: function (successFn) {
        SmartKaisPlugins.getSSOInfo(successFn);
    },
//    getParameter: function (name) {
//        var url = decodeURI(location.href);
//        var paramArr = (url.substring(url.indexOf("?")+1,url.length)).split("&");
//
//        for(var i = 0 ; i < paramArr.length ; i++){
//            var temp = paramArr[i].split("=");
//
//            if(temp[0].toUpperCase() == param.toUpperCase()){
//                requestParam = paramArr[i].split("=")[1];
//                break;
//            }
//        }
//    },
    on: function (triggerName, triggerFunc) {
        SmartKaisPlugins.on(triggerName, triggerFunc);
    },
    off: function (triggerName, triggerFunc) {
        SmartKaisPlugins.off(triggerName, triggerFunc);
    },
    pushCount: function (type, val) {
        if(type)
            (val > 0) ? $(".pushCnt." + type).text(val) : $(".pushCnt." + type).text("");
    },
    //app종료
    appExit: function () {
        navigator.app != undefined ? navigator.app.exitApp() : location.href = "exit://";
    }
};

//using map
function NoClickDelay(el) {
    this.element = typeof el == 'object' ? el : document.getElementById(el);

    if (this.element.getAttribute("data-fastClick") == "YES") {
        return;
    }

    if (window.Touch) {
        this.element.addEventListener('touchstart', this, false);
        this.element.setAttribute("data-fastClick", "YES");
    }
}

NoClickDelay.prototype = {
    handleEvent: function (e) {
        switch (e.type) {
            case 'touchstart':
                this.onTouchStart(e);
                break;
            case 'touchmove':
                this.onTouchMove(e);
                break;
            case 'touchend':
                this.onTouchEnd(e);
                break;
        }
    },
    onTouchStart: function (e) {
        e.preventDefault();
        this.moved = false;
        this.x = e.targetTouches[0].clientX;
        this.y = e.targetTouches[0].clientY;

        this.theTarget = document.elementFromPoint(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
        // if(this.theTarget.nodeType == 3) this.theTarget = this.theTarget.parentNode;
        if (this.theTarget.getAttribute("data-fastClick") != "YES") this.theTarget = this.theTarget.parentNode; //대상이 이벤트를 방생한게 아니라면 부모노드 검색
        //if(this.theTarget.getAttribute("data-fastClick") != "YES") this.theTarget = e.currentTarget; //부모노드도 대상이 아닐경우 대상선택

        //this.theTarget = e.currentTarget;


        this.theTarget.className += ' pressed';

        this.element.addEventListener('touchmove', this, false);
        this.element.addEventListener('touchend', this, false);
    },
    onTouchMove: function (e) {
        var x = e.targetTouches[0].clientX;
        var y = e.targetTouches[0].clientY;

        if (Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2)) > 50 || y < 10) {
            this.moved = true;
            this.theTarget.className = this.theTarget.className.replace(/ ?pressed/gi, '');
            //this.theTarget.className = this.theTarget.className.replace(/ ?active/gi, '');
        } else {
            if (this.moved == true) {
                this.moved = false;
                this.theTarget.className += ' pressed';
            }
        }
    },
    onTouchEnd: function (e) {
        this.element.removeEventListener('touchmove', this, false);
        this.element.removeEventListener('touchend', this, false);
        if (!this.moved && this.theTarget) {
            this.theTarget.className = this.theTarget.className.replace(/ ?pressed/gi, '');
            //this.theTarget.className += ' active';
            var theEvent = document.createEvent('MouseEvents');
            theEvent.initEvent('click', true, true);
            this.theTarget.dispatchEvent(theEvent);
        }
        this.theTarget = undefined;
    }
};
