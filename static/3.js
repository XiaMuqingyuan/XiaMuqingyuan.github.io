let titleTime, OriginTitile = document.title;
document.addEventListener("visibilitychange",
    (function () {
        document.hidden ?
            (document.title = "梧桐叶上三更雨,叶叶声声是别离",
                clearTimeout(titleTime)) :
            (document.title = "无可奈何花落去,似曾相识燕归来",
                titleTime = setTimeout(
                    (function () {
                        document.title = OriginTitile
                    }), 2e3))
    }));
