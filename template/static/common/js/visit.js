var track = {
    log: function () {
        var visitRecord = {
            "VisitReffer": document.referrer,
            "VisitUrl": window.location.href,
            "UrlTitle": "M_" + document.title
        }

        if (visitRecord.UrlTitle.length > 100) {
            visitRecord.UrlTitle = visitRecord.UrlTitle.substring(0, 100);
        }

        var path = getRootPath();
        var requestUrl = path + "Home/UserVisitLog";

        var r = function () {
            $.ajax({
                type: "POST",
                async: true,
                url: requestUrl,
                data: visitRecord,
                success: function (data) {
                },
                error: function (data) {
                }
            });
        };

        r();
    }
};

function getRootPath() {
    return window.location.protocol + "//" + window.location.host + "/";
}

$(function () {
    //等待500毫秒后执行  
    setTimeout(function () {
        track.log();
    }, 500);
})