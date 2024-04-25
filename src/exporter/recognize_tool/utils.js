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