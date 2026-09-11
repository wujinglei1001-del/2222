// 只读脚本:给 components-registry.json 里 securityLevel === 'container-bound' 的每个组件,
// 找到它真正依赖的 FormProvider 父容器,按父容器聚合输出一份清单。
// 不修改任何 src 下的文件,也不改 components-registry.json,只在控制台打印结果 +
// 写一份 form-container-map.json 到项目根目录(和 components-registry.json 一样,独立于源码之外)。
//
// 追溯方法:
// 1. 对每个 container-bound 组件,在 src/components/sections 全目录里搜索"谁 import 了它"
//    (按它的文件名做全文搜索,不依赖具体 import 写法是相对路径还是别名路径)
// 2. 如果直接导入它的文件,本身就有组件调用了 useForm(),那这个文件就是父容器,追溯结束
// 3. 如果直接导入它的文件没有调用 useForm(),再找"谁 import 了这个中间文件",最多再往上找 2 层
// 4. 找不到就标记为 "unresolved",如实报告,不瞎编一个父容器

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative, extname, dirname } from 'path';

const ROOT = join(__dirname, '..');
const SRC_DIR = join(ROOT, 'src');
const SECTIONS_DIR = join(SRC_DIR, 'components', 'sections');
const REGISTRY_PATH = join(ROOT, 'components-registry.json');

interface RegistryEntry {
  filePath: string; // 形如 components/sections/xxx/yyy (不含扩展名)
  componentName: string;
  category: string;
  hooksUsed: string[];
  securityLevel: string;
}

function walkFiles(dir: string, acc: string[]): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) walkFiles(full, acc);
    else if (extname(entry) === '.tsx') acc.push(full);
  }
  return acc;
}

const allFiles = walkFiles(SECTIONS_DIR, []);
const fileContents = new Map<string, string>();
for (const f of allFiles) {
  fileContents.set(f, readFileSync(f, 'utf-8'));
}

// "表单拥有者"判定:不能只认字面量 useForm —— 实测发现这个代码库常见模式是
// 单独写一个 useXxxForm 自定义 Hook(比如 useProductListingForm.tsx)内部调 useForm(),
// 组件本身调用的是这个自定义 Hook,再包一层 <FormProvider>。这种自定义 Hook 文件因为
// 文件名小写开头,不会被当作"组件"收进 components-registry.json,但调用它的那个组件
// (比如 ProductListingStepper)本身是真正的 FormProvider 拥有者,必须一并算进去。
const registry: RegistryEntry[] = JSON.parse(readFileSync(REGISTRY_PATH, 'utf-8'));
const FORM_OWNER_HOOK_PATTERN = /^use.*Form$/;
const formOwnerFiles = new Set(
  registry
    .filter((r) => r.hooksUsed.some((h) => FORM_OWNER_HOOK_PATTERN.test(h)))
    .map((r) => r.filePath),
);

function relPathOf(absPath: string): string {
  return relative(SRC_DIR, absPath).replace(/\\/g, '/').replace(/\.tsx$/, '');
}

// 找出哪些文件里出现了对某个组件名的 import(不管相对路径还是别名路径,直接搜组件名关键字)
function findImporters(componentName: string, excludeFile: string): string[] {
  const importers: string[] = [];
  for (const [file, content] of fileContents) {
    if (file === excludeFile) continue;
    const importRegex = new RegExp(`import\\s+${componentName}\\b|import\\s*\\{[^}]*\\b${componentName}\\b[^}]*\\}`);
    if (importRegex.test(content)) importers.push(file);
  }
  return importers;
}

interface TraceResult {
  parentPath: string | null;
  hops: number;
}

function traceParent(componentEntry: RegistryEntry, maxHops = 3): TraceResult {
  const fileName = componentEntry.filePath.split('/').pop()!;
  let frontier = [{ name: componentEntry.componentName, file: join(SRC_DIR, componentEntry.filePath + '.tsx') }];

  for (let hop = 1; hop <= maxHops; hop++) {
    const nextFrontier: { name: string; file: string }[] = [];
    for (const { name, file } of frontier) {
      const importers = findImporters(name, file);
      for (const importerFile of importers) {
        const importerRelPath = relPathOf(importerFile);
        if (formOwnerFiles.has(importerRelPath)) {
          return { parentPath: importerRelPath, hops: hop };
        }
        // 记录下一跳:这个中间文件自己的组件名(取文件名,和项目"一文件一组件"的约定一致)
        const importerName = importerFile.split(/[\\/]/).pop()!.replace(/\.tsx$/, '');
        nextFrontier.push({ name: importerName, file: importerFile });
      }
    }
    if (nextFrontier.length === 0) break;
    frontier = nextFrontier;
  }
  return { parentPath: null, hops: -1 };
}

function categorize(relPath: string): string {
  const segments = relPath.split('/');
  return segments[2] ?? 'Other';
}

function main() {
  const boundComponents = registry.filter((r) => r.securityLevel === 'container-bound');

  const parentMap = new Map<string, { module: string; children: string[]; hops: number[] }>();
  const unresolved: string[] = [];

  for (const comp of boundComponents) {
    const { parentPath, hops } = traceParent(comp);
    if (!parentPath) {
      unresolved.push(`${comp.componentName} (${comp.filePath})`);
      continue;
    }
    if (!parentMap.has(parentPath)) {
      parentMap.set(parentPath, { module: categorize(parentPath), children: [], hops: [] });
    }
    const entry = parentMap.get(parentPath)!;
    entry.children.push(`${comp.componentName} (${comp.filePath})`);
    entry.hops.push(hops);
  }

  const rows = Array.from(parentMap.entries())
    .map(([parentPath, info]) => ({
      module: info.module,
      parentName: parentPath.split('/').pop(),
      parentPath,
      childCount: info.children.length,
      children: info.children,
    }))
    .sort((a, b) => b.childCount - a.childCount);

  console.log(`container-bound 组件总数: ${boundComponents.length}`);
  console.log(`成功追溯到父容器: ${boundComponents.length - unresolved.length}`);
  console.log(`追溯失败(未找到调用 useForm 的祖先,最多找了 3 层): ${unresolved.length}`);
  console.log('');
  console.log('=== 父容器清单(按子组件数量从多到少) ===');
  console.log('业务模块 | 父容器名称 | 文件路径 | 子组件数量');
  for (const row of rows) {
    console.log(`${row.module} | ${row.parentName} | ${row.parentPath} | ${row.childCount}`);
  }

  if (unresolved.length > 0) {
    console.log('');
    console.log('=== 追溯失败清单(如实列出,不瞎编父容器) ===');
    unresolved.forEach((u) => console.log(`  ${u}`));
  }

  const outPath = join(ROOT, 'form-container-map.json');
  writeFileSync(
    outPath,
    JSON.stringify({ rows, unresolved }, null, 2),
    'utf-8',
  );
  console.log(`\n已写入 ${outPath}`);
}

main();
