// ==UserScript==
// @name         SoruxGpt Exporter
// @namespace    http://scarletborders.top/
// @license      MIT
// @version      3.3
// @description  Export function for soruxgpt.com
// @author       scarletborder
// @match        *://chat-o.soruxgpt.com/*
// @icon         https://s2.loli.net/2024/04/22/3Pazvy9poqBYOrW.png
// @grant        GM_registerMenuCommand
// @downloadURL  https://raw.githubusercontent.com/scarletborder/SoruxGpt-Plugin/main/SoruxGpt%20Exporter.js
// @updateURL    https://raw.githubusercontent.com/scarletborder/SoruxGpt-Plugin/main/SoruxGpt%20Exporter.js
// ==/UserScript==
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
// code  : 代码执行器，他会跟一个儿子表示其执行结果
function code_rec(obj, head, main, foot) {
    main.text += "```" + (obj["recipient"] ? obj["recipient"] : "") + "\n" +
        obj.content.text +
        "\n```\n";
}
function default_rec(obj, head, main, foot) {
    // 另外还有一些tool的输出结果，直接放到default里
    // "tether_browsing_display" : 浏览器结果，这个不用放

    // "tether_quote" :这个不用放
    return;
}
// execution_output  : 代码执行器的结果，
// 并且，其metadata."aggregate_result"."jupyter_messages"列表下又有东西
// 如果某元素“msg_type”是...,其下 content.data...
// "execute_result" | "text/plain" LIKE "纯文本"，可能也会有用Html格式的"text/html" LIKE "<div></div>"此时忽略plain，直接搞html
// "display_data" | "image/vnd.openai.fileservice.png"  LIKE "file-service://file-g03e4V2QnZAQdLy0YuF4NP2Q"

async function execution_output_rec(obj, head, main, foot) {
    // 不用obj.content，因为结果在metadata里
    let messages = obj.metadata.aggregate_result.jupyter_messages;
    for (entry of messages) {
        switch (entry["msg_type"]) {
            case "execute_result":
                if ("text/html" in entry.content.data) {
                    main.text += "\n" + entry.content.data["text/html"] + "\n";
                } else if ("text/plain" in entry.content.data) {
                    main.text += entry.content.data["text/plain"] + "\n";
                } else {
                    main.text += " \n";
                }
                break;

            case "display_data":
                if ("image/vnd.openai.fileservice.png" in entry.content.data) {
                    let pic_url = entry.content.data["image/vnd.openai.fileservice.png"].split("/");
                    main.text += "![" + entry.content.data["image/vnd.openai.fileservice.png"] + "]("
                        + await FileLink(pic_url[pic_url.length - 1]) + ")\n";
                } else {
                    main.text += "**Error Image**\n";
                }
                break;
            default:
                // Ignore status etc..
                break;
        }
    }

}
// multimodal_text  : 多模态文本，其下parts列表有结构体和纯文字
// 如果是str那么就是纯文本
// 如果是结构体，那么要识别，目前只探明
// 例如，我用户只发送了一张图片，那么只有一个结构体元素，并且parts[0]的content_type是"image_asset_pointer"
// "asset_pointer"是"file-service://file-xQf3UoRIqvmKecw5PKTxU2qr"，可以通过对应api获得图片外链内嵌到文字中
async function multimodal_text_rec(obj, head, main, foot) {
    let parts = obj.content.parts;
    let text = "";
    for (let entry of parts) {
        switch (entry["content_type"]) {
            case "image_asset_pointer":
                let temp = entry["asset_pointer"].split("/");
                let pic_url = temp[temp.length - 1];
                text += "![" + temp[temp.length - 1] + "](" + await FileLink(pic_url) + ")\n";
                break;
            case undefined:
                text += entry + "\n";
                break;
            default:
                text += "[不受支持的嵌入]" + entry + "\n";
                break;
        }
    }

    if ("citations" in obj.metadata && obj.metadata.citations.length > 0) {
        // 替换
        text = util_citations(obj, head, main, foot, text);
    }
    main.text += text + "\n";
    if ("attachments" in obj.metadata && obj.metadata.attachments.length > 0) {
        // 自动附加文件
        await util_attachments(obj, head, main, foot);
    }
}
// "system_error"  ：代码执行器的另一种结果，表示失败,text也是文本
`Example
"content": {
    "content_type": "system_error",
    "name": "AceInternalException",
    "text": "Encountered exception: <class 'ace_common.ace_exception.AceInternalException'>."
}
`
function system_error_rec(obj, head, main, foot) {
    main.text += (obj.content["name"] ? obj.content["name"] : "Unknown Exception")
        + (obj.content["text"] ? obj.content["text"] : "No description") + "\n\n";
}
// text  : 纯文本，其下parts列表只有一个元素，且直接是文本
// 关注其下metadata，如果citations列表非空，过一个自动脚注生成，再将文本中【6†source】替换成[^6](没错中英文搜搜都是这样)
// citations列表的元素，也有一个metadata，其下title,url,text,extra."cited_message_idx"是序号
// 注意，因为会多次引用同一篇文章，因此，文末的脚注要最后加[^6]这种是不断扩充\nstr的语句，可以维护一个字典
async function text_rec(obj, head, main, foot) {
    let text = obj.content.parts[0] ? obj.content.parts[0] : " ";
    if ("citations" in obj.metadata && obj.metadata.citations.length > 0) {
        // 替换
        text = util_citations(obj, head, main, foot, text);
    }
    main.text += text + "\n";
    if ("attachments" in obj.metadata && obj.metadata.attachments.length > 0) {
        // 自动附加文件
        await util_attachments(obj, head, main, foot);
    }
}
async function util_attachments(obj, head, main, foot) {
    // 所有对话的metadata.attachments列表如果非空，那么要识别其中元素的id，制作下载链接，文件名是元素的.name，大小是元素的.size

    // 根据传入的事项，在main中添加相应内容
    head["has_file"] = true;
    let attachments_list = obj.metadata.attachments;
    main.text += "**附件**\n|Name|Size|\n|---|---|\n";
    for (let attach_ele of attachments_list) {
        let file_name = attach_ele["name"] ? attach_ele["name"] : "unknown file";
        let file_size = attach_ele["size"] ? attach_ele["size"] : "unknown size";
        let file_link = await FileLink(attach_ele["id"]);
        main.text += "|" + file_name + "|[" + file_size + "](" + file_link + ")|\n";
    }
}

function replaceCitation(text) {
    return text.replace(/【(\d+)†source】/g, '[^$1]');
}

function util_citations(obj, head, main, foot, text) {
    for (let citation_ele of obj.metadata.citations) {
        let cited_idx = citation_ele.metadata.extra.cited_message_idx ?
            citation_ele.metadata.extra.cited_message_idx : 0;
        if ((cited_idx in foot.quote) == false) {
            foot.quote[cited_idx] = "[^" + cited_idx + "]:";
        }
        foot.quote[cited_idx] += "\t[" + citation_ele.metadata.title + "]("
            + citation_ele.metadata.url + ")\n\t" +
            citation_ele.metadata.text + "\n";
    }

    if (text) {
        // 如果需要替换字符串
        return replaceCitation(text);
    }
    return text
}


async function FileLink(file_id) {
    // 假设cookie和chatgpt-account-id是全局变量
    // file_id : LIKE "file-YYCZDgOZR0E9LRlqioLD7BP1"
    let url = "https://chat-o.soruxgpt.com/backend-api/files/" + file_id + "/download"
    let myHeaders = new Headers();

    myHeaders.append("chatgpt-account-id", my_chatgpt_account_id);
    myHeaders.append("cookie", my_cookie);
    myHeaders.append("oai-language", "en-US");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    let resp = await fetch(url, requestOptions);
    if (resp.ok == true) {
        let obj = JSON.parse(await resp.text())
        if ("download_url" in obj) {
            return obj.download_url;
        }
    }
    return file_id + " is not available";
}


function TimeConvert(time_stamp) {
    // 将时间戳转换为毫秒（乘以1000）
    var date = new Date(time_stamp * 1000);

    // 创建一个函数来格式化日期
    function formatDate(date) {
        var year = date.getFullYear(); // 年
        var month = date.getMonth() + 1; // 月（月份从0开始计数，所以加1）
        var day = date.getDate(); // 日
        var hours = date.getHours(); // 时
        var minutes = date.getMinutes(); // 分
        var seconds = date.getSeconds(); // 秒

        // 将单个数字前补0
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        // 按照`年-月-日 时:分:秒`的格式返回
        return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    }

    // 调用函数并打印结果
    return formatDate(date);
}


async function ParseSortedData(sorted_data, head, main, foot) {
    // 主入口
    for (let entry of sorted_data) {
        if (("message" in entry) == false || entry.message == null) {
            continue;
        }

        switch (entry.message.content["content_type"]) {
            case "text":
                main.text += "## " + entry.message.author.role + (entry.message.author["name"] ? ("/" + entry.message.author["name"]) : "") + "\n";
                await text_rec(entry.message, head, main, foot);
                break;
            case "code":
                main.text += "## " + entry.message.author.role + (entry.message.author["name"] ? ("/" + entry.message.author["name"]) : "") + "\n";
                code_rec(entry.message, head, main, foot);
                break;
            case "execution_output":
                main.text += "## " + entry.message.author.role + (entry.message.author["name"] ? ("/" + entry.message.author["name"]) : "") + "\n";
                await execution_output_rec(entry.message, head, main, foot);
                break;
            case "multimodal_text":
                main.text += "## " + entry.message.author.role + (entry.message.author["name"] ? ("/" + entry.message.author["name"]) : "") + "\n";
                await multimodal_text_rec(entry.message, head, main, foot);
                break;
            case "system_error":
                main.text += "## " + entry.message.author.role + (entry.message.author["name"] ? ("/" + entry.message.author["name"]) : "") + "\n";
                system_error_rec(entry.message, head, main, foot);
                break;
            default:
                break;
        }
    }
}
