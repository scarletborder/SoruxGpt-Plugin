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