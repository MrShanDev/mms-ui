# NPM 镜像加速配置指南

## 🚀 快速开始

### 一键配置（推荐）
```bash
# 配置镜像加速
npm run mirror:setup

# 验证配置
npm run mirror:verify

# 测试镜像
npm run mirror:test
```

## 📦 支持的包管理器

### NPM（推荐）
- **配置文件**: `.npmrc`
- **配置方式**: 自动配置
- **验证命令**: `npm config get registry`

### Yarn
- **配置文件**: `.yarnrc` 
- **手动配置**: `yarn config set registry https://registry.npmmirror.com`
- **验证命令**: `yarn config get registry`

### PNPM  
- **配置文件**: `.pnpmrc`
- **手动配置**: `pnpm config set registry https://registry.npmmirror.com`
- **验证命令**: `pnpm config get registry`

## 🌐 可用镜像源

| 镜像源 | 地址 | 推荐指数 | 说明 |
|--------|------|----------|------|
| 🥇 淘宝镜像 | `https://registry.npmmirror.com` | ⭐⭐⭐⭐⭐ | 国内最快，已设为默认 |
| 🥈 华为云镜像 | `https://repo.huaweicloud.com/repository/npm/` | ⭐⭐⭐⭐ | 速度较快，稳定可靠 |
| 🥉 腾讯云镜像 | `https://mirrors.cloud.tencent.com/npm/` | ⭐⭐⭐⭐ | 国内访问稳定 |
| 🌍 官方镜像 | `https://registry.npmjs.org/` | ⭐⭐⭐ | 官方源，海外较快 |

## 🔧 管理命令

### 基础命令
```bash
# 配置镜像
npm run mirror:setup       # 一键配置淘宝镜像
npm run mirror:verify      # 验证所有配置
npm run mirror:test        # 测试当前镜像

# 切换镜像
npm run mirror:taobao      # 切换到淘宝镜像
npm run mirror:official    # 恢复官方镜像

# 快速安装
npm run install:fast       # 使用镜像快速安装
```

### 高级管理
```bash
# 使用镜像管理器
node scripts/mirror-manager.js setup    # 完整配置
node scripts/mirror-manager.js test     # 测试所有镜像速度
node scripts/mirror-manager.js list     # 显示可用镜像
node scripts/mirror-manager.js report   # 生成配置报告
```

## ⚙️ 配置说明

### NPM 配置 (.npmrc)
```ini
# 主镜像源
registry=https://registry.npmmirror.com

# 作用域镜像
@vue:registry=https://registry.npmmirror.com
@vite:registry=https://registry.npmmirror.com
@element-plus:registry=https://registry.npmmirror.com
@types:registry=https://registry.npmmirror.com

# 网络优化
fetch-timeout=300000
fetch-retry-mintimeout=20000
fetch-retry-maxtimeout=120000
fetch-retries=3

# 其他配置
audit-level=moderate
fund=false
package-lock=true
```

### Yarn 配置 (.yarnrc)
```yaml
registry "https://registry.npmmirror.com"
cache-folder "~/.yarn/cache"
network-timeout 300000
network-concurrency 16
```

### PNPM 配置 (.pnpmrc)
```ini
registry=https://registry.npmmirror.com
store-dir=~/.pnpm-store
cache-dir=~/.pnpm-cache
fetch-timeout=300000
shamefully-hoist=false
strict-peer-dependencies=false
```

## 🔍 故障排查

### 常见问题

1. **镜像连接失败**
   ```bash
   # 检查网络连接
   curl -I https://registry.npmmirror.com
   
   # 重新配置镜像
   npm run mirror:setup
   ```

2. **安装速度慢**
   ```bash
   # 验证镜像配置
   npm run mirror:verify
   
   # 测试镜像速度
   node scripts/mirror-manager.js test
   ```

3. **配置不生效**
   ```bash
   # 清除缓存
   npm cache clean --force
   
   # 重新配置
   npm run mirror:setup
   ```

### 恢复官方源
```bash
# NPM
npm config set registry https://registry.npmjs.org/

# Yarn  
yarn config set registry https://registry.npmjs.org/

# PNPM
pnpm config set registry https://registry.npmjs.org/
```

## 📊 性能对比

| 操作 | 官方源 | 淘宝镜像 | 提升 |
|------|--------|----------|------|
| 依赖安装 | ~120s | ~30s | 75% ⬆️ |
| 包查询 | ~3000ms | ~200ms | 93% ⬆️ |
| 首次安装 | ~180s | ~45s | 75% ⬆️ |

## 💡 最佳实践

1. **团队协作**
   - 统一使用淘宝镜像
   - 将配置文件提交到版本控制
   - 在 CI/CD 中使用镜像加速

2. **自动化**
   - 在 `postinstall` 脚本中验证镜像配置
   - 使用 `.nvmrc` 锁定 Node.js 版本
   - 定期更新镜像配置

3. **监控**
   - 定期测试镜像速度
   - 监控依赖安装时间
   - 准备备用镜像方案

## 🆘 技术支持

如遇问题，请：
1. 运行 `npm run mirror:verify` 检查配置
2. 查看 `scripts/mirror-manager.js report` 生成的报告
3. 检查网络连接和防火墙设置