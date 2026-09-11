// 基于 TypeScript Compiler API 的组件 Props 深度解析脚本。
// 用法: npx tsx scripts/parse-components.ts
// 输出: components-registry.json (项目根目录,独立于源码之外的外部元数据文件)
//
// ⚠️ 只读原则:本脚本从头到尾只调用 fs 的 read* 系列函数读取 src 下的源码,
// 唯一一次 writeFileSync 写的是项目根目录的 components-registry.json,
// 不会对 src/components/sections(或 src 下任何其他文件/文件夹)做任何创建、
// 修改、重命名或删除操作。可以直接搜索本文件里的 writeFileSync 确认只有这一处。
//
// 扫描范围严格限定:只扫 src/components/sections(真实的业务视图/区块目录),
// 不包含 base、common、layouts —— 那些是通用基础设施,不是业务组件,这次不收录。
//
// 做的事:
// 1. 遍历 src/components/sections 下的 .tsx 文件,强制跳过任何名为 icons 的目录
// 2. 找出每个文件里 export default 和具名 export 的组件(名字以大写字母开头),
//    同时排除名称包含 "Icon" 的纯图标组件
// 3. 用 TypeScript 的类型检查器(不是正则/纯文本匹配)解析组件第一个参数的类型,
//    正确处理 interface extends、跨文件引用类型等情况
// 4. 对每个 Props 属性,记录:属性名、类型(字符串形式)、是否 optional
// 5. 按 sections 下的一级子目录名自动分类(如 analytics、ecommerce、hrm 等真实业务模块)
// 6. 全部写入 components-registry.json,和源码完全分离的一份外部索引

import * as ts from 'typescript';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative, extname } from 'path';

const ROOT = join(__dirname, '..');
const SRC_DIR = join(ROOT, 'src');
const TSCONFIG_PATH = join(ROOT, 'tsconfig.json');

// 只读扫描的根目录 —— 严格限定在业务区块目录,只用来"读",不做任何写入
const SECTIONS_DIR = join(SRC_DIR, 'components', 'sections');
const SCAN_ROOTS = [SECTIONS_DIR];

interface PropEntry {
  name: string;
  type: string;
  optional: boolean;
}

interface ComponentEntry {
  filePath: string;
  componentName: string;
  exportType: 'default' | 'named';
  category: string;
  props: PropEntry[];
  // resolved: 成功解析出 Props
  // no-params-static: 零参数,函数体内没有检测到 useXxx() 调用,判定为纯静态展示组件
  // no-params-context: 零参数,但函数体内调用了 useXxx(),数据是从 Hook/Context 自取的
  // untyped-param: 有参数,但类型检查器解析不出属性(典型:解构参数没写类型注解)
  propsSource: 'resolved' | 'no-params-static' | 'no-params-context' | 'untyped-param';
  hooksUsed: string[];
  // atom: 无子插槽、不接收 children 的最小展示/交互单元
  // composite: 有 props 或内部状态,但不是"外壳容器"
  // container: 调用了 useForm(自己创建表单上下文)或 props 里带 children —— 会包裹别的内容
  renderType: 'atom' | 'composite' | 'container';
  // safe-static: 零参数零 Hook,可直接自由拖拽
  // safe-global-context: 只依赖 React 内置 Hook 或应用级全局 Provider(SettingsProvider/NavProvider 等),可直接自由拖拽
  // container-bound: 调用了 useFormContext/useWatch/useFieldArray/useFormState/useController 这类依赖"局部 FormProvider"的 Hook,
  //                   禁止作为独立原子拖拽,必须和它所属的表单容器一起打包,或强制标记 parentConstraint
  securityLevel: 'safe-static' | 'safe-global-context' | 'container-bound';
  parentConstraint: string | null;
  slots: string[];
}

// 依赖"局部 FormProvider"上下文、脱离表单容器会在运行时报错/取不到数据的 react-hook-form Hook
const FORM_CONTEXT_HOOKS = new Set(['useFormContext', 'useWatch', 'useFieldArray', 'useFormState', 'useController']);

// 扫描时强行排除的目录名(不区分大小写):纯图标资源目录,不算业务/UI 组件
const EXCLUDED_DIR_NAMES = new Set(['icons']);

function walk(dir: string, acc: string[]): string[] {
  for (const entry of readdirSync(dir)) {
    if (EXCLUDED_DIR_NAMES.has(entry.toLowerCase())) continue;
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) {
      walk(full, acc);
    } else if (extname(entry) === '.tsx') {
      acc.push(full);
    }
  }
  return acc;
}

// 组件名里带 "Icon" 的,判定为纯图标组件,统计业务/UI 组件总数时要排除
function isPureIconComponent(name: string): boolean {
  return name.includes('Icon');
}

// 纯符号/表情字符判定:去掉常见 Emoji/符号 Unicode 区段后如果整段文本被清空,
// 说明这段 JSXText 从头到尾就是表情符号,不含任何真实文字/业务内容
const EMOJI_OR_SYMBOL_RE = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/gu;
function isPureEmojiText(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  const stripped = trimmed.replace(EMOJI_OR_SYMBOL_RE, '').trim();
  return stripped.length === 0;
}

// 原生 svg 图形标签(小写标签名),用来识别"整个组件就是在画一个 svg 图形"的情况
const SVG_TAG_NAMES = new Set([
  'svg', 'path', 'circle', 'rect', 'polygon', 'polyline', 'line', 'g', 'ellipse', 'defs', 'clippath',
]);

// 纯布局壳标签白名单:只有当外壳标签只剩这一个孩子、且没有任何事件/交互 props 时才允许"穿透"继续往里判断,
// 避免把 IconButton、Button、Chip 这类本身就是"真实可交互业务部件"的东西误判成纯图标
const TRANSPARENT_WRAPPER_TAGS = new Set(['Box', 'Stack', 'div', 'span', 'Fragment']);

function jsxTagName(node: ts.JsxElement | ts.JsxSelfClosingElement | ts.JsxOpeningElement): string {
  const tagNode = ts.isJsxElement(node) ? node.openingElement.tagName : node.tagName;
  return tagNode.getText();
}

function hasInteractiveProps(attrs: ts.JsxAttributes): boolean {
  return attrs.properties.some(
    (p) => ts.isJsxAttribute(p) && /^on[A-Z]/.test(p.name.getText()),
  );
}

// 判断一段 JSX(元素/自闭合元素/Fragment/纯文本)是否"整体上只是一个图标或一串表情符号",
// 允许穿透若干层纯布局壳(Box/Stack/div/span/Fragment,且该层只有这一个有效子节点、没有事件 props)
function isPureIconOrEmojiJsx(node: ts.Node): boolean {
  if (ts.isParenthesizedExpression(node)) return isPureIconOrEmojiJsx(node.expression);

  if (ts.isJsxText(node)) {
    return isPureEmojiText(node.text);
  }

  if (ts.isJsxFragment(node)) {
    const meaningfulChildren = node.children.filter(
      (c) => !(ts.isJsxText(c) && c.text.trim() === ''),
    );
    if (meaningfulChildren.length !== 1) return false;
    return isPureIconOrEmojiJsx(meaningfulChildren[0]);
  }

  if (ts.isJsxSelfClosingElement(node)) {
    const tag = jsxTagName(node);
    if (SVG_TAG_NAMES.has(tag.toLowerCase())) return true;
    if (/Icon$/i.test(tag)) return true;
    return false;
  }

  if (ts.isJsxElement(node)) {
    const tag = jsxTagName(node.openingElement);
    const meaningfulChildren = node.children.filter(
      (c) => !(ts.isJsxText(c) && c.text.trim() === ''),
    );

    if (SVG_TAG_NAMES.has(tag.toLowerCase()) || /Icon$/i.test(tag)) {
      // 图标/svg 标签本身,不再关心内部子节点(svg 内部的 path/g 都算图标的一部分)
      return true;
    }

    if (TRANSPARENT_WRAPPER_TAGS.has(tag) && !hasInteractiveProps(node.openingElement.attributes)) {
      if (meaningfulChildren.length !== 1) return false;
      return isPureIconOrEmojiJsx(meaningfulChildren[0]);
    }

    return false;
  }

  return false;
}

// 收集函数体里所有 return 语句返回的表达式;箭头函数表达式体本身就是唯一的"返回值"
function collectReturnedExpressions(fn: ts.FunctionLikeDeclarationBase): ts.Expression[] {
  if (!fn.body) return [];
  if (!ts.isBlock(fn.body)) return [fn.body];

  const returned: ts.Expression[] = [];
  const visit = (node: ts.Node) => {
    if (ts.isReturnStatement(node) && node.expression) {
      returned.push(node.expression);
    }
    if (!ts.isFunctionLike(node)) {
      ts.forEachChild(node, visit);
    }
  };
  visit(fn.body);
  return returned;
}

// 组件是否"整体上只是一个图标/svg/表情符号的渲染外壳":只有唯一一条 return,
// 且那条 return 的 JSX 经过纯布局壳穿透后落地就是一个图标标签或纯表情文本
function isPureIconOrEmojiComponent(fn: ts.FunctionLikeDeclarationBase): boolean {
  const returns = collectReturnedExpressions(fn);
  if (returns.length !== 1) return false;
  return isPureIconOrEmojiJsx(returns[0]);
}

/**
 * 分类规则:相对路径固定是 "components/sections/<业务模块>/..."(因为扫描范围
 * 已经限定在 SECTIONS_DIR 下),直接取第三段(sections 后面那一级)作为业务分类,
 * 即真实的一级子目录名,比如 analytics、ecommerce、hrm。
 */
function categorize(relPath: string): string {
  const segments = relPath.split('/');
  // segments: ['components', 'sections', '<业务模块>', ...]
  return segments[2] ?? 'Other';
}

function loadCompilerOptions(): ts.CompilerOptions {
  const configText = readFileSync(TSCONFIG_PATH, 'utf-8');
  const configJson = ts.parseConfigFileTextToJson(TSCONFIG_PATH, configText);
  const parsed = ts.parseJsonConfigFileContent(configJson.config, ts.sys, ROOT);
  return parsed.options;
}

function isComponentName(name: string | undefined): name is string {
  return !!name && /^[A-Z]/.test(name);
}

function extractPropsFromType(checker: ts.TypeChecker, type: ts.Type, atNode: ts.Node): PropEntry[] {
  const props = checker.getPropertiesOfType(type);
  return props.map((sym) => {
    const propType = checker.getTypeOfSymbolAtLocation(sym, atNode);
    const optional =
      !!(sym.flags & ts.SymbolFlags.Optional) ||
      sym.declarations?.some((d) => ts.isPropertySignature(d) && !!d.questionToken);
    return {
      name: sym.getName(),
      type: checker.typeToString(propType, atNode, ts.TypeFormatFlags.NoTruncation),
      optional: !!optional,
    };
  });
}

// 在函数体里找形如 useXxx(...) 的调用,收集调用到的 hook 名字(不去重按出现顺序)
function findHookCalls(fn: ts.FunctionLikeDeclarationBase): string[] {
  const hooks: string[] = [];
  if (!fn.body) return hooks;
  const visit = (node: ts.Node) => {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      /^use[A-Z]/.test(node.expression.text)
    ) {
      hooks.push(node.expression.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(fn.body);
  return hooks;
}

type PropsSource = 'resolved' | 'no-params-static' | 'no-params-context' | 'untyped-param';

function getFirstParamPropsInfo(
  checker: ts.TypeChecker,
  fn: ts.FunctionLikeDeclarationBase,
): { props: PropEntry[]; propsSource: PropsSource; hooksUsed: string[] } {
  // 不管有没有参数,一律扫函数体里的 useXxx() 调用 —— 即便一个组件有完整的 Props,
  // 它内部照样可能调用 useFormContext 这类依赖局部 FormProvider 的 Hook,风险判断不能只看零参数的情况。
  const hooksUsed = findHookCalls(fn);
  const [firstParam] = fn.parameters;

  if (!firstParam) {
    return {
      props: [],
      propsSource: hooksUsed.length > 0 ? 'no-params-context' : 'no-params-static',
      hooksUsed,
    };
  }

  const type = checker.getTypeAtLocation(firstParam);
  if (!type || type.getProperties().length === 0) {
    // 有参数,但类型检查器解析不出任何属性 —— 典型情况是解构参数没写类型注解
    return { props: [], propsSource: 'untyped-param', hooksUsed };
  }
  return {
    props: extractPropsFromType(checker, type, firstParam),
    propsSource: 'resolved',
    hooksUsed,
  };
}

function classify(
  props: PropEntry[],
  hooksUsed: string[],
): { renderType: ComponentEntry['renderType']; securityLevel: ComponentEntry['securityLevel']; parentConstraint: string | null; slots: string[] } {
  const formRisk = hooksUsed.some((h) => FORM_CONTEXT_HOOKS.has(h));
  const createsOwnForm = hooksUsed.includes('useForm');
  const hasChildrenSlot = props.some((p) => p.name === 'children');

  let securityLevel: ComponentEntry['securityLevel'];
  if (formRisk) {
    securityLevel = 'container-bound';
  } else if (hooksUsed.length === 0 && props.length === 0) {
    securityLevel = 'safe-static';
  } else {
    securityLevel = 'safe-global-context';
  }

  let renderType: ComponentEntry['renderType'];
  if (createsOwnForm || hasChildrenSlot) {
    renderType = 'container';
  } else if (hooksUsed.length === 0 && props.length === 0) {
    renderType = 'atom';
  } else {
    renderType = 'composite';
  }

  return {
    renderType,
    securityLevel,
    parentConstraint: formRisk ? 'FormProvider' : null,
    slots: hasChildrenSlot ? ['children'] : [],
  };
}

function main() {
  const files = SCAN_ROOTS.flatMap((dir) => walk(dir, []));
  const compilerOptions = loadCompilerOptions();
  const program = ts.createProgram(files, compilerOptions);
  const checker = program.getTypeChecker();

  const results: ComponentEntry[] = [];

  for (const filePath of files) {
    const sourceFile = program.getSourceFile(filePath);
    if (!sourceFile) continue;
    const relPath = relative(SRC_DIR, filePath).replace(/\\/g, '/').replace(/\.tsx$/, '');
    const category = categorize(relPath);

    ts.forEachChild(sourceFile, (node) => {
      if (
        ts.isFunctionDeclaration(node) &&
        node.modifiers?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword)
      ) {
        const name = node.name?.text ?? relPath.split('/').pop()!;
        if (!isPureIconComponent(name) && !isPureIconOrEmojiComponent(node)) {
          const { props, propsSource, hooksUsed } = getFirstParamPropsInfo(checker, node);
          const { renderType, securityLevel, parentConstraint, slots } = classify(props, hooksUsed);
          results.push({
            filePath: relPath,
            componentName: name,
            exportType: 'default',
            category,
            props,
            propsSource,
            hooksUsed,
            renderType,
            securityLevel,
            parentConstraint,
            slots,
          });
        }
      }

      if (ts.isVariableStatement(node)) {
        const isExported = node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
        for (const decl of node.declarationList.declarations) {
          if (!ts.isIdentifier(decl.name)) continue;
          const name = decl.name.text;
          if (!isComponentName(name)) continue;
          if (isPureIconComponent(name)) continue;
          if (!decl.initializer) continue;
          if (!ts.isArrowFunction(decl.initializer) && !ts.isFunctionExpression(decl.initializer)) continue;
          if (isPureIconOrEmojiComponent(decl.initializer)) continue;

          const { props, propsSource, hooksUsed } = getFirstParamPropsInfo(checker, decl.initializer);
          const { renderType, securityLevel, parentConstraint, slots } = classify(props, hooksUsed);
          results.push({
            filePath: relPath,
            componentName: name,
            exportType: isExported ? 'named' : 'default',
            category,
            props,
            propsSource,
            hooksUsed,
            renderType,
            securityLevel,
            parentConstraint,
            slots,
          });
        }
      }
    });

    const exportAssignment = sourceFile.statements.find(
      (s): s is ts.ExportAssignment => ts.isExportAssignment(s) && !s.isExportEquals,
    );
    if (exportAssignment && ts.isIdentifier(exportAssignment.expression)) {
      const exportedName = exportAssignment.expression.text;
      const match = results.find((r) => r.filePath === relPath && r.componentName === exportedName);
      if (match) match.exportType = 'default';
    }
  }

  // 唯一的写入操作:只写项目根目录下的这一个外部索引文件,不触碰 src 下任何源码
  const outPath = join(ROOT, 'components-registry.json');
  writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf-8');

  const bySource = results.reduce<Record<string, number>>((acc, r) => {
    acc[r.propsSource] = (acc[r.propsSource] ?? 0) + 1;
    return acc;
  }, {});
  const byCategory = results.reduce<Record<string, number>>((acc, r) => {
    acc[r.category] = (acc[r.category] ?? 0) + 1;
    return acc;
  }, {});
  const hookCounts = results
    .flatMap((r) => r.hooksUsed)
    .reduce<Record<string, number>>((acc, h) => {
      acc[h] = (acc[h] ?? 0) + 1;
      return acc;
    }, {});
  const bySecurityLevel = results.reduce<Record<string, number>>((acc, r) => {
    acc[r.securityLevel] = (acc[r.securityLevel] ?? 0) + 1;
    return acc;
  }, {});
  const byRenderType = results.reduce<Record<string, number>>((acc, r) => {
    acc[r.renderType] = (acc[r.renderType] ?? 0) + 1;
    return acc;
  }, {});

  console.log(`扫描范围: src/components/sections(已排除 icons 目录)`);
  console.log(`共解析 ${files.length} 个 .tsx 文件,排除图标类组件后提取出 ${results.length} 个真实业务组件`);
  console.log('Props 来源分类统计:');
  console.log(`  resolved(成功解析出 Props): ${bySource.resolved ?? 0}`);
  console.log(`  no-params-static(零参数,纯静态展示,函数体内没有 useXxx 调用): ${bySource['no-params-static'] ?? 0}`);
  console.log(`  no-params-context(零参数,但函数体内调用了 Hook/Context 自取数据): ${bySource['no-params-context'] ?? 0}`);
  console.log(`  untyped-param(有参数,但没有可解析的类型注解): ${bySource['untyped-param'] ?? 0}`);
  console.log('真实业务分类桶清单:');
  for (const [cat, count] of Object.entries(byCategory).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cat}: ${count}`);
  }
  console.log('no-params-context 组件里最常调用的 Hook(前 15):');
  for (const [hook, count] of Object.entries(hookCounts).sort((a, b) => b[1] - a[1]).slice(0, 15)) {
    console.log(`  ${hook}: ${count}`);
  }
  console.log('安全分级(securityLevel)统计:');
  for (const [lvl, count] of Object.entries(bySecurityLevel).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${lvl}: ${count}`);
  }
  console.log('渲染类型(renderType)统计:');
  for (const [rt, count] of Object.entries(byRenderType).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${rt}: ${count}`);
  }
  console.log(`已写入 ${outPath}`);
}

main();
