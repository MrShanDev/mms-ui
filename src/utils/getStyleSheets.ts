import { nextTick } from 'vue';
import * as svg from '@element-plus/icons-vue';

// 获取阿里字体图标
const getAlicdnIconfont = () => {
  return new Promise((resolve, reject) => {
    nextTick(() => {
      const styles: any = document.styleSheets;
      let sheetsList = [];
      let sheetsIconList = [];
      for (let i = 0; i < styles.length; i++) {
        if (styles[i].href && styles[i].href.indexOf('at.alicdn.com') > -1) {
          sheetsList.push(styles[i]);
        }
      }
      for (let i = 0; i < sheetsList.length; i++) {
        for (let j = 0; j < sheetsList[i].cssRules.length; j++) {
          if (
            sheetsList[i].cssRules[j].selectorText &&
            sheetsList[i].cssRules[j].selectorText.indexOf('.icon-') > -1
          ) {
            sheetsIconList.push(
              `${sheetsList[i].cssRules[j].selectorText.substring(1, sheetsList[i].cssRules[j].selectorText.length).replace(/\:\:before/gi, '')}`
            );
          }
        }
      }
      if (sheetsIconList.length > 0) resolve(sheetsIconList);
      else reject('未获取到值，请刷新重试');
    });
  });
};

// 初始化获取 css 样式，获取 element plus 自带 svg 图标，增加了 ele- 前缀，使用时：ele-Aim
const getElementPlusIconfont = () => {
  return new Promise((resolve, reject) => {
    nextTick(() => {
      const icons = svg as any;
      const sheetsIconList = [];
      for (const i in icons) {
        sheetsIconList.push(`ele-${icons[i].name}`);
      }
      if (sheetsIconList.length > 0) resolve(sheetsIconList);
      else reject('未获取到值，请刷新重试');
    });
  });
};

// 初始化获取 css 样式，这里使用 fontawesome 的图标
const getAwesomeIconfont = () => {
  return new Promise((resolve, reject) => {
    nextTick(() => {
      const styles: any = document.styleSheets;
      let sheetsList: any[] = [];
      let sheetsIconList: string[] = [];
      
      // 扩展 CDN 域名匹配，支持多种 FontAwesome CDN
      const fontAwesomeDomains = [
        'netdna.bootstrapcdn.com',
        'cdnjs.cloudflare.com', 
        'cdn.jsdelivr.net',
        'maxcdn.bootstrapcdn.com',
        'use.fontawesome.com'
      ];
      
      for (let i = 0; i < styles.length; i++) {
        if (styles[i].href) {
          // 检查是否为 FontAwesome 相关的样式表
          const isFontAwesomeSheet = fontAwesomeDomains.some(domain => 
            styles[i].href.indexOf(domain) > -1
          ) || styles[i].href.indexOf('font-awesome') > -1;
          
          if (isFontAwesomeSheet) {
            sheetsList.push(styles[i]);
          }
        }
      }
      
      // 如果没有找到外部样式表，尝试从所有样式表中查找 FontAwesome 规则
      if (sheetsList.length === 0) {
        for (let i = 0; i < styles.length; i++) {
          try {
            if (styles[i].cssRules) {
              for (let j = 0; j < styles[i].cssRules.length; j++) {
                const rule = styles[i].cssRules[j];
                if (rule.selectorText && rule.selectorText.indexOf('.fa-') === 0) {
                  sheetsList.push(styles[i]);
                  break;
                }
              }
            }
          } catch (e) {
            // 跨域访问限制，忽略此样式表
            console.debug('无法访问样式表规则（可能的跨域限制）:', styles[i].href);
          }
        }
      }
      
      // 解析图标类名
      for (let i = 0; i < sheetsList.length; i++) {
        try {
          if (sheetsList[i].cssRules) {
            for (let j = 0; j < sheetsList[i].cssRules.length; j++) {
              const rule = sheetsList[i].cssRules[j];
              if (
                rule.selectorText &&
                rule.selectorText.indexOf('.fa-') === 0 &&
                rule.selectorText.indexOf(',') === -1
              ) {
                if (/::before/.test(rule.selectorText)) {
                  const iconName = rule.selectorText
                    .substring(1, rule.selectorText.length)
                    .replace(/\:\:before/gi, '');
                  
                  if (iconName && !sheetsIconList.includes(iconName)) {
                    sheetsIconList.push(iconName);
                  }
                }
              }
            }
          }
        } catch (e) {
          console.debug('解析样式表规则时出错:', e);
        }
      }
      
      // 如果仍然没有找到图标，提供一些常用的 FontAwesome 图标作为备选
      if (sheetsIconList.length === 0) {
        console.warn('未能从样式表中获取 FontAwesome 图标，使用预定义图标列表');
        sheetsIconList = [
          'fa-home', 'fa-user', 'fa-star', 'fa-heart', 'fa-search', 'fa-cog',
          'fa-edit', 'fa-trash', 'fa-plus', 'fa-minus', 'fa-check', 'fa-times',
          'fa-arrow-left', 'fa-arrow-right', 'fa-arrow-up', 'fa-arrow-down',
          'fa-envelope', 'fa-phone', 'fa-calendar', 'fa-clock-o', 'fa-file',
          'fa-folder', 'fa-download', 'fa-upload', 'fa-share', 'fa-print'
        ];
      }
      
      if (sheetsIconList.length > 0) {
        resolve(sheetsIconList.reverse());
      } else {
        reject('未获取到 FontAwesome 图标，请确保已正确引入 FontAwesome 样式文件');
      }
    });
  });
};

/**
 * 获取字体图标 `document.styleSheets`
 * @method ali 获取阿里字体图标 `<i class="iconfont 图标类名"></i>`
 * @method ele 获取 element plus 自带图标 `<i class="图标类名"></i>`
 * @method ali 获取 fontawesome 的图标 `<i class="fa 图标类名"></i>`
 */
const initIconfont = {
  // iconfont
  ali: () => {
    return getAlicdnIconfont();
  },
  // element plus
  ele: () => {
    return getElementPlusIconfont();
  },
  // fontawesome
  awe: () => {
    return getAwesomeIconfont();
  },
};

// 导出方法
export default initIconfont;
