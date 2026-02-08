#!/bin/bash

# ============================================================================
# MMS-UI PNPM 一键启动脚本
# 基于 Vue3 + TypeScript + Vite 项目的快速启动工具
# ============================================================================

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

# 项目信息
PROJECT_NAME="mms-ui"
PROJECT_VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "Unknown")
NODE_MIN_VERSION="18.0.0"
PNPM_MIN_VERSION="8.0.0"

# 检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 版本比较函数
version_compare() {
    local version1=$1
    local version2=$2
    if [[ "$(printf '%s\n' "$version1" "$version2" | sort -V | head -n1)" == "$version1" ]]; then
        return 0  # version1 <= version2
    else
        return 1  # version1 > version2
    fi
}

# 显示标题
show_header() {
    clear
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${WHITE}               MMS-UI PNPM 一键启动脚本                  ${CYAN}║${NC}"
    echo -e "${CYAN}╠══════════════════════════════════════════════════════════╣${NC}"
    echo -e "${CYAN}║ ${YELLOW}项目版本:${NC} ${PROJECT_VERSION}${CYAN}                                          ║${NC}"
    echo -e "${CYAN}║ ${YELLOW}技 术 栈:${NC} Vue3 + TypeScript + Vite + PNPM               ${CYAN}║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# 环境检查
check_environment() {
    echo -e "${BLUE}🔍 环境检查...${NC}"
    echo -e "${GRAY}─────────────────────────────────────────────────────────────${NC}"
    
    local all_checks_passed=true
    
    # 检查 Node.js
    if command_exists node; then
        NODE_VERSION=$(node --version | sed 's/v//')
        echo -e "  ${GREEN}✅ Node.js:${NC} v${NODE_VERSION}"
        
        if ! version_compare "$NODE_MIN_VERSION" "$NODE_VERSION"; then
            echo -e "    ${RED}❌ 版本过低，最低要求: v${NODE_MIN_VERSION}${NC}"
            all_checks_passed=false
        fi
    else
        echo -e "  ${RED}❌ Node.js:${NC} 未安装"
        all_checks_passed=false
    fi
    
    # 检查 npm
    if command_exists npm; then
        NPM_VERSION=$(npm --version)
        echo -e "  ${GREEN}✅ npm:${NC} v${NPM_VERSION}"
    else
        echo -e "  ${RED}❌ npm:${NC} 未安装"
        all_checks_passed=false
    fi
    
    # 检查 pnpm
    if command_exists pnpm; then
        PNPM_VERSION=$(pnpm --version)
        echo -e "  ${GREEN}✅ pnpm:${NC} v${PNPM_VERSION}"
        
        if ! version_compare "$PNPM_MIN_VERSION" "$PNPM_VERSION"; then
            echo -e "    ${YELLOW}⚠️  建议升级到 v${PNPM_MIN_VERSION}+${NC}"
        fi
    else
        echo -e "  ${YELLOW}⚠️  pnpm:${NC} 未安装"
        echo -e "    ${CYAN}💡 将自动安装 pnpm${NC}"
    fi
    
    # 检查项目文件
    if [[ -f "package.json" ]]; then
        echo -e "  ${GREEN}✅ package.json:${NC} 存在"
    else
        echo -e "  ${RED}❌ package.json:${NC} 不存在"
        all_checks_passed=false
    fi
    
    # 检查依赖
    if [[ -d "node_modules" ]]; then
        echo -e "  ${GREEN}✅ node_modules:${NC} 存在"
    else
        echo -e "  ${YELLOW}⚠️  node_modules:${NC} 不存在，需要安装依赖"
    fi
    
    # 检查 pnpm-lock.yaml
    if [[ -f "pnpm-lock.yaml" ]]; then
        echo -e "  ${GREEN}✅ pnpm-lock.yaml:${NC} 存在"
    else
        echo -e "  ${YELLOW}⚠️  pnpm-lock.yaml:${NC} 不存在"
    fi
    
    echo ""
    if $all_checks_passed; then
        return 0
    else
        return 1
    fi
}

# 安装 pnpm
install_pnpm() {
    echo -e "${BLUE}📥 安装 pnpm...${NC}"
    
    if command_exists npm; then
        npm install -g pnpm
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ pnpm 安装成功${NC}"
            # 配置镜像源
            pnpm config set registry https://registry.npmmirror.com
            echo -e "${GREEN}✅ 镜像源配置完成${NC}"
        else
            echo -e "${RED}❌ pnpm 安装失败${NC}"
            exit 1
        fi
    else
        echo -e "${RED}❌ npm 未安装，无法自动安装 pnpm${NC}"
        exit 1
    fi
}

# 配置镜像源
setup_mirrors() {
    echo -e "${BLUE}🔧 配置镜像源...${NC}"
    
    # 配置 npm 镜像
    if command_exists npm; then
        npm config set registry https://registry.npmmirror.com
        echo -e "  ${GREEN}✅ npm 镜像源已配置${NC}"
    fi
    
    # 配置 pnpm 镜像
    if command_exists pnpm; then
        pnpm config set registry https://registry.npmmirror.com
        echo -e "  ${GREEN}✅ pnpm 镜像源已配置${NC}"
    fi
}

# 安装依赖
install_dependencies() {
    echo -e "${BLUE}📦 安装项目依赖...${NC}"
    
    if command_exists pnpm; then
        pnpm install
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ 依赖安装完成${NC}"
        else
            echo -e "${RED}❌ 依赖安装失败${NC}"
            exit 1
        fi
    else
        echo -e "${RED}❌ pnpm 未安装${NC}"
        exit 1
    fi
}

# 显示启动选项
show_start_options() {
    echo -e "${PURPLE}🚀 启动选项:${NC}"
    echo -e "${GRAY}─────────────────────────────────────────────────────────────${NC}"
    echo -e "  ${CYAN}1)${NC}  开发模式启动 (推荐)"
    echo -e "  ${CYAN}2)${NC}  生产模式构建"
    echo -e "  ${CYAN}3)${NC}  预览构建结果"
    echo -e "  ${CYAN}4)${NC}  类型检查"
    echo -e "  ${CYAN}5)${NC}  代码格式化"
    echo -e "  ${CYAN}6)${NC}  代码质量检查"
    echo -e "  ${CYAN}7)${NC}  清理缓存和依赖"
    echo -e "${GRAY}─────────────────────────────────────────────────────────────${NC}"
    echo -e "  ${RED}0)${NC}  退出"
    echo ""
}

# 清理选项
show_clean_options() {
    echo -e "${PURPLE}🗑️ 清理选项:${NC}"
    echo -e "${GRAY}─────────────────────────────────────────────────────────────${NC}"
    echo -e "  ${CYAN}1)${NC}  清理 pnpm 缓存"
    echo -e "  ${CYAN}2)${NC}  删除 node_modules"
    echo -e "  ${CYAN}3)${NC}  删除 pnpm-lock.yaml"
    echo -e "  ${CYAN}4)${NC}  完全清理 (缓存 + 依赖 + lock文件)"
    echo -e "${GRAY}─────────────────────────────────────────────────────────────${NC}"
    echo -e "  ${RED}0)${NC}  返回主菜单"
    echo ""
}

# 执行清理
perform_clean() {
    local choice=$1
    
    case $choice in
        1)
            echo -e "${BLUE}🗑️ 清理 pnpm 缓存...${NC}"
            pnpm store prune
            echo -e "${GREEN}✅ pnpm 缓存清理完成${NC}"
            ;;
        2)
            echo -e "${BLUE}🗑️ 删除 node_modules...${NC}"
            rm -rf node_modules
            echo -e "${GREEN}✅ node_modules 删除完成${NC}"
            ;;
        3)
            echo -e "${BLUE}🗑️ 删除 pnpm-lock.yaml...${NC}"
            rm -f pnpm-lock.yaml
            echo -e "${GREEN}✅ pnpm-lock.yaml 删除完成${NC}"
            ;;
        4)
            echo -e "${BLUE}🗑️ 完全清理...${NC}"
            pnpm store prune 2>/dev/null
            rm -rf node_modules dist pnpm-lock.yaml
            echo -e "${GREEN}✅ 完全清理完成${NC}"
            ;;
        0)
            return
            ;;
        *)
            echo -e "${RED}❌ 无效选择${NC}"
            ;;
    esac
    
    read -p "按任意键继续..." -n1 -s
}

# 主程序
main() {
    # 检查是否在项目根目录
    if [[ ! -f "package.json" ]]; then
        echo -e "${RED}❌ 请在项目根目录下运行此脚本${NC}"
        exit 1
    fi
    
    while true; do
        show_header
        
        # 环境检查
        if ! check_environment; then
            echo -e "${RED}❌ 环境检查失败，请先解决上述问题${NC}"
            
            # 询问是否自动安装 pnpm
            if ! command_exists pnpm; then
                read -p "是否自动安装 pnpm? (y/n): " install_choice
                if [[ "$install_choice" == "y" || "$install_choice" == "Y" ]]; then
                    install_pnpm
                    continue
                else
                    exit 1
                fi
            else
                exit 1
            fi
        fi
        
        # 配置镜像源
        setup_mirrors
        
        # 检查依赖
        if [[ ! -d "node_modules" ]]; then
            echo -e "${YELLOW}⚠️  依赖未安装，是否现在安装? (y/n): ${NC}"
            read -p "" install_deps
            if [[ "$install_deps" == "y" || "$install_deps" == "Y" ]]; then
                install_dependencies
            fi
        fi
        
        echo ""
        show_start_options
        read -p "请选择操作 (0-7): " choice
        
        case $choice in
            1)
                echo -e "${GREEN}🚀 启动开发服务器...${NC}"
                pnpm run dev
                ;;
            2)
                echo -e "${GREEN}🏗️ 构建生产版本...${NC}"
                pnpm run build
                echo -e "${GREEN}✅ 构建完成${NC}"
                read -p "按任意键继续..." -n1 -s
                ;;
            3)
                echo -e "${GREEN}👀 预览构建结果...${NC}"
                pnpm run preview
                ;;
            4)
                echo -e "${GREEN}🔍 TypeScript 类型检查...${NC}"
                pnpm run type-check
                echo -e "${GREEN}✅ 类型检查完成${NC}"
                read -p "按任意键继续..." -n1 -s
                ;;
            5)
                echo -e "${GREEN}💄 代码格式化...${NC}"
                pnpm run format
                echo -e "${GREEN}✅ 格式化完成${NC}"
                read -p "按任意键继续..." -n1 -s
                ;;
            6)
                echo -e "${GREEN}🔍 代码质量检查...${NC}"
                pnpm run lint
                echo -e "${GREEN}✅ 质量检查完成${NC}"
                read -p "按任意键继续..." -n1 -s
                ;;
            7)
                while true; do
                    show_header
                    show_clean_options
                    read -p "请选择清理操作 (0-4): " clean_choice
                    
                    if [[ "$clean_choice" == "0" ]]; then
                        break
                    else
                        perform_clean "$clean_choice"
                    fi
                done
                ;;
            0)
                echo -e "${GREEN}👋 感谢使用 MMS-UI PNPM 一键启动脚本！${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}❌ 无效选择，请重试${NC}"
                sleep 2
                ;;
        esac
    done
}

# 启动主程序
main "$@"