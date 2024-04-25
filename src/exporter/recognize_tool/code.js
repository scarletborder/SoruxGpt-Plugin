// code  : 代码执行器，他会跟一个儿子表示其执行结果
function code_rec(obj, head, main, foot) {
    main.text += "```" + (obj["recipient"] ? obj["recipient"] : "") + "\n" +
        obj.content.text +
        "\n```\n";
}