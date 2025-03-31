class VideoPlayer {
    constructor() {
        this.videoElement = document.getElementById('videoPlayer');
        this.videoContainer = document.getElementById('videoContainer');
        this.currentVideo = null;
        this.onTimeUpdateCallbacks = [];
        this.onEndedCallbacks = [];
        
        // 创建文字覆盖层元素，使其完全居中
        this.textOverlay = document.createElement('div');
        this.textOverlay.id = 'videoTextOverlay';
        this.textOverlay.style.position = 'absolute';
        this.textOverlay.style.top = '0';
        this.textOverlay.style.left = '0';
        this.textOverlay.style.width = '100%';
        this.textOverlay.style.height = '100%';
        this.textOverlay.style.display = 'flex';
        this.textOverlay.style.flexDirection = 'column'; // 使用column布局，文字在上，按钮在下
        this.textOverlay.style.justifyContent = 'center';
        this.textOverlay.style.alignItems = 'center';
        this.textOverlay.style.zIndex = '1000000'; // 设置超高的z-index确保在最上层
        
        // 创建内部文本容器，用于实际显示文本
        this.textContent = document.createElement('div');
        this.textContent.style.color = 'white';
        this.textContent.style.fontSize = '24px';
        this.textContent.style.textAlign = 'center';
        this.textContent.style.maxWidth = '80%';
        this.textContent.style.padding = '20px';
        this.textContent.style.marginBottom = '40px'; // 添加下边距，与按钮分开
        this.textContent.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.8)';
        // 可选：添加半透明背景使文字更易读
        this.textContent.style.backgroundColor = 'rgba(0, 0, 0, 0.01)';
        this.textContent.style.borderRadius = '10px';
        
        // 创建开始按钮
        this.startButton = document.createElement('button');
        this.startButton.textContent = 'START';
        this.startButton.style.padding = '15px 40px';
        this.startButton.style.fontSize = '24px';
        this.startButton.style.backgroundColor = '#4CAF50';
        this.startButton.style.color = 'white';
        this.startButton.style.border = 'none';
        this.startButton.style.borderRadius = '8px';
        this.startButton.style.cursor = 'pointer';
        this.startButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        this.startButton.style.transition = 'all 0.3s';
        
        // 添加按钮悬停和点击效果
        this.startButton.onmouseover = () => {
            this.startButton.style.backgroundColor = '#45a049';
            this.startButton.style.transform = 'translateY(-2px)';
            this.startButton.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.4)';
        };
        
        this.startButton.onmouseout = () => {
            this.startButton.style.backgroundColor = '#4CAF50';
            this.startButton.style.transform = 'translateY(0)';
            this.startButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        };
        
        this.startButton.onmousedown = () => {
            this.startButton.style.transform = 'translateY(1px)';
            this.startButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
        };
        
        this.startButton.onmouseup = () => {
            this.startButton.style.transform = 'translateY(-2px)';
            this.startButton.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.4)';
        };
        
        // 将文本容器和按钮添加到覆盖层
        this.textOverlay.appendChild(this.textContent);
        this.textOverlay.appendChild(this.startButton);
        
        // 添加覆盖层到视频容器
        this.videoContainer.appendChild(this.textOverlay);
        
        // 默认隐藏覆盖层
        this.textOverlay.style.display = 'none';
        
        // 默认将视频设为非静音，允许声音播放
        this.videoElement.muted = false;
        this.videoElement.volume = 1.0;
        
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
        
        // 最小化修改：确保视频有声音
        this.videoElement.muted = false;
        this.videoElement.volume = 1.0;
        
        // 使用catch来处理可能的播放失败
        const playPromise = this.videoElement.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error('视频播放失败:', error);
                console.log('尝试静音播放...');
                this.videoElement.muted = true;
                return this.videoElement.play();
            }).then(() => {
                // 播放成功后尝试重新启用声音
                setTimeout(() => {
                    this.videoElement.muted = false;
                }, 1000);
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
        
        // 最小化修改：确保视频有声音
        this.videoElement.muted = false;
        this.videoElement.volume = 1.0;
        
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
            }).then(() => {
                // 播放成功后尝试重新启用声音
                setTimeout(() => {
                    this.videoElement.muted = false;
                }, 1000);
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
    
    // 显示视频的第一帧作为背景，并展示文字和按钮
    showFirstFrameWithTextAndButton(text, onButtonClick) {
        console.log('显示视频第一帧作为背景，并展示文字和按钮');
        
        // 确保视频容器可见
        this.videoContainer.style.display = 'block';
        
        // 暂停在第一帧
        this.videoElement.currentTime = 0;
        this.videoElement.pause();
        
        // 确保视频元素是可见的
        this.videoElement.style.display = 'block';
        this.videoElement.style.width = '100%';
        this.videoElement.style.height = '100%';
        this.videoElement.style.objectFit = 'cover';
        
        // 显示文字和按钮
        this.textContent.textContent = text;
        this.textOverlay.style.display = 'flex';
        
        // 设置按钮点击事件
        // 移除之前的所有事件监听器
        const newButton = this.startButton.cloneNode(true);
        this.textOverlay.replaceChild(newButton, this.startButton);
        this.startButton = newButton;
        
        // 添加按钮悬停和点击效果
        this.startButton.onmouseover = () => {
            this.startButton.style.backgroundColor = '#45a049';
            this.startButton.style.transform = 'translateY(-2px)';
            this.startButton.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.4)';
        };
        
        this.startButton.onmouseout = () => {
            this.startButton.style.backgroundColor = '#4CAF50';
            this.startButton.style.transform = 'translateY(0)';
            this.startButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        };
        
        this.startButton.onmousedown = () => {
            this.startButton.style.transform = 'translateY(1px)';
            this.startButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
        };
        
        this.startButton.onmouseup = () => {
            this.startButton.style.transform = 'translateY(-2px)';
            this.startButton.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.4)';
        };
        
        // 添加新的点击事件
        this.startButton.addEventListener('click', () => {
            // 隐藏按钮
            this.startButton.style.display = 'none';
            
            // 执行回调函数
            if (typeof onButtonClick === 'function') {
                onButtonClick();
            }
        });
    }
    
    // 添加一个新方法来显示文字覆盖层
    showTextOverlay(text) {
        this.textContent.textContent = text;
        this.textOverlay.style.display = 'flex'; // 使用flex而不是block
        // 隐藏按钮
        this.startButton.style.display = 'none';
    }
    
    // 添加一个新方法来显示文字覆盖层，并在指定秒数后自动隐藏
    showTextOverlayWithTimeout(text, seconds = 5) {
        this.textContent.textContent = text;
        this.textOverlay.style.display = 'flex'; // 使用flex而不是block
        // 隐藏按钮
        this.startButton.style.display = 'none';
        
        // 设置定时器，在指定秒数后自动隐藏文字
        if (this.textOverlayTimer) {
            clearTimeout(this.textOverlayTimer);
        }
        
        this.textOverlayTimer = setTimeout(() => {
            this.hideTextOverlay();
        }, seconds * 1000);
    }
    
    // 添加一个新方法来隐藏文字覆盖层
    hideTextOverlay() {
        this.textOverlay.style.display = 'none';
    }
} 