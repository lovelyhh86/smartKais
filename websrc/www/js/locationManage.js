
$(function(){


});

//안내시설물 위치이동 내용 조회
function selectLocationMoveSpgfContent(){
    util.showProgress();
    
    var param = {
        sigCd : app.info.sigCd,
        // delStateCd : type
    } ;
    
    var url = URLs.postURL(URLs.selectLocationMoveSpgfLink, param);

    util.postAJAX("", url)
    .then(function (context, rcode, results) {
        
        $("#locManageSpgfTable > tbody").empty();
        $("#rowSize").empty();
        var data = results.data;
        
        if (rcode != 0 || util.isEmpty(data) === true) {
            // navigator.notification.alert('검색된 목록이 없습니다.', function () {
            //     // util.goBack();
            //     var rowHtml = '<tr class=""><td colspan="5">검색된 목록이 없습니다.</td></tr>';
            //     $("#myResearchTable > tbody:last").append(rowHtml);
            // }, '점검대상', '확인');

            var rowHtml = '<tr><td colspan="7">검색된 목록이 없습니다.</td></tr>';
            $("#locManageSpgfTable > tbody:last").append(rowHtml);
            $("#rowSize").append('0');
            util.dismissProgress();
            return;
        } else {
            for(var i in data) {
                //검색조건 생성
                // var selectFormat = "<select id='sel{0}'>{1}</select>";
                // var optionFormat = "<option value='{0}'>{1}</option>";
                // var optionTxt = ""; 
                // var colume = "RC_STT_CD";

                // var codeList = app.codeMaster[CODE_GROUP[colume]];
                // for(var c in codeList){
                //     if(c != "GroupNm"){
                //         optionTxt += optionFormat.format(c,codeList[c]);
                        
                //     }
                // }
                // var researchSelect = selectFormat.format(i,optionTxt);

                var rowHtml = '<tr><td onclick=\"{0}\">{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td></tr>';
                var d = data[i];

                var bsisRnLbl = d.bsisRnLbl;
                var rnLbl = '-';
                if(bsisRnLbl != null){
                    //설치 도로명
                    rnLbl = "{0} {1}{2}".format(
                        d.bsisRnLbl,
                        d.bsisMnnm == null? "": d.bsisMnnm,
                        d.bsisSlno == "0"? "" : "-" + d.bsisSlno
                    );
                }
                var rdGdftySe = d.rdGdftySe;
                var korRnLbl = createRnNm(rdGdftySe,d);
                
                var memo = d.memo == null? '' : d.memo;

                var rdFtyLcSn = d.rdFtyLcSn;
                var locBtn = "<button class='ui-btn ui-corner-all ui-shadow btnPossible cell80' onclick='moveToXyTranceProj("+d.posX+","+d.posY+")'>위치</button>";
                
                // if(rdFtyLcSn != null){
                //     locBtn = "<button class='location' onclick='getResearchLocation("+rdFtyLcSn+")'>위치</button>";    
                // }

                $("#locManageSpgfTable > tbody:last").append(
                    rowHtml.format(
                        // "goResearchDetail('"+d.rdGdftySn+"','"+d.rdGdftySe+"')"
                        ""
                        ,d.jobSeCdLbl
                        ,rnLbl 
                        ,korRnLbl
                        // ,d.posX
                        // ,d.posY
                        ,d.mopertDe
                        ,memo
                        ,locBtn));
            }
            var size = $("#locManageSpgfTable > tbody > tr").size();

            $("#rowSize").append(size);
        }
        
        util.dismissProgress();
    }, function(context,xhr,error) {
                console.log("갱신실패"+ error+'   '+ xhr);

                navigator.notification.alert('위치이동 목록 요청을 실패하였습니다. 잠시 후 다시 시도하십시오.',
                        function (){
                            util.goBack();
                    },'위치이동', '확인');
                    util.dismissProgress();
            });
        
}

//안내시설물 위치이동 내용 조회
function selectLocationMoveSpbdNmgtContent(){
    util.showProgress();
    
    var param = {
        sigCd : app.info.sigCd,
        // delStateCd : type
    } ;
    
    var url = URLs.postURL(URLs.selectLocationMoveSpbdNmgtLink, param);

    util.postAJAX("", url)
    .then(function (context, rcode, results) {
        
        $("#locManageSpbdNmgtTable > tbody").empty();
        $("#rowSize").empty();
        var data = results.data;
        
        if (rcode != 0 || util.isEmpty(data) === true) {
            // navigator.notification.alert('검색된 목록이 없습니다.', function () {
            //     // util.goBack();
            //     var rowHtml = '<tr class=""><td colspan="5">검색된 목록이 없습니다.</td></tr>';
            //     $("#myResearchTable > tbody:last").append(rowHtml);
            // }, '점검대상', '확인');

            var rowHtml = '<tr><td colspan="6">검색된 목록이 없습니다.</td></tr>';
            $("#locManageSpbdNmgtTable > tbody:last").append(rowHtml);
            $("#rowSize").append('0');
            util.dismissProgress();
            return;
        } else {
            for(var i in data) {
                //검색조건 생성
                // var selectFormat = "<select id='sel{0}'>{1}</select>";
                // var optionFormat = "<option value='{0}'>{1}</option>";
                // var optionTxt = ""; 
                // var colume = "RC_STT_CD";

                // var codeList = app.codeMaster[CODE_GROUP[colume]];
                // for(var c in codeList){
                //     if(c != "GroupNm"){
                //         optionTxt += optionFormat.format(c,codeList[c]);
                        
                //     }
                // }
                // var researchSelect = selectFormat.format(i,optionTxt);

                var rowHtml = '<tr><td onclick=\"{0}\">{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td></tr>';
                var d = data[i];

                // var bsisRnLbl = d.bsisRnLbl;
                // var rnLbl = '';
                // if(bsisRnLbl != null){
                //     //설치 도로명
                //     rnLbl = "{0} {1}{2}".format(
                //         d.bsisRnLbl,
                //         d.bsisMnnm,
                //         d.bsisSlno == "0"? "" : "-" + d.bsisSlno
                //     );
                // }
                // var rdGdftySe = d.rdGdftySe;
                // var korRnLbl = createRnNm(rdGdftySe,d);
                var memo = d.memo == null? '' : d.memo;

                var rdFtyLcSn = d.rdFtyLcSn;
                var locBtn = "<button class='ui-btn ui-corner-all ui-shadow btnPossible cell80' onclick='moveToXyTranceProj("+d.posX+","+d.posY+")'>위치</button>";
                
                $("#locManageSpbdNmgtTable > tbody:last").append(
                    rowHtml.format(
                        // "goResearchDetail('"+d.rdGdftySn+"','"+d.rdGdftySe+"')"
                        ""
                        ,d.jobSeCdLbl
                        // ,rnLbl 
                        // ,korRnLbl
                        ,d.posX
                        ,d.posY
                        ,d.mopertDe
                        ,memo
                        ,locBtn));
            }
            var size = $("#locManageSpbdNmgtTable > tbody > tr").size();

            $("#rowSize").append(size);
        }
        
        util.dismissProgress();
    }, function(context,xhr,error) {
                console.log("갱신실패"+ error+'   '+ xhr);

                navigator.notification.alert('위치이동 목록 요청을 실패하였습니다. 잠시 후 다시 시도하십시오.',
                        function (){
                            util.goBack();
                    },'위치이동', '확인');
                    util.dismissProgress();
            });
        
}

//명판내용만들기
function createRnNm(type ,d){
    var rnLbl = "";

    if (type == "110" || type == "210" || type == "310") {
        //명판방향
        var plqDirection = d.plqDirection;
        //도로명
        var frontKoreanRoadNm = d.frontKoreanRoadNm;
        //시작기초번호
        var frontStartBaseMasterNo = d.frontStartBaseMasterNo;
        var frontStartBaseSlaveNo = d.frontStartBaseSlaveNo;
        //종료기초번호
        var frontEndBaseMasterNo = d.frontEndBaseMasterNo;
        var frontEndBaseSlaveNo = d.frontEndBaseSlaveNo;
        //명판방향라벨
        var PLQ_DRC = d.plqDirectionLbl;

        //이면도로용
        if(type == "210"){
            plqDirection = d.rddr_plqDrc;
            frontKoreanRoadNm = d.rddr_korRn;
            frontStartBaseMasterNo = d.rddr_stbsMn;
            frontStartBaseSlaveNo = d.rddr_stbsSn;
            frontEndBaseMasterNo = d.rddr_edbsMn;
            frontEndBaseSlaveNo = d.rddr_edbsSn;
            PLQ_DRC = d.rddr_plqDrcLbl;

            //이면도로명판 독립형인 경우 첫번째 도로명 표시
            var rddr_afRdplqSe = d.rddr_afRdplqSe;
            if(rddr_afRdplqSe == "01000"){
                //이면도로명판 내용
                var rddrCnList = d.rddrCn;
                try {
                    if(rddrCnList != null && rddrCnList.length > 0){
                        //방향
                        var drcRdDrc =rddrCnList[0].drcRdDrc;

                        var drcRdDrcLbl = "";
                        if(drcRdDrc == "1"){
                            drcRdDrcLbl = "⇳";
                        }else if(drcRdDrc == "2"){
                            drcRdDrcLbl == "↑";
                        }else if(drcRdDrc == "3"){
                            drcRdDrcLbl == "↓";
                        }

                        frontKoreanRoadNm = rddrCnList[0].drcKorRn + " " + rddrCnList[0].drcRdLt+ "m " + drcRdDrcLbl;

                        }
                } catch (error) {
                    util.toast(msg.checkObject.format("이면도로명판 내용"),"error");
                }
            }

        }else if(type == "310"){
            // plqDirection = data.rddr_plqDrc;
            var prnt_ftRdLt = d.prnt_ftRdLt == null ? "" : d.prnt_ftRdLt + "M";
            frontKoreanRoadNm = d.prnt_ftKorRn + " " + prnt_ftRdLt;
            // frontKoreanRoadNm = d.prnt_ftKorRn;
            frontStartBaseMasterNo = "0";
            frontStartBaseSlaveNo = "0";
            frontEndBaseMasterNo = "0";
            frontEndBaseSlaveNo = "0";
        }

        var frontStartBaseNo = "{0}{1}".format(frontStartBaseMasterNo == "0"? "" : frontStartBaseMasterNo, (frontStartBaseSlaveNo != "0" ? '-' + frontStartBaseSlaveNo : ''));
        var frontEndBaseNo = "{0}{1}".format(frontEndBaseMasterNo == "0"? "" : frontEndBaseMasterNo, (frontEndBaseSlaveNo != "0" ? '-' + frontEndBaseSlaveNo : ''));
        
        if(type == "210" && d.rddr_afRdplqSe == "01000"){
            rnLbl = "{0}".format(
                frontKoreanRoadNm ? frontKoreanRoadNm : '도로명없음'
            )
        }else if(plqDirection == '00200'){
            rnLbl = "{0} {1} {2}".format(
                    frontStartBaseNo,
                    frontKoreanRoadNm ? frontKoreanRoadNm : '도로명없음',
                    frontEndBaseNo
                )
        }else if(plqDirection == '00100' || plqDirection == '00300'){
            rnLbl = "{0} {1} {2} {3}".format(
                    frontKoreanRoadNm ? frontKoreanRoadNm : '도로명없음',
                    frontStartBaseNo,
                    (plqDirection == '00100' ? '→' : (plqDirection == '00300' ? '↑' : '')),
                    frontEndBaseNo
                )
        }else{
            rnLbl = "{0}".format(frontKoreanRoadNm ? frontKoreanRoadNm : '도로명없음')
        }

    }else if(type == "510"){
        //시작기초번호(0-0)
        var area_stbsNo = "{0}{1}".format(d.area_stbsMn, (d.area_stbsSn != "0" ? '-' + d.area_stbsSn : ''));
        //종료기초번호(0-0)
        var area_edbsNo = "{0}{1}".format(d.area_edbsMn, (d.area_edbsSn != "0" ? '-' + d.area_edbsSn : ''));
        
        rnLbl = "←{0} {1} {2}→".format(
                    area_stbsNo,
                    d.area_areaKorRn ? d.area_areaKorRn : '도로명없음',
                    area_edbsNo
                )
        
    }else if(type == "610"){
        //기초번호(0-0)
        var bsis_ctbsNo = "{0}{1}".format(d.bsis_ctbsMn, (d.bsis_ctbsSn != "0" ? '-' + d.bsis_ctbsSn : ''));

        rnLbl = "{0} {1}".format(
            d.bsis_korRn ? d.bsis_korRn : '도로명없음',
            bsis_ctbsNo
        )

    }else if(type == "999"){

    }

    rnLbl = rnLbl == ""? "-":rnLbl;

    return rnLbl;
}
var layerStateGbn = "on";
var insertPointType = "spgf";
function newPoint(type) {
    closeDetailView();
    insertPointType = type;

    if (layerStateGbn == "on") {
        //마커지우기
        // clearSource('위치이동');

        //레이어 초기화
        removeLayers();

        //센터 포인트 찍기
        // var movingPoint_source = addMoveLayer();

        // var moveingPointFeature = new ol.Feature();
        //         moveingPointFeature.setStyle(new ol.style.Style({
        //             image: new ol.style.Circle({
        //                 radius: 10,
        //                 fill: new ol.style.Fill({
        //                     color: '#00004d'
        //                 }),
        //                 stroke: new ol.style.Stroke({
        //                     color: '#fff',
        //                     width: 2
        //                 })
        //             })
        //         }));

        // var centerPoint = new ol.geom.Point(map.getView().getCenter());
        // moveingPointFeature.setGeometry(centerPoint);
        // movingPoint_source.addFeature(moveingPointFeature);
        // if (map.getView().getZoom() < 14) {
        //     map.getView().setZoom(14);
        // }
        //범례숨김
        $(".legend").hide();
        //방위 숨김
        $(".ol-rotate").hide();
        //현위치 숨김
        $(".curPosition").hide();
        //줌되돌리기 숨김
        $(".returnZoom").hide();
        //지도초기화 숨김
        $(".refreshMap").hide();
        //거리재기 숨김
        $(".measure").hide();

        //심플팝업 초기화
        $("#popup-content").empty();
        $("#popup").hide();

        //위치마커 및 버튼 표시
        $("#newPos").show();
        //버튼영역 버튼 표시
        $(".buttonDiv").show();
        //메모초기화
        closeNewPosMemo();

        // $(".newPosition button img").attr("src","image/newPos_cancle.png");

        layerStateGbn = "off";
    } else {

        //위치마커 및 버튼 표시
        $("#newPos").hide();
        //버튼영역 숨김
        $(".buttonDiv").hide();
        //메모초기화
        closeNewPosMemo();

        var context = app.context;

        layerToggle(context);

        // $(".newPosition button img").attr("src","image/newPos_plus.png");

        layerStateGbn = "on";
    }
}

//좌표변환 후 위치이동
function moveToXyTranceProj(x,y){
    var coordinate = [x,y];
    var centerPoint = new ol.proj.transform(coordinate,sourceProjection,baseProjection);
    
    setPosition(centerPoint);
    // map.getView().setCenter(cood);
    var zoom = map.getView().getZoom();
    if (zoom < 14) {
        map.getView().setZoom(14);
    }
    map.updateSize();

    toggleDetailView();
}   