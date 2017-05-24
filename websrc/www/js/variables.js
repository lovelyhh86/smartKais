
var PUSH_TYPE = {
    QNA: "qna",
    MINWON: "minwon"
}

var URLs = {
    "versionLink": { svcNm: "qVersion" },
    "updateCodeLink": { svcNm: "sCmCd" },
    "helpDeskListLink": { svcNm: "sQnABoard" },
    "helpdeskReplylink": { svcNm: "replyQnABoard" },
    "addresslink": { svcNm: "vADRDC" },
    "addresslistlink": { svcNm: "sADRDC" },
    "roadsignlink": { svcNm: "vSPGF" },
    "buildsignlink": { svcNm: "vSPBD" },
    "buildSelectlink": { svcNm: "vBULD" },
    "entrclink": { svcNm: "vENTRC" },
    "updateFacilityInfo": { svcNm: "uSPGF" },
    "updateBuildNumberInfo": { svcNm: "uSPBD" },

    "updateAddressInfo": { svcNm: "uBSEX" },
    "mapServiceLink": { svcNm: "mapService" },
    "minwonServiceLink": { svcNm: "eaiService" },

    "moveingPoint":{svnNm: "iSPGF"},
    "smartKaisConfimCheckLink": { svcNm: "smartKaisCnfmCk" },

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
    "workpage": { link: function () { return URLs.realPath() + "work.html"; }, div: "#work_page" },
    "map": { link: function () { return URLs.realPath() + "map.html"; }, div: "#mapview_page" },
    "map2": { link: function () { return URLs.realPath() + "map2.html"; }, div: "#map2view_page" },
    "detail_road": { link: function () { return URLs.realPath() + "popRoad.html"; }, div: "#roadView_page" },
    "detail_area": { link: function () { return URLs.realPath() + "popArea.html"; }, div: "#areaView_page" },
    "detail_base": { link: function () { return URLs.realPath() + "popBase.html"; }, div: "#baseView_page" },
    "detail_buld": { link: function () { return URLs.realPath() + "popBuild.html"; }, div: "#buildView_page" },
    "detail_entrc": { link: function () { return URLs.realPath() + "popEntrc.html"; }, div: "#entrcView_page" },
    "minwonListPage": { link: function () { return URLs.realPath() + "minwon.html"; }, div: "#minwonList_page" },
    "addressview": { link: function () { return URLs.realPath() + "board.html"; }, div: "#bbs_page" },
    "detailview": { link: function () { return URLs.realPath() + "detailview.html"; }, div: "#detailview_page" },
    "detailaddress": { link: function () { return URLs.realPath() + "addressview.html"; }, div: "#addressview_page" },
    "imageviewer": { link: function () { return URLs.realPath() + "imageviewer.html"; }, div: "#imageviewer_page" },
    "writereplypage": { link: function () { return URLs.realPath() + "writereply.html"; }, div: "#write_reply_page" },
    "memolistpage": { link: function () { return URLs.realPath() + "memolist.html"; }, div: "#memolist_page" }
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

//****** 도로명판 *******
//도로명판 규격
CODE_GROUP["RDPQ_GD_SD"] = "GFTY110";
//****** 지역안내판 *******
//지역안내판 광고에따른분류
CODE_GROUP["ADVRTS_CD"] = "CMMN131";
//지역안내판 규격
CODE_GROUP["AREA_GD_SD"] = "GFTY510";

//****** 기초번호판 *******
//설치장소 구분
CODE_GROUP["ITLPC_SE"] = "GFTY600";
//곡면분류
CODE_GROUP["PLANE_CD"] = "GFTY611";
//기초번호판 규격
CODE_GROUP["BSIS_GD_SD"] = "GFTY610";

//****** 건물번호판 *******
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





CODE_GROUP["BDRCL_AT"] = "GFTY017";
CODE_GROUP["GDFTY_FOM"] = "GFTY012";
CODE_GROUP["ISLGN_YN"] = "GFTY016";


CODE_GROUP["BULD_SE_CD"] = "CMMN017";

//건물번호판
CODE_GROUP["BUL_NMT_TY"] = "CMMN056";
CODE_GROUP["BUL_NMT_LO"] = "CMMN068";
CODE_GROUP["LGHT_CD"] = "CMMN130";