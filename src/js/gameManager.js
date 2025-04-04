class GameManager {
    constructor(videoPlayer) {
        this.videoPlayer = videoPlayer;
        this.gameEContainer = document.getElementById('gameE');
        this.gameFContainer = document.getElementById('gameF');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        
        this.gameE = null;
        this.gameF = null;
        this.currentGame = null;
    }
    
    // 初始化游戏
    init() {
        console.log('初始化游戏管理器');
        
        try {
            // 确保游戏容器存在
            this.gameEContainer = document.getElementById('gameE');
            this.gameFContainer = document.getElementById('gameF');
            
            if (!this.gameEContainer) {
                console.warn('找不到游戏E容器，创建新的容器');
                this.gameEContainer = document.createElement('div');
                this.gameEContainer.id = 'gameE';
                this.gameEContainer.className = 'game-container';
                document.body.appendChild(this.gameEContainer);
            }
            
            if (!this.gameFContainer) {
                console.warn('找不到游戏F容器，创建新的容器');
                this.gameFContainer = document.createElement('div');
                this.gameFContainer.id = 'gameF';
                this.gameFContainer.className = 'game-container';
                document.body.appendChild(this.gameFContainer);
            }
            
            // 初始化游戏E
            this.gameE = new GameE(this.gameEContainer);
            
            // 初始化游戏F
            this.gameF = new GameF(this.gameFContainer);
            
            // 隐藏所有游戏
            this.hideAllGames();
            
            console.log('游戏管理器初始化完成：gameE =', !!this.gameE, 'gameF =', !!this.gameF);
        } catch (error) {
            console.error('初始化游戏管理器失败:', error);
        }
    }
    
    // 显示加载指示器
    showLoading() {
        if (this.loadingIndicator) {
            this.loadingIndicator.style.display = 'flex';
        }
    }
    
    // 隐藏加载指示器
    hideLoading() {
        if (this.loadingIndicator) {
            this.loadingIndicator.style.display = 'none';
        }
    }
    
    // 隐藏所有游戏
    hideAllGames() {
        if (this.gameEContainer) this.gameEContainer.style.display = 'none';
        if (this.gameFContainer) this.gameFContainer.style.display = 'none';
    }
    
    // 确保游戏F已初始化
    ensureGameFInitialized() {
        // 如果游戏F未初始化，则初始化它
        if (!this.gameF) {
            console.log('游戏F未初始化，正在初始化...');
            try {
                this.gameF = new GameF(this.gameFContainer.id);
                return true;
            } catch (error) {
                console.error('游戏F初始化失败:', error);
                return false;
            }
        }
        return true;
    }
    
    // 启动游戏E（背景为视频A）
    startGameE() {
        console.log('启动游戏E，背景为视频A');
        
        // 显示游戏E容器
        if (this.gameEContainer) {
            this.gameEContainer.style.display = 'block';
        }
        if (this.gameFContainer) {
            this.gameFContainer.style.display = 'none';
        }
        
        // 将视频A设置为背景
        if (this.videoPlayer) {
            this.videoPlayer.playAsBackground();
            
            // 将视频元素传递给游戏E，使其可以设置背景
            try {
                const videoElement = this.videoPlayer.getVideoElement();
                if (videoElement && this.gameE && typeof this.gameE.setBackgroundVideo === 'function') {
                    this.gameE.setBackgroundVideo(videoElement);
                }
            } catch (error) {
                console.warn('设置背景视频失败:', error);
            }
            
            // 确保视频有声音
            this.ensureVideoAudio();
        }
        
        // 启动游戏E
        this.currentGame = this.gameE;
        if (this.gameE) {
            this.gameE.start();
            
            // 设置游戏E完成后的回调
            if (typeof this.gameE.onGameComplete === 'function') {
                this.gameE.onGameComplete(() => {
                    console.log('游戏E完成');
                    this.endCurrentGame();
                    // 游戏流程控制器会处理后续逻辑，过渡到视频B
                });
            }
        }
    }
    
    // 启动游戏F（背景为视频B）
    startGameF() {
        console.log('启动游戏F，背景为视频B');
        
        // 直接检查gameF是否存在，不再调用ensureGameFInitialized方法
        if (!this.gameF) {
            console.log('游戏F未初始化，正在初始化...');
            try {
                // 再次检查容器是否存在
                if (!this.gameFContainer) {
                    console.warn('找不到游戏F容器，创建新的容器');
                    this.gameFContainer = document.createElement('div');
                    this.gameFContainer.id = 'gameF';
                    this.gameFContainer.className = 'game-container';
                    document.body.appendChild(this.gameFContainer);
                }
                
                this.gameF = new GameF(this.gameFContainer);
            } catch (error) {
                console.error('游戏F初始化失败:', error);
                return;
            }
        }
        
        // 隐藏所有游戏容器，然后只显示游戏F
        this.hideAllGames();
        
        // 确保视频在游戏F启动前是可见的
        if (this.videoPlayer) {
            const videoElement = this.videoPlayer.getVideoElement();
            if (videoElement) {
                // 确保视频元素是可见的，并设置更高的z-index
                videoElement.style.display = 'block';
                videoElement.style.width = '100%';
                videoElement.style.height = '100%';
                videoElement.style.objectFit = 'cover';
                videoElement.style.position = 'absolute';
                videoElement.style.top = '0';
                videoElement.style.left = '0';
                videoElement.style.zIndex = '5'; // 设置为5，使其在游戏容器之下但可见
                videoElement.style.opacity = '1';
                videoElement.style.visibility = 'visible';
                
                // 确保视频容器也是全屏的
                const videoContainer = this.videoPlayer.videoContainer;
                if (videoContainer) {
                    videoContainer.style.display = 'block';
                    videoContainer.style.width = '100%';
                    videoContainer.style.height = '100%';
                    videoContainer.style.position = 'absolute';
                    videoContainer.style.top = '0';
                    videoContainer.style.left = '0';
                    videoContainer.style.zIndex = '1'; // 确保视频容器始终在低层级
                    videoContainer.style.overflow = 'hidden'; // 防止视频溢出
                }
                
                // 确保视频非静音
                videoElement.muted = false;
                videoElement.volume = 1.0;
                
                console.log('视频背景样式设置为:', 
                    'zIndex=' + videoElement.style.zIndex, 
                    'width=' + videoElement.style.width,
                    'height=' + videoElement.style.height,
                    'muted=' + videoElement.muted);
                    
                // 确保视频在播放
                if (videoElement.paused) {
                    videoElement.play().catch(e => {
                        console.warn('无法自动播放视频:', e);
                    });
                }
            }
            
            // 确保视频有声音
            this.ensureVideoAudio();
        }
        
        console.log('即将启动游戏F...');
        
        // 延迟启动游戏F，确保DOM更新
        setTimeout(() => {
            // 启动游戏F
            this.currentGame = this.gameF;
            if (this.gameF) {
                if (typeof this.gameF.start === 'function') {
                    this.gameF.start();
                    console.log('游戏F已启动!');
                    
                    // 重新检查视频是否可见和播放
                    setTimeout(() => {
                        const videoElement = this.videoPlayer.getVideoElement();
                        if (videoElement && videoElement.paused) {
                            console.log('视频暂停了，尝试重新播放');
                            videoElement.play().catch(e => {
                                console.warn('无法自动播放视频:', e);
                            });
                        }
                    }, 1000);
                } else {
                    console.error('游戏F没有start方法');
                }
            }
        }, 500);
        
        // 设置游戏F完成后的回调
        if (this.gameF) {
            if (typeof this.gameF.onComplete === 'function') {
                this.gameF.onComplete((score) => {
                    console.log('游戏F完成，得分:', score);
                    this.hideAllGames();
                    // 游戏F完成后，播放视频C
                    this.playVideoC();
                });
            } else if (typeof this.gameF.onGameComplete === 'function') {
                this.gameF.onGameComplete((score) => {
                    console.log('游戏F完成，得分:', score);
                    this.hideAllGames();
                    // 游戏F完成后，播放视频C
                    this.playVideoC();
                });
            } else {
                console.warn('游戏F没有onComplete或onGameComplete方法');
                
                // 添加自动完成逻辑，在打开所有礼物后3秒自动完成游戏
                // 这部分已在GameF类的initEidGameLogic方法中实现
            }
        }
    }
    
    // 播放视频C
    playVideoC() {
        console.log('播放视频C');
        if (this.videoPlayer && typeof this.videoPlayer.playVideo === 'function') {
            this.videoPlayer.playVideo('C');
        } else {
            console.error('无法播放视频C：视频播放器不可用或没有playVideo方法');
        }
    }
    
    // 结束当前游戏
    endCurrentGame() {
        if (this.currentGame) {
            console.log('结束当前游戏');
            
            // 使用通用的end方法或complete方法
            try {
                if (typeof this.currentGame.end === 'function') {
                    this.currentGame.end();
                } else if (typeof this.currentGame.complete === 'function') {
                    this.currentGame.complete();
                } else {
                    console.warn('当前游戏没有end或complete方法');
                }
            } catch (error) {
                console.error('结束游戏时出错:', error);
            }
            
            this.hideAllGames();
            this.currentGame = null;
        }
    }

    /**
     * 确保视频有声音
     */
    ensureVideoAudio() {
        if (!this.videoPlayer) return;
        
        const videoElement = this.videoPlayer.getVideoElement();
        if (!videoElement) return;
        
        // 解除视频静音
        videoElement.muted = false;
        videoElement.volume = 1.0;
        
        console.log('已确保视频非静音，当前静音状态:', videoElement.muted);
    }
} 