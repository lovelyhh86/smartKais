
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
    "updateFacilityInfo": { svcNm: "uSPGF" },

    "updateAddressInfo": { svcNm: "uBSEX" },
    "mapServiceLink": { svcNm: "mapService" },
    "minwonServiceLink": { svcNm: "eaiService" },

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
CODE_GROUP["USE_TRGET"] = "GFTY013";
CODE_GROUP["INS_SPO_CD"] = "GFTY015";
CODE_GROUP["ISLGN_YN"] = "GFTY016";
CODE_GROUP["GDFTY_FOM"] = "GFTY012";
CODE_GROUP["PLQ_DRC"] = "GFTY014";

