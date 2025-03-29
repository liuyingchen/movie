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
        // 确保视频播放器不被隐藏，而是作为背景播放
        // this.videoPlayer.hide(); // 注释掉这行，不隐藏视频
        
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
                videoElement.style.zIndex = '50'; 
                videoElement.style.opacity = '1';
                videoElement.style.visibility = 'visible';
                videoElement.style.display = 'block';
                
                console.log('视频背景样式设置为:', 
                    'zIndex=' + videoElement.style.zIndex, 
                    'opacity=' + videoElement.style.opacity);
                    
                // 确保视频在播放
                if (videoElement.paused) {
                    videoElement.play().catch(e => {
                        console.warn('无法自动播放视频:', e);
                    });
                }
            }
        }
        
        // 显示游戏F容器，但允许视频透过它显示
        if (this.gameFContainer) {
            // 使用内联样式确保游戏F容器可见且绝对透明
            this.gameFContainer.setAttribute('style', 
                'display: block !important; ' +
                'z-index: 999999 !important; ' +
                'position: absolute !important; ' +
                'top: 0 !important; ' +
                'left: 0 !important; ' +
                'width: 100% !important; ' +
                'height: 100% !important; ' +
                'visibility: visible !important; ' +
                'opacity: 1 !important; ' + 
                'pointer-events: auto !important; ' +
                'background-color: transparent !important;'); // 确保容器背景是透明的
            
            // 添加active类
            this.gameFContainer.classList.add('active');
            
            console.log('游戏F容器样式:', 
                'display=' + window.getComputedStyle(this.gameFContainer).display, 
                'zIndex=' + window.getComputedStyle(this.gameFContainer).zIndex);
        } else {
            console.error('游戏F容器不存在!');
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
} 