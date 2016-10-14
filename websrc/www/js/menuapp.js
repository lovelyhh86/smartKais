
function loadAppMenu(container){
    var datasource={};
    $(container).load('appmenu.html', function() {
        $(this).trigger('create');
    });
}


