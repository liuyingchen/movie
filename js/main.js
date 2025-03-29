// 游戏流程控制
class GameFlow {
    constructor() {
        // 初始化视频播放器
        this.videoPlayer = new VideoPlayer();
        
        // 初始化游戏管理器
        this.gameManager = new GameManager(this.videoPlayer);
        
        // 视频路径
        this.videoA = 'assets/videos/videoA.mp4';
        this.videoB = 'assets/videos/videoB.mp4';
        this.videoC = 'assets/videos/videoC.mp4';
        
        // 游戏E触发时间（视频A播放后的秒数）
        this.gameETriggerTime = 10; // 假设10秒后触发游戏E
        
        // 游戏F触发时间（视频B播放后的秒数）
        this.gameFTriggerTime = 10; // 假设10秒后触发游戏F
    }
    
    // 初始化
    async init() {
        // 显示加载指示器
        this.gameManager.showLoading();
        
        try {
            // 初始化游戏管理器
            this.gameManager.init();
            
            // 设置游戏完成回调
            this.setupGameCallbacks();
            
            // 隐藏加载指示器
            this.gameManager.hideLoading();
            
            // 开始游戏流程
            this.startFlow();
        } catch (error) {
            console.error('初始化失败:', error);
            alert('游戏加载失败，请刷新页面重试。');
        }
    }
    
    // 设置游戏完成回调
    setupGameCallbacks() {
        // 游戏E完成后的回调
        this.gameManager.gameE.onGameComplete(() => {
            this.gameManager.endCurrentGame();
            this.playVideoB();
        });
        
        // 游戏F完成后的回调
        this.gameManager.gameF.onGameComplete(() => {
            this.gameManager.endCurrentGame();
            this.playVideoC();
        });
    }
    
    // 开始游戏流程
    async startFlow() {
        // 开始播放视频A
        await this.playVideoA();
    }
    
    // 播放视频A
    async playVideoA() {
        this.gameManager.showLoading();
        
        try {
            // 加载视频A
            await this.videoPlayer.loadVideo(this.videoA);
            
            // 隐藏加载指示器
            this.gameManager.hideLoading();
            
            // 播放视频A
            this.videoPlayer.play();
            
            // 设置视频A的时间更新回调，在特定时间触发游戏E
            this.videoPlayer.addTimeUpdateCallback(() => {
                // 视频A继续作为背景播放
                this.videoPlayer.playAsBackground();
                
                // 启动游戏E
                this.gameManager.startGameE();
            }, this.gameETriggerTime);
        } catch (error) {
            console.error('加载视频A失败:', error);
            alert('视频加载失败，请刷新页面重试。');
        }
    }
    
    // 播放视频B
    async playVideoB() {
        this.gameManager.showLoading();
        
        try {
            // 清除之前的回调
            this.videoPlayer.clearCallbacks();
            
            // 加载视频B
            await this.videoPlayer.loadVideo(this.videoB);
            
            // 隐藏加载指示器
            this.gameManager.hideLoading();
            
            // 播放视频B
            this.videoPlayer.play();
            
            // 设置视频B的时间更新回调，在特定时间触发游戏F
            this.videoPlayer.addTimeUpdateCallback(() => {
                // 视频B继续作为背景播放
                this.videoPlayer.playAsBackground();
                
                // 启动游戏F
                this.gameManager.startGameF();
            }, this.gameFTriggerTime);
        } catch (error) {
            console.error('加载视频B失败:', error);
            alert('视频加载失败，请刷新页面重试。');
        }
    }
    
    // 播放视频C
    async playVideoC() {
        this.gameManager.showLoading();
        
        try {
            // 清除之前的回调
            this.videoPlayer.clearCallbacks();
            
            // 加载视频C
            await this.videoPlayer.loadVideo(this.videoC);
            
            // 隐藏加载指示器
            this.gameManager.hideLoading();
            
            // 播放视频C
            this.videoPlayer.play();
            
            // 视频C结束后的回调
            this.videoPlayer.addEndedCallback(() => {
                // 游戏流程结束，可以显示结束画面或重新开始
                this.showEndScreen();
            });
        } catch (error) {
            console.error('加载视频C失败:', error);
            alert('视频加载失败，请刷新页面重试。');
        }
    }
    
    // 显示结束画面
    showEndScreen() {
        // 这里可以实现游戏结束后的画面
        // 例如：显示分数、重新开始按钮等
        alert('游戏流程结束！');
    }
}

// 当页面加载完成后初始化游戏
window.addEventListener('DOMContentLoaded', () => {
    const gameFlow = new GameFlow();
    gameFlow.init();
}); 