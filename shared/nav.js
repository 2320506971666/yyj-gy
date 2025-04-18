document.addEventListener("DOMContentLoaded", function() {
    // 获取当前页面名称
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    console.log("nav.js loaded, current page:", currentPage);
    
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
        console.log("移动菜单初始化");
        
        // 确保更高的z-index，防止被其他元素覆盖
        mobileMenuButton.style.zIndex = '2000';
        mobileMenu.style.zIndex = '1999';
        
        // 在移动设备上默认显示汉堡菜单按钮
        if (window.innerWidth <= 768) {
            mobileMenuButton.style.display = 'block';
        }
        
        mobileMenuButton.addEventListener('click', function(e) {
            console.log("汉堡菜单按钮点击");
            e.stopPropagation(); // 阻止事件冒泡
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
        
        // 阻止菜单上的点击事件冒泡
        mobileMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // 点击页面其他地方关闭菜单
        document.addEventListener('click', function(e) {
            if (mobileMenu.classList.contains('open')) {
                mobileMenuButton.classList.remove('open');
                mobileMenu.classList.remove('open');
                document.body.classList.remove('menu-open');
            }
        });
    } else {
        console.log("未找到移动菜单元素");
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