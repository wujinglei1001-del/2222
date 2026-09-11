// 扫描 src/components/sections 下的全部真实文件,生成部件登记表的 D 系列(文件级别)。
// 用法: node scripts/generate-section-registry.mjs
// 输出: src/lib/component-registry.sections.generated.ts (可重复运行,覆盖重写,永远和真实文件保持一致)

import { readdirSync, statSync, writeFileSync } from 'fs';
import { join, relative, extname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const SECTIONS_DIR = join(ROOT, 'src', 'components', 'sections');

const MODULE_NAMES = {
  account: '账户设置',
  authentications: '登录认证',
  calendar: '日历',
  chat: '聊天',
  common: '通用',
  content: '内容/博客',
  crm: 'CRM',
  dashboards: '仪表盘',
  ecommerce: '电子商务',
  email: '邮件',
  error: '错误页',
  events: '活动',
  faq: '常见问题',
  'file-manager': '文件管理',
  hiring: '招聘',
  hrm: '人力资源',
  invoice: '发票',
  kanban: '看板',
  member: '成员',
  misc: '其他',
  notification: '通知',
  pages: '通用页面',
  pricing: '定价',
  project: '项目管理',
  scheduler: '调度器',
  showcase: '展示页',
  social: '社交',
  starter: '起始页',
  'time-tracker': '时间追踪',
};

function walk(dir, results) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walk(full, results);
    } else if (['.tsx', '.ts'].includes(extname(entry))) {
      results.push(full);
    }
  }
  return results;
}

const files = walk(SECTIONS_DIR, []);

const entries = files.map((absPath, i) => {
  const rel = relative(join(ROOT, 'src'), absPath).replace(/\\/g, '/').replace(/\.tsx?$/, '');
  const segments = rel.split('/'); // components/sections/<module>/...
  const moduleKey = segments[2];
  const moduleName = MODULE_NAMES[moduleKey] || moduleKey;
  const fileName = basename(absPath).replace(/\.tsx?$/, '');
  const parentFolder = segments.length > 4 ? segments[segments.length - 2] : '';
  const isHook = fileName.startsWith('use');
  const isIndex = fileName === 'index';
  return {
    id: `E${String(5001 + i)}`,
    name: fileName,
    importPath: rel,
    module: moduleName,
    parentFolder,
    description: `${moduleName}模块${parentFolder ? ` / ${parentFolder}` : ''} 下的 ${fileName} 文件`,
    interactive: false,
    visual: false,
    isHook,
    isIndex,
  };
});

const header = `/**
 * 由 scripts/generate-section-registry.mjs 自动生成,请勿手工编辑。
 * 数据来源:扫描当前 src/components/sections 目录下的全部真实 .ts/.tsx 文件。
 * 如果这个目录内容发生变化(新增/删除/改名文件),重新运行一次脚本即可同步,
 * 不需要手工维护这份列表。
 *
 * 生成时间: ${new Date().toISOString()}
 * 文件总数: ${entries.length}
 */

export interface SectionFileEntry {
  id: string;
  name: string;
  importPath: string;
  module: string;
  parentFolder: string;
  description: string;
  interactive: boolean;
  visual: boolean;
  isHook: boolean;
  isIndex: boolean;
}

export const sectionFileRegistry: SectionFileEntry[] = ${JSON.stringify(entries, null, 2)};
`;

const outPath = join(ROOT, 'src', 'lib', 'component-registry.sections.generated.ts');
writeFileSync(outPath, header, 'utf-8');

console.log(`扫描到 ${entries.length} 个文件,已写入 ${outPath}`);
