// 只读源码、只改外部元数据文件的锁定脚本。
// 不碰 src 下任何业务源文件,只更新项目根目录的 components-registry.json,
// 给每条记录加上两个"最终决策"字段(区别于之前纯分析用的 securityLevel/renderType):
//
// - canvasVisibility: 'draggable' | 'internal-only'
//     181 个 container-bound 组件一律标记 internal-only,画布不能直接拖拽这些原子块。
// - paletteRole: 'atom' | 'composite-container' | 'hidden'
//     'composite-container': 在 form-container-map.json 里被确认为父容器的组件,
//        作为"整体业务块"开放拖拽(带着它底下所有 internal-only 子组件一起用)。
//     'atom': 安全、可独立拖拽的原子部件(safe-static / safe-global-context 且不是父容器)。
//     'hidden': 181 个 internal-only 组件本身,不出现在画布拖拽面板里,只是被记录在案。

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = join(__dirname, '..');
const REGISTRY_PATH = join(ROOT, 'components-registry.json');
const MAP_PATH = join(ROOT, 'form-container-map.json');

interface RegistryEntry {
  filePath: string;
  componentName: string;
  securityLevel: string;
  [key: string]: unknown;
}

const registry: RegistryEntry[] = JSON.parse(readFileSync(REGISTRY_PATH, 'utf-8'));
const containerMap = JSON.parse(readFileSync(MAP_PATH, 'utf-8'));

const confirmedContainerPaths = new Set<string>(containerMap.rows.map((r: { parentPath: string }) => r.parentPath));

let internalOnlyCount = 0;
let compositeCount = 0;
let atomCount = 0;

for (const entry of registry) {
  if (entry.securityLevel === 'container-bound') {
    entry.canvasVisibility = 'internal-only';
    entry.paletteRole = 'hidden';
    internalOnlyCount++;
  } else if (confirmedContainerPaths.has(entry.filePath)) {
    entry.canvasVisibility = 'draggable';
    entry.paletteRole = 'composite-container';
    compositeCount++;
  } else {
    entry.canvasVisibility = 'draggable';
    entry.paletteRole = 'atom';
    atomCount++;
  }
}

writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2), 'utf-8');

console.log(`已锁定 ${registry.length} 条元数据到 ${REGISTRY_PATH}`);
console.log(`  internal-only(画布禁止直接拖拽): ${internalOnlyCount}`);
console.log(`  composite-container(开放为整体业务块): ${compositeCount}`);
console.log(`  atom(可独立拖拽的原子部件): ${atomCount}`);
