
function loadHelpdesk(container){

    itemSize = 40;
    $(container).load('hdmenu.html', function() {
        $(this).trigger('create');

        $('#helpdesk').ready( function() {

            skScrollBind('#noReply', '#noReply .list',{
                    cache:90,
                    buffer:itemSize,
                    context:{boardSe:'01', boardType:'ALL', pos:'0'},
                    setStyleCallback: stylesheetCallback,
                    requestCallback : requestDatasource,
                    completCallback: scrollAppended,
                    updateCallback: updateCallback,
                    noitemCallback: noitemCallback,
                    pulldownCallback : scrollPulldown
            });

            skScrollBind('#allQna', '#allQna .list',{
                    cache:90,
                    buffer:itemSize,
                    context:{boardSe:'ALL', boardType:'ALL', pos:'0'},
                    setStyleCallback: stylesheetCallback,
                    requestCallback : requestDatasource,
                    completCallback: scrollAppended,
                    updateCallback: updateCallback,
                    noitemCallback: noitemCallback,
                    pulldownCallback : scrollPulldown
            });

            var screenHeight = $.mobile.getScreenHeight();
            var panelMargin = $('#panel-qna .ui-panel-inner').outerHeight(true) - $('#panel-qna .ui-panel-inner').height();
            var headerHeight = $('#panel-qna .ui-header').outerHeight(true);
            var contentMargin = $('#panel-qna .ui-content').outerHeight(true) - $('#panel-qna .ui-content').height();
            var tabsMargin = $('#panel-qna .ui-tabs').outerHeight(true) - $('#panel-qna .ui-tabs').height();
            var tabsHeaderHeight = $('#panel-qna .tabs-header').outerHeight(true);
            var totalHeight = panelMargin + headerHeight + contentMargin + tabsMargin + tabsHeaderHeight + 24;
            $('#panel-qna .list').height(screenHeight - totalHeight);

            var refresh_qna = function() {
                var scroll = $('#noReply').data('infinitescroll');
                var scroll_all = $('#allQna').data('infinitescroll');
                scroll.context.boardType = $("board-type option:selected").data('boardtype');
                scroll_all.context.boardType = scroll.context.boardType;
                RefreshQnAList(scroll);
                RefreshQnAList(scroll_all);
            };

            $(document).on('refresh_qna', '',  refresh_qna);

            $('board-type').on('change', 'option', function(e) {
                e.preventDefault();
                refresh_qna();
            });

            $('#qna-menu').on("click", ".attachment", function()     {
                filename = $(this).text();
                smartKaisPlugins.callAttachViewer(
                    filename,
                    { noticeMgtSn:$(this).data('sn') ,fileMgtSn:$(this).data('filesn')},
                    function() {},
                    function(errorMsg) { console.error("Error at attach view file. " + errorMsg) });
            });

            $('#qna-menu').on("click", "a.ans_btn", function()     {
                var sn = $(this).data('sn');
                util.hiddenHelpDeskPanel('#helpdeskmenu');
                setTimeout( function () {
                    var page = pages.writereplypage;
                    util.slide_page('left', page, { sn : sn });

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
        var element = '<div data-role="collapsible" class="noItem"><h4>글이 없습니다.</h4><p></p></div>';
        return element;
    }

    function updateCallback(scroll,index,data){
        scroll.context.pos = data.pos;

        var attacheLinks = "";
        if (!util.isEmpty(data.files)) {
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
        if (util.isEmpty(data.replySubject) == false) {
            reply = "<div class='listItemTable' >" +
                         "<div style='display:table-cell;padding-left:10px;white-space:normal;' > " + data.replySubject +  "</div>" +
                     "</div>" +
                     "<div class='listItemTable'>"+
                         "<div style='display:table-cell;padding-left:10px;border-top:1px dashed #545894;'>" +
                             "<pre style='font-size:18px;white-space:pre-wrap;'>" + data.replyContent + "</pre>" +
                     "</div></div>";
        } else {
            ansbutton = "<div class='listItemTable'>" +
                            "<div class='listItemCellRight' style='padding:5px 10px'>" +
                                "<a class='ans_btn ' href='#' data-sn='"+ data.noticeMgtSn +"'>답변 작성</a>" +
                            "</div>" +
                        "</div>";
        }

        return "<h4><strong>{1} [{2}]</strong>{0}</h4><p>[{4}] {0}</p><pre>{3}</pre>"
                .format(data.subject, data.noticeMgtSn, data.noticeType, data.content, data.registDate);
    }

    function requestDatasource(scroll,start,count){

        util.showProgress();

        var d = new Date();
        var mm = (d.getMonth()+1).toString() ;
        mm = (mm[1]?mm:"0"+mm[0]);

        var dd = d.getDate().toString();
        dd =(dd[1]?dd:"0"+dd[0]);


        var param = $.extend({},{sigCd:app.info.sigCd, size:itemSize, timeout:5000}, scroll.context);
        var helpDeskUrl = URLs.postURL(URLs.helpDeskListLink, param);
        util.postAJAX( [start, count], helpDeskUrl)
            .then( function(context, rCode, results) {
               var data = results.data;

               if (rCode != 0 && util.isEmpty(data) === false ) {
                    scroll.updateData(context[0], []);
                    return;
               }
               scroll.updateData(context[0], data);

            }, function(context, xhr, error) {
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


