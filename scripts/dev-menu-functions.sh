#!/bin/bash

# ============================================================================
# MMS-UI 开发菜单核心功能实现 (精简版)
# ============================================================================

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Node.js 环境管理
install_latest_lts_node() {
    echo -e "${BLUE}📥 安装最新 LTS Node.js...${NC}"
    if command -v nvm >/dev/null 2>&1; then
        nvm install --lts && nvm use --lts && nvm alias default node
        echo -e "${GREEN}✅ 最新 LTS Node.js 安装完成${NC}"
    else
        echo -e "${RED}❌ 请先安装 NVM${NC}"
    fi
    read -p "按任意键继续..." -n1 -s
}

switch_node_version() {
    echo -e "${BLUE}🔄 切换 Node.js 版本${NC}"
    if command -v nvm >/dev/null 2>&1; then
        nvm list
        read -p "请输入版本号: " version
        [[ -n "$version" ]] && nvm use "$version"
    else
        echo -e "${RED}❌ 请先安装 NVM${NC}"
    fi
    read -p "按任意键继续..." -n1 -s
}

# 镜像源管理
test_mirror_speed() {
    echo -e "${BLUE}🚀 测试镜像速度...${NC}"
    mirrors=("https://registry.npmjs.org/" "https://registry.npmmirror.com")
    names=("官方镜像" "淘宝镜像")
    
    for i in "${!mirrors[@]}"; do
        echo -e "${CYAN}测试 ${names[$i]}...${NC}"
        start_time=$(date +%s%3N)
        timeout 10s npm view vue version --registry="${mirrors[$i]}" >/dev/null 2>&1
        end_time=$(date +%s%3N)
        if [ $? -eq 0 ]; then
            duration=$((end_time - start_time))
            echo -e "  ${GREEN}✅ 响应时间: ${duration}ms${NC}"
        else
            echo -e "  ${RED}❌ 连接失败${NC}"
        fi
    done
    read -p "按任意键继续..." -n1 -s
}

setup_pnpm_mirror() {
    echo -e "${BLUE}🔧 配置 PNPM 镜像...${NC}"
    if command -v pnpm >/dev/null 2>&1; then
        pnpm config set registry https://registry.npmmirror.com
        echo -e "${GREEN}✅ PNPM 镜像配置完成${NC}"
    else
        echo -e "${RED}❌ PNPM 未安装${NC}"
    fi
    read -p "按任意键继续..." -n1 -s
}

# 依赖管理
install_pnpm() {
    echo -e "${BLUE}📥 安装 PNPM...${NC}"
    if command -v pnpm >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  PNPM 已安装: $(pnpm --version)${NC}"
    else
        npm install -g pnpm
        echo -e "${GREEN}✅ PNPM 安装完成${NC}"
    fi
    read -p "按任意键继续..." -n1 -s
}

check_vulnerabilities() {
    echo -e "${BLUE}🔍 检查依赖安全漏洞...${NC}"
    npm audit
    read -p "是否自动修复? (y/n): " fix_choice
    [[ "$fix_choice" == "y" ]] && npm audit fix
    read -p "按任意键继续..." -n1 -s
}

# 项目启动
start_dev_npm() {
    echo -e "${BLUE}🚀 启动开发服务器 (npm)...${NC}"
    npm run dev
}

start_dev_pnpm() {
    echo -e "${BLUE}🚀 启动开发服务器 (pnpm)...${NC}"
    command -v pnpm >/dev/null 2>&1 && pnpm run dev || echo -e "${RED}❌ PNPM 未安装${NC}"
}

# 代码质量
run_eslint_fix() {
    echo -e "${BLUE}🔧 ESLint 自动修复...${NC}"
    npm run lint:fix
    echo -e "${GREEN}✅ 修复完成${NC}"
    read -p "按任意键继续..." -n1 -s
}

# 缓存清理
clean_npm_cache() {
    echo -e "${BLUE}🗑️ 清理 npm 缓存...${NC}"
    npm cache clean --force
    echo -e "${GREEN}✅ 清理完成${NC}"
    read -p "按任意键继续..." -n1 -s
}

clean_pnpm_cache() {
    echo -e "${BLUE}🗑️ 清理 pnpm 缓存...${NC}"
    command -v pnpm >/dev/null 2>&1 && pnpm store prune || echo -e "${RED}❌ PNPM 未安装${NC}"
    read -p "按任意键继续..." -n1 -s
}

full_project_reset() {
    echo -e "${RED}⚠️  完全重置项目 (输入 'YES' 确认): ${NC}"
    read -r confirm
    if [[ "$confirm" == "YES" ]]; then
        rm -rf node_modules dist package-lock.json pnpm-lock.yaml
        npm cache clean --force 2>/dev/null
        command -v pnpm >/dev/null 2>&1 && pnpm store prune 2>/dev/null
        echo -e "${GREEN}✅ 项目重置完成${NC}"
    fi
    read -p "按任意键继续..." -n1 -s
}

# 环境诊断
full_environment_check() {
    echo -e "${BLUE}🔍 完整环境检查...${NC}"
    echo -e "${CYAN}系统: $(uname -s) $(uname -m)${NC}"
    command -v node >/dev/null 2>&1 && echo -e "✅ Node.js: $(node --version)" || echo -e "❌ Node.js 未安装"
    command -v npm >/dev/null 2>&1 && echo -e "✅ npm: v$(npm --version)" || echo -e "❌ npm 未安装"
    command -v pnpm >/dev/null 2>&1 && echo -e "✅ pnpm: v$(pnpm --version)" || echo -e "❌ pnpm 未安装"
    [[ -f "package.json" ]] && echo -e "✅ package.json 存在" || echo -e "❌ package.json 不存在"
    [[ -d "node_modules" ]] && echo -e "✅ node_modules 存在" || echo -e "❌ node_modules 不存在"
    read -p "按任意键继续..." -n1 -s
}

# 项目信息
show_project_info() {
    echo -e "${BLUE}ℹ️  项目详细信息${NC}"
    if [[ -f "package.json" ]]; then
        echo -e "${CYAN}项目信息:${NC}"
        node -p "const pkg = require('./package.json'); \`名称: \${pkg.name}\n版本: \${pkg.version}\n描述: \${pkg.description || '无'}\`" 2>/dev/null
        echo ""
        echo -e "${CYAN}主要依赖:${NC}"
        node -p "Object.keys(require('./package.json').dependencies || {}).slice(0,10).join(', ')" 2>/dev/null
    else
        echo -e "${RED}❌ package.json 不存在${NC}"
    fi
    read -p "按任意键继续..." -n1 -s
}