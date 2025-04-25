# Gallery网站优化文档

## 代码优化概述

我们对Gallery网站进行了一系列优化，主要集中在以下几个方面：

### 1. CSS优化

- **CSS变量**：使用CSS变量统一管理颜色、间距和过渡效果
- **减少嵌套**：CSS选择器嵌套层级控制在2层以内
- **分离文件**：将CSS从HTML中分离到单独的文件中
- **媒体查询整合**：统一管理媒体查询，避免重复断点定义

### 2. JavaScript模块化

- **功能模块拆分**：
  - `video-handlers.js`：处理视频加载和播放
  - `gallery-main.js`：负责页面初始化和统筹管理

- **单一职责**：每个函数只负责一个功能，保持在50行以内
- **异步优化**：使用Promise和async/await管理异步操作

### 3. 性能优化

- **视频加载优化**：
  - 懒加载视频 `loading="lazy"`
  - 为视频添加尺寸 `width`/`height`属性防止布局偏移
  - 根据设备提供不同分辨率视频

- **可访问性**：
  - 为视频提供多种格式兼容不同浏览器
  - 添加描述性alt文本

### 4. 代码可维护性

- **代码组织**：
  - 文件结构整理，模块化管理
  - 使用CSS变量代替硬编码值

- **注释**：
  - 为函数和文件添加文档化注释
  - 说明各部分功能和职责

## 文件结构

```
artistweb/
├── css/
│   └── gallery.css     # 分离的样式文件
├── js/
│   ├── video-handlers.js  # 视频处理模块
│   └── gallery-main.js    # 主逻辑模块
├── shared/
│   ├── load-nav.js
│   └── animation.js
└── gallery.html        # 主HTML文件（已优化）
```

## 兼容性与性能

- 支持常见现代浏览器
- 针对移动和桌面端进行了优化
- 视频加载策略根据设备类型自动调整

## 未来可能的优化方向

1. 使用更现代的视频格式如AVIF进一步减少流量消耗
2. 添加更多无障碍特性，如ARIA属性
3. 进一步优化首屏加载速度
4. 实现服务端渲染提升SEO

# 统一导航栏使用指南

这个项目实现了一个统一的导航栏组件，可以在所有页面中使用，便于统一修改和维护。

## 文件结构

```
shared/
  ├── nav.html      # 导航栏HTML结构
  ├── nav-styles.css # 导航栏样式
  ├── nav.js        # 导航栏交互逻辑
  └── load-nav.js   # 导航栏加载器
```

## 如何使用

要在页面中使用统一导航栏，只需要按照以下步骤操作：

1. 在页面 `<head>` 中添加必要的字体:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Reenie+Beanie&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Poiret+One&display=swap" rel="stylesheet">
```

2. 在页面中添加导航栏容器:

```html
<div id="nav-container"></div>
```

3. 在 `</body>` 前添加导航栏加载脚本:

```html
<script src="/shared/load-nav.js"></script>
```

## 如何修改导航栏

当需要修改导航栏时，只需要修改 `shared` 文件夹中的文件：

- **修改导航栏结构**：编辑 `nav.html` 文件
- **修改导航栏样式**：编辑 `nav-styles.css` 文件
- **修改导航栏逻辑**：编辑 `nav.js` 文件

所有页面将自动使用更新后的导航栏组件。

## 注意事项

- 确保所有页面都引用了相同版本的字体
- 页面内容应该有适当的顶部内边距，以避免被导航栏遮挡
- 导航栏自动处理当前页面的激活状态

## 示例

可以参考 `index-example.html` 文件，了解如何正确集成统一导航栏。

## 3D Lanyard组件

这个项目包含一个使用Three.js和React Three Fiber实现的3D挂绳组件。挂绳具有真实的物理效果，可以自然摆动。

### 如何使用

1. 确保已安装必要的依赖：

```bash
npm i three meshline @react-three/fiber @react-three/drei @react-three/rapier
```

2. 将必要的资源文件放在正确的位置：
   - `src/assets/lanyard/card.glb` - 卡片3D模型
   - `src/assets/lanyard/lanyard.png` - 挂绳纹理图片

3. 在组件中使用：

```jsx
import Lanyard from './components/Lanyard'

<Canvas>
  <Physics gravity={[0, -40, 0]}>
    <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
  </Physics>
</Canvas>
```

### 可自定义属性

- `position`: 挂绳在3D空间中的位置
- `gravity`: 重力向量，影响挂绳的摆动方式

### 修改3D模型

可以使用以下在线编辑器修改card.glb文件：
https://modelviewer.dev/editor/ 