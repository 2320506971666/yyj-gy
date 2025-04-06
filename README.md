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