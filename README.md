# 视频与游戏交互系统

一个集成视频播放和游戏交互的网页应用，包含两个简单的游戏与三段视频交替播放。

## 项目说明

该项目是一个视频与游戏交互系统，流程如下：
1. 播放视频A
2. 进入游戏E
3. 游戏E完成后播放视频B
4. 进入游戏F（Eid al-Fitr Gift Game）
5. 游戏F完成后播放视频C

## 部署说明

### 本地部署
1. 克隆仓库到本地
```
git clone [仓库地址]
```

2. 进入项目目录
```
cd [项目目录]
```

3. 使用任意HTTP服务器启动项目，例如使用Python自带的HTTP服务器：
```
python -m http.server
```
或者使用Node.js的http-server：
```
npx http-server
```

4. 在浏览器中访问 `http://localhost:8000` 或服务器提供的其他URL

### GitHub Pages部署
1. 将项目推送到GitHub仓库
2. 进入仓库设置（Settings）
3. 在左侧菜单找到"Pages"
4. 在"Source"部分，选择分支（通常是main或master）
5. 点击"Save"保存设置
6. 等待几分钟，GitHub会自动构建并部署你的站点
7. 部署完成后，你会在顶部看到你的站点URL，通常是`https://[用户名].github.io/[仓库名]`

## 使用说明

1. 打开应用后，点击"开始游戏"按钮
2. 视频A会自动播放，之后进入游戏E
3. 完成游戏E后，视频B会自动播放，之后进入游戏F
4. 在游戏F中，你有3次机会打开礼物盒
5. 打开3个礼物盒后，游戏F会自动完成，然后播放视频C
6. 视频C结束后，显示游戏结束界面

## 项目结构

```
/
├── src/                # 源代码目录
│   ├── css/            # CSS样式文件
│   ├── js/             # JavaScript文件
│   │   ├── main.js     # 主入口文件
│   │   ├── videoPlayer.js # 视频播放器
│   │   ├── gameE.js    # 游戏E
│   │   ├── gameF.js    # 游戏F
│   │   └── gameManager.js # 游戏管理器
│   └── index.html      # 主HTML文件
└── public/             # 静态资源目录
    └── assets/         # 资源文件
        └── videos/     # 视频文件
```

## 技术栈

- 原生JavaScript
- HTML5
- CSS3

## 浏览器兼容性

- Chrome（推荐）
- Firefox
- Edge
- Safari

## 注意事项

- 请确保视频文件存在于正确的路径中
- 视频播放可能受到浏览器自动播放政策的影响
- 建议使用现代浏览器访问以获得最佳体验 