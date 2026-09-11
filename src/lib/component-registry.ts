/**
 * 部件库注册表 —— 基于 `架构/部件登记.txt` 整理,核对过真实文件路径后生成。
 *
 * 用途:未来做"组件库 / 自由布局"功能时,直接从这里按 id 或分类查找可用部件,
 * 不用每次都去翻源码目录。
 *
 * 四个分类,可靠程度不同,使用前请注意 `verified` 字段:
 * - primitive:  MUI 官方基础元件(按钮、输入框等),不是 Aurora 自己的文件,没有单独的 importPath
 * - base:       `src/components/base/*` 下的独立复用组件 —— 已逐个核对路径,可直接 import
 * - common:     `src/components/common/*` 下的跨模块公共组件 —— 已逐个核对路径,可直接 import
 * - section:    `src/components/sections/*` 下按业务模块分类的内容区块 —— 目前只核对到"文件夹"这一层,
 *               文件夹内部往往还有多个文件,还没有拆到具体文件,使用前需要再打开对应文件夹确认
 */

import { sectionFileRegistry } from './component-registry.sections.generated';

export type ComponentCategory = 'primitive' | 'base' | 'common' | 'section';

export interface ComponentRegistryEntry {
  id: string;
  name: string;
  category: ComponentCategory;
  /** 真实可 import 的路径(不含 src/ 前缀,和项目内其他 import 写法保持一致);primitive 类没有单独文件,留空 */
  importPath?: string;
  description: string;
  /** 用户可以直接交互(点击/输入/拖拽等),而不是纯展示 */
  interactive: boolean;
  /** 本身是图标、图表或其他可视化内容 */
  visual: boolean;
  /** 这一条目下面还包含多个子文件/子组件,不是单一原子部件 */
  hasChildren: boolean;
  /** 路径是否已经对照真实代码核实过 */
  verified: boolean;
}

// ---------- A 系列:MUI 基础元件词汇表(63 项,无单独文件,primitive) ----------
const primitiveEntries: ComponentRegistryEntry[] = [
  { id: 'A1001', name: '自动完成', description: '输入框内输入时从候选列表中筛选并选择一个结果', interactive: true, visual: false, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1002', name: '按钮', description: '点击后触发一个动作的最基础可点击元素', interactive: true, visual: false, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1003', name: '按钮组', description: '多个按钮并排组合、外观统一的一组按钮', interactive: true, visual: false, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1004', name: '复选框', description: '可勾选、支持多选的方框状选项', interactive: true, visual: false, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1005', name: '悬浮操作按钮', description: '悬浮在页面角落的圆形主操作按钮', interactive: true, visual: false, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1006', name: '单选框', description: '一组里只能选一个的圆形选项', interactive: true, visual: false, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1007', name: '评分', description: '点击星星等图标表示打分的控件', interactive: true, visual: true, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1008', name: '下拉选择', description: '点击后展开选项列表、选一项的输入控件', interactive: true, visual: false, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1009', name: '滑块', description: '拖动滑杆选择一个数值或区间', interactive: true, visual: false, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1010', name: '开关', description: '左右切换表示开/关两种状态的控件', interactive: true, visual: false, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1011', name: '文本输入框', description: '输入一行或多行文字的基础输入框', interactive: true, visual: false, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1012', name: '穿梭选择列表', description: '左右两个列表间来回移动条目完成多选', interactive: true, visual: false, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1013', name: '切换按钮', description: '点击后在按下/弹起两种状态间切换的按钮', interactive: true, visual: false, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1014', name: '头像', description: '圆形或方形展示用户头像/首字母的小图标', interactive: false, visual: true, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1015', name: '标记', description: '叠加在图标或头像角上的小红点/数字提示', interactive: false, visual: true, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1016', name: '标签', description: '小方块状展示状态或分类的文字标记', interactive: false, visual: false, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1017', name: '分隔线', description: '用来分隔内容区块的一条横线或竖线', interactive: false, visual: false, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1018', name: '列表', description: '纵向排列的一组条目', interactive: false, visual: false, hasChildren: true, verified: false, category: 'primitive' },
  { id: 'A1019', name: '表格', description: '按行列展示结构化数据的表格', interactive: false, visual: false, hasChildren: true, verified: false, category: 'primitive' },
  { id: 'A1020', name: '提示', description: '鼠标悬停时弹出的简短文字说明', interactive: false, visual: false, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1021', name: '文字排版', description: '统一字号字重的标题、正文等文字样式', interactive: false, visual: false, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1022', name: '警告', description: '顶部或行内展示提醒/成功/错误信息的色块条', interactive: false, visual: false, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1023', name: '遮罩', description: '盖在内容上表示加载中或不可操作的半透明层', interactive: false, visual: false, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1024', name: '对话框', description: '弹出在页面中央、需要用户处理才能关闭的弹窗', interactive: true, visual: false, hasChildren: true, verified: false, category: 'primitive' },
  { id: 'A1025', name: '进度', description: '展示任务完成百分比的条形或圆形指示器', interactive: false, visual: true, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1026', name: '骨架加载', description: '内容加载完成前的灰色占位形状', interactive: false, visual: false, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1027', name: '消息提示条', description: '页面角落短暂弹出又自动消失的提示条', interactive: false, visual: false, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1028', name: '底部导航', description: '屏幕底部固定的一排导航按钮', interactive: true, visual: false, hasChildren: true, verified: false, category: 'primitive' },
  { id: 'A1029', name: '面包屑', description: '展示当前页面所在层级路径的一行链接', interactive: true, visual: false, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1030', name: '抽屉菜单', description: '从屏幕边缘滑出的菜单面板', interactive: true, visual: false, hasChildren: true, verified: false, category: 'primitive' },
  { id: 'A1031', name: '链接', description: '点击可跳转到其他页面或位置的文字', interactive: true, visual: false, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1032', name: '菜单', description: '点击后弹出的一列可选操作', interactive: true, visual: false, hasChildren: true, verified: false, category: 'primitive' },
  { id: 'A1033', name: '分页', description: '把长列表拆成多页并提供翻页按钮', interactive: true, visual: false, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1034', name: '快速操作按钮', description: '点击展开一组常用操作的按钮', interactive: true, visual: false, hasChildren: true, verified: false, category: 'primitive' },
  { id: 'A1035', name: '步骤条', description: '横向展示多步骤流程当前进度的条状指示器', interactive: false, visual: false, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1036', name: '标签页', description: '顶部一排可切换的选项卡', interactive: true, visual: false, hasChildren: true, verified: false, category: 'primitive' },
  { id: 'A1037', name: 'Box', description: '最基础的通用容器盒子', interactive: false, visual: false, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1038', name: 'Container', description: '限制内容最大宽度并居中的容器', interactive: false, visual: false, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1039', name: 'Grid', description: '按行列栅格排列子元素的布局容器', interactive: false, visual: false, hasChildren: true, verified: false, category: 'primitive' },
  { id: 'A1040', name: 'Stack', description: '让子元素按顺序纵向或横向排列的容器', interactive: false, visual: false, hasChildren: true, verified: false, category: 'primitive' },
  { id: 'A1041', name: '图片列表', description: '网格状排列一组图片的展示区', interactive: false, visual: true, hasChildren: true, verified: false, category: 'primitive' },
  { id: 'A1042', name: '折叠面板', description: '点击标题展开/收起内容的面板', interactive: true, visual: false, hasChildren: true, verified: false, category: 'primitive' },
  { id: 'A1043', name: '顶栏', description: '页面顶部固定的横条,通常放标题和操作按钮', interactive: false, visual: false, hasChildren: true, verified: false, category: 'primitive' },
  { id: 'A1044', name: '卡片', description: '带阴影和圆角、包裹一块内容的容器', interactive: false, visual: false, hasChildren: true, verified: false, category: 'primitive' },
  { id: 'A1045', name: 'Paper', description: '带轻微阴影的基础纸片状容器', interactive: false, visual: false, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1046', name: 'Modal', description: '遮住背景、居中弹出的弹层容器', interactive: true, visual: false, hasChildren: true, verified: false, category: 'primitive' },
  { id: 'A1047', name: 'Popover', description: '从某个元素旁边弹出的浮层', interactive: true, visual: false, hasChildren: true, verified: false, category: 'primitive' },
  { id: 'A1048', name: 'Popper', description: '跟随目标元素定位的浮层容器', interactive: false, visual: false, hasChildren: true, verified: false, category: 'primitive' },
  { id: 'A1049', name: '时间线', description: '纵向排列一系列带时间点的事件', interactive: false, visual: false, hasChildren: true, verified: false, category: 'primitive' },
  { id: 'A1050', name: '数据表格', description: '支持排序筛选分页的高级表格组件', interactive: true, visual: false, hasChildren: true, verified: false, category: 'primitive' },
  { id: 'A1051', name: '日期时间选择器', description: '点击弹出日历/时钟选择日期和时间', interactive: true, visual: false, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1052', name: '日期范围选择器', description: '同时选择起止两个日期的选择器', interactive: true, visual: false, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1053', name: '高级数据表', description: '支持复杂交互(分组、导出等)的数据表', interactive: true, visual: false, hasChildren: true, verified: false, category: 'primitive' },
  { id: 'A1054', name: 'ECharts 图表', description: '折线/柱状/饼图等数据可视化图表', interactive: true, visual: true, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1055', name: '富文本编辑器', description: '支持加粗、插图等排版的文字编辑区', interactive: true, visual: false, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1056', name: '图标', description: '统一风格的矢量小图标', interactive: false, visual: true, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1057', name: '滚动条', description: '美化过的自定义滚动条样式', interactive: false, visual: false, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1058', name: 'Swiper 轮播', description: '左右滑动切换的图片/内容轮播区', interactive: true, visual: true, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1059', name: '文件上传', description: '拖拽或点击选择文件进行上传的区域', interactive: true, visual: false, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1060', name: '图片灯箱', description: '点击图片后全屏放大查看的浮层', interactive: true, visual: true, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1061', name: '表情选择器', description: '点击弹出一格格表情供选择插入', interactive: true, visual: true, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1062', name: '可调整大小区域', description: '可拖拽边缘改变宽高的区块', interactive: true, visual: false, hasChildren: false, verified: false, category: 'primitive' },
  { id: 'A1063', name: '组织架构图', description: '树状展示公司/团队层级关系的图', interactive: false, visual: true, hasChildren: false, verified: false, category: 'primitive' },
];

// ---------- B 系列:components/base/* 真实文件,已逐个核对路径 ----------
const baseEntries: ComponentRegistryEntry[] = [
  { id: 'B2001', name: 'AnchorLinkContainer', importPath: 'components/base/AnchorLinkContainer', description: '点击后平滑滚动到页面内某个锚点位置的容器', interactive: true, visual: false, hasChildren: false, verified: true, category: 'base' },
  { id: 'B2002', name: 'Attachment', importPath: 'components/base/Attachment', description: '展示一个附件文件的图标和文件名', interactive: false, visual: false, hasChildren: false, verified: true, category: 'base' },
  { id: 'B2003', name: 'AudioPlayer', importPath: 'components/base/AudioPlayer', description: '带播放/暂停/进度条的音频播放器', interactive: true, visual: false, hasChildren: false, verified: true, category: 'base' },
  { id: 'B2004', name: 'AvatarDropBox', importPath: 'components/base/AvatarDropBox', description: '点击或拖拽上传头像图片的方框', interactive: true, visual: true, hasChildren: false, verified: true, category: 'base' },
  { id: 'B2005', name: 'Code', importPath: 'components/base/Code', description: '带语法高亮的代码展示块', interactive: false, visual: false, hasChildren: false, verified: true, category: 'base' },
  { id: 'B2006', name: 'color-picker', importPath: 'components/base/color-picker', description: '点击弹出调色板选择颜色的控件', interactive: true, visual: true, hasChildren: true, verified: true, category: 'base' },
  { id: 'B2007', name: 'DateRangePicker', importPath: 'components/base/DateRangePicker', description: '选择一个起止日期区间的日历控件', interactive: true, visual: false, hasChildren: false, verified: true, category: 'base' },
  { id: 'B2008', name: 'Editor', importPath: 'components/base/Editor', description: '所见即所得的富文本编辑区', interactive: true, visual: false, hasChildren: false, verified: true, category: 'base' },
  { id: 'B2009', name: 'EmojiPicker', importPath: 'components/base/EmojiPicker', description: '弹出表情网格供选择插入的面板', interactive: true, visual: true, hasChildren: false, verified: true, category: 'base' },
  { id: 'B2010', name: 'FileDropBox', importPath: 'components/base/FileDropBox', description: '支持拖拽文件到框内上传的区域', interactive: true, visual: false, hasChildren: false, verified: true, category: 'base' },
  { id: 'B2011', name: 'FileDropZone', importPath: 'components/base/FileDropZone', description: '整块可拖拽释放文件进行上传的区域', interactive: true, visual: false, hasChildren: false, verified: true, category: 'base' },
  { id: 'B2012', name: 'FullCalendar', importPath: 'components/base/FullCalendar', description: '月/周/日视图切换的完整日历', interactive: true, visual: true, hasChildren: false, verified: true, category: 'base' },
  { id: 'B2013', name: 'IconifyIcon', importPath: 'components/base/IconifyIcon', description: '按名称加载显示矢量图标', interactive: false, visual: true, hasChildren: false, verified: true, category: 'base' },
  { id: 'B2014', name: 'Image', importPath: 'components/base/Image', description: '带加载占位和错误兜底的图片展示组件', interactive: false, visual: true, hasChildren: false, verified: true, category: 'base' },
  { id: 'B2015', name: 'Lightbox', importPath: 'components/base/Lightbox', description: '点击图片后全屏弹出查看大图的浮层', interactive: true, visual: true, hasChildren: false, verified: true, category: 'base' },
  { id: 'B2016', name: 'Mapbox', importPath: 'components/base/Mapbox', description: '展示可缩放拖动地图并标点的组件', interactive: true, visual: true, hasChildren: false, verified: true, category: 'base' },
  { id: 'B2017', name: 'MuiIcon', importPath: 'components/base/MuiIcon', description: '使用 MUI 内置图标集展示的图标', interactive: false, visual: true, hasChildren: false, verified: true, category: 'base' },
  { id: 'B2018', name: 'NestedThemeProvider', importPath: 'components/base/NestedThemeProvider', description: '为局部区域单独套用一套主题样式的容器', interactive: false, visual: false, hasChildren: false, verified: true, category: 'base' },
  { id: 'B2019', name: 'NumberTextField', importPath: 'components/base/NumberTextField', description: '只能输入数字、可设步进的输入框', interactive: true, visual: false, hasChildren: false, verified: true, category: 'base' },
  { id: 'B2020', name: 'OrganizationalChart', importPath: 'components/base/OrganizationalChart', description: '树状展示上下级关系的组织架构图', interactive: false, visual: true, hasChildren: false, verified: true, category: 'base' },
  { id: 'B2021', name: 'PhoneTextfield', importPath: 'components/base/PhoneTextfield', description: '带国家区号选择的电话号码输入框', interactive: true, visual: false, hasChildren: false, verified: true, category: 'base' },
  { id: 'B2022', name: 'ReactEchart', importPath: 'components/base/ReactEchart', description: '封装好的 ECharts 图表容器(本项目所有图表最终都走这个)', interactive: true, visual: true, hasChildren: false, verified: true, category: 'base' },
  { id: 'B2023', name: 'Resizable', importPath: 'components/base/Resizable', description: '可拖动边角改变自身大小的区块', interactive: true, visual: false, hasChildren: false, verified: true, category: 'base' },
  { id: 'B2024', name: 'SimpleBar', importPath: 'components/base/SimpleBar', description: '自定义样式的滚动容器', interactive: false, visual: false, hasChildren: false, verified: true, category: 'base' },
  { id: 'B2025', name: 'SortableDnd', importPath: 'components/base/SortableDnd', description: '可通过拖拽调整条目先后顺序的列表(dnd-kit 封装,一维排序)', interactive: true, visual: false, hasChildren: false, verified: true, category: 'base' },
  { id: 'B2026', name: 'StatusAvatar', importPath: 'components/base/StatusAvatar', description: '头像右下角带在线/离线等状态小圆点', interactive: false, visual: true, hasChildren: false, verified: true, category: 'base' },
  { id: 'B2027', name: 'SvelteGanttChart', importPath: 'components/base/SvelteGanttChart', description: '展示项目任务时间排期的甘特图', interactive: true, visual: true, hasChildren: false, verified: true, category: 'base' },
  { id: 'B2028', name: 'Swiper', importPath: 'components/base/Swiper', description: '左右滑动切换内容的轮播区', interactive: true, visual: true, hasChildren: false, verified: true, category: 'base' },
  { id: 'B2029', name: 'Video', importPath: 'components/base/Video', description: '带播放控制条的视频播放器', interactive: true, visual: true, hasChildren: false, verified: true, category: 'base' },
];

// ---------- C 系列:components/common/* 真实文件,已逐个核对路径 ----------
const commonEntries: ComponentRegistryEntry[] = [
  { id: 'C3001', name: 'CardHeaderAction', importPath: 'components/common/CardHeaderAction', description: '卡片标题栏右侧的操作按钮区', interactive: true, visual: false, hasChildren: false, verified: true, category: 'common' },
  { id: 'C3002', name: 'ChartLegend', importPath: 'components/common/ChartLegend', description: '图表下方展示各数据系列颜色和名称的图例', interactive: false, visual: true, hasChildren: false, verified: true, category: 'common' },
  { id: 'C3003', name: 'CodeBlock', importPath: 'components/common/CodeBlock', description: '展示一段代码并可一键复制的区块', interactive: true, visual: false, hasChildren: false, verified: true, category: 'common' },
  { id: 'C3004', name: 'CountrySelect', importPath: 'components/common/CountrySelect', description: '带国旗图标的国家/地区下拉选择框', interactive: true, visual: true, hasChildren: false, verified: true, category: 'common' },
  { id: 'C3005', name: 'CustomColumnMenu', importPath: 'components/common/CustomColumnMenu', description: '表格列标题上点击弹出的列设置菜单', interactive: true, visual: false, hasChildren: false, verified: true, category: 'common' },
  { id: 'C3006', name: 'CustomPagination', importPath: 'components/common/CustomPagination', description: '统一样式的表格翻页控件', interactive: true, visual: false, hasChildren: false, verified: true, category: 'common' },
  { id: 'C3007', name: 'DashboardMenu', importPath: 'components/common/DashboardMenu', description: '仪表盘卡片右上角的三点操作菜单', interactive: true, visual: false, hasChildren: false, verified: true, category: 'common' },
  { id: 'C3008', name: 'DashboardSelectMenu', importPath: 'components/common/DashboardSelectMenu', description: '仪表盘卡片上用于切换时间范围等的下拉菜单', interactive: true, visual: false, hasChildren: false, verified: true, category: 'common' },
  { id: 'C3009', name: 'DataGridSelectionBar', importPath: 'components/common/DataGridSelectionBar', description: '表格勾选多行后出现的批量操作条', interactive: true, visual: false, hasChildren: false, verified: true, category: 'common' },
  { id: 'C3010', name: 'FilePreview', importPath: 'components/common/FilePreview', description: '展示已上传文件缩略图和名称的条目', interactive: false, visual: true, hasChildren: false, verified: true, category: 'common' },
  { id: 'C3011', name: 'InlineMediaPreview', importPath: 'components/common/InlineMediaPreview', description: '在消息或列表中内嵌展示图片/视频缩略图', interactive: false, visual: true, hasChildren: false, verified: true, category: 'common' },
  { id: 'C3012', name: 'InviteDialog', importPath: 'components/common/InviteDialog', description: '输入邮箱邀请他人加入的弹窗', interactive: true, visual: false, hasChildren: false, verified: true, category: 'common' },
  { id: 'C3013', name: 'LiveProvider', importPath: 'components/common/LiveProvider', description: '承载可实时预览效果的代码演练区', interactive: true, visual: false, hasChildren: false, verified: true, category: 'common' },
  { id: 'C3014', name: 'Logo', importPath: 'components/common/Logo', description: '系统左上角展示的品牌图标和文字', interactive: false, visual: true, hasChildren: false, verified: true, category: 'common' },
  { id: 'C3015', name: 'MemberProfilePopper', importPath: 'components/common/MemberProfilePopper', description: '点击成员头像弹出的简要资料浮层', interactive: true, visual: false, hasChildren: false, verified: true, category: 'common' },
  { id: 'C3016', name: 'NumberField', importPath: 'components/common/NumberField', description: '带加减按钮的数字输入框', interactive: true, visual: false, hasChildren: false, verified: true, category: 'common' },
  { id: 'C3017', name: 'PasswordTextField', importPath: 'components/common/PasswordTextField', description: '带显示/隐藏切换按钮的密码输入框', interactive: true, visual: false, hasChildren: false, verified: true, category: 'common' },
  { id: 'C3018', name: 'PhoneInput', importPath: 'components/common/PhoneInput', description: '带区号选择的电话号码输入框', interactive: true, visual: false, hasChildren: false, verified: true, category: 'common' },
  { id: 'C3019', name: 'SearchTextField', importPath: 'components/common/SearchTextField', description: '带放大镜图标的搜索输入框', interactive: true, visual: false, hasChildren: false, verified: true, category: 'common' },
  { id: 'C3020', name: 'SectionHeader', importPath: 'components/common/SectionHeader', description: '页面区块顶部的标题加描述行', interactive: false, visual: false, hasChildren: false, verified: true, category: 'common' },
  { id: 'C3021', name: 'SliderInput', importPath: 'components/common/SliderInput', description: '带数值显示的拖动滑杆', interactive: true, visual: false, hasChildren: false, verified: true, category: 'common' },
  { id: 'C3022', name: 'VibrantBackground', importPath: 'components/common/VibrantBackground', description: '带渐变色彩的装饰性背景块', interactive: false, visual: true, hasChildren: false, verified: true, category: 'common' },
  { id: 'C3023', name: 'VirtualizedListbox', importPath: 'components/common/VirtualizedListbox', description: '只渲染可视区域条目、支持超长列表的下拉选项框', interactive: true, visual: false, hasChildren: false, verified: true, category: 'common' },
];

// ---------- D 系列:components/sections/* 下按业务模块分的文件夹,未拆到具体文件 ----------
// 路径按模块中文名对应的真实英文文件夹名拼出,还没有逐个打开确认里面的文件列表。
const sectionEntries: ComponentRegistryEntry[] = [
  { id: 'D4001', name: 'accessibility', importPath: 'components/sections/account/accessibility', description: '账户设置模块下的「accessibility」区块', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4002', name: 'audio-video', importPath: 'components/sections/account/audio-video', description: '账户设置模块下的「audio-video」区块', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4003', name: 'chat-preferences', importPath: 'components/sections/account/chat-preferences', description: '账户设置模块下的「chat-preferences」区块', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4004', name: 'common', importPath: 'components/sections/account/common', description: '账户设置模块下的公共子组件', interactive: false, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4005', name: 'credit-card', importPath: 'components/sections/account/credit-card', description: '账户设置模块下的「credit-card」区块', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4006', name: 'date-time', importPath: 'components/sections/account/date-time', description: '账户设置模块下的「date-time」区块', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4007', name: 'language-region', importPath: 'components/sections/account/language-region', description: '账户设置模块下的「language-region」区块', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4008', name: 'notification-alerts', importPath: 'components/sections/account/notification-alerts', description: '账户设置模块下的「notification-alerts」区块', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4009', name: 'personal-info', importPath: 'components/sections/account/personal-info', description: '账户设置模块下的「personal-info」区块', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4010', name: 'privacy-protection', importPath: 'components/sections/account/privacy-protection', description: '账户设置模块下的「privacy-protection」区块', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4011', name: 'shipping-billing-address', importPath: 'components/sections/account/shipping-billing-address', description: '账户设置模块下的「shipping-billing-address」区块', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4012', name: 'storage', importPath: 'components/sections/account/storage', description: '账户设置模块下的「storage」区块', interactive: false, visual: true, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4013', name: 'touch-id', importPath: 'components/sections/account/touch-id', description: '账户设置模块下的「touch-id」区块', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4014', name: 'users-permissions', importPath: 'components/sections/account/users-permissions', description: '账户设置模块下的「users-permissions」区块', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4015', name: 'work-education', importPath: 'components/sections/account/work-education', description: '账户设置模块下的「work-education」区块', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4016', name: 'SideTabList', importPath: 'components/sections/account/SideTabList', description: '账户设置模块的左侧分类标签列表', interactive: true, visual: false, hasChildren: false, verified: false, category: 'section' },
  { id: 'D4017', name: 'index', importPath: 'components/sections/account', description: '账户设置模块的整体入口', interactive: false, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4018', name: 'common', importPath: 'components/sections/authentications/common', description: '登录认证模块下的公共子组件', interactive: false, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4019', name: 'default', importPath: 'components/sections/authentications/default', description: '登录认证模块下的默认登录/注册表单集合(jwt/firebase/auth0)', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4020', name: 'CheckMailBoxDialog', importPath: 'components/sections/authentications/CheckMailBoxDialog', description: '注册后提示去邮箱确认的弹窗', interactive: true, visual: false, hasChildren: false, verified: false, category: 'section' },
  { id: 'D4021', name: 'CalendarSidebar', importPath: 'components/sections/calendar/CalendarSidebar', description: '日历模块的侧边小日历/筛选栏', interactive: true, visual: false, hasChildren: false, verified: false, category: 'section' },
  { id: 'D4022', name: 'EventDialog', importPath: 'components/sections/calendar/EventDialog', description: '新建/编辑日程的弹窗', interactive: true, visual: false, hasChildren: false, verified: false, category: 'section' },
  { id: 'D4023', name: 'CalendarHeader', importPath: 'components/sections/calendar/CalendarHeader', description: '日历顶部的月份切换/视图切换栏', interactive: true, visual: false, hasChildren: false, verified: false, category: 'section' },
  { id: 'D4024', name: 'CalendarMain', importPath: 'components/sections/calendar/CalendarMain', description: '日历主体月/周/日视图', interactive: true, visual: true, hasChildren: false, verified: false, category: 'section' },
  { id: 'D4025', name: 'CalendarTop', importPath: 'components/sections/calendar/CalendarTop', description: '日历页面最顶部的操作区', interactive: true, visual: false, hasChildren: false, verified: false, category: 'section' },
  { id: 'D4026', name: 'index', importPath: 'components/sections/calendar', description: '日历模块整体入口', interactive: false, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4027', name: 'useCalendarHandlers', importPath: 'components/sections/calendar/useCalendarHandlers', description: '日历模块的交互逻辑 hook(非 UI 组件)', interactive: false, visual: false, hasChildren: false, verified: false, category: 'section' },
  { id: 'D4028', name: 'useEventDialog', importPath: 'components/sections/calendar/useEventDialog', description: '日程弹窗的逻辑 hook(非 UI 组件)', interactive: false, visual: false, hasChildren: false, verified: false, category: 'section' },
  { id: 'D4029', name: 'common', importPath: 'components/sections/chat/common', description: '聊天模块下的公共子组件', interactive: false, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4030', name: 'conversation', importPath: 'components/sections/chat/conversation', description: '聊天模块的会话主界面', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4031', name: 'new', importPath: 'components/sections/chat/new', description: '发起新聊天的界面', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4032', name: 'sidebar', importPath: 'components/sections/chat/sidebar', description: '聊天模块的会话列表侧边栏', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4033', name: 'ChatLayout', importPath: 'components/sections/chat/ChatLayout', description: '聊天模块整体布局壳', interactive: false, visual: false, hasChildren: false, verified: false, category: 'section' },
  { id: 'D4034', name: 'index', importPath: 'components/sections/chat', description: '聊天模块整体入口', interactive: false, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4035', name: 'EcomStatSection', importPath: 'components/sections/common/EcomStatSection', description: '通用的电商类统计卡片区块', interactive: false, visual: true, hasChildren: false, verified: false, category: 'section' },
  { id: 'D4036', name: 'PageBreadcrumb', importPath: 'components/sections/common/PageBreadcrumb', description: '业务页面通用的面包屑导航', interactive: true, visual: false, hasChildren: false, verified: false, category: 'section' },
  { id: 'D4037', name: 'common', importPath: 'components/sections/content/common', description: '内容/博客模块下的公共子组件', interactive: false, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4038', name: 'details', importPath: 'components/sections/content/details', description: '内容详情页(博客/播客/视频)', interactive: false, visual: true, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4039', name: 'homepage', importPath: 'components/sections/content/homepage', description: '内容模块首页', interactive: false, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4040', name: 'search', importPath: 'components/sections/content/search', description: '内容搜索页', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4041', name: 'topics', importPath: 'components/sections/content/topics', description: '内容分类/话题页', interactive: false, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4042', name: 'upload', importPath: 'components/sections/content/upload', description: '内容上传页', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4043', name: 'views', importPath: 'components/sections/content/views', description: '内容各类型内容的展示视图', interactive: false, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4044', name: 'add-contact', importPath: 'components/sections/crm/add-contact', description: 'CRM 新增联系人页面', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4045', name: 'common', importPath: 'components/sections/crm/common', description: 'CRM 模块下的公共子组件', interactive: false, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4046', name: 'deal-details', importPath: 'components/sections/crm/deal-details', description: 'CRM 交易详情页', interactive: false, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4047', name: 'deals', importPath: 'components/sections/crm/deals', description: 'CRM 交易列表页', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4048', name: 'lead-details', importPath: 'components/sections/crm/lead-details', description: 'CRM 线索详情页', interactive: false, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4049', name: 'analytics', importPath: 'components/sections/dashboards/analytics', description: '网站流量分析仪表盘(内含 AnalyticKPI 等已单独核实过的组件)', interactive: false, visual: true, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4050', name: 'crm', importPath: 'components/sections/dashboards/crm', description: 'CRM 仪表盘', interactive: false, visual: true, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4051', name: 'e-commerce', importPath: 'components/sections/dashboards/e-commerce', description: '电商仪表盘(内含已核实过的 MarketShareChart 等组件)', interactive: false, visual: true, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4052', name: 'employee', importPath: 'components/sections/dashboards/employee', description: '员工仪表盘', interactive: false, visual: true, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4053', name: 'hiring', importPath: 'components/sections/dashboards/hiring', description: '招聘仪表盘', interactive: false, visual: true, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4054', name: 'hrm', importPath: 'components/sections/dashboards/hrm', description: '人力资源仪表盘', interactive: false, visual: true, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4055', name: 'project', importPath: 'components/sections/dashboards/project', description: '项目仪表盘', interactive: false, visual: true, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4056', name: 'time-tracker', importPath: 'components/sections/dashboards/time-tracker', description: '时间追踪仪表盘', interactive: false, visual: true, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4057', name: 'admin', importPath: 'components/sections/ecommerce/admin', description: '电商后台管理(商品/订单/退款/发票)', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4058', name: 'customer', importPath: 'components/sections/ecommerce/customer', description: '电商客户端(商品浏览/购物车/结账)', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4059', name: 'common', importPath: 'components/sections/email/common', description: '邮件模块下的公共子组件', interactive: false, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4060', name: 'email-details', importPath: 'components/sections/email/email-details', description: '邮件详情视图', interactive: false, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4061', name: 'email-list', importPath: 'components/sections/email/email-list', description: '邮件列表视图', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4062', name: 'Email', importPath: 'components/sections/email/Email', description: '邮件模块整体壳', interactive: false, visual: false, hasChildren: false, verified: false, category: 'section' },
  { id: 'D4063', name: 'EmailDetails', importPath: 'components/sections/email/EmailDetails', description: '单封邮件详情组件', interactive: false, visual: false, hasChildren: false, verified: false, category: 'section' },
  { id: 'D4064', name: 'Page404', importPath: 'components/sections/error/Page404', description: '404 错误页内容', interactive: false, visual: true, hasChildren: false, verified: false, category: 'section' },
  { id: 'D4065', name: 'create-event', importPath: 'components/sections/events/create-event', description: '创建活动页面', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4066', name: 'event-detail', importPath: 'components/sections/events/event-detail', description: '活动详情页面', interactive: false, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4067', name: 'faq-sidenav', importPath: 'components/sections/faq/faq-sidenav', description: 'FAQ 侧边分类导航', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4068', name: 'FaqDrawer', importPath: 'components/sections/faq/FaqDrawer', description: 'FAQ 移动端抽屉导航', interactive: true, visual: false, hasChildren: false, verified: false, category: 'section' },
  { id: 'D4069', name: 'FaqItems', importPath: 'components/sections/faq/FaqItems', description: 'FAQ 问答条目列表', interactive: true, visual: false, hasChildren: false, verified: false, category: 'section' },
  { id: 'D4070', name: 'FaqPageHeader', importPath: 'components/sections/faq/FaqPageHeader', description: 'FAQ 页面顶部标题区', interactive: false, visual: false, hasChildren: false, verified: false, category: 'section' },
  { id: 'D4071', name: 'index', importPath: 'components/sections/faq', description: 'FAQ 模块整体入口', interactive: false, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4072', name: 'common', importPath: 'components/sections/file-manager/common', description: '文件管理模块下的公共子组件', interactive: false, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4073', name: 'main', importPath: 'components/sections/file-manager/main', description: '文件管理主体文件列表区', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4074', name: 'sidebar', importPath: 'components/sections/file-manager/sidebar', description: '文件管理侧边文件夹树', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4075', name: 'index', importPath: 'components/sections/file-manager', description: '文件管理模块整体入口', interactive: false, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4076', name: 'admin', importPath: 'components/sections/hiring/admin', description: '招聘后台管理(职位/流程/候选人)', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4077', name: 'candidate', importPath: 'components/sections/hiring/candidate', description: '候选人端(职位列表/投递)', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4078', name: 'common', importPath: 'components/sections/hiring/common', description: '招聘模块下的公共子组件', interactive: false, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4079', name: 'payroll', importPath: 'components/sections/hrm/payroll', description: '人力资源工资模块', interactive: true, visual: true, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4080', name: 'performance-management', importPath: 'components/sections/hrm/performance-management', description: '人力资源绩效管理模块', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4081', name: 'create-invoice', importPath: 'components/sections/invoice/create-invoice', description: '创建发票页面', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4082', name: 'invoice-list', importPath: 'components/sections/invoice/invoice-list', description: '发票列表页面', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4083', name: 'invoice-preview', importPath: 'components/sections/invoice/invoice-preview', description: '发票预览页面', interactive: false, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4084', name: 'boards', importPath: 'components/sections/kanban/boards', description: '看板列表页面', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4085', name: 'create-board', importPath: 'components/sections/kanban/create-board', description: '创建看板页面', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4086', name: 'kanban', importPath: 'components/sections/kanban/kanban', description: '看板主体拖拽视图', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4087', name: 'member-list', importPath: 'components/sections/member/member-list', description: '成员列表页面', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4088', name: 'new-member', importPath: 'components/sections/member/new-member', description: '新增成员页面', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4089', name: 'profile', importPath: 'components/sections/member/profile', description: '成员详情/资料页面', interactive: false, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4090', name: 'views', importPath: 'components/sections/member/views', description: '成员模块列表/网格切换视图', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4091', name: 'landing', importPath: 'components/sections/misc/landing', description: '杂项模块下的落地页相关区块', interactive: false, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4092', name: 'NotificationActionMenu', importPath: 'components/sections/notification/NotificationActionMenu', description: '通知条目上的操作菜单', interactive: true, visual: false, hasChildren: false, verified: false, category: 'section' },
  { id: 'D4093', name: 'NotificationList', importPath: 'components/sections/notification/NotificationList', description: '通知列表', interactive: true, visual: false, hasChildren: false, verified: false, category: 'section' },
  { id: 'D4094', name: 'NotificationListItemAvatar', importPath: 'components/sections/notification/NotificationListItemAvatar', description: '通知条目左侧头像', interactive: false, visual: true, hasChildren: false, verified: false, category: 'section' },
  { id: 'D4095', name: 'NotificationTabPanel', importPath: 'components/sections/notification/NotificationTabPanel', description: '通知按类型分类的标签面板', interactive: true, visual: false, hasChildren: false, verified: false, category: 'section' },
  { id: 'D4096', name: 'index', importPath: 'components/sections/notification', description: '通知模块整体入口', interactive: false, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4097', name: 'landing', importPath: 'components/sections/pages/landing', description: '落地页模块(官网风格页面集合)', interactive: false, visual: true, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4098', name: 'column', importPath: 'components/sections/pricing/column', description: '定价方案卡片列布局', interactive: false, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4099', name: 'table', importPath: 'components/sections/pricing/table', description: '定价方案对比表格布局', interactive: false, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4100', name: 'PricingHeader', importPath: 'components/sections/pricing/PricingHeader', description: '定价页顶部标题区', interactive: false, visual: false, hasChildren: false, verified: false, category: 'section' },
  { id: 'D4101', name: 'automation', importPath: 'components/sections/project/automation', description: '项目自动化规则模块', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4102', name: 'common', importPath: 'components/sections/project/common', description: '项目管理模块下的公共子组件(含甘特图相关)', interactive: false, visual: true, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4103', name: 'create-project', importPath: 'components/sections/project/create-project', description: '创建项目页面', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4104', name: 'hooks', importPath: 'components/sections/project/hooks', description: '项目管理模块逻辑 hook 集合(非 UI 组件)', interactive: false, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4105', name: 'pages', importPath: 'components/sections/project/pages', description: '项目管理各页面(甘特图/时间线等)', interactive: true, visual: true, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4106', name: 'project-list', importPath: 'components/sections/project/project-list', description: '项目列表页面', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4107', name: 'table-view', importPath: 'components/sections/project/table-view', description: '项目任务表格视图', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4108', name: 'task-details', importPath: 'components/sections/project/task-details', description: '任务详情面板', interactive: false, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4109', name: 'team-member-list', importPath: 'components/sections/project/team-member-list', description: '项目团队成员列表', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4110', name: 'SchedulePanel', importPath: 'components/sections/scheduler/SchedulePanel', description: '调度器主排班面板', interactive: true, visual: true, hasChildren: false, verified: false, category: 'section' },
  { id: 'D4111', name: 'SchedulerTop', importPath: 'components/sections/scheduler/SchedulerTop', description: '调度器顶部操作栏', interactive: true, visual: false, hasChildren: false, verified: false, category: 'section' },
  { id: 'D4112', name: 'SettingsDrawer', importPath: 'components/sections/scheduler/SettingsDrawer', description: '调度器设置抽屉', interactive: true, visual: false, hasChildren: false, verified: false, category: 'section' },
  { id: 'D4113', name: 'SettingsToggle', importPath: 'components/sections/scheduler/SettingsToggle', description: '调度器设置开关', interactive: true, visual: false, hasChildren: false, verified: false, category: 'section' },
  { id: 'D4114', name: 'index', importPath: 'components/sections/scheduler', description: '调度器模块整体入口', interactive: false, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4115', name: 'common', importPath: 'components/sections/showcase/common', description: '展示页模块下的公共子组件', interactive: false, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4116', name: 'cta', importPath: 'components/sections/showcase/cta', description: '展示页行动号召区块', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4117', name: 'customize-layout', importPath: 'components/sections/showcase/customize-layout', description: '展示页"自定义布局"演示区块', interactive: true, visual: true, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4118', name: 'elegant-cards', importPath: 'components/sections/showcase/elegant-cards', description: '展示页精美卡片展示区块', interactive: false, visual: true, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4119', name: 'hero', importPath: 'components/sections/showcase/hero', description: '展示页顶部主视觉区块', interactive: false, visual: true, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4120', name: 'layout', importPath: 'components/sections/showcase/layout', description: '展示页布局演示区块', interactive: false, visual: true, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4121', name: 'prefixed-layouts', importPath: 'components/sections/showcase/prefixed-layouts', description: '展示页预设布局展示区块', interactive: false, visual: true, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4122', name: 'theme-presets', importPath: 'components/sections/showcase/theme-presets', description: '展示页主题预设展示区块(含配色卡片)', interactive: true, visual: true, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4123', name: 'web-apps', importPath: 'components/sections/showcase/web-apps', description: '展示页应用案例展示区块', interactive: false, visual: true, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4124', name: 'index', importPath: 'components/sections/showcase', description: '展示页模块整体入口', interactive: false, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4125', name: 'profile-section', importPath: 'components/sections/social/profile-section', description: '社交模块个人主页资料区', interactive: false, visual: true, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4126', name: 'tab-panels', importPath: 'components/sections/social/tab-panels', description: '社交模块标签页内容面板', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4127', name: 'SocialTabs', importPath: 'components/sections/social/SocialTabs', description: '社交模块顶部标签切换', interactive: true, visual: false, hasChildren: false, verified: false, category: 'section' },
  { id: 'D4128', name: 'index', importPath: 'components/sections/social', description: '社交模块整体入口', interactive: false, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4129', name: 'index', importPath: 'components/sections/starter', description: '起始页模块(Edit me! 占位模板)', interactive: false, visual: true, hasChildren: false, verified: true, category: 'section' },
  { id: 'D4130', name: 'apps-sites', importPath: 'components/sections/time-tracker/apps-sites', description: '时间追踪 - 应用与网站使用统计', interactive: false, visual: true, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4131', name: 'common', importPath: 'components/sections/time-tracker/common', description: '时间追踪模块下的公共子组件', interactive: false, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4132', name: 'report', importPath: 'components/sections/time-tracker/report', description: '时间追踪报表', interactive: false, visual: true, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4133', name: 'screenshots', importPath: 'components/sections/time-tracker/screenshots', description: '时间追踪屏幕截图记录', interactive: false, visual: true, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4134', name: 'time-sheets', importPath: 'components/sections/time-tracker/time-sheets', description: '时间追踪工时表', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
  { id: 'D4135', name: 'views', importPath: 'components/sections/time-tracker/views', description: '时间追踪模块各类视图切换', interactive: true, visual: false, hasChildren: true, verified: false, category: 'section' },
];

export const componentRegistry: ComponentRegistryEntry[] = [
  ...primitiveEntries,
  ...baseEntries,
  ...commonEntries,
  ...sectionEntries,
];

export const getComponentById = (id: string) => componentRegistry.find((c) => c.id === id);

export const getComponentsByCategory = (category: ComponentCategory) =>
  componentRegistry.filter((c) => c.category === category);

/** 目前可以直接 import 使用、路径已核实过的部件(不含 D 系列文件夹这种"还没拆到文件"的条目) */
export const getVerifiedComponents = () => componentRegistry.filter((c) => c.verified && c.importPath);

// ---------- E 系列:D 系列文件夹的文件级明细,由 scripts/generate-section-registry.mjs 扫描真实文件自动生成 ----------
// 每次 components/sections 目录变化后,重新运行一次脚本即可同步,不需要手工维护。
export { sectionFileRegistry, type SectionFileEntry } from './component-registry.sections.generated';

export const getSectionFilesByModule = (moduleName: string) =>
  sectionFileRegistry.filter((f) => f.module === moduleName);
