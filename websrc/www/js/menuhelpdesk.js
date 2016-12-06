
function loadHelpdesk(container){

    itemSize = 40;
    $(container).load('hdmenu.html', function() {
        $(this).trigger('create');

        $('#qna-menu').ready( function() {

            mkaisvScrollBind('#qna-list-container','#qna-list',{
                    cache:90,
                    buffer:itemSize,
                    context:{boardType:'ALL', boardSe:'01', pos:'0'},
                    setStyleCallback: stylesheetCallback,
                    requestCallback : requestDatasource,
                    completCallback: scrollAppended,
                    updateCallback: updateCallback,
                    noitemCallback: noitemCallback,
                    pulldownCallback : scrollPulldown
            });

            mkaisvScrollBind('#qna-list-all-container','#qna-list-all',{
                    cache:90,
                    buffer:itemSize,
                    context:{boardType:'ALL', boardSe:'ALL', pos:'0'},
                    setStyleCallback: stylesheetCallback,
                    requestCallback : requestDatasource,
                    completCallback: scrollAppended,
                    updateCallback: updateCallback,
                    noitemCallback: noitemCallback,
                    pulldownCallback : scrollPulldown
            });

            var screenheight = $.mobile.getScreenHeight();
            var headerheight = $('#qna-header').outerHeight();
            $('.qna-content').height(screenheight - headerheight);

            $('#qna-header').on( "click", '.menu-tab', function(e){
                if ($(this).hasClass('menu-tab-selected') == false)
                {
                    $('#qna-menu .menu-tab').toggleClass('menu-tab-selected');
                    $('#qna-menu .qna-content').toggleClass('display-none');
                }
            });

            $('#qna-header').on('click', '.fa-chevron-down', function(e) {
                e.preventDefault();
                var combobox = $('#qna-header .menu-table');
                combobox.css('border-radius','1em 1em 0 0');

                var options = $('#qna-header .combobox-options');
                options.slideToggle('fast');

                $(this).toggleClass('fa-chevron-down');
                $(this).toggleClass('fa-chevron-up');
            });

            $('#qna-header').on('click', '.fa-chevron-up', function(e) {
                e.preventDefault();
                var combobox = $('#qna-header .menu-table');

                var options = $('#qna-header .combobox-options');
                options.slideToggle('fast',function() {   combobox.css('border-radius','1em'); });

                $(this).toggleClass('fa-chevron-down');
                $(this).toggleClass('fa-chevron-up');
            });

            $('#qna-header .combobox-options').on('click', 'li', function(e) {
                e.preventDefault();
                var options = $('#qna-header .combobox-options');
                options.children('.select').toggleClass('select');
                $(this).addClass('select');

                $('#qna-header div.menu-search h1').text($(this).text());;

                var combobox = $('#qna-header .menu-table');
                options.slideToggle('fast',function() {   combobox.css('border-radius','1em'); });

                $('#qna-header .fa-chevron-up').addClass('fa-chevron-down');
                $('#qna-header .fa-chevron-up').removeClass('fa-chevron-up');

                var scroll = $('#qna-list').data('infinitescroll');
                var scroll_all = $('#qna-list-all').data('infinitescroll');
                scroll.context.boardType = $(this).data('boardtype');
                scroll_all.context.boardType = $(this).data('boardtype');
                RefreshQnAList(scroll);
                RefreshQnAList(scroll_all);
            });

            $(document).on('refresh_qna', '',  function() {

                var scroll = $('#qna-list').data('infinitescroll');
                var scroll_all = $('#qna-list-all').data('infinitescroll');
                scroll.context.boardType = $('#qna-header .combobox-options .select').data('boardtype');
                scroll_all.context.boardType = scroll.context.boardType;
                RefreshQnAList(scroll);
                RefreshQnAList(scroll_all);
            });

            $('#qna-menu').on("click",".helpdeskitem", function()     {
                var parents = $(this).parents('.qna-content');
                parents.find(".qna-item-detail").slideUp(500);
                if ($(this).next().css('display') == 'none' ) {
                    $(this).next().slideDown(500,function() { parents.animate({ scrollTop :  $(this).parent().position().top } ) ;  });
                }
            });

            $('#qna-menu').on("click",".attachment", function()     {
                filename = $(this).text();
                MKaisvPlugins.callAttachViewer(filename,{ noticeMgtSn:$(this).data('sn') ,fileMgtSn:$(this).data('filesn')},
                                                function(){},
                                                function(errormsg){} );
            });

            $('#qna-menu').on("click","a.ans_btn", function()     {
                var sn = $(this).data('sn');
                util.hiddenHelpDeskPanel('#helpdeskmenu');
                setTimeout( function () {
                    var page = pages.writereplypage;
                    util.slide_page('left', page,{ sn : sn });

                },100);
            });

        });
    });

    function stylesheetCallback(index) {
        return (index & 1) == 0 ? 'boardItemWhite' : 'boardItemGrey';
    }

    //리스트 목록이 없을 경우
    function noitemCallback() {
        util.dismissProgress();
        var element = "<p style='text-align:center;'><img src='./images/noitem.png'></p>"
        return element;
    }

    function updateCallback(scroll,index,data){
        scroll.context.pos = data.pos;

        var attacheLinks = "";
        if (util.isEmpty(data.files) == false) {
            for (var index = 0 ; index < data.files.length; index++)
            {
                attacheLinks +=
                "<div class='listItemTable'>" +
                    "<div style='display:table-cell;padding-left:10px;width:3em;'><strong>첨부" + (index+1) + "</strong></div>" +
                    "<div style='display:table-cell;' class='ellipsis attachment' data-sn='"+ data.noticeMgtSn +"' data-filesn='" + data.files[index].fileMgtSn + "' >" + data.files[index].fileName + "</div>" +
                "</div>";
            }
        }

        var ansbutton = '';
        var reply = '';
        if (util.isEmpty(data.replySubject) == false)
        {
            reply = "<div class='listItemTable' >" +
                         "<div style='display:table-cell;padding-left:10px;white-space:normal;' > " + data.replySubject +  "</div>" +
                     "</div>" +
                     "<div class='listItemTable'>"+
                         "<div style='display:table-cell;padding-left:10px;border-top:1px dashed #545894;'>" +
                             "<pre style='font-size:18px;white-space:pre-wrap;'>" + data.replyContent + "</pre>" +
                     "</div></div>";
        }
        else {
            ansbutton = "<div class='listItemTable'>" +
                            "<div class='listItemCellRight' style='padding:5px 10px'>" +
                                "<a class='ans_btn ' href='#' data-sn='"+ data.noticeMgtSn +"'>답변 작성</a>" +
                            "</div>" +
                        "</div>";
        }


      //  alert (reply);
      //  alert (data.replySubject);
        return   "<div class='helpdeskitem' style='padding:10px;'  data-sn='" + data.noticeMgtSn + "'>"+
                     "<div class='listItemTable '>" +
                         "<div style='display:table-cell;width:120px;' ><strong>" +data.noticeMgtSn + " [" + data.noticeType + "]</strong></div>" +
                         "<div style='display:table-cell;' class='ellipsis' >" + "" + "</div>" +
                         "<div class='listItemCellRight' >" + data.registDate + "</div>" +
                     "</div>" +
                     "<div class='listItemTable' >" +
                         "<div style='display:table-cell;padding-left:10px;white-space:normal;' > " + data.subject +  "</div>" +
                     "</div>" +
                 "</div>" +
                 "<div class='qna-item-detail' style='display:none;'>" +
                    ansbutton +
                    attacheLinks+
                    "<div class='listItemTable'>"+
                        "<div style='display:table-cell;padding-left:10px;border-top:1px dashed #545894;'>" +
                            "<pre style='font-size:18px;white-space:pre-wrap;'>" + data.content + "</pre>" +
                        "</div></div>" +
                    reply +
                 "</div>";

    }

    function requestDatasource(scroll,start,count){

        util.showProgress();

        var d = new Date();
        var mm = (d.getMonth()+1).toString() ;
        mm = (mm[1]?mm:"0"+mm[0]);

        var dd = d.getDate().toString();
        dd =(dd[1]?dd:"0"+dd[0]);


        var param = $.extend({},{sigCd:application.info.sigCd, size:itemSize, timeout:5000},scroll.context );
        var helpdeskurl = URLs.postURL(URLs.helpdesklistlink ,param);
        //util.getAJAX([start,count],helpdeskurl)
        util.postAJAX([start,count],helpdeskurl)
            .then( function(context,rcode,results) {

               var data = results.data;

               if (rcode != 0 && util.isEmpty(data) === false )
               {
                    scroll.updateData(context[0], []);
                    return;
               }


               scroll.updateData(context[0], results.data);
             },function(context,xhr,error) {
                scroll.updateData(context[0], []);
                console.log("갱신실패"+ error+'   '+ xhr);
             });
        return;

    }

    function scrollAppended(count){

        if (count == 0)
        {
            util.toast('더 이상 목록이 없습니다');
        }
        util.dismissProgress();
    }

    function scrollPulldown(scroll,size) {
        RefreshQnAList(scroll);
    }

    function RefreshQnAList(container) {
        //"qna-list-all" "qna-list"
        var scroll = container.data('infinitescroll');
     //   if (scroll.context.boardType !== searchType )
        {
            scroll.clear();
            scroll.context.pos = '0';
          //  scroll.context = {resolvedOnly: (container == 'qna-list' ? '0' : '1'), boardType:searchType};
            scroll.updateInit();
        }
    }
}


