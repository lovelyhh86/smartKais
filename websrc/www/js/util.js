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
        if (app != undefined && app.info){   //시군구 코드 필수 추가
            params = $.extend({}, { mode: params.mode == null? app.info.mode : params.mode, testServerNo : app.info.testServerNo, brokerMode: 1, sigCd: app.info.sigCd, guIncYn: app.info.guIncYn, workId : app.info.opeId }, params);
        }else{
            params = $.extend({}, { mode: '00', brokerMode: 1 }, params);
        }
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

        //사진확대창 닫기
        var smartphotoLength = $(".smartphoto").parents("div").length;
        var smartphotoGbn = $(".smartphoto").attr('aria-hidden');
        if(smartphotoLength > 0 && smartphotoGbn == "false"){
            $(".smartphoto").attr('aria-hidden','true');
            return;
        }
        //사진창이 열려있을때
        var photo = $("#photoDialog").css("display");
        if(photo == "block"){
            closePhotoView();
            return;
        }
            
        var detailPopClass = $("#detailView-popup").attr("class");
        //팝업창이 내려가 있을때
        if(isPopState == "off"){
            toggleDetailView();
            return;
        }else if(isPopState == "on" && detailPopClass.indexOf("ui-popup-hidden") == -1){
            closeDetailView();
            return;
        }

        //신규위치
        if($("#newPos").is(':visible')){
            cancleNewPos();
            return;
        }
        //위치이동
        if(map !=undefined){
            var layerList = map.getLayers().getArray();
            for(var layer in layerList){
                var title = layerList[layer].get('title');
                if(title == "위치이동"){
                    layerToggle(app.context);
                    return;
                }
            }
        }

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
            navigator.notification.confirm("현장조사 Smart KAIS를 종료하시겠습니까?", appExitCallback,"알림", ['확인', '취소']);
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
            reload: false
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
            sig_cd: app.info.sigCd,
            type: ''
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
                util.pushCount('minwon', 0);
                break;
            case "baseConfig":
                url = pages.baseConfigPage;
                if(app.context){
                    param.type = app.context.type;
                }
                break;
            case "address":
                if (activePage == 'bbs_page')
                    return;
                app.historyStack = [];
                url = pages.detailAddressListPage;
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
                navigator.notification.confirm("다운로드 하시겠습니까?\n다운로드 파일은\n 내 파일 -> 디바이스 저장공간 -> Download\n에서 확인하실 수 있습니다.\n",
                    function(btnIndex) {
                        if(btnIndex == 1) {
                            SmartKaisPlugins.dn('http://api.juso.go.kr/gis/dnSmartKaisApp.jsp', function (msg) {
                                navigator.notification.alert(msg.message,'','알림', '확인');
                            });
                        }
                    }, '알림(최신버전 다운로드)', ['확인', '취소']);
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

            layerToggle(context);

            // var pos = ol.proj.fromLonLat([localStorage["loc.X"], localStorage["loc.Y"]], baseProjection);

            // mapInit("map", pos).then(function() {
            //     //심플팝업 초기화
            //     $("#popup-content").empty();
            //     $("#popup").hide();

            //     if (context.type == "map") {
            //         $(".legend").toggle(true);
            //         map.removeLayer(layers.buld);
            //         map.removeLayer(layers.entrc);
            //         map.addLayer(layers.rdpq);
            //         map.addLayer(layers.bsis);
            //         map.addLayer(layers.area);
            //     } else {
            //         $(".legend").toggle(false);
            //         map.removeLayer(layers.rdpq);
            //         map.removeLayer(layers.bsis);
            //         map.removeLayer(layers.area);
            //         map.addLayer(layers.buld);
            //         // map.addLayer(layers.entrc);
            //     }
            // });
            // app.context = {};
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
    toast: function (msg, mode, timeOut) {
        
//        toastr.remove();
        toastr.options.positionClass = 'toast-bottom-center';
        if(timeOut){
            toastr.options.timeOut = timeOut;
        }else{
            toastr.options.timeOut = 1500;
        }
        
        //중복방지
        toastr.options.preventDuplicates = true;

        if(mode == "error") {
            toastr.error(msg);
        } else if(mode == "success"){
            toastr.success(msg);
        } else if(mode == "warning"){
            toastr.warning(msg);
        } else {
            toastr.info(msg);
        } 
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
    pushProc: function(data) {
        var type = data.gbn;
        var count = data.cnt;

        util.pushCount(type, count);
    },
    pushCount: function (type, val) {
        if(type)
            (val > 0) ? $(".pushCnt ." + type).text(val) : $(".pushCnt ." + type).text("");
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


function layerToggle(context){

    var pos = ol.proj.fromLonLat([localStorage["loc.X"], localStorage["loc.Y"]], baseProjection);

    mapInit("map", pos).then(function() {
        //심플팝업 초기화
        $("#popup-content").empty();
        $("#popup").hide();
        // var mapZoom = map.getView().getZoom();
        // var mapBaseConfig = JSON.parse(localStorage["mapBaseConfig"]);
        
        removeLayers();
        // map.addLayer(layers.intrvl);

        // 작년 점검여부 체크
        var researchCheckGbn = localStorage["researchCheckGbn"];
        if(researchCheckGbn == 'true'){
            $('#oResChk' ).prop('checked','checked');
        }
        
        //범례
        //18년도 점검여부
        $(".legend.oldResearchCheck").toggle(false);


        if (context.type == "map") {

            //안내시설
            $(".legend.spgf").toggle(true);
            //지점번호판
            $(".legend.spot").toggle(false);
            //건물번호판
            // $(".legend.spbd").toggle(false);
            //지점번호판 목록
            $(".selectSppnList").toggle(false);
            //안내시설목록
            $(".selectResearch").toggle(true);
            //레이어관리
            $(".layerOnOffBtn").toggle(true);
            //레이어관리2
            $(".layerOnOffBtn2").toggle(false);
            //위치이동
            $(".locManageSpgf").toggle(true);
            //상세주소
            $(".selectAdrdc").toggle(true);
            
            //지도기능버튼
            $(".ol-rotate").toggle(true);
            $(".curPosition").toggle(true);
            $(".returnZoom").toggle(true);
            $(".refreshMap").toggle(true);
            $(".measure").toggle(true);
            
            //안내시설목록(건물번호판)
            // $(".selectResearchSpbd").toggle(false);
            
            //위치이동(건물번호판)
            // $(".locManageSpbd").toggle(false);
            
            
            
            // $('.legend.oldResearchCheck').attr('style','top : 19.5em; display: block');
            
            
            // map.addLayer(layers.rdpq);
            // map.addLayer(layers.bsis);
            // map.addLayer(layers.area);
            // map.addLayer(layers.loc);
            // map.addLayer(layers.entrc);
            // map.addLayer(layers.intrvl);
            try {
                // 순서에 따라 레이어 우선순위 결정
                layerToggleController('intrvlSel');
                layerToggleController('locSel');
                layerToggleController('nmtgSel');
                //교차로
                layerToggleController('crsrdpSel');
                
            } catch (error) {
                map.addLayer(layers.loc);
                map.addLayer(layers.entrc);
                map.addLayer(layers.intrvl);
                // map.addLayer(layers.loc_pos);
                // map.addLayer(layers.entrc_pos);    
            }
            
            // map.addLayer(layers.sppn);
            

            // map.getView().setZoom(mapBaseConfig.zoom.spgf);

            // if(mapZoom <= 12){
            //     map.getView().setZoom(13);
            // }
        } else {
            $(".legend.spgf").toggle(false);
            $(".legend.spot").toggle(true);

            // $(".selectResearch").toggle(false);
            // $(".locManageSpgf").toggle(false);
            // $(".locManageSpbd").toggle(true);
            // $(".selectResearchSpbd").toggle(true);
            
            //지점번호판 목록
            $(".selectSppnList").toggle(true);
            //안내시설목록
            $(".selectResearch").toggle(false);
            //레이어관리
            $(".layerOnOffBtn").toggle(false);
            //레이어관리2
            $(".layerOnOffBtn2").toggle(true);
            //위치이동
            $(".locManageSpgf").toggle(false);
            //상세주소
            $(".selectAdrdc").toggle(false);

            $(".ol-rotate").toggle(true);
            $(".curPosition").toggle(true);
            $(".returnZoom").toggle(true);
            $(".refreshMap").toggle(true);
            $(".measure").toggle(true);

            // $('.legend.oldResearchCheck').attr('style','top : 14.5em; display: block');
            
            map.addLayer(layers.sppn);
            layerToggleController('panelGridSel');
            
            // map.addLayer(layers.riverpk);
            // map.addLayer(layers.eqout);
            // map.addLayer(layers.taxist);
            
        }

        setMapResolotion();
    });
}

function removeLayers(type){
    // if(type == "intrvl"){
        // map.removeLayer(layers.intrvl);
    // }else{
        clearSource('현위치');
        clearSource('위치이동');
        map.removeLayer(layers.move);
        map.removeLayer(layers.buld);
        map.removeLayer(layers.entrc);
        // map.removeLayer(layers.entrc_pos);
        // map.removeLayer(layers.loc_pos);
        map.removeLayer(layers.intrvl);
        map.removeLayer(layers.sppn);
        map.removeLayer(layers.panelGrid);
        map.removeLayer(layers.riverpk);
        map.removeLayer(layers.eqout);
        map.removeLayer(layers.taxist);
        // map.removeLayer(layers.rdpq);
        // map.removeLayer(layers.bsis);
        // map.removeLayer(layers.area);
        map.removeLayer(layers.loc);
        
        map.removeLayer(layers.crsrdp_p);
        map.removeLayer(layers.crsrdp_c);
        $("#moveInfo").hide();
    // }
}
function appExitConfirm(){
    navigator.notification.confirm("현장조사 Smart KAIS를 종료하시겠습니까?", appExitCallback,"알림", ['확인', '취소']);
}
function appExitCallback(btnIndex){
    if(btnIndex == 1){
        util.appExit()
    }
}

function decrypt(x, y) {
    var centerX = x / 0.3 - 333333;
    var centerY = y / 0.3 - 333333;

    return [centerX, centerY];
}

function sendMois(){
    var link = URLs.versionLink;
    var url = URLs.postURL(link,"");
    util.postAJAX({}, url).then(
        function (context, rCode, results) {
            //통신오류처리
            if (rCode != 0 || results.response.status < 0) {
                navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                util.dismissProgress();
                return;
            }

            var d = results.data;
            

            console.log("접속확인중.." + d.versionName);
        },
        util.dismissProgress
    );
}

//검색 정제 (번지 빼기, 띄어쓰기)
function regExpCheckJuso(strKeyword)
{
	var tempKeyword = strKeyword;
	var charKeyword;  
	var tempLength;
	
	//주소일 경우 글자뒤에 번지 x, 주소와 숫자 사이에 한칸 띄우기
	var reqExp1 =/([0-9]|번지)$/;
	var reqExp2 =/번지$/;
	var checkChar =/^([0-9]|-|\.|\·)$/;

	if(reqExp1.test(strKeyword))
	{
		// 글자 뒤의 번지 삭제
		tempKeyword = strKeyword.split(reqExp2).join("");

		// 주소와 숫자 사이 한칸 띄우기
		tempLength = tempKeyword.length;

		for(var i=tempLength-1;i>=0;i--)
		{
			charKeyword = tempKeyword.charAt(i);
			if(!checkChar.test(charKeyword))
			{
				if(charKeyword != " ")
				{
					tempKeyword = insertString(tempKeyword,i+1,' ');			
				}
				break;
			}
		}
	}
	
	var regExp3 = /[0-9]*[ ]*(대로|로|길)[ ]+[0-9]+[ ]*([가-힝]|[ ])*[ ]*(로|길)/;
	var regExp4 = /[ ]/;

	var k = tempKeyword.match(regExp3) ;
	
	if (k != null) {
		var tmp = k[0].split(regExp4).join("");
		
		tempKeyword=tempKeyword.replace(regExp3, tmp);
    }

	// if (regExp3.test(tempKeyword)) {
	// 	var tmp = k[0].split(regExp4).join("");
		
	// 	tempKeyword=tempKeyword.replace(regExp3, tmp);
	// }
	
	return tempKeyword;
}

function insertString(key,index,string){
    if(index >0)
        return key.substring(0,index) + string + key.substring(index,key.length);
    else
        return string+key;
}

function JSONtoString(object) {
    var results = [];
    for (var property in object) {
        var value = object[property];
        if (value)
            results.push(property.toString() + ': ' + value);
        }
                
        return '{' + results.join(', ') + '}';
}

function maxLengthCheck(object){
    if (object.value.length > object.maxLength){
     object.value = object.value.slice(0, object.maxLength);
    }   
   }

//콤보박스 셋팅
function makeCombo(tagId, selectList, initText){
    $(tagId).empty();
    $(tagId).val("");

    if(typeof initText != "undefined" && initText != ""){
        $(tagId).append('<option value="">'+initText+'</option>');
    }
    for(var i = 0; i< selectList.length; i++){
        $(tagId).append('<option value="'+selectList[i].CODE_ID+'">'+selectList[i].CODE_NM+'</option>');
    }

}

//시군구 검색
function fnSelectSigList(tagId){
    try {
        // util.showProgress();
        var link = URLs.selectSigList;
        var sendParam = {
            sigCd: app.info.sigCd,
            workId: app.info.opeId
        }

        var url = URLs.postURL(link, sendParam);
        util.postAJAX({}, url)
            .then(function(context, rCode, results) {
                    util.dismissProgress();

                    //통신오류처리
                    if (rCode != 0 || results.response.status < 0) {
                        navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                        util.dismissProgress();
                        return;
                    }

                    var resultList = results.data;
                    makeCombo(tagId,resultList);
                    if(resultList.length == 1){
                        $(tagId).trigger('change');
                    }

            })
    }catch(error){
        util.toast(msg.callCenter,"error");
        util.dismissProgress();
    }
}

//읍면동 조회
function fnSelectEmdList(tagId){
    try{
        // util.showProgress();
        var sigCd = $("#selSig").val();
        var emdGbn = $("#emdGbn").val();

        var link = URLs.selectEmdList;
        if(emdGbn == "ha"){
            link = URLs.selectHangEmdList;
        }
        var sendParam = {
            sigCd: sigCd,
            workId: app.info.opeId
        }

        var url = URLs.postURL(link, sendParam);
        util.postAJAX({}, url)
            .then(function(context, rCode, results) {
                    util.dismissProgress();

                    //통신오류처리
                    if (rCode != 0 || results.response.status < 0) {
                        navigator.notification.alert(msg.callCenter, '', '알림', '확인');
                        util.dismissProgress();
                        return;
                    }

                    var resultList = results.data;
                    makeCombo(tagId,resultList,'-읍면동-');

            })
    }catch(error){
        util.toast(msg.callCenter,"error");
        util.dismissProgress();
    }
}
//위치정보 동의 처리
function checkAgreeLocation(){
    var agreeLocation = localStorage['agreeLocation'];
    if(agreeLocation == null || agreeLocation == undefined || agreeLocation == 'N'){
        navigator.notification.confirm(msg.agreePersonCoodi, function(btnindex){
            if(btnindex == 1){
                localStorage['agreeLocation'] = 'Y';
                setDeviceCoodi();
            }else{
                localStorage['agreeLocation'] = 'N';
                var message = "점검위치 조회(필수아님)";
                $("#posXDevice").text(message);
                $("#posYDevice").text(message);
            }
        }, "위치정보 수집 및 이용안내", ["동의","미동의"]);
    }else if(agreeLocation == 'Y'){
        setDeviceCoodi();
    }else{
        var message = "점검위치 조회(필수아님)";
        $("#posXDevice").text(message);
        $("#posYDevice").text(message);
    }

}

//현재위치 좌표조회
function setDeviceCoodi(){
    var devicePos = geolocation.getPosition();
    var agreeLocation = localStorage['agreeLocation'];

    if(agreeLocation == null || agreeLocation == undefined){
        checkAgreeLocation();
        return;
    }else if(agreeLocation == 'N'){
        var message = "점검위치 조회(필수아님)";
        $("#posXDevice").text(message);
        $("#posYDevice").text(message);
        return;
    }

    if(devicePos != null){
        if(localStorage['agreeLocation'] == 'Y'){
            $("#posXDevice").text(devicePos[0]);
            $("#posYDevice").text(devicePos[1]);
            $("#posXDevice").attr('class','red');
            $("#posYDevice").attr('class','red');
        }else{
            var message = "점검위치 조회(필수아님)";
            $("#posXDevice").text(message);
            $("#posYDevice").text(message);
        }

    }else{
        var message = "점검위치 조회(필수아님)";
        $("#posXDevice").text(message);
        $("#posYDevice").text(message);
    }
}

function clickRefreschMap(){
    legendCntClear();
    $('.refreshMap button').click();
}

function legendCntClear(){
    $('.legend .rdpq .total').text(0 + '건');
    $('.legend .area .total').text(0 + '건');
    $('.legend .bsis .total').text(0 + '건');
    $('.legend .rdpqW .total').text(0 + '건');
    $('.legend .entrc .total').text(0 + '건');
    $('.legend .spot .total').text(0 + '건');
}