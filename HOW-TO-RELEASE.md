# 周刊发布流程

1. 触发 Github Actions 中的 release action：

![image](https://user-images.githubusercontent.com/9262426/157417402-55796bb6-77c4-484b-8b96-a3c3ac67e137.png)

2. 执行完毕后会产出一个 Pull request：

![image](https://user-images.githubusercontent.com/9262426/157417941-903b7cb5-62a8-48f7-a6d0-826fcd1debb4.png)

3. 本次 Pull request 所在分支为 `release/new-post`，可以本地进行一些修改后提交，更新 Pull request。一些需要手动修改的内容：

    1. 增加头图
    2. 调整分类
    3. 增加`第X期`

4. 发给其他评委进行审阅。
5. 如果要修改，回到步骤 3。
6. 如果不需要修改，合入 Pull request 即可。相关 Issue 会被自动关闭。
7. 更新首页的 README.md。
9. 在其他渠道发布：

    1. 微信公众号
    2. 知乎
    3. 邮件
