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