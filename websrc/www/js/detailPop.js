 $(function(){
            
        })
        
        function closeDetailView(){
            $("#detailView").popup("close", { transition: "slideup" });
        }

        function closeDataPop(){
            $("#dataTitle").empty();
            $("#row").empty();
            $("#dataPop").hide();
        }

        var popID;
        var popColume;
        function openDataIdPop(id){
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
                case 'rdpqGdSd':
                    //제목
                    var titleText = '규격';
                    setTitle(titleText);
                    
                    //라디오버튼 구성
                    popColume = 'RDPQ_GD_SD';
                    createRadioButton();
                    break;            
                    
            }

            //팝업열기
            $("#dataPop").show();

                // case 'instSpotCd'://도로명
                //     //국문
                //     var frontKoreanRoadNm = $("#frontKoreanRoadNm").text();
                //     $("#frontKoreanRoadNm_new").val(frontKoreanRoadNm);

                //     //로마
                //     var frontRomeRoadNm = $("#frontRomeRoadNm").text();
                //     $("#frontRomeRoadNm_new").val(frontRomeRoadNm);
                //     break;
                // case 'isLgnTnYnPop'://설치상태
                    
                //     var isLgnYn = $("#isLgnYn").val();
                //     $("#isLgnYn_new").val(isLgnYn);

                //     break;
                // }
            

             

        }

        // function dataSendParent(){
        //     switch(popID){
        //         case 'instSe': //설치유형
                   
        //             radioDataSendParent();

        //             break;
        //         case 'instSpotCd': //설치지점
                  
        //             radioDataSendParent();

        //             break;
        //         case 'instCrossCd': //교차로유형
                   
        //             radioDataSendParent();

        //             break;    
        //         //  case 'roadNmDataPop'://도로명
        //         //     //국문
        //         //     var frontKoreanRoadNm_new = $("#frontKoreanRoadNm_new").val();
        //         //     $("#frontKoreanRoadNm").text(frontKoreanRoadNm_new);
                    

        //         //     //로마
        //         //     var frontRomeRoadNm_new = $("#frontRomeRoadNm_new").val();
        //         //     $("#frontRomeRoadNm").text(frontRomeRoadNm_new);
        //         //     break;
        //     }

           

        //     //팝업닫기
        //     $("#dataPop").hide();
        // }

        function radioDataSendParent(){
            var newRadioVal = $("input:radio[name='"+popID+"']:checked").val();
                   
            var codeList = app.codeMaster[CODE_GROUP[popColume]];
            $("#"+popID+"Lbl").text(codeList[newRadioVal]);
            
            $("#"+popID).text(newRadioVal);

            //팝업닫기
            $("#dataPop").hide();
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

            var values = $("#"+popID).text();

            $('input:radio[name='+popID+']:input[value=' + values + ']').attr("checked", true);
        }

        function setTitle(titleText){
           
            $("#dataTitle").text(titleText);

        }