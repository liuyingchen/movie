class GameF {
    constructor(containerId) {
        console.log('GameF构造函数被调用，传入参数:', containerId);
        
        // 直接接受容器ID或元素
        if (typeof containerId === 'string') {
            this.container = document.getElementById(containerId);
            console.log('通过ID寻找容器:', containerId, '找到容器:', !!this.container);
        } else {
            this.container = containerId;
            console.log('直接使用传入的容器元素:', !!this.container);
        }
        
        // 如果没有找到容器，尝试通过固定ID查找
        if (!this.container) {
            console.warn('GameF构造函数中未找到容器，尝试通过"gameF"ID查找');
            this.container = document.getElementById('gameF');
            
            if (!this.container) {
                console.warn('GameF构造函数中仍未找到容器，将在start方法中创建');
            }
        }
        
        this.isRunning = false;
        this.score = 0;
        this.onCompleteCallback = null;
        
        console.log('GameF初始化完成, 容器状态:', !!this.container);
    }

    // 启动游戏
    start() {
        console.log("游戏F开始启动");
        
        if (this.isRunning) {
            console.log("游戏F已经在运行中");
            return;
        }
        
        this.isRunning = true;
        
        // 再次检查容器是否存在，如果不存在则创建
        if (!this.container) {
            console.warn("游戏F容器不存在，尝试重新获取");
            
            // 尝试重新获取容器
            this.container = document.getElementById('gameF');
            
            if (!this.container) {
                console.warn("再次尝试获取游戏F容器失败，创建新容器");
                this.container = document.createElement('div');
                this.container.id = 'gameF';
                this.container.className = 'game-container';
                this.container.style.position = 'absolute';
                this.container.style.top = '0';
                this.container.style.left = '0';
                this.container.style.width = '100%';
                this.container.style.height = '100%';
                this.container.style.zIndex = '999999';
                this.container.style.visibility = 'visible';
                this.container.style.display = 'block';
                
                document.body.appendChild(this.container);
                console.log("已创建新的游戏F容器并添加到body");
            } else {
                console.log("成功获取到了游戏F容器");
            }
        }
        
        // 确保容器可见且有合适的z-index
        this.container.style.display = 'block';
        this.container.style.zIndex = '999999';
        this.container.style.visibility = 'visible';
        this.container.style.opacity = '1';
        this.container.style.pointerEvents = 'auto';
        
        // 移除强制容器为全屏的样式设置，让内部gameContainer控制尺寸
        this.container.setAttribute('style', 
            'display: block !important; ' +
            'z-index: 999999 !important; ' +
            'position: absolute !important; ' +
            'top: 0 !important; ' +
            'left: 0 !important; ' +
            'width: 100% !important; ' +
            'height: 100% !important; ' +
            'visibility: visible !important; ' +
            'opacity: 1 !important; ' + 
            'pointer-events: auto !important;');
            
        console.log("游戏F容器样式已设置:", 
            'display=' + window.getComputedStyle(this.container).display, 
            'zIndex=' + window.getComputedStyle(this.container).zIndex);
        
        // 清空容器内容
        this.container.innerHTML = '';
        
        // 加载Eid礼物游戏HTML
        this.loadEidGiftGameHTML();
        
        console.log("游戏F启动完成");
    }
    
    // 加载Eid礼物游戏HTML
    loadEidGiftGameHTML() {
        // 创建游戏容器
        const gameContainer = document.createElement('div');
        gameContainer.id = 'eid-gift-game';
        gameContainer.style.width = '75%'; // 恢复为75%宽度
        gameContainer.style.height = '80%'; // 恢复为80%高度
        gameContainer.style.position = 'absolute';
        gameContainer.style.top = '50%'; // 垂直居中
        gameContainer.style.left = '50%'; // 水平居中
        gameContainer.style.transform = 'translate(-50%, -50%)'; // 确保完全居中
        gameContainer.style.zIndex = '1000';
        // 更透明的背景
        gameContainer.style.backgroundColor = 'rgba(26, 71, 42, 0.4)'; // 降低不透明度至0.4
        gameContainer.style.overflow = 'auto';
        gameContainer.style.fontFamily = "'Montserrat', sans-serif";
        gameContainer.style.borderRadius = '15px'; // 添加圆角
        gameContainer.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.3)'; // 添加阴影
        
        // 添加样式
        const styleTag = document.createElement('style');
        styleTag.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');
            
            #eid-gift-game {
                /* 更透明的渐变背景 */
                background: linear-gradient(135deg, rgba(26, 71, 42, 0.4), rgba(45, 90, 64, 0.4));
                color: #fff;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center; /* 添加垂直居中 */
                padding: 0; /* 确保没有内边距 */
                margin: 0; /* 确保没有外边距 */
                box-sizing: border-box; /* 使用border-box */
            }
            
            .header {
                /* 更透明的标题栏 */
                background: linear-gradient(to bottom, rgba(0, 100, 0, 0.5), rgba(0, 80, 0, 0.4));
                width: 100%;
                text-align: center;
                padding: 20px 0;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                position: relative;
                overflow: hidden;
                border-bottom: 3px solid gold;
                border-radius: 15px 15px 0 0; /* 圆角顶部 */
            }
            
            h1 {
                margin: 0;
                font-size: 2.5rem;
                color: gold;
                text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
                letter-spacing: 1px;
                position: relative;
                z-index: 2;
            }
            
            .subtitle {
                color: white;
                font-size: 1.2rem;
                margin-top: 10px;
                text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
                position: relative;
                z-index: 2;
            }
            
            .container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center; /* 添加垂直居中 */
                padding: 20px;
                width: 100%; /* 使用100%宽度 */
                height: calc(100% - 150px); /* 计算高度，减去标题高度 */
                position: relative;
                z-index: 2;
                box-sizing: border-box; /* 使用border-box */
            }
            
            .gift-container {
                display: flex;
                flex-direction: column;  /* 将布局改为纵向，便于创建两行 */
                align-items: center;
                justify-content: center;
                gap: 25px;
                margin-top: 30px;
                margin-bottom: 30px;
                width: 100%; /* 使用100%宽度 */
                max-width: 800px; /* 设置最大宽度 */
            }
            
            .gift-row {
                display: flex;
                justify-content: center;
                gap: 25px;
                flex-wrap: nowrap;
            }
            
            .gift {
                width: 120px; /* 调整礼品盒大小 */
                height: 120px;
                cursor: pointer;
                position: relative;
                border-radius: 10px;
                box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4), 
                            inset 0 -5px 15px rgba(0, 0, 0, 0.3),
                            inset 0 5px 15px rgba(255, 255, 255, 0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 24px;
                transition: transform 0.6s, box-shadow 0.6s;
                transform-style: preserve-3d;
                background-size: 100% 100%;
                background-color: transparent;
                animation: float 3s infinite ease-in-out;
                transform: perspective(800px) rotateY(5deg) rotateX(5deg);
            }
            
            @keyframes float {
                0%, 100% { transform: perspective(800px) translateY(0) rotateY(5deg) rotateX(5deg); }
                50% { transform: perspective(800px) translateY(-15px) rotateY(8deg) rotateX(2deg); }
            }
            
            .gift:hover {
                transform: scale(1.08) translateY(-15px) rotateY(15deg) rotateX(-5deg);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 
                            inset 0 -5px 15px rgba(0, 0, 0, 0.3),
                            inset 0 5px 15px rgba(255, 255, 255, 0.2);
                animation-play-state: paused;
            }
            
            .gift:active {
                transform: scale(0.95);
            }
            
            .gift.opened {
                pointer-events: none;
                opacity: 0.7;
                animation: openGift 1s forwards;
            }
            
            @keyframes openGift {
                0% { transform: perspective(800px) rotateY(0); }
                30% { transform: perspective(800px) rotateY(180deg) scale(1.2); }
                60% { transform: perspective(800px) rotateY(180deg) scale(0.8); }
                100% { transform: perspective(800px) rotateY(180deg) scale(1); opacity: 0.7; }
            }
            
            .gift.disabled {
                pointer-events: none;
                opacity: 0.5;
                cursor: not-allowed;
                animation-play-state: paused;
                filter: grayscale(70%);
            }
            
            .gift-front, .gift-back {
                position: absolute;
                width: 100%;
                height: 100%;
                backface-visibility: hidden;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .gift-front {
                background-color: rgba(0, 0, 0, 0.2);
                z-index: 2;
                box-shadow: inset 0 2px 10px rgba(255, 255, 255, 0.3), 
                            inset 0 -2px 10px rgba(0, 0, 0, 0.3);
            }
            
            .gift-back {
                transform: rotateY(180deg);
                background-color: rgba(255, 223, 0, 0.2);
                color: gold;
                font-size: 40px;
            }
            
            /* 更透明的礼品盒渐变 */
            .gift1 .gift-front { background: linear-gradient(135deg, rgba(0, 136, 0, 0.7), rgba(0, 100, 0, 0.7), rgba(0, 77, 0, 0.7)); }
            .gift2 .gift-front { background: linear-gradient(135deg, rgba(255, 215, 0, 0.7), rgba(221, 170, 0, 0.7), rgba(187, 136, 0, 0.7)); }
            .gift3 .gift-front { background: linear-gradient(135deg, rgba(50, 205, 50, 0.7), rgba(34, 139, 34, 0.7), rgba(23, 105, 23, 0.7)); }
            .gift4 .gift-front { background: linear-gradient(135deg, rgba(160, 82, 45, 0.7), rgba(139, 69, 19, 0.7), rgba(105, 53, 15, 0.7)); }
            .gift5 .gift-front { background: linear-gradient(135deg, rgba(0, 136, 0, 0.7), rgba(0, 100, 0, 0.7), rgba(0, 77, 0, 0.7)); }
            .gift6 .gift-front { background: linear-gradient(135deg, rgba(255, 215, 0, 0.7), rgba(221, 170, 0, 0.7), rgba(187, 136, 0, 0.7)); }
            .gift7 .gift-front { background: linear-gradient(135deg, rgba(50, 205, 50, 0.7), rgba(34, 139, 34, 0.7), rgba(23, 105, 23, 0.7)); }
            .gift8 .gift-front { background: linear-gradient(135deg, rgba(160, 82, 45, 0.7), rgba(139, 69, 19, 0.7), rgba(105, 53, 15, 0.7)); }
            .gift9 .gift-front { background: linear-gradient(135deg, rgba(0, 136, 0, 0.7), rgba(0, 100, 0, 0.7), rgba(0, 77, 0, 0.7)); }
            
            .info-container {
                display: flex;
                justify-content: space-between;
                width: 100%;
                max-width: 600px;
                margin-top: 20px;
                animation: fadeIn 1s;
            }
            
            .info-box {
                padding: 12px 20px;
                background: rgba(255, 255, 255, 0.15);
                border: 2px solid gold;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                font-size: 1.1rem;
                backdrop-filter: blur(5px);
                transition: transform 0.3s, box-shadow 0.3s;
            }
            
            .restart-btn {
                background-color: #4CAF50;
                color: white;
                border: none;
                padding: 15px 40px;
                font-size: 18px;
                font-weight: bold;
                border-radius: 8px;
                cursor: pointer;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                transition: all 0.3s;
                margin-top: 30px;
                position: relative;
                overflow: hidden;
                text-transform: uppercase;
                letter-spacing: 1px;
                z-index: 3;
            }
            
            .restart-btn:hover {
                background-color: #45a049;
                transform: translateY(-2px);
                box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
            }
            
            .restart-btn:active {
                transform: translateY(1px);
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
            }
            
            .modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                /* 更透明的模态框背景 */
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 100;
                justify-content: center;
                align-items: center;
                perspective: 1000px;
            }
            
            .modal-content {
                background: linear-gradient(145deg, #ffffff, #f0f0f0);
                padding: 30px;
                border-radius: 20px;
                max-width: 450px;
                width: 80%;
                text-align: center;
                position: relative;
                box-shadow: 0 10px 35px rgba(0, 0, 0, 0.5);
                border: 3px solid gold;
                transform-style: preserve-3d;
                animation: openModal 0.8s forwards;
                color: #333;
            }
            
            .prize-emoji {
                font-size: 70px;
                margin: 20px auto;
                animation: wiggle 2s infinite ease-in-out;
                display: inline-block;
            }
            
            .complete-btn {
                margin-top: 30px;
                padding: 15px 30px;
                background: linear-gradient(145deg, #c00000, #800000);
                color: white;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                font-size: 1.2rem;
                font-weight: bold;
                transition: all 0.3s;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }
            
            .complete-btn:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            }
        `;
        document.head.appendChild(styleTag);
        
        // 创建游戏HTML结构 - 不包含完成按钮
        gameContainer.innerHTML = `
            <div class="stars" id="stars"></div>
            <div class="confetti" id="confetti"></div>
            
            <div class="header">
                <h1>Eid al-Fitr Gift Game</h1>
                <div class="subtitle">Open gifts to discover Eid surprises!</div>
            </div>
            
            <div class="container">
                <div class="info-container">
                    <div class="info-box">
                        Gifts Opened: <span id="opened-count">0</span> / <span id="total-count">0</span>
                    </div>
                    <div class="info-box">
                        Remaining: <span id="remaining-count">3</span> / 3
                    </div>
                </div>
                
                <div class="gift-container" id="gift-container">
                    <!-- Gifts will be added dynamically -->
                </div>
                
                <button class="restart-btn" id="restart-btn">Restart Game</button>
                <!-- 完成按钮已被移除 -->
            </div>
            
            <div class="modal" id="prize-modal">
                <div class="modal-content">
                    <span class="close-btn" id="close-modal">&times;</span>
                    <h2 class="prize-title" id="prize-title">Congratulations!</h2>
                    <div class="prize-emoji" id="prize-emoji">🎁</div>
                    <p class="prize-description" id="prize-description">You have won a prize!</p>
                </div>
            </div>
        `;
        
        // 将游戏容器添加到主容器
        if (this.container) {
            this.container.appendChild(gameContainer);
            console.log("游戏F: Eid礼物游戏HTML已加载");
        } else {
            console.error("游戏F容器仍然不存在，无法加载HTML");
        }
        
        // 初始化游戏逻辑
        this.initEidGameLogic();
    }
    
    // 初始化Eid游戏逻辑
    initEidGameLogic() {
        // 创建星星背景 - 更多星星，提高可见度
        const starsContainer = document.getElementById('stars');
        if (starsContainer) {
            for (let i = 0; i < 200; i++) {
                const star = document.createElement('div');
                star.className = `star star${Math.ceil(Math.random() * 3)}`;
                star.style.position = 'absolute';
                star.style.width = (i % 3 + 2) + 'px';
                star.style.height = (i % 3 + 2) + 'px';
                star.style.backgroundColor = 'gold';
                star.style.borderRadius = '50%';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.animation = 'twinkle 3s infinite alternate';
                star.style.animationDelay = Math.random() * 5 + 's';
                starsContainer.appendChild(star);
            }
        }
        
        // 礼物数据 - 20种不同的礼物选项
        const allPrizes = [
            {
                title: 'Delicious Baklava',
                emoji: '🍯',
                description: 'You won a tray of sweet baklava! This layered pastry dessert is made of filo pastry, filled with chopped nuts, and sweetened with syrup or honey.'
            },
            {
                title: 'Traditional Dates',
                emoji: '🌴',
                description: 'You found a box of premium dates! Dates are a traditional fruit enjoyed during Eid al-Fitr, symbolizing sweetness and prosperity.'
            },
            {
                title: 'Eid Greeting Cards',
                emoji: '✉️',
                description: 'You received beautiful Eid greeting cards! Share them with your loved ones to spread the joy and blessings of Eid al-Fitr.'
            },
            {
                title: 'Eid Mubarak!',
                emoji: '🌙',
                description: '"May Allah accept your good deeds, forgive your transgressions and ease the suffering of all people around the globe." - Eid Mubarak!'
            },
            {
                title: 'Henna Art Kit',
                emoji: '🎨',
                description: 'You won a beautiful henna art kit! Henna decoration is a popular tradition during Eid celebrations.'
            },
            {
                title: 'Sweet Maamoul Cookies',
                emoji: '🍪',
                description: 'You discovered traditional Maamoul cookies! These shortbread pastries filled with dates or nuts are a delicious Eid treat.'
            },
            {
                title: 'Eid Wisdom',
                emoji: '📖',
                description: '"He who gives up his desires for the sake of Allah, Allah will fulfill his hopes." - A beautiful reminder during this blessed time.'
            },
            {
                title: 'Islamic Book Collection',
                emoji: '📚',
                description: 'You received a collection of Islamic books about the teachings of the Quran and the life of Prophet Muhammad (PBUH). Knowledge is a gift that lasts forever.'
            },
            {
                title: 'Prayer Beads',
                emoji: '📿',
                description: 'You found beautiful prayer beads (Misbaha)! These beads are used to keep count while reciting prayers and dhikr.'
            }
        ];
        
        // 盒子设置
        const boxes = [
            { id: 1, class: 'gift1', label: '1' },
            { id: 2, class: 'gift2', label: '2' },
            { id: 3, class: 'gift3', label: '3' },
            { id: 4, class: 'gift4', label: '4' },
            { id: 5, class: 'gift5', label: '5' },
            { id: 6, class: 'gift6', label: '6' },
            { id: 7, class: 'gift7', label: '7' },
            { id: 8, class: 'gift8', label: '8' },
            { id: 9, class: 'gift9', label: '9' }
        ];
        
        // 游戏变量
        let openedGifts = 0;
        let remainingOpens = 3;
        const totalGifts = boxes.length;
        let currentPrizes = [];
        
        // DOM元素
        const giftContainer = document.getElementById('gift-container');
        const modal = document.getElementById('prize-modal');
        const closeModal = document.getElementById('close-modal');
        const prizeTitle = document.getElementById('prize-title');
        const prizeEmoji = document.getElementById('prize-emoji');
        const prizeDescription = document.getElementById('prize-description');
        const restartBtn = document.getElementById('restart-btn');
        const openedCountDisplay = document.getElementById('opened-count');
        const totalCountDisplay = document.getElementById('total-count');
        const remainingCountDisplay = document.getElementById('remaining-count');
        const confettiContainer = document.getElementById('confetti');
        
        // 更新计数器
        if (totalCountDisplay) totalCountDisplay.textContent = totalGifts;
        if (openedCountDisplay) openedCountDisplay.textContent = openedGifts;
        if (remainingCountDisplay) remainingCountDisplay.textContent = remainingOpens;
        
        // 创建彩纸效果
        const createConfetti = () => {
            if (!confettiContainer) return;
            
            confettiContainer.innerHTML = '';
            confettiContainer.style.display = 'block';
            confettiContainer.style.position = 'fixed';
            confettiContainer.style.top = '0';
            confettiContainer.style.left = '0';
            confettiContainer.style.width = '100%';
            confettiContainer.style.height = '100%';
            confettiContainer.style.pointerEvents = 'none';
            confettiContainer.style.zIndex = '1';
            
            const colors = ['#FFD700', '#006400', '#228B22', '#8B4513', '#FFFFFF', '#228B22'];
            
            for (let i = 0; i < 100; i++) {
                const confetti = document.createElement('div');
                confetti.style.position = 'absolute';
                confetti.style.width = Math.random() * 10 + 5 + 'px';
                confetti.style.height = Math.random() * 15 + 10 + 'px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.top = '-20px';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.opacity = Math.random() + 0.5;
                confetti.style.animation = 'fall ' + (Math.random() * 3 + 2) + 's linear forwards';
                
                // 添加动画关键帧
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes fall {
                        0% { transform: translateY(0) rotate(0deg); }
                        100% { transform: translateY(1000px) rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
                
                confettiContainer.appendChild(confetti);
            }
            
            // 彩纸动画完成后停止
            setTimeout(() => {
                confettiContainer.style.display = 'none';
            }, 5000);
        };
        
        // 模态窗口动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes openModal {
                0% { opacity: 0; transform: rotateX(-90deg); }
                100% { opacity: 1; transform: rotateX(0); }
            }
            
            @keyframes wiggle {
                0%, 100% { transform: rotate(-5deg); }
                50% { transform: rotate(5deg); }
            }
            
            @keyframes twinkle {
                0% { opacity: 0.2; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.5); }
                100% { opacity: 0.3; transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
        
        // 保存对GameF实例的引用
        const self = this;
        
        // 初始化游戏
        const initGame = () => {
            if (!giftContainer) return;
            
            giftContainer.innerHTML = '';
            openedGifts = 0;
            remainingOpens = 3;
            
            if (openedCountDisplay) openedCountDisplay.textContent = openedGifts;
            if (remainingCountDisplay) remainingCountDisplay.textContent = remainingOpens;
            
            // 从20个选项中随机选择9个奖品
            currentPrizes = [];
            const shuffledPrizes = [...allPrizes].sort(() => 0.5 - Math.random());
            for (let i = 0; i < 9; i++) {
                currentPrizes.push(shuffledPrizes[i % shuffledPrizes.length]);
            }
            
            // 创建两行礼物盒排列
            // 第一行：5个礼物盒
            const row1 = document.createElement('div');
            row1.className = 'gift-row';
            
            // 第二行：4个礼物盒
            const row2 = document.createElement('div');
            row2.className = 'gift-row';
            
            // 为每一行添加礼物
            boxes.forEach((box, index) => {
                const giftElement = document.createElement('div');
                giftElement.className = `gift ${box.class}`;
                giftElement.dataset.id = box.id;
                giftElement.dataset.prizeIndex = index;
                
                // 创建正面
                const giftFront = document.createElement('div');
                giftFront.className = 'gift-front';
                giftFront.textContent = box.label;
                
                // 创建背面
                const giftBack = document.createElement('div');
                giftBack.className = 'gift-back';
                giftBack.textContent = '🎁';
                
                // 创建丝带元素
                const giftRibbon = document.createElement('div');
                giftRibbon.className = 'gift-ribbon';
                giftRibbon.innerHTML = `
                    <div class="ribbon-h"></div>
                    <div class="ribbon-v"></div>
                    <div class="ribbon-circle"></div>
                `;
                
                // 组装礼物
                giftElement.appendChild(giftFront);
                giftElement.appendChild(giftBack);
                giftElement.appendChild(giftRibbon);
                
                giftElement.addEventListener('click', handleGiftClick);
                
                // 前5个放第一行，后4个放第二行
                if (index < 5) {
                    row1.appendChild(giftElement);
                } else {
                    row2.appendChild(giftElement);
                }
                
                // 添加不同的动画延迟
                giftElement.style.animationDelay = (index * 0.2) + 's';
            });
            
            // 将两行添加到容器中
            giftContainer.appendChild(row1);
            giftContainer.appendChild(row2);
        };
        
        // 处理礼物点击 - 添加自动完成逻辑
        function handleGiftClick() {
            // 函数内部使用 self 替代 this 来引用 GameF 实例
            if (remainingOpens <= 0) return;
            
            if (!this.classList.contains('opened') && !this.classList.contains('disabled')) {
                // 更新计数器
                openedGifts++;
                remainingOpens--;
                
                if (openedCountDisplay) openedCountDisplay.textContent = openedGifts;
                if (remainingCountDisplay) remainingCountDisplay.textContent = remainingOpens;
                
                // 打开礼物
                this.classList.add('opened');
                
                // 显示奖品
                const prizeIndex = this.dataset.prizeIndex;
                const prize = currentPrizes[prizeIndex];
                
                if (prizeTitle) prizeTitle.textContent = prize.title;
                if (prizeEmoji) prizeEmoji.textContent = prize.emoji;
                if (prizeDescription) prizeDescription.textContent = prize.description;
                
                // 显示模态窗口
                if (modal) modal.style.display = 'flex';
                
                // 创建彩纸动画
                createConfetti();
                
                // 如果没有更多次数，禁用所有剩余礼物
                if (remainingOpens <= 0) {
                    document.querySelectorAll('.gift:not(.opened)').forEach(gift => {
                        gift.classList.add('disabled');
                    });
                    
                    // 当用完所有尝试机会时，自动触发完成游戏
                    setTimeout(() => {
                        if (typeof self.onCompleteCallback === 'function') {
                            self.onCompleteCallback(self.score);
                        }
                        self.complete();
                    }, 3000); // 给玩家3秒时间查看最后打开的礼物，然后完成游戏
                }
            }
        }
        
        // 关闭模态窗口
        if (closeModal && modal) {
            closeModal.addEventListener('click', function() {
                modal.style.display = 'none';
            });
            
            // 点击模态窗口外部时关闭
            window.addEventListener('click', function(event) {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
        
        // 重新开始游戏
        if (restartBtn) {
            restartBtn.addEventListener('click', function() {
                initGame();
            });
        }
        
        // 初始加载游戏
        initGame();
    }
    
    // 完成游戏
    complete() {
        if (!this.isRunning) {
            return;
        }
        
        console.log("游戏F完成");
        this.isRunning = false;
        
        // 清空容器
        if (this.container) {
            this.container.innerHTML = '';
            this.container.style.display = 'none';
        }
        
        // 调用完成回调
        if (typeof this.onCompleteCallback === 'function') {
            this.onCompleteCallback(this.score);
        }
    }
    
    // 设置完成回调
    onComplete(callback) {
        this.onCompleteCallback = callback;
    }
    
    // 为兼容性添加onGameComplete方法
    onGameComplete(callback) {
        this.onCompleteCallback = callback;
    }
    
    // 获取当前分数
    getScore() {
        return this.score;
    }
}

// 导出游戏类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameF;
} 