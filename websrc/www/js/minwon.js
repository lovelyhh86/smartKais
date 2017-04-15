$(function () {
    $(document).on("pagecreate", pages.minwonListPage.div, function () {

    });

    $(document).on("pagebeforeshow", pages.minwonListPage.div, function (event, data) {
        buildContent({inTakeSymd: sYmd, inTakeEymd: eYmd})
    });

    $(document).on("pageshow", pages.minwonListPage.div, function () {

    });

    var buildContent = function(content) {
        content = $.extend({}, {inTakeSymd: "", inTakeEymd: ""}, content);
        util.postAJAX(content, URLs.minwonServiceLink)
            .then(function (context, rcode, results) {
                var data = results.data;
                if (rcode != 0 || util.isEmpty(data) === true) {
                    navigator.notification.alert('새올 민원접수 내역을 가져오지 못하였습니다.', function () {
                        util.goBack();
                    }, '새올 민원접수 조회', '확인');
                    util.dismissProgress();
                    return;
                }


                util.dismissProgress();

            }, function (context, xhr, error) {
                console.log("갱신실패" + error + '   ' + xhr);
                navigator.notification.alert('새올 민원접수 내역을 가져오지 못하였습니다.', function () {
                    util.goBack();
                }, '새올 민원접수 조회', '확인');


                util.dismissProgress();
            }
        );
    };
});