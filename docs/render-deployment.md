# Render 一体化部署说明

## 为什么推荐 Render 一体化部署

当前项目的后端已经同时提供：

- 网页静态资源
- AI 接口

所以最简单的公网方案不是“前端 Vercel + 后端 Render”，而是直接把整个项目部署成一个 Render Web Service。

这样最终你只会得到一个公网链接，比如：

- `https://kitchen-notes.onrender.com`

别人点开就能直接使用，AI 也走同域名，不需要再配前端跨域地址。

## 当前项目已经具备的条件

- `server.mjs` 会托管首页和静态资源
- `/api/parse-recipe` 已可用
- `render.yaml` 已经准备好

## 你在 Render 里需要做的事

### 方法一：Blueprint 部署

如果你的项目已经放在 GitHub 上：

1. 登录 Render
2. 选择 `New +`
3. 选择 `Blueprint`
4. 连接你的 GitHub 仓库
5. Render 会识别根目录下的 `render.yaml`
6. 确认创建服务

### 方法二：普通 Web Service

如果不用 Blueprint，也可以手动创建：

1. 登录 Render
2. 点击 `New +`
3. 选择 `Web Service`
4. 连接 GitHub 仓库
5. 配置：
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

## 环境变量

至少要配置：

- `OPENAI_API_KEY`

建议配置：

- `OPENAI_MODEL=gpt-4o-mini`
- `HOST=0.0.0.0`
- `PORT=10000`

## 部署成功后的验证

Render 给你公网地址后，先验证：

### 首页

打开：

- `https://你的域名.onrender.com`

### 健康检查

打开：

- `https://你的域名.onrender.com/api/health`

如果返回：

```json
{"ok":true}
```

说明服务运行正常。

### AI 接口

在网页里点一次 `AI 智能整理`，确认能成功回填结构化结果。

## 当前项目不需要额外配置 `config.js`

因为整站都走同一个 Render 域名：

- 网页是这个域名
- AI 接口也是这个域名

所以 `config.js` 可以保持：

```js
window.KITCHEN_NOTES_CONFIG = {
  apiBaseUrl: ""
};
```

## 风险提示

- Render 免费实例可能会休眠，第一次打开会慢一点
- 如果公开给很多人使用，最好尽快加登录、数据库和 AI 次数限制
