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
        
        // 初始化游戏E
        this.gameE = new GameE(this.gameEContainer);
        
        // 初始化游戏F
        this.gameF = new GameF(this.gameFContainer);
        
        // 隐藏所有游戏
        this.hideAllGames();
    }
    
    // 显示加载指示器
    showLoading() {
        this.loadingIndicator.style.display = 'flex';
    }
    
    // 隐藏加载指示器
    hideLoading() {
        this.loadingIndicator.style.display = 'none';
    }
    
    // 隐藏所有游戏
    hideAllGames() {
        this.gameEContainer.style.display = 'none';
        this.gameFContainer.style.display = 'none';
    }
    
    // 启动游戏E（背景为视频A）
    startGameE() {
        console.log('启动游戏E，背景为视频A');
        // 确保视频播放器不被隐藏，而是作为背景播放
        // this.videoPlayer.hide(); // 注释掉这行，不隐藏视频
        
        // 显示游戏E容器
        this.gameEContainer.style.display = 'block';
        this.gameFContainer.style.display = 'none';
        
        // 将视频A设置为背景
        this.videoPlayer.playAsBackground();
        
        // 将视频元素传递给游戏E，使其可以设置背景
        const videoElement = this.videoPlayer.getVideoElement();
        this.gameE.setBackgroundVideo(videoElement);
        
        // 启动游戏E
        this.currentGame = this.gameE;
        this.gameE.start();
        
        // 设置游戏E完成后的回调
        this.gameE.onGameComplete(() => {
            console.log('游戏E完成');
            this.endCurrentGame();
            // 游戏流程控制器会处理后续逻辑，过渡到视频B
        });
    }
    
    // 启动游戏F（背景为视频B）
    startGameF() {
        console.log('启动游戏F，背景为视频B');
        // 确保视频播放器不被隐藏，而是作为背景播放
        // this.videoPlayer.hide(); // 注释掉这行，不隐藏视频
        
        // 隐藏游戏E，显示游戏F
        this.gameEContainer.style.display = 'none';
        this.gameFContainer.style.display = 'block';
        
        // 将视频B设置为背景
        this.videoPlayer.playAsBackground();
        
        // 将视频元素传递给游戏F，使其可以设置背景
        const videoElement = this.videoPlayer.getVideoElement();
        this.gameF.setBackgroundVideo(videoElement);
        
        // 启动游戏F
        this.currentGame = this.gameF;
        this.gameF.start();
        
        // 设置游戏F完成后的回调
        this.gameF.onGameComplete(() => {
            console.log('游戏F完成');
            this.endCurrentGame();
            // 游戏流程控制器会处理后续逻辑，过渡到视频C
        });
    }
    
    // 结束当前游戏
    endCurrentGame() {
        if (this.currentGame) {
            console.log('结束当前游戏');
            this.currentGame.end();
            this.hideAllGames();
            this.currentGame = null;
        }
    }
} 