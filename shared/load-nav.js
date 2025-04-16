document.addEventListener("DOMContentLoaded", function() {
    // 获取导航栏容器
    const navContainer = document.getElementById('nav-container');
    
    if (navContainer) {
        // 根据当前环境调整路径
        const isGitHubPages = window.location.hostname.includes("github.io");
        const isCustomDomain = window.location.hostname === "tripley.cn";
        const prefix = isGitHubPages ? "/yyj-gy/" : (isCustomDomain ? "/" : "");
        
        // 加载导航栏样式
        loadStylesheet(prefix + 'shared/nav-styles.css');
        
        // 加载导航栏HTML
        fetch(prefix + 'shared/nav.html')
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
                document.querySelectorAll('.nav-link, .mobile-link, .logo').forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && !href.startsWith("http")) {
                        // 对于GitHub Pages和自定义域名，添加前缀
                        if (isGitHubPages || isCustomDomain) {
                            link.setAttribute('href', prefix + href.replace(/^\.?\/*/, ""));
                        }
                    }
                });
                
                // 加载导航栏JS
                loadScript(prefix + 'shared/nav.js');
            })
            .catch(error => {
                console.error('加载导航栏失败:', error);
                // 使用简单的备用导航
                navContainer.innerHTML = `
                <header class="header">
                    <a href="index.html" class="logo">Triple-Y</a>
                    <div class="nav-links">
                        <a href="gallery.html" class="nav-link">Gallery</a>
                        <a href="film.html" class="nav-link">Film</a>
                        <a href="work.html" class="nav-link">Work</a>
                        <a href="about.html" class="nav-link">About</a>
                    </div>
                </header>`;
            });
    }
});

// 加载JavaScript文件
function loadScript(src) {
    if (!document.querySelector(`script[src="${src}"]`)) {
        const script = document.createElement('script');
        script.src = src;
        document.body.appendChild(script);
    }
}

// 加载样式表
function loadStylesheet(href) {
    if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }
} 