/* ----
# Hingle Theme
# By: Dreamer-Paul
# Last Update: 2021.10.25
一个简洁大气，含夜间模式的 Hexo 博客模板。
本代码为奇趣保罗原创，并遵守 MIT 开源协议。欢迎访问我的博客：https://paugram.com
---- */

var Paul_Hingle = function (config) {
  var body = document.body;
  var content = ks.select(".post-content:not(.is-special), .page-content:not(.is-special)");

  // 菜单按钮
  this.header = function () {
    var menu = document.getElementsByClassName("head-menu")[0];
    ks.select(".toggle-btn").onclick = function () {
      menu.classList.toggle("active");
    };
    ks.select(".light-btn").onclick = this.night;

    var search = document.getElementsByClassName("search-btn")[0];
    var bar = document.getElementsByClassName("head-search")[0];
    search.addEventListener("click", function () {
      bar.classList.toggle("active");
    });
  };

  // 关灯切换
  this.night = function () {
    if (body.classList.contains("dark-theme")) {
      body.classList.remove("dark-theme");
      document.cookie = "night=false;" + "path=/;" + "max-age=21600";
      sessionStorage.setItem('dark or light', 'light');
    }
    else {
      body.classList.add("dark-theme");
      document.cookie = "night=true;" + "path=/;" + "max-age=21600";
      sessionStorage.setItem('dark or light', 'dark');
    }
  };

  // 目录树
  this.tree = function () {
    const wrap = ks.select(".wrap");
    const headings = content.querySelectorAll("h1, h2, h3, h4, h5, h6");
    if (headings.length === 0) return;

    body.classList.add("has-trees");

    const levelCount = { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 };
    headings.forEach((el) => {
      const tagName = el.tagName.toLowerCase();
      levelCount[tagName]++;
    });

    let firstLevel = 1;
    if (levelCount.h1 === 0 && levelCount.h2 > 0) firstLevel = 2;
    else if (levelCount.h1 === 0 && levelCount.h2 === 0 && levelCount.h3 > 0) firstLevel = 3;

    const trees = ks.create("section", {
      class: "article-list",
      html: `<h4><span class="title">目录</span></h4>`,
    });

    ks.each(headings, (t, index) => {
      const text = t.innerText;
      t.id = "title-" + index;
      const level = Number(t.tagName.substring(1)) - firstLevel + 1;
      const className = `item-${level}`;
      trees.appendChild(ks.create("a", { class: className, text, href: `#title-${index}` }));
    });

    wrap.appendChild(trees);

    const buttons = ks.select("footer .buttons");
    const btn = ks.create("button", {
      class: "toggle-list",
      attr: [{ name: "title", value: "切换文章目录" }],
    });
    buttons.appendChild(btn);

    btn.addEventListener("click", () => {
      trees.classList.toggle("active");
    });
  };

  // 外链自动新标签打开
  this.links = function () {
    var l = content.getElementsByTagName("a");
    if (l) {
      ks.each(l, function (t) {
        t.target = "_blank";
      });
    }
  };

  this.comment_list = function () {
    ks(".comment-content [href^='#comment']").each(function (t) {
      var item = ks.select(t.getAttribute("href"));
      t.onmouseover = function () {
        item.classList.add("active");
      };
      t.onmouseout = function () {
        item.classList.remove("active");
      };
    });
  };

  // 返回顶部按钮显示逻辑
  this.to_top = function () {
    var btn = document.getElementsByClassName("to-top")[0];
    var scroll =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop;
    scroll >= window.innerHeight / 2
      ? btn.classList.add("active")
      : btn.classList.remove("active");
  };

  // 初始化执行
  this.header();
  if (content) {
    this.tree();
    this.links();
    this.comment_list();
  }

  window.addEventListener("scroll", this.to_top);

  // 如果开启自动夜间模式
  if (config.night) {
    var sessiondarklight = sessionStorage.getItem('dark or light');
    var hour = new Date().getHours();
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      if (sessiondarklight == 'dark') {
        document.body.classList.add("dark-theme");
      }
      else if (sessiondarklight == 'pre') {
        document.body.classList.add("dark-theme");
        sessionStorage.setItem('dark or light', 'dark');
      };
    }
    else {
      if (hour <= 6 || hour >= 21) {
        if (sessiondarklight == 'dark') {
          document.body.classList.add("dark-theme");
        }
        else if (sessiondarklight == 'pre') {
          document.body.classList.add("dark-theme");
          sessionStorage.setItem('dark or light', 'dark');
        };
      }
    }
  }

  // 手动复制触发提示
  if (config.copyright) {
    document.oncopy = function () {
      ks.notice("复制内容请注明来源并保留版权信息！", {
        color: "yellow",
        overlay: true,
      });
    };
  }

  // Hexo 搜索
  this.hexo_search = function () {
    var form = ks.select(".head-search"),
      input = ks.select(".head-search input");
    form.onsubmit = function (ev) {
      ev.preventDefault();
      window.open("https://www.bing.com/search?q=" + input.value.trim());
    };
  };
  this.hexo_search();
};

// 图片缩放
ks.image(".post-content:not(.is-special) img, .page-content:not(.is-special) img");

// --------------------------
// ✅ 新增功能：代码折叠 + 一键复制 + 版权提示 + 自动滚回
// --------------------------
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("pre").forEach((block) => {
    // 创建复制按钮
    const copyBtn = document.createElement("button");
    copyBtn.className = "copy-btn";
    copyBtn.innerText = "复制";
    block.appendChild(copyBtn);

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(block.innerText);
      copyBtn.innerText = "已复制";

      // 🔔 增加版权提示
      ks.notice("复制内容请注明来源并保留版权信息！", {
        color: "yellow",
        overlay: true,
      });

      setTimeout(() => (copyBtn.innerText = "复制"), 2000);
    });

    // 折叠展开功能 + 滚动修复
    if (block.scrollHeight > 320) {
      const toggle = document.createElement("div");
      toggle.className = "toggle-code";
      toggle.innerText = "展开代码 ▼";
      block.after(toggle);

      toggle.addEventListener("click", () => {
        const expanded = block.classList.toggle("expanded");
        toggle.innerText = expanded ? "收起代码 ▲" : "展开代码 ▼";

        // 💡 折叠后自动滚动回代码块顶部（平滑过渡）
        if (!expanded) {
          const blockTop = block.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({
            top: blockTop,
            behavior: "smooth",
          });
        }
      });
    }
  });
});

// --------------------------
// 请保留版权说明
// --------------------------
if (window.console && window.console.log) {
  console.log(
    "%c Frost %c https://blog.525553.xyz ",
    "color: #fff; margin: 1em 0; padding: 5px 0; background: #6f9fc7;",
    "margin: 1em 0; padding: 5px 0; background: #efefef;"
  );
}
