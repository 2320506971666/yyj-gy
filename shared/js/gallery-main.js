/**
 * Gallery主脚本 - 负责初始化Gallery页面组件
 */
import { isMobileDevice, handleVideo, setupVideoObserver, initializeVideos } from './video-handlers.js';
// 引入GSAP库
import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.2/+esm';

// 全局变量
let swiper;
let videoObserver;
let isAnimating = false; // 动画状态标志
let currentAnimation = null; // 当前动画实例
let switchDebounceTimer = null; // 切换防抖计时器
let pageTransitionEl = null; // 页面过渡元素
const ANIMATION_DURATION = 1.0; // 统一动画时长

/**
 * 初始化Swiper滑动组件
 */
function initializeSwiper() {
    if (isMobileDevice()) {
        // 移动端不使用Swiper滑动功能
        window.swiper = swiper = {
            activeIndex: 0,
            autoplay: { start: function() {}, stop: function() {} },
            on: function() {}
        };
        return;
    }

    // 桌面端初始化Swiper - 使用GSAP增强的淡入淡出效果
    window.swiper = swiper = new Swiper(".mySwiper", {
        loop: true,
        autoplay: false,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + '"></span>';
            }
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
            hideOnClick: false // 确保导航按钮始终可见
        },
        simulateTouch: false, // 禁用模拟触摸，减少事件冲突
        allowTouchMove: false, // 禁用触摸移动，由我们的自定义处理接管
        preventInteractionOnTransition: true, // 转场期间阻止用户交互
        speed: 0, // 禁用Swiper原生过渡，完全由GSAP控制
        effect: 'fade', // 使用fade效果，与GSAP动画保持一致
        fadeEffect: {
            crossFade: false // 禁用Swiper原生交叉淡入淡出
        },
        on: {
            init: function() {
                // 立即设置第一张幻灯片可见
                const activeSlide = this.slides[this.activeIndex];
                if (activeSlide) {
                    const video = activeSlide.querySelector('video');
                    if (video) handleVideo(video);

                    // 确保第一张幻灯片立即显示，无需等待动画
                    gsap.set(activeSlide, {autoAlpha: 1, zIndex: 1, opacity: 1});
                }

                // 设置自动播放，但稍作延迟，确保页面加载完毕
                setTimeout(() => {
                    this.params.autoplay = {
                        delay: 5000,
                        disableOnInteraction: false
                    };
                    this.autoplay.start();
                }, 1000);
            },
            slideChangeTransitionStart: function() {
                // 在幻灯片开始切换时，为当前幻灯片的文字元素添加淡出动画
                const currentSlide = this.slides[this.activeIndex];

                // 处理 river-text 淡出
                const riverText = currentSlide.querySelector('.river-text');
                if (riverText) {
                    // 添加淡出动画，与幻灯片切换同步
                    gsap.to(riverText, {
                        opacity: 0,
                        y: -20,
                        duration: ANIMATION_DURATION / 2, // 加快淡出速度
                        ease: "power2.out"
                    });
                }

                // 处理 awaits-text 淡出
                const awaitsText = currentSlide.querySelector('.awaits-text');
                if (awaitsText) {
                    // 添加淡出动画，与幻灯片切换同步
                    gsap.to(awaitsText, {
                        opacity: 0,
                        y: -15,
                        duration: ANIMATION_DURATION / 2,
                        ease: "power2.out"
                    });
                }

                createSmoothTransition(this);
            }
        }
    });

    // 为导航按钮添加防抖
    setupNavigationDebounce();
}

/**
 * 为导航按钮添加防抖功能
 */
function setupNavigationDebounce() {
    const navButtons = document.querySelectorAll('.swiper-button-next, .swiper-button-prev');

    navButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // 如果正在动画中，阻止点击
            if (isAnimating) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // 设置防抖标记
            if (switchDebounceTimer) {
                clearTimeout(switchDebounceTimer);
            }

            // 防抖期间禁用按钮
            navButtons.forEach(btn => btn.style.pointerEvents = 'none');

            // 500ms后重新启用
            switchDebounceTimer = setTimeout(() => {
                navButtons.forEach(btn => btn.style.pointerEvents = 'auto');
                switchDebounceTimer = null;
            }, 500);
        }, true);
    });
}

/**
 * 创建平滑的页面切换动画
 */
function createSmoothTransition(swiperInstance) {
    // 如果已经在执行动画，先取消当前动画
    if (currentAnimation) {
        currentAnimation.kill();
        currentAnimation = null;
    }

    isAnimating = true;

    // 获取当前幻灯片和前一个幻灯片
    const activeSlide = swiperInstance.slides[swiperInstance.activeIndex];
    const prevSlide = swiperInstance.slides[swiperInstance.previousIndex];

    if (!activeSlide || !prevSlide) {
        isAnimating = false;
        return;
    }

    // 处理视频
    const video = activeSlide.querySelector('video');
    if (video) handleVideo(video);

    // 暂停其他幻灯片中的视频
    const videos = document.querySelectorAll('.swiper-slide video');
    videos.forEach(v => {
        if (v !== video && !v.paused) {
            v.pause();
        }
    });

    // 禁用导航按钮
    const navButtons = document.querySelectorAll('.swiper-button-next, .swiper-button-prev');
    navButtons.forEach(btn => btn.style.pointerEvents = 'none');

    // 统一使用gsap的autoAlpha，设置正确的层级关系
    gsap.set(prevSlide, {autoAlpha: 1, zIndex: 1});
    gsap.set(activeSlide, {autoAlpha: 0, zIndex: 2});

    // 创建动画timeline
    const tl = gsap.timeline({
        onComplete: () => {
            isAnimating = false;
            currentAnimation = null;

            // 重置后保持明确的z-index值，而不是空字符串
            gsap.set(prevSlide, {autoAlpha: 0, zIndex: 0});
            gsap.set(activeSlide, {autoAlpha: 1, zIndex: 1});

            // 重置新幻灯片中的文字元素动画状态，并添加淡入动画

            // 处理 river-text 动画
            const newRiverText = activeSlide.querySelector('.river-text');
            if (newRiverText) {
                // 先重置位置和透明度
                gsap.set(newRiverText, {
                    opacity: 0,
                    y: 20,
                    clearProps: "animation" // 清除之前的动画属性
                });

                // 添加延迟淡入动画
                gsap.to(newRiverText, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: 0.3, // 延迟显示，让幻灯片先完成过渡
                    ease: "power2.out"
                });
            }

            // 处理 awaits-text 动画
            const newAwaitsText = activeSlide.querySelector('.awaits-text');
            if (newAwaitsText) {
                // 先重置位置和透明度
                gsap.set(newAwaitsText, {
                    opacity: 0,
                    y: 15,
                    clearProps: "animation" // 清除之前的动画属性
                });

                // 添加延迟淡入动画
                gsap.to(newAwaitsText, {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    delay: 0.5, // 比 river-text 稍晚显示
                    ease: "power2.out"
                });
            }

            // 重新启用导航按钮
            navButtons.forEach(btn => btn.style.pointerEvents = 'auto');
        }
    });

    // 统一动画时间 - 同步淡入淡出
    tl.to(activeSlide, {
        autoAlpha: 1,
        duration: ANIMATION_DURATION,
        ease: "sine.inOut"
    }, 0);

    tl.to(prevSlide, {
        autoAlpha: 0,
        duration: ANIMATION_DURATION,
        ease: "sine.inOut"
    }, 0);

    // 保存当前动画引用
    currentAnimation = tl;
}

/**
 * 设置页面可见性变化处理
 */
function setupVisibilityChangeHandler() {
    const videos = document.querySelectorAll('.swiper-slide video');

    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // 页面不可见时暂停自动播放和视频
            if (swiper && swiper.autoplay) {
                swiper.autoplay.stop();
            }

            videos.forEach(video => {
                if (!video.paused) video.pause();
            });
        } else {
            // 页面再次可见时恢复播放
            if (isMobileDevice()) {
                // 移动端：重新启动观察器
                if (videoObserver) {
                    videoObserver.disconnect();
                }
                videoObserver = setupVideoObserver();
            } else {
                // 桌面端：播放当前活动幻灯片的视频
                const activeVideo = document.querySelector('.swiper-slide-active video');
                if (activeVideo && activeVideo.paused) {
                    activeVideo.play().catch(e => {});
                }

                if (swiper && swiper.autoplay) {
                    swiper.autoplay.start();
                }
            }
        }
    });
}

/**
 * 初始化Gallery页面特定功能
 */
function setupGalleryFeatures() {
    // 使用现有的页面过渡元素
    pageTransitionEl = document.querySelector('.page-transition');

    // 确保视频在页面过渡后正确播放
    document.addEventListener('barba-page-loaded', function() {
        console.log('Gallery: Barba页面加载完成，重新初始化视频');

        // 重新初始化视频
        const videos = document.querySelectorAll('.swiper-slide video');
        videos.forEach(video => {
            video.load();
            video.play().catch(e => console.log('视频自动播放失败:', e));
        });

        // 重新初始化Swiper
        if (swiper && typeof swiper.update === 'function') {
            swiper.update();
        }
    });
}

/**
 * 页面初始化主函数
 */
async function init() {
    try {
        // 预先设置第一张幻灯片立即可见
        const firstSlide = document.querySelector('.swiper-slide:first-child');
        if (firstSlide) {
            gsap.set(firstSlide, {opacity: 1, visibility: 'visible'});
        }

        // 初始化Gallery页面特定功能
        setupGalleryFeatures();

        // 初始化Swiper
        initializeSwiper();

        // 初始化视频
        await initializeVideos();

        // 设置视频观察器
        videoObserver = setupVideoObserver();

        // 设置页面可见性处理
        setupVisibilityChangeHandler();

    } catch (error) {
        console.error('初始化失败:', error);
    }
}

// 页面加载完成后立即执行初始化，无需延迟
document.addEventListener("DOMContentLoaded", init);

// Barba.js页面加载事件也执行初始化
window.addEventListener('barba-page-loaded', function() {
    if (document.querySelector('.gallery-page')) {
        console.log('Gallery页面通过Barba.js加载，重新初始化');

        // 确保只初始化Gallery功能，不重新初始化Barba.js
        try {
            // 预先设置第一张幻灯片立即可见
            const firstSlide = document.querySelector('.swiper-slide:first-child');
            if (firstSlide) {
                gsap.set(firstSlide, {opacity: 1, visibility: 'visible'});
            }

            // 初始化Swiper
            initializeSwiper();

            // 初始化视频
            initializeVideos().then(() => {
                // 设置视频观察器
                if (videoObserver) {
                    videoObserver.disconnect();
                }
                videoObserver = setupVideoObserver();

                // 设置页面可见性处理
                setupVisibilityChangeHandler();
            }).catch(error => {
                console.error('视频初始化失败:', error);
            });
        } catch (error) {
            console.error('Gallery重新初始化失败:', error);
        }
    }
});