
$(function(){

var boardScroll;
var itemSize = 30000;
var forceRefresh = false;

$( document ).on("pagecreate",pages.memolistpage.div,  function() {
   // application.scaleContentToDevice(this);

    boardScroll = mkaisvScrollBind('#memolist','#memolistScroll',{
        cache:itemSize,
        buffer:itemSize,
        enablePulldown:false,
        context:{workId:application.info.opeId, sigCd:application.info.sigCd,size:itemSize, pos:'0'},
        requestCallback : requestDatasource,
        completCallback: scrollAppended,
        updateCallback: updateCallback,
        noitemCallback: noitemCallback
    });
    var top = $('.titleheader').outerHeight() + $('#memolist_page>.subtitleheader').outerHeight();

    $('#memolist').css('top',top);
    $('#memolist').css('height',$.mobile.getScreenHeight() -top);

});

$( document ).on("pagebeforeshow",pages.memolistpage.div,  function(event,data) {
    var context = application.context;
    if (util.isEmpty(context))
        return;

    application.context = {};

    var scroll = $('#memolistScroll').data('infinitescroll');

    scroll.context = context;
    refresh();
});

$( document ).on("pageshow",pages.memolistpage.div,  function() {

});

function noitemCallback() {
    util.dismissProgress();
    var element = "<p style='text-align:center;'><img src='./images/noitem.png'></p>"
    return element;
}

function updateCallback(scroll,index,data){

console.log(data);
    var scroll = $('#memolistScroll').data('infinitescroll');
    scroll.context.pos = data.pos;
console.log(data);
    //var completStyle = data.opertDe !== '' ? '' : "addressitem_complet";
    //var slaveNo = util.isEmpty(data.buldSlaveNo) ? "" : '-'+data.buldSlaveNo;

    var id = data.id;
    var memo = data.memo;

    var y = data.date.slice(0,4);
    var m = data.date.slice(4,6);
    var d = data.date.slice(6,8);
    var h = data.date.slice(9,11);
    var mm = data.date.slice(11,13);

    var element =
        "<div  class='listItemTable addressitem memoitem' data-sigcd='" +application.info.sigCd + "' data-sn='" + id + "' >" +
            "<div class='listItemRow' >" +
                "<div class='ellipsis memotitle' >" + memo + "</div>" +
                "<div class='listItemCellRight'>"+
                    "<label style='margin:0;margin-right:5px;'  >" + y+'.'+m+'.'+d + "</label>" +
                    "<label style='margin:0;margin-right:5px;'  >" + h+'.'+mm+ "</label>" +
                "</div>" +
            "</div>" +
            "<div class='listItemRow memocontents'>" +
                memo+
            "</div>" +
        "</div>";

    return element;
}

function requestDatasource(scroll,start,count){
console.log('daa');
    if (forceRefresh == false)
        return;

    util.showProgress();

    var param = scroll.context;
    datasource.memoList({},function(dataArray){
        forceRefresh = false;
console.log(dataArray);
            scroll.updateData(0, dataArray);

          });
}

function scrollAppended(count){
    if (count == 0)
    {
        util.toast('더 이상 목록이 없습니다');
    }
    util.dismissProgress();
}

function refresh(){
console.log('refre');
    forceRefresh = true;
    var scroll = $('#memolistScroll').data('infinitescroll');
    scroll.clear();
    scroll.context = {};
    scroll.updateInit();
}

$( document ).on("click","#memolistScroll .memoitem", function()
{
    var selected = $(this).find('.memocontents').hasClass('selected');

    $('.memocontents').removeClass('selected');
    if (selected == false) {
        $(this).find('.memocontents').addClass('selected');
    }
});


});