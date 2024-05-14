prefix = """// ==UserScript==
// @name         SoruxGpt Exporter
// @namespace    http://scarletborders.top/
// @license      MIT
// @version      4.0
// @description  Export function for soruxgpt.com
// @author       scarletborder
// @match        *://chat-o.soruxgpt.com/*
// @match        *://chatgpt.com/*
// @icon         https://s2.loli.net/2024/04/22/3Pazvy9poqBYOrW.png
// @grant        GM_registerMenuCommand
// @grant        GM_cookie
// @grant        unsafeWindow
// @downloadURL  https://raw.githubusercontent.com/scarletborder/SoruxGpt-Plugin/main/SoruxGpt%20Exporter.js
// @updateURL    https://raw.githubusercontent.com/scarletborder/SoruxGpt-Plugin/main/SoruxGpt%20Exporter.js
// ==/UserScript==
"""


with open("SoruxGpt Exporter.js", "w", encoding="utf-8") as output:
    output.write(prefix)

    t = open("src/exporter/utils.js", "r", encoding="utf-8")
    output.write(t.read() + "\n")
    t.close()

    t = open("src/exporter/exporter.js", "r", encoding="utf-8")
    output.write(t.read() + "\n")
    t.close()

    t = open("src/exporter/recognize_tool/code.js", "r", encoding="utf-8")
    output.write(t.read() + "\n")
    t.close()

    t = open("src/exporter/recognize_tool/default.js", "r", encoding="utf-8")
    output.write(t.read() + "\n")
    t.close()

    t = open("src/exporter/recognize_tool/execution_output.js", "r", encoding="utf-8")
    output.write(t.read() + "\n")
    t.close()

    t = open("src/exporter/recognize_tool/multimodal_text.js", "r", encoding="utf-8")
    output.write(t.read() + "\n")
    t.close()

    t = open("src/exporter/recognize_tool/system_error.js", "r", encoding="utf-8")
    output.write(t.read() + "\n")
    t.close()

    t = open("src/exporter/recognize_tool/text.js", "r", encoding="utf-8")
    output.write(t.read() + "\n")
    t.close()

    t = open("src/exporter/recognize_tool/utils.js", "r", encoding="utf-8")
    output.write(t.read() + "\n")
    t.close()
