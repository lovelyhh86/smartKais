
function loadAppMenu(container){
    var datasource={};
    $(container).load('appmenu.html', function() {
        $(this).trigger('create');
        $('#menu_version').text('현재 버전:'+ BuildInfo.version);


        if (application.mode !== '00'){

            for (var index = 0 ; index < application.sigInfos.length; index++) {
                var telNo = application.sigInfos[index].telno;
                var elm = '<li  data-link="debug"> <a href="#" onclick="application.selectSig(\''+ telNo +'\')">' +
                                telNo +
                                '</a></li>';

                $('.appMenuPanel ul').append(elm);

            }
        }

    });
}


