var dbConstant = {

    //   creationTableExam : 'CREATE TABLE IF NOT EXISTS SAMPLETABLE (ID INTEGER PRIMARY KEY AUTOINCREMENT, NAME TEXT NOT NULL, ATTR1 TEXT NOT NULL, AGE INTEGER)',
    creationTableRoadfac: 'CREATE TABLE IF NOT EXISTS MEMOS (ID INTEGER PRIMARY KEY AUTOINCREMENT, DATE TEXT NOT NULL, MEMO TEXT NOT NULL, POSX TEXT , POSY TEXT, ETCJSON TEXT)',
    dropTableCodeGroup: 'DELETE FROM SCCO_CODE',
    creationTableCodeGroup: 'CREATE TABLE IF NOT EXISTS SCCO_CODE ( GROUPID TEXT, GROUPNM TEXT, CODEID TEXT, CODENM TEXT )',
    creationTableCodeMaster: 'CREATE TABLE IF NOT EXISTS CODEMASTER (CODEID INTEGER PRIMARY KEY , CODECLASS TEXT NOT NULL, CODENAME TEXT NOT NULL, CODEVALUE INTEGER)',
    //  creationTableRoadfac : 'CREATE TABLE IF NOT EXISTS SAMPLETABLE (ID INTEGER PRIMARY KEY AUTOINCREMENT, NAME TEXT NOT NULL, ATTR1 TEXT NOT NULL, AGE INTEGER)',
    /*
        initTable : {
            "structure" : {
                "tables":{
                    "TestTable" : "(ID INTEGER PRIMARY KEY AUTOINCREMENT, NAME TEXT NOT NULL, ATTR1 TEXT NOT NULL, AGE INTEGER)"
                }
            //"otherSQL": [
           //     "CREATE UNIQUE INDEX Artist_ID ON Artist(Id)"
           //]
            }
        },



        sampleData :
                      [
                        {"NAME":"Joehee" , "ATTR1":"Seocho", "AGE": 30},
                        {"NAME":"MoonSue" , "ATTR1":"Incheon", "AGE": 30},
                        {"NAME":"HeeWon" , "ATTR1":"Seocho 3Dong", "AGE": 30},
                        {"NAME":"JeeWon" , "ATTR1":"Kang-nam", "AGE": 30},
                        {"NAME":"YunSue" , "ATTR1":"ChonAn", "AGE": 30},
                        {"NAME":"SanSae" , "ATTR1":"Dog House", "AGE": 20},
                        {"NAME":"Takaki" , "ATTR1":"Nippon", "AGE": 20},
                        {"NAME":"Mitsuda" , "ATTR1":"Japan", "AGE": 20},
                        {"NAME":"Akari" , "ATTR1":"Sapporo", "AGE": 20},
                        {"NAME":"BumSuk" , "ATTR1":"Su-Won", "AGE": 20},
                        {"NAME":"Chalse" , "ATTR1":"England", "AGE": 10},
                        {"NAME":"Decaprio" , "ATTR1":"America", "AGE": 10},
                        {"NAME":"Oska" , "ATTR1":"Academy", "AGE": 40},
                        {"NAME":"KangTae" , "ATTR1":"Raster City", "AGE": 40},
                        {"NAME":"Jason" , "ATTR1":"England", "AGE": 40},
                        {"NAME":"Michelan" , "ATTR1":"Hyper Apartment", "AGE": 50},
                        {"NAME":"Tsuee" , "ATTR1":"China", "AGE": 50},
                        {"NAME":"Sakata" , "ATTR1":"Sakata inderstry", "AGE": 50},
                        {"NAME":"Roy" , "ATTR1":"Super StarK", "AGE": 40},
                        {"NAME":"Phykyo" , "ATTR1":"NumberOne", "AGE": 40},
                        {"NAME":"Yayature" , "ATTR1":"Manchester City", "AGE": 30},
                        {"NAME":"David" , "ATTR1":"Manchester United", "AGE": 30}
                    ],
                    //*/

    //TODO codemaster function refactoring
    sqlboardType: { table: "CODEMASTER", col: "CODEVALUE,CODENAME", where: "CODECLASS = ? ", wherestatement: ["시설구분"] },
    sqlinstallType: { table: "CODEMASTER", col: "CODEVALUE,CODENAME", where: "CODECLASS = ? ", wherestatement: ["설치유형"] },
    sqlguideType: { table: "CODEMASTER", col: "CODEVALUE,CODENAME", where: "CODECLASS = ? ", wherestatement: ["안내시설형식"] },
    sqlmaterialType: { table: "CODEMASTER", col: "CODEVALUE,CODENAME", where: "CODECLASS = ? ", wherestatement: ["재질"] },
    sqlstatusType: { table: "CODEMASTER", col: "CODEVALUE,CODENAME", where: "CODECLASS = ? ", wherestatement: ["훼손상태"] },
    // sqlmaterialType : { table:"CODEMASTER", col:["codevalue","codename"],where:"codecls='건물번호판용도'"},
    sqlroadfacType: { table: "CODEMASTER", col: "CODEVALUE,CODENAME", where: "CODECLASS = ? ", wherestatement: ["도로시설물구분"] },
    sqlinstallPlaceType: { table: "CODEMASTER", col: "CODEVALUE,CODENAME", where: "CODECLASS = ? ", wherestatement: ["설치지점"] },
    //sqlmaterialType : { table:"CODEMASTER", col:["codevalue","codename"],where:"codecls='사용대상'"},
    //sqlmaterialType : { table:"CODEMASTER", col:["codevalue","codename"],where:"codecls='제작형식'"},
    dummy: {}

};

var datasource = {
    db: {},
    openDB: function() {
        if (this.db.close != null) {
            this.db.closeDB();
        }
        // this.db = window.sqlitePlugin.openDatabase({ "name": "mkaisv_local.db", androidLockWorkaround: 1 });
        this.db = window.sqlitePlugin.openDatabase({ name: 'mkaisv_local.db', location: 'default' });
    },
    createDB: function() {
        this.openDB();
        this.db.transaction(datasource.initDB, datasource.errorDB, datasource.successDB);

        //    cordova.plugins.sqlitePorter.importJsonToDb(datasource.db, dbConstant.initTable ,{ successFn:datasource.successDB , errorFn:datasource.errorDB});
        //   cordova.plugins.sqlitePorter.importJsonToDb(datasource.db, dbConstant.sampleData ,{ successFn:datasource.successDB , errorFn:datasource.errorDB});
    },
    closeDB: function() {
        //   this.db.close();
    },
    test: function() {
        //      window.sqlitePlugin.echoTest(function(){alert("success sql");}, function(){alert("error sql");}  );

        this.createDB();


    },
    initDB: function(tx) {
        tx.executeSql(dbConstant.creationTableRoadfac);
        tx.executeSql(dbConstant.creationTableCodeGroup);
        //    tx.executeSql(dbConstant.creationTableRoadfac);
        //datasource initialize
        return;

        var sql = "INSERT INTO SAMPLETABLE (NAME,ATTR1,AGE) VALUES(?,?,?)";
        var d = dbConstant.sampleData;

        // for (for o in d) {
        for (var o = 0; o < d.length; o++) {
            var params = [d[o].NAME, d[o].ATTR1, d[o].AGE];
            // alert(d[o].NAME + d[o].ATTR1 + d[o].AGE);

            //    tx.executeSql(sql, params);
        }

        // tx.executeSql('INSERT INTO SoccerPlayer(Name,Club) VALUES ("Alexandre Pato", "AC Milan")');
        // tx.executeSql('INSERT INTO SoccerPlayer(Name,Club) VALUES ("Van Persie", "Arsenal")');
    },
    errorDB: function(err) {
        alert("Error processing SQL: " + err.code);
    },
    //function will be called when process succeed
    successDB: function() {
        //  datasource.db.transaction(queryDB,errorCB);
    },
    /*
     queryDB: function(getResultCallback,sqlSelector,whereExt,sqlExt)
     {
         var sql = "SELECT " + sqlSelector.col + " FROM " + sqlSelector.table  ;
         var where =[];
         if (sqlSelector.where !== undefined || whereExt != undefined)
         {
             sql += " WHERE ";
             if (whereExt !== undefined){
                 sql += whereExt;
                 where = sqlExt;
             } else if (sqlSelector.where !== undefined){
                 sql += sqlSelector.where;
                 where = sqlSelector.wherestatement;
             }
         }

     //조건 입력, json 변환
         this.db.executeSql(sql,where,
              function(result){

                       //  var playerlist = document.getElementById("SoccerPlayerList");
                         var players = "";
                         var len = result.rows.length;
                     //    alert("The show is on" + JSON.stringify(result.rows));

                         var arrayResult =[];

                         for (var i=0; i<len; i++){
                             arrayResult.push(result.rows.item(i));
                          //   alert(JSON.stringify(result.rows.item(i)));
                          //   alert(result.rows.item(i).ID + " "+result.rows.item(i).ATTR1 + " "+result.rows.item(i).NAME +" "+ result.rows.item(i).AGE);
                       //      players = players + '<li><a href="#"><p class="record">'+result.rows.item(i).Name+'</p><p class="small">Club '+result.rows.item(i).Club+'</p></a></li>';
                         }

                         if (getResultCallback != null)
                             getResultCallback(arrayResult);

                      //   playerlist.innerHTML = players;
                      //   $("#SoccerPlayerList").listview("refresh");
               },
               datasource.errorDB);

     },
     //*/
    getVersion: function() //return : {appversion ,codeversion} from promise type
        {
            var def = $.Deferred();

            //query vesion from codemaster
            this.db.executeSql('SELECT GROUPID, GROUPNM FROM SCCO_CODE WHERE GROUPID = ? ', ['APPVERSION'],
                function(result) {
                    var appversion = '';

                    var len = result.rows.length;
                    for (var i = 0; i < len; i++) {
                        if (result.rows.item(i).GROUPID == "APPVERSION") {
                            appversion = result.rows.item(i).GROUPNM;
                        }
                    }
                    def.resolve(appversion);
                },
                function(error) {
                    def.reject(error);
                });

            return def.promise();
        },
    updateVersionInfo: function(appversion, codemaster, successcb) //앱 & 상수버전 갱신
        {
            // SCCO_CODE ( GROUPID TEXT, GROUPNM TEXT, CODEID TEXT, CODENM TEXT )',

            this.db.transaction(function(tx) {

                    tx.executeSql(dbConstant.dropTableCodeGroup);
                    tx.executeSql("INSERT or REPLACE INTO SCCO_CODE (GROUPID,GROUPNM,CODEID,CODENM) VALUES ('APPVERSION' ,?,'','')", [appversion]);

                    for (var i in codemaster) {
                        //alert(item + '   '+ item.codeid+' '+item.codename+' '+item.codevalue+' '+item.codecls);
                        tx.executeSql('INSERT or REPLACE INTO SCCO_CODE (GROUPID,GROUPNM,CODEID,CODENM) VALUES ( ?,?,?,?)', [codemaster[i].groupId, codemaster[i].groupNm, codemaster[i].codeId, codemaster[i].codeNm]);
                    }

                },
                function(error) {
                    alert('erro transaction' + error);
                },
                function() { //transaction ok
                    successcb();
                });
        },
    getCodeMaster: function(cb) {


        this.db.transaction(function(tx) {
                tx.executeSql('SELECT GROUPID, CODEID, GROUPNM, CODENM FROM SCCO_CODE ORDER BY GROUPID, CODEID ASC ', [],
                    function(tx, result) {
                        var appversion = '';
                        var codemaster = {};
                        var len = result.rows.length;
                        for (var i = 0; i < len; i++) {

                            var groupid = result.rows.item(i).GROUPID;
                            var groupnm = result.rows.item(i).GROUPNM;
                            var codeid = result.rows.item(i).CODEID;
                            var codenm = result.rows.item(i).CODENM;

                            if (codemaster[groupid] == {} || codemaster[groupid] == undefined) {
                                codemaster[groupid] = { GroupNm: groupnm, codeids: [], codenms: [] };
                            }

                            codemaster[groupid].codeids.push(codeid);
                            codemaster[groupid].codenms.push(codenm);

                        }

                        cb(codemaster);
                    });
            },
            function(error) {
                alert('erro transaction' + error);
            },
            function() { //transaction ok

            });


    },
    addMemo: function(jsonData) {
        // ID INTEGER PRIMARY KEY AUTOINCREMENT, DATE TEXT NOT NULL, MEMO TEXT NOT NULL, POSX TEXT , POSY TEXT, ETCJSON
        this.db.transaction(function(tx) {
            var sql = 'INSERT INTO MEMOS (DATE,MEMO,POSX,POSY,ETCJSON) VALUES ( ?, ? ,? ,? ,? )';
            var statement = [jsonData.date, jsonData.memo, jsonData.x, jsonData.y, JSON.stringify(jsonData.jsons)];
            tx.executeSql(sql, statement, function(tx, resultset) {});
        }, function(err) {}, function() {});

    },
    updateMemo: function(jsonData) {
        // ID INTEGER PRIMARY KEY AUTOINCREMENT, DATE TEXT NOT NULL, MEMO TEXT NOT NULL, POSX TEXT , POSY TEXT, ETCJSON
        this.db.transaction(function(tx) {
            var sql = 'UPDATE MEMOS SET DATE = ? ,MEMO = ?, ETCJSON = ? ) WHERE ID = ?';
            var statement = [jsonData.date, jsonData.memo, JSON.stringify(jsonData.jsons), jsonData.id];
            tx.executeSql(sql, statement, function(tx, resultset) {});
        }, function(err) {}, function() {});

    },
    deleteMemo: function(id) {},
    memoList: function(jsonCondition, cb) {
        this.db.executeSql('SELECT ID, DATE,MEMO,POSX,POSY,ETCJSON FROM MEMOS ORDER BY DATE DESC', [],
            function(result) {
                var memos = [];;

                var len = result.rows.length;
                for (var i = 0; i < len; i++) {
                    var item = result.rows.item(i);
                    memos.push({
                        id: item.ID,
                        date: item.DATE,
                        memo: item.MEMO,
                        x: item.POSX,
                        y: item.POSY,
                        jsons: item.ETCJSON
                    });
                }
                cb(memos);
            },
            function(error) {
                console.log(error);
            });

    }



};

function code2text(codetype, codevalue) {
    //TODO code는 메모리에 전부 onload
    var value = "";
    switch (codevalue) {
        case "2":
            value = "건물번호판";
            break;
        case "1":
            value = "도로명판";
            break;
        case "3":
            value = "ㅁㅁㅁ판";
            break;
    }
    return value;
}