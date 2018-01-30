
$(function(){

    // var boardScroll;
    // var itemSize = 15;

    //목록페이지
    // $( document ).on("pagecreate",pages.detailAddressListPage.div,  function() {
    
    // });

    // $( document ).on("pagebeforeshow",pages.detailAddressListPage.div,  function(event,data) {
    //     detailAddressContent();
    // });

    // $( document ).on("pageshow",pages.detailAddressListPage.div,  function() {

    // });

    $( document ).on("pagebeforeshow",pages.baseResearchPage.div,  function(event,data) {
        var context = app.context;
        
        if (util.isEmpty(context))
        return;

        app.context = {};

        $("#baseReserch_page").data('sn',context.sn);
        $("#baseReserch_page").data('sigCd',context.sigCd);
        
    });


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

    $( document ).on("click","#detailAddressDiv .addressitem", function()
    {
        var page = pages.detailaddress;
        util.slide_page('left', page,{ sn : $(this).data('sn') ,sig_cd: $(this).data('sigcd')});
    });

    

});

//점검대상 조회
function selectResearchContent(){
    var param = {
        sigCd : app.info.sigCd
    } ;
    
    var url = URLs.postURL(URLs.researchListLink, param);

    util.postAJAX("", url)
    .then(function (context, rcode, results) {
        var data = results.data;
        if (rcode != 0 || util.isEmpty(data) === true) {
            navigator.notification.alert('점검대상 목록이 없습니다.', function () {
                util.goBack();
            }, '점검대상', '확인');
            util.dismissProgress();
            return;
        } else {
            for(var i in data) {
                var rowHtml = '<tr class="adrdcRow" onclick=\"{0}\"><td>{1}</td><td>{2}</td><td>{3}</td><td>{4} {5}</td><td>{6}</td></tr>';
                var d = data[i];

                //설치 도로명
                var rnLbl = "{0} {1}{2}".format(
                    d.bsisRnLbl,
                    d.bsisMnnm,
                    d.bsisSlno == "0"? "" : "-" + d.bsisSlno
                );
                
                var locBtn = "<button class='location' onclick='getResearchLocation("+d.rdFtyLcSn+")'>위치</button>";
                var researchBtn = "<button class='location' onclick='insertResearchForList("+d.rdGdftySn+","+d.sigCd+")'>점검</button>";
                
                var selectFormat = "<select id='sel{0}'>{1}</select>";
                var optionFormat = "<option value='{0}'>{1}</option>";

                var optionTxt = ""; 
                var colume = "RC_STT_CD";
                var codeList = app.codeMaster[CODE_GROUP[colume]];
                
                for(var c in codeList){
                    if(c != "GroupNm"){
                        optionTxt += optionFormat.format(c,codeList[c]);
                        
                    }
                }

                var researchSelect = selectFormat.format(i,optionTxt);
                
                $("#detailAddressTable > tbody:last").append(
                    rowHtml.format(
                        // "goResearchDetail('"+d.rdGdftySn+"','"+d.rdGdftySe+"')"
                        ""
                        ,rnLbl 
                        ,d.rdGdftySeLbl
                        ,d.delStateCdLbl
                        // ,d.lastCheckStateLbl
                        ,researchSelect
                        ,researchBtn
                        ,locBtn));
            }
        }
        
        util.dismissProgress();
    }, function(context,xhr,error) {
                console.log("갱신실패"+ error+'   '+ xhr);

                navigator.notification.alert('점검대상 목록 요청을 실패하였습니다. 잠시 후 다시 시도하십시오.',
                        function (){
                            util.goBack();
                    },'점검대상', '확인');
                    util.dismissProgress();
            });
        
}

function goResearchDetail(sn, gbn){
    // var page = pages.baseResearchPage;
    // util.slide_page('left', page,{ sn : sn ,sigCd: app.info.sigCd});
    rdGdftySn = sn;

    var layer

    if(gbn == "110"){
        layer = DATA_TYPE.RDPQ;
    }else if(gbn == "510"){
        layer = DATA_TYPE.AREA;
    }else if(gbn == "610"){
        layer = DATA_TYPE.BSIS;
    }
    MapUtil.openDetail(layer, null);

}

function getResearchLocation(sn){
    var layerNm = "tlv_spgf_loc_skm";

    var searchList = {rdftylc_sn: sn}

    getLocationByFeature(layerNm, searchList);
}

function insertResearchForList(ftyNmtSn,sigCd){
    navigator.notification.confirm(msg.updateWorkDate, function(btnindex){

        if(btnindex == 1){
            
            
        }
    }, "알림", ["확인","취소"]);
}