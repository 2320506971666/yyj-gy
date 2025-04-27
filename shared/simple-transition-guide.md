# 简化版转场效果使用指南

本文档介绍如何使用简化版的转场效果管理器，实现高级模糊转场效果。

## 概述

`simple-transition.js` 是一个简化版的转场效果管理器，具有以下特点：

1. **只保留高级模糊转场效果**：移除了所有冗余功能
2. **动态转场时间**：转场时间根据页面加载情况动态调整，而不是使用固定值
3. **自动检测页面类型**：自动区分普通页面和 iframe 页面（index.html）
4. **预加载机制**：在显示转场效果的同时预加载目标页面，实现更平滑的转场体验

## 使用方法

### 1. 在所有页面中引入脚本

在每个页面的 `<head>` 或 `<body>` 末尾添加：

```html
<script src="shared/simple-transition.js"></script>
```

### 2. 自动应用效果

脚本会自动：
- 检测页面类型（普通页面或 iframe 页面）
- 应用模糊转场效果
- 处理页面导航

### 3. 链接处理

#### 普通页面中的链接

普通页面中的链接会自动应用转场效果，无需额外代码。

#### index.html 中的链接

在 `index.html` 中，使用 `onclick="navigateTo('page.html')"` 属性：

```html
<a onclick="navigateTo('gallery.html')">Gallery</a>
```

## 工作原理

### 普通页面转场

1. 用户点击链接
2. 显示黑色转场覆盖层
3. 预加载目标页面
4. 目标页面加载完成后自动跳转
5. 目标页面加载后应用模糊渐变效果

### iframe 页面转场 (index.html)

1. 用户点击导航链接
2. iframe 内容淡出（应用模糊效果）
3. 预加载目标页面
4. 目标页面加载完成后更新 iframe src
5. iframe 加载完成后自动淡入（清晰显示）

## 优点

1. **代码简洁**：移除了所有冗余功能，只保留核心转场效果
2. **动态转场时间**：根据页面加载情况动态调整转场时间，提供更平滑的体验
3. **预加载机制**：在显示转场效果的同时预加载目标页面，减少等待时间
4. **自动检测**：自动区分普通页面和 iframe 页面，无需手动配置

## 示例

### 普通页面

```html
<!DOCTYPE html>
<html>
<head>
    <title>页面标题</title>
    <script src="shared/simple-transition.js"></script>
</head>
<body>
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
    <script src="shared/simple-transition.js"></script>
</head>
<body>
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
    
    <iframe id="content-frame" src="./model.html" title="页面内容"></iframe>
</body>
</html>
```
