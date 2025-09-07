#!/bin/bash

# NPM 镜像加速配置脚本
# 用法: chmod +x setup-npm-mirrors.sh && ./setup-npm-mirrors.sh

echo "🚀 开始配置 NPM 镜像加速..."

# 设置主镜像
echo "📦 设置淘宝镜像为主镜像源..."
npm config set registry https://registry.npmmirror.com

# 设置特定包的镜像
echo "🔧 配置特定包的镜像源..."
npm config set @vue:registry https://registry.npmmirror.com
npm config set @vite:registry https://registry.npmmirror.com
npm config set @element-plus:registry https://registry.npmmirror.com
npm config set @types:registry https://registry.npmmirror.com

# 网络优化配置
echo "⚡ 配置网络优化参数..."
npm config set fetch-timeout 300000
npm config set fetch-retry-mintimeout 20000
npm config set fetch-retry-maxtimeout 120000
npm config set fetch-retries 3

# 缓存配置
echo "💾 配置缓存参数..."
npm config set cache ~/.npm
# 移除已废弃的配置
npm config delete cache-min 2>/dev/null
npm config delete shrinkwrap 2>/dev/null

# 其他优化
echo "🛠️ 配置其他优化参数..."
npm config set audit-level moderate
npm config set fund false
npm config set package-lock true
npm config set prefer-offline false
npm config set engine-strict false

echo "✅ NPM 镜像配置完成！"
echo ""
echo "🔍 当前配置："
npm config get registry
echo ""
echo "📊 镜像测试："
echo "正在测试镜像连接速度..."
time npm view vue version > /dev/null 2>&1 && echo "✅ 镜像连接正常" || echo "❌ 镜像连接异常"

echo ""
echo "💡 使用建议："
echo "1. 安装依赖: npm install"
echo "2. 快速安装: npm run install:fast"
echo "3. 清理缓存: npm cache clean --force"
echo "4. 恢复官方源: npm config set registry https://registry.npmjs.org/"
echo "5. 测试镜像: npm run mirror:test"