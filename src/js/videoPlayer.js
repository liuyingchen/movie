class VideoPlayer {
    constructor() {
        this.videoElement = document.getElementById('videoPlayer');
        this.videoContainer = document.getElementById('videoContainer');
        this.currentVideo = null;
        this.onTimeUpdateCallbacks = [];
        this.onEndedCallbacks = [];
        
        // 默认将视频设为静音，以便自动播放
        this.videoElement.muted = true;
        
        // 事件监听
        this.videoElement.addEventListener('timeupdate', () => this.handleTimeUpdate());
        this.videoElement.addEventListener('ended', () => this.handleEnded());
    }
    
    // 加载视频
    loadVideo(videoPath) {
        return new Promise((resolve, reject) => {
            console.log('加载视频:', videoPath);
            this.currentVideo = videoPath;
            this.videoElement.src = videoPath;
            this.videoElement.load();
            
            this.videoElement.oncanplaythrough = () => {
                console.log('视频加载完成:', videoPath);
                resolve();
            };
            
            this.videoElement.onerror = (error) => {
                console.error('视频加载错误:', error);
                reject(error);
            };
        });
    }
    
    // 播放视频
    play() {
        console.log('播放视频');
        this.videoContainer.style.display = 'block';
        this.videoElement.style.zIndex = '1';
        
        // 使用catch来处理可能的播放失败
        const playPromise = this.videoElement.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error('视频播放失败:', error);
                console.log('尝试静音播放...');
                this.videoElement.muted = true;
                return this.videoElement.play();
            }).catch(error => {
                console.error('即使静音也无法播放视频:', error);
            });
        }
    }
    
    // 暂停视频
    pause() {
        console.log('暂停视频');
        this.videoElement.pause();
    }
    
    // 继续播放但保持视频作为背景
    playAsBackground() {
        console.log('将视频设置为背景播放');
        this.videoContainer.style.display = 'block';
        
        // 设置视频容器样式
        this.videoContainer.style.position = 'absolute';
        this.videoContainer.style.top = '0';
        this.videoContainer.style.left = '0';
        this.videoContainer.style.width = '100%';
        this.videoContainer.style.height = '100%';
        this.videoContainer.style.zIndex = '1'; // 降低z-index，确保视频在游戏层之下
        
        // 设置视频元素样式
        this.videoElement.style.width = '100%';
        this.videoElement.style.height = '100%';
        this.videoElement.style.objectFit = 'cover'; // 确保视频覆盖整个容器
        
        // 使用catch来处理可能的播放失败
        const playPromise = this.videoElement.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error('背景视频播放失败:', error);
                console.log('尝试静音播放背景视频...');
                this.videoElement.muted = true;
                return this.videoElement.play();
            }).catch(error => {
                console.error('即使静音也无法播放背景视频:', error);
            });
        }
    }
    
    // 设置静音状态
    setMuted(muted) {
        this.videoElement.muted = muted;
    }
    
    // 切换静音状态
    toggleMute() {
        this.videoElement.muted = !this.videoElement.muted;
        return this.videoElement.muted;
    }
    
    // 隐藏视频
    hide() {
        this.videoContainer.style.display = 'none';
    }
    
    // 显示视频
    show() {
        this.videoContainer.style.display = 'block';
    }
    
    // 获取当前播放时间
    getCurrentTime() {
        return this.videoElement.currentTime;
    }
    
    // 设置视频播放时间
    setCurrentTime(time) {
        this.videoElement.currentTime = time;
    }
    
    // 添加时间更新回调
    addTimeUpdateCallback(callback, triggerTime) {
        this.onTimeUpdateCallbacks.push({ callback, triggerTime, triggered: false });
    }
    
    // 添加视频结束回调
    addEndedCallback(callback) {
        this.onEndedCallbacks.push(callback);
    }
    
    // 清除所有回调
    clearCallbacks() {
        this.onTimeUpdateCallbacks = [];
        this.onEndedCallbacks = [];
    }
    
    // 处理时间更新事件
    handleTimeUpdate() {
        const currentTime = this.getCurrentTime();
        
        this.onTimeUpdateCallbacks.forEach(item => {
            if (!item.triggered && currentTime >= item.triggerTime) {
                console.log(`触发时间点回调: ${currentTime}秒`);
                item.callback();
                item.triggered = true;
            }
        });
    }
    
    // 处理视频结束事件
    handleEnded() {
        console.log('视频播放结束');
        this.onEndedCallbacks.forEach(callback => callback());
    }
    
    // 获取视频元素
    getVideoElement() {
        return this.videoElement;
    }
} 