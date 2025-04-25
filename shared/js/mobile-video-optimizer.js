/**
 * 移动端视频优化模块
 * 专注于提高移动设备上的视频加载和播放性能
 */
// 引入GSAP库，确保动画效果与网页端一致
import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.2/+esm';

// 检测是否为移动设备
const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        || window.innerWidth < 768;
};

/**
 * 移动端视频优化初始化
 * 在页面加载时调用此函数
 */
export function initMobileVideoOptimizer() {
    // 仅在移动设备上执行优化
    if (!isMobileDevice()) return;

    console.log('移动端视频优化器已启动');

    // 获取所有视频元素
    const videos = document.querySelectorAll('video');

    // 简单直接地处理所有视频
    videos.forEach(video => {
        // 设置基本属性
        video.muted = true;
        video.playsinline = true;
        video.setAttribute('playsinline', '');
        video.setAttribute('preload', 'metadata');

        // 确保视频可见
        video.style.display = 'block';
        video.style.visibility = 'visible';
        video.style.opacity = '1';

        // 加载并播放视频
        video.load();
        video.play().catch(e => console.log('视频播放失败:', e));

        // 添加加载完成事件
        video.addEventListener('loadeddata', () => {
            video.classList.add('loaded');
        });
    });

    // 设置简单的视频观察器
    setupSimpleVideoObserver();

    // 监听页面可见性变化
    setupVisibilityChangeHandler();

    // 触发幻灯片浮动动画
    triggerSlideAnimations();

    // 延迟检查视频状态
    setTimeout(() => {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            if (video.paused) {
                video.play().catch(() => {
                    // 忽略错误
                });
            }
        });
    }, 1000);
}

/**
 * 设置简单的视频观察器
 */
function setupSimpleVideoObserver() {
    const videos = document.querySelectorAll('video');

    // 使用IntersectionObserver监控视频可见性
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;

            if (entry.isIntersecting) {
                // 视频进入视口，尝试播放
                if (video.paused) {
                    video.play().catch(() => {
                        // 忽略错误，避免控制台警告
                    });
                }
            } else {
                // 视频离开视口，暂停播放
                if (!video.paused) {
                    video.pause();
                }
            }
        });
    }, { threshold: 0.1 });

    // 观察所有视频
    videos.forEach(video => observer.observe(video));

    return observer;
}

// 以下是简化后的必要函数

/**
 * 设置页面可见性变化处理
 */
function setupVisibilityChangeHandler() {
    document.addEventListener('visibilitychange', () => {
        const videos = document.querySelectorAll('video');

        if (document.hidden) {
            // 页面不可见时暂停所有视频
            videos.forEach(video => {
                if (!video.paused) {
                    video.pause();
                }
            });
        } else {
            // 页面可见时播放可见视频
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const video = entry.target;
                        if (video.paused) {
                            video.play().catch(() => {
                                // 忽略错误
                            });
                        }
                    }
                });
                observer.disconnect();
            });

            videos.forEach(video => observer.observe(video));
        }
    });
}

/**
 * 触发幻灯片浮动动画
 * 为每个幻灯片添加slide-visible类，触发CSS动画
 */
function triggerSlideAnimations() {
    // 仅在移动设备上执行
    if (!isMobileDevice()) return;

    // 获取所有幻灯片
    const slides = document.querySelectorAll('.swiper-slide');

    // 如果没有找到幻灯片，直接返回
    if (!slides.length) return;

    console.log('触发幻灯片浮动动画，找到幻灯片:', slides.length);

    // 先重置所有幻灯片的样式，确保动画效果正常
    slides.forEach((slide, index) => {
        // 移除可能的内联样式，确保CSS动画可以正常工作
        slide.style.removeProperty('opacity');
        slide.style.removeProperty('transform');
        slide.style.removeProperty('transition');

        // 确保初始状态正确
        slide.style.opacity = '0';
        slide.style.transform = 'translateY(30px)';

        // 移除可能已存在的可见类
        slide.classList.remove('slide-visible');

        // 重置文字元素的初始状态 - 使用GSAP确保一致性
        if (index === 0) {
            // 第一个幻灯片：Gallery和Awaits文字
            const galleryText = slide.querySelector('.gallery-text');
            const awaitsText = slide.querySelector('.awaits-text');

            if (galleryText) {
                // 使用GSAP重置初始状态
                gsap.set(galleryText, {
                    opacity: 0,
                    clearProps: "animation"
                });
            }

            if (awaitsText) {
                // 使用GSAP重置初始状态
                gsap.set(awaitsText, {
                    opacity: 0,
                    y: 15,
                    clearProps: "animation"
                });

                // 确保元素可见（但透明）
                awaitsText.style.display = 'block';
                awaitsText.style.visibility = 'visible';
            }
        } else if (index === 1) {
            // 第二个幻灯片：Northern Journey文字
            const riverText = slide.querySelector('.river-text');
            if (riverText) {
                // 使用GSAP重置初始状态
                gsap.set(riverText, {
                    opacity: 0,
                    y: 15,
                    clearProps: "animation"
                });
            }
        }
    });

    // 延迟一小段时间后添加可见类，确保CSS过渡效果正常工作
    setTimeout(() => {
        slides.forEach((slide, index) => {
            // 使用延迟添加可见类，创造连续浮动效果
            setTimeout(() => {
                // 添加可见类，触发CSS动画
                slide.classList.add('slide-visible');
                console.log(`幻灯片 ${index + 1} 添加可见类`);

                // 处理幻灯片内的文字元素
                if (index === 0) {
                    // 第一个幻灯片：Gallery和Awaits文字
                    const galleryText = slide.querySelector('.gallery-text');
                    const awaitsText = slide.querySelector('.awaits-text');

                    if (galleryText) {
                        // 先重置初始状态
                        galleryText.style.opacity = '0';

                        // 使用与网页端一致的动画效果
                        setTimeout(() => {
                            // 使用GSAP动画，确保与网页端效果一致
                            gsap.to(galleryText, {
                                opacity: 1,
                                duration: 0.8,
                                ease: "power2.out"
                            });

                            // 为每个字母添加单独的动画
                            const letters = galleryText.querySelectorAll('span');
                            letters.forEach((letter, i) => {
                                gsap.fromTo(letter,
                                    { opacity: 0, y: 15 },
                                    {
                                        opacity: 1,
                                        y: 0,
                                        duration: 0.5,
                                        delay: 0.1 + (i * 0.05),
                                        ease: "power2.out"
                                    }
                                );
                            });
                        }, 200);
                    }

                    if (awaitsText) {
                        // 确保元素存在且可见
                        if (awaitsText.style.display === 'none') {
                            awaitsText.style.display = 'block';
                        }

                        // 先重置初始状态 - 强制设置为不可见
                        gsap.set(awaitsText, {
                            opacity: 0,
                            y: 15,
                            clearProps: "animation" // 清除之前的动画属性
                        });

                        // 使用与网页端一致的动画效果
                        setTimeout(() => {
                            // 使用GSAP动画，确保与网页端效果一致
                            gsap.to(awaitsText, {
                                opacity: 1,
                                y: 0,
                                duration: 0.7,
                                ease: "power2.out",
                                onStart: function() {
                                    console.log('Awaits 文字动画开始');
                                },
                                onComplete: function() {
                                    console.log('Awaits 文字动画完成');
                                    // 确保动画完成后元素保持可见
                                    awaitsText.style.opacity = '1';
                                }
                            });
                        }, 600);
                    }
                } else if (index === 1) {
                    // 第二个幻灯片：Northern Journey文字
                    const riverText = slide.querySelector('.river-text');
                    if (riverText) {
                        // 先重置初始状态
                        riverText.style.opacity = '0';
                        riverText.style.transform = 'translateY(15px)';

                        // 使用与网页端一致的动画效果
                        setTimeout(() => {
                            // 使用GSAP动画，确保与网页端效果一致
                            gsap.to(riverText, {
                                opacity: 1,
                                y: 0,
                                duration: 0.7, // 稍微加快动画速度
                                ease: "power2.out"
                            });
                        }, 400); // 稍微减少延迟，让动画更快开始
                    }
                }
            }, index * 200); // 每个幻灯片延迟200ms
        });
    }, 300); // 增加初始延迟，确保重置样式生效
}
