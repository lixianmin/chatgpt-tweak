

# ChatGPT Tweak

[English Online Document](https://github.com/lixianmin/chatgpt-tweak/blob/dev/README.md)


#### 1 安装

[<img src="https://user-images.githubusercontent.com/3750161/214147732-c75e96a4-48a4-4b64-b407-c2402e899a75.PNG" height="67" alt="Chrome" valign="middle">](https://chrome.google.com/webstore/detail/chatgpt-tweak/hpflaeanaohienflejiplkjhoiclkepj/related?hl=zh-CN&authuser=0)



#### 2 为什么需要ChatGPT Tweak？

##### 1 主要功能

1. **自定义提示语**：在文本框中输入/可以列出当前自定义的提示语。如果你需要每次发送消息给ChatGPT时都附带某个提示语，可以通过鼠标点击选中该提示语
2. **快速切换历史消息**：在输入框中按上下箭头键（↑↓），可切换历史消息，方便快速调整后重新发送

<img src="./src/assets/images/content.png" style="zoom:100%" />

<img src="./src/assets/images/options.png" style="zoom:100%" />



##### 2 小贴士

1. 支持有限的几个命令，表现为在文本框中输入`Enter`是执行命令，而不是向ChatGPT发送消息：
   1. help：输出帮助文档
   2. history：打印最近的消息列表
2. 历史命令展开：类似于linux shell，通过输入`!56`并回车，可以快速输入第56号history命令
3. 当输入焦点不在文本框中时，按下Enter后，文本框快速获得输入焦点
4. UI界面支持中英文



<img src="./src/assets/images/history.png" style="zoom:100%" />

<img src="./src/assets/images/help.png" style="zoom:100%" />



#### 3 Todo

1. 批量import和export prompts的功能
2. tab键展开历史命令的功能，这样才能方便修改
3. 当prompts越来越多的时候，通过tab展开prompts的name? 
4. 加入一个prompts命令，打印所有的prompts提示语？
5. options页面布局，是不是太大了？如果改成小按钮，鼠标过去后tips出来， 是否更方便合理一些？
6. 可以用拖动的方式，对prompts进行重新排版，不仅仅是指在settings页面，也可以是dropdown list中


---


如果您喜欢这个插件，可以考虑请作者[喝杯咖啡](https://www.buymeacoffee.com/lixianmin)，当然作者更喜欢喝茶。[<a href="https://www.buymeacoffee.com/lixianmin" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" height="45px" width="162px" alt="Buy Me A Coffee"></a>](https://www.buymeacoffee.com/anzorq)

有任何建议或想法，可以考虑加作者微信`panda-unique`，或者发邮件：`lixianmin#gmail.com` （请自行替换#为@）