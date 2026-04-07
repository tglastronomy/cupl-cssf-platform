#!/bin/bash
set -e

echo "===== 法大刑司考研平台 - 一键部署 ====="

# 安装 Node.js 20
if ! command -v node &>/dev/null; then
  echo "[1/5] 安装 Node.js..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
else
  echo "[1/5] Node.js 已安装: $(node -v)"
fi

# 安装 Git
if ! command -v git &>/dev/null; then
  echo "[2/5] 安装 Git..."
  apt-get update && apt-get install -y git
else
  echo "[2/5] Git 已安装"
fi

# 安装 PM2 进程管理
if ! command -v pm2 &>/dev/null; then
  echo "[3/5] 安装 PM2..."
  npm install -g pm2
else
  echo "[3/5] PM2 已安装"
fi

# 克隆/更新代码
echo "[4/5] 拉取代码..."
cd /root
if [ -d "cupl-cssf-platform" ]; then
  cd cupl-cssf-platform && git pull
else
  git clone https://github.com/tglastronomy/cupl-cssf-platform.git
  cd cupl-cssf-platform
fi

# 安装依赖
echo "[5/5] 安装依赖并启动..."
cd server && npm install

# 设置环境变量
export GH_TOKEN="${GH_TOKEN:-}"
export NODE_ENV=production

# 停止旧进程
pm2 stop cupl-api 2>/dev/null || true
pm2 delete cupl-api 2>/dev/null || true

# 启动后端
pm2 start index.js --name cupl-api --node-args="--experimental-modules"
pm2 save

# 设置开机自启
pm2 startup systemd -u root --hp /root 2>/dev/null || true

# 设置定时爬虫（每30分钟跑一次小红书爬虫）
(crontab -l 2>/dev/null | grep -v local-crawler; echo "*/30 * * * * cd /root/cupl-cssf-platform/server && /usr/bin/node local-crawler.js >> /var/log/xhs-crawler.log 2>&1") | crontab -

echo ""
echo "===== 部署完成！====="
echo "后端地址: http://39.107.73.81:3001"
echo "PM2 状态:"
pm2 status
echo ""
echo "小红书爬虫已设置每30分钟自动运行"
echo "============================="
