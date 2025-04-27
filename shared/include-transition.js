/**
 * 转场效果引入脚本
 * 用于在所有页面中引入统一的转场效果
 */

// 检查是否已经加载了转场管理器
if (typeof TransitionManager === 'undefined') {
    // 创建脚本元素
    const script = document.createElement('script');
    script.src = 'shared/transition.js';
    script.async = false;
    
    // 添加到文档头部
    document.head.appendChild(script);
    
    console.log('转场管理器已加载');
} else {
    console.log('转场管理器已存在');
}

// 页面加载完成后初始化转场效果
document.addEventListener('DOMContentLoaded', function() {
    // 等待转场管理器加载完成
    const checkTransitionManager = setInterval(function() {
        if (typeof TransitionManager !== 'undefined') {
            clearInterval(checkTransitionManager);
            
            // 初始化转场效果
            TransitionManager.init();
            
            // 应用模糊转场效果到页面内容
            TransitionManager.applyBlurEffect();
            
            console.log('转场效果已初始化');
        }
    }, 50);
});
