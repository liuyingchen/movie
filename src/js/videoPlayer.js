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
        
        // 检测设备类型
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // 根据设备类型采取不同策略
        if (isIOS) {
            // iOS设备上，先尝试静音播放
            this.videoElement.muted = false;
            this.videoElement.volume = 1.0;
            console.log('iOS设备：尝试静音播放');
        } else if (isMobile) {
            // 其他移动设备，也先尝试静音播放
            this.videoElement.muted = false;
            this.videoElement.volume = 1.0;
            console.log('移动设备：尝试静音播放');
        } else {
            // 桌面设备，尝试直接启用声音播放
            this.videoElement.muted = false;
            this.videoElement.volume = 1.0;
            console.log('桌面设备：尝试直接播放声音');
        }
        
        // 更安全的播放方法，适用于各种设备
        const safePlay = () => {
            // 尝试播放
            const playPromise = this.videoElement.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('视频成功开始播放');
                    
                    // 如果是移动设备，使用交互事件启用声音
                    if (isMobile) {
                        // 尝试取消静音（可能需要用户交互）
                        const userInteractionHandler = () => {
                            this.videoElement.muted = false;
                            this.videoElement.volume = 1.0;
                            console.log('用户交互已启用声音');
                            
                            // 移除事件监听器
                            document.removeEventListener('click', userInteractionHandler);
                            document.removeEventListener('touchstart', userInteractionHandler);
                        };
                        
                        // 添加用户交互事件，在用户交互时尝试取消静音
                        document.addEventListener('click', userInteractionHandler);
                        document.addEventListener('touchstart', userInteractionHandler);
                    }
                    // 桌面设备上，如果直接播放失败，也会在catch中处理
                }).catch(error => {
                    console.error('视频播放失败:', error);
                    console.log('尝试静音播放作为备选方案');
                    
                    // 无论什么设备，如果播放失败，尝试静音播放
                    this.videoElement.muted = true;
                    return this.videoElement.play().then(() => {
                        console.log('静音播放成功，现在需要用户交互启用声音');
                        
                        // 添加用户交互处理程序来启用声音
                        const userInteractionHandler = () => {
                            this.videoElement.muted = false;
                            this.videoElement.volume = 1.0;
                            console.log('用户交互后启用声音');
                            
                            // 移除事件监听器
                            document.removeEventListener('click', userInteractionHandler);
                            document.removeEventListener('touchstart', userInteractionHandler);
                        };
                        
                        document.addEventListener('click', userInteractionHandler);
                        document.addEventListener('touchstart', userInteractionHandler);
                    }).catch(err => {
                        console.error('即使静音也无法播放视频:', err);
                    });
                });
            }
        };
        
        // 立即执行播放
        safePlay();
        
        // 为了增加在移动设备上播放的机会，我们在短暂延迟后再次尝试
        if (isMobile) {
            setTimeout(safePlay, 100);
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
        
        // 检测设备类型
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // 根据设备类型采取不同策略
        if (isIOS || isMobile) {
            // 移动设备上，先尝试静音播放
            this.videoElement.muted = false;
            this.videoElement.volume = 1.0;
            console.log('移动设备：背景视频尝试静音播放');
        } else {
            // 桌面设备，尝试直接启用声音播放
            this.videoElement.muted = false;
            this.videoElement.volume = 1.0;
            console.log('桌面设备：背景视频尝试直接播放声音');
        }
        
        // 设置视频容器样式
        this.videoContainer.style.position = 'absolute';
        this.videoContainer.style.top = '0';
        this.videoContainer.style.left = '0';
        this.videoContainer.style.width = '100%';
        this.videoContainer.style.height = '100%';
        this.videoContainer.style.zIndex = '1'; // 降低z-index，确保视频在游戏层之下
        
        // 设置视频元素样式，确保在所有设备上正常工作
        this.videoElement.style.width = '100%';
        this.videoElement.style.height = '100%';
        this.videoElement.style.objectFit = 'cover'; // 确保视频覆盖整个容器
        this.videoElement.style.position = 'absolute';
        this.videoElement.style.top = '0';
        this.videoElement.style.left = '0';
        
        // 更安全的播放方法，适用于各种设备
        const safePlay = () => {
            // 尝试播放
            const playPromise = this.videoElement.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('背景视频成功播放');
                    
                    // 如果是移动设备，使用交互事件启用声音
                    if (isMobile) {
                        // 尝试取消静音（可能需要用户交互）
                        const userInteractionHandler = () => {
                            this.videoElement.muted = false;
                            this.videoElement.volume = 1.0;
                            console.log('用户交互已为背景视频启用声音');
                            
                            // 移除事件监听器
                            document.removeEventListener('click', userInteractionHandler);
                            document.removeEventListener('touchstart', userInteractionHandler);
                        };
                        
                        // 添加用户交互事件，在用户交互时尝试取消静音
                        document.addEventListener('click', userInteractionHandler);
                        document.addEventListener('touchstart', userInteractionHandler);
                    }
                }).catch(error => {
                    console.error('背景视频播放失败:', error);
                    console.log('尝试静音播放背景视频作为备选方案');
                    
                    // 无论什么设备，如果播放失败，尝试静音播放
                    this.videoElement.muted = true;
                    return this.videoElement.play().then(() => {
                        console.log('背景视频静音播放成功，现在需要用户交互启用声音');
                        
                        // 添加用户交互处理程序来启用声音
                        const userInteractionHandler = () => {
                            this.videoElement.muted = false;
                            this.videoElement.volume = 1.0;
                            console.log('用户交互后为背景视频启用声音');
                            
                            // 移除事件监听器
                            document.removeEventListener('click', userInteractionHandler);
                            document.removeEventListener('touchstart', userInteractionHandler);
                        };
                        
                        document.addEventListener('click', userInteractionHandler);
                        document.addEventListener('touchstart', userInteractionHandler);
                    }).catch(err => {
                        console.error('即使静音也无法播放背景视频:', err);
                    });
                });
            }
        };
        
        // 立即执行播放
        safePlay();
        
        // 为了增加在移动设备上播放的机会，我们在短暂延迟后再次尝试
        if (isMobile) {
            setTimeout(safePlay, 100);
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
    
    // 预加载视频但不显示或播放
    preloadVideo(videoPath) {
        return new Promise((resolve, reject) => {
            console.log('预加载视频:', videoPath);
            
            // 检测是否为iOS设备
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            
            if (isIOS) {
                console.log('检测到iOS设备，使用替代预加载方法');
                // 对于iOS，我们使用XHR来预加载视频，这对某些iOS版本更有效
                const xhr = new XMLHttpRequest();
                xhr.open('GET', videoPath, true);
                xhr.responseType = 'blob';
                
                xhr.onload = function() {
                    if (this.status === 200) {
                        // 成功预加载
                        console.log('iOS设备上视频预加载成功:', videoPath);
                        resolve();
                    } else {
                        console.error('iOS视频预加载失败:', this.status);
                        reject(new Error(`加载失败，状态码: ${this.status}`));
                    }
                };
                
                xhr.onerror = function(error) {
                    console.error('iOS视频预加载发生错误:', error);
                    reject(error);
                };
                
                // 发送请求开始加载
                xhr.send();
            } else {
                // 非iOS设备，使用原来的预加载方法
                // 创建一个临时的video元素用于预加载
                const tempVideo = document.createElement('video');
                tempVideo.style.display = 'none'; // 隐藏元素
                tempVideo.setAttribute('playsinline', ''); // 增加iOS兼容性
                tempVideo.setAttribute('webkit-playsinline', ''); // 增加iOS兼容性
                tempVideo.setAttribute('muted', ''); // 增加iOS兼容性
                tempVideo.muted = true; // 确保静音
                tempVideo.preload = 'auto'; // 设置预加载属性
                
                // 设置事件监听器
                tempVideo.oncanplaythrough = () => {
                    console.log('视频预加载完成:', videoPath);
                    // 从DOM中移除临时视频元素
                    if (tempVideo.parentNode) {
                        tempVideo.parentNode.removeChild(tempVideo);
                    }
                    resolve();
                };
                
                tempVideo.onerror = (error) => {
                    console.error('视频预加载错误:', error);
                    // 从DOM中移除临时视频元素
                    if (tempVideo.parentNode) {
                        tempVideo.parentNode.removeChild(tempVideo);
                    }
                    reject(error);
                };
                
                // 设置超时，如果加载时间过长
                const timeout = setTimeout(() => {
                    console.log('视频预加载超时，但继续尝试:', videoPath);
                    resolve(); // 即使超时也继续进行
                }, 10000); // 10秒超时
                
                tempVideo.oncanplaythrough = () => {
                    clearTimeout(timeout);
                    console.log('视频预加载完成:', videoPath);
                    if (tempVideo.parentNode) {
                        tempVideo.parentNode.removeChild(tempVideo);
                    }
                    resolve();
                };
                
                // 设置视频源
                tempVideo.src = videoPath;
                
                // 将临时视频元素添加到DOM中（但保持隐藏）
                document.body.appendChild(tempVideo);
                
                // 开始加载
                tempVideo.load();
            }
        });
    }
} 