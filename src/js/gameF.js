class GameF {
    constructor(container) {
        this.container = container || document.getElementById('gameF');
        this.gameCompleteCallbacks = [];
        this.backgroundVideo = null;
        this.score = 0;
        this.timeLeft = 70; // 游戏时间70秒
        this.timerElement = null;
        this.scoreElement = null;
        this.isGameActive = false;
        
        // 创建游戏UI
        this.createGameUI();
    }
    
    // 创建游戏UI
    createGameUI() {
        // 清空容器
        this.container.innerHTML = '';
        
        // 创建一个完整的覆盖层，确保所有游戏元素在视频上方可见
        const fullOverlay = document.createElement('div');
        fullOverlay.style.position = 'absolute';
        fullOverlay.style.top = '0';
        fullOverlay.style.left = '0';
        fullOverlay.style.width = '100%';
        fullOverlay.style.height = '100%';
        fullOverlay.style.zIndex = '20'; // 确保高于视频
        fullOverlay.style.display = 'flex';
        fullOverlay.style.flexDirection = 'column';
        fullOverlay.style.padding = '20px';
        fullOverlay.style.boxSizing = 'border-box';
        this.container.appendChild(fullOverlay);
        
        // 创建计时器和分数显示
        const headerDiv = document.createElement('div');
        headerDiv.style.display = 'flex';
        headerDiv.style.justifyContent = 'space-between';
        headerDiv.style.padding = '10px 20px';
        headerDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        headerDiv.style.borderRadius = '10px';
        headerDiv.style.marginBottom = '20px';
        
        // 计时器
        this.timerElement = document.createElement('div');
        this.timerElement.style.fontSize = '24px';
        this.timerElement.style.color = '#ff6600';
        this.timerElement.style.fontWeight = 'bold';
        this.timerElement.textContent = `${this.timeLeft}秒`;
        
        // 分数
        this.scoreElement = document.createElement('div');
        this.scoreElement.style.fontSize = '24px';
        this.scoreElement.style.color = '#3399ff';
        this.scoreElement.style.fontWeight = 'bold';
        this.scoreElement.textContent = `得分: ${this.score}`;
        
        headerDiv.appendChild(this.timerElement);
        headerDiv.appendChild(this.scoreElement);
        fullOverlay.appendChild(headerDiv);
        
        // 创建游戏主区域 - 实际游戏内容显示在这里
        const gameArea = document.createElement('div');
        gameArea.style.flex = '1';
        gameArea.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        gameArea.style.borderRadius = '10px';
        gameArea.style.marginBottom = '20px';
        gameArea.style.display = 'flex';
        gameArea.style.flexDirection = 'column';
        gameArea.style.justifyContent = 'center';
        gameArea.style.alignItems = 'center';
        gameArea.style.position = 'relative';
        gameArea.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        gameArea.style.overflow = 'hidden';
        
        // 游戏内容 - 添加一些视觉元素
        const servingPlate = document.createElement('div');
        servingPlate.style.width = '70%';
        servingPlate.style.height = '50%';
        servingPlate.style.backgroundColor = 'rgba(245, 245, 245, 0.6)';
        servingPlate.style.borderRadius = '50%';
        servingPlate.style.position = 'relative';
        servingPlate.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        servingPlate.style.border = '3px solid rgba(200, 200, 200, 0.8)';
        
        // 添加一些装饰元素 - 模拟食物
        for (let i = 0; i < 8; i++) {
            const foodItem = document.createElement('div');
            foodItem.style.position = 'absolute';
            foodItem.style.backgroundColor = 'rgba(180, 120, 40, 0.85)';
            foodItem.style.width = `${Math.random() * 40 + 20}px`;
            foodItem.style.height = `${Math.random() * 25 + 15}px`;
            foodItem.style.borderRadius = '50%';
            foodItem.style.left = `${Math.random() * 60 + 20}%`;
            foodItem.style.top = `${Math.random() * 60 + 20}%`;
            foodItem.style.transform = `rotate(${Math.random() * 360}deg)`;
            foodItem.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
            
            // 添加食物纹理
            const texture = document.createElement('div');
            texture.style.position = 'absolute';
            texture.style.top = '20%';
            texture.style.left = '20%';
            texture.style.width = '60%';
            texture.style.height = '60%';
            texture.style.backgroundColor = 'rgba(150, 100, 50, 0.6)';
            texture.style.borderRadius = '50%';
            
            foodItem.appendChild(texture);
            servingPlate.appendChild(foodItem);
        }
        
        // 添加装饰元素 - 点缀的香草
        for (let i = 0; i < 15; i++) {
            const herb = document.createElement('div');
            herb.style.position = 'absolute';
            herb.style.backgroundColor = 'rgba(0, 100, 0, 0.8)';
            herb.style.width = '2px';
            herb.style.height = `${Math.random() * 8 + 3}px`;
            herb.style.left = `${Math.random() * 80 + 10}%`;
            herb.style.top = `${Math.random() * 80 + 10}%`;
            herb.style.transform = `rotate(${Math.random() * 360}deg)`;
            servingPlate.appendChild(herb);
        }
        
        gameArea.appendChild(servingPlate);
        
        // 添加游戏名称和指示文本
        const gameTitle = document.createElement('div');
        gameTitle.textContent = '上菜游戏';
        gameTitle.style.position = 'absolute';
        gameTitle.style.top = '10px';
        gameTitle.style.left = '0';
        gameTitle.style.width = '100%';
        gameTitle.style.textAlign = 'center';
        gameTitle.style.fontSize = '24px';
        gameTitle.style.fontWeight = 'bold';
        gameTitle.style.color = '#333';
        gameTitle.style.textShadow = '0 1px 2px rgba(255,255,255,0.8)';
        gameArea.appendChild(gameTitle);
        
        const gameInstruction = document.createElement('div');
        gameInstruction.textContent = '装饰盘子并为顾客上菜以获得分数!';
        gameInstruction.style.position = 'absolute';
        gameInstruction.style.bottom = '10px';
        gameInstruction.style.left = '0';
        gameInstruction.style.width = '100%';
        gameInstruction.style.textAlign = 'center';
        gameInstruction.style.fontSize = '16px';
        gameInstruction.style.color = '#333';
        gameInstruction.style.padding = '10px';
        gameInstruction.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        gameArea.appendChild(gameInstruction);
        
        fullOverlay.appendChild(gameArea);
        
        // 创建控制区域 (油温控制滑块和按钮)
        const controlsArea = document.createElement('div');
        controlsArea.style.padding = '15px';
        controlsArea.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        controlsArea.style.borderRadius = '10px';
        
        // 油温控制
        const tempLabel = document.createElement('div');
        tempLabel.textContent = '油温控制:';
        tempLabel.style.marginBottom = '10px';
        tempLabel.style.fontWeight = 'bold';
        tempLabel.style.fontSize = '18px';
        tempLabel.style.color = '#333';
        
        const tempSlider = document.createElement('input');
        tempSlider.type = 'range';
        tempSlider.min = '0';
        tempSlider.max = '100';
        tempSlider.value = '50';
        tempSlider.style.width = '100%';
        tempSlider.style.height = '20px';
        tempSlider.style.marginBottom = '20px';
        
        // 按钮区域
        const buttonsArea = document.createElement('div');
        buttonsArea.style.display = 'flex';
        buttonsArea.style.justifyContent = 'space-between';
        
        // 添加Pakora按钮
        const addButton = document.createElement('button');
        addButton.textContent = '添加Pakora';
        addButton.style.padding = '12px 20px';
        addButton.style.backgroundColor = '#4CAF50';
        addButton.style.color = 'white';
        addButton.style.border = 'none';
        addButton.style.borderRadius = '20px';
        addButton.style.cursor = 'pointer';
        addButton.style.fontWeight = 'bold';
        addButton.style.fontSize = '16px';
        addButton.style.flex = '1';
        addButton.style.margin = '0 5px';
        addButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        addButton.style.transition = 'all 0.2s ease';
        
        // 翻转按钮
        const flipButton = document.createElement('button');
        flipButton.textContent = '翻转';
        flipButton.style.padding = '12px 20px';
        flipButton.style.backgroundColor = '#FFA500';
        flipButton.style.color = 'white';
        flipButton.style.border = 'none';
        flipButton.style.borderRadius = '20px';
        flipButton.style.cursor = 'pointer';
        flipButton.style.fontWeight = 'bold';
        flipButton.style.fontSize = '16px';
        flipButton.style.flex = '1';
        flipButton.style.margin = '0 5px';
        flipButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        flipButton.style.transition = 'all 0.2s ease';
        
        // 取出按钮
        const removeButton = document.createElement('button');
        removeButton.textContent = '取出';
        removeButton.style.padding = '12px 20px';
        removeButton.style.backgroundColor = '#f44336';
        removeButton.style.color = 'white';
        removeButton.style.border = 'none';
        removeButton.style.borderRadius = '20px';
        removeButton.style.cursor = 'pointer';
        removeButton.style.fontWeight = 'bold';
        removeButton.style.fontSize = '16px';
        removeButton.style.flex = '1';
        removeButton.style.margin = '0 5px';
        removeButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        removeButton.style.transition = 'all 0.2s ease';
        
        // 添加悬浮效果
        addButton.onmouseover = () => { addButton.style.transform = 'scale(1.05)'; };
        addButton.onmouseout = () => { addButton.style.transform = 'scale(1)'; };
        flipButton.onmouseover = () => { flipButton.style.transform = 'scale(1.05)'; };
        flipButton.onmouseout = () => { flipButton.style.transform = 'scale(1)'; };
        removeButton.onmouseover = () => { removeButton.style.transform = 'scale(1.05)'; };
        removeButton.onmouseout = () => { removeButton.style.transform = 'scale(1)'; };
        
        // 添加按钮到按钮区域
        buttonsArea.appendChild(addButton);
        buttonsArea.appendChild(flipButton);
        buttonsArea.appendChild(removeButton);
        
        // 添加元素到控制区域
        controlsArea.appendChild(tempLabel);
        controlsArea.appendChild(tempSlider);
        controlsArea.appendChild(buttonsArea);
        
        // 添加控制区域到容器
        fullOverlay.appendChild(controlsArea);
        
        // 添加事件监听器
        addButton.addEventListener('click', () => this.addScore(10));
        flipButton.addEventListener('click', () => this.addScore(5));
        removeButton.addEventListener('click', () => this.addScore(15));
    }
    
    // 设置背景视频
    setBackgroundVideo(videoElement) {
        this.backgroundVideo = videoElement;
    }
    
    // 启动游戏
    start() {
        console.log('启动游戏F');
        this.isGameActive = true;
        this.score = 0;
        this.timeLeft = 70;
        this.updateScore();
        
        // 启动计时器
        this.timer = setInterval(() => {
            this.timeLeft--;
            if (this.timerElement) {
                this.timerElement.textContent = `${this.timeLeft}秒`;
            }
            
            if (this.timeLeft <= 0) {
                this.complete();
            }
        }, 1000);
    }
    
    // 结束游戏
    end() {
        console.log('结束游戏F');
        this.isGameActive = false;
        
        // 清除计时器
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    // 游戏完成
    complete() {
        console.log('游戏F完成');
        this.end();
        
        // 调用所有完成回调
        this.gameCompleteCallbacks.forEach(callback => callback(this.score));
    }
    
    // 添加分数
    addScore(points) {
        if (!this.isGameActive) return;
        
        this.score += points;
        this.updateScore();
        
        // 如果分数达到100，提前完成游戏
        if (this.score >= 100) {
            this.complete();
        }
    }
    
    // 更新分数显示
    updateScore() {
        if (this.scoreElement) {
            this.scoreElement.textContent = `得分: ${this.score}`;
        }
    }
    
    // 添加游戏完成回调
    onGameComplete(callback) {
        if (typeof callback === 'function') {
            this.gameCompleteCallbacks.push(callback);
        }
        return this; // 支持链式调用
    }
} 