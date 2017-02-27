
var URLs = {
    //"versionchecklink" : "../www/sample/codemaster.js",


    "updateCodelink"   :  { scode : 'MF_MOI_SMART_KAIS', svcNm: "sCmCd" },
    "helpdesklistlink"   :  { scode : 'MF_MOI_SMART_KAIS', svcNm: "sQnABoard" },
    "helpdeskReplylink"   :  { scode : 'MF_MOI_SMART_KAIS', svcNm: "replyQnABoard" },
    "addresslink" :   { scode : 'MF_MOI_SMART_KAIS', svcNm: "vADRDC"},
    "addresslistlink" :   { scode : 'MF_MOI_SMART_KAIS', svcNm: "sADRDC"},
    "roadsignlink" :   { scode : 'MF_MOI_SMART_KAIS', svcNm: "vSPGF"},
    "buildsignlink" :   { scode : 'MF_MOI_SMART_KAIS', svcNm: "vSPBD"},
    "updateFacilityInfo":  { scode : 'MF_MOI_SMART_KAIS', svcNm: "uSPGF"},

    "updateAddressInfo" :  { scode : 'MF_MOI_SMART_KAIS', svcNm: "uBSEX"},
    "mapServiceLink" :  { scode : 'MF_MOI_SMART_KAIS', svcNm: "mapService"},

/*
    "helpdesklistlink"   : commonServiceURL + "qaboardlist",
    "addresslistlink" : commonServiceURL + "detailAddr",
    "addresslink" : commonServiceURL + "detailAddrBsiExm",
    "roadsignlink" : commonServiceURL + "rnGuidFclDetail",
    "buildsignlink" : commonServiceURL + "mnfDetail",

    "updateFacilityInfo": commonServiceURL + "uSPGF",
    "updateAddressInfo" : commonServiceURL + "uBSEX",

//*/
    getURL : function(srcurl,jsondata){

        var hasparam = srcurl.search('=') > -1;

        var params = "";
        for (var key in jsondata){
            if (hasparam || params != "")
                params += '&';
            params += key;
            params += '=';
            params +=  jsondata[key];
        }
        if (params != "" && hasparam == false)
        {
            params = "?" + params;
        }

        return srcurl + params;
    },
    postURL : function(srcurl,jsondata){

        var params = $.extend({},srcurl,jsondata );
       // params.data = jsondata;
       // var params = {url: srcurl, data: jsondata};
        return params;
        /*
        for (var key in jsondata){
            if ( params != "")
                params += '&';
                params += key;
                params += '=';
                params +=  jsondata[key];
        }
        //*/
        //params = JSON.stringify(jsondata);
      //  params.jsondata;
      //  return {url:srcurl, data:params};

    }
};

var pages ={
    "workpage" : {link: function () { return cordova.file.applicationDirectory +   "www/work.html"; },  div:"#work_page"},
    "map" : { link: function () { return cordova.file.applicationDirectory +   "www/map/map.html"; },  div:"#mapview_page" },
    "addressview" : {link: function () { return cordova.file.applicationDirectory +   "www/board.html"; }, div:"#bbs_page" },
    "detailview" : {link: function () { return cordova.file.applicationDirectory +   "www/detailview.html"; },  div:"#detailview_page" },
    "detailaddress" : {link: function () { return cordova.file.applicationDirectory +   "www/addressview.html"; },  div:"#addressview_page" },
    "imageviewer" : { link: function () { return cordova.file.applicationDirectory +   "www/imageviewer.html"; },  div:"#imageviewer_page" },
    "writereplypage" : {link: function () { return cordova.file.applicationDirectory +   "www/writereply.html"; },  div:"#write_reply_page"},
    "memolistpage" : {link: function () { return cordova.file.applicationDirectory +   "www/memolist.html"; },  div:"#memolist_page"}
};

SSO = new function (){
		this.NICKNAME="nickname";
		this.FULLNAME="fullname";
		this.FAMILYNAME="familyname";
		this.GIVENNAME="givenname";
		this.TELEPHONE_HOME="telephone_home";
		this.TELEPHONE_WORK="telephone_work";
		this.TELEPHONE_MOBILE="telephone_mobile";
		this.TELEPHONE_FAX="telephone_fax";
		this.E_MAIL="email";
		this.ADDRESS_HOME="address_home";
		this.ADDRESS_WORK="address_work";
		this.COMPANY="company";
		this.DEPARTMENT="department";
		this.POSITION="position";
		this.EMPLOYEE_NUMBER="employeeNumber";
		this.DEPARTMENT_NUMBER="departmentNumber";
		this.COMPANY_CODE="companyCode";
		this.ISBLUE="isBlue";
		this.SECURITY_LEVEL="securityLevel";
		this.EPID="epid";
		this.GENDER="gender";
		this.TITLE_NUMBER="titleNumber";
		this.USERID="userId";
		this.MAIL_HOST="mailHost";
		this.TELEPHONE_INTERNET="telephoneInternet";
		this.GRADE_OR_TITLE="gradeOrTitle";
		this.COUNTRY="country";
		this.PREFERRED_LANGUAGE_PRESENTATION="preferredLanguagePresentation";
		this.USER_LEVEL="userLevel";
		this.USER_STATUS="userStatus";
		this.ISNATIVE="isNative";
		this.BUSI_CODE="busiCode";
		this.BUSI_NAME="busiName";
		this.SUBORG_CODE="suborgcode";
		this.SUBORG_NAME="suborgname";
		this.GRADE_NAME="gradeName";
		this.REGION_CODE="resionCode";
		this.JOB="job";
		this.JOB_NAME="jobName";
		
		this.All = [
            "nickname"
            ,"fullname"
            ,"familyname"
            ,"givenname"
            ,"telephone_home"
            ,"telephone_work"
            ,"telephone_mobile"
            ,"telephone_fax"
            ,"email"
            ,"address_home"
            ,"address_work"
            ,"company"
            ,"department"
            ,"position"
            ,"employeeNumber"
            ,"departmentNumber"
            ,"companyCode"
            ,"isBlue"
            ,"securityLevel"
            ,"epid"
            ,"gender"
            ,"titleNumber"
            ,"userId"
            ,"mailHost"
            ,"telephoneInternet"
            ,"gradeOrTitle"
            ,"country"
            ,"preferredLanguagePresentation"
            ,"userLevel"
            ,"userStatus"
            ,"isNative"
            ,"busiCode"
            ,"busiName"
            ,"suborgcode"
            ,"suborgname"
            ,"gradeName"
            ,"resionCode"
            ,"job"
            ,"jobName"
		];
    };
