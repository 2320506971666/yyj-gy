document.addEventListener("DOMContentLoaded", function() {
    console.log("load-nav.js 加载");
    // 获取当前页面名称
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    // 如果是首页，添加标识类
    if (currentPage === 'index.html' || currentPage === '') {
        document.body.classList.add('index-page');
    }
    
    // 立即加载导航样式，确保它优先于其他样式
    const isGitHubPages = window.location.hostname.includes("github.io");
    const isCustomDomain = window.location.hostname === "tripley.cn";
    const prefix = isGitHubPages ? "/yyj-gy/" : (isCustomDomain ? "/" : "");
    loadStylesheet(prefix + 'shared/nav-styles.css');
    
    // 移除页面中可能存在的自定义移动菜单样式
    removeMobileMenuCustomStyles();
    
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
        
        // 加载导航栏HTML
        loadNavHtml(prefix, navContainer, 1);
    }
    
    // 只在移动设备上创建紧急汉堡菜单
    if (window.innerWidth <= 768) {
        console.log("移动设备检测：创建紧急汉堡菜单");
        createEmergencyBurgerMenu();
    }
    
    // 监听窗口大小变化，确保导航栏随时可用
    window.addEventListener('resize', function() {
        // 延迟执行，避免频繁触发
        if (this.resizeTimer) clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(function() {
            console.log('窗口大小改变，重新检查导航');
            
            // 根据窗口大小调整导航
            if (window.innerWidth <= 768) {
                // 移动设备 - 创建紧急汉堡菜单
                createEmergencyBurgerMenu();
                
                // 隐藏桌面导航
                const navLinks = document.querySelector('.nav-links');
                if (navLinks) {
                    navLinks.style.display = 'none';
                }
            } else {
                // 桌面设备 - 移除紧急汉堡菜单
                document.querySelectorAll('[data-source="emergency"]').forEach(el => {
                    el.remove();
                });
                
                // 显示桌面导航
                const navLinks = document.querySelector('.nav-links');
                if (navLinks) {
                    navLinks.style.display = 'flex';
                    navLinks.style.visibility = 'visible';
                    navLinks.style.opacity = '1';
                }
            }
        }, 200);
    });
    
    // 添加全局样式来处理导航栏
    const globalStyle = document.createElement('style');
    globalStyle.setAttribute('data-source', 'load-nav-global');
    globalStyle.textContent = `
        /* 响应式导航处理 */
        @media (max-width: 768px) {
            /* 在移动设备上隐藏原始导航元素 */
            .mobile-menu-button:not([data-source="emergency"]),
            .mobile-menu:not([data-source="emergency"]) {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
            }
            
            /* 隐藏任何自定义的移动菜单 */
            .mobile-menu-btn, 
            .menu-button:not(.mobile-menu-button), 
            div[class*="hamburger"],
            .hamburger-menu,
            .menu-toggle {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
            }
        }
        
        @media (min-width: 769px) {
            /* 在桌面端显示常规导航 */
            .nav-links {
                display: flex !important;
                visibility: visible !important;
                opacity: 1 !important;
            }
            
            /* 在桌面端隐藏紧急汉堡菜单 */
            [data-source="emergency"] {
                display: none !important;
            }
        }
    `;
    document.head.appendChild(globalStyle);
    
    // 页面加载后执行一次彻底检查，确保导航元素正确显示
    setTimeout(function() {
        const isMobile = window.innerWidth <= 768;
        
        // 再次移除页面中可能存在的自定义移动菜单样式
        removeMobileMenuCustomStyles();
        
        if (isMobile) {
            // 移动设备：隐藏常规导航，显示紧急汉堡菜单
            document.querySelectorAll('.mobile-menu-button, .mobile-menu').forEach(el => {
                if (!el.hasAttribute('data-source') || el.getAttribute('data-source') !== 'emergency') {
                    el.style.display = 'none';
                    el.style.visibility = 'hidden';
                    el.style.opacity = '0';
                }
            });
            
            // 确保紧急汉堡菜单可见
            document.querySelectorAll('[data-source="emergency"]').forEach(el => {
                if (el.tagName.toLowerCase() !== 'style') {
                    el.style.display = el.tagName.toLowerCase() === 'div' ? 'flex' : 'block';
                    el.style.visibility = 'visible';
                    el.style.opacity = '1';
                }
            });
            
            // 隐藏桌面导航
            const navLinks = document.querySelector('.nav-links');
            if (navLinks) {
                navLinks.style.display = 'none';
            }
        } else {
            // 桌面设备：显示常规导航，隐藏汉堡菜单
            const navLinks = document.querySelector('.nav-links');
            if (navLinks) {
                navLinks.style.display = 'flex';
                navLinks.style.visibility = 'visible';
                navLinks.style.opacity = '1';
            }
            
            // 隐藏所有汉堡菜单
            document.querySelectorAll('[data-source="emergency"]').forEach(el => {
                if (el.tagName.toLowerCase() !== 'style') {
                    el.style.display = 'none';
                }
            });
        }
        
        console.log('页面导航元素最终调整完成 - ' + (isMobile ? '移动设备模式' : '桌面设备模式'));
    }, 1000);
});

// 移除页面中的自定义移动菜单样式
function removeMobileMenuCustomStyles() {
    // 查找所有样式表
    const stylesheets = document.querySelectorAll('style');
    stylesheets.forEach(style => {
        // 跳过我们自己添加的样式
        if (style.hasAttribute('data-source') && 
           (style.getAttribute('data-source') === 'load-nav-global' || 
            style.getAttribute('data-source') === 'emergency')) {
            return;
        }
        
        // 替换或禁用可能与我们的导航冲突的样式
        let cssText = style.textContent;
        if (cssText.includes('.mobile-menu') || 
            cssText.includes('menu-button') || 
            cssText.includes('hamburger') || 
            cssText.includes('.menu-toggle')) {
            
            // 添加一个注释标记已被修改的样式
            style.textContent = '/* 以下样式已被统一导航样式覆盖 */\n' + cssText;
            
            // 创建一个覆盖样式
            const overrideStyle = document.createElement('style');
            overrideStyle.setAttribute('data-source', 'nav-override');
            overrideStyle.textContent = `
                /* 覆盖自定义菜单样式 */
                @media (max-width: 768px) {
                    .mobile-menu-btn, 
                    .menu-button:not(.mobile-menu-button),
                    div[class*="hamburger"],
                    .hamburger-menu,
                    .menu-toggle,
                    .mobile-menu:not([data-source="emergency"]) {
                        display: none !important;
                        visibility: hidden !important;
                        opacity: 0 !important;
                        pointer-events: none !important;
                    }
                }
            `;
            document.head.appendChild(overrideStyle);
        }
    });
}

// 创建紧急汉堡菜单函数 - 确保所有页面都有可用的汉堡菜单
function createEmergencyBurgerMenu() {
    // 先检查是否为移动设备
    if (window.innerWidth <= 768) {
        console.log('移动设备：创建紧急汉堡菜单');
        const menuId = 'emergency-burger-menu-' + Math.floor(Math.random() * 10000);
        
        // 如果已存在紧急汉堡菜单，则不重复创建
        if (document.querySelector('[data-source="emergency"]')) {
            console.log('紧急汉堡菜单已存在');
            return;
        }
        
        // 创建汉堡菜单容器
        const burgerMenu = document.createElement('div');
        burgerMenu.id = menuId;
        burgerMenu.setAttribute('data-source', 'emergency');
        burgerMenu.style.position = 'fixed';
        burgerMenu.style.top = '0';
        burgerMenu.style.left = '0';
        burgerMenu.style.width = '100%';
        burgerMenu.style.height = '45px';
        burgerMenu.style.backgroundColor = '#000000';
        burgerMenu.style.zIndex = '9999';
        burgerMenu.style.display = 'flex';
        burgerMenu.style.justifyContent = 'space-between';
        burgerMenu.style.alignItems = 'center';
        burgerMenu.style.padding = '0 20px';
        
        // 创建logo
        const logoLink = document.createElement('a');
        logoLink.href = 'index.html';
        logoLink.textContent = 'Triple-Y';
        logoLink.style.fontFamily = "'Reenie Beanie', cursive";
        logoLink.style.fontSize = '2.3rem';
        logoLink.style.fontWeight = '400';
        logoLink.style.letterSpacing = '3px';
        logoLink.style.color = '#ffffff';
        logoLink.style.opacity = '0.9';
        logoLink.style.textDecoration = 'none';
        logoLink.style.marginLeft = '20px';
        
        // 创建汉堡菜单图标
        const burgerIcon = document.createElement('div');
        burgerIcon.setAttribute('data-source', 'emergency');
        burgerIcon.style.display = 'flex';
        burgerIcon.style.flexDirection = 'column';
        burgerIcon.style.justifyContent = 'space-between';
        burgerIcon.style.width = '30px';
        burgerIcon.style.height = '22px';
        burgerIcon.style.cursor = 'pointer';
        burgerIcon.style.marginRight = '20px';
        burgerIcon.style.position = 'relative';
        burgerIcon.style.zIndex = '10000';
        
        // 创建汉堡菜单图标的三条线
        for (let i = 0; i < 3; i++) {
            const bar = document.createElement('span');
            bar.style.display = 'block';
            bar.style.width = '100%';
            bar.style.height = '3px';
            bar.style.backgroundColor = '#ffffff';
            bar.style.transition = 'all 0.3s ease';
            burgerIcon.appendChild(bar);
        }
        
        // 创建汉堡菜单展开面板
        const menuPanel = document.createElement('div');
        menuPanel.className = 'main-burger-panel';
        menuPanel.style.position = 'fixed';
        menuPanel.style.top = '0';
        menuPanel.style.left = '0';
        menuPanel.style.width = '100%';
        menuPanel.style.height = '100%';
        menuPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
        menuPanel.style.display = 'flex';
        menuPanel.style.flexDirection = 'column';
        menuPanel.style.justifyContent = 'center';
        menuPanel.style.alignItems = 'center';
        menuPanel.style.zIndex = '9998';
        menuPanel.style.transform = 'translateY(-100%)';
        menuPanel.style.transition = 'transform 0.5s ease';
        menuPanel.style.backdropFilter = 'blur(5px)';
        menuPanel.style.webkitBackdropFilter = 'blur(5px)';
        
        // 添加菜单链接
        const menuLinks = [
            { text: 'Gallery', href: 'gallery.html' },
            { text: 'Film', href: 'film.html' },
            { text: 'Work', href: 'work.html' },
            { text: 'About', href: 'about.html' }
        ];
        
        menuLinks.forEach(link => {
            const a = document.createElement('a');
            a.href = link.href;
            a.textContent = link.text;
            a.style.color = '#ffffff';
            a.style.fontSize = '1.5rem';
            a.style.textDecoration = 'none';
            a.style.margin = '15px 0';
            a.style.fontFamily = "'Poiret One', cursive";
            a.style.letterSpacing = '3px';
            a.style.transition = 'all 0.3s ease';
            
            // 监听鼠标悬停事件
            a.addEventListener('mouseenter', function() {
                this.style.color = '#DE2910';
                this.style.letterSpacing = '4px';
            });
            
            a.addEventListener('mouseleave', function() {
                this.style.color = '#ffffff';
                this.style.letterSpacing = '3px';
            });
            
            menuPanel.appendChild(a);
        });
        
        // 将元素添加到DOM
        burgerMenu.appendChild(logoLink);
        burgerMenu.appendChild(burgerIcon);
        document.body.appendChild(burgerMenu);
        document.body.appendChild(menuPanel);
        
        // 添加CSS类来控制动画
        const style = document.createElement('style');
        style.textContent = `
            .main-burger-panel.open {
                transform: translateY(0) !important;
            }
            .main-burger-panel.closing {
                transform: translateY(-100%) !important;
            }
        `;
        document.head.appendChild(style);
        
        // 汉堡菜单点击事件
        const bars = burgerIcon.querySelectorAll('span');
        
        // 当汉堡菜单打开时的样式
        function updateBurgerIcon(isOpen) {
            if (isOpen) {
                bars[0].style.transform = 'rotate(45deg) translate(6px, 5px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(-45deg) translate(6px, -5px)';
            } else {
                bars[0].style.transform = 'rotate(0) translate(0)';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'rotate(0) translate(0)';
            }
        }
        
        burgerIcon.addEventListener('click', function(e) {
            console.log('紧急汉堡菜单点击');
            e.stopPropagation();
            
            if (this.classList.contains('open')) {
                // 关闭菜单
                this.classList.remove('open');
                updateBurgerIcon(false);
                menuPanel.classList.add('closing');
                menuPanel.classList.remove('open');
                document.body.classList.remove('menu-open');
                
                // 延迟移除closing类
                setTimeout(() => {
                    menuPanel.classList.remove('closing');
                }, 600);
            } else {
                // 打开菜单
                this.classList.add('open');
                updateBurgerIcon(true);
                menuPanel.classList.remove('closing');
                menuPanel.classList.add('open');
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
        const panelLinks = menuPanel.querySelectorAll('a');
        panelLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // 阻止默认行为，防止立即跳转
                e.preventDefault();
                
                // 保存链接目标
                const href = this.getAttribute('href');
                
                // 关闭菜单
                burgerIcon.classList.remove('open');
                updateBurgerIcon(false);
                menuPanel.classList.add('closing');
                menuPanel.classList.remove('open');
                document.body.classList.remove('menu-open');
                
                // 移除黑色背景后再跳转
                setTimeout(() => {
                    menuPanel.classList.remove('closing');
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
    } else {
        // 在桌面端，移除任何可能存在的紧急汉堡菜单
        document.querySelectorAll('[data-source="emergency"]').forEach(el => {
            el.remove();
        });
        
        // 显示常规导航栏元素
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            navLinks.style.display = 'flex';
            navLinks.style.visibility = 'visible';
            navLinks.style.opacity = '1';
        }
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
    
    // 确保首先加载导航样式表，这样它的优先级更高
    loadStylesheet(prefix + 'shared/nav-styles.css');
    
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
            
            // 确保logo样式一致，使用统一样式
            const logo = navContainer.querySelector('.logo');
            if (logo) {
                // 移除可能存在的内联样式，优先使用CSS文件中的样式
                logo.removeAttribute('style');
                
                // 设置必要的类和属性
                logo.classList.add('logo');
            }
            
            // 检查并隐藏除了紧急汉堡菜单以外的所有移动菜单元素
            if (window.innerWidth <= 768) {
                navContainer.querySelectorAll('.mobile-menu-button, .mobile-menu').forEach(el => {
                    if (!el.hasAttribute('data-source') || el.getAttribute('data-source') !== 'emergency') {
                        el.style.display = 'none';
                        el.style.visibility = 'hidden';
                        el.style.opacity = '0';
                    }
                });
            }
            
            // 修复导航链接路径
            fixNavLinks(prefix);
            
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

// 修复导航链接
function fixNavLinks(prefix) {
    const isGitHubPages = window.location.hostname.includes("github.io");
    const isCustomDomain = window.location.hostname === "tripley.cn";
    
    if (isGitHubPages || isCustomDomain) {
        document.querySelectorAll('.nav-link, .mobile-link, .logo').forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith("http")) {
                link.setAttribute('href', prefix + href.replace(/^\.?\/*/, ""));
            }
        });
    }
}

// 使用备用导航
function useBackupNav(navContainer) {
    console.log("使用备用导航");
    
    // 确保先加载导航样式
    const isGitHubPages = window.location.hostname.includes("github.io");
    const isCustomDomain = window.location.hostname === "tripley.cn";
    const prefix = isGitHubPages ? "/yyj-gy/" : (isCustomDomain ? "/" : "");
    loadStylesheet(prefix + 'shared/nav-styles.css');
    
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
    
    // 如果是移动设备，隐藏默认的移动菜单
    if (window.innerWidth <= 768) {
        const mobileMenuButton = navContainer.querySelector('.mobile-menu-button');
        const mobileMenu = navContainer.querySelector('.mobile-menu');
        
        if (mobileMenuButton) {
            mobileMenuButton.style.display = 'none';
            mobileMenuButton.style.visibility = 'hidden';
        }
        
        if (mobileMenu) {
            mobileMenu.style.display = 'none';
            mobileMenu.style.visibility = 'hidden';
        }
    }
    
    // 加载导航JS
    loadNavJs();
}

// 加载导航JS
function loadNavJs() {
    const isGitHubPages = window.location.hostname.includes("github.io");
    const isCustomDomain = window.location.hostname === "tripley.cn";
    const prefix = isGitHubPages ? "/yyj-gy/" : (isCustomDomain ? "/" : "");
    
    // 确保先加载样式表
    loadStylesheet(prefix + 'shared/nav-styles.css');
    
    // 加载导航脚本
    loadScript(prefix + 'shared/nav.js');
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