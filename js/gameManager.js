class GameManager {
    constructor(videoPlayer) {
        this.videoPlayer = videoPlayer;
        this.gameE = null;
        this.gameF = null;
        this.currentGame = null;
        this.gameEContainer = document.getElementById('gameE');
        this.gameFContainer = document.getElementById('gameF');
        this.loadingIndicator = document.getElementById('loadingIndicator');
    }
    
    // 初始化游戏
    init() {
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
    
    // 启动游戏E
    startGameE() {
        this.hideAllGames();
        this.currentGame = this.gameE;
        this.gameEContainer.style.display = 'block';
        this.gameE.start();
    }
    
    // 启动游戏F
    startGameF() {
        this.hideAllGames();
        this.currentGame = this.gameF;
        this.gameFContainer.style.display = 'block';
        this.gameF.start();
    }
    
    // 结束当前游戏
    endCurrentGame() {
        if (this.currentGame) {
            this.currentGame.end();
            this.hideAllGames();
            this.currentGame = null;
        }
    }
} 