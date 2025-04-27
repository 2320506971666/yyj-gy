/**
 * 整合导航系统 - 简化版本
 * 使用固定定位导航栏，确保在页面切换时不跳动
 */
document.addEventListener("DOMContentLoaded", initNavigation);

/**
 * 初始化导航系统
 */
function initNavigation() {
    // 获取当前页面名称
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // 根据当前页面设置 body 类名
    setBodyClass(currentPage);

    // 加载导航栏（如果尚未加载）
    const navContainer = document.getElementById('nav-container');
    if (navContainer && !navContainer.hasChildNodes()) {
        // 注入导航栏HTML
        navContainer.innerHTML = getNavHTML();
    }

    // 设置当前页面的active状态
    setActiveNavLink(currentPage);

    // 创建移动端汉堡菜单（如果尚未创建）
    if (!document.getElementById('mobile-burger-menu')) {
        createMobileMenu();
    }

    // 注入导航样式（如果尚未注入）
    injectNavStyles();
}

// 返回导航栏HTML
function getNavHTML() {
    return `
    <!-- 导航栏 - 使用固定定位 -->
    <div class="header-container">
        <header class="header">
            <a href="index.html" class="logo">Triple-Y</a>
            <div class="nav-links">
                <a href="gallery.html" class="nav-link" id="gallery-link">Gallery</a>
                <a href="film.html" class="nav-link" id="film-link">Film</a>
                <a href="work.html" class="nav-link" id="work-link">Work</a>
                <a href="about.html" class="nav-link" id="about-link">About</a>
            </div>
        </header>
    </div>`;
}

// 注入导航样式
function injectNavStyles() {
    if (!document.getElementById('nav-styles')) {
        const style = document.createElement('style');
        style.id = 'nav-styles';
        style.textContent = `
        /* 导航栏通用样式 */
        .header-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 45px;
            background-color: rgba(0, 0, 0, 0.9);
            z-index: 10000;
            padding: 0;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        /* 为固定导航栏添加页面内容顶部间距 */
        body {
            padding-top: 45px; /* 与导航栏高度相同 */
        }

        .header {
            position: relative;
            width: 100%;
            height: 100%;
            z-index: 100;
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 20px;
        }

        .logo {
            font-family: 'Reenie Beanie', cursive;
            font-size: 2.3rem;
            font-weight: 400;
            letter-spacing: 3px;
            color: #ffffff;
            opacity: 0.9;
            text-decoration: none;
            margin-left: 20px;
        }

        .logo:hover {
            opacity: 0.8;
        }

        .nav-links {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            list-style: none;
            margin: 0;
            padding: 0;
            gap: 2.5rem;
        }

        /* 导航链接通用样式 */
        .nav-link, .mobile-link {
            text-decoration: none;
            color: #ffffff;
            font-weight: 300;
            text-transform: capitalize;
            transition: all 0.4s ease;
            opacity: 0.9;
            font-family: 'Poiret One', cursive;
            position: relative;
        }

        .nav-link {
            font-size: 0.9rem;
            letter-spacing: 3px;
        }

        .nav-link:hover {
            opacity: 1;
            letter-spacing: 4px;
            color: #DE2910;
        }

        /* 简化导航链接激活状态选择器 */
        .nav-link.active,
        .mobile-link.active,
        body.film-page a[href="film.html"],
        body.gallery-page a[href="gallery.html"],
        body.work-page a[href="work.html"],
        body.about-page a[href="about.html"],
        body.tibet-page a[href="gallery.html"],
        body.north-page a[href="gallery.html"],
        body.sanya-page a[href="gallery.html"] {
            color: #DE2910;
            opacity: 1;
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
            .nav-links {
                display: none;
            }

            .header {
                padding: 0 10px;
            }

            .logo {
                margin-left: 5px;
                font-size: 2rem;
            }
        }

        /* 汉堡菜单样式 */
        .burger-menu {
            position: fixed;
            top: 0;
            right: 0;
            width: 45px;
            height: 45px;
            display: none;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            z-index: 10000;
            background-color: rgba(0, 0, 0, 0.7);
            border-radius: 0 0 0 5px;
        }

        /* 汉堡图标 */
        .burger-icon {
            width: 24px;
            height: 18px;
            position: relative;
        }

        .burger-icon span {
            position: absolute;
            width: 100%;
            height: 2px;
            background-color: white;
            transition: all 0.3s ease;
            left: 0;
        }

        .burger-icon span:nth-child(1) {
            top: 0;
        }

        .burger-icon span:nth-child(2) {
            top: 8px;
        }

        .burger-icon span:nth-child(3) {
            top: 16px;
        }

        /* 汉堡图标打开状态 */
        .burger-menu.active .burger-icon span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }

        .burger-menu.active .burger-icon span:nth-child(2) {
            opacity: 0;
        }

        .burger-menu.active .burger-icon span:nth-child(3) {
            transform: rotate(-45deg) translate(5px, -5px);
        }

        /* 移动菜单面板 */
        .mobile-panel {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background-color: #000000; /* 全黑背景，不透明 */
            z-index: 9999;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .mobile-panel.active {
            opacity: 1;
            visibility: visible;
        }

        .mobile-panel a {
            font-family: 'Poiret One', cursive;
            color: white;
            font-size: 1.8rem;
            text-decoration: none;
            margin: 15px 0;
            text-transform: capitalize;
            letter-spacing: 3px;
            opacity: 0.9;
            transition: all 0.3s ease;
        }

        .mobile-panel a:hover,
        .mobile-panel a.active {
            color: #DE2910;
            opacity: 1;
        }

        /* 在移动设备上显示汉堡菜单 */
        @media (max-width: 768px) {
            .burger-menu {
                display: flex;
            }
        }

        /* 当移动菜单打开时禁止页面滚动 */
        body.menu-open {
            overflow: hidden;
        }`;
        document.head.appendChild(style);
    }
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), wait);
    };
}

// 根据当前页面设置 body 类名
function setBodyClass(currentPage) {
    // 清除所有页面类名
    document.body.classList.remove(
        'index-page', 'gallery-page', 'film-page', 'work-page', 'about-page',
        'tibet-page', 'north-page', 'sanya-page'
    );

    // 根据当前页面设置对应的类名
    const pageMapping = {
        'index.html': 'index-page',
        '': 'index-page',
        'gallery.html': 'gallery-page',
        'film.html': 'film-page',
        'work.html': 'work-page',
        'about.html': 'about-page',
        'tibet.html': 'tibet-page',
        'north.html': 'north-page',
        'sanya.html': 'sanya-page'
    };

    const className = pageMapping[currentPage];
    if (className) {
        document.body.classList.add(className);
    }
}

/**
 * 创建移动端汉堡菜单
 */
function createMobileMenu() {
    // 获取当前页面名称
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // 删除可能已存在的汉堡菜单
    const existingMenu = document.getElementById('mobile-burger-menu');
    if (existingMenu) {
        existingMenu.remove();
    }

    // 创建汉堡菜单按钮
    const burgerMenu = document.createElement('div');
    burgerMenu.id = 'mobile-burger-menu';
    burgerMenu.className = 'burger-menu';
    burgerMenu.innerHTML = `
        <div class="burger-icon">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;

    // 在移动设备上立即显示
    if (window.innerWidth <= 768) {
        burgerMenu.style.display = 'flex';
    }

    // 创建移动菜单面板
    const mobilePanel = document.createElement('div');
    mobilePanel.id = 'mobile-panel';
    mobilePanel.className = 'mobile-panel';

    // 设置菜单链接并标记当前页面
    const navItems = [
        { href: 'gallery.html', text: 'Gallery' },
        { href: 'work.html', text: 'Work' },
        { href: 'about.html', text: 'About' },
        { href: 'film.html', text: 'Film' }
    ];

    const menuLinks = navItems.map(item => {
        const isActive = currentPage === item.href ||
            (item.href === 'gallery.html' && ['tibet.html', 'north.html', 'sanya.html'].includes(currentPage));

        return `<a href="${item.href}" class="${isActive ? 'active' : ''}" ${isActive ? 'style="color: #DE2910"' : ''}>
            ${item.text}
        </a>`;
    }).join('');

    mobilePanel.innerHTML = menuLinks;

    // 添加到页面
    document.body.appendChild(burgerMenu);
    document.body.appendChild(mobilePanel);

    // 处理汉堡菜单点击事件
    burgerMenu.addEventListener('click', function() {
        this.classList.toggle('active');
        mobilePanel.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // 处理菜单链接点击事件
    mobilePanel.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            // 关闭菜单
            burgerMenu.classList.remove('active');
            mobilePanel.classList.remove('active');
            document.body.classList.remove('menu-open');

            // 使用传统导航
            e.preventDefault();
            const href = this.getAttribute('href');
            setTimeout(() => {
                window.location.href = href;
            }, 100);
        });
    });

    // 点击页面其他部分关闭菜单
    document.addEventListener('click', function(e) {
        if (mobilePanel.classList.contains('active') &&
            !mobilePanel.contains(e.target) &&
            !burgerMenu.contains(e.target)) {
            burgerMenu.classList.remove('active');
            mobilePanel.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // 额外处理：确保汉堡菜单在移动设备上一定显示
    window.addEventListener('resize', function() {
        const burger = document.getElementById('mobile-burger-menu');
        if (burger) {
            if (window.innerWidth <= 768) {
                burger.style.display = 'flex';
            } else {
                burger.style.display = 'none';
            }
        }
    });

    // 延迟执行，确保在其他脚本之后运行
    setTimeout(() => {
        const burger = document.getElementById('mobile-burger-menu');
        if (burger && window.innerWidth <= 768) {
            burger.style.display = 'flex';
            burger.style.visibility = 'visible';
            burger.style.opacity = '1';
        }
    }, 1000);
}

// 设置导航栏激活状态
function setActiveNavLink(currentPage) {
    // 处理路径为空或为 / 的情况
    if (!currentPage || currentPage === '' || currentPage === '/') {
        currentPage = 'index.html';
    }

    // 重置所有普通导航链接的激活状态
    document.querySelectorAll('.nav-link, .mobile-link').forEach(link => {
        link.classList.remove('active');
        link.style.color = '';
    });

    // 如果不是首页，则设置当前页面对应的链接为激活状态
    if (currentPage !== 'index.html') {
        // 立即设置所有匹配当前页面的链接为激活状态，不使用setAttribute以避免样式冲突
        document.querySelectorAll(`a[href="${currentPage}"]`).forEach(link => {
            link.classList.add('active');
            link.style.color = '#DE2910';
            link.style.opacity = '1';
        });

        // 对于 Gallery 子页面，还需要激活 Gallery 链接
        if (['tibet.html', 'north.html', 'sanya.html'].includes(currentPage)) {
            document.querySelectorAll('a[href="gallery.html"]').forEach(link => {
                link.classList.add('active');
                link.style.color = '#DE2910';
                link.style.opacity = '1';
            });
        }
    }

    // 再次确认激活链接样式，但大大减少延迟时间
    setTimeout(() => {
        document.querySelectorAll('.nav-link.active, .mobile-link.active').forEach(link => {
            link.style.color = '#DE2910';
            link.style.opacity = '1';
        });
    }, 50); // 将400ms改为50ms，减少卡顿感
}