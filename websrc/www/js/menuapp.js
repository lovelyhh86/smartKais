
function loadAppMenu(container){
    var datasource={};
    $(container).load('appmenu.html', function() {
        $(this).trigger('create');
        $('#menu_version').text('현재 버전:'+ BuildInfo.version);
    });
}


