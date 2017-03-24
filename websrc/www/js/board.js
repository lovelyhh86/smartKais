
$(function(){

var boardScroll;
var itemSize = 15;

$( document ).on("pagecreate",pages.addressview.div,  function() {
   // app.scaleContentToDevice(this);

    boardScroll = mkaisvScrollBind('#boardlist','#boardlistScroll',{
        cache:90,
        buffer:itemSize,
        context:{workId:app.info.opeId, sigCd:app.info.sigCd,size:itemSize, pos:'0'},
        requestCallback : requestDatasource,
        completCallback: scrollAppended,
        updateCallback: updateCallback,
        noitemCallback: noitemCallback,
        pulldownCallback : scrollPulldown
    });
    var top = $('.titleheader').outerHeight() + $('#bbs_page>.subtitleheader').outerHeight();

    $('#boardlist').css('top',top);
    $('#boardlist').css('height',$.mobile.getScreenHeight() -top);

/*
    $('#searchinput').autocomplete({
        source: function(request, response) {
        console.log('autocomplet');
          $.ajax({
            url: "http://en.wikipedia.org/w/api.php",
            appendTo:'#autosearchbox',
            dataType: "jsonp",
            data: {
              'action': "opensearch",
              'format': "json",
              'search': request.term
            },
            success: function(data) {
              response(data[1]);
            },
            create: function() {
                $(this).data('ui-autocomplete')._renderItem = function (ul, item) {
                    return $('<li>')
                        .append('<a>' + item.label + '<br>' + item.value + '</a>')
                        .appendTo(ul);
                };
            }
          });
        },
        minLength: 2,
        select: function(event, ui) {
          event.preventDefault();
          $('#searchinput').val(ui.item.value);
        }
    });
    //*/
});

$( document ).on("pagebeforeshow",pages.addressview.div,  function(event,data) {
    var context = app.context;
    if (util.isEmpty(context))
        return;

    app.context = {};
    localStorage["searchText"] = '';
    $('#searchinput').val('');

    var scroll = $('#boardlistScroll').data('infinitescroll');

    scroll.context = context;
    searchAddress();
});

$( document ).on("pageshow",pages.addressview.div,  function() {

});

function searchAddress(){
    var scroll = $('#boardlistScroll').data('infinitescroll');
    scroll.clear();
    scroll.context = {workId:app.info.opeId, sigCd:app.info.sigCd,size:itemSize, pos:'0'};
    scroll.updateInit();
}

function noitemCallback() {
    util.dismissProgress();
    var element = "<p style='text-align:center;'><img src='./images/noitem.png'></p>"
    return element;
}

function updateCallback(scroll,index,data){

    var scroll = $('#boardlistScroll').data('infinitescroll');
    scroll.context.pos = data.pos;

    //var completStyle = data.opertDe !== '' ? '' : "addressitem_complet";
    //var slaveNo = util.isEmpty(data.buldSlaveNo) ? "" : '-'+data.buldSlaveNo;
    var element =
        "<div  class='listItemTable addressitem ' data-sigcd='" +app.info.sigCd + "' data-sn='" + data.requestSn + "' >" +
            "<div class='listItemRow' >" +
                "<div class='ellipsis' >" + data.buldLabel + "</div>" +
                "<div class='listItemCellRight'  >" + data.requestDate + "</div>" +
            "</div>" +
            "</div>";

    return element;
}

function requestDatasource(scroll,start,count){
    util.showProgress();

    var item = $('#boardlistScroll .addressitem:last');
    var sn = '0';
    if (util.isEmpty(item) == false)
        sn = item.data('sn');

    var param = scroll.context;

    var url = URLs.postURL(URLs.addresslistlink,param);

   //util.getAJAX([start,count],url)
    util.postAJAX([start,count],url)
        .then( function(context,rcode,results) {

            scroll.updateData(context[0], results.data);

            }, function(context,xhr,error) {
                console.log("갱신실패"+ error+'   '+ xhr);

                navigator.notification.alert('기초조사 목록 요청을 실패하였습니다. 잠시 후 다시 시도하십시오.',
                        function (){
                        scroll.updateData(context[0], []);
                    },'기초조사', '확인');
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
    searchAddress();
}

$( document ).on("click",".fa-search", function()
{
    if ($('#searchoverlay').hasClass('overlay-hidden') == false)
    {
        $('#searchinput').blur();
        util.hiddenSearchPanel();
        console.log('search');

        var scroll = $('#boardlistScroll').data('infinitescroll');
        localStorage["searchText"] = $('#searchinput').val();
        searchAddress();
    }
    else
        $('#searchoverlay').removeClass('overlay-hidden');
});

$( document ).on("click","#boardlistScroll .addressitem", function()
{
    var page = pages.detailaddress;
    util.slide_page('left', page,{ sn : $(this).data('sn') ,sig_cd: $(this).data('sigcd')});
});


});