function loadAppMenu(container) {
    var datasource = {};
    $(container).load('appmenu.html', function () {
        $(this).trigger('create');
        $('#menu_version').text('현재 버전:' + BuildInfo.version);

        if (app.telNo == '01059237764' || app.telNo == '01031207751') {

            for (var index = 0; index < app.sigInfos.length; index++) {
                var title = app.sigInfos[index].info.sigNm;
                var telNo = app.sigInfos[index].telNo;
                var elm = '<li  data-link="debug"> <a href="#" onclick="app.selectSig(\'' + telNo + '\')">' +
                    title +
                    '</a></li>';
                $('.appMenuPanel ul').append(elm);
            }
        }
    });
}
