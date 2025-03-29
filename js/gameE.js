class GameE {
    constructor(container) {
        this.container = container;
        this.isRunning = false;
        this.gameObjects = [];
        this.animationFrameId = null;
        this.onGameCompleteCallbacks = [];
    }
    
    // 初始化游戏
    init() {
        // 这里初始化游戏E的元素、状态等
        // 例如创建画布、加载资源等
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        // 初始化游戏对象
        this.initGameObjects();
        
        // 添加事件监听器
        this.addEventListeners();
    }
    
    // 初始化游戏对象
    initGameObjects() {
        // 这里创建游戏E的对象
        // 例如玩家、敌人、道具等
        this.gameObjects = [];
        
        // 示例：添加一些游戏对象
        // this.gameObjects.push(new Player(100, 100));
        // this.gameObjects.push(new Enemy(200, 200));
    }
    
    // 添加事件监听器
    addEventListeners() {
        // 添加键盘、鼠标等事件监听
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
    }
    
    // 处理键盘按下事件
    handleKeyDown(e) {
        if (!this.isRunning) return;
        
        // 处理键盘输入
        // 例如：移动玩家、发射子弹等
    }
    
    // 处理键盘释放事件
    handleKeyUp(e) {
        if (!this.isRunning) return;
        
        // 处理键盘释放
    }
    
    // 处理鼠标点击事件
    handleClick(e) {
        if (!this.isRunning) return;
        
        // 处理鼠标点击
        // 例如：选择目标、发射子弹等
    }
    
    // 更新游戏状态
    update() {
        if (!this.isRunning) return;
        
        // 更新所有游戏对象
        this.gameObjects.forEach(obj => obj.update());
        
        // 检查游戏是否完成
        this.checkGameComplete();
    }
    
    // 渲染游戏
    render() {
        if (!this.isRunning) return;
        
        // 清除画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 渲染所有游戏对象
        this.gameObjects.forEach(obj => obj.render(this.ctx));
    }
    
    // 游戏循环
    gameLoop() {
        if (!this.isRunning) return;
        
        this.update();
        this.render();
        
        this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
    }
    
    // 开始游戏
    start() {
        if (this.isRunning) return;
        
        this.init();
        this.isRunning = true;
        this.gameLoop();
    }
    
    // 结束游戏
    end() {
        this.isRunning = false;
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        // 清理资源
        this.cleanup();
    }
    
    // 清理资源
    cleanup() {
        // 移除事件监听器
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
        this.canvas.removeEventListener('click', this.handleClick);
        
        // 清空游戏对象
        this.gameObjects = [];
        
        // 移除画布
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
    
    // 检查游戏是否完成
    checkGameComplete() {
        // 这里实现游戏E的完成条件
        // 例如：所有敌人被消灭、达到目标分数等
        
        // 示例：假设10秒后游戏完成
        setTimeout(() => {
            this.completeGame();
        }, 10000);
    }
    
    // 完成游戏
    completeGame() {
        if (!this.isRunning) return;
        
        // 触发游戏完成回调
        this.onGameCompleteCallbacks.forEach(callback => callback());
    }
    
    // 添加游戏完成回调
    onGameComplete(callback) {
        this.onGameCompleteCallbacks.push(callback);
    }
} 