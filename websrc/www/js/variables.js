
var PUSH_TYPE = {
    QNA: "qna",
    MINWON: "minwon"
}

var URLs = {
    "versionLink": { svcNm: "qVersion" },
    "updateCodeLink": { svcNm: "sCmCd" },
    "selectCodeLink": { svcNm: "sCmCode" },
    "helpDeskListLink": { svcNm: "sQnABoard" },
    "helpdeskReplylink": { svcNm: "replyQnABoard" },
    //기초조사
    "addresslink": { svcNm: "vADRDC" },
    "addresslistlink": { svcNm: "sADRDC" },
    "insertBaseResearch": { svcNm: "iBSEX" },
    //기초조사 end
    //점검
    "researchListLink": { svcNm: "sResearch" },
    // "updateResearchWorkDate": {svcNm: "uResearchWorkDate"},
    "insertResearchState": {svcNm: "iResearchState"},
    "insertResearchStateEtc": {svcNm: "iResearchStateEtc"},
    //점검 end
    "roadsignlink": { svcNm: "vSPGF" },
    "buildsignlink": { svcNm: "vSPBD" },//사용안함
    "buildSelectlink": { svcNm: "vBULD" },
    "spotSelectlink": { svcNm: "vSPOT" },
    "entrclink": { svcNm: "vENTRC" },
    "nmtglink": { svcNm: "vNMTG" },
    "updateFacilityInfo": { svcNm: "uSPGF" },
    "updateBuildNumberInfo": { svcNm: "uSPBD" },
    "updateBuilingInfo": { svcNm: "uBULD" },
    "updateSpotInfo": { svcNm: "uSPOT" },
    "selectLocLink":{svcNm : "sLOC"},
    "selectEntrcLink":{svcNm : "sEntrc"},
    
    "mapServiceLink": { svcNm: "mapService" },
    "minwonServiceLink": { svcNm: "eaiService" },

    "photoFileInfo": { svcNm: "sPhoto"},

    
    "authLink": { svcNm: "auth" },
    "sggInfo" : { svcNm: "vAdmInfo"},
    "updateWorkDate" : {svcNm: "uWorkDate"},
    "updateSpgfImg" : {svcNm: "uSPGFImg"},

    //조사자정보 조회 (서비스명 변경해야됨)
    "searchUserSelectLink" :{svcNm:"sKAISUR"},
    //안내시설물 위치이동 조회
    "selectLocationMoveSpgfLink" :{svcNm:"sLocMoveSpgf"},
    //건물번호판 위치이동 조회
    "selectLocationMoveSpbdNmgtLink" :{svcNm:"sLocMoveSpbdNmgt"},
    //안내시설물 위치 이동 및 신규 입력
    "moveingPointSpgf":{svcNm: "iLocSpgf"},
    //건물번호판 위치 이동 입력
    "moveingPointSpbdNmtg":{svcNm: "iLocSpbdNmtg"},
    //조사자 목록 조회
    "selectResearcherInfo":{svcNm: "sResearcher"},

    //시설물 변경 내용 임시저장
    "insertSpgfChange":{svcNm: "iSPGFChg"},
    //시설물 변경 내용 조회
    "selectSpgfChange":{svcNm: "vSPGFChg"},
    //시설물 변경 내용 임시저장
    "insertSpbdChange":{svcNm: "iSPBDChg"},
    //시설물 변경 내용 조회
    "selectSpbdChange":{svcNm: "vSPBDChg"},
    //시설물 변경 내용 삭제
    "deleteUpdtChange":{svcNm: "dUpdtChg"},

    //시군구 조회
    "selectSigList":{svcNm: "sSigList"},
    //읍면동 조회
    "selectEmdList":{svcNm: "sEmdList"},
    //읍면동(행정동) 조회
    "selectHangEmdList":{svcNm: "sHangEmdList"},

    //좌표조회(시군구)
    "coodiMapSvc":{svcNm: "coodiMapSvc"},

    //좌표조회(중앙)
    "coodiMapSvcCenter":{svcNm: "coodiMapSvcCenter"},
    //지점번호 정보조회
    "selectSppnPanInfo":{svcNm: "selectSppnPanInfo"},
    //지점번호 정보 리스트 조회
    "selectSppnPanelList":{svcNm: "selectSppnPanelList"},
    //사물주소 정보조회
    "selectSpotObjInfo":{svcNm: "selectSpotObjInfo"},
    //둔치주차장 정보조회
    "selectSpotRiverPkInfo":{svcNm: "selectSpotRiverPkInfo"},
    //지진옥외대피소 정보조회
    "selectSpotEqOutInfo":{svcNm: "selectSpotEqOutInfo"},
    //택시승강장 정보조회
    "selectSpotTaxiStInfo":{svcNm: "selectSpotTaxiStInfo"},

    //교차로 상세정보 조회
    "selectCrsrdp":{svcNm: "selectCrsrdp"},
    //교차로 정보 수정
    "updateCrsrdp":{svcNm: "updateCrsrdp"},
    
    getURL: function (srcurl, jsondata) {

        var hasparam = srcurl.search('=') > -1;

        var params = "";
        for (var key in jsondata) {
            if (hasparam || params != "")
                params += '&';
            params += key;
            params += '=';
            params += jsondata[key];
        }
        if (params != "" && hasparam == false) {
            params = "?" + params;
        }

        return srcurl + params;
    },
    postURL: function (srcUrl, jsonData) {
        var params = $.extend({}, srcUrl, jsonData);
        return params;
    },
    realPath: function () {
        try {
            return cordova.file.applicationDirectory + "www/";
        } catch (e) {
            return '';
        }
    }
};

var pages = {
    "indexpage": { link: function () { return URLs.realPath() + "index.html"; }, div: "#index_page" },
    "workpage": { link: function () { return URLs.realPath() + "work.html"; }, div: "#work_page" },
    "map": { link: function () { return URLs.realPath() + "map.html"; }, div: "#mapview_page" },
    "map2": { link: function () { return URLs.realPath() + "map2.html"; }, div: "#map2view_page" },

    "detail_road": { link: function () { return URLs.realPath() + "popRoad.html"; }, div: "#roadView_page" },
    "detail_road_rddr": { link: function () { return URLs.realPath() + "popRoadRddr.html"; }, div: "#roadRddrView_page" },
    "detail_road_prnt": { link: function () { return URLs.realPath() + "popRoadPrnt.html"; }, div: "#roadPrntView_page" },
    "detail_area": { link: function () { return URLs.realPath() + "popArea.html"; }, div: "#areaView_page" },
    "detail_base": { link: function () { return URLs.realPath() + "popBase.html"; }, div: "#baseView_page" },
    "detail_buld": { link: function () { return URLs.realPath() + "popBuild.html"; }, div: "#buildView_page" },
    "detail_entrc": { link: function () { return URLs.realPath() + "popEntrc.html"; }, div: "#entrcView_page" },
    "detail_spot": { link: function () { return URLs.realPath() + "popSpot.html"; }, div: "#spotView_page" },
    "detail_sppn": { link: function () { return URLs.realPath() + "popSppnPan.html"; }, div: "#sppnView_page" },
    
    "detail_spotAotRiverPk": { link: function () { return URLs.realPath() + "popSpotRiverPk.html"; }, div: "#popSpotRiverPk_page" },
    "detail_spotAotEqOut": { link: function () { return URLs.realPath() + "popSpotEqOut.html"; }, div: "#popSpotEqOut_page" },
    "detail_spotAotTaxiSt": { link: function () { return URLs.realPath() + "popSpotTaxiSt.html"; }, div: "#popSpotTaxiSt_page" },

    "detail_adrdc": { link: function () { return URLs.realPath() + "popAdrdc.html"; }, div: "#baseResearch_page" },
    "detail_adrdcList": { link: function () { return URLs.realPath() + "popAdrdcList.html"; }, div: "#detailAddress_page" },
    "detail_researchList": { link: function () { return URLs.realPath() + "popResearchList.html"; }, div: "#researchList_page" },

    "minwonListPage": { link: function () { return URLs.realPath() + "minwon.html"; }, div: "#minwonList_page" },
    "detailAddressListPage": { link: function () { return URLs.realPath() + "detailAddress.html"; }, div: "#detailAddress_page" },
    "baseResearchPage": { link: function () { return URLs.realPath() + "baseResearch.html"; }, div: "#baseResearch_page" },
    "detailview": { link: function () { return URLs.realPath() + "detailview.html"; }, div: "#detailview_page" },
    "detailaddress": { link: function () { return URLs.realPath() + "addressview.html"; }, div: "#addressview_page" },
    "imageviewer": { link: function () { return URLs.realPath() + "imageviewer.html"; }, div: "#imageviewer_page" },
    "writereplypage": { link: function () { return URLs.realPath() + "writereply.html"; }, div: "#write_reply_page" },
    "memolistpage": { link: function () { return URLs.realPath() + "memolist.html"; }, div: "#memolist_page" },
    "baseConfigPage": { link: function () { return URLs.realPath() + "baseConfig.html"; }, div: "#baseConfig_page" },
    "locationManageSpgfPage": { link: function () { return URLs.realPath() + "popLocManageSpgfList.html"; }, div: "#locationManageSpgf_page" },
    "locationManageSpbdNmtgPage": { link: function () { return URLs.realPath() + "popLocManageSpbdNmtgList.html"; }, div: "#locationManageSpbdNmtg_page" },
    "locationManagePage": { link: function () { return URLs.realPath() + "popLocManageList.html"; }, div: "#locationManage_page" },
    "sppnList": { link: function () { return URLs.realPath() + "sppnList.html"; }, div: "#sppnList_page" },

    "popCrsrdpPage": { link: function () { return URLs.realPath() + "popCrsrdp.html"; }, div: "#crsrdpView_page" },
    
};

//var SSO = {
//    ADDRESS_HOME: "address_home",
//    ADDRESS_WORK: "address_work",
//    BUSI_CODE: "busiCode",
//    BUSI_NAME: "busiName",
//    COMPANY: "company",
//    COMPANY_CODE: "companyCode",
//    COUNTRY: "country",
//    DEPARTMENT: "department",
//    DEPARTMENT_NUMBER: "departmentNumber",
//    E_MAIL: "email",
//    EMPLOYEE_NUMBER: "employeeNumber",
//    EPID: "epid",
//    FAMILYNAME: "familyname",
//    FULLNAME: "fullname",
//    GENDER: "gender",
//    GIVENNAME: "givenname",
//    GRADE_NAME: "gradeName",
//    GRADE_OR_TITLE: "gradeOrTitle",
//    ISBLUE: "isBlue",
//    ISNATIVE: "isNative",
//    JOB: "job",
//    JOB_NAME: "jobName",
//    MAIL_HOST: "mailHost",
//    NICKNAME: "nickname",
//    POSITION: "position",
//    PREFERRED_LANGUAGE_PRESENTATION: "preferredLanguagePresentation",
//    REGION_CODE: "resionCode",
//    SECURITY_LEVEL: "securityLevel",
//    SUBORG_CODE: "suborgcode",
//    SUBORG_NAME: "suborgname",
//    TELEPHONE_FAX: "telephone_fax",
//    TELEPHONE_HOME: "telephone_home",
//    TELEPHONE_INTERNET: "telephoneInternet",
//    TELEPHONE_MOBILE: "telephone_mobile",
//    TELEPHONE_WORK: "telephone_work",
//    TITLE_NUMBER: "titleNumber",
//    USER_LEVEL: "userLevel",
//    USER_STATUS: "userStatus",
//    USERID: "userId",
//    All: [
//        "nickname"
//        ,"fullname"
//        ,"familyname"
//        ,"givenname"
//        ,"telephone_home"
//        ,"telephone_work"
//        ,"telephone_mobile"
//        ,"telephone_fax"
//        ,"email"
//        ,"address_home"
//        ,"address_work"
//        ,"company"
//        ,"department"
//        ,"position"
//        ,"employeeNumber"
//        ,"departmentNumber"
//        ,"companyCode"
//        ,"isBlue"
//        ,"securityLevel"
//        ,"epid"
//        ,"gender"
//        ,"titleNumber"
//        ,"userId"
//        ,"mailHost"
//        ,"telephoneInternet"
//        ,"gradeOrTitle"
//        ,"country"
//        ,"preferredLanguagePresentation"
//        ,"userLevel"
//        ,"userStatus"
//        ,"isNative"
//        ,"busiCode"
//        ,"busiName"
//        ,"suborgcode"
//        ,"suborgname"
//        ,"gradeName"
//        ,"resionCode"
//        ,"job"
//        ,"jobName"
//    ]
//};

var CODE_GROUP = [];
//****** 도로안내시설물 *******
//안내시설형식
CODE_GROUP["GDFTY_FOM"] = "GFTY012";
//도로시설물 구분
CODE_GROUP["RDFTY_SE"] = "GFTY003";
//설치유형
CODE_GROUP["INSTL_SE"] = "GFTY004";
//설치지점
CODE_GROUP["INS_SPO_CD"] = "GFTY015";
//교차로유형
CODE_GROUP["INS_CRS_CD"] = "GFTY612";
//사용대상
CODE_GROUP["USE_TRGET"] = "GFTY013";
//안내시설방향
CODE_GROUP["PLQ_DRC"] = "GFTY014";
//제2외국어여부
CODE_GROUP["SCFGG_MKTY"] = "GFTY019";
//언어1
CODE_GROUP["SCFGG_ULA1"] = "GFTY020";
//안내시설상태코드
CODE_GROUP["DEL_STT_CD"] = "GFTY613";
//점검상태코드
CODE_GROUP["RC_STT_CD"] = "GFTY614";
//지점번호판 점검코드
CODE_GROUP["RC_STT_CD_2"] = "GFTY623";
//인쇄방식
CODE_GROUP["PRT_TY"] = "GFTY005";
//재질
CODE_GROUP["GDFTY_QLT"] = "GFTY011";
//앙면여부
CODE_GROUP["BDRCL_AT"] = "GFTY017";
//도로안내시설 구분
CODE_GROUP["RD_GDFTY_SE"] = "GFTY002";


//****** 도로명판 *******
//도로명판 규격
CODE_GROUP["RDPQ_GD_SD"] = "GFTY110";
CODE_GROUP["RDPQ_GD_SD_2"] = "GFTY112";
//****** 이면도로용 도로명판 *******
//이면도로용 도로명판 유형
CODE_GROUP["AF_RDPLQ_SE"] = "GFTY200";
//이면도로갯수
CODE_GROUP["AF_RD_CD"] = "GFTY201";
//이면도로 도로명판 방향표시
CODE_GROUP["DRC_RD_DRC"] = "GFTY202";
//이면도로 도로명판 위치구분
CODE_GROUP["PLQ_LC_SE"] = "GFTY203";
//규격
CODE_GROUP["RDDR_GD_SD"] = "GFTY210";
//****** 예고용 도로명판 *******
//규격
CODE_GROUP["PRNT_GD_SD"] = "GFTY310";

//****** 지역안내판 *******
//지역안내판 광고에따른분류
CODE_GROUP["ADVRTS_CD"] = "CMMN131";
//지역안내판 규격
CODE_GROUP["AREA_GD_SD"] = "GFTY510";
//지역안내판 설치장소
CODE_GROUP["INS_PLC"] = "GFTY501";


//****** 기초번호판 *******
//설치장소 구분
CODE_GROUP["ITLPC_SE"] = "GFTY600";
//설치시설물
CODE_GROUP["INSTL_FTY"] = "GFTY601";
//곡면분류
CODE_GROUP["PLANE_CD"] = "GFTY611";
//기초번호판 규격
CODE_GROUP["BSIS_GD_SD"] = "GFTY610";
//기초번호판 표기방법
CODE_GROUP["BSIS_MTHD"] = "GFTY602";
//기초번호판 안내시설형식
CODE_GROUP["BSIS_GDFTY_FOM"] = "GFTY009";

//****** 건물번호판 *******
//형태
CODE_GROUP["BUL_NMT_TY"] = "CMMN056";
//유형
CODE_GROUP["BUL_NMT_SE"] = "CMMN036";
//용도
CODE_GROUP["BUL_NMT_PR"] = "CMMN056";
//규격
CODE_GROUP["BUL_NMT_CD"] = "CMMN057";
//제작유형
CODE_GROUP["BUL_MNF_CD"] = "CMMN024";
//재질
CODE_GROUP["BUL_NMT_QL"] = "CMMN003";
//****** 건물정보 *******
//건물용도코드
CODE_GROUP["BDTYP_CD"] = "CMMN038";
//건물종속구분
CODE_GROUP["BUL_DPN_SE"] = "CMMN046";

//****** 점검 *******
CODE_GROUP["TRG_GBN"] = "GFTY615";



CODE_GROUP["ISLGN_YN"] = "GFTY016";


CODE_GROUP["BULD_SE_CD"] = "CMMN017";

//건물번호판
CODE_GROUP["BUL_NMT_TY"] = "CMMN056";
CODE_GROUP["BUL_NMT_LO"] = "CMMN068";
CODE_GROUP["LGHT_CD"] = "CMMN130";

//****** 지점번호판 *******
//지점번호판 설치기관코드
CODE_GROUP["FCLTYLC_CD"] = "SCPN002";
CODE_GROUP["INSTT_CD"] = "SCPN003";
CODE_GROUP["INSTT_CD"] = "SCPN003";

//****** 교차로 *******
//교차로 유형
CODE_GROUP["CRSRD_TYCD"] = "CMMN127";
//교차로 구분코드
CODE_GROUP["CRSRD_SE"] = "CMMN071";
//교차로 사용대상 여부
CODE_GROUP["CRS_USE_YN"] = "CMMN135";
//교차로 사용안함 코드
CODE_GROUP["NOT_USE_CD"] = "CMMN284";

//보행자용 소요량(행안부 기준)
CODE_GROUP["REQAMT_P"] = "CMMN132";
//차량용 소요량(행안부 기준)
CODE_GROUP["REQAMT_C"] = "CMMN133";