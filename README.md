# Tempsyche

偏艺术表达的个人网站，基于 React + Vite 构建，保留了现有的视觉语言、动效和文案结构，同时把页面内容、页面 section 和重型交互逻辑拆开，方便后续继续扩展。

在线地址: [https://tempsyche.top](https://tempsyche.top)

## 技术栈

- React 19
- TypeScript
- Vite 7
- GSAP
- Three.js
- Leaflet
- Lenis

## 本地运行

```bash
npm install
npm run dev
```

常用命令:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## 现在的项目结构

```text
src/
  assets/        字体与图片资源
  components/    可复用基础组件
  content/       页面文案、图片引用、段落配置
  hooks/         重型动效与交互逻辑
  sections/      页面级区块组件
  App.tsx        页面装配入口
```

### 目录职责

- `src/content/siteContent.ts`
  集中管理页面文本、图片资源和 section 数据。以后新增或替换内容，优先从这里入手。
- `src/sections/`
  每个页面区块单独成文件，例如首屏、地图、排版叠层、关于我、跑马灯、regarding 区域。
- `src/hooks/useRubiksCubeReveal.ts`
  专门处理首页 Rubik's Cube 的 Three.js + GSAP 生命周期。
- `src/hooks/useRegardingHover.ts`
  统一处理三个 regarding 区域的 hover 左右切换逻辑。
- `src/components/`
  放可复用组件，例如 `SplitText`、`ScrollStack`、`MapComponent`、`CircularText`。

## 如何继续加内容

### 1. 修改现有文案或图片

直接编辑 [src/content/siteContent.ts](/C:/Users/bb287/WebstormProjects/Tempsyche-top/src/content/siteContent.ts)。

这里已经集中放了:

- 固定角标文案
- 首屏标题与图片
- Scroll Stack 卡片文字
- Typography Overlay 文案
- About Me 内容
- Marquee 文案
- 三个 Regarding 模块的中英文内容和图片

### 2. 新增一个新的页面区块

推荐流程:

1. 在 `src/sections/` 下新建一个 section 组件。
2. 如果这个区块有独立内容，先放到 `src/content/siteContent.ts`。
3. 如果这个区块有复杂交互或动效，单独抽到 `src/hooks/`。
4. 最后在 [src/App.tsx](/C:/Users/bb287/WebstormProjects/Tempsyche-top/src/App.tsx) 里按顺序挂载。

### 3. 新增一个 Regarding 模块

只需要在 [src/content/siteContent.ts](/C:/Users/bb287/WebstormProjects/Tempsyche-top/src/content/siteContent.ts) 的 `regardingSections` 数组里追加一项:

- `id`
- `englishTitle`
- `englishBody`
- `chineseTitle`
- `chineseBody`
- `image`
- `reverse` 可选

页面会自动按同样结构渲染，不需要再复制一整段 JSX。

## 这次重构做了什么

- 把原本非常庞大的 `App.tsx` 拆成“内容层 + section 层 + hook 层”
- 保留原有 class 名和页面输出结构，尽量不影响现有样式
- 把三段 regarding 内容改为数据驱动渲染，降低重复代码
- 把首页魔方 reveal 动效抽为独立 hook，减少入口文件复杂度
- 清理了一些现有 lint 问题，便于后续维护

## 维护建议

- 内容新增优先走 `content`
- 结构新增优先走 `sections`
- 复杂逻辑优先走 `hooks`
- `App.tsx` 尽量只保留页面组装，不再塞入大段业务或动效实现

这样做的好处是，后面无论你要继续加作品、加自述、加新的艺术实验页面模块，都会比现在更轻松。
