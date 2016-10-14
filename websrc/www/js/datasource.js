
var dbConstant =
{

 //   creationTableExam : 'CREATE TABLE IF NOT EXISTS SAMPLETABLE (ID INTEGER PRIMARY KEY AUTOINCREMENT, NAME TEXT NOT NULL, ATTR1 TEXT NOT NULL, AGE INTEGER)',

    creationTableCodeMaster : 'CREATE TABLE IF NOT EXISTS CODEMASTER (CODEID INTEGER PRIMARY KEY , CODECLASS TEXT NOT NULL, CODENAME TEXT NOT NULL, CODEVALUE INTEGER)',
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
    sqlboardType    : { table:"CODEMASTER", col:"CODEVALUE,CODENAME",where:"CODECLASS = ? ", wherestatement:["시설구분"]},
    sqlinstallType  : { table:"CODEMASTER", col:"CODEVALUE,CODENAME",where:"CODECLASS = ? ", wherestatement:["설치유형"]},
    sqlguideType    : { table:"CODEMASTER", col:"CODEVALUE,CODENAME",where:"CODECLASS = ? ", wherestatement:["안내시설형식"]},
    sqlmaterialType : { table:"CODEMASTER", col:"CODEVALUE,CODENAME",where:"CODECLASS = ? ", wherestatement:["재질"]},
    sqlstatusType : { table:"CODEMASTER", col:"CODEVALUE,CODENAME",where:"CODECLASS = ? ", wherestatement:["훼손상태"]},
   // sqlmaterialType : { table:"CODEMASTER", col:["codevalue","codename"],where:"codecls='건물번호판용도'"},
    sqlroadfacType : { table:"CODEMASTER", col:"CODEVALUE,CODENAME",where:"CODECLASS = ? ", wherestatement:["도로시설물구분"]},
    sqlinstallPlaceType : { table:"CODEMASTER", col:"CODEVALUE,CODENAME",where:"CODECLASS = ? ", wherestatement:["설치지점"]},
    //sqlmaterialType : { table:"CODEMASTER", col:["codevalue","codename"],where:"codecls='사용대상'"},
    //sqlmaterialType : { table:"CODEMASTER", col:["codevalue","codename"],where:"codecls='제작형식'"},
    dummy:{}

};

var datasource =
{
    db : {},
    openDB:function(){
        if (this.db.closeDB != null)
        {
            this.db.closeDB();
        }
        this.db = window.sqlitePlugin.openDatabase({"name" : "mkaisv_local", androidLockWorkaround:1});
    },
    createDB : function()
    {
        this.openDB();
        this.db.transaction(datasource.initDB, datasource.errorDB, datasource.successDB);

    //    cordova.plugins.sqlitePorter.importJsonToDb(datasource.db, dbConstant.initTable ,{ successFn:datasource.successDB , errorFn:datasource.errorDB});
     //   cordova.plugins.sqlitePorter.importJsonToDb(datasource.db, dbConstant.sampleData ,{ successFn:datasource.successDB , errorFn:datasource.errorDB});
    },
    closeDB:function()
    {
        this.db.close();
    },
    test : function()
    {
  //      window.sqlitePlugin.echoTest(function(){alert("success sql");}, function(){alert("error sql");}  );

        this.createDB();


    },
    initDB: function(tx)
    {
    //    tx.executeSql(dbConstant.creationTableExam);
        tx.executeSql(dbConstant.creationTableCodeMaster);
    //    tx.executeSql(dbConstant.creationTableRoadfac);
        //datasource initialize

        return;

        var sql = "INSERT INTO SAMPLETABLE (NAME,ATTR1,AGE) VALUES(?,?,?)";
        var d = dbConstant.sampleData;

       // for (for o in d) {
       for(var o=0; o<d.length; o++)
       {
            var params = [d[o].NAME, d[o].ATTR1, d[o].AGE];
           // alert(d[o].NAME + d[o].ATTR1 + d[o].AGE);

        //    tx.executeSql(sql, params);
        }

       // tx.executeSql('INSERT INTO SoccerPlayer(Name,Club) VALUES ("Alexandre Pato", "AC Milan")');
       // tx.executeSql('INSERT INTO SoccerPlayer(Name,Club) VALUES ("Van Persie", "Arsenal")');
    },
    errorDB: function (err) {
            alert("Error processing SQL: "+err.code);
        }
    ,
        //function will be called when process succeed
    successDB: function () {
    //    alert("success!");
      //  datasource.db.transaction(queryDB,errorCB);
    }
    ,
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
    getVersion: function()  //return : {appversion ,codeversion} from promise type
    {
        var def =  $.Deferred();

        //query vesion from codemaster
        this.db.executeSql('SELECT CODENAME, CODECLASS FROM CODEMASTER WHERE CODECLASS = ? OR CODECLASS = ?', ['APPVERSION','CODEVERSION'],
             function(result){
                var version = {
                    appversion : '0',
                    codeversion : '0'
                };

                var len = result.rows.length;
                for (var i=0; i<len; i++){
                    if (result.rows.item(i).CODECLASS == "APPVERSION")
                    {
                        version.appversion = result.rows.item(i).CODENAME;
                    }
                    else if (result.rows.item(i).CODECLASS == "CODEVERSION")
                    {
                        version.codeversion = result.rows.item(i).CODENAME;
                    }
                }
                def.resolve(version);
              },
              function(error){
                def.reject(error);
              });

        return def.promise();
    },
    updateVersionInfo :function(codemaster)     //앱 & 상수버전 갱신
    {
        this.db.transaction(function(tx){
            tx.executeSql(
                'INSERT or REPLACE INTO CODEMASTER (CODEID,CODENAME,CODEVALUE,CODECLASS) VALUES ( ?,?,?,?)',
                ['999999',codemaster.appversion,codemaster.appversion,'APPVERSION'],
                function(tx,resultset){}
                );
            tx.executeSql(
                'INSERT or REPLACE INTO CODEMASTER (CODEID,CODENAME,CODEVALUE,CODECLASS) VALUES ( ?,?,?,?)',
                ['888888',codemaster.codeversion,codemaster.codeversion,'CODEVERSION'],
                function(tx,resultset){}
                );

            for (var i in codemaster.items)
            {
                //alert(item + '   '+ item.codeid+' '+item.codename+' '+item.codevalue+' '+item.codecls);
                tx.executeSql('INSERT or REPLACE INTO CODEMASTER (CODEID,CODENAME,CODEVALUE,CODECLASS) VALUES ( ?,?,?,?)',
                    [codemaster.items[i].codeid,codemaster.items[i].codename,codemaster.items[i].codevalue,codemaster.items[i].codecls]   );
            }

        },
        function(error){
            alert('erro transaction'+error);
        },
        function(){ //transaction ok
        });
    }



};

function code2text(codetype, codevalue)
{
//TODO code는 메모리에 전부 onload
    var value="";
    switch(codevalue)
    {
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