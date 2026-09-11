import { readFileSync } from 'fs';
import { join } from 'path';
import StudioCanvas, { StudioComponentEntry } from './StudioCanvas';

// 服务端读取项目根目录的 components-registry.json(独立于 src 业务源码之外的元数据文件),
// 不导入、不复制到 src 里,运行时直接读最新版本。
function loadRegistry(): StudioComponentEntry[] {
  const registryPath = join(process.cwd(), 'components-registry.json');
  const raw = readFileSync(registryPath, 'utf-8');
  return JSON.parse(raw) as StudioComponentEntry[];
}

const Page = () => {
  const registry = loadRegistry();
  return <StudioCanvas registry={registry} />;
};

export default Page;
