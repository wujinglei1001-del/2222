// 只读诊断脚本:针对 form-container-map.json 里 unresolved 的 69 个组件,
// 逐个排查"为什么没追到父容器",不修改任何 src 下的源码,只输出诊断报告。
//
// 排查逻辑,对每个未解析组件依次检查:
// 1. 有没有任何文件 import 过它(哪怕一层都没有)—— 完全没有 => "无引用/疑似遗留代码"
// 2. 如果有引用,把追溯深度从 3 层放宽到 8 层再试一次 —— 能追到 => "嵌套层级更深,只是原来搜索深度不够"
// 3. 放宽到 8 层还是追不到,但确实有引用链 —— 检查引用链路径里有没有出现 "Dialog"/"Modal"/"Drawer" 字样
//    => "独立弹窗/抽屉,可能有自己局部的表单上下文搭建方式,没有落在 useXxxForm 这个检测规律里"
// 4. 都不是的话 —— 如实标为 "有引用但追溯逻辑未能命中,需要人工进一步核实"

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative, extname } from 'path';

const ROOT = join(__dirname, '..');
const SRC_DIR = join(ROOT, 'src');
const SECTIONS_DIR = join(SRC_DIR, 'components', 'sections');
const MAP_PATH = join(ROOT, 'form-container-map.json');
const REGISTRY_PATH = join(ROOT, 'components-registry.json');

interface RegistryEntry {
  filePath: string;
  componentName: string;
  hooksUsed: string[];
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
for (const f of allFiles) fileContents.set(f, readFileSync(f, 'utf-8'));

function relPathOf(absPath: string): string {
  return relative(SRC_DIR, absPath).replace(/\\/g, '/').replace(/\.tsx$/, '');
}

function findImporters(componentName: string, excludeFile: string): string[] {
  const importers: string[] = [];
  for (const [file, content] of fileContents) {
    if (file === excludeFile) continue;
    const importRegex = new RegExp(`import\\s+${componentName}\\b|import\\s*\\{[^}]*\\b${componentName}\\b[^}]*\\}`);
    if (importRegex.test(content)) importers.push(file);
  }
  return importers;
}

const registry: RegistryEntry[] = JSON.parse(readFileSync(REGISTRY_PATH, 'utf-8'));
const FORM_OWNER_HOOK_PATTERN = /^use.*Form$/;
const formOwnerFiles = new Set(
  registry.filter((r) => r.hooksUsed.some((h) => FORM_OWNER_HOOK_PATTERN.test(h))).map((r) => r.filePath),
);

interface DeepTraceResult {
  resolvedAtDeeperHop: string | null;
  hops: number;
  chainHasDialogLike: boolean;
  chainPaths: string[];
  directImporterCount: number;
}

function deepTrace(componentName: string, filePath: string, maxHops = 8): DeepTraceResult {
  let frontier = [{ name: componentName, file: join(SRC_DIR, filePath + '.tsx') }];
  const chainPaths: string[] = [];
  let directImporterCount = -1;

  for (let hop = 1; hop <= maxHops; hop++) {
    const nextFrontier: { name: string; file: string }[] = [];
    for (const { name, file } of frontier) {
      const importers = findImporters(name, file);
      if (hop === 1) directImporterCount = importers.length;
      for (const importerFile of importers) {
        const importerRelPath = relPathOf(importerFile);
        chainPaths.push(importerRelPath);
        if (formOwnerFiles.has(importerRelPath)) {
          return {
            resolvedAtDeeperHop: importerRelPath,
            hops: hop,
            chainHasDialogLike: chainPaths.some((p) => /dialog|modal|drawer/i.test(p)),
            chainPaths,
            directImporterCount,
          };
        }
        const importerName = importerFile.split(/[\\/]/).pop()!.replace(/\.tsx$/, '');
        nextFrontier.push({ name: importerName, file: importerFile });
      }
    }
    if (nextFrontier.length === 0) break;
    frontier = nextFrontier;
  }
  return {
    resolvedAtDeeperHop: null,
    hops: -1,
    chainHasDialogLike: chainPaths.some((p) => /dialog|modal|drawer/i.test(p)),
    chainPaths,
    directImporterCount,
  };
}

function main() {
  const mapData = JSON.parse(readFileSync(MAP_PATH, 'utf-8'));
  const unresolvedList: string[] = mapData.unresolved; // 形如 "ComponentName (path)"

  const diagnosis: Record<string, { component: string; path: string; reason: string; detail: string }[]> = {
    orphan: [],
    'resolved-deeper': [],
    'dialog-like-chain': [],
    'needs-manual-review': [],
  };

  for (const entry of unresolvedList) {
    const match = entry.match(/^(.+?) \((.+)\)$/);
    if (!match) continue;
    const [, componentName, filePath] = match;

    const result = deepTrace(componentName, filePath);

    if (result.directImporterCount === 0) {
      diagnosis.orphan.push({
        component: componentName,
        path: filePath,
        reason: '无引用/疑似未被使用',
        detail: '在全部 src/components/sections 范围内搜索,没有任何文件 import 这个组件名',
      });
    } else if (result.resolvedAtDeeperHop) {
      diagnosis['resolved-deeper'].push({
        component: componentName,
        path: filePath,
        reason: `嵌套更深,放宽到 ${result.hops} 层后追到了`,
        detail: `父容器: ${result.resolvedAtDeeperHop}`,
      });
    } else if (result.chainHasDialogLike) {
      diagnosis['dialog-like-chain'].push({
        component: componentName,
        path: filePath,
        reason: '引用链上出现 Dialog/Modal/Drawer,可能是独立弹窗的局部表单',
        detail: `引用链: ${result.chainPaths.slice(0, 4).join(' <- ')}`,
      });
    } else {
      diagnosis['needs-manual-review'].push({
        component: componentName,
        path: filePath,
        reason: '有引用但 8 层内仍未找到 FormProvider 来源,需要人工核实',
        detail: `引用链(前几层): ${result.chainPaths.slice(0, 4).join(' <- ') || '(无)'}`,
      });
    }
  }

  console.log(`待诊断组件总数: ${unresolvedList.length}`);
  console.log('');
  for (const [key, items] of Object.entries(diagnosis)) {
    console.log(`=== ${key} (${items.length} 个) ===`);
    for (const item of items) {
      console.log(`  ${item.component} | ${item.path}`);
      console.log(`    原因: ${item.reason}`);
      console.log(`    细节: ${item.detail}`);
    }
    console.log('');
  }

  const outPath = join(ROOT, 'unresolved-diagnosis.json');
  writeFileSync(outPath, JSON.stringify(diagnosis, null, 2), 'utf-8');
  console.log(`已写入 ${outPath}`);
}

main();
