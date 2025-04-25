/**
 * 视频处理模块 - 处理Gallery页面的视频加载和播放
 */

// 检测是否为移动设备
const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
        || window.innerWidth < 768;
};

/**
 * 处理视频加载和播放
 * @param {HTMLVideoElement} video - 视频元素
 * @param {Object} options - 配置选项
 * @returns {Promise} - 视频加载和播放的Promise
 */
const handleVideo = (video, options = {}) => {
    if (!video) return Promise.reject(new Error('没有提供视频元素'));
    
    const defaults = {
        resetTime: true,
        checkSafari: true,
        setupSourceByDevice: true,
        setupEndedEvent: true
    };
    
    const settings = { ...defaults, ...options };

    // 设置视频基本属性
    video.controls = false;
    video.style.opacity = "1";
    
    if (settings.resetTime) {
        video.currentTime = 0;
    }

    // 懒加载处理
    if (!video.dataset.loaded) {
        video.dataset.loaded = "true";
        
        video.addEventListener('loadeddata', () => {
            video.classList.add('loaded');
        });
        
        video.addEventListener('error', (e) => {
            console.error(`视频加载失败: ${e.target.src}`);
            const placeholder = video.parentElement.querySelector('.video-placeholder');
            if (placeholder) {
                placeholder.style.opacity = "1";
            }
        });
    }

    // Safari浏览器优化
    if (settings.checkSafari) {
        checkAndOptimizeForSafari(video);
    }
    
    // 根据设备设置视频源
    if (settings.setupSourceByDevice) {
        setVideoSourceByDevice(video);
    }

    // 加载视频
    video.load();
    
    // 设置视频结束事件
    if (settings.setupEndedEvent && window.swiper) {
        setupVideoEndedEvent(video);
    }

    // 播放视频
    return playVideoWithRetry(video);
};

/**
 * 优化Safari浏览器的视频播放
 * @param {HTMLVideoElement} video - 视频元素 
 */
const checkAndOptimizeForSafari = (video) => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
        const sources = video.querySelectorAll('source');
        let mp4Source = null;
        sources.forEach(source => {
            if (source.type === 'video/mp4') {
                mp4Source = source;
            }
        });

        if (mp4Source) {
            video.insertBefore(mp4Source, video.firstChild);
        }
    }
};

/**
 * 设置视频结束事件处理
 * @param {HTMLVideoElement} video - 视频元素
 */
const setupVideoEndedEvent = (video) => {
    video.onended = function() {
        if (window.swiper && typeof window.swiper.slideNext === 'function' && !isMobileDevice()) {
            window.swiper.slideNext();
        }
    };
};

/**
 * 播放视频并在失败时重试
 * @param {HTMLVideoElement} video - 视频元素
 * @returns {Promise} - 播放结果的Promise
 */
const playVideoWithRetry = (video) => {
    return new Promise((resolve, reject) => {
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    resolve(video);
                })
                .catch(err => {
                    console.warn(`视频播放失败: ${err.message}, 尝试重新播放`);
                    setTimeout(() => {
                        video.play()
                            .then(() => resolve(video))
                            .catch(e => {
                                console.error('重试播放失败:', e);
                                reject(e);
                            });
                    }, 300);
                });
        } else {
            resolve(video);
        }
    });
};

/**
 * 根据设备类型设置不同分辨率的视频源
 * @param {HTMLVideoElement} video - 视频元素
 * @returns {Promise} - 设置完成的Promise
 */
const setVideoSourceByDevice = (video) => {
    if (!isMobileDevice()) return Promise.resolve(video);
    
    const sources = Array.from(video.querySelectorAll('source'));
    if (!sources.length) return Promise.resolve(video);
    
    const sourcePromises = sources.map(source => {
        return new Promise(resolve => {
            const originalSrc = source.getAttribute('data-original-src') || source.src;
            if (!source.getAttribute('data-original-src')) {
                source.setAttribute('data-original-src', originalSrc);
            }
            
            // 为移动设备设置低分辨率视频
            if (source.type === 'video/mp4' || source.type === 'video/webm') {
                const extension = source.type === 'video/mp4' ? '.mp4' : '.webm';
                const lowResSrc = originalSrc.replace(extension, '_mobile' + extension);
                
                // 检查低分辨率版本是否存在
                const testImg = new Image();
                testImg.onerror = function() {
                    console.log("低分辨率视频不存在，使用原始视频");
                    source.src = originalSrc;
                    resolve(source);
                };
                testImg.onload = function() {
                    source.src = lowResSrc;
                    resolve(source);
                };
                testImg.src = lowResSrc;
                
                source.src = originalSrc;
            } else {
                resolve(source);
            }
        });
    });
    
    return Promise.all(sourcePromises).then(() => video);
};

/**
 * 设置视频观察器，监视视频元素的可见性
 * @returns {IntersectionObserver} - 创建的观察器实例
 */
const setupVideoObserver = () => {
    const allVideos = Array.from(document.querySelectorAll('.swiper-slide video'));
    
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            
            if (entry.isIntersecting) {
                if (video.paused) {
                    if (isMobileDevice() || (window.swiper && window.swiper.activeIndex === allVideos.indexOf(video))) {
                        video.play().catch(e => {});
                    }
                }
            } else if (!video.paused) {
                video.pause();
            }
        });
    }, { threshold: 0.1, rootMargin: '200px' });
    
    allVideos.forEach(video => videoObserver.observe(video));
    
    return videoObserver;
};

/**
 * 初始化所有视频
 * @returns {Promise} - 初始化完成的Promise
 */
const initializeVideos = async () => {
    try {
        // 初始化首个视频
        const firstSlideVideo = document.querySelector('.swiper-slide video');
        if (firstSlideVideo) {
            await handleVideo(firstSlideVideo).catch(e => console.warn('首个视频初始化失败:', e));
        }

        // 在移动设备上，初始化所有视频
        if (isMobileDevice()) {
            prepareAllVideosForMobile();
        } else {
            // 桌面设备上预加载视频
            preloadRemainingVideos();
        }

        return Promise.resolve();
    } catch (error) {
        console.error('视频初始化过程中发生错误:', error);
        return Promise.reject(error);
    }
};

/**
 * 为移动设备准备所有视频
 */
const prepareAllVideosForMobile = () => {
    const allSlides = Array.from(document.querySelectorAll('.swiper-slide'));
    const allVideos = Array.from(document.querySelectorAll('.swiper-slide video'));
    
    // 准备所有幻灯片的样式更新
    allSlides.forEach(slide => {
        slide.style.opacity = "1";
        slide.style.display = "block";
        slide.style.visibility = "visible";
    });
    
    // 初始化所有视频
    const videoPromises = allVideos.map(video => {
        video.classList.add('loaded');
        video.style.opacity = "1";
        return handleVideo(video).catch(e => console.warn(`视频初始化失败: ${e.message}`));
    });
    
    return Promise.all(videoPromises);
};

/**
 * 预加载剩余视频
 */
const preloadRemainingVideos = () => {
    const preloadQueue = Array.from(document.querySelectorAll('.swiper-slide video')).slice(1);
    
    // 预加载其他视频但不等待完成
    if (preloadQueue.length > 0) {
        const preloadVideos = async () => {
            for (let i = 0; i < preloadQueue.length; i++) {
                await new Promise(resolve => setTimeout(resolve, 800));
                preloadQueue[i].load();
            }
        };
        
        preloadVideos().catch(e => console.warn('视频预加载失败:', e));
    }
};

// 导出模块功能
export {
    isMobileDevice,
    handleVideo,
    setupVideoObserver,
    initializeVideos
}; 