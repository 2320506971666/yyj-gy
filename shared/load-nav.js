document.addEventListener("DOMContentLoaded", function() {
    // 路径处理 - 添加此部分来解决路径问题
    const isGitHubPages = window.location.hostname.includes("github.io");
    const isCustomDomain = window.location.hostname === "tripley.cn";
    const prefix = isGitHubPages ? "/yyj-gy/" : (isCustomDomain ? "/" : "./");
    
    // 获取导航栏容器
    const navContainer = document.getElementById('nav-container');
    
    if (navContainer) {
        // 加载导航栏样式 - 修改路径
        loadStylesheet(fixPath('shared/nav-styles.css'));
        
        // 加载导航栏HTML
        fetch(fixPath('shared/nav.html'))
            .then(response => {
                if (!response.ok) {
                    throw new Error('无法加载导航栏: ' + response.statusText);
                }
                return response.text();
            })
            .then(html => {
                // 插入导航栏HTML
                navContainer.innerHTML = html;
                
                // 修复导航链接路径
                fixNavigationLinks();
                
                // 加载导航栏JS
                loadScript(fixPath('shared/nav.js'));
            })
            .catch(error => {
                console.error('加载导航栏失败:', error);
            });
    }
    
    // 辅助函数：修复路径
    function fixPath(path) {
        if (path && !path.startsWith("http")) {
            return prefix + path.replace(/^\.?\/*/, "");
        }
        return path;
    }
});

// 修复导航链接中的路径问题
function fixNavigationLinks() {
    // 获取所有导航链接
    const links = document.querySelectorAll('.nav-link, .mobile-link, .logo');
    
    // 确定正确的路径前缀
    const isGitHubPages = window.location.hostname.includes("github.io");
    const isCustomDomain = window.location.hostname === "tripley.cn";
    const prefix = isGitHubPages ? "/yyj-gy/" : (isCustomDomain ? "/" : "./");
    
    // 修复所有链接路径
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith("http")) {
            // 移除前导斜杠，然后添加正确的前缀
            const cleanPath = href.replace(/^\.?\/*/, "");
            link.setAttribute('href', prefix + cleanPath);
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