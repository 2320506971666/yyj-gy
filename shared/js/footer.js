/**
 * 统一页脚管理脚本
 * 集成页脚的HTML结构和CSS样式，便于统一管理和修改
 */
document.addEventListener("DOMContentLoaded", function() {
    // 获取页脚容器
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        // 注入页脚HTML
        footerContainer.innerHTML = getFooterHTML();

        // 注入页脚样式
        injectFooterStyles();
    }
});

/**
 * 处理页脚导航链接点击
 * 检测是否在iframe中，并相应地处理导航
 */
function handleFooterNavigation(page) {
    // 检查是否在iframe中
    if (window !== window.parent) {
        // 在iframe中，使用父窗口的navigateTo函数
        if (typeof window.parent.navigateTo === 'function') {
            window.parent.navigateTo(page);
        } else {
            console.warn('父窗口没有navigateTo函数，使用普通导航');
            window.parent.location.href = page;
        }
    } else {
        // 不在iframe中，直接导航
        window.location.href = page;
    }
}

// 返回页脚HTML
function getFooterHTML() {
    return `
    <footer>
        <div class="footer-content">
            <div class="footer-column">
                <h3>Contact</h3>
                <p>yang2320506971@gmail.com</p>
            </div>
            <div class="footer-column">
                <h3>Navigation</h3>
                <ul class="footer-links">
                    <li><a href="javascript:void(0)" onclick="handleFooterNavigation('film.html')">Film</a></li>
                    <li><a href="javascript:void(0)" onclick="handleFooterNavigation('gallery.html')">Gallery</a></li>
                    <li><a href="javascript:void(0)" onclick="handleFooterNavigation('work.html')">Work</a></li>
                    <li><a href="javascript:void(0)" onclick="handleFooterNavigation('about.html')">About</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h3>Gallery</h3>
                <ul class="footer-links">
                    <li><a href="javascript:void(0)" onclick="handleFooterNavigation('tibet.html')">Tibet</a></li>
                    <li><a href="javascript:void(0)" onclick="handleFooterNavigation('north.html')">Northern Journey</a></li>
                    <li><a href="javascript:void(0)" onclick="handleFooterNavigation('film.html')">Summer Sense</a></li>
                    <li><a href="javascript:void(0)" onclick="handleFooterNavigation('sanya.html')">Island</a></li>
                </ul>
            </div>
        </div>
        <div class="copyright">
            © 2025 Artist Portfolio. All rights reserved.
        </div>
    </footer>`;
}

// 注入页脚样式
function injectFooterStyles() {
    if (!document.getElementById('footer-styles')) {
        const style = document.createElement('style');
        style.id = 'footer-styles';
        style.textContent = `
        /* 页脚样式 */
        footer {
            background-color: #111;
            color: white;
            padding: 4rem 5% 2rem;
        }

        .footer-content {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 4rem;
            max-width: 1200px;
            margin: 0 auto 3rem;
            justify-content: center;
        }

        .footer-column h3 {
            font-size: 1.3rem;
            font-weight: 400;
            margin-bottom: 1.8rem;
            position: relative;
            display: inline-block;
            letter-spacing: 1px;
            font-family: 'Playfair Display', serif;
        }

        .footer-column h3::after {
            content: '';
            position: absolute;
            height: 1px;
            width: 40px;
            background-color: #DE2910;
            bottom: -10px;
            left: 0;
        }

        .footer-column p {
            font-size: 1rem;
            line-height: 1.8;
            color: #ddd;
            margin-bottom: 0.8rem;
            letter-spacing: 0.5px;
        }

        .footer-links {
            list-style: none;
            padding: 0;
        }

        .footer-links li {
            margin-bottom: 1.2rem;
        }

        .footer-links a {
            text-decoration: none;
            color: #ddd;
            transition: color 0.3s ease, letter-spacing 0.3s ease;
            font-size: 1rem;
            letter-spacing: 0.5px;
        }

        .footer-links a:hover {
            color: white;
            letter-spacing: 1px;
        }

        .copyright {
            text-align: center;
            padding-top: 2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            color: #aaa;
            font-size: 0.9rem;
            max-width: 1200px;
            margin: 0 auto;
        }

        /* 响应式样式 */
        @media (max-width: 768px) {
            .footer-content {
                grid-template-columns: 1fr;
                gap: 3rem;
            }
        }`;
        document.head.appendChild(style);
    }
}