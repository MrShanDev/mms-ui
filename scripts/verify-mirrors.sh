#!/bin/bash

# 镜像配置验证脚本
# 验证所有包管理器的镜像配置是否正确

echo "🔍 验证包管理器镜像配置..."
echo "═══════════════════════════════════════════════════════"

# 验证 NPM 配置
echo "📦 NPM 配置验证:"
if command -v npm &> /dev/null; then
    REGISTRY=$(npm config get registry)
    echo "  当前镜像源: $REGISTRY"
    
    if [[ "$REGISTRY" == *"npmmirror.com"* ]]; then
        echo "  ✅ NPM 镜像配置正确"
    else
        echo "  ⚠️  NPM 镜像未配置或配置错误"
        echo "     建议运行: npm run mirror:setup"
    fi
else
    echo "  ❌ NPM 未安装"
fi

echo ""

# 验证 Yarn 配置
echo "🧶 Yarn 配置验证:"
if command -v yarn &> /dev/null; then
    YARN_REGISTRY=$(yarn config get registry 2>/dev/null)
    echo "  当前镜像源: $YARN_REGISTRY"
    
    if [[ "$YARN_REGISTRY" == *"npmmirror.com"* ]]; then
        echo "  ✅ Yarn 镜像配置正确"
    else
        echo "  ⚠️  Yarn 镜像未配置或配置错误"
        echo "     建议运行: yarn config set registry https://registry.npmmirror.com"
    fi
else
    echo "  ❌ Yarn 未安装"
fi

echo ""

# 验证 PNPM 配置
echo "📎 PNPM 配置验证:"
if command -v pnpm &> /dev/null; then
    PNPM_REGISTRY=$(pnpm config get registry 2>/dev/null)
    echo "  当前镜像源: $PNPM_REGISTRY"
    
    if [[ "$PNPM_REGISTRY" == *"npmmirror.com"* ]]; then
        echo "  ✅ PNPM 镜像配置正确"
    else
        echo "  ⚠️  PNPM 镜像未配置或配置错误"
        echo "     建议运行: pnpm config set registry https://registry.npmmirror.com"
    fi
else
    echo "  ❌ PNPM 未安装"
fi

echo ""

# 验证配置文件是否存在
echo "📄 配置文件验证:"
CONFIG_FILES=(".npmrc" ".yarnrc" ".pnpmrc")

for file in "${CONFIG_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        echo "  ✅ $file 存在"
    else
        echo "  ❌ $file 不存在"
    fi
done

echo ""

# 网络连接测试
echo "🌐 网络连接测试:"
echo "  正在测试淘宝镜像连接..."

if curl -s --connect-timeout 10 https://registry.npmmirror.com > /dev/null; then
    echo "  ✅ 淘宝镜像连接正常"
    
    # 测试包下载速度
    echo "  正在测试包查询速度..."
    START_TIME=$(python3 -c "import time; print(int(time.time() * 1000))" 2>/dev/null || date +%s000)
    npm view vue version --registry=https://registry.npmmirror.com > /dev/null 2>&1
    END_TIME=$(python3 -c "import time; print(int(time.time() * 1000))" 2>/dev/null || date +%s000)
    DURATION=$((END_TIME - START_TIME))
    echo "  📊 查询响应时间: ${DURATION}ms"
    
    if [ $DURATION -lt 5000 ]; then
        echo "  ✅ 响应速度很快"
    elif [ $DURATION -lt 10000 ]; then
        echo "  ⚠️  响应速度一般"
    else
        echo "  ❌ 响应速度较慢"
    fi
else
    echo "  ❌ 淘宝镜像连接失败"
    echo "     可能的原因: 网络问题或镜像服务异常"
fi

echo ""
echo "🎯 总结建议:"
echo "═══════════════════════════════════════════════════════"

# 检查是否所有配置都正确
NPM_OK=$(npm config get registry | grep -c "npmmirror.com" || echo "0")
YARN_OK=0
PNPM_OK=0

if command -v yarn &> /dev/null; then
    YARN_OK=$(yarn config get registry 2>/dev/null | grep -c "npmmirror.com" || echo "0")
fi

if command -v pnpm &> /dev/null; then
    PNPM_OK=$(pnpm config get registry 2>/dev/null | grep -c "npmmirror.com" || echo "0")
fi

TOTAL_OK=$((NPM_OK + YARN_OK + PNPM_OK))

if [ $TOTAL_OK -eq 0 ]; then
    echo "❌ 建议运行 npm run mirror:setup 配置镜像加速"
elif [ $NPM_OK -eq 1 ]; then
    echo "✅ 镜像配置良好，可以正常使用"
else
    echo "⚠️  部分包管理器镜像未配置，建议完善配置"
fi

echo ""
echo "💡 常用命令:"
echo "  npm run mirror:setup    - 配置 NPM 镜像"
echo "  npm run mirror:test     - 测试镜像状态"  
echo "  npm run install:fast    - 使用镜像快速安装"