/**
 * 统一转场效果管理器
 * 同时支持普通页面和iframe页面的转场效果
 */

// 立即执行函数，避免全局变量污染
(function() {
    // 添加转场样式
    function addTransitionStyles() {
        if (document.getElementById('unified-transition-styles')) return;

        const style = document.createElement('style');
        style.id = 'unified-transition-styles';
        style.textContent = `
            /* 转场覆盖层 */
            .transition-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: black;
                z-index: 99999; /* 增加z-index确保覆盖所有内容 */
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.8s cubic-bezier(0.33, 1, 0.68, 1),
                            visibility 0.8s cubic-bezier(0.33, 1, 0.68, 1);
                pointer-events: none;
                will-change: opacity, visibility; /* 提示浏览器优化渲染 */
            }

            .transition-overlay.active {
                opacity: 1;
                visibility: visible;
                pointer-events: all;
            }

            /* 模糊渐变动画 */
            @keyframes blurFadeIn {
                0% {
                    opacity: 0;
                    filter: blur(12px);
                    transform: scale(1.03);
                }
                100% {
                    opacity: 1;
                    filter: blur(0);
                    transform: scale(1);
                }
            }

            .blur-fade-in {
                animation: blurFadeIn 0.8s cubic-bezier(0.33, 1, 0.68, 1) forwards;
                transform-origin: center center;
                will-change: opacity, filter, transform; /* 提示浏览器优化渲染 */
            }

            /* iframe 样式 */
            #content-frame {
                position: fixed;
                top: 45px; /* 导航栏高度 */
                left: 0;
                width: 100%;
                height: calc(100% - 45px);
                border: none;
                background-color: #000;
                z-index: 1;
                opacity: 0;
                filter: blur(12px);
                transform: scale(1.03);
                transition: opacity 0.8s cubic-bezier(0.33, 1, 0.68, 1),
                            filter 0.8s cubic-bezier(0.33, 1, 0.68, 1),
                            transform 0.8s cubic-bezier(0.33, 1, 0.68, 1);
                transform-origin: center center;
                will-change: opacity, filter, transform; /* 提示浏览器优化渲染 */
            }

            #content-frame.visible {
                opacity: 1;
                filter: blur(0);
                transform: scale(1);
            }

            /* 加载动画样式 */
            #loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: #000;
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 100000; /* 增加z-index确保覆盖所有内容，但低于转场覆盖层 */
                transition: opacity 0.8s cubic-bezier(0.33, 1, 0.68, 1);
                will-change: opacity; /* 提示浏览器优化渲染 */
            }

            .loading-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }

            .loading-logo {
                font-family: 'Reenie Beanie', cursive;
                font-size: 3rem;
                font-weight: 400;
                letter-spacing: 3px;
                color: #ffffff;
                opacity: 0;
                margin-bottom: 20px;
                filter: blur(12px);
                transform: scale(1.03);
                animation: textFadeIn 2s cubic-bezier(0.33, 1, 0.68, 1) forwards;
                transform-origin: center center;
            }

            @keyframes textFadeIn {
                0% {
                    opacity: 0;
                    filter: blur(12px);
                    transform: scale(1.03);
                }
                100% {
                    opacity: 1;
                    filter: blur(0);
                    transform: scale(1);
                }
            }

            @keyframes textFadeOut {
                0% {
                    opacity: 1;
                    filter: blur(0);
                    transform: scale(1);
                }
                100% {
                    opacity: 0;
                    filter: blur(12px);
                    transform: scale(0.97);
                }
            }

            .loading-percentage {
                font-family: 'Poiret One', cursive;
                font-size: 1.2rem;
                color: #ffffff;
                opacity: 0;
                filter: blur(12px);
                transform: scale(1.03);
                animation: textFadeIn 1.5s cubic-bezier(0.33, 1, 0.68, 1) forwards 0.5s;
                position: absolute;
                bottom: 50px;
                left: 0;
                right: 0;
                text-align: center;
                transform-origin: center center;
            }

            #loading-overlay.loaded .loading-logo,
            #loading-overlay.loaded .loading-percentage {
                animation: textFadeOut 0.8s cubic-bezier(0.33, 1, 0.68, 1) forwards;
            }

            #loading-overlay.loaded {
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.8s cubic-bezier(0.33, 1, 0.68, 1);
            }

            @media (max-width: 768px) {
                .loading-logo {
                    font-size: 2rem;
                }

                .loading-percentage {
                    font-size: 1rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // 创建转场覆盖层
    function createOverlay() {
        if (document.querySelector('.transition-overlay')) return;

        const overlay = document.createElement('div');
        overlay.className = 'transition-overlay';
        document.body.appendChild(overlay);
    }

    // 统一转场管理器
    const UnifiedTransition = {
        // 当前页面 (仅用于iframe模式)
        currentPage: 'model.html',

        // 是否是iframe模式
        isIframeMode: false,

        // 初始化
        init: function() {
            // 添加转场样式
            addTransitionStyles();

            // 创建转场覆盖层
            createOverlay();

            // 检测是否是iframe模式
            this.isIframeMode = !!document.getElementById('content-frame');

            if (this.isIframeMode) {
                // iframe模式初始化
                this.initIframeMode();
            } else {
                // 普通模式初始化
                this.initNormalMode();
            }
        },

        // 普通模式初始化
        initNormalMode: function() {
            // 页面加载完成后应用模糊效果
            if (document.readyState === 'complete') {
                this.applyBlurEffect();
                this.hideOverlay();
            } else {
                window.addEventListener('load', () => {
                    this.applyBlurEffect();
                    this.hideOverlay();
                });
            }

            // 处理所有链接
            this.setupLinks();
        },

        // iframe模式初始化
        initIframeMode: function() {
            // 从URL参数获取页面
            const urlParams = new URLSearchParams(window.location.search);
            const page = urlParams.get('page');

            if (page) {
                // 避免重复导航
                if (page !== this.currentPage) {
                    this.navigateTo(page);
                }
            } else {
                // 默认页面
                this.updateActiveNavLink(this.currentPage);
                this.updatePageTitle(this.currentPage);
            }

            // 处理浏览器的后退/前进按钮
            window.addEventListener('popstate', (event) => {
                // 从URL参数获取页面
                const urlParams = new URLSearchParams(window.location.search);
                const page = urlParams.get('page') || 'model.html';

                // 避免重复导航
                if (page !== this.currentPage) {
                    // 不使用pushState，因为这是由浏览器的后退/前进按钮触发的
                    const iframe = document.getElementById('content-frame');
                    const loadingOverlay = document.getElementById('loading-overlay');
                    const loadingPercentage = document.querySelector('.loading-percentage');
                    const isModelPage = (page === 'model.html');

                    // 更新当前页面
                    this.currentPage = page;
                    this.updateActiveNavLink(page);
                    this.updatePageTitle(page);

                    // 处理加载界面
                    if (isModelPage) {
                        loadingPercentage.textContent = '0%';
                        loadingOverlay.classList.remove('loaded');
                    } else {
                        loadingOverlay.classList.add('loaded');
                    }

                    // 加载页面
                    iframe.src = './' + page;
                }
            });

            // 设置iframe加载事件
            const iframe = document.getElementById('content-frame');
            if (iframe) {
                iframe.addEventListener('load', () => {
                    // 隐藏iframe内的导航栏
                    this.hideNavAndFooter(iframe);

                    // 如果是模型页面，等待模型加载完成
                    if (iframe.src.includes('model.html')) {
                        // 模型页面会通过onModelLoaded回调显示
                    } else {
                        // 非模型页面直接显示
                        iframe.classList.add('visible');
                        document.getElementById('loading-overlay').classList.add('loaded');
                    }
                });
            }
        },

        // 显示转场覆盖层
        showOverlay: function() {
            const overlay = document.querySelector('.transition-overlay');
            if (overlay) overlay.classList.add('active');
        },

        // 隐藏转场覆盖层
        hideOverlay: function() {
            const overlay = document.querySelector('.transition-overlay');
            if (overlay) overlay.classList.remove('active');
        },

        // 应用模糊效果
        applyBlurEffect: function() {
            // 为页面主要内容应用模糊效果
            const mainContent = document.querySelector('main') ||
                               document.querySelector('.main-content') ||
                               document.querySelector('.content') ||
                               document.querySelector('.pictures-page') ||
                               document.querySelector('.gallery-page') ||
                               document.querySelector('.work-page');

            if (mainContent) {
                mainContent.classList.add('blur-fade-in');
            } else {
                // 如果没有找到主要内容容器，为body的直接子元素应用效果
                Array.from(document.body.children).forEach(child => {
                    if (!child.classList.contains('transition-overlay') &&
                        child.tagName !== 'SCRIPT' &&
                        child.tagName !== 'STYLE' &&
                        child.id !== 'nav-container' &&
                        child.id !== 'footer-container') {
                        child.classList.add('blur-fade-in');
                    }
                });
            }
        },

        // 设置链接
        setupLinks: function() {
            document.querySelectorAll('a').forEach(link => {
                // 只处理内部链接
                if (link.hostname === window.location.hostname &&
                    !link.getAttribute('href').startsWith('#') &&
                    !link.hasAttribute('data-no-transition')) {

                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const href = link.getAttribute('href');

                        // 显示覆盖层
                        this.showOverlay();

                        // 延迟导航，确保转场覆盖层完全显示
                        setTimeout(() => {
                            window.location.href = href;
                        }, 500); // 增加延迟时间
                    });
                }
            });
        },

        // 导航到指定页面 (iframe模式)
        navigateTo: function(page) {
            if (!this.isIframeMode) {
                // 普通模式下，直接跳转
                this.showOverlay();
                setTimeout(() => {
                    window.location.href = page;
                }, 500); // 增加延迟时间，确保转场覆盖层完全显示
                return;
            }

            // iframe模式下的导航
            // 避免重复导航
            if (page === this.currentPage) return;

            // 获取元素
            const iframe = document.getElementById('content-frame');
            const loadingOverlay = document.getElementById('loading-overlay');
            const loadingPercentage = document.querySelector('.loading-percentage');

            // 判断是否是model页面
            const isModelPage = (page === 'model.html');

            // 淡出当前页面
            iframe.classList.remove('visible');

            // 更新当前页面
            this.currentPage = page;
            this.updateActiveNavLink(page);
            this.updatePageTitle(page);
            this.closeMobileMenu();

            // 设置iframe背景为黑色，避免白色闪烁
            iframe.style.backgroundColor = '#000';

            // 处理加载界面
            if (isModelPage) {
                // 如果是model页面，显示加载界面
                loadingPercentage.textContent = '0%';
                loadingOverlay.classList.remove('loaded');
            } else {
                // 如果不是model页面，不显示加载条
                loadingOverlay.classList.add('loaded');
            }

            // 更新URL参数，但不刷新页面
            const url = new URL(window.location);
            url.searchParams.set('page', page);
            window.history.pushState({page: page}, '', url);

            // 使用统一的转场管理器加载页面
            iframe.onload = () => {
                // 隐藏iframe内的导航栏
                this.hideNavAndFooter(iframe);

                // 如果不是model页面，直接显示内容
                if (!isModelPage) {
                    iframe.classList.add('visible');
                }
            };

            // 使用转场管理器加载页面
            setTimeout(() => {
                iframe.src = './' + page;
            }, 500); // 增加延迟时间，确保转场效果更平滑

            // 安全措施：如果8秒后页面仍未显示，强制显示
            setTimeout(() => {
                if (!iframe.classList.contains('visible')) {
                    console.log('强制显示页面（超时）');
                    iframe.classList.add('visible');
                    loadingOverlay.classList.add('loaded');
                    loadingPercentage.textContent = '100%';
                }
            }, 8000);
        },

        // 隐藏iframe内的导航栏，保留页脚
        hideNavAndFooter: function(iframe) {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

                // 添加样式隐藏导航栏
                const style = document.createElement('style');
                style.textContent = `
                    /* 隐藏导航栏元素 */
                    #nav-container, .header-container, header, nav, .navbar,
                    .navigation, .nav, .burger-menu, .mobile-menu, .mobile-panel {
                        display: none !important;
                    }

                    /* 移除body上的padding-top */
                    body {
                        padding-top: 0 !important;
                    }
                `;
                iframeDoc.head.appendChild(style);

                // 移除导航栏元素
                const navElements = [
                    iframeDoc.querySelector('.header-container'),
                    iframeDoc.querySelector('header'),
                    iframeDoc.querySelector('nav'),
                    iframeDoc.querySelector('.navbar'),
                    iframeDoc.querySelector('.burger-menu'),
                    iframeDoc.querySelector('.mobile-panel')
                ];

                navElements.forEach(el => {
                    if (el && el.parentNode) {
                        el.parentNode.removeChild(el);
                    }
                });
            } catch (e) {
                console.error('无法隐藏导航栏:', e);
            }
        },

        // 更新导航链接激活状态
        updateActiveNavLink: function(page) {
            // 重置所有链接
            document.querySelectorAll('.nav-link, .mobile-panel a').forEach(link => {
                link.classList.remove('active');
                link.style.color = '';
            });

            // 设置当前页面链接为激活状态
            const linkMap = {
                'gallery.html': 'gallery-link',
                'film.html': 'film-link',
                'work.html': 'work-link',
                'about.html': 'about-link'
            };

            const linkId = linkMap[page];
            if (linkId) {
                const link = document.getElementById(linkId);
                if (link) {
                    link.classList.add('active');
                    link.style.color = '#DE2910';
                }

                // 同时更新移动菜单中的链接
                document.querySelectorAll('.mobile-panel a').forEach(mobileLink => {
                    if (mobileLink.textContent.toLowerCase() === linkId.split('-')[0]) {
                        mobileLink.classList.add('active');
                        mobileLink.style.color = '#DE2910';
                    }
                });
            }
        },

        // 更新页面标题
        updatePageTitle: function(page) {
            const titleMap = {
                'index.html': 'Triple-Y',
                'model.html': 'Triple-Y - 3D Model',
                'gallery.html': 'Gallery - Triple-Y',
                'film.html': 'Film - Triple-Y',
                'work.html': 'Work - Triple-Y',
                'about.html': 'About - Triple-Y',
                'tibet.html': 'Tibet - Triple-Y',
                'north.html': 'Northern Journey - Triple-Y',
                'sanya.html': 'Island Gallery - Triple-Y',
                'pictures.html': 'Pictures - Triple-Y',
                'videos.html': '3D卡片展示 - Triple-Y'
            };

            document.title = titleMap[page] || 'Triple-Y';
        },

        // 关闭移动菜单
        closeMobileMenu: function() {
            const burgerMenu = document.getElementById('burger-menu');
            const mobilePanel = document.getElementById('mobile-panel');

            if (burgerMenu) burgerMenu.classList.remove('active');
            if (mobilePanel) mobilePanel.classList.remove('active');
        },

        // 更新加载进度
        updateLoadingProgress: function(percent) {
            const loadingPercentage = document.querySelector('.loading-percentage');
            if (loadingPercentage) {
                loadingPercentage.textContent = `${Math.round(percent)}%`;
            }
        },

        // 模型加载完成
        onModelLoaded: function() {
            const loadingOverlay = document.getElementById('loading-overlay');
            const iframe = document.getElementById('content-frame');

            // 确保显示100%
            const loadingPercentage = document.querySelector('.loading-percentage');
            if (loadingPercentage) {
                loadingPercentage.textContent = '100%';
            }

            // 隐藏加载界面
            setTimeout(() => {
                loadingOverlay.classList.add('loaded');
                iframe.classList.add('visible');
            }, 500);
        }
    };

    // 页面加载完成后初始化
    document.addEventListener('DOMContentLoaded', () => {
        UnifiedTransition.init();
    });

    // 导出转场管理器
    window.UnifiedTransition = UnifiedTransition;

    // 为了兼容现有代码，提供全局函数
    window.navigateTo = function(page) {
        UnifiedTransition.navigateTo(page);
    };

    window.updateLoadingProgress = function(percent) {
        UnifiedTransition.updateLoadingProgress(percent);
    };

    window.onModelLoaded = function() {
        UnifiedTransition.onModelLoaded();
    };
})();
