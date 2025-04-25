/**
 * 通用动画框架
 * 提供所有页面共享的动画功能
 */

// 确保GSAP已加载
if (typeof gsap === 'undefined') {
  console.error('GSAP未加载，动画效果将不可用');
}

// 全局动画配置
const ANIMATION = {
  duration: {
    short: 0.3,
    medium: 0.5,
    long: 0.8
  },
  ease: {
    standard: "power2.out",
    smooth: "sine.inOut",
    bounce: "back.out(1.7)"
  }
};

/**
 * 创建滚动触发的动画
 * @param {string} selector - 要动画的元素选择器
 * @param {Object} animProps - GSAP动画属性
 * @param {Object} options - 配置选项
 */
function createScrollAnimation(selector, animProps, options = {}) {
  const defaults = {
    threshold: 0.1,
    stagger: 0.1,
    delay: 0,
    duration: ANIMATION.duration.medium,
    ease: ANIMATION.ease.standard
  };
  
  const settings = { ...defaults, ...options };
  const elements = document.querySelectorAll(selector);
  
  if (elements.length === 0) return;
  
  // 设置初始状态
  gsap.set(elements, {
    opacity: 0,
    y: 20,
    ...options.initialState
  });
  
  // 创建观察器
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        gsap.to(entry.target, {
          opacity: 1,
          y: 0,
          duration: settings.duration,
          delay: settings.delay,
          ease: settings.ease,
          ...animProps
        });
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: settings.threshold
  });
  
  // 观察所有元素
  elements.forEach((el, index) => {
    // 如果有stagger，为每个元素添加不同的延迟
    if (settings.stagger && index > 0) {
      el.dataset.delay = settings.delay + (settings.stagger * index);
    }
    observer.observe(el);
  });
}

/**
 * 创建页面加载动画
 * @param {string} selector - 要动画的元素选择器
 * @param {Object} animProps - GSAP动画属性
 * @param {Object} options - 配置选项
 */
function createPageLoadAnimation(selector, animProps, options = {}) {
  const defaults = {
    stagger: 0.1,
    delay: 0.2,
    duration: ANIMATION.duration.medium,
    ease: ANIMATION.ease.standard
  };
  
  const settings = { ...defaults, ...options };
  const elements = document.querySelectorAll(selector);
  
  if (elements.length === 0) return;
  
  // 设置初始状态
  gsap.set(elements, {
    opacity: 0,
    y: 20,
    ...options.initialState
  });
  
  // 创建动画
  gsap.to(elements, {
    opacity: 1,
    y: 0,
    duration: settings.duration,
    delay: settings.delay,
    stagger: settings.stagger,
    ease: settings.ease,
    ...animProps
  });
}

/**
 * 创建悬停动画
 * @param {string} selector - 要动画的元素选择器
 * @param {Object} hoverProps - 悬停时的GSAP动画属性
 * @param {Object} leaveProps - 离开时的GSAP动画属性
 * @param {Object} options - 配置选项
 */
function createHoverAnimation(selector, hoverProps, leaveProps, options = {}) {
  const defaults = {
    duration: ANIMATION.duration.short,
    ease: ANIMATION.ease.standard
  };
  
  const settings = { ...defaults, ...options };
  const elements = document.querySelectorAll(selector);
  
  if (elements.length === 0) return;
  
  elements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(el, {
        duration: settings.duration,
        ease: settings.ease,
        ...hoverProps
      });
    });
    
    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        duration: settings.duration,
        ease: settings.ease,
        ...leaveProps
      });
    });
  });
}

/**
 * 禁用所有页面自定义过渡效果
 * 确保只使用Barba.js的过渡效果
 */
function disableCustomPageTransitions() {
  // 查找并移除所有页面自定义过渡代码
  document.querySelectorAll('script').forEach(script => {
    if (script.textContent.includes('transition.style.visibility') && 
        script.textContent.includes('transition.style.opacity')) {
      console.log('禁用自定义页面过渡代码');
      // 不直接移除脚本，而是替换其内容中的过渡代码
      const newContent = script.textContent.replace(
        /const transition[\s\S]*?setTimeout[\s\S]*?}\);/g, 
        '// 页面过渡由Barba.js统一处理'
      );
      
      // 创建新脚本替换旧脚本
      const newScript = document.createElement('script');
      newScript.textContent = newContent;
      script.parentNode.replaceChild(newScript, script);
    }
  });
}

// 在页面加载时禁用所有自定义过渡效果
document.addEventListener('DOMContentLoaded', disableCustomPageTransitions);

// 在Barba.js页面加载后也禁用自定义过渡效果
if (typeof window !== 'undefined') {
  window.addEventListener('barba-page-loaded', disableCustomPageTransitions);
}

// 导出动画函数
window.ANIMATION = ANIMATION;
window.createScrollAnimation = createScrollAnimation;
window.createPageLoadAnimation = createPageLoadAnimation;
window.createHoverAnimation = createHoverAnimation;
