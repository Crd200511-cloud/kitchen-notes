# 食谱记录网站

一个轻量的静态网站，用来记录菜名、材料和更细化的做法步骤。

## 功能

- 新增食谱
- 编辑已有食谱
- 删除食谱
- 搜索食谱
- 结构化步骤填写
- 使用浏览器本地存储保存数据
- 自带实时预览和示例数据
- 粘贴分享文案后自动整理菜名、材料和步骤

## 查看方式

直接打开这个文件即可：

- `/Users/chenruidong/Documents/New project/index.html`

你可以：

- 在 Finder 里双击 `index.html`
- 或者拖进浏览器里打开
- 打开后直接录入和管理食谱

如果你要使用 `AI 智能整理`，建议改用本地服务方式启动：

1. 复制 `.env.example` 为 `.env`
2. 把你的 `OPENAI_API_KEY` 填进去
3. 安装依赖后运行 `npm start`
4. 在浏览器打开 `http://127.0.0.1:3000`

如果你把前端部署到 Vercel、后端部署到 Render，需要把 [config.js](/Users/chenruidong/Documents/New%20project/config.js) 里的 `apiBaseUrl` 改成你的线上后端地址，例如：

```js
window.KITCHEN_NOTES_CONFIG = {
  apiBaseUrl: "https://your-api.onrender.com"
};
```

如果你像现在这样把“网页和后端接口”一起部署在同一个 Render 服务里，那么 [config.js](/Users/chenruidong/Documents/New%20project/config.js) 可以保持为空，不需要单独填写线上 API 地址。

## 主要文件

- `index.html`：网页结构
- `config.js`：前端 API 地址配置
- `styles.css`：页面样式
- `script.js`：交互逻辑和本地存储
- `server.mjs`：本地服务端和 OpenAI 接口调用
- `src/`：上线版后端骨架（路由、控制器、服务）
- `database/schema.sql`：数据库建表脚本
- `render.yaml`：Render 一体化部署配置
- `.env.example`：环境变量示例
- `preview.html`：之前保留的演示预览页
- `docs/wechat-miniapp-skeleton.md`：微信小程序版本骨架设计
- `docs/ai-service-productization.md`：AI 能力给别人接入的方案
- `docs/production-backend-design.md`：上线版数据库和接口设计
- `docs/launch-roadmap.md`：给别人使用的上线路线图
- `docs/render-deployment.md`：Render 一体化部署说明

## 录入规则

- 材料：一行写一个，比如 `鸡蛋 2个`
- 做法：按步骤卡片填写，每一步都可以单独写标题、具体动作、时长/火候和小提示

## 导入说明

当前版本支持：

- 粘贴抖音或小红书的分享文案、笔记正文、复制出来的做法说明
- 自动尝试整理出菜名、材料和步骤并带入表单
- 支持选择导入文本类型：完整笔记、分享文案、口语教程整理
- 会把不确定的内容放进“待确认内容”和“补充备注”区域
- 接入 OpenAI API 后可使用 `AI 智能整理`

当前版本暂不支持：

- 只粘贴一个平台链接，就自动抓取原始视频或笔记完整内容
- 直接上传视频并自动语音识别、画面识别

这些能力后续需要服务端、平台接口或 AI 识别能力接入后再补。

## 让识别更准的小建议

- 优先粘贴完整一点的原文，不要只贴一句标题
- 如果原文里有 `材料 / 做法 / 步骤` 这样的分段，识别会更准
- 如果是口语化很强的内容，先选择“口语教程整理”再导入
- 导入后记得看一下“待确认内容”，那里会保留暂时没有识别清楚的信息

数据保存在浏览器本地缓存里，适合先把产品形态和内容跑起来。后续如果你想要，我还可以继续帮你加：

- 分类管理
- 搜索食谱
- 图片上传
- 导出打印
- 登录和云端同步
- 再转换成微信小程序版本
