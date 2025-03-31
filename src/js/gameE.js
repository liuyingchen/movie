class GameE {
    constructor(container) {
        this.container = container || document.getElementById('gameE');
        this.gameCompleteCallbacks = [];
        this.backgroundVideo = null;
        this.score = 0;
        this.timeLeft = 60; // 游戏时间60秒
        this.timerElement = null;
        this.scoreElement = null;
        this.isGameActive = false;
        this.pakoras = []; // 存储所有已添加的Pakora
        this.pakoraContainer = null; // Pakora容器引用
        this.plateContainer = null; // 盘子容器引用
        this.finishedPakoras = []; // 存储已完成的Pakora
        this.pakorasInPan = 0; // 记录锅中的Pakora数量
        
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
        fullOverlay.style.justifyContent = 'center'; // 水平居中
        fullOverlay.style.alignItems = 'center'; // 垂直居中
        fullOverlay.style.boxSizing = 'border-box';
        this.container.appendChild(fullOverlay);
        
        // 创建游戏主容器 - 缩小整体区域并居中
        const gameContainer = document.createElement('div');
        gameContainer.style.width = '75%';
        gameContainer.style.height = '75%';
        gameContainer.style.display = 'flex';
        gameContainer.style.flexDirection = 'column';
        gameContainer.style.justifyContent = 'space-between';
        gameContainer.style.padding = '15px';
        gameContainer.style.boxSizing = 'border-box';
        gameContainer.style.borderRadius = '20px';
        gameContainer.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
        gameContainer.style.backdropFilter = 'blur(5px)'; // 背景模糊效果
        fullOverlay.appendChild(gameContainer);
        
        // 创建计时器和分数显示
        const headerDiv = document.createElement('div');
        headerDiv.style.display = 'flex';
        headerDiv.style.justifyContent = 'space-between';
        headerDiv.style.padding = '10px 20px';
        headerDiv.style.backgroundColor = 'transparent'; // 完全透明
        headerDiv.style.marginBottom = '15px';
        
        // 计时器
        this.timerElement = document.createElement('div');
        this.timerElement.style.fontSize = '30px';
        this.timerElement.style.color = '#ff6600';
        this.timerElement.style.fontWeight = 'bold';
        this.timerElement.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.5)';
        this.timerElement.textContent = `${this.timeLeft}s`;
        
        // 分数
        this.scoreElement = document.createElement('div');
        this.scoreElement.style.fontSize = '30px';
        this.scoreElement.style.color = '#3399ff';
        this.scoreElement.style.fontWeight = 'bold';
        this.scoreElement.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.5)';
        this.scoreElement.textContent = `Score: ${this.score}`;
        
        headerDiv.appendChild(this.timerElement);
        headerDiv.appendChild(this.scoreElement);
        gameContainer.appendChild(headerDiv);
        
        // 创建游戏主区域 - 实际游戏内容显示在这里
        const gameArea = document.createElement('div');
        gameArea.style.flex = '1';
        gameArea.style.backgroundColor = 'transparent'; // 完全透明
        gameArea.style.borderRadius = '15px';
        gameArea.style.marginBottom = '15px';
        gameArea.style.display = 'flex';
        gameArea.style.flexDirection = 'column';
        gameArea.style.justifyContent = 'space-between';
        gameArea.style.alignItems = 'center';
        gameArea.style.position = 'relative';
        gameArea.style.boxShadow = 'none'; // 移除阴影
        gameArea.style.overflow = 'hidden';
        gameArea.style.padding = '20px';
        
        // 游戏内容 - 改进锅的设计，但内部油是透明的
        const gameFrying = document.createElement('div');
        gameFrying.style.width = '70%';
        gameFrying.style.height = '60%';
        gameFrying.style.backgroundColor = 'transparent'; // 锅内区域透明
        gameFrying.style.borderRadius = '50%';
        gameFrying.style.position = 'relative';
        gameFrying.style.boxShadow = 'inset 0 0 25px rgba(0, 0, 0, 0.3), 0 5px 15px rgba(0, 0, 0, 0.2)';
        gameFrying.style.border = '8px solid rgba(100, 50, 10, 0.8)'; // 更厚的锅边
        
        // 添加锅把手
        const panHandle = document.createElement('div');
        panHandle.style.position = 'absolute';
        panHandle.style.width = '40%';
        panHandle.style.height = '15%';
        panHandle.style.backgroundColor = 'rgba(80, 40, 10, 0.8)';
        panHandle.style.borderRadius = '10px';
        panHandle.style.top = '40%';
        panHandle.style.right = '-35%';
        panHandle.style.transform = 'rotate(-10deg)';
        panHandle.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        gameFrying.appendChild(panHandle);
        
        // 添加锅把手结尾
        const panHandleEnd = document.createElement('div');
        panHandleEnd.style.position = 'absolute';
        panHandleEnd.style.width = '15px';
        panHandleEnd.style.height = '25px';
        panHandleEnd.style.backgroundColor = 'rgba(60, 30, 5, 0.8)';
        panHandleEnd.style.borderRadius = '5px';
        panHandleEnd.style.top = '-5px';
        panHandleEnd.style.right = '0';
        panHandle.appendChild(panHandleEnd);
        
        // 添加炸锅内的油纹效果
        for (let i = 0; i < 6; i++) {
            const oilRipple = document.createElement('div');
            oilRipple.style.position = 'absolute';
            oilRipple.style.backgroundColor = 'rgba(255, 215, 0, 0.15)';
            oilRipple.style.borderRadius = '50%';
            oilRipple.style.width = `${35 + i * 10}%`;
            oilRipple.style.height = `${25 + i * 5}%`;
            oilRipple.style.left = `${32.5 - i * 5}%`;
            oilRipple.style.top = `${37.5 - i * 2.5}%`;
            gameFrying.appendChild(oilRipple);
        }
        
        // 添加油面上的光泽效果
        const oilShine = document.createElement('div');
        oilShine.style.position = 'absolute';
        oilShine.style.width = '40%';
        oilShine.style.height = '15%';
        oilShine.style.background = 'linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0.3), rgba(255,255,255,0.1))';
        oilShine.style.borderRadius = '50%';
        oilShine.style.transform = 'rotate(30deg)';
        oilShine.style.top = '30%';
        oilShine.style.left = '20%';
        gameFrying.appendChild(oilShine);
        
        // 随机添加一些泡沫效果
        for (let i = 0; i < 15; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'bubble'; // 添加类名以便后续引用
            bubble.style.position = 'absolute';
            bubble.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
            bubble.style.borderRadius = '50%';
            bubble.style.width = `${Math.random() * 6 + 2}px`;
            bubble.style.height = bubble.style.width;
            bubble.style.left = `${Math.random() * 70 + 15}%`;
            bubble.style.top = `${Math.random() * 70 + 15}%`;
            
            // 添加随机动画
            bubble.style.animation = `bubble-float ${Math.random() * 2.5 + 1.5}s infinite alternate`;
            gameFrying.appendChild(bubble);
        }
        
        // 添加Pakora容器 - 这里将显示添加的Pakora
        this.pakoraContainer = document.createElement('div');
        this.pakoraContainer.style.position = 'absolute';
        this.pakoraContainer.style.top = '0';
        this.pakoraContainer.style.left = '0';
        this.pakoraContainer.style.width = '100%';
        this.pakoraContainer.style.height = '100%';
        this.pakoraContainer.style.pointerEvents = 'none';
        gameFrying.appendChild(this.pakoraContainer);
        
        gameArea.appendChild(gameFrying);
        
        // 修改盘子区域 - 改为矩形布局
        const plateArea = document.createElement('div');
        plateArea.style.width = '85%';
        plateArea.style.height = '25%';
        plateArea.style.display = 'flex';
        plateArea.style.justifyContent = 'center';
        plateArea.style.alignItems = 'center';
        plateArea.style.marginTop = '15px';
        
        const plate = document.createElement('div');
        plate.style.width = '100%';
        plate.style.height = '100%';
        plate.style.backgroundColor = 'rgba(240, 240, 240, 0.2)'; // 更透明的盘子
        plate.style.borderRadius = '12px';
        plate.style.border = '3px solid rgba(200, 200, 200, 0.5)';
        plate.style.position = 'relative';
        plate.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        
        // 添加盘子装饰
        const plateDecoration = document.createElement('div');
        plateDecoration.style.position = 'absolute';
        plateDecoration.style.top = '5%';
        plateDecoration.style.left = '5%';
        plateDecoration.style.width = '90%';
        plateDecoration.style.height = '90%';
        plateDecoration.style.borderRadius = '10px';
        plateDecoration.style.border = '1px solid rgba(180, 180, 180, 0.2)';
        plate.appendChild(plateDecoration);
        
        // 添加盘子的光泽效果
        const plateShine = document.createElement('div');
        plateShine.style.position = 'absolute';
        plateShine.style.top = '0';
        plateShine.style.left = '0';
        plateShine.style.width = '100%';
        plateShine.style.height = '30%';
        plateShine.style.background = 'linear-gradient(to bottom, rgba(255,255,255,0.2), rgba(255,255,255,0))';
        plateShine.style.borderRadius = '10px 10px 0 0';
        plate.appendChild(plateShine);
        
        // 添加已完成Pakora的容器
        this.plateContainer = document.createElement('div');
        this.plateContainer.style.position = 'absolute';
        this.plateContainer.style.top = '0';
        this.plateContainer.style.left = '0';
        this.plateContainer.style.width = '100%';
        this.plateContainer.style.height = '100%';
        this.plateContainer.style.display = 'flex';
        this.plateContainer.style.flexWrap = 'wrap';
        this.plateContainer.style.padding = '10px';
        this.plateContainer.style.boxSizing = 'border-box';
        this.plateContainer.style.alignContent = 'flex-start';
        this.plateContainer.style.justifyContent = 'center';
        plate.appendChild(this.plateContainer);
        
        plateArea.appendChild(plate);
        gameArea.appendChild(plateArea);
        
        // 添加游戏名称
        const gameTitle = document.createElement('div');
        gameTitle.textContent = 'Pakora Frying Game';
        gameTitle.style.position = 'absolute';
        gameTitle.style.top = '10px';
        gameTitle.style.left = '0';
        gameTitle.style.width = '100%';
        gameTitle.style.textAlign = 'center';
        gameTitle.style.fontSize = '26px';
        gameTitle.style.fontWeight = 'bold';
        gameTitle.style.color = '#333';
        gameTitle.style.textShadow = '0 2px 4px rgba(255,255,255,0.8)';
        gameArea.appendChild(gameTitle);
        
        // 合并操作说明和油温控制到一个区域
        const gameInstruction = document.createElement('div');
        gameInstruction.textContent = 'Control oil temperature, add, flip and remove Pakora to earn points! Maximum 5 Pakora at a time';
        gameInstruction.style.position = 'absolute';
        gameInstruction.style.bottom = '0';
        gameInstruction.style.left = '0';
        gameInstruction.style.width = '100%';
        gameInstruction.style.textAlign = 'center';
        gameInstruction.style.fontSize = '16px';
        gameInstruction.style.color = '#fff';
        gameInstruction.style.padding = '10px';
        gameInstruction.style.backgroundColor = 'transparent'; // 完全透明
        gameInstruction.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.8)'; // 增强文字阴影提高可见度
        gameArea.appendChild(gameInstruction);
        
        gameContainer.appendChild(gameArea);
        
        // 创建控制区域 (油温控制滑块和按钮) - 美化设计
        const controlsArea = document.createElement('div');
        controlsArea.style.padding = '15px';
        controlsArea.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'; // 几乎完全透明
        controlsArea.style.borderRadius = '15px';
        controlsArea.style.backdropFilter = 'blur(2px)'; // 轻微模糊
        controlsArea.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        
        // 油温控制标签区域
        const tempControlWrapper = document.createElement('div');
        tempControlWrapper.style.marginBottom = '15px';
        tempControlWrapper.style.position = 'relative';
        
        // 油温控制
        const tempLabel = document.createElement('div');
        tempLabel.textContent = 'Oil Temperature:';
        tempLabel.style.marginBottom = '10px';
        tempLabel.style.fontWeight = 'bold';
        tempLabel.style.fontSize = '18px';
        tempLabel.style.color = '#fff';
        tempLabel.style.textShadow = '0 1px 3px rgba(0, 0, 0, 0.8)';
        tempControlWrapper.appendChild(tempLabel);
        
        // 温度指示器
        const tempIndicator = document.createElement('div');
        tempIndicator.style.position = 'absolute';
        tempIndicator.style.right = '0';
        tempIndicator.style.top = '0';
        tempIndicator.style.fontSize = '16px';
        tempIndicator.style.fontWeight = 'bold';
        tempIndicator.style.color = '#e74c3c';
        tempIndicator.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.6)';
        tempIndicator.textContent = 'High';
        tempControlWrapper.appendChild(tempIndicator);
        
        controlsArea.appendChild(tempControlWrapper);
        
        // 温度滑块背景 - 添加温度渐变效果
        const sliderContainer = document.createElement('div');
        sliderContainer.style.position = 'relative';
        sliderContainer.style.width = '100%';
        sliderContainer.style.height = '20px';
        sliderContainer.style.marginBottom = '20px';
        sliderContainer.style.borderRadius = '10px';
        sliderContainer.style.background = 'linear-gradient(to right, #3498db, #f1c40f, #e74c3c)'; // 蓝色(低温)->黄色(中温)->红色(高温)
        sliderContainer.style.overflow = 'hidden';
        
        const tempSlider = document.createElement('input');
        tempSlider.type = 'range';
        tempSlider.min = '0';
        tempSlider.max = '100';
        tempSlider.value = '75';
        tempSlider.style.width = '100%';
        tempSlider.style.height = '20px';
        tempSlider.style.appearance = 'none';
        tempSlider.style.background = 'transparent';
        tempSlider.style.outline = 'none';
        tempSlider.style.position = 'relative';
        tempSlider.style.zIndex = '2';
        sliderContainer.appendChild(tempSlider);
        
        // 添加活动温度指示器
        const tempActiveIndicator = document.createElement('div');
        tempActiveIndicator.style.position = 'absolute';
        tempActiveIndicator.style.top = '0';
        tempActiveIndicator.style.left = '0';
        tempActiveIndicator.style.height = '100%';
        tempActiveIndicator.style.width = '75%';
        tempActiveIndicator.style.background = 'rgba(255, 255, 255, 0.3)';
        tempActiveIndicator.style.borderRadius = '10px';
        tempActiveIndicator.style.pointerEvents = 'none';
        sliderContainer.appendChild(tempActiveIndicator);
        
        controlsArea.appendChild(sliderContainer);
        
        // 添加滑块滑动点样式
        const sliderStyle = document.createElement('style');
        sliderStyle.textContent = `
            input[type=range]::-webkit-slider-thumb {
                appearance: none;
                width: 25px;
                height: 25px;
                border-radius: 50%;
                background: linear-gradient(145deg, #ffffff, #eeeeee);
                border: 2px solid rgba(255, 120, 0, 0.6);
                cursor: pointer;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
            }
            
            input[type=range]::-moz-range-thumb {
                width: 25px;
                height: 25px;
                border-radius: 50%;
                background: linear-gradient(145deg, #ffffff, #eeeeee);
                border: 2px solid rgba(255, 120, 0, 0.6);
                cursor: pointer;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
            }
        `;
        document.head.appendChild(sliderStyle);
        
        // 按钮区域
        const buttonsArea = document.createElement('div');
        buttonsArea.style.display = 'flex';
        buttonsArea.style.justifyContent = 'space-between';
        buttonsArea.style.gap = '12px';
        
        // 添加Pakora按钮 - 烹饪主题风格
        const addButton = document.createElement('button');
        addButton.textContent = 'Add Pakora';
        addButton.style.padding = '12px 20px';
        addButton.style.background = 'linear-gradient(145deg, #8B4513, #A0522D)'; // 棕色木质手柄色调
        addButton.style.color = 'white';
        addButton.style.border = 'none';
        addButton.style.borderRadius = '25px';
        addButton.style.cursor = 'pointer';
        addButton.style.fontWeight = 'bold';
        addButton.style.fontSize = '16px';
        addButton.style.flex = '1';
        addButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        addButton.style.transition = 'all 0.3s ease';
        // 添加图标或装饰
        const addIcon = document.createElement('span');
        addIcon.textContent = '🥔'; // 土豆/食物图标
        addIcon.style.marginRight = '8px';
        addIcon.style.fontSize = '18px';
        addButton.prepend(addIcon);
        
        // 翻转按钮 - 烹饪铲子风格
        const flipButton = document.createElement('button');
        flipButton.textContent = 'Flip';
        flipButton.style.padding = '12px 20px';
        flipButton.style.background = 'linear-gradient(145deg, #CD853F, #DEB887)'; // 木质铲子色调
        flipButton.style.color = 'white';
        flipButton.style.border = 'none';
        flipButton.style.borderRadius = '25px';
        flipButton.style.cursor = 'pointer';
        flipButton.style.fontWeight = 'bold';
        flipButton.style.fontSize = '16px';
        flipButton.style.flex = '1';
        flipButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        flipButton.style.transition = 'all 0.3s ease';
        // 添加图标或装饰
        const flipIcon = document.createElement('span');
        flipIcon.textContent = '🔄'; // 循环/翻转图标
        flipIcon.style.marginRight = '8px';
        flipIcon.style.fontSize = '18px';
        flipButton.prepend(flipIcon);
        
        // 取出按钮 - 餐盘风格
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.style.padding = '12px 20px';
        removeButton.style.background = 'linear-gradient(145deg, #B22222, #CD5C5C)'; // 红棕色厨房手套色调
        removeButton.style.color = 'white';
        removeButton.style.border = 'none';
        removeButton.style.borderRadius = '25px';
        removeButton.style.cursor = 'pointer';
        removeButton.style.fontWeight = 'bold';
        removeButton.style.fontSize = '16px';
        removeButton.style.flex = '1';
        removeButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        removeButton.style.transition = 'all 0.3s ease';
        // 添加图标或装饰
        const removeIcon = document.createElement('span');
        removeIcon.textContent = '🍽️'; // 餐盘图标
        removeIcon.style.marginRight = '8px';
        removeIcon.style.fontSize = '18px';
        removeButton.prepend(removeIcon);
        
        // 添加悬停和点击效果
        const buttonStyle = document.createElement('style');
        buttonStyle.textContent = `
            button:hover {
                transform: translateY(-3px) scale(1.03);
                box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
                filter: brightness(1.1);
            }
            
            button:active {
                transform: translateY(1px);
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
                filter: brightness(0.95);
            }
        `;
        document.head.appendChild(buttonStyle);
        
        // 添加按钮到按钮区域
        buttonsArea.appendChild(addButton);
        buttonsArea.appendChild(flipButton);
        buttonsArea.appendChild(removeButton);
        
        // 添加元素到控制区域
        controlsArea.appendChild(buttonsArea);
        
        // 添加控制区域到容器
        gameContainer.appendChild(controlsArea);
        
        // 添加CSS动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes bubble-float {
                0% { transform: translateY(0); opacity: 0.7; }
                50% { opacity: 0.9; }
                100% { transform: translateY(-10px); opacity: 0.7; }
            }
            @keyframes pakora-cook {
                0% { transform: translateY(0) rotate(0deg); }
                25% { transform: translateY(-3px) rotate(-2deg); }
                75% { transform: translateY(-4px) rotate(2deg); }
                100% { transform: translateY(0) rotate(0deg); }
            }
            @keyframes pakora-flip {
                0% { transform: rotateY(0deg); }
                100% { transform: rotateY(180deg); }
            }
            @keyframes steam {
                0% { transform: translateY(0) scale(1); opacity: 0.7; }
                50% { transform: translateY(-15px) scale(1.5); opacity: 0.3; }
                100% { transform: translateY(-30px) scale(2); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        // 添加蒸汽效果到锅中
        this.addSteamEffect(gameFrying);
        
        // 添加事件监听器
        addButton.addEventListener('click', () => this.addPakora());
        flipButton.addEventListener('click', () => this.flipPakora());
        removeButton.addEventListener('click', () => this.removePakora());
        
        // 油温滑块变化事件
        tempSlider.addEventListener('input', () => {
            const val = tempSlider.value;
            
            // 更新温度指示器位置
            tempActiveIndicator.style.width = `${val}%`;
            
            // 更新温度文字指示
            if (val < 30) {
                tempIndicator.textContent = 'Low';
                tempIndicator.style.color = '#3498db';
            } else if (val < 70) {
                tempIndicator.textContent = 'Medium';
                tempIndicator.style.color = '#f1c40f';
            } else {
                tempIndicator.textContent = 'High';
                tempIndicator.style.color = '#e74c3c';
            }
            
            // 增加虚拟油温效果 - 随着温度增加，气泡和蒸汽会更活跃
            const heatIntensity = val / 100;
            gameFrying.querySelectorAll('.bubble').forEach(bubble => {
                const size = 2 + (Math.random() * 6 * heatIntensity);
                bubble.style.width = `${size}px`;
                bubble.style.height = `${size}px`;
                const animDuration = 2.5 - (1.5 * heatIntensity);
                bubble.style.animation = `bubble-float ${animDuration}s infinite alternate`;
            });
            
            // 根据温度调整锅中油的颜色 - 虽然透明但有微妙的颜色变化
            const oilColor = `rgba(255, ${200 - val}, ${100 - val/2}, 0.15)`;
            gameFrying.style.background = `radial-gradient(circle, ${oilColor} 70%, transparent 100%)`;
            
            // 根据温度调整蒸汽效果
            this.updateSteamEffect(val);
            
            // 更新所有pakora的烹饪速度
            this.updateCookingSpeed(val);
        });
        
        // 添加分数闪烁动画
        this.addScorePulseAnimation();
    }
    
    // 添加一个新的Pakora
    addPakora() {
        if (!this.isGameActive) return;
        
        // 限制锅中Pakora的数量不超过5个
        if (this.pakoras.length >= 5) {
            // 显示提示信息
            this.showLimitMessage();
            return;
        }
        
        // 创建Pakora元素
        const pakora = document.createElement('div');
        pakora.className = 'pakora';
        pakora.style.position = 'absolute';
        pakora.style.width = '40px';
        pakora.style.height = '40px';
        pakora.style.backgroundColor = 'rgba(180, 140, 60, 0.9)';
        pakora.style.borderRadius = '50%';
        pakora.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
        
        // 随机位置
        const left = Math.random() * 60 + 20;
        const top = Math.random() * 60 + 20;
        pakora.style.left = `${left}%`;
        pakora.style.top = `${top}%`;
        
        // 添加烹饪动画
        pakora.style.animation = 'pakora-cook 1s infinite';
        
        // Pakora内部的花纹
        const innerPattern = document.createElement('div');
        innerPattern.style.position = 'absolute';
        innerPattern.style.top = '20%';
        innerPattern.style.left = '20%';
        innerPattern.style.width = '60%';
        innerPattern.style.height = '60%';
        innerPattern.style.backgroundColor = 'rgba(150, 100, 20, 0.7)';
        innerPattern.style.borderRadius = '50%';
        pakora.appendChild(innerPattern);
        
        // Pakora信息
        const pakoraInfo = {
            element: pakora,
            isFlipped: false,
            cookingLevel: 0,
            maxCookingLevel: 100,
            cookingSpeed: 1,
            addedTime: Date.now() // 记录添加时间
        };
        
        // 添加到容器和数组
        this.pakoraContainer.appendChild(pakora);
        this.pakoras.push(pakoraInfo);
        this.pakorasInPan++;
        
        // 在控制台显示调试信息
        console.log(`Added Pakora - No points (Pan: ${this.pakorasInPan})`);
        
        // 每100ms更新一次烹饪程度
        const cookingInterval = setInterval(() => {
            if (!this.isGameActive) {
                clearInterval(cookingInterval);
                return;
            }
            
            pakoraInfo.cookingLevel += pakoraInfo.cookingSpeed;
            
            // 根据烹饪程度改变颜色
            const brownLevel = Math.min(100, pakoraInfo.cookingLevel);
            pakora.style.backgroundColor = `rgba(${180 - brownLevel}, ${140 - brownLevel}, ${60 - brownLevel/2}, 0.9)`;
            
            // 烹饪过度会变黑
            if (pakoraInfo.cookingLevel >= pakoraInfo.maxCookingLevel) {
                pakora.style.backgroundColor = 'rgba(30, 30, 30, 0.9)';
                clearInterval(cookingInterval);
            }
        }, 100);
    }
    
    // 显示锅已满提示
    showLimitMessage() {
        const limitMsg = document.createElement('div');
        limitMsg.textContent = 'Pan is full! Flip or remove first';
        limitMsg.style.position = 'absolute';
        limitMsg.style.left = '50%';
        limitMsg.style.top = '30%';
        limitMsg.style.transform = 'translate(-50%, -50%)';
        limitMsg.style.color = '#f44336';
        limitMsg.style.fontSize = '22px';
        limitMsg.style.fontWeight = 'bold';
        limitMsg.style.textShadow = '0 0 5px rgba(255, 255, 255, 0.7)';
        limitMsg.style.zIndex = '100';
        limitMsg.style.pointerEvents = 'none';
        limitMsg.style.animation = 'message-fade 1.5s forwards';
        
        document.body.appendChild(limitMsg);
        
        // 添加动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes message-fade {
                0% { opacity: 0; transform: translate(-50%, -30%); }
                20% { opacity: 1; transform: translate(-50%, -50%); }
                80% { opacity: 1; transform: translate(-50%, -50%); }
                100% { opacity: 0; transform: translate(-50%, -70%); }
            }
        `;
        document.head.appendChild(style);
        
        // 1.5秒后移除
        setTimeout(() => {
            document.body.removeChild(limitMsg);
        }, 1500);
    }
    
    // 翻转所有Pakora
    flipPakora() {
        if (!this.isGameActive || this.pakoras.length === 0) return;
        
        let totalFlipScore = 0;
        let flippedCount = 0;
        let inPerfectTime = 0;
        
        // 遍历所有pakora进行翻转
        this.pakoras.forEach(pakora => {
            if (!pakora.isFlipped) {
                pakora.isFlipped = true;
                pakora.element.style.animation = 'pakora-flip 0.5s forwards';
                flippedCount++;
                
                // 计算翻转的分数：根据烹饪程度决定
                let flipScore = 5; // 基础分
                
                // 完美翻转时间：在30-70的烹饪程度之间
                if (pakora.cookingLevel >= 30 && pakora.cookingLevel <= 70) {
                    flipScore = 15; // 完美翻转
                    inPerfectTime++;
                } else if (pakora.cookingLevel < 30) {
                    flipScore = 8; // 早翻
                } else {
                    flipScore = 3; // 晚翻
                }
                
                totalFlipScore += flipScore;
                
                // 翻转后改变外观
                setTimeout(() => {
                    // 翻转完成后改变样式
                    const brownLevel = Math.min(100, pakora.cookingLevel);
                    pakora.element.style.backgroundColor = `rgba(${180 - brownLevel - 30}, ${140 - brownLevel - 20}, ${60 - brownLevel/2 - 10}, 0.9)`;
                    pakora.element.style.animation = 'pakora-cook 1s infinite';
                }, 500);
            }
        });
        
        // 计分
        if (flippedCount > 0) {
            this.addScore(totalFlipScore);
            
            // 显示分数提示
            this.showScoreHint({
                left: window.innerWidth / 2,
                top: window.innerHeight / 2,
                width: 0,
                height: 0
            }, `+${totalFlipScore}`, inPerfectTime > 0 ? '#FFC107' : '#FF9800');
            
            // 完美翻转时显示提示
            if (inPerfectTime > 0) {
                this.showPerfectFlip();
            }
        }
    }
    
    // 取出所有Pakora
    removePakora() {
        if (!this.isGameActive || this.pakoras.length === 0) return;
        
        let totalRemoveScore = 0;
        let perfectlyCooked = 0;
        
        // 遍历并移动所有pakora到盘子
        for (let i = this.pakoras.length - 1; i >= 0; i--) {
            const pakora = this.pakoras[i];
            
            // 从锅中移除
            this.pakoraContainer.removeChild(pakora.element);
            
            // 根据烹饪状态获得不同分数
            let removeScore = 15; // 基础分
            
            // 完美烹饪：已翻转且烹饪程度在40-70之间
            if (pakora.isFlipped && pakora.cookingLevel >= 40 && pakora.cookingLevel <= 70) {
                removeScore = 30; // 完美烹饪
                perfectlyCooked++;
            } else if (pakora.cookingLevel < 30) {
                removeScore = 10; // 未煮熟
            } else if (pakora.cookingLevel > 80) {
                removeScore = 5; // 煮过头
            } else if (!pakora.isFlipped) {
                removeScore = 8; // 未翻转
            }
            
            totalRemoveScore += removeScore;
            
            // 添加到盘子 - 使用新的位置计算
            this.addToPlate(pakora);
            
            // 从数组中移除
            this.pakoras.splice(i, 1);
        }
        
        // 重置锅中Pakora计数
        this.pakorasInPan = 0;
        
        // 计分
        if (totalRemoveScore > 0) {
            this.addScore(totalRemoveScore);
            
            // 显示分数提示
            this.showScoreHint({
                left: window.innerWidth / 2,
                top: window.innerHeight / 3 * 2,
                width: 0,
                height: 0
            }, `+${totalRemoveScore}`, perfectlyCooked > 0 ? '#4CAF50' : '#ff6600');
            
            // 显示完美烹饪提示
            if (perfectlyCooked > 0) {
                this.showPerfectCooking();
            }
        }
    }
    
    // 将Pakora添加到盘子 - 修改为矩形布局
    addToPlate(pakora) {
        // 克隆pakora元素
        const platePakora = document.createElement('div');
        platePakora.className = 'plate-pakora';
        platePakora.style.width = '35px';
        platePakora.style.height = '35px';
        platePakora.style.backgroundColor = pakora.element.style.backgroundColor;
        platePakora.style.borderRadius = '50%';
        platePakora.style.margin = '5px';
        platePakora.style.boxShadow = '0 3px 6px rgba(0, 0, 0, 0.2)';
        platePakora.style.position = 'relative';
        platePakora.style.transition = 'transform 0.3s ease';
        
        // 添加悬停效果
        platePakora.onmouseover = () => { platePakora.style.transform = 'scale(1.1)'; };
        platePakora.onmouseout = () => { platePakora.style.transform = 'scale(1)'; };
        
        // Pakora内部的花纹
        const innerPattern = document.createElement('div');
        innerPattern.style.position = 'absolute';
        innerPattern.style.top = '20%';
        innerPattern.style.left = '20%';
        innerPattern.style.width = '60%';
        innerPattern.style.height = '60%';
        innerPattern.style.backgroundColor = 'rgba(150, 100, 20, 0.7)';
        innerPattern.style.borderRadius = '50%';
        platePakora.appendChild(innerPattern);
        
        // 添加到盘子容器 - 不需要指定position，会自动排列
        this.plateContainer.appendChild(platePakora);
        
        // 检查是否是高分Pakora（已翻转且烹饪程度在理想范围内）
        if (pakora.isFlipped && pakora.cookingLevel >= 40 && pakora.cookingLevel <= 70) {
            // 创建星标
            const star = document.createElement('div');
            star.textContent = '⭐';
            star.style.position = 'absolute';
            star.style.top = '-15px';
            star.style.left = '50%';
            star.style.transform = 'translateX(-50%)';
            star.style.fontSize = '16px';
            star.style.zIndex = '2';
            star.style.textShadow = '0px 0px 4px rgba(255, 255, 255, 0.9)';
            platePakora.appendChild(star);
            
            // 添加星星闪烁动画
            star.style.animation = 'star-twinkle 1.5s infinite';
            
            // 确保有星星闪烁的动画
            if (!document.querySelector('style[data-star-animation]')) {
                const starStyle = document.createElement('style');
                starStyle.setAttribute('data-star-animation', 'true');
                starStyle.textContent = `
                    @keyframes star-twinkle {
                        0% { transform: translateX(-50%) scale(1); }
                        50% { transform: translateX(-50%) scale(1.3); filter: brightness(1.3); }
                        100% { transform: translateX(-50%) scale(1); }
                    }
                `;
                document.head.appendChild(starStyle);
            }
        }
        
        // 添加到完成数组
        this.finishedPakoras.push({
            element: platePakora,
            cookingLevel: pakora.cookingLevel,
            isFlipped: pakora.isFlipped
        });
    }
    
    // 显示分数提示
    showScoreHint(rect, text, color) {
        const hint = document.createElement('div');
        hint.textContent = text;
        hint.style.position = 'absolute';
        hint.style.left = `${rect.left + rect.width/2}px`;
        hint.style.top = `${rect.top - 20}px`;
        hint.style.transform = 'translate(-50%, -50%)';
        hint.style.color = color;
        hint.style.fontSize = '24px';
        hint.style.fontWeight = 'bold';
        hint.style.textShadow = '0 0 5px rgba(255, 255, 255, 0.7)';
        hint.style.zIndex = '100';
        hint.style.pointerEvents = 'none';
        hint.style.animation = 'score-float 1s forwards';
        
        document.body.appendChild(hint);
        
        // 添加动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes score-float {
                0% { opacity: 1; transform: translate(-50%, -50%); }
                100% { opacity: 0; transform: translate(-50%, -150%); }
            }
        `;
        document.head.appendChild(style);
        
        // 1秒后移除
        setTimeout(() => {
            document.body.removeChild(hint);
        }, 1000);
    }
    
    // 显示完美翻转提示
    showPerfectFlip() {
        const perfectHint = document.createElement('div');
        perfectHint.textContent = 'Perfect Flip!';
        perfectHint.style.position = 'absolute';
        perfectHint.style.left = '50%';
        perfectHint.style.top = '40%';
        perfectHint.style.transform = 'translate(-50%, -50%) scale(0)';
        perfectHint.style.color = '#FFC107';
        perfectHint.style.fontSize = '36px';
        perfectHint.style.fontWeight = 'bold';
        perfectHint.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.7)';
        perfectHint.style.zIndex = '100';
        perfectHint.style.pointerEvents = 'none';
        perfectHint.style.animation = 'perfect-hint 1.5s forwards';
        
        document.body.appendChild(perfectHint);
        
        // 添加动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes perfect-hint {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0); }
                50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
            }
        `;
        document.head.appendChild(style);
        
        // 1.5秒后移除
        setTimeout(() => {
            document.body.removeChild(perfectHint);
        }, 1500);
    }
    
    // 显示完美烹饪提示
    showPerfectCooking() {
        const perfectHint = document.createElement('div');
        perfectHint.textContent = 'Perfect Cooking!';
        perfectHint.style.position = 'absolute';
        perfectHint.style.left = '50%';
        perfectHint.style.top = '60%';
        perfectHint.style.transform = 'translate(-50%, -50%) scale(0)';
        perfectHint.style.color = '#4CAF50';
        perfectHint.style.fontSize = '36px';
        perfectHint.style.fontWeight = 'bold';
        perfectHint.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.7)';
        perfectHint.style.zIndex = '100';
        perfectHint.style.pointerEvents = 'none';
        perfectHint.style.animation = 'perfect-hint 1.5s forwards';
        
        document.body.appendChild(perfectHint);
        
        // 1.5秒后移除
        setTimeout(() => {
            document.body.removeChild(perfectHint);
        }, 1500);
    }
    
    // 更新所有Pakora的烹饪速度
    updateCookingSpeed(tempValue) {
        // 温度越高，烹饪速度越快
        const speed = tempValue / 20; // 将0-100的温度转换为0-5的速度
        
        this.pakoras.forEach(pakora => {
            pakora.cookingSpeed = speed;
        });
    }
    
    // 设置背景视频
    setBackgroundVideo(videoElement) {
        this.backgroundVideo = videoElement;
    }
    
    // 启动游戏
    start() {
        console.log('Starting Game E');
        this.isGameActive = true;
        this.score = 0;
        this.timeLeft = 60;
        this.pakoras = [];
        this.finishedPakoras = [];
        this.pakorasInPan = 0;
        this.updateScore();
        
        // 启动计时器
        this.timer = setInterval(() => {
            this.timeLeft--;
            if (this.timerElement) {
                this.timerElement.textContent = `${this.timeLeft}s`;
            }
            
            // 只有当倒计时结束时才结束游戏
            if (this.timeLeft <= 0) {
                this.complete();
            }
        }, 1000);
    }
    
    // 结束游戏
    end() {
        console.log('Ending Game E');
        this.isGameActive = false;
        
        // 清除计时器
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    // 游戏完成
    complete() {
        console.log('Game E Completed');
        this.end();
        
        // 显示游戏结果
        this.showGameResult();
        
        // 3秒后调用所有完成回调
        setTimeout(() => {
            // 调用所有完成回调
            this.gameCompleteCallbacks.forEach(callback => callback(this.score));
        }, 3000);
    }
    
    // 显示游戏结果
    showGameResult() {
        const resultOverlay = document.createElement('div');
        resultOverlay.style.position = 'absolute';
        resultOverlay.style.top = '0';
        resultOverlay.style.left = '0';
        resultOverlay.style.width = '100%';
        resultOverlay.style.height = '100%';
        resultOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        resultOverlay.style.display = 'flex';
        resultOverlay.style.flexDirection = 'column';
        resultOverlay.style.justifyContent = 'center';
        resultOverlay.style.alignItems = 'center';
        resultOverlay.style.zIndex = '1000';
        
        const resultText = document.createElement('div');
        resultText.textContent = 'Game Over!';
        resultText.style.color = 'white';
        resultText.style.fontSize = '48px';
        resultText.style.fontWeight = 'bold';
        resultText.style.marginBottom = '20px';
        
        const scoreText = document.createElement('div');
        scoreText.textContent = `Score: ${this.score}`;
        scoreText.style.color = '#FFC107';
        scoreText.style.fontSize = '36px';
        scoreText.style.fontWeight = 'bold';
        
        resultOverlay.appendChild(resultText);
        resultOverlay.appendChild(scoreText);
        
        this.container.appendChild(resultOverlay);
        
        // 添加淡出效果
        resultOverlay.style.animation = 'fade-out 3s forwards';
        
        // 添加动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fade-out {
                0% { opacity: 1; }
                70% { opacity: 1; }
                100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        // 3秒后移除
        setTimeout(() => {
            this.container.removeChild(resultOverlay);
        }, 3000);
    }
    
    // 添加分数
    addScore(points) {
        if (!this.isGameActive) return;
        
        // 确保points是数字
        points = Number(points);
        if (isNaN(points)) {
            console.error('Invalid score value:', points);
            return;
        }
        
        // 加分并更新显示
        this.score += points;
        this.updateScore();
        
        // 调试输出
        console.log(`Added score: +${points}, Total score: ${this.score}`);
    }
    
    // 更新分数显示
    updateScore() {
        if (this.scoreElement) {
            this.scoreElement.textContent = `Score: ${this.score}`;
            // 添加一个简单的动画效果来吸引注意
            this.scoreElement.style.animation = 'score-pulse 0.5s';
            setTimeout(() => {
                this.scoreElement.style.animation = '';
            }, 500);
        }
    }
    
    // 在样式中添加分数闪烁动画
    addScorePulseAnimation() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes score-pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); color: #ff6600; }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 添加游戏完成回调
    onGameComplete(callback) {
        if (typeof callback === 'function') {
            this.gameCompleteCallbacks.push(callback);
        }
        return this; // 支持链式调用
    }
    
    // 添加蒸汽效果
    addSteamEffect(container) {
        this.steamContainer = document.createElement('div');
        this.steamContainer.style.position = 'absolute';
        this.steamContainer.style.width = '100%';
        this.steamContainer.style.height = '20px';
        this.steamContainer.style.top = '0';
        this.steamContainer.style.left = '0';
        this.steamContainer.style.zIndex = '1';
        this.steamContainer.style.overflow = 'hidden';
        container.appendChild(this.steamContainer);
        
        // 初始化蒸汽
        this.updateSteamEffect(50);
    }
    
    // 更新蒸汽效果
    updateSteamEffect(temperature) {
        // 清空现有蒸汽
        this.steamContainer.innerHTML = '';
        
        // 根据温度决定蒸汽数量和速度
        const steamCount = Math.floor(temperature / 15) + 1;
        
        for (let i = 0; i < steamCount; i++) {
            const steam = document.createElement('div');
            steam.style.position = 'absolute';
            steam.style.width = '8px';
            steam.style.height = '8px';
            steam.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
            steam.style.borderRadius = '50%';
            steam.style.left = `${20 + Math.random() * 60}%`;
            steam.style.top = '0';
            steam.style.opacity = '0.7';
            
            // 设置动画
            const duration = 2.5 - (temperature / 100);
            steam.style.animation = `steam ${duration}s infinite`;
            
            this.steamContainer.appendChild(steam);
        }
    }
} 