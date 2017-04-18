var mwCode = {};
mwCode["00"] = "전체";
mwCode["01"] = "도로명부여신청";
mwCode["02"] = "도로명변경신청";
mwCode["03"] = "건물번호신청(부여,변경)";
mwCode["05"] = "건물번호판재교부신청";
mwCode["06"] = "자율형 건물번호판(설치,완료)";
mwCode["08"] = "도로명주소 안내도 및 안내판 광고사업 신청";
mwCode["09"] = "도로명주소안내시설 설치계획의 수정에대한 이의신청";
mwCode["10"] = "도로명주소대장(등본발급/열람)신청";
mwCode["11"] = "도로명주소안내도 교부 신청";
mwCode["12"] = "도로명주소대장 기재내용 정정 신청";
mwCode["80"] = "상세주소관리(부여,변경,폐지)";

$(function () {
    $(document).on("pagecreate", pages.minwonListPage.div, function () {

    });

    $(document).on("pagebeforeshow", pages.minwonListPage.div, function (event, data) {
        var now = Date.now();
        var eYmd = $.datepicker.formatDate('yymmdd', new Date(now));
        var sYmd = $.datepicker.formatDate('yymmdd', new Date(now - 15*24*60*60*1000));
        buildContent({inTakeSymd: sYmd, inTakeEymd: eYmd, reqstSe: "00", dataType: "JSON"})
    });

    $(document).on("pageshow", pages.minwonListPage.div, function () {

    });

    var buildContent = function(content) {
        content.sigCd = content.inTakeCggCode = app.info.sigCd;
        var url = URLs.postURL(URLs.minwonServiceLink, content);

        util.postAJAX("", url, true)
            .then(function (context, rcode, results) {
                var data = results.returnData;
                if (rcode != 0 || util.isEmpty(data) === true) {
                    navigator.notification.alert('새올 민원접수 내역을 가져오지 못하였습니다.', function () {
                        util.goBack();
                    }, '새올 민원접수 조회', '확인');
                    util.dismissProgress();
                    return;
                } else {
                    for(var i in data) {
                        var rowHtml = "<tr><td>{0}</td><td>{1}</td><td>{2}</td></tr>";
                        var d = data[i];
                        $("#minwon > tbody:last").append(
                            rowHtml.format(d.reqstDe.replace(/(\d{4})(\d{2})(\d{2})/,'$1/$2/$3'), mwCode[d.reqstSe], d.reqManNm));
                    }
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
        util.showProgress();
    };
});