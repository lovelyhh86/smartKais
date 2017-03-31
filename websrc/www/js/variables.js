
var URLs = {
    "versionLink": { svcNm: "qVersion" },
    "updateCodeLink": { svcNm: "sCmCd" },
    "helpdesklistlink": { svcNm: "sQnABoard" },
    "helpdeskReplylink": { svcNm: "replyQnABoard" },
    "addresslink": { svcNm: "vADRDC" },
    "addresslistlink": { svcNm: "sADRDC" },
    "roadsignlink": { svcNm: "vSPGF" },
    "buildsignlink": { svcNm: "vSPBD" },
    "updateFacilityInfo": { svcNm: "uSPGF" },

    "updateAddressInfo": { svcNm: "uBSEX" },
    "mapServiceLink": { svcNm: "mapService" },

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
    "addressview": { link: function () { return URLs.realPath() + "board.html"; }, div: "#bbs_page" },
    "detailview": { link: function () { return URLs.realPath() + "detailview.html"; }, div: "#detailview_page" },
    "detailaddress": { link: function () { return URLs.realPath() + "addressview.html"; }, div: "#addressview_page" },
    "imageviewer": { link: function () { return URLs.realPath() + "imageviewer.html"; }, div: "#imageviewer_page" },
    "writereplypage": { link: function () { return URLs.realPath() + "writereply.html"; }, div: "#write_reply_page" },
    "memolistpage": { link: function () { return URLs.realPath() + "memolist.html"; }, div: "#memolist_page" }
};

//var SSO = {
//    NICKNAME: "nickname",
//    FULLNAME: "fullname",
//    FAMILYNAME: "familyname",
//    GIVENNAME: "givenname",
//    TELEPHONE_HOME: "telephone_home",
//    TELEPHONE_WORK: "telephone_work",
//    TELEPHONE_MOBILE: "telephone_mobile",
//    TELEPHONE_FAX: "telephone_fax",
//    E_MAIL: "email",
//    ADDRESS_HOME: "address_home",
//    ADDRESS_WORK: "address_work",
//    COMPANY: "company",
//    DEPARTMENT: "department",
//    POSITION: "position",
//    EMPLOYEE_NUMBER: "employeeNumber",
//    DEPARTMENT_NUMBER: "departmentNumber",
//    COMPANY_CODE: "companyCode",
//    ISBLUE: "isBlue",
//    SECURITY_LEVEL: "securityLevel",
//    EPID: "epid",
//    GENDER: "gender",
//    TITLE_NUMBER: "titleNumber",
//    USERID: "userId",
//    MAIL_HOST: "mailHost",
//    TELEPHONE_INTERNET: "telephoneInternet",
//    GRADE_OR_TITLE: "gradeOrTitle",
//    COUNTRY: "country",
//    PREFERRED_LANGUAGE_PRESENTATION: "preferredLanguagePresentation",
//    USER_LEVEL: "userLevel",
//    USER_STATUS: "userStatus",
//    ISNATIVE: "isNative",
//    BUSI_CODE: "busiCode",
//    BUSI_NAME: "busiName",
//    SUBORG_CODE: "suborgcode",
//    SUBORG_NAME: "suborgname",
//    GRADE_NAME: "gradeName",
//    REGION_CODE: "resionCode",
//    JOB: "job",
//    JOB_NAME: "jobName",
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