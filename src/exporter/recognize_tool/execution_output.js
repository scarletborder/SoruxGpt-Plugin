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