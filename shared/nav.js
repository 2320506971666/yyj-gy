document.addEventListener("DOMContentLoaded", function() {
    // 获取当前页面名称
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    console.log("nav.js loaded, current page:", currentPage);

    // 处理导航栏逻辑
    setupMobileMenu();

    // 设置当前页面的active状态
    setActiveNavLink(currentPage);

    // 我们不再需要特殊处理 film.html 页面
    // 因为 setActiveNavLink 函数已经能够正确处理当前页面的链接激活状态
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

// 设置导航栏激活状态 - 增强版本
function setActiveNavLink(currentPage) {
    console.log('设置导航栏激活状态，当前页面:', currentPage);

    // 获取完整路径并输出当前页面，帮助调试
    const fullPath = window.location.pathname;
    console.log('完整路径:', fullPath);
    
    // 提取最终页面名称 - 增强版本，更好地处理不同环境
    // 首先从完整路径中提取最后一部分，如果没有则默认为index.html
    let finalPage = fullPath.split('/').pop() || 'index.html';
    
    // 处理路径为空或为 / 的情况
    if (!finalPage || finalPage === '' || finalPage === '/') {
        finalPage = 'index.html';
    }
    
    console.log('最终提取的页面名称:', finalPage);
    
    // 更新当前页面变量
    currentPage = finalPage;
    console.log('当前页面最终确认为:', currentPage);

    // 重置所有链接的颜色和激活状态
    document.querySelectorAll('.nav-link, .mobile-link, .main-burger-panel a').forEach(link => {
        link.classList.remove('active');
        // 强制清除所有链接的样式，确保重置
        link.style.color = '';
    });

    // 如果不是首页，则设置当前页面对应的链接为红色
    if (currentPage !== 'index.html') {
        // 设置所有匹配当前页面的链接为红色
        console.log('尝试激活链接:', currentPage);
        document.querySelectorAll(`a[href="${currentPage}"]`).forEach(link => {
            link.classList.add('active');
            // 强制设置颜色为红色
            link.style.color = '#DE2910';
            console.log('激活链接成功:', link);
        });

        // 对于 Gallery 子页面，还需要激活 Gallery 链接
        if (['tibet.html', 'north.html', 'sanya.html'].includes(currentPage)) {
            document.querySelectorAll('a[href="gallery.html"]').forEach(link => {
                link.classList.add('active');
                // 强制设置颜色为红色
                link.style.color = '#DE2910';
                console.log('激活 Gallery 链接 (子页面):', link);
            });
        }
    }

    // 使用定时器再次检查，确保链接颜色被正确设置
    // 延长定时器时间，确保页面完全加载后再次设置
    setTimeout(() => {
        console.log('定时器触发，再次检查链接颜色');
        // 再次设置当前页面的所有链接颜色
        if (currentPage !== 'index.html') {
            document.querySelectorAll(`a[href="${currentPage}"]`).forEach(link => {
                link.classList.add('active');
                // 强制设置颜色，确保覆盖任何可能的冲突样式
                link.style.color = '#DE2910 !important';
                link.setAttribute('style', 'color: #DE2910 !important');
                console.log('定时器再次设置链接颜色:', link);
            });

            // 对于 Gallery 子页面，还需要再次激活 Gallery 链接
            if (['tibet.html', 'north.html', 'sanya.html'].includes(currentPage)) {
                document.querySelectorAll('a[href="gallery.html"]').forEach(link => {
                    link.classList.add('active');
                    // 强制设置颜色，确保覆盖任何可能的冲突样式
                    link.style.color = '#DE2910 !important';
                    link.setAttribute('style', 'color: #DE2910 !important');
                    console.log('定时器再次设置 Gallery 链接颜色 (子页面):', link);
                });
            }
        }
        
        // 应用强制样式规则，确保激活的链接显示为红色
        document.querySelectorAll('.nav-link.active, .mobile-link.active').forEach(link => {
            link.setAttribute('style', 'color: #DE2910 !important; opacity: 1 !important');
        });
    }, 800); // 延长时间到800毫秒
}