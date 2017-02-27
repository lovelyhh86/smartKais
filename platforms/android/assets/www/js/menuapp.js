
function loadAppMenu(container){
    var datasource={};
    $(container).load('appmenu.html', function() {
        $(this).trigger('create');
        $('#menu_version').text('현재 버전:'+ BuildInfo.version);


        if (application.telNo == '01059237764'){

            for (var index = 0 ; index < application.sigInfos.length; index++) {
                var title = application.sigInfos[index].info.sigNm;
                var telNo = application.sigInfos[index].telNo;
                var elm = '<li  data-link="debug"> <a href="#" onclick="application.selectSig(\''+ telNo +'\')">' +
                                title +
                                '</a></li>';

                $('.appMenuPanel ul').append(elm);

            }
        }

    });
}


