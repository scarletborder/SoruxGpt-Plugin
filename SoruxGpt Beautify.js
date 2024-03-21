// ==UserScript==
// @name         SoruxGpt Beautify
// @namespace    http://scarletborders.top/
// @license      MIT
// @version      2024-03-21_a6
// @description  beautify for soruxgpt.com
// @author       scarletborder
// @match        *://user.soruxgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=soruxgpt.com
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==
// global

// var latest_index = "";
var user_id = -1;
var recommend_code = "";

///////////////////////////////////////////////////////////////////////

function SetBKUrl(bk_url) {
    GM.setValue("sorux_bk_url", bk_url)
}

async function GetBKUrlAndCombine() {
    return 'url("' + (await GM.getValue("sorux_bk_url", "")) + '")';
}

function GetBKUrlThenSet(element) {
    return GM.getValue("sorux_bk_url", "").then(data => {
        element.style.backgroundImage = 'url("' + data + '")';
        return
    });
}
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
///////////////////////////////////////////////////////////////////
// init 初始化函数
(async function () {
    'use strict';
    // Your code here...
    // 拦截响应
    var originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function () {
        // 全部请求相关信息
        var self = this;

        // 监听readystatechange事件
        this.onreadystatechange = function () {
            // 当readyState变为4时获取响应
            if (self.readyState === 4) {
                // self 里面就是请求的全部信息
                // 对me?token的内容进行截获
                if (user_id == -1 && self.responseURL.includes("user/me?token")) {
                    var obj = JSON.parse(self.response)
                    user_id = obj["Data"]["ID"]
                    recommend_code = obj["Data"]["RecommendCode"]
                }


                // JSON.parse(self.response);可以获取到返回的数据
            }
        };

        // 调用原始的send方法
        originalSend.apply(this, arguments);
    };


    await Beautify()
    // 加载完成后执行的代码
    const t = setInterval(async function () {
        await Beautify()
    }, 2000);

})();

async function Beautify() {
    var current_index = window.location.pathname;
    // if (current_index !== latest_index) {
    // latest_index = current_index;
    switch (current_index) {
        case "/login":
            await BeautifyLoginPage()
            break;
        case "/":
            await BeautifyDashboard();
            break;
        default:
            break;
    }
    // }

    // setTimeout(500, await Beautify());

}
///////////////////////////////////////////////////////////////////////////////////
// login page
///////////////////////////////////////////////////////////////////////////////////
async function BeautifyLoginPage() {
    var bk_path = "#root > div";
    var bk_url = "";
    if (!document.getElementById("plugin_change_bk")) {
        let btn = document.createElement('button');
        btn.textContent = 'BK';
        btn.id = "plugin_change_bk";
        btn.addEventListener('click', () => {
            bk_url = prompt("type your image url\n", "");
            SetBKUrl(bk_url)
            if (bk_url) {
                var Login_Page = document.querySelector(bk_path);
                Login_Page.style.background = 'url("' + bk_url + '") no-repeat';
                Login_Page.style["background-size"] = "cover";
            }
        });

        waitForElm(bk_path).then((elm) => {
            var Login_Page = document.querySelector(bk_path);
            Login_Page.appendChild(btn);
        });

    }

    waitForElm(bk_path).then(async (elm) => {
        var Login_Page = document.querySelector(bk_path);
        Login_Page.style.background = await GetBKUrlAndCombine() + " no-repeat"
        Login_Page.style["background-size"] = "cover"
    });
}


///////////////////////////////////////////////////////////////////////////////////
// dashboard
///////////////////////////////////////////////////////////////////////////////////

function modify_my_info() {

}



async function BeautifyDashboard() {
    // 侧边栏
    //document.querySelector("#root > div > div > div.ant-layout.ant-layout-has-sider.css-1qhpsh8 > aside")
    var aside_path = "#root > div > div > div.ant-layout.ant-layout-has-sider.css-1qhpsh8 > aside";
    var bk_path = "#root > div > div > div.ant-pro-layout-bg-list.css-rqfwn1";
    var final_card_path = "#root > div > div > div.ant-layout.ant-layout-has-sider.css-1qhpsh8 > div.ant-pro-layout-container.css-rqfwn1 > main > div:nth-child(7) > div";
    waitForElm(aside_path).then((elm) => {
        document.querySelector(aside_path).style["background-color"] = 'rgba(255,255,255,0.4)';
    });

    // if (obj.getAttribute("style") == null) {
    //     obj.setAttribute("style", "background-color:rgba(255,255,255,0.4)")
    // } else {
    //     obj.style["background-color"] = 'rgba(255,255,255,0.4)';
    // }

    // 主遮罩，设置成背景
    waitForElm(bk_path).then(async (elm) => {
        var dashboard_page = document.querySelector(bk_path);
        dashboard_page.style.background = await GetBKUrlAndCombine() + " no-repeat"
        dashboard_page.style["background-size"] = "cover"
    });
    // document.querySelector("#root > div > div > div.ant-pro-layout-bg-list.css-rqfwn1").style.opacity = 0.5
    var card_path = "#root > div > div > div.ant-layout.css-1qhpsh8 > div > main > div";
    waitForElm(final_card_path).then((elm) => {
        var elementList = document.querySelectorAll(card_path);
        for (var idx = 0, len = elementList.length; idx < len; idx++) {
            elementList[idx].style["background-color"] = 'rgba(255,255,255,0.4)';
        }
    });
    var personal_info_card = "#root > div > div > div.ant-layout.ant-layout-has-sider.css-1qhpsh8 > div.ant-pro-layout-container.css-rqfwn1 > main > div:nth-child(7) > div > div:nth-child(1) > div.ant-pro-card-body.css-rqfwn1 > div"


    waitForElm(personal_info_card).then((elm) => {
        elm.innerHTML = "用户ID:\t" + user_id + "</br>你的推荐码:\t" + recommend_code + "</br>你的API密钥已经隐藏，请前往[API管理]页面获得";
    });


}