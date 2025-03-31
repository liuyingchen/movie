// 游戏流程控制
class GameFlow {
    constructor() {
        // 初始化视频播放器
        this.videoPlayer = new VideoPlayer();
        
        // 初始化游戏管理器
        this.gameManager = new GameManager(this.videoPlayer);
        
        // 视频路径 - 使用相对路径，适合GitHub Pages部署
        this.videoA = 'public/assets/videos/videoA.mp4';
        this.videoB = 'public/assets/videos/videoB.mp4';
        this.videoC = 'public/assets/videos/videoC.mp4';
        
        // 临时开发模式 - 如果设置为true，则忽略视频文件错误
        this.devMode = true;
        
        // 视频触发时间设置（秒）
        this.gameETriggerTime = 25; // 降低为5秒，方便测试
        this.gameFTriggerTime = 55; // 降低为5秒，方便测试
    }
    
    // 初始化
    async init() {
        console.log('初始化游戏流程');
        
        try {
            // 初始化游戏管理器
            this.gameManager.init();
            
            // 开始游戏流程
            this.startFlow();
            
        } catch (error) {
            console.error('初始化失败:', error);
            alert('游戏加载失败，请刷新页面重试。');
        }
    }
    
    // 开始游戏流程
    async startFlow() {
        console.log('开始游戏流程');
        // 从视频A开始
        await this.playVideoA();
    }
    
    // 播放视频A，然后进入游戏E
    async playVideoA() {
        console.log('准备播放视频A');
        this.gameManager.showLoading();
        
        try {
            // 加载视频A
            await this.videoPlayer.loadVideo(this.videoA);
            
            // 隐藏加载指示器
            this.gameManager.hideLoading();
            
            // 显示视频A的第一帧作为背景，并显示文字和按钮
            this.videoPlayer.showFirstFrameWithTextAndButton(
                "Every Eid al-Fitr is a celebration of gratitude. But for 6-year-old Afra in Lahore, Pakistan, this year's festival holds special meaning...",
                () => {
                    // 按钮点击后播放视频，并显示文字5秒
                    this.videoPlayer.play();
                    // 在视频A上显示文字覆盖层，5秒后自动隐藏
                    this.videoPlayer.showTextOverlayWithTimeout(
                        "Every Eid al-Fitr is a celebration of gratitude. But for 6-year-old Afra in Lahore, Pakistan, this year's festival holds special meaning...", 
                        5
                    );
                    console.log(`视频A播放，${this.gameETriggerTime}秒后将进入游戏E`);
                }
            );
            
            // 设置视频A的时间更新回调，在特定时间触发游戏E
            this.videoPlayer.addTimeUpdateCallback(() => {
                // 将视频A作为背景继续播放，而不是停止
                this.videoPlayer.playAsBackground();

                // 启动游戏E，视频A继续作为背景播放
                this.gameManager.startGameE();
                
                // 在游戏E完成时的回调
                this.gameManager.gameE.onGameComplete(() => {
                    // 游戏E完成，过渡到视频B
                    this.transitionToVideoB();
                });
            }, this.gameETriggerTime);
        } catch (error) {
            console.error('加载视频A失败:', error);
            
            if (this.devMode) {
                console.log('开发模式：忽略视频加载错误，直接启动游戏E');
                this.gameManager.hideLoading();
                
                // 尝试使用一个空的视频作为背景
                try {
                    // 如果我们有一个默认的背景视频，可以尝试加载
                    const dummyVideo = 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAu1tZGF0AAACrQYF//+p3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE0MiAtIEguMjY0L01QRUctNCBBVkMgY29kZWMgLSBDb3B5bGVmdCAyMDAzLTIwMTQgLSBodHRwOi8vd3d3LnZpZGVvbGFuLm9yZy94MjY0Lmh0bWwgLSBvcHRpb25zOiBjYWJhYz0xIHJlZj0zIGRlYmxvY2s9MTowOjAgYW5hbHlzZT0weDM6MHgxMTMgbWU9aGV4IHN1Ym1lPTcgcHN5PTEgcHN5X3JkPTEuMDA6MC4wMCBtaXhlZF9yZWY9MSBtZV9yYW5nZT0xNiBjaHJvbWFfbWU9MSB0cmVsbGlzPTEgOHg4ZGN0PTEgY3FtPTAgZGVhZHpvbmU9MjEsMTEgZmFzdF9wc2tpcD0xIGNocm9tYV9xcF9vZmZzZXQ9LTIgdGhyZWFkcz02IGxvb2thaGVhZF90aHJlYWRzPTEgc2xpY2VkX3RocmVhZHM9MCBucj0wIGRlY2ltYXRlPTEgaW50ZXJsYWNlZD0wIGJsdXJheV9jb21wYXQ9MCBjb25zdHJhaW5lZF9pbnRyYT0wIGJmcmFtZXM9MyBiX3B5cmFtaWQ9MiBiX2FkYXB0PTEgYl9iaWFzPTAgZGlyZWN0PTEgd2VpZ2h0Yj0xIG9wZW5fZ29wPTAgd2VpZ2h0cD0yIGtleWludD0yNTAga2V5aW50X21pbj0yNSBzY2VuZWN1dD00MCBpbnRyYV9yZWZyZXNoPTAgcmNfbG9va2FoZWFkPTQwIHJjPWNyZiBtYnRyZWU9MSBjcmY9MjMuMCBxY29tcD0wLjYwIHFwbWluPTAgcXBtYXg9NjkgcXBzdGVwPTQgaXBfcmF0aW89MS40MCBhcT0xOjEuMDAAgAAAAA9liIQAM//+9zy5B5NzUXgQAAAACkGaAUABQAQAAQAAAA1BmgJgAIAAAQAAEAAAAApBniBFESw3+AEAAAAKQZpAQAEAAAAAQAAAAgpBmmJAD4AAAQAAAAoQZ6CQBIyEAAAAAApBnqRFFSw3+AEAAAAKQZrEQAEAAAABEAAAAg1Bm+RAGigAAAABigAAAAkEZ4KQAEAAAAETEAAAAAUBQAAEAAAARAAAAAGQVAAAQAAABEAAAAASUVORK5CYII=';
                    this.videoPlayer.loadVideo(dummyVideo)
                        .then(() => {
                            this.videoPlayer.playAsBackground();
                        })
                        .catch(e => console.log('无法加载开发模式背景视频'));
                } catch (e) {
                    console.log('无法设置开发模式背景视频');
                }
                
                setTimeout(() => {
                    this.gameManager.startGameE();
                    this.gameManager.gameE.onGameComplete(() => {
                        this.transitionToVideoB();
                    });
                }, 1000);
            } else {
                alert('视频加载失败，请确保视频文件存在。');
            }
        }
    }
    
    // 过渡到视频B
    async transitionToVideoB() {
        console.log('从游戏E过渡到视频B');
        await this.playVideoB();
    }
    
    // 播放视频B，然后进入游戏F
    async playVideoB() {
        console.log('准备播放视频B');
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
            console.log(`视频B播放，${this.gameFTriggerTime}秒后将进入游戏F`);
            
            // 设置视频B的时间更新回调，在特定时间触发游戏F
            this.videoPlayer.addTimeUpdateCallback(() => {
                // 启动游戏F，视频B继续作为背景播放
                this.gameManager.startGameF();
                
                // 在游戏F完成时的回调
                this.gameManager.gameF.onGameComplete(() => {
                    // 游戏F完成，过渡到视频C
                    this.transitionToVideoC();
                });
            }, this.gameFTriggerTime);
        } catch (error) {
            console.error('加载视频B失败:', error);
            
            if (this.devMode) {
                console.log('开发模式：忽略视频加载错误，直接启动游戏F');
                this.gameManager.hideLoading();
                setTimeout(() => {
                    this.gameManager.startGameF();
                    this.gameManager.gameF.onGameComplete(() => {
                        this.transitionToVideoC();
                    });
                }, 1000);
            } else {
                alert('视频加载失败，请确保视频文件存在。');
            }
        }
    }
    
    // 过渡到视频C
    async transitionToVideoC() {
        console.log('从游戏F过渡到视频C');
        await this.playVideoC();
    }
    
    // 播放视频C（最终视频）
    async playVideoC() {
        console.log('准备播放视频C');
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
            console.log('播放最终视频C');
            
            // 视频C结束后的回调
            this.videoPlayer.addEndedCallback(() => {
                console.log('游戏流程结束');
                this.showEndScreen();
            });
        } catch (error) {
            console.error('加载视频C失败:', error);
            
            if (this.devMode) {
                console.log('开发模式：忽略视频加载错误，直接显示结束画面');
                this.gameManager.hideLoading();
                setTimeout(() => {
                    this.showEndScreen();
                }, 1000);
            } else {
                alert('视频加载失败，请确保视频文件存在。');
            }
        }
    }
    
    // 显示结束画面
    showEndScreen() {
        console.log('显示结束画面');
        // 在这里可以实现游戏结束后的画面
        // 例如：显示分数、重新开始按钮等
        const container = document.getElementById('container');
        
        // 创建结束画面
        const endScreen = document.createElement('div');
        endScreen.style.position = 'absolute';
        endScreen.style.top = '0';
        endScreen.style.left = '0';
        endScreen.style.width = '100%';
        endScreen.style.height = '100%';
        endScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        endScreen.style.display = 'flex';
        endScreen.style.flexDirection = 'column';
        endScreen.style.justifyContent = 'center';
        endScreen.style.alignItems = 'center';
        endScreen.style.color = 'white';
        endScreen.style.zIndex = '999';
        
        // 创建标题
        // const title = document.createElement('h1');
        // title.textContent = '';
        // title.style.fontSize = '3rem';
        // title.style.marginBottom = '2rem';
        
        // 创建消息
        const message = document.createElement('p');
        message.textContent = 'Friendship Forever!';
        message.style.fontSize = '3rem';
        message.style.marginBottom = '3rem';
        
        // 创建重新开始按钮
        const restartButton = document.createElement('button');
        restartButton.textContent = 'RESTART';
        restartButton.style.padding = '1rem 2rem';
        restartButton.style.fontSize = '1.2rem';
        restartButton.style.backgroundColor = '#4CAF50';
        restartButton.style.color = 'white';
        restartButton.style.border = 'none';
        restartButton.style.borderRadius = '5px';
        restartButton.style.cursor = 'pointer';
        
        restartButton.addEventListener('click', () => {
            // 移除结束画面
            endScreen.remove();
            
            this.gameManager.init();
            // 重新开始游戏流程
            this.startFlow();
        });
        
        // 组装结束画面
        // endScreen.appendChild(title); // 注释掉这行，因为title变量已被注释
        endScreen.appendChild(message);
        // endScreen.appendChild(restartButton);
        
        // 添加到容器
        container.appendChild(endScreen);
    }
}

// 当页面加载完成后初始化游戏
window.addEventListener('DOMContentLoaded', () => {
    console.log('页面加载完成，初始化游戏');
    const gameFlow = new GameFlow();
    gameFlow.init();
}); 