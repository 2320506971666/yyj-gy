document.addEventListener("DOMContentLoaded", function() {
    // 获取当前页面名称
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // 处理导航栏逻辑
    setupMobileMenu();
    
    // 设置当前页面的active状态
    setActiveNavLink(currentPage);
});

// 设置移动菜单功能
function setupMobileMenu() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenuButton.classList.toggle('open');
            mobileMenu.classList.toggle('open');
            document.body.classList.toggle('menu-open');
        });
        
        // 点击移动菜单链接后关闭菜单
        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuButton.classList.remove('open');
                mobileMenu.classList.remove('open');
                document.body.classList.remove('menu-open');
            });
        });
    }
}

// 设置导航栏激活状态
function setActiveNavLink(currentPage) {
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    // 处理首页情况
    if (currentPage === '' || currentPage === 'index.html') {
        currentPage = 'index.html';
    }
    
    // 处理hash标记（如 #explore）
    const hash = window.location.hash;
    
    // 设置桌面导航链接激活状态
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        // 清除已有的激活状态
        link.classList.remove('active');
        
        // 匹配页面
        if (linkHref) {
            // 检查是否匹配主页面
            if (currentPage === 'index.html' && linkHref.includes('index.html')) {
                // 如果存在hash标记并且链接也包含该hash
                if (hash && linkHref.includes(hash)) {
                    link.classList.add('active');
                } else if (!hash && linkHref === 'index.html') {
                    link.classList.add('active');
                }
            } 
            // 检查是否匹配其他页面
            else if (linkHref.includes(currentPage)) {
                link.classList.add('active');
            }
        }
    });
    
    // 设置移动导航链接激活状态
    mobileLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        // 清除已有的激活状态
        link.classList.remove('active');
        
        // 匹配逻辑与桌面导航相同
        if (linkHref) {
            if (currentPage === 'index.html' && linkHref.includes('index.html')) {
                if (hash && linkHref.includes(hash)) {
                    link.classList.add('active');
                } else if (!hash && linkHref === 'index.html') {
                    link.classList.add('active');
                }
            } else if (linkHref.includes(currentPage)) {
                link.classList.add('active');
            }
        }
    });
} 