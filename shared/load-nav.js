document.addEventListener("DOMContentLoaded", function() {
    // 获取导航栏容器
    const navContainer = document.getElementById('nav-container');
    
    if (navContainer) {
        // 加载导航栏样式
        loadStylesheet('shared/nav-styles.css');
        
        // 加载导航栏HTML
        fetch('shared/nav.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('无法加载导航栏: ' + response.statusText);
                }
                return response.text();
            })
            .then(html => {
                // 插入导航栏HTML
                navContainer.innerHTML = html;
                
                // 修复导航链接路径（移除开头的斜杠）
                fixNavigationLinks();
                
                // 加载导航栏JS
                loadScript('shared/nav.js');
            })
            .catch(error => {
                console.error('加载导航栏失败:', error);
            });
    }
});

// 修复导航链接中的路径问题
function fixNavigationLinks() {
    // 获取所有导航链接
    const links = document.querySelectorAll('.nav-link, .mobile-link, .logo');
    
    // 移除所有链接路径中的开头斜杠
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('/')) {
            link.setAttribute('href', href.substring(1));
        }
    });
}

// 加载JavaScript文件
function loadScript(src) {
    // 检查是否已经加载了脚本
    if (!document.querySelector(`script[src="${src}"]`)) {
        const script = document.createElement('script');
        script.src = src;
        document.body.appendChild(script);
    }
}

// 加载样式表
function loadStylesheet(href) {
    // 检查是否已经加载了样式表
    if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }
} 