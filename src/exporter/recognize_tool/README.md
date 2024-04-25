# 给markdown功能用的识别工具
所有文件内容将被全部复制粘贴到`SoruxGpt Exporter.js`中
## 命名规范
将根据content的`content_type`键来区分
例如text的识别导出函数是`text_rec(obj, head, main, foot)`

## 调用示例

### 参数介绍

| name | description                                        |
| ---- | -------------------------------------------------- |
| obj  | 待识别部分                                         |
| head | 头部，一般包含标题和额外需要关注的信息(如文件提醒) |
| main | 正文                                               |
| foot | 脚部，一般包括脚注                                 |



### 入参

- obj

  obj是工具在整理`sorteddata`时的entry，含有以下(树相关的信息省略，虽然也有)

  - content_type

    ```javascript
    "text"
    ```

    

  - author

    ```json
    {
    	"role": "user",
        "name": null,
        "metadata": {}
    }
    ```

  - content

    - parts 列表
  
  
    ```json
    [
        {
            "content_type": "image_asset_pointer",
            "asset_pointer": "file-service://file-YYCZDgOZR0E9LRlqioLD7BP1",
            "size_bytes": 61093,
            "width": 1139,
            "height": 607,
            "fovea": null,
            "metadata": null
        },
        {
            "content_type": "image_asset_pointer",
            "asset_pointer": "file-service://file-SwN6lLhQ6zm3haZrntQNk8I3",
            "size_bytes": 39612,
            "width": 1007,
            "height": 465,
            "fovea": null,
            "metadata": null
        },
        "What are in the two pics"
    ]
    ```
  
  - metadata
  
    ```json
    {
        "attachments": [
            {
                "height": 607,
                "id": "file-YYCZDgOZR0E9LRlqioLD7BP1",
                "mimeType": "image/png",
                "name": "QQ截图20240415171659.png",
                "size": 61093,
                "width": 1139
            },
            {
                "height": 465,
                "id": "file-SwN6lLhQ6zm3haZrntQNk8I3",
                "mimeType": "image/png",
                "name": "QQ截图20240415171727.png",
                "size": 39612,
                "width": 1007
            }
        ],
        "request_id": "879613e8ba502ee7-LAX",
        "timestamp_": "absolute",
        "message_type": null
    }
    ```
  
    
  
    - attachments列表(某些特有)
  
      ```json
      [
          {
              "height": 607,
              "id": "file-YYCZDgOZR0E9LRlqioLD7BP1",
              "mimeType": "image/png",
              "name": "QQ截图20240415171659.png",
              "size": 61093,
              "width": 1139
          },
          {
              "height": 465,
              "id": "file-SwN6lLhQ6zm3haZrntQNk8I3",
              "mimeType": "image/png",
              "name": "QQ截图20240415171727.png",
              "size": 39612,
              "width": 1007
          }
      ]
      ```
  
      
  
    - citations列表(某些特有)
  
    ```json
    [
    {
        "start_ix": 417,
        "end_ix": 427,
        "citation_format_type": "tether_og",
        "metadata": {
            "type": "webpage",
            "title": "Liu Xiaobo | Facts, Biography, & Nobel Prize | Britannica",
            "url": "https://www.britannica.com/biography/Liu-Xiaobo",
            "text": "\n【51† Liu Xiaobo】 \n\nTable of Contents \n\nIntroduction  【52† References & Edit History】 【53† Quick Facts & Related Topics】 \n\n",
            "pub_date": null,
            "extra": {
                "cited_message_idx": 6,
                "search_result_idx": null,
                "evidence_text": "source"
            }
        }
    }]
    ```
  
  - recipient 不详作用，但疑似可以显示代码类型
  
    ```javascript
    "all"
    OR
    "python"
    ```
  
    

###  出参

head, main,foot都是结构体

- head.title + head.create_time + head.export_time + head.text

- main.text

- foot.text + foot.quote[]

