
var util = {
    //ajax call
    getAJAX : function(context,url){
        var def = $.Deferred();
        $.ajax({
            type: "get",
            url: url,
            dataType: "json",
            timeout: 100000,
            data: {},
            success: function(results) {
                def.resolve(context,results);
            },
            complete: function(results) {},
            error: function(xhr, status, error) {
                def.reject(context,xhr,error);
                return false;
            }
        });

        return def.promise();
    },
    postAJAX : function(context,urldata , direct){
        var def = $.Deferred();
        urldata = $.extend({},{sigCd:application.info.sigCd,mode:application.mode}, urldata);  //시군구 코드 필수 추가
        MKaisvPlugins.callServiceBroker(urldata,
                    function(results) {
                        var jsondata = results.resultData;//JSON.parse(results.resultData);
                        def.resolve(context,results.resultCode,jsondata);
                    },
                    function(errorResults){
            //        alert(errorResults.resultData);
                        var jsondata = errorResults.resultData;//JSON.parse(errorResults.resultData);
                        def.reject(context,errorResults.resultCode,jsondata);
                    },direct);
        /*
        $.ajax({
            type: "post",
            url: urldata.url,
            dataType: "json",
            timeout: 100000,
            data: urldata.data,
            success: function(results) {
                def.resolve(context,results);
            },
            complete: function(results) {},
            error: function(xhr, status, error) {
                def.reject(context,xhr,error);
                return false;
            }
        });
        //*/

        return def.promise();
    }    ,
    //Element 검증
    isEmpty :function (element) {
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
    goBack: function(){
         if ($('#menuoverlay').hasClass('overlay-hidden') == false)
         {
            util.hiddenMenuPanel('#mainMenu');
            util.hiddenHelpDeskPanel('#helpdeskmenu');
            return;
         }

         /*
         if ($('#searchoverlay').hasClass('overlay-hidden') == false)
         {
            util.hiddenSearchPanel();
            return;
         }
         //*/

        //alert($.mobile.activePage.prev('[data-role=page]')[0].id +' '+$.mobile.navigate.history.stack.length );
         //상세주소에서 지도화면이동에서의 뒤로가기


         var activePage = $.mobile.activePage.attr('id')
         if('#'+activePage ==  pages.workpage.div)
         {
            if (confirm('현장조사 Smart KAIS를 종료하시겠습니까?') == true )
                util.appExit();
            return;
         }
         else if (application.historyStack.length == 1)
         {
            application.historyStack.pop();
            util.slide_page('right', pages.workpage);
         }
         else {
            application.historyStack.pop();
            navigator.app.backHistory();
            util.doSlide("right");
         }
    },
    clearHistory: function (){

        var spliceIndex=0;
        for (var index in $.mobile.navigate.history.stack){
            if (pages.workpage === $.mobile.navigate.history.stack[index]['url'])
            {
                spliceIndex = index+1;
            }

        }
        if (spliceIndex < $.mobile.navigate.history.stack.length)
        {
            $.mobile.navigate.history.stack.splice(spliceIndex,$.mobile.navigate.history.stack.length - spliceIndex);
        }


    },
    //overlay menu panel
    showHelpDeskPanel:function(selector) {
        $('.overlay').addClass('overlay-hidden');
        $('#menuoverlay').removeClass('overlay-hidden');
      //  $(selector).removeClass('display-none');
        $('.menu-fixed-right').css('right','0');
        $(selector).css('right','0');
    },
    hiddenHelpDeskPanel:function(selector) {
        $('#menuoverlay').addClass('overlay-hidden');
        $(selector).css('right','-80%');
        $('.menu-fixed-right').css('right','-80%');

    },
    showMenuPanel: function (selector){
        $('.overlay').addClass('overlay-hidden');
        $('#menuoverlay').removeClass('overlay-hidden');
        $(selector).css('left','0');
    },
    hiddenMenuPanel: function(selector){
        $('#menuoverlay').addClass('overlay-hidden');
        $('#mainMenu').css('left','-80%');
    },
    hiddenSearchPanel: function(){
        if ($('#searchinput').is(':focus') === true) {
            $('#searchinput').blur();
        }
        else {
            $('#searchoverlay').addClass('overlay-hidden');
        }
    },
    //native transition
    doSlide: function(direction){
         if (direction === undefined)
             direction = "left";
         var options = {
                 "direction" : direction,
                 //"slowdownfactor"   :    5, // overlap views (higher number is more) or no overlap (1). -1 doesn't slide at all. Default 4
                 //"slidePixels"      :   20, // optional, works nice with slowdownfactor -1 to create a 'material design'-like effect. Default not set so it slides the entire page.
                 "duration"       :  500, // in milliseconds (ms), default 400
                 "slowdownfactor" :    4, // overlap views (higher number is more) or no overlap (1), default 3
             };
         window.plugins.nativepagetransitions.slide(
               options,
               function (msg) {console.log("success: " + msg)}, // called when the animation has finished
               function (msg) {console.log("error: " + msg)} // called in case you pass in weird values
         );
    },
     //native transition
    slide_page: function(direction, href,param){

        //page url + #page selector
        var link = href.link() + href.div;
        application.historyStack.push(link);

        application.context = param;
        $.mobile.pageContainer.pagecontainer( "change", link, {
            transition: "slide",
            reverse: direction === 'left' ? false : true,
            changeHash: true,
            reloadPage: false
        });

        return;

        var options = {
            "href"           : href,
            "direction"      : direction, // 'left|right|up|down', default 'left' (which is like 'next')
            "duration"       :  500, // in milliseconds (ms), default 400
            "slowdownfactor" :    4, // overlap views (higher number is more) or no overlap (1), default 3
            "androiddelay"   :  150  // same as above but for Android, default 50
        };

        window.plugins.nativepagetransitions.slide(
            options,
            function (msg) {console.log("success: " + msg)}, // called when the animation has finished
            function (msg) {console.log("error: " + msg)} // called in case you pass in weird values
        );
    },
     //메뉴 생성
     createNavPanel: function(navid,contents){
        function generateNavNode(contents) {
            var nav = "<ul>";
            $.each(contents, function(index, content){
                var data = {
                    fastclick:"true",
                    href:"#",
                    onclick:"",
                    iconsrc:"",
                    label:"",
                    child:""
                };

                for ( key in content)
                {
                    data[key] = content[key];
                }

                var li = "<li><a " + (data.fastclick == true ? "data-fastClick='YES' ":"") + (data.href != "" ? ("href='" + data.href +"' ") :"") + (data.onclick != "" ? ("onclick='" + data.onclick +"' ") :"") + ">";

                if (data.iconsrc != "")
                {
                    li += "<span class='ico'><img src='"+data.iconsrc +"' alt='' /></span>";
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
     gotoTask: function(tasktype) {
        var url = pages.map;
        var param = {
            categoryid:tasktype,
            sig_cd:application.info.sigCd
        };
        var activePage = $.mobile.activePage.attr('id');

        switch (tasktype)
        {
            case "home":

                application.historyStack = [];
                url = pages.workpage.link();
                document.location.href = url + '?cn=&tel='+application.telNo;
                param = "";
                return;
            case "buildsign":
            case "roadsign":
            case "areasign":
            case "basenumsign":
            case "mapservice":
                application.historyStack = [];
                url = pages.map;

                break;
            case "address":
                if(activePage ==  'bbs_page')
                    return;
                application.historyStack = [];
                url = pages.addressview;
                param = "";
                break;
            case "helpdesk":
                util.showHelpDeskPanel('#helpdeskmenu');
                return;
            case "appmenu":
                util.showMenuPanel('#mainMenu');
                return;
                case "download":
                 MKaisvPlugins.dn('http://api.juso.go.kr/gis/dnSmartKaisApp.jsp', function(msg){
                    alert(msg.message);
                 });
                 return;
             case "camera":

                MKaisvPlugins.camera(function(result){
                         ;
                      });
                      return;
              case "debug":
                      return;
        }
        util.slide_page('left', url, param);
     },
     takePictureFromCamera: function(returnFn){
        MKaisvPlugins.camera(function(result){
                         returnFn(result);
                      });
     },
     takePictureFromAlbum: function(returnFn){
         function readImage(url) {
             var deferred = $.Deferred();

             function toDataUrl(url, callback) {
               var xhr = new XMLHttpRequest();
               xhr.responseType = 'blob';
               xhr.onload = function() {
                 var reader = new FileReader();
                 reader.onloadend = function() {
                   callback(reader.result);
                 }
                 reader.readAsDataURL(xhr.response);
               };
               xhr.open('GET', url);
               xhr.send();
             }
             toDataUrl(url,function(base64img){

                 base64img = base64img.substring( base64img.indexOf('base64,') + 'base64,'.length);
                 deferred.resolve(base64img);
             });
             return deferred.promise();
         }


         plugins.imagePicker.getPictures(function(results){
            if (results.length > 0)
            {
                 readImage(results[0]).done(function(base64){
                     returnFn({src:base64,metadata:''});
                 });
            }
            else {
                returnFn('');
            }
         },
         function(fails){
                 console.log('Error: ' + fails);
         },{
             maxImages:1,
             quality : 50,
             width : 1024,
             height:768

         });
     },
     getCameraPicture: function(fnResult){

         var selectCallback = function(index) {

            var Camera = navigator.camera;
            var cameraOption  = {
                        quality: 50,
                        targetWidth:1024,
                        targetHeight:768,
                        destinationType : Camera.DestinationType.DATA_URL,
                        sourceType : Camera.PictureSourceType.CAMERA,
                        encodingType : Camera.EncodingType.JPEG,
                        mediaType : Camera.MediaType.PICTURE,
                        correctOrientation : true,
                        saveToPhotoAlbum : false
                    };

            var functor = function(param){};
            if (index == 0)
            {
                return;
            }
            else if (index == 2)
            {
                cameraOption.sourceType = Camera.PictureSourceType.CAMERA;
                functor = util.takePictureFromCamera;
            }
            else if ( index == 1)
            {
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
         navigator.notification.confirm('사진을 가져올 방법을 선택하십시오 ',selectCallback, "사진 추가", "포토 앨범,카메라");
     },
    addPictureFromCamera: function(selector){
        util.getCameraPicture(function(imgData) {
            var datetime = util.isEmpty(imgData.metadata.datetime) ? util.getToday(true) : imgData.metadata.datetime;
            datetime = datetime.replace(/:/g,'');
            datetime = datetime.replace(/ /g,'_');

            var obj = "<li  data-id='-1000' data-name='' style='position:relative;' data-type='jpeg' data-time='"+ datetime +"'>"+
                                " <div class='float-camera' " +
                                      "style='background-color:rgba(61,65,144,0.8);position:absolute;top:20px;'   >" +
                                               "<i class='fa fa-trash fa-inverse '></i>" +
                                           "</div>" +
                      "<img style='height: 220px; width: 100%; object-fit: contain' src='data:image/jpeg;base64,"
                      +  imgData.src +"'/></li>"  ;

            var slider = $(selector).data('flexslider');

            if ($(selector+' ul>li:eq(0)').data('id') == -1)
            {
                slider.removeSlide(0);
            }
            slider.addSlide(obj);
            slider.flexAnimate(slider.count-1); // go back to the first slide
          });
    },
    toast: function (msg) {
        toastr.remove();
        toastr.options.positionClass = 'toast-center';
        toastr.options.timeOut = 1500;
        toastr.info(msg);
    },
    showProgress : function(){
        MKaisvPlugins.showProgress("", function(jsondata){});
    },
    dismissProgress : function() {
        MKaisvPlugins.dismissProgress();
    },
    getToday: function(withHMS){
        var date = new Date();

        var year  = date.getFullYear();
        var month = date.getMonth() + 1; // 0부터 시작하므로 1더함 더함
        var day   = date.getDate();

        if (("" + month).length == 1) { month = "0" + month; }
        if (("" + day).length   == 1) { day   = "0" + day;   }

        var result = ("" + year + month + day);
        if ( withHMS === true)
        {
            var hour = date.getHours();
            var min =  date.getMinutes();
            var sec =  date.getSeconds();

            if (("" + hour).length == 1) { hour = "0" + hour; }
            if (("" + min).length   == 1) { min   = "0" + min;   }
            if (("" + sec).length   == 1) { sec   = "0" + sec;   }

            result += '_' + hour + min  + sec;
        }

        return result;
    },
    registLimitText : function(selector,limit) {
        var elem = $(selector);
        elem.bind('keyup keydown',function(){
            var text = elem.val();
            if (text.length > limit + 1)
            {
                elem.val(text.substr(0,limit));
                util.toast('최대입력 '+limit+'글자를 넘을 수 없습니다');
                return false;
            }
        });
    },
    getUserInfo : function(successFn )
    {
        MKaisvPlugins.getSSOinfo(successFn);
    },
    on : function(triggerName, triggerFunc){
        MKaisvPlugins.on(triggerName, triggerFunc);
    },
    off : function(triggerName, triggerFunc){
        MKaisvPlugins.off(triggerName, triggerFunc);
    },
    //app종료
    appExit : function ()
    {
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
    handleEvent: function(e) {
        switch (e.type) {
            case 'touchstart':
                // console.log('S');
                this.onTouchStart(e);
                break;
            case 'touchmove':
                // console.log('M');
                this.onTouchMove(e);
                break;
            case 'touchend':
                // console.log('E');
                this.onTouchEnd(e);
                break;
        }
    },
    onTouchStart: function(e) {
    console.log('eee');
        e.preventDefault();
        this.moved = false;
        this.x = e.targetTouches[0].clientX;
        this.y = e.targetTouches[0].clientY;

        this.theTarget = document.elementFromPoint(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
        // if(this.theTarget.nodeType == 3) this.theTarget = this.theTarget.parentNode;
        if(this.theTarget.getAttribute("data-fastClick") != "YES") this.theTarget = this.theTarget.parentNode; //대상이 이벤트를 방생한게 아니라면 부모노드 검색
        //if(this.theTarget.getAttribute("data-fastClick") != "YES") this.theTarget = e.currentTarget; //부모노드도 대상이 아닐경우 대상선택

        //this.theTarget = e.currentTarget;


        this.theTarget.className += ' pressed';

        this.element.addEventListener('touchmove', this, false);
        this.element.addEventListener('touchend', this, false);
    },
    onTouchMove: function(e) {
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
    onTouchEnd: function(e) {
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





