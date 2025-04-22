document.addEventListener("DOMContentLoaded", function() {
    console.log("load-nav.js 加载");
    // 获取当前页面名称
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // 根据当前页面设置 body 类名
    setBodyClass(currentPage);

    // 获取导航栏容器
    const navContainer = document.getElementById('nav-container');

    if (navContainer) {
        console.log("找到导航容器，开始加载导航栏");

        // 检查是否已经加载了导航内容
        if (navContainer.querySelector('.header-container')) {
            console.log("导航栏内容已存在，直接加载JS");
            // 如果已有导航结构，只加载JS
            loadNavJs();
            return;
        }

        // 根据当前环境调整路径
        const isGitHubPages = window.location.hostname.includes("github.io");
        const isCustomDomain = window.location.hostname === "tripley.cn";
        
        // 修改前缀逻辑，确保路径始终正确
        let prefix = "";
        
        // 强制输出当前主机名，帮助调试
        console.log("当前主机名:", window.location.hostname);
        console.log("是否GitHub Pages:", isGitHubPages);
        console.log("是否自定义域名:", isCustomDomain);
        
        // 无论GitHub Pages还是自定义域名，都使用相对路径
        // 这样可以确保导航栏在任何环境下都能正确加载
        
        // 加载导航栏样式
        loadStylesheet('shared/nav-styles.css');

        // 加载导航栏HTML
        loadNavHtml(prefix, navContainer, 1);
    }

    // 紧急修复汉堡菜单 - 用于所有页面
    createEmergencyBurgerMenu();

    // 监听窗口大小变化，确保汉堡菜单随时可用
    window.addEventListener('resize', function() {
        // 延迟执行，避免频繁触发
        if (this.resizeTimer) clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(function() {
            console.log('窗口大小改变，重新检查汉堡菜单');
            createEmergencyBurgerMenu();
        }, 200);
    });

    // 添加全局样式来隐藏原始汉堡菜单和移动导航链接
    const globalStyle = document.createElement('style');
    globalStyle.setAttribute('data-source', 'load-nav-global');
    globalStyle.textContent = `
        /* 隐藏所有可能冲突的原始导航元素 */
        .mobile-menu-button:not([data-source="emergency"]),
        .mobile-menu:not([data-source="emergency"]) {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }
    `;
    document.head.appendChild(globalStyle);

    // 页面加载2秒后执行一次彻底检查，确保隐藏所有冲突元素
    setTimeout(function() {
        // 隐藏所有可能冲突的移动菜单元素
        document.querySelectorAll('.mobile-menu-button, .mobile-menu').forEach(el => {
            if (!el.hasAttribute('data-source') || el.getAttribute('data-source') !== 'emergency') {
                el.style.display = 'none !important';
                el.style.visibility = 'hidden !important';
                el.style.opacity = '0 !important';
                el.style.pointerEvents = 'none !important';
            }
        });

        // 确保我们的紧急汉堡菜单是唯一可见的
        document.querySelectorAll('[data-source="emergency"]').forEach(el => {
            if (el.classList.contains('main-burger-icon')) {
                el.style.display = 'flex';
                el.style.visibility = 'visible';
                el.style.opacity = '1';
            }
        });

        console.log('页面导航元素最终清理完成');
    }, 2000);
});

// 根据当前页面设置 body 类名
function setBodyClass(currentPage) {
    // 清除所有页面类名
    document.body.classList.remove(
        'index-page', 'gallery-page', 'film-page', 'work-page', 'about-page',
        'tibet-page', 'north-page', 'sanya-page'
    );

    // 根据当前页面设置对应的类名
    switch(currentPage) {
        case 'index.html':
        case '':
            document.body.classList.add('index-page');
            break;
        case 'gallery.html':
            document.body.classList.add('gallery-page');
            break;
        case 'film.html':
            document.body.classList.add('film-page');
            break;
        case 'work.html':
            document.body.classList.add('work-page');
            break;
        case 'about.html':
            document.body.classList.add('about-page');
            break;
        // Gallery 子页面
        case 'tibet.html':
            document.body.classList.add('tibet-page');
            break;
        case 'north.html':
            document.body.classList.add('north-page');
            break;
        case 'sanya.html':
            document.body.classList.add('sanya-page');
            break;
    }
}

// 创建紧急汉堡菜单函数 - 确保所有页面都有可用的汉堡菜单
function createEmergencyBurgerMenu() {
    // 先检查是否为移动设备
    if (window.innerWidth <= 768) {
        console.log('移动设备：激活全站紧急汉堡菜单');

        // 移除所有现有的紧急汉堡菜单实例
        document.querySelectorAll('[data-source="emergency"]').forEach(el => {
            el.remove();
        });

        // 创建唯一的菜单ID - 使用固定ID而非随机值，确保始终只有一个实例
        const menuId = 'emergency_burger_menu';

        // 获取当前页面名称，用于设置激活状态
        const fullPath = window.location.pathname;
        const currentPage = fullPath.split('/').pop() || 'index.html';
        console.log('紧急汉堡菜单当前页面:', currentPage);

        // 强制输出当前页面路径，帮助调试
        console.log('完整路径:', fullPath);
        console.log('当前页面名称:', currentPage);

        // 根据当前页面设置激活状态
        let galleryActive = '';
        let workActive = '';
        let aboutActive = '';
        let filmActive = '';

        // 根据当前页面名称设置对应链接的激活状态
        switch(currentPage.toLowerCase()) {
            case 'gallery.html':
            // Gallery 子页面也需要激活 Gallery 链接
            case 'tibet.html':
            case 'north.html':
            case 'sanya.html':
                galleryActive = 'style="color: #DE2910 !important;" class="active"';
                break;
            case 'work.html':
                workActive = 'style="color: #DE2910 !important;" class="active"';
                break;
            case 'about.html':
                aboutActive = 'style="color: #DE2910 !important;" class="active"';
                break;
            case 'film.html':
                filmActive = 'style="color: #DE2910 !important;" class="active"';
                break;
        }

        // 创建汉堡菜单直接附加到body，确保可见和可用
        const burgerMenu = document.createElement('div');
        burgerMenu.className = 'main-burger-menu';
        burgerMenu.id = menuId;
        burgerMenu.setAttribute('data-source', 'emergency');
        burgerMenu.innerHTML = `
            <div class="main-burger-icon" data-source="emergency">
                <div class="main-burger-bar"></div>
                <div class="main-burger-bar"></div>
                <div class="main-burger-bar"></div>
            </div>
            <div class="main-burger-panel" data-source="emergency">
                <a href="gallery.html" ${galleryActive}>Gallery</a>
                <a href="work.html" ${workActive}>Work</a>
                <a href="about.html" ${aboutActive}>About</a>
                <a href="film.html" ${filmActive}>Film</a>
            </div>
        `;
        document.body.appendChild(burgerMenu);

        // 添加样式
        const style = document.createElement('style');
        style.setAttribute('data-source', 'emergency');
        style.textContent = `
            /* 主汉堡菜单样式 */
            .main-burger-menu {
                position: fixed !important;
                top: 0 !important;
                right: 0 !important;
                z-index: 999999 !important;
            }

            /* 汉堡菜单图标 */
            .main-burger-icon {
                width: 40px !important;
                height: 40px !important;
                background-color: rgba(0,0,0,0.7) !important;
                border-radius: 5px !important;
                margin: 5px !important;
                padding: 8px !important;
                cursor: pointer !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: space-around !important;
                position: relative !important;
                z-index: 999999 !important; /* 确保始终在最上层 */
                transition: all 0.3s ease !important;
            }

            /* 菜单图标强调样式 */
            .main-burger-icon.open {
                background-color: #000 !important;
                border: 1px solid rgba(255,255,255,0.2) !important;
                box-shadow: 0 0 10px rgba(255,255,255,0.1) !important;
            }

            /* 汉堡菜单条 */
            .main-burger-bar {
                height: 3px !important;
                background-color: white !important;
                transition: 0.3s !important;
            }

            /* 汉堡菜单面板 */
            .main-burger-panel {
                display: block !important;
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                background-color: #000000 !important; /* 纯黑背景 */
                padding: 0 !important;
                flex-direction: column !important;
                justify-content: center !important;
                align-items: center !important;
                z-index: 999990 !important;
                opacity: 0 !important;
                visibility: hidden !important;
                transition: opacity 0.3s ease, visibility 0.3s ease !important;
                pointer-events: none !important;
            }

            /* 打开状态 */
            .main-burger-panel.open {
                display: flex !important;
                opacity: 1 !important;
                visibility: visible !important;
                pointer-events: auto !important;
            }

            /* 关闭过渡状态 */
            .main-burger-panel.closing {
                opacity: 0 !important;
                visibility: visible !important;
                transition: opacity 0.5s ease !important;
                pointer-events: none !important;
            }

            /* 菜单链接 */
            .main-burger-panel a {
                color: white !important;
                font-size: 1.8rem !important;
                text-decoration: none !important;
                margin: 20px 0 !important;
                text-align: center !important;
                width: 100% !important;
                font-family: 'Poiret One', cursive !important;
                transition: color 0.3s ease !important;
            }

            /* 链接悬停效果 */
            .main-burger-panel a:hover {
                color: #ddd !important;
            }

            /* 激活状态的链接 */
            .main-burger-panel a[style*="color: #DE2910"] {
                color: #DE2910 !important;
            }

            /* 图标变X动画 */
            .main-burger-icon.open .main-burger-bar:nth-child(1) {
                transform: rotate(-45deg) translate(-5px, 6px) !important;
            }
            .main-burger-icon.open .main-burger-bar:nth-child(2) {
                opacity: 0 !important;
            }
            .main-burger-icon.open .main-burger-bar:nth-child(3) {
                transform: rotate(45deg) translate(-5px, -6px) !important;
            }

            /* 禁止页面滚动 */
            body.menu-open {
                overflow: hidden !important;
            }

            /* 隐藏原始导航元素 */
            .mobile-menu-button:not([data-source="emergency"]),
            .mobile-menu:not([data-source="emergency"]) {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
            }
        `;
        document.head.appendChild(style);

        // 添加点击事件
        const burgerIcon = burgerMenu.querySelector('.main-burger-icon');
        const burgerPanel = burgerMenu.querySelector('.main-burger-panel');

        burgerIcon.addEventListener('click', function(e) {
            console.log('紧急汉堡菜单点击');
            e.stopPropagation();

            if (this.classList.contains('open')) {
                // 关闭菜单
                this.classList.remove('open');
                burgerPanel.classList.add('closing');
                burgerPanel.classList.remove('open');
                document.body.classList.remove('menu-open');

                // 延迟移除closing类
                setTimeout(() => {
                    burgerPanel.classList.remove('closing');
                }, 600);
            } else {
                // 打开菜单
                this.classList.add('open');
                burgerPanel.classList.remove('closing');
                burgerPanel.classList.add('open');
                document.body.classList.add('menu-open');

                // 隐藏所有其他导航元素
                document.querySelectorAll('.mobile-menu, .mobile-menu-button, .nav-links')
                    .forEach(el => {
                        if (!el.hasAttribute('data-source') || el.getAttribute('data-source') !== 'emergency') {
                            el.style.display = 'none';
                            el.style.visibility = 'hidden';
                            el.style.opacity = '0';
                        }
                    });
            }
        });

        // 点击链接时关闭菜单
        const links = burgerPanel.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                // 阻止默认行为，防止立即跳转
                e.preventDefault();

                // 保存链接目标
                const href = this.getAttribute('href');

                // 关闭菜单
                burgerIcon.classList.remove('open');
                burgerPanel.classList.add('closing');
                burgerPanel.classList.remove('open');
                document.body.classList.remove('menu-open');

                // 移除黑色背景后再跳转
                setTimeout(() => {
                    burgerPanel.classList.remove('closing');
                    // 动画完成后再跳转
                    window.location.href = href;
                }, 300); // 缩短时间以获得更好的用户体验
            });
        });

        // 使用MutationObserver确保紧急菜单始终可见
        const bodyObserver = new MutationObserver(() => {
            const menuElement = document.getElementById(menuId);
            if (!menuElement || !menuElement.isConnected) {
                console.log('紧急汉堡菜单被移除，重新创建');
                createEmergencyBurgerMenu();
            }
        });

        bodyObserver.observe(document.body, { childList: true, subtree: true });

        console.log('紧急汉堡菜单已创建, ID:', menuId);
    }
}

// 加载导航HTML，支持重试
function loadNavHtml(prefix, navContainer, attempt) {
    const maxAttempts = 3;
    if (attempt > maxAttempts) {
        console.error('加载导航栏失败，已达到最大尝试次数');
        useBackupNav(navContainer);
        return;
    }

    console.log(`尝试加载导航HTML (${attempt}/${maxAttempts})`);

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
            console.log("导航HTML加载成功");

            // 加载导航栏JS
            loadNavJs();
        })
        .catch(error => {
            console.error('加载导航栏失败:', error);

            // 重试加载
            setTimeout(() => {
                loadNavHtml(prefix, navContainer, attempt + 1);
            }, 500 * attempt); // 逐渐增加重试间隔
        });
}

// 使用备用导航
function useBackupNav(navContainer) {
    console.log("使用备用导航");
    navContainer.innerHTML = `
    <div class="header-container">
        <header class="header">
            <a href="index.html" class="logo">Triple-Y</a>
            <div class="nav-links">
                <a href="gallery.html" class="nav-link">Gallery</a>
                <a href="film.html" class="nav-link">Film</a>
                <a href="work.html" class="nav-link">Work</a>
                <a href="about.html" class="nav-link">About</a>
            </div>
            <div class="mobile-menu-button">
                <div class="bar1"></div>
                <div class="bar2"></div>
                <div class="bar3"></div>
            </div>
            <div class="mobile-menu">
                <a href="gallery.html" class="mobile-link">Gallery</a>
                <a href="film.html" class="mobile-link">Film</a>
                <a href="work.html" class="mobile-link">Work</a>
                <a href="about.html" class="mobile-link">About</a>
            </div>
        </header>
    </div>`;

    // 加载导航JS
    loadNavJs();
}

// 加载导航JS
function loadNavJs() {
    // 不再使用前缀，一律使用相对路径来加载 nav.js
    loadScript('shared/nav.js');
}

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