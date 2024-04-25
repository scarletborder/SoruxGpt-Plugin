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