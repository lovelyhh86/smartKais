 $(function(){
            
        })
        
        function closeDetailView(){
            $("#detailView").popup("close", { transition: "slideup" });
        }

        // function closeDataPop(){
        //     $("#dataTitle").empty();
        //     $("#row").empty();
        //     $("#radioDataPop").hide();
        // }

        var popID;
        var popColume;
        function openDataIdPop(id){
            closeDataPop();
            $("#dataForm").empty();
            popID = id;
            switch(id){
                case 'instSe':
                    
                    //제목
                    var titleText = '설치유형';
                    setTitle(titleText);
                    
                    //라디오버튼 구성
                    popColume = 'INSTL_SE';
                    createRadioButton();
                    break;

                case 'instSpotCd':
                    //제목
                    var titleText = '설치지점';
                    setTitle(titleText);
                    
                    //라디오버튼 구성
                    popColume = 'INS_SPO_CD';
                    createRadioButton();
                    break;
                case 'instCrossCd':
                    //제목
                    var titleText = '교차로유형';
                    setTitle(titleText);
                    
                    //라디오버튼 구성
                    popColume = 'INS_CRS_CD';
                    createRadioButton();
                    break;   
                case 'useTarget':
                    //제목
                    var titleText = '사용대상';
                    setTitle(titleText);
                    
                    //라디오버튼 구성
                    popColume = 'USE_TRGET';
                    createRadioButton();
                    break;
                case 'plqDirection':
                    //제목
                    var titleText = '안내시설 방향';
                    setTitle(titleText);
                    
                    //라디오버튼 구성
                    popColume = 'PLQ_DRC';
                    createRadioButton();
                    break;  
                case 'scfggMkty':
                    //제목
                    var titleText = '제2외국어여부';
                    setTitle(titleText);
                    
                    //라디오버튼 구성
                    popColume = 'SCFGG_MKTY';
                    createRadioButton();
                    break;       
                case 'scfggUla1':
                    //제목
                    var titleText = '언어1';
                    setTitle(titleText);
                    
                    //라디오버튼 구성
                    popColume = 'SCFGG_ULA1';
                    createRadioButton();
                    break;
                case 'scfggUla2':
                    //제목
                    var titleText = '언어2';
                    setTitle(titleText);
                    
                    //라디오버튼 구성
                    popColume = 'SCFGG_ULA1';
                    createRadioButton();
                    break;  
                case 'area_advrtsCd':
                    //제목
                    var titleText = '광고여부에따른 분류';
                    setTitle(titleText);
                    
                    //라디오버튼 구성
                    popColume = 'ADVRTS_CD';
                    createRadioButton();
                    break;    
                case 'rdpqGdSd':
                    //제목
                    var titleText = '규격'; //도로명판
                    setTitle(titleText);
                    
                    //라디오버튼 구성
                    popColume = 'RDPQ_GD_SD';
                    createRadioButtonCustom();
                    break;
                case 'area_areaGdSd':
                    //제목
                    var titleText = '규격'; // 지역안내판
                    setTitle(titleText);
                    
                    //라디오버튼 구성
                    popColume = 'AREA_GD_SD';
                    createRadioButton();
                    break;
                case 'bsis_bsisGdSd':
                    //제목
                    var titleText = '규격'; // 기초번호판
                    setTitle(titleText);
                    
                    //라디오버튼 구성
                    popColume = 'BSIS_GD_SD';
                    createRadioButton();
                    break;    
                case 'bsis_planeCd':
                    //제목
                    var titleText = '곡면분류';
                    setTitle(titleText);
                    
                    //라디오버튼 구성
                    popColume = 'ITLPC_SE';
                    createRadioButton();
                    break;
                case 'buldNmtSe':
                    //제목
                    var titleText = '유형'; //건물번호판
                    setTitle(titleText);
                    
                    //라디오버튼 구성
                    popColume = 'BUL_NMT_SE';
                    createRadioButton();
                    break;
                case 'buldNmtPurpose':
                    //제목
                    var titleText = '용도'; //건물번호판
                    setTitle(titleText);
                    
                    //라디오버튼 구성
                    popColume = 'BUL_NMT_PR';
                    createRadioButton();
                    break;
                case 'buldNmtCd':
                    //제목
                    var titleText = '규격'; //건물번호판
                    setTitle(titleText);
                    
                    //라디오버튼 구성
                    popColume = 'BUL_NMT_CD';
                    createRadioButton();
                    break;   
                case 'buldMnfCd':
                    //제목
                    var titleText = '제작유형'; //건물번호판
                    setTitle(titleText);
                    
                    //라디오버튼 구성
                    popColume = 'BUL_MNF_CD';
                    createRadioButton();
                    break;    
                case 'buldNmtMaterial':
                    //제목
                    var titleText = '제질'; //건물번호판
                    setTitle(titleText);
                    
                    //라디오버튼 구성
                    popColume = 'BUL_NMT_QL';
                    createRadioButton();
                    break;     

                                         
            }

            //팝업열기
            $("#radioDataPop").show();
        }

        function radioDataSendParent(){
            var newRadioVal = $("input:radio[name='"+popID+"']:checked").val();
                   
            var codeList = app.codeMaster[CODE_GROUP[popColume]];
            
            // 수정된 새로운라벨
            $("#"+popID+"Lbl_new").text(codeList[newRadioVal]);
            $("#"+popID+"Lbl_new").show();
            
            //수정시 필요한 코드
            $("#"+popID+"_new").text(newRadioVal);

            //이전 라벨 숨김
            $("#"+popID+"Lbl").hide();

            //팝업닫기
            $("#radioDataPop").hide();
        }

        function openCustomPop(type){
            closeDataPop();
            switch(type){
                //단가
                case 'gdftyUnitPrice':
                    var gdftyUnitPrice = $("#gdftyUnitPrice_new").text() == "" ? $("#gdftyUnitPrice").text():$("#gdftyUnitPrice_new").text();
                    $("#gdftyUnitPrice_fix").val(gdftyUnitPrice);
                    $("#"+type+"_pop").show();
                break;
                //규격(가로*새로*두께)
                case 'gdftyWVT':
                    var gdftyWide = $("#gdftyWide_new").text() == "" ? $("#gdftyWide").text():$("#gdftyWide_new").text();
                    var gdftyVertical = $("#gdftyVertical_new").text() == "" ? $("#gdftyVertical").text():$("#gdftyVertical_new").text();
                    var gdftyThickness = $("#gdftyThickness_new").text() == "" ? $("#gdftyThickness").text():$("#gdftyThickness_new").text();

                    $("#gdftyWide_fix").val(gdftyWide);
                    $("#gdftyVertical_fix").val(gdftyVertical);
                    $("#gdftyThickness_fix").val(gdftyThickness);

                    $("#"+type+"_pop").show();
                break;
                //지역안내판 광고내용
                case 'area_advCn':
                    var area_advCn = $("#area_advCn_new").text() == "" ? $("#area_advCn").text():$("#area_advCn_new").text();
                    $("#area_advCn_fix").val(area_advCn);
                    $("#"+type+"_pop").show();
                break;
                //지역안내판 기타내용
                case 'area_etcCn':
                    var area_etcCn = $("#area_etcCn_new").text() == "" ? $("#area_etcCn").text():$("#area_etcCn_new").text();
                    $("#area_etcCn_fix").val(area_etcCn);
                    $("#"+type+"_pop").show();
                break;
            }

        }

        function openCustomPop2(type){
            switch(type){
                case 'frontStartBaseNo':
                    var startBaseMasterNo = $("#frontStartBaseMasterNo_new").text() == "" ? $("#frontStartBaseMasterNo").text(): $("#frontStartBaseMasterNo_new").text();
                    var startBaseSlaveNo = $("#frontStartBaseSlaveNo_new").text() == "" ? $("#frontStartBaseSlaveNo").text(): $("#frontStartBaseSlaveNo_new").text();
                    
                    $("#frontStartBaseMasterNo_fix").val(startBaseMasterNo);
                    $("#frontStartBaseSlaveNo_fix").val(startBaseSlaveNo);

                    // $("#frontStartBaseNo_pop").show();
                break;
                case 'frontEndBaseNo':
                    var startBaseMasterNo = $("#frontEndBaseMasterNo_new").text() == "" ? $("#frontEndBaseMasterNo").text(): $("#frontEndBaseMasterNo_new").text();
                    var startBaseSlaveNo = $("#frontEndBaseSlaveNo_new").text() == "" ? $("#frontEndBaseSlaveNo").text(): $("#frontEndBaseSlaveNo_new").text();
                    
                    $("#frontEndBaseMasterNo_fix").val(startBaseMasterNo);
                    $("#frontEndBaseSlaveNo_fix").val(startBaseSlaveNo);

                    // $("#frontStartBaseNo_pop").show();
                break;

            }
            $("#"+type+"_pop").show();

        }

        function textDataSendParent(type){
            switch(type){
                case 'gdftyUnitPrice'://단가
                    
                    var gdftyUnitPrice_fix = $("#gdftyUnitPrice_fix").val();
                    $("#"+type+"_new").text(gdftyUnitPrice_fix);
                    $("#"+type).hide();
                    $("#"+type+"_new").show();

                    break;
                case 'gdftyWVT'://규격(가로*새로*두께)
                    
                    var gdftyWide_fix = $("#gdftyWide_fix").val();
                    var gdftyVertical_fix = $("#gdftyVertical_fix").val();
                    var gdftyThickness_fix = $("#gdftyThickness_fix").val();

                    $("#gdftyWide_new").text(gdftyWide_fix);
                    $("#gdftyVertical_new").text(gdftyVertical_fix);
                    $("#gdftyThickness_new").text(gdftyThickness_fix);

                    var gdftyWVT_new = "{0}*{1}*{2}".format(gdftyWide_fix,gdftyVertical_fix,gdftyThickness_fix);

                    $("#gdftyWVT_new").text(gdftyWVT_new);

                    break;
                case 'area_advCn'://지역안내판 광고내용
                    
                    var area_advCn_fix = $("#area_advCn_fix").val();
                    $("#"+type+"_new").text(area_advCn_fix);
                    $("#"+type).hide();
                    $("#"+type+"_new").show();

                    break;
                case 'area_etcCn'://지역안내판 기타내용
                    
                    var area_etcCn_fix = $("#area_etcCn_fix").val();
                    $("#"+type+"_new").text(area_etcCn_fix);
                    $("#"+type).hide();
                    $("#"+type+"_new").show();

                    break;
                }
                
            $("#"+type).hide();
            $("#"+type+"_new").show();
            $("#"+type+"_pop").hide();
        }
        function textDataSendParent2(baseNo, id1, id2){
            var startBaseMasterNo_fix = $("#"+id1+"_fix").val();
            var startBaseSlaveNo_fix = $("#"+id2+"_fix").val();

            var frontStartBaseNo = "{0} - {1}";
            var baseNoText = "";

            baseNoText = frontStartBaseNo.format(startBaseMasterNo_fix,startBaseSlaveNo_fix);


            $("#"+baseNo+"_new").text(baseNoText);

            $("#"+id1+"_new").text(startBaseMasterNo_fix);
            $("#"+id2+"_new").text(startBaseSlaveNo_fix);
            
            $("#"+baseNo).hide();
            $("#"+baseNo+"_new").show();
            $("#"+baseNo+"_pop").hide();

        }

        function closeDataPop(){
            $(".dataWrap").hide()
        }

        function createRadioButton(){
            var appendText = ''; 
            var cellText = '';
            var strText = '';

            var dataForm = $("#dataForm");

            var targetRow = "<div class='row'>{0}</div>"
            var dataCell = "<div class='cell auto'>{0}</div>";
            var InputRadio = '<div class="inputRadio"><input type="radio" name="{0}" value="{1}"></div>';
            var radioSpen = '<span class="label">{0}</span>';

            var checkedValue = $("#"+popID).text();
            var codeList = app.codeMaster[CODE_GROUP[popColume]];

            for(var c in codeList){
                if(c != "GroupNm"){

                    strText += InputRadio.format(popID,c);
                    strText += radioSpen.format(codeList[c]);
                    cellText += dataCell.format(strText);
                    
                    appendText = targetRow.format(cellText);
                    dataForm.append(appendText)
                    appendText = ''; 
                    cellText = '';
                    strText = '';
                }
            }
            
            var values = $("#"+popID+"_new").text() == "" ? $("#"+popID).text() :$("#"+popID+"_new").text();

            if(values != ""){
                $('input:radio[name='+popID+']:input[value=' + values + ']').attr("checked", true);
            }
        }

        function createRadioButtonCustom(){
            var appendText = ''; 
            var cellText = '';
            var strText = '';

            var dataForm = $("#dataForm");
            //사용대상에 따른 분류
            var type = $("#useTarget_new").text() == "" ? $("#useTarget").text() : $("#useTarget_new").text();

            var targetRow = "<div class='row'>{0}</div>"
            var dataCell = "<div class='cell auto'>{0}</div>";
            var InputRadio = '<div class="inputRadio"><input type="radio" name="{0}" value="{1}"></div>';
            var radioSpen = '<span class="label">{0}</span>';

            var checkedValue = $("#"+popID).text();
            var codeList = app.codeMaster[CODE_GROUP[popColume]];

            for(var c in codeList){
                if(c != "GroupNm"){
                    if(c.charAt(1) == type.charAt(1)){

                        strText += InputRadio.format(popID,c);
                        strText += radioSpen.format(codeList[c]);
                        cellText += dataCell.format(strText);
                        
                        appendText = targetRow.format(cellText);
                        dataForm.append(appendText)
                        appendText = ''; 
                        cellText = '';
                        strText = '';

                    }

                }
            }
            var values = $("#"+popID+"_new").text() == "" ? $("#"+popID).text() :$("#"+popID+"_new").text();

            $('input:radio[name='+popID+']:input[value=' + values + ']').attr("checked", true);
        }

        function setTitle(titleText){
           
            $("#dataTitle").text(titleText);

        }

        function refresh(){
            if (confirm('시설물 정보를 원래대로 되돌리시겠습니까?') == true){
                $("p[id*='_new']").text('');
                $("p[id*='_new']").hide();
                
                $("p[name*='oldLbl']").show();
            }
        }

        function submit(type){

            if (confirm('시설물 정보를 변경하시겠습니까?') == true){
                   var commomParams = {};
                    var sendParams = {};
                    var sn = $("#sn").text();
                    var sigCd = app.info.sigCd;
                    var workId = app.info.opeId;
                    
                    /** 공통 */
                    //설치지점
                    var instSpotCd_new = $("#instSpotCd_new").text();
                    //교차로유형
                    var instCrossCd_new = $("#instCrossCd_new").text();
                    //사용대상
                    var useTarget_new = $("#useTarget_new").text();
                    //안내시설방향
                    var plqDirection_new = $("#plqDirection_new").text();
                    //제2외국어여부
                    var scfggMkty_new = $("#scfggMkty_new").text();
                    //언어1
                    var scfggUla1_new = $("#scfggUla1_new").text();
                    //언어2
                    var scfggUla2_new = $("#scfggUla2_new").text();
                    //규격(가로)
                    var gdftyWide_new = $("#gdftyWide_new").text();
                    //규격(세로)
                    var gdftyVertical_new = $("#gdftyVertical_new").text();
                    //규격(두께)
                    var gdftyThickness_new = $("#gdftyThickness_new").text();
                    //단가
                    var gdftyUnitPrice_new = $("#gdftyUnitPrice_new").text();

                    commomParams = $.extend({}, {
                        
                        svcNm: 'uSPGF',
                        sn: sn,
                        sigCd: sigCd,
                        
                        // checkType: '01',
                        // checkUserNm: app.info.opeNm,
                        checkDate: util.getToday(),
                        workId: workId,

                        instSpotCd: instSpotCd_new,
                        instCrossCd: instCrossCd_new,
                        useTarget: useTarget_new,
                        plqDirection: plqDirection_new,
                        scfggMkty: scfggMkty_new,
                        scfggUla1: scfggUla1_new,
                        scfggUla2: scfggUla2_new,
                        gdftyUnitPrice: gdftyUnitPrice_new,
                        gdftyWide: gdftyWide_new,
                        gdftyVertical: gdftyVertical_new,
                        gdftyThickness: gdftyThickness_new
                            
                    });

                    if(type == DATA_TYPE.RDPQ){
                        //도로명판 규격
                        var rdpqGdSd_new = $("#rdpqGdSd_new").text();
                        
                        sendParams = $.extend(commomParams, { 
                            type :type,
                            rdpqGdSd: rdpqGdSd_new
                        });

                        var link = URLs.updateFacilityInfo;
                    

                    }else if(type == DATA_TYPE.AREA){
                        //지역안내판 광고여부에따른 분류
                        var area_advrtsCd_new = $("#area_advrtsCd_new").text();
                        //지역안내판 광고내용
                        var area_advCn_new = $("#area_advCn_new").text();
                        //지역안내판 기타내용
                        var area_etcCn_new = $("#area_etcCn_new").text();
                        //지역안내판 규격
                        var area_areaGdSd_new = $("#area_areaGdSd_new").text();


                        sendParams = $.extend(commomParams, {
                            type :type, 
                            area_advrtsCd: area_advrtsCd_new,
                            area_advCn: area_advCn_new,
                            area_etcCn: area_etcCn_new,
                            area_areaGdSd: area_areaGdSd_new
                        });

                        var link = URLs.updateFacilityInfo;
                    }else if(type == DATA_TYPE.BSIS){
                        //기초번호판 곡면 분류
                        var bsis_planeCd_new = $("#bsis_planeCd_new").text();

                        sendParams = $.extend(commomParams, {
                            type :type, 
                            bsis_planeCd: bsis_planeCd_new
                        });

                        var link = URLs.updateFacilityInfo;

                    }else if(type == DATA_TYPE.ENTRC){

                        //건물번호판 유형
                        var buldNmtSe_new = $("buldNmtSe_new").text();
                        //건물번호판 용도
                        var buldNmtPurpose_new = $("buldNmtPurpose_new").text();
                        //건물번호판 규격
                        var buldNmtCd_new = $("buldNmtCd_new").text();
                        //건물번호판 제작유형
                        var buldMnfCd_new = $("buldMnfCd_new").text();
                        //건물번호판 재질
                        var buldNmtMaterial_new = $("buldNmtMaterial_new").text();

                        sendParams = $.extend(commomParams, {
                            type :type, 
                            buldNmtSe: buldNmtSe_new,
                            buldNmtPurpose: buldNmtPurpose_new,
                            buldNmtCd: buldNmtCd_new,
                            buldMnfCd: buldMnfCd_new,
                            buldNmtMaterial: buldNmtMaterial_new

                        });

                        var link = URLs.updateBuildNumberInfo;
                        
                    }

                    
                    
                    var url = URLs.postURL(link, sendParams);

                        util.postAJAX({}, url)
                            .then(function (context, rcode, results) {
                                var data = results.data;
                                console.log(data);

                                util.toast('변경사항이 적용되었습니다');

                                // $(".infoContent p").text('');

                                var detailTaget = '#detailView';
                                // type = KEY.plateType.ROAD;

                                switch(type) {
                                    case DATA_TYPE.RDPQ:
                                        url = pages.detail_road;
                                        header = "도로명판";
                                        // headerFunc = '<a href="javascript:util.camera()" id="camera" style="right: 0;float: right;margin: 0;padding: 0;color: white;">카메라</a>';

                                        break;
                                    case DATA_TYPE.AREA:
                                        url = pages.detail_area;
                                        header = "지역안내판";
                                        // headerFunc = '<a href="javascript:util.camera()" id="camera" style="right: 0;float: right;margin: 0;padding: 0;color: white;">카메라</a>';

                                        break;
                                    case DATA_TYPE.BSIS:
                                        url = pages.detail_base;
                                        header = "기초번호판";
                                        // headerFunc = '<a href="javascript:util.camera()" id="camera" style="right: 0;float: right;margin: 0;padding: 0;color: white;">카메라</a>';

                                        break;        
                                    case DATA_TYPE.ENTRC:
                                        url = pages.detail_entrc;
                                        header = "건물번호판";

                                        break;
                                }

                                $(detailTaget).load(url.link(), function() {
                                    
                                    var link = URLs.roadsignlink;
                                    MapUtil.setValues(type, link, sn);

                                })

                            });
            }

        }