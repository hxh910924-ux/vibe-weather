# 氛围天气

一个以沉浸式动效为核心的天气网页应用。它不强调复杂指标，而是用全屏 Canvas 动效把天气状态转成可感知的氛围。

## 本地运行

直接用任意静态服务器打开项目根目录即可，例如：

```powershell
cd C:\Users\ThinkPad\Documents\Codex\vibe-weather
python -m http.server 8080
```

然后访问 `http://localhost:8080`。

## API 配置

项目默认带有无 API Key 的降级模式：

- 城市搜索会使用内置热门城市
- 天气数据会展示示例 7 日数据

如果你要接入真实和风天气数据，请在 `index.html` 底部把 `window.ATMOS_WEATHER_CONFIG.qweatherKey` 改成你的 key。

## 目录结构

```text
vibe-weather/
├── index.html
├── css/style.css
├── js/app.js
├── js/weather.js
├── js/effects/
├── js/utils/
└── 氛围天气-PRDS/
```
