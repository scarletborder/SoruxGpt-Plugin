// ==UserScript==
// @name         SoruxGpt Beautify
// @namespace    http://scarletborders.top/
// @license      MIT
// @version      2024-03-21_a4
// @description  beautify for soruxgpt.com
// @author       scarletborder
// @match        *://user.soruxgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=soruxgpt.com
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

// global
function SetBKUrl(bk_url) {
    GM.setValue("sorux_bk_url", bk_url)
}
function GetBKUrlThenSet(element) {
    return GM.getValue("sorux_bk_url", "").then(data => {
        element.style.backgroundImage = 'url("' + data + '")';
        return
    });
}

// init 初始化函数
(function () {
    'use strict';
    // Your code here...
    // 加载完成后执行的代码
    Beautify()

})();

function Beautify() {
    switch (window.location.pathname) {
        case "/login":
            BeautifyLoginPage()
            break;

        case "/":
            BeautifyDashboard();
            break;
        default:
            break;
    }

}

function BeautifyLoginPage() {
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
                Login_Page.style["backgroundImage"] = 'url("' + bk_url + '")';
            }
        });

        waitForElm(bk_path).then((elm) => {
            var Login_Page = document.querySelector(bk_path);
            Login_Page.appendChild(btn);
        });

    }

    waitForElm(bk_path).then((elm) => {
        var Login_Page = document.querySelector(bk_path);
        GetBKUrlThenSet(Login_Page)
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

function BeautifyDashboard() {

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
    waitForElm(bk_path).then((elm) => {
        GetBKUrlThenSet(document.querySelector(bk_path));
    });
    // document.querySelector("#root > div > div > div.ant-pro-layout-bg-list.css-rqfwn1").style.opacity = 0.5
    var card_path = "#root > div > div > div.ant-layout.css-1qhpsh8 > div > main > div";
    waitForElm(final_card_path).then((elm) => {
        var elementList = document.querySelectorAll(card_path);
        for (var idx = 0, len = elementList.length; idx < len; idx++) {
            elementList[idx].style["background-color"] = 'rgba(255,255,255,0.4)';
        }
    });


}