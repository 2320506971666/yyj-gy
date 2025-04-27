# 统一转场效果使用指南

本文档介绍如何在网站的所有页面中使用统一的转场效果，以实现一致的用户体验。

## 概述

我们创建了一个统一的转场效果管理器 `unified-transition.js`，它可以：

1. 自动检测页面类型（普通页面或 iframe 页面）
2. 应用适当的转场效果
3. 处理页面导航和模糊渐变效果

## 文件结构

- `shared/unified-transition.js` - 统一的转场效果管理器（包含所有样式和逻辑）

## 在所有页面中使用

### 1. 引入脚本

在每个页面的 `<head>` 或 `<body>` 末尾添加以下代码：

```html
<!-- 引入统一转场效果管理器 -->
<script src="shared/unified-transition.js"></script>
```

### 2. 自动应用效果

脚本会自动：
- 检测页面类型（普通页面或 iframe 页面）
- 应用适当的转场效果
- 处理页面导航

### 3. 使用转场效果

#### 普通页面中的链接

普通页面中的链接会自动应用转场效果，无需额外代码。

#### iframe 页面中的链接

在 `index.html` 中，使用 `navigateTo()` 函数进行页面导航：

```html
<a onclick="navigateTo('gallery.html')">Gallery</a>
```

### 4. 手动控制转场效果

如果需要手动控制转场效果，可以使用以下方法：

```javascript
// 显示转场覆盖层
UnifiedTransition.showOverlay();

// 隐藏转场覆盖层
UnifiedTransition.hideOverlay();

// 应用模糊效果
UnifiedTransition.applyBlurEffect();

// 导航到指定页面
UnifiedTransition.navigateTo('page.html');
```

## 注意事项

1. **移除冗余代码**：使用统一的转场效果管理器后，应该移除页面中的以下冗余代码：
   - 页面转场相关的 CSS 样式（`.page-transition` 等）
   - 页面转场相关的 JavaScript 代码
   - 自定义的转场效果实现

2. **iframe 内容**：在 `index.html` 中，iframe 内容页面不需要导航栏，但可以保留页脚。

3. **模型页面特殊处理**：`model.html` 页面有特殊的加载进度显示，由 `unified-transition.js` 处理。

## 示例

### 普通页面

```html
<!DOCTYPE html>
<html>
<head>
    <title>页面标题</title>
    <!-- 引入统一转场效果管理器 -->
    <script src="shared/unified-transition.js"></script>
</head>
<body>
    <!-- 页面内容 -->
    <div class="content">
        <h1>页面标题</h1>
        <p>页面内容</p>
        <a href="other-page.html">跳转到其他页面</a>
    </div>
</body>
</html>
```

### index.html

```html
<!DOCTYPE html>
<html>
<head>
    <title>Triple-Y</title>
    <!-- 引入统一转场效果管理器 -->
    <script src="shared/unified-transition.js"></script>
</head>
<body>
    <!-- 导航栏 -->
    <div class="header-container">
        <header class="header">
            <a class="logo" onclick="navigateTo('model.html')">Triple-Y</a>
            <div class="nav-links">
                <a class="nav-link" id="gallery-link" onclick="navigateTo('gallery.html')">Gallery</a>
                <a class="nav-link" id="film-link" onclick="navigateTo('film.html')">Film</a>
                <a class="nav-link" id="work-link" onclick="navigateTo('work.html')">Work</a>
                <a class="nav-link" id="about-link" onclick="navigateTo('about.html')">About</a>
            </div>
        </header>
    </div>
    
    <!-- 加载动画 -->
    <div id="loading-overlay">
        <div class="loading-content">
            <div class="loading-logo">Triple-Y</div>
            <div class="loading-percentage">0%</div>
        </div>
    </div>
    
    <!-- 内容框架 -->
    <iframe id="content-frame" src="./model.html" title="页面内容" class="visible"></iframe>
</body>
</html>
```
