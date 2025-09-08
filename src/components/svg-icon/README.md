# SvgIcon 多图标库支持组件

升级后的 SvgIcon 组件支持多种主流图标库，能够自动识别图标类型并正确渲染。

## 支持的图标库

### 1. Element Plus Icons (@element-plus/icons-vue)
使用 `ele-` 前缀
```vue
<!-- Element Plus 图标 -->
<SvgIcon name="ele-Search" />
<SvgIcon name="ele-User" />
<SvgIcon name="ele-Setting" />
```

### 2. Iconify Icons (@iconify/vue)  
使用 `图标集:图标名` 格式
```vue
<!-- Material Design Icons -->
<SvgIcon name="mdi:home" />
<SvgIcon name="mdi:account" />

<!-- Heroicons -->
<SvgIcon name="heroicons:user-solid" />

<!-- Tabler Icons -->
<SvgIcon name="tabler:search" />

<!-- Carbon Icons -->
<SvgIcon name="carbon:user" />
```

### 3. FontAwesome Icons
使用 `fa-` 或 `fas`、`far`、`fab` 等前缀
```vue
<!-- FontAwesome -->
<SvgIcon name="fa-home" />
<SvgIcon name="fas fa-user" />
<SvgIcon name="far fa-heart" />
<SvgIcon name="fab fa-github" />
```

### 4. Iconfont (阿里图标库)
使用 `iconfont` 关键词或 `icon-` 前缀
```vue
<!-- Iconfont 图标 -->
<SvgIcon name="iconfont icon-search1" />
<SvgIcon name="icon-xinzeng" />
<SvgIcon name="iconfont icon-daoru" />
```

### 5. SVG Sprite 图标
使用 `#` 前缀或 `icon-` 前缀
```vue
<!-- SVG Sprite -->
<SvgIcon name="#icon-custom" />
<SvgIcon name="icon-custom" />
```

## 组件属性 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| name | string | '' | 图标名称（主要属性） |
| icon | string | '' | 图标名称（兼容旧版本） |
| color | string | '' | 图标颜色 |
| size | string \| number | '' | 图标大小，支持 '16px' 或 16 |
| className | string | '' | 自定义 CSS 类名 |
| type | string | 'auto' | 图标类型，可选：'auto', 'element', 'iconify', 'iconfont', 'svg', 'font' |

## ✨ 尺寸统一优化

升级后的 SvgIcon 组件解决了不同图标库尺寸不统一的问题：

- 🎯 **统一容器**: 所有图标都使用相同的 `flex` 布局容器
- 📏 **标准化尺寸**: 强制所有图标使用 `1em` 作为基准尺寸
- ⚖️ **对齐基准线**: 统一 `vertical-align` 和 `line-height` 设置
- 🔧 **智能适配**: 自动处理不同图标库的特殊情况

### 尺寸一致性测试
```vue
<!-- 相同 size 值，确保视觉大小一致 -->
<SvgIcon name="ele-Search" :size="24" />     <!-- Element Plus -->
<SvgIcon name="mdi:home" :size="24" />       <!-- Iconify -->
<SvgIcon name="fa-user" :size="24" />        <!-- FontAwesome -->
<SvgIcon name="icon-search1" :size="24" />   <!-- Iconfont -->
```

## 使用示例

### 基础用法
```vue
<template>
  <div>
    <!-- 自动识别图标类型 -->
    <SvgIcon name="ele-Search" />
    <SvgIcon name="mdi:home" />
    <SvgIcon name="fa-user" />
    <SvgIcon name="iconfont icon-xinzeng" />
  </div>
</template>
```

### 自定义样式
```vue
<template>
  <div>
    <!-- 自定义颜色和大小 -->
    <SvgIcon name="ele-Search" color="#409EFF" size="24" />
    <SvgIcon name="mdi:home" :size="32" color="red" />
    
    <!-- 使用 CSS 类名 -->
    <SvgIcon name="fa-heart" className="my-icon" />
  </div>
</template>

<style scoped>
.my-icon {
  color: #ff6b6b;
  font-size: 20px;
  transition: color 0.3s;
}
.my-icon:hover {
  color: #ff5252;
}
</style>
```

### 指定图标类型
```vue
<template>
  <div>
    <!-- 强制指定图标类型（跳过自动识别） -->
    <SvgIcon name="Search" type="element" />
    <SvgIcon name="home" type="iconify" />
    <SvgIcon name="user" type="font" />
  </div>
</template>
```

### 兼容旧版本
```vue
<template>
  <div>
    <!-- 同时支持 name 和 icon 属性 -->
    <SvgIcon icon="ele-Search" />  <!-- 旧版本写法 -->
    <SvgIcon name="ele-Search" />  <!-- 新版本写法 -->
  </div>
</template>
```

## 迁移指南

### 从旧版本升级
1. **保持兼容**: 现有的 `icon` 属性仍然有效
2. **推荐使用**: 新项目建议使用 `name` 属性
3. **自动识别**: 大部分情况下无需指定 `type` 属性

### 常见图标前缀对照

| 图标库 | 前缀/格式 | 示例 |
|--------|-----------|------|
| Element Plus | `ele-` | `ele-Search`, `ele-User` |
| Iconify | `集合:名称` | `mdi:home`, `heroicons:user` |
| FontAwesome | `fa-`, `fas`, `far` 等 | `fa-home`, `fas fa-user` |
| Iconfont | `iconfont`, `icon-` | `iconfont icon-search`, `icon-xinzeng` |
| SVG Sprite | `#`, `icon-` | `#icon-custom`, `icon-custom` |

## 注意事项

1. **依赖安装**: 确保项目已安装对应的图标库依赖
2. **CSS 引入**: FontAwesome 等字体图标需要引入对应的 CSS 文件
3. **SVG Sprite**: 需要预先加载 SVG sprite 文件
4. **性能**: Iconify 图标会按需加载，首次使用时可能有轻微延迟
5. **尺寸统一**: 组件已优化，确保不同图标库在相同 `size` 值下显示大小一致
6. **基准线对齐**: 所有图标都会与文字基准线正确对齐

## 开发建议

1. **优先使用 Iconify**: 提供最丰富的图标资源
2. **Element Plus**: 与 Element Plus 组件风格保持一致
3. **统一前缀**: 项目中尽量使用统一的图标库，避免混用
4. **按需加载**: 利用组件的自动识别功能，无需手动指定类型
5. **尺寸一致**: 使用相同的 `size` 值能确保不同图标库显示大小一致
6. **测试验证**: 可使用 `test.vue` 或 `demo.vue` 验证图标显示效果