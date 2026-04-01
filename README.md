# 氛围天气 (Vibe Weather)

简约沉浸式天气展示应用

## 功能

- 🌡️ 实时天气数据（使用Open-Meteo免费API）
- 🎨 6种天气动效：晴天、多云、雨天、雪天、雾天、夜间
- 🔍 城市搜索
- 📱 响应式设计
- 💾 本地存储记住偏好

## 技术栈

- 原生 HTML + CSS + JavaScript
- Canvas 2D 动态效果
- Open-Meteo 免费天气API
- 浏览器定位API

## 运行

```bash
# 启动本地服务器
python -m http.server 8080

# 或使用任意静态服务器
npx serve .
```

然后访问 http://localhost:8080

## 项目结构

```
├── index.html          # 主页面
├── css/
│   └── style.css       # 样式
├── js/
│   ├── app.js         # 主应用逻辑
│   ├── weather.js     # 天气API
│   ├── effects/       # 动效模块
│   └── utils/         # 工具函数
└── 氛围天气-PRDS/     # 产品需求文档
```