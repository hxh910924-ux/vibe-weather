# 技术架构文档

> 项目：氛围天气
> 开发工具：Trae
> 状态：✅ 已确认

---

## 一、技术栈

| 层级 | 技术选择 | 选择理由 |
|------|----------|----------|
| 页面框架 | 原生 HTML + CSS + JavaScript | 项目逻辑不复杂，无需框架引入，保持轻量 |
| 动效渲染 | Canvas 2D API | 原生支持，性能好，适合粒子/雨滴/雪花等效果 |
| CSS 样式 | 原生 CSS（含 backdrop-filter） | 项目无需复杂组件，原生 CSS 足够，毛玻璃效果原生支持 |
| 图标 | Emoji 内置字符 | 无需引入图标库，天气图标用 emoji 即可，保持极简 |
| 字体 | 系统字体栈 | 无需加载外部字体，保持页面秒开 |
| 数据存储 | localStorage | 存历史城市、主题偏好等轻量数据 |
| 天气 API | 和风天气免费版（QWeather） | 国内服务，免费额度充足，支持中文城市搜索和7天预报 |

---

## 二、项目结构

```
氛围天气/
├── PRDS/                  # 产品文档（本文件夹）
│   ├── requirements.md
│   ├── PRD.md
│   ├── UI.md
│   └── tech.md
├── index.html             # 主页面
├── css/
│   └── style.css          # 全局样式
├── js/
│   ├── app.js             # 主入口：初始化、事件绑定、流程控制
│   ├── weather.js         # 天气 API 调用、数据解析
│   ├── effects/
│   │   ├── index.js       # 动效管理器：根据天气类型调度对应动效
│   │   ├── sunny.js       # 晴天：暖色渐变 + 光线流动
│   │   ├── cloudy.js      # 多云：灰蓝渐变 + 云层飘动
│   │   ├── rainy.js       # 雨天：深蓝灰 + 雨滴滑落
│   │   ├── snowy.js       # 雪天：冷色调 + 雪花飘落
│   │   ├── foggy.js       # 雾天：多层模糊移动
│   │   └── night.js       # 夜间：深色 + 星光闪烁
│   └── utils/
│       ├── geo.js         # 浏览器定位
│       └── storage.js     # localStorage 读写封装
└── README.md              # 项目说明
```

---

## 三、数据结构

### localStorage 数据

```json
{
  "atmos-weather-cities": ["北京", "上海", "广州", "深圳", "成都"],
  "atmos-weather-theme": null,
  "atmos-weather-located": true
}
```

- `atmos-weather-cities`：最近选择的城市列表，最多 5 个
- `atmos-weather-theme`：手动选择的主题（null 表示跟随天气自动）
- `atmos-weather-located`：是否已授权定位

### 和风天气 API 返回数据（关键字段）

```json
{
  "location": {
    "name": "北京",
    "adm1": "北京市",
    "country": "中国"
  },
  "daily": [
    {
      "fxDate": "2026-03-31",
      "tempMax": "18",
      "tempMin": "8",
      "textDay": "晴",
      "textNight": "晴",
      "windDirDay": "东南风",
      "windScaleDay": "3",
      "precip": "0.0",
      "sunrise": "06:12",
      "sunset": "18:35"
    }
  ]
}
```

### 天气状况到动效的映射

```javascript
const weatherToEffect = {
  "晴": "sunny",
  "多云": "cloudy",
  "阴": "cloudy",
  "小雨": "rainy",
  "中雨": "rainy",
  "大雨": "rainy",
  "暴雨": "rainy",
  "小雪": "snowy",
  "中雪": "snowy",
  "大雪": "snowy",
  "雾": "foggy",
  "霾": "foggy"
};
// 日出前/日落后自动映射为 "night"
```

---

## 四、关键实现说明

### 动效渲染（Canvas 2D）

- 使用一个全屏 `<canvas>` 元素，`position: fixed; top: 0; left: 0; z-index: 0`
- 每种天气动效是一个独立的类，统一接口：`init()`, `update()`, `draw()`, `destroy()`
- 动效管理器（effects/index.js）负责：
  - 根据天气类型或手动选择实例化对应动效类
  - 切换时先用 1.5 秒渐隐当前动效，再渐显新动效
  - 统一管理 `requestAnimationFrame` 循环
- 各动效实现思路：
  - **晴天**：线性渐变背景（暖橙→淡蓝）+ 用 radialGradient 绘制缓慢移动的光斑
  - **雨天**：深蓝灰渐变底色 + 粒子系统模拟雨滴（细长线条，从上到下，带角度）+ 底部用圆形模拟水花
  - **雪天**：冷色渐变底色 + 粒子系统模拟雪花（白色圆点，大小不一，缓慢飘落带左右摆动）
  - **多云**：灰蓝渐变 + 用多个半透明椭圆组合模拟云层，缓慢从左向右飘动
  - **雾天**：多层半透明白色/灰色矩形，不同速度水平移动，模拟雾气流动
  - **夜间**：深蓝/黑色渐变 + 粒子系统模拟星光闪烁（随机位置白色小点，opacity 脉冲动画）

### 天气 API 集成（和风天气）

- 使用和风天气免费版 API，需要注册获取免费 API Key
- **城市搜索**：`https://geoapi.qweather.com/v2/city/lookup?location=关键词&key=KEY`
- **7天预报**：`https://devapi.qweather.com/v7/weather/7d?location=城市ID&key=KEY`
- API Key 存储在 localStorage，但本项目使用服务端渲染的 HTML 模板引入，因此 Key 直接写在 `weather.js` 中（免费额度下可接受，不涉及用户隐私）
- 请求失败时在页面上显示优雅的提示文字

### 浏览器定位

- 使用 `navigator.geolocation.getCurrentPosition()`
- 获取经纬度后调用和风天气的 GeoAPI 反查城市
- 定位失败时默认使用北京，并显示提示"无法获取位置，已切换为北京"
- 定位权限状态记录在 localStorage

### 响应式适配

- 使用 CSS 媒体查询适配手机竖屏和电脑横屏
- 手机端：温度字号 100px，间距缩小
- 电脑端：温度字号 140px，内容居中在一个最大宽度 600px 的区域
- Canvas 始终占满 100vw × 100vh，自动监听 resize 事件

---

## 五、开发注意事项

- 不引入任何 npm 包，所有代码原生实现
- 不使用任何 CSS 框架（Tailwind 等），全部手写 CSS
- 不使用任何前端框架（Vue、React 等），全部原生 JS
- Canvas 动效注意性能：粒子数量上限 200 个，避免内存泄漏
- API 请求使用 `fetch()`，设置 5 秒超时
- 所有 CSS 动画优先使用 `transition` 和 `animation`，JS 只负责状态切换
- 代码注释用中文
- HTML 语义化标签（header、main、section 等）
