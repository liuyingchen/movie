class VideoPlayer {
    constructor() {
        this.videoElement = document.getElementById('videoPlayer');
        this.videoContainer = document.getElementById('videoContainer');
        this.currentVideo = null;
        this.onTimeUpdateCallbacks = [];
        this.onEndedCallbacks = [];
        
        // 事件监听
        this.videoElement.addEventListener('timeupdate', () => this.handleTimeUpdate());
        this.videoElement.addEventListener('ended', () => this.handleEnded());
    }
    
    // 加载视频
    loadVideo(videoPath) {
        return new Promise((resolve, reject) => {
            this.currentVideo = videoPath;
            this.videoElement.src = videoPath;
            this.videoElement.load();
            
            this.videoElement.oncanplaythrough = () => {
                resolve();
            };
            
            this.videoElement.onerror = (error) => {
                reject(error);
            };
        });
    }
    
    // 播放视频
    play() {
        this.videoElement.play();
        this.videoContainer.style.display = 'block';
    }
    
    // 暂停视频
    pause() {
        this.videoElement.pause();
    }
    
    // 继续播放但保持视频作为背景
    playAsBackground() {
        this.play();
        // 视频继续播放，但游戏层级在上方
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
                item.callback();
                item.triggered = true;
            }
        });
    }
    
    // 处理视频结束事件
    handleEnded() {
        this.onEndedCallbacks.forEach(callback => callback());
    }
} 