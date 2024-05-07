// global
var has_shown = false; // 目前是否展示工具栏
var my_chatgpt_account_id = "";
var my_cookie = "";


async function AddExportModel() {
    let scb_modal = document.createElement("div");
    scb_modal.id = "scb-modal"
    scb_modal.innerHTML = `
        <div id="scb-modal-content" class="model-content bg-token-sidebar-surface-primary" style="margin: 0; padding: 20px; border: 1px solid #888;">
        <p>Export Method</p>
        <button id="scb-opt1" style="cursor: pointer;">Markdown</button>
        <button id="scb-opt2" style="cursor: pointer;">Json</button>
    </div>`

    scb_modal.style.display = 'none'; /* Hidden by default */
    scb_modal.style.position = 'absolute'; /* Position relative to its positioned parent */
    scb_modal.style.zIndex = 1; /* Sit on top */
    scb_modal.classList.add("bg-token-sidebar-surface-primary")

    let scb_modal2 = document.createElement("div");
    scb_modal2.id = "scb-modal2"
    scb_modal2.innerHTML = `
        <div id="scb-modal2-content" class="model-content bg-token-sidebar-surface-primary" style="margin: 0; padding: 20px; border: 1px solid #888;">
        <p>请先打开对话</p>
    </div>`

    scb_modal2.style.display = 'none'; /* Hidden by default */
    scb_modal2.style.position = 'absolute'; /* Position relative to its positioned parent */
    scb_modal2.style.zIndex = 1; /* Sit on top */
    scb_modal2.classList.add("bg-token-sidebar-surface-primary")


    document.body.append(scb_modal);
    document.body.append(scb_modal2)
}

async function AddExportButton() {
    let btn = document.createElement("div");
    btn.innerHTML = `<div class="max-w-[100%] grow"><div class="group relative" data-headlessui-state=""><button class="flex w-full max-w-[100%] items-center gap-2 rounded-lg p-2 text-sm  hover:bg-token-sidebar-surface-secondary group-ui-open:bg-token-sidebar-surface-secondary" id="scb-export" type="button" aria-haspopup="true" aria-expanded="false" data-headlessui-state=""><div class="relative -top-px grow -space-y-px truncate text-left text-token-text-primary"><div>Export</div></div></button></div></div>`;
    btn.onclick = function () {
        let modal = document.getElementById("scb-modal");
        modal.style.display = "none";
        let modal2 = document.getElementById("scb-modal2");
        modal2.style.display = "none";
        let modalContent = document.getElementById("scb-modal-content")
        let modalContent2 = document.getElementById("scb-modal2-content")

        if (!has_shown) {
            var rect = btn.getBoundingClientRect(); // 获取按钮的位置和尺寸
            if (!JudgeCurrentUrl()) {
                var choose_modal = modal2
                var choose_modalContent = modalContent2
            } else {
                var choose_modal = modal
                var choose_modalContent = modalContent
            }
            choose_modal.style.display = "block"; // 显示模态框

            var modalHeight = choose_modalContent.offsetHeight;  // 获取模态框内容的高度
            choose_modal.style.left = (rect.right + 10) + "px"; // 设置模态框的左边缘为按钮的右边缘 + 10px
            choose_modal.style.top = (rect.bottom - modalHeight) + "px";  // 设置模态框的顶部位置
            has_shown = true;
        } else {
            has_shown = false;
            modal.style.display = "none";
            modal2.style.display = "none";
        }
    }
    // let model = document.getElementById("scb-model");

    // window.onclick = function (event) {
    //     let modal = document.getElementById("scb-modal");
    //     if ((event.target != modal && event.target != btn) || (event.target == btn && has_shown == true)) {
    //         modal.style.display = "none"; // 点击模态框外部时也隐藏模态框
    //         // has_shown = false;
    //     }
    // }


    let option1 = document.getElementById("scb-opt1")
    let option2 = document.getElementById("scb-opt2")

    option1.onclick = function () {
        let modal = document.getElementById("scb-modal")
        // console.log("Option 1 selected");
        GetBlobJson(JudgeCurrentUrl(), 2);


        modal.style.display = "none";
        has_shown = false;
    }

    option2.onclick = function () {
        let modal = document.getElementById("scb-modal")
        // console.log("Option 2 selected");
        GetBlobJson(JudgeCurrentUrl(), 1);
        modal.style.display = "none";
        has_shown = false;
    }


    let side_bar_list = getElementByXpath("/html/body/div[1]/div[1]/div[1]/div/div/div/div/nav/div[3]");
    side_bar_list.appendChild(btn);

}

async function GetBlobJson(url_list, down_method) {
    // 1-Json
    // 2- Markdown
    let url = url_list[0] + "//" + url_list[2] + "/backend-api/conversation/" + url_list[4];

    var myHeaders = new Headers();

    const regex = /_account=([^;]+)/;
    const match = document.cookie.match(regex);
    if (match) {
        // console.log(match[1]); // 输出匹配的值
        my_chatgpt_account_id = match[1];
        myHeaders.append("chatgpt-account-id", my_chatgpt_account_id);
    } else {
        console.log("No match found.");
    }
    my_cookie = document.cookie;
    myHeaders.append("cookie", my_cookie);


    myHeaders.append("oai-language", "en-US");
    myHeaders.append("referer", document.location.href);



    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => async function () {
            // json = result

            //找到标题
            var obj = JSON.parse(result)

            if (down_method == 1) {
                //json
                downloadTextAsFile(result, obj.title + ".json")

            } else if (down_method == 2) {
                var mapping = obj.mapping;
                downloadTextAsFile(await generateMarkdown(obj), obj.title + ".md")

            } else {
                console.log("未知的下载方式")
            }

        }())
        .catch(error => console.log('error', error));

}

async function generateMarkdown(obj) {
    var sortedData = Object.values(obj.mapping);
    // 初始化Markdown文本
    var head = { "text": "# " + obj.title + "\n", "has_file": false };
    var main = { "text": "" };
    var foot = { "quote": {} };

    await ParseSortedData(sortedData, head, main, foot);

    let foot_text = "\n\n---\n";
    // let foot_list = Object.values(foot.quote);
    for (const key in foot.quote) {
        if (foot.quote.hasOwnProperty(key)) {
            foot_text += foot.quote[key];
        }
        foot_text += "\n";
    }
    if (head.has_file) {
        head.text += "本文档含有文件链接，请及时保存\n\n";
    }
    head.text += "首次对话时间:\t" + TimeConvert(obj.create_time) + "\n\n" +
        "最近对话时间:\t" + TimeConvert(obj.update_time) +
        "\n\n---\n";

    var markdownText = head.text + main.text + foot_text;
    return markdownText;
}

async function downloadTextAsFile(text, filename) {
    // 创建一个Blob对象，参数是一个包含文件内容的数组，和一个指定内容类型的对象
    const blob = new Blob([text], { type: 'text/plain' });

    // 创建一个指向Blob的URL
    const url = URL.createObjectURL(blob);

    // 创建一个<a>标签
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;  // 设置下载文件的文件名

    // 将<a>标签添加到页面中
    document.body.appendChild(a);

    // 模拟点击<a>标签进行下载
    a.click();

    // 清理：释放创建的URL资源，并移除添加的<a>标签
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
}
function JudgeCurrentUrl() {
    let url = window.location.href;
    url = url.split("/")
    if (url[url.length - 2] != 'c') {
        return
    }
    return url
}




//封装xpath
function getElementByXpath(xpath) {
    var element = document.evaluate(xpath, document).iterateNext();
    return element;
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


(async function () {
    'use strict';
    // var copydocument = document;
    // Your code here...

    // disable model in html
    // has_shown = false;
    // window.addEventListener("load", function () {
    //     setTimeout(async function () {
    //         // document = copydocument;
    //         // console.log("haode")
    //         await AddExportModel();
    //         AddExportButton();
    //     }, 2000)
    // }
    // );

    // 添加menu command
    GM_registerMenuCommand("Export as JSON", async function (params) {
        if (!JudgeCurrentUrl()) {
            console.warn("请先打开对话");
            return;
        }
        GetBlobJson(JudgeCurrentUrl(), 1);
    }, "j");
    GM_registerMenuCommand("Export as Markdown", async function (params) {
        if (!JudgeCurrentUrl()) {
            console.warn("请先打开对话");
            return;
        }
        GetBlobJson(JudgeCurrentUrl(), 2);
    }, "m");



})();