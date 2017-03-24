var dbConstant = {
    creationTableRoadFac: 'CREATE TABLE IF NOT EXISTS MEMOS (ID INTEGER PRIMARY KEY AUTOINCREMENT, DATE TEXT NOT NULL, MEMO TEXT NOT NULL, POSX TEXT , POSY TEXT, ETCJSON TEXT)',
    creationTableCodeGroup: 'CREATE TABLE IF NOT EXISTS SCCO_CODE ( GROUPID TEXT, GROUPNM TEXT, CODEID TEXT, CODENM TEXT )',
    creationTableCodeMaster: 'CREATE TABLE IF NOT EXISTS CODEMASTER (CODEID INTEGER PRIMARY KEY , CODECLASS TEXT NOT NULL, CODENAME TEXT NOT NULL, CODEVALUE INTEGER)',
    creationTableVersion: 'CREATE TABLE IF NOT EXISTS VERSION (PLATFORM TEXT, STORE TEXT, VERSION_CODE TEXT, VERSION_NAME TEXT, UPDATE_AT DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(PLATFORM, STORE))',
    creationTableGeolocation: "CREATE TABLE IF NOT EXISTS GEOLOCATION (WORKID TEXT DEFAULT 'MAP' PRIMARY KEY, PROJECTION TEXT, LOCATION_X TEXT, LOCATION_Y TEXT, TYPE TEXT, UPDATE_AT DATETIME DEFAULT CURRENT_TIMESTAMP)",

    dropTableCodeGroup: 'DELETE FROM SCCO_CODE',

    //TODO codemaster function refactoring
    sqlboardType: { table: "CODEMASTER", col: "CODEVALUE,CODENAME", where: "CODECLASS = ? ", wherestatement: ["시설구분"] },
    sqlinstallType: { table: "CODEMASTER", col: "CODEVALUE,CODENAME", where: "CODECLASS = ? ", wherestatement: ["설치유형"] },
    sqlguideType: { table: "CODEMASTER", col: "CODEVALUE,CODENAME", where: "CODECLASS = ? ", wherestatement: ["안내시설형식"] },
    sqlmaterialType: { table: "CODEMASTER", col: "CODEVALUE,CODENAME", where: "CODECLASS = ? ", wherestatement: ["재질"] },
    sqlstatusType: { table: "CODEMASTER", col: "CODEVALUE,CODENAME", where: "CODECLASS = ? ", wherestatement: ["훼손상태"] },
    sqlroadfacType: { table: "CODEMASTER", col: "CODEVALUE,CODENAME", where: "CODECLASS = ? ", wherestatement: ["도로시설물구분"] },
    sqlinstallPlaceType: { table: "CODEMASTER", col: "CODEVALUE,CODENAME", where: "CODECLASS = ? ", wherestatement: ["설치지점"] },

    dummy: {}
};

var datasource = {
    constant: {
        STORE: "EGOV_STORE",
        PLATFORM: "Android"
    },
    db: {},
    openDB: function () {
        if (this.db.close != null) {
            this.db.closeDB();
        }
        this.db = window.sqlitePlugin.openDatabase({ name: 'smartKais_local.db', location: 'default' });
    },
    createDB: function () {
        var def = $.Deferred();

        this.openDB();
        this.db.transaction(
            datasource.initDB,
            function() {
                datasource.errorDB
                def.reject();
            },
            function() {
                datasource.successDB
                def.resolve();
            }
        );

        return def.promise();
    },
    closeDB: function () {
        //        this.db.close();
    },
    test: function () {
        this.createDB();
    },
    initDB: function (tx) {
        tx.executeSql(dbConstant.creationTableRoadFac);
        tx.executeSql(dbConstant.creationTableCodeGroup);
        tx.executeSql(dbConstant.creationTableGeolocation);
        tx.executeSql(dbConstant.creationTableVersion);
    },
    errorDB: function (err) {
        console.log("Error processing SQL: " + err.code);
    },
    /** function will be called when process succeed */
    successDB: function () {
        //  datasource.db.transaction(queryDB,errorCB);
    },
    getGeolocation: function () {
        var def = $.Deferred();

        this.db.executeSql('SELECT * FROM GEOLOCATION', [],
            function (result) {
                if (result.rows.length > 0) def.resolve(result.rows.item(0));
            },
            function (error) {
                def.reject(error);
            });

        return def.promise();
    }
    ,
    setGeolocation: function (loc, successCB) {
        var def = $.Deferred();

        this.db.transaction(
            function (tx) {
                tx.executeSql("INSERT or REPLACE INTO  GEOLOCATION (PROJECTION, LOCATION_X, LOCATION_Y, TYPE) VALUES (?, ?, ?, ?)", [ loc.PROJECTION, loc.X, loc.Y, loc.TYPE ]);
            },
            function (error) {
                console.log('error transaction' + error);
                def.reject(error);
            },
            function () { //transaction ok
                if (successCB) successCB();
                def.resolve();
            });

        return def.promise();
    }
    ,
    getVersion: function () {
        var def = $.Deferred();

        this.db.executeSql('SELECT * FROM VERSION WHERE PLATFORM = ? ', [this.constant.STORE], function (result) {
            var ver = '0.0.0';

            if (result.rows.length > 0) {
                ver = result.rows.item(0).VERSION_NAME;
            }
            def.resolve(ver);
        },
            function (error) {
                def.reject(error);
            });

        return def.promise();
    },
    updateVersionInfo: function (updateDate, d, successCB) { //앱 & 상수버전 갱신
        this.db.transaction(function (tx) {
            tx.executeSql("INSERT or REPLACE INTO VERSION (PLATFORM, STORE, VERSION_CODE, VERSION_NAME) VALUES (?, ?, ?, ?)", [d.platform, d.store, d.versionCode, d.versionName]);
        },
            function (error) {
                console.log('error transaction' + error);
            },
            function () { //transaction ok
                if (successCB) successCB();
            });
    },
    setCodeMaster: function (codemaster, successCB) { //앱 & 상수버전 갱신
        this.db.transaction(
            function (tx) {
                for (var i in codemaster) {
                    //alert(item + '   '+ item.codeid+' '+item.codename+' '+item.codevalue+' '+item.codecls);
                    tx.executeSql('INSERT or REPLACE INTO SCCO_CODE (GROUPID,GROUPNM,CODEID,CODENM) VALUES ( ?,?,?,?)', [codemaster[i].groupId, codemaster[i].groupNm, codemaster[i].codeId, codemaster[i].codeNm]);
                }
            },
            function (error) {
                console.log('erro transaction' + error);
            },
            function () { //transaction ok
                if (successCB) successCB();
            });
    },
    getCodeMaster: function (cb) {
        this.db.transaction(function (tx) {
            tx.executeSql('SELECT GROUPID, CODEID, GROUPNM, CODENM FROM SCCO_CODE ORDER BY GROUPID, CODEID ASC ', [],
                function (tx, result) {
                    var codeMaster = {};
                    var len = result.rows.length;
                    for (var i = 0; i < len; i++) {
                        var groupId = result.rows.item(i).GROUPID;
                        var groupNm = result.rows.item(i).GROUPNM;
                        var codeId = result.rows.item(i).CODEID;
                        var codeNm = result.rows.item(i).CODENM;

                        if (codeMaster[groupId] == {} || codeMaster[groupId] == undefined) {
                            codeMaster[groupId] = { GroupNm: groupNm, codeId: [], codenms: [] };
                        }

                        codeMaster[groupId].codeids.push(codeId);
                        codeMaster[groupId].codenms.push(codeNm);
                    }
                    cb(codeMaster);
                });
        },
            function (error) {
                console.log('error transaction' + error);
            },
            function () { //transaction ok

            });
    },
    addMemo: function (jsonData) {
        // ID INTEGER PRIMARY KEY AUTOINCREMENT, DATE TEXT NOT NULL, MEMO TEXT NOT NULL, POSX TEXT , POSY TEXT, ETCJSON
        this.db.transaction(function (tx) {
            var sql = 'INSERT INTO MEMOS (DATE,MEMO,POSX,POSY,ETCJSON) VALUES ( ?, ? ,? ,? ,? )';
            var statement = [jsonData.date, jsonData.memo, jsonData.x, jsonData.y, JSON.stringify(jsonData.jsons)];
            tx.executeSql(sql, statement, function (tx, resultset) { });
        }, function (err) { }, function () { });

    },
    updateMemo: function (jsonData) {
        // ID INTEGER PRIMARY KEY AUTOINCREMENT, DATE TEXT NOT NULL, MEMO TEXT NOT NULL, POSX TEXT , POSY TEXT, ETCJSON
        this.db.transaction(function (tx) {
            var sql = 'UPDATE MEMOS SET DATE = ? ,MEMO = ?, ETCJSON = ? ) WHERE ID = ?';
            var statement = [jsonData.date, jsonData.memo, JSON.stringify(jsonData.jsons), jsonData.id];
            tx.executeSql(sql, statement, function (tx, resultset) { });
        }, function (err) { }, function () { });

    },
    deleteMemo: function (id) { },
    memoList: function (jsonCondition, cb) {
        this.db.executeSql('SELECT ID, DATE,MEMO,POSX,POSY,ETCJSON FROM MEMOS ORDER BY DATE DESC', [],
            function (result) {
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
            function (error) {
                console.log(error);
            });

    },
    /* sample */
    queryDB: function (getResultCallback, sqlSelector, whereExt, sqlExt) {
        var sql = "SELECT " + sqlSelector.col + " FROM " + sqlSelector.table;
        var where = [];
        if (sqlSelector.where !== undefined || whereExt != undefined) {
            sql += " WHERE ";
            if (whereExt !== undefined) {
                sql += whereExt;
                where = sqlExt;
            } else if (sqlSelector.where !== undefined) {
                sql += sqlSelector.where;
                where = sqlSelector.wherestatement;
            }
        }

        //조건 입력, json 변환
        this.db.executeSql(sql, where,
            function (result) {

                var players = "";
                var len = result.rows.length;

                var arrayResult = [];

                for (var i = 0; i < len; i++) {
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