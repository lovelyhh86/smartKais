
//검색 스크롤 이벤트 바인딩
function skScrollBind(page,scrollElement, options) {

    var scroller = function (page, scrollElement, options ) {

        var _options = {
            cache:150,
            buffer:50,
            enablePulldown:true,
            context:{},
            setStyleCallback: function(index){ return '';},
            scrollableCallback : function(){ return true;},
            requestCallback : function(scroll,start,count){ },
            updateCallback : function(index,data){ return data;},
            completCallback: function(appendedCount) {},
            noitemCallback: function() {},
            pulldownCallback : function(scroll,size) { scroll.animate({'margin-top': 0}, 'fast'); }
        };

        for ( key in options)
        {
            _options[key] = options[key];
        }

        var container = $(page);
        var scroll = $(scrollElement);
        $(scrollElement).data('infinitescroll',scroll);
        //private functions


        //public functions
        scroll.context = _options.context;

        scroll.updateInit = function(){
            this.css('margin-top','0px');
            this.build(1,_options.buffer);
        };
        scroll.clear = function(){
            this.css('margin-top','0px');
            $(scrollElement + ' div').remove();
        };
        scroll.build = function(start,count){
            _options.requestCallback(this,start,count);
        };
        scroll.removeObject = function(obj){
            $(obj).remove();
        };
        scroll.updateData = function(start, dataSource) {

            var divs =[];
            $.each(dataSource, function (index, item) {
                var updatedItem = _options.updateCallback(scroll, index, dataSource[index]);
                if (!util.isEmpty(updatedItem)) {
                    divs.push("<div data-role='collapsible' data-itemid='{1}' class='item'>{0}</div>".format(updatedItem, start + index));
                }
            });

            if (divs.length > 0) {
                $(scrollElement + ' .noItem').remove();
                $(scrollElement).append(divs);
            }

            if ( $(scrollElement).children('div').length == 0 ) {
                var element = '<div data-role="collapsible" class="noItem"><h4>글이 없습니다.</h4><p></p></div>';
                $(scrollElement).append(element);

            } else {
                _options.completCallback(divs.length);
            }
            $(scrollElement).collapsibleset("refresh");
        };

        var touchStartPos;
        var touchEndPos;
        $(page).bind("touchstart", function(event) {
            touchStartPos = event.originalEvent.touches[0].pageY;
            //console.log(touchStartPos);
        })
        .bind('touchmove', function(event){
            touchEndPos = event.originalEvent.touches[0].pageY;
            //console.log(touchEndPos);
        })
        .bind('touchend', function(e){
            //console.log(touchStartPos + ' && ' + touchEndPos);
         })

        //register event
        $(page).bind("scrollstop", function(event) {

            if (event.view == undefined)
                return;

            var scrollObject = $(scrollElement);
            if (scrollObject.children('.noItem').length !== 0) //항목이 하나도 없다면 추가갱신을 하지않음
                return;

            var scrollHeight = scrollObject.height();
            var windowHeight = $(window).scrollTop() + $(window).height();
            var documentHeight = parseInt($(document).height());
            var thisHeight = $(this).height();
            var lastitem =scrollElement + " div:last";
            var firstitem =scrollElement + " div:first";
            var containerBorderTopWd = parseInt(container.css("border-top-width"));
            var containerBorderBtmWd = parseInt(container.css("border-bottom-width"));

            if ($(lastitem).offset() === undefined || $(lastitem).height() === null )
            {
                scroll.build(0 ,_options.buffer);
            }
            else if (  (parseInt(container.height()) + parseInt(container.offset().top) + containerBorderTopWd + containerBorderBtmWd )  >= parseInt($(lastitem).offset().top) + parseInt($(lastitem).height()) )
            {
                var start = $(lastitem).data('itemid') + 1 ;
                if(isNaN(start) && ( (touchStartPos-touchEndPos) < 0 ) ){
                    start = -1;
                }
                scroll.build(start ,_options.buffer);
            }

            if (false) {
               // if (windowHeight == documentHeight)
                if ($(lastitem).offset() === undefined || $(lastitem).height() === null )
                {
                    scroll.build(0 ,_options.buffer);
                }
                else if ($(lastitem).offset().top + $(lastitem).height() < documentHeight)
                {
                    var start = $(lastitem).data('itemid') + 1 ;
                    if(isNaN(start) && ( (touchStartPos-touchEndPos) < 0 ) ){
                        start = -1;
                    }
                    scroll.build(start ,_options.buffer);
                    //   alert($(scrollElement).index($(lastitem)));
                    // 항목 마지막
                }else if ($(window).scrollTop() == 0 )
                {
                    //  var last = $(firstitem).data('itemid') - 1 ;
                    //  build(last , -_options.buffer);
                    // 항목 처음
                }
            }
            /*
    console.log($(page).position().top +'   '+$(page).offset().top +'   '+ $(page).scrollTop()+'   '+ $(page).height()+'   '+ $(page).innerHeight()+'   '+$(page).outerHeight() + '> ' + documentHeight+ '  '+ windowHeight);
    console.log($(scrollElement).position().top +'   '+$(scrollElement).offset().top +'   '+ $(scrollElement).scrollTop()+'   '+ $(scrollElement).height()+'   '+ $(scrollElement).innerHeight()+'   '+$(scrollElement).outerHeight() + '>  ' + documentHeight+ '  '+ thisHeight);
    console.log($(lastitem).position().top +'   '+$(lastitem).offset().top +'   '+ $(lastitem).scrollTop()+'   '+ $(lastitem).height()+'   '+ $(lastitem).innerHeight()+'   '+$(lastitem).outerHeight() + '  ' + $(lastitem).outerHeight()+ '>  '+ thisHeight);
    console.log($(firstitem).position().top +'   '+$(firstitem).offset().top +'   '+ $(firstitem).scrollTop()+'   '+ $(firstitem).height()+'   '+ $(firstitem).innerHeight()+'   '+$(firstitem).outerHeight() + '  ' + documentHeight+ '>  '+ thisHeight);
//*/

        });

        if (_options.enablePulldown == true) {
            var mouseY = 0;
            var pulldownSize = 0;

            scroll.on('touchstart', function (ev) {
                var event = ev.originalEvent.targetTouches[0];
                mouseY = event.pageY;
                pulldownSize = 0;
            });

            scroll.on('touchmove', function (e) {
                var moveEvent = e.originalEvent.targetTouches[0];

                var scrolltop = parseInt(scroll.position().top);
                if (scrolltop != 0 )
                {
                    mouseY = moveEvent.pageY;
                }
                /*
                console.log('scrolltop' + scrolltop);
                console.log('margintop' + margintop);
                console.log('pagey' + moveEvent.pageY);
                console.log('mouseY' + mouseY);
                //*/
                if (scrolltop == 0 && moveEvent.pageY > mouseY) {
                    var d = moveEvent.pageY - mouseY;
                    scroll.css('margin-top', d/3 + 'px');
                    pulldownSize = d/3;
                }
                else
                    pulldownSize = 0;
            });
            scroll.on('touchend', function () {
                var marginTop = 0;
                var completFunc = function(){ };
                if (pulldownSize > 60) {
                    completFunc = function(){_options.pulldownCallback(scroll,pulldownSize);   };
                    marginTop = 60;
                }
                scroll.animate({'margin-top': marginTop}, 'fast',completFunc );
            });
        }

        scroll.updateInit();
        return scroll;
    }

    return new scroller(page,scrollElement,options);
}