/**
 * 简化版转场效果管理器
 * 只保留高级模糊转场效果，转场时间根据页面加载情况动态调整
 */

(function() {
    // 添加转场样式
    function addTransitionStyles() {
        if (document.getElementById('simple-transition-styles')) return;

        const style = document.createElement('style');
        style.id = 'simple-transition-styles';
        style.textContent = `
            /* 转场覆盖层 */
            .transition-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: black;
                z-index: 99999;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.8s cubic-bezier(0.33, 1, 0.68, 1),
                            visibility 0s linear 0.8s;
                pointer-events: none;
                will-change: opacity;
            }

            .transition-overlay.active {
                opacity: 1;
                visibility: visible;
                pointer-events: all;
                transition: opacity 0.8s cubic-bezier(0.33, 1, 0.68, 1),
                            visibility 0s linear 0s;
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
                animation: blurFadeIn 0.8s cubic-bezier(0.33, 1, 0.68, 1) forwards 0.1s;
                transform-origin: center center;
                will-change: opacity, filter, transform;
                opacity: 0; /* 确保初始状态是不可见的 */
            }

            /* 特殊页面处理 */
            .gallery-page .blur-fade-in,
            body[class*="tibet"] .blur-fade-in,
            body[class*="north"] .blur-fade-in,
            body[class*="sanya"] .blur-fade-in {
                animation-delay: 0.3s; /* 特殊页面使用更长的延迟 */
            }

            /* iframe 样式 (仅用于 index.html) */
            #content-frame {
                position: fixed;
                top: 45px;
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
                will-change: opacity, filter, transform;
            }

            #content-frame.visible {
                opacity: 1;
                filter: blur(0);
                transform: scale(1);
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

    // 简化版转场管理器
    const SimpleTransition = {
        // 是否是iframe模式 (index.html)
        isIframeMode: false,

        // 初始化
        init: function() {
            // 添加转场样式
            addTransitionStyles();

            // 创建转场覆盖层
            createOverlay();

            // 检测是否是iframe模式
            this.isIframeMode = !!document.getElementById('content-frame');

            // 应用初始模糊效果
            if (!this.isIframeMode) {
                // 普通页面模式
                this.applyBlurEffect();

                // 处理所有链接
                this.setupLinks();
            } else {
                // iframe模式 (index.html)
                this.setupIframe();
            }
        },

        // 应用模糊效果
        applyBlurEffect: function() {
            // 检查当前页面类型
            const isGalleryPage = document.body.classList.contains('gallery-page') ||
                                 document.querySelector('.gallery-page') !== null;

            // 检查是否是tibet、north或sanya页面
            const isTibetPage = document.title.includes('Tibet') ||
                               window.location.href.includes('tibet.html');
            const isNorthPage = document.title.includes('Northern Journey') ||
                               window.location.href.includes('north.html');
            const isSanyaPage = document.title.includes('Island') ||
                               window.location.href.includes('sanya.html');

            // 特殊页面需要特殊处理
            const isSpecialPage = isGalleryPage || isTibetPage || isNorthPage || isSanyaPage;

            if (isSpecialPage) {
                console.log('检测到特殊页面，应用特殊过渡效果');
                // 特殊页面只对main元素应用过渡效果，避免与内部动画冲突
                const mainElement = document.querySelector('main');
                if (mainElement) {
                    mainElement.classList.add('blur-fade-in');
                }
                return;
            }

            // 为页面主要内容应用模糊效果
            const mainContent = document.querySelector('main') ||
                               document.querySelector('.main-content') ||
                               document.querySelector('.content') ||
                               document.querySelector('.pictures-page') ||
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

                        // 显示转场覆盖层
                        this.showOverlay();

                        // 预加载目标页面
                        this.preloadPage(href, () => {
                            // 页面预加载完成后跳转
                            window.location.href = href;
                        });
                    });
                }
            });
        },

        // 设置iframe (仅用于index.html)
        setupIframe: function() {
            const iframe = document.getElementById('content-frame');
            if (!iframe) return;

            // 处理iframe加载完成事件
            iframe.addEventListener('load', () => {
                // 隐藏iframe内的导航栏
                this.hideIframeNav(iframe);

                // 显示iframe内容
                iframe.classList.add('visible');
            });

            // 处理导航链接
            document.querySelectorAll('[onclick*="navigateTo"]').forEach(link => {
                const onclickAttr = link.getAttribute('onclick');
                const match = onclickAttr.match(/navigateTo\(['"](.+)['"]\)/);

                if (match && match[1]) {
                    const targetPage = match[1];

                    // 替换onclick属性
                    link.removeAttribute('onclick');
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.navigateIframe(targetPage);
                    });
                }
            });
        },

        // iframe导航 (仅用于index.html)
        navigateIframe: function(page) {
            const iframe = document.getElementById('content-frame');
            const loadingOverlay = document.getElementById('loading-overlay');
            if (!iframe) return;

            // 淡出当前页面
            iframe.classList.remove('visible');

            // 更新URL参数
            const url = new URL(window.location);
            url.searchParams.set('page', page);
            window.history.pushState({page: page}, '', url);

            // 检查是否是模型页面
            const isModelPage = (page === 'model.html');

            // 如果是模型页面，显示加载覆盖层
            if (isModelPage && loadingOverlay) {
                // 重置加载覆盖层状态
                loadingOverlay.classList.remove('loaded');

                // 重置加载百分比
                const loadingPercentage = document.querySelector('.loading-percentage');
                if (loadingPercentage) {
                    loadingPercentage.textContent = '0%';
                }
            }

            // 预加载目标页面
            this.preloadPage(page, () => {
                // 页面预加载完成后更新iframe src
                iframe.src = './' + page;
            });
        },

        // 隐藏iframe内的导航栏
        hideIframeNav: function(iframe) {
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
            } catch (e) {
                console.error('无法隐藏iframe导航栏:', e);
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

        // 预加载页面 - 使用浏览器原生预加载机制
        preloadPage: function(url, callback) {
            // 检查是否已经有相同URL的预加载链接
            const existingLinks = document.querySelectorAll('link[rel="prefetch"], link[rel="prerender"]');
            for (let i = 0; i < existingLinks.length; i++) {
                if (existingLinks[i].href.includes(url)) {
                    // 已经在预加载，直接执行回调
                    if (callback) setTimeout(callback, 10);
                    return;
                }
            }

            // 创建预加载链接
            const preloadLink = document.createElement('link');

            // 对于模型页面使用prerender，其他页面使用prefetch
            if (url.includes('model.html')) {
                preloadLink.rel = 'prerender';
            } else {
                preloadLink.rel = 'prefetch';
            }

            // 设置完整URL
            preloadLink.href = url.startsWith('./') ? url : './' + url;

            // 添加到文档头部
            document.head.appendChild(preloadLink);

            // 由于prefetch/prerender不会触发onload事件，我们需要模拟加载完成
            // 使用较短的延迟来模拟预加载完成
            // 对于不同页面使用不同的延迟
            let delay = 200; // 默认延迟

            if (url.includes('model.html')) {
                delay = 500; // 模型页面使用较长延迟
            } else if (url.includes('gallery.html')) {
                delay = 400; // Gallery页面使用中等延迟，给更多时间加载资源
                console.log('检测到Gallery页面，使用延长的预加载时间:', delay);
            } else if (url.includes('tibet.html') || url.includes('north.html') || url.includes('sanya.html')) {
                delay = 350; // 图片/视频页面使用中等延迟，给更多时间加载资源
                console.log('检测到图片/视频页面，使用延长的预加载时间:', delay);
            }

            setTimeout(function() {
                // 执行回调
                if (callback) callback();

                // 延迟移除预加载链接，避免内存泄漏
                setTimeout(function() {
                    if (document.head.contains(preloadLink)) {
                        document.head.removeChild(preloadLink);
                    }
                }, 5000);
            }, delay);
        }
    };

    // 页面加载完成后初始化
    document.addEventListener('DOMContentLoaded', function() {
        SimpleTransition.init();
    });

    // 导出转场管理器
    window["SimpleTransition"] = SimpleTransition;

    // 为了兼容现有代码，提供全局函数
    window["navigateTo"] = function(page) {
        if (SimpleTransition.isIframeMode) {
            SimpleTransition.navigateIframe(page);
        } else {
            SimpleTransition.showOverlay();
            SimpleTransition.preloadPage(page, function() {
                window.location.href = page;
            });
        }
    };

    // 提供全局更新加载进度函数
    window["updateLoadingProgress"] = function(percent) {
        // 只在 index.html 中使用
        if (SimpleTransition.isIframeMode) {
            // 更新加载百分比显示
            const loadingPercentage = document.querySelector('.loading-percentage');
            if (loadingPercentage) {
                loadingPercentage.textContent = `${Math.round(percent)}%`;
            }

            // 如果加载完成，显示内容
            if (percent >= 100) {
                const iframe = document.getElementById('content-frame');
                const loadingOverlay = document.getElementById('loading-overlay');

                // 隐藏加载动画
                if (loadingOverlay) {
                    loadingOverlay.classList.add('loaded');
                }

                // 显示iframe内容
                if (iframe && !iframe.classList.contains('visible')) {
                    iframe.classList.add('visible');
                }
            }
        }
    };
})();
