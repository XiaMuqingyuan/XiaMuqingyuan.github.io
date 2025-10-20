let titleTime, OriginTitile = document.title;
document.addEventListener("visibilitychange",
    (function () {
        document.hidden ?
            (document.title = "不在看看吗？",
                clearTimeout(titleTime)) :
            (document.title = "欢迎回来！",
                titleTime = setTimeout(
                    (function () {
                        document.title = OriginTitile
                    }), 2e3))
    }));
