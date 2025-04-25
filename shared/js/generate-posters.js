/**
 * 视频海报生成脚本
 * 用于从视频中提取第一帧作为海报图像
 * 
 * 注意：此脚本仅用于开发环境，生产环境应使用预先生成的海报图像
 */

// 检测是否为移动设备
const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
        || window.innerWidth < 768;
};

/**
 * 为视频生成海报图像
 */
function generateVideoPoster() {
    // 获取所有视频元素
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
        // 如果视频已经有海报，跳过
        if (video.hasAttribute('poster') && video.getAttribute('poster') !== '') {
            return;
        }
        
        // 获取视频ID
        const videoId = video.dataset.videoId || '';
        
        // 设置默认海报路径
        let posterPath = '';
        
        // 根据视频ID设置海报路径
        if (videoId === 'tibet') {
            posterPath = 'artistweb/images/tibet-poster.jpg';
        } else if (videoId === 'summer') {
            posterPath = 'artistweb/images/summer-poster.jpg';
        } else if (videoId === 'sanya') {
            posterPath = 'artistweb/images/sanya-poster.jpg';
        } else {
            // 默认海报
            posterPath = 'artistweb/images/video-poster.jpg';
        }
        
        // 设置海报
        video.setAttribute('poster', posterPath);
        
        // 在移动设备上，预加载海报图像
        if (isMobileDevice()) {
            const img = new Image();
            img.src = posterPath;
        }
    });
}

// 页面加载完成后生成海报
document.addEventListener('DOMContentLoaded', generateVideoPoster);

// 导出函数
export { generateVideoPoster };
