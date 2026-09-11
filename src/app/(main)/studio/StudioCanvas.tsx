'use client';

import { useMemo, useState, type MouseEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  Chip,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

// 第四阶段"破冰测试":用最简单、零依赖的 MUI Button 打通 拖拽源 -> Droppable 画布 -> 上屏渲染 这条链路。
// 拖拽外观壳子直接复用模板原生 Kanban 拖拽资产,不新写视觉 CSS:
// - 卡片壳 borderRadius: 4 与 Card 组件本身,来自 components/sections/kanban/kanban/task-card/TaskCard.tsx
// - 拖拽中 opacity/cursor 语义,来自 components/sections/kanban/kanban/task-card/SortableTaskItem.tsx
// - DragOverlay 的 boxShadow: theme.vars.shadows[5] 壳子,来自 components/sections/kanban/kanban/overlays/TaskCardOverlay.tsx
// - PointerSensor 的 delay: 250 长按语义,来自 components/sections/kanban/kanban/KanbanApp.tsx 的 dndContextProps 配置
const ICEBREAKER_ID = 'icebreaker-button';
const CANVAS_DROPPABLE_ID = 'studio-canvas-droppable';
const ICEBREAKER_TYPE = 'icebreaker-button';
// 真实 registry 资产(1203 个 atom/composite-container)落地画布后的节点类型。
// 这些组件的真实 Props/Hook 依赖未知、数量庞大,直接动态 import 真实业务组件风险极高
// (违反此前会话定下的"禁止非法拖拽导致运行时白屏崩溃"安全规则),
// 因此画布上渲染的是一张真实 componentName/filePath/category 信息卡片(占位展示),不是真实组件实例。
const REGISTRY_ASSET_TYPE = 'registry-asset';

// 属性表单 Schema:按组件类型注册需要渲染的表单项(文本框 / 色彩选择器 / 尺寸下拉选择)
interface PropFieldSchema {
  key: string;
  label: string;
  kind: 'text' | 'color' | 'select';
  options?: { value: string; label: string }[];
}

const BUTTON_SIZE_OPTIONS = [
  { value: 'small', label: '小(small)' },
  { value: 'medium', label: '中(medium)' },
  { value: 'large', label: '大(large)' },
];

const COMPONENT_PROP_SCHEMAS: Record<string, PropFieldSchema[]> = {
  [ICEBREAKER_TYPE]: [
    { key: 'label', label: '按钮文案', kind: 'text' },
    { key: 'color', label: '按钮颜色', kind: 'color' },
    { key: 'size', label: '按钮尺寸', kind: 'select', options: BUTTON_SIZE_OPTIONS },
  ],
};

// 各组件类型的初始 defaultProps,新节点落地画布时以此初始化
const DEFAULT_PROPS_BY_TYPE: Record<string, Record<string, string>> = {
  [ICEBREAKER_TYPE]: { label: '破冰测试 Button', color: '#3385f0', size: 'small' },
};

interface CanvasNode {
  id: string;
  name: string;
  componentType: string;
  props: Record<string, string>;
  x: number;
  y: number;
}

// 复用 Kanban TaskCard 的卡片壳(Card + borderRadius: 4),内容换成破冰测试用的 Button。
// label/color/size 均可选,不传时用 defaultProps 兜底,保证画布内组件实时响应 Inspector 表单的属性更新。
const IcebreakerCardShell = ({
  label,
  color,
  size,
}: { label?: string; color?: string; size?: string } = {}) => {
  const defaults = DEFAULT_PROPS_BY_TYPE[ICEBREAKER_TYPE];
  const resolvedSize = (size ?? defaults.size) as 'small' | 'medium' | 'large';
  return (
    <Card sx={{ borderRadius: 4, outline: 'none', p: 2 }}>
      <Button
        variant="contained"
        size={resolvedSize}
        // 用户在 Inspector 里填的是任意 hex 值,不是主题色 token:用 style(内联样式优先级高于 MUI 主题类)
        // 而不是 sx,确保能覆盖 MuiButton-containedPrimary 的默认主题背景色,保证实时生效
        style={{ backgroundColor: color ?? defaults.color }}
      >
        {label ?? defaults.label}
      </Button>
    </Card>
  );
};

// 真实 registry 资产落地画布后的展示卡片:如实显示 componentName/filePath/category(真实元数据),
// 明确标注"占位展示"——不是真的动态挂载了该业务组件实例,避免误导。
const RegistryAssetCardShell = ({
  componentName,
  filePath,
  category,
}: {
  componentName?: string;
  filePath?: string;
  category?: string;
}) => (
  <Card sx={{ borderRadius: 4, outline: 'none', p: 1.5, minWidth: 160, maxWidth: 220 }}>
    <Stack direction="row" sx={{ alignItems: 'center', gap: 0.75, mb: 0.5 }}>
      {category && <Chip size="small" label={category} color="primary" variant="outlined" />}
    </Stack>
    <Typography variant="body2" sx={{ fontWeight: 700 }}>
      {componentName ?? '未知组件'}
    </Typography>
    <Typography
      variant="caption"
      sx={{ color: 'text.secondary', display: 'block', wordBreak: 'break-all' }}
    >
      {filePath}
    </Typography>
    <Typography variant="caption" sx={{ color: 'warning.main', display: 'block', mt: 0.5 }}>
      占位展示 · 非真实组件实例
    </Typography>
  </Card>
);

// 通用拖拽源容器:统一绑定 useDraggable 的 listeners/attributes/setNodeRef,
// 并按 isDragging 在 grab/grabbing 之间切换鼠标样式,供左侧面板项和已落地画布节点共用
interface DraggableItemProps {
  id: string;
  absolutePosition?: { x: number; y: number };
  isActive?: boolean;
  onClick?: (event: MouseEvent) => void;
  children: ReactNode;
}

const DraggableItem = ({
  id,
  absolutePosition,
  isActive,
  onClick,
  children,
}: DraggableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  const style = {
    ...(absolutePosition
      ? { position: 'absolute' as const, left: absolutePosition.x, top: absolutePosition.y }
      : {}),
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: isDragging ? 10 : 1,
  };
  return (
    <Box
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      {...attributes}
      {...listeners}
      // 选中高亮框:复用画布已有的 primary.main 主题色语义(与 composite-container 卡片同色系),不新起配色
      sx={{
        borderRadius: 4,
        outline: isActive ? '2px solid' : 'none',
        outlineColor: 'primary.main',
        outlineOffset: '2px',
      }}
    >
      {children}
    </Box>
  );
};

const DraggableIcebreaker = () => (
  <DraggableItem id={ICEBREAKER_ID}>
    <IcebreakerCardShell />
    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
      长按 250ms 后拖拽我到右侧白画布,松手停在哪就停在哪
    </Typography>
  </DraggableItem>
);

// 已落地画布节点:同样可再次被拖拽,实现自由挪动(任意摆放);单击(非拖拽)选中并高亮,事件不冒泡到画布空白区
const CanvasPlacedNode = ({
  node,
  isActive,
  onSelect,
}: {
  node: CanvasNode;
  isActive: boolean;
  onSelect: (id: string) => void;
}) => (
  <DraggableItem
    id={node.id}
    absolutePosition={{ x: node.x, y: node.y }}
    isActive={isActive}
    onClick={(event) => {
      event.stopPropagation();
      onSelect(node.id);
    }}
  >
    {node.componentType === REGISTRY_ASSET_TYPE ? (
      <RegistryAssetCardShell
        componentName={node.props.componentName}
        filePath={node.props.filePath}
        category={node.props.category}
      />
    ) : (
      <IcebreakerCardShell
        label={node.props.label}
        color={node.props.color}
        size={node.props.size}
      />
    )}
  </DraggableItem>
);

// 动态克隆(Ghost):DragOverlay 内部根据 onDragStart 捕获到的 active.id 实时渲染对应组件的克隆体,
// 拖拽影像壳子复用 TaskCardOverlay.tsx 的 cursor grabbing + borderRadius 4 + theme.vars.shadows[5]。
// 三种来源都要能查到:(1) 已落地节点(挪动)——按 id 查 canvasNodes;(2) 破冰测试面板项——固定 ICEBREAKER_ID;
// (3) 左侧 1203 个真实资产面板项(尚未落地)——按 "filePath::componentName" 反查 registry。
const DragActiveClone = ({
  activeId,
  canvasNodes,
  registry,
}: {
  activeId: string | null;
  canvasNodes: CanvasNode[];
  registry: StudioComponentEntry[];
}) => {
  if (!activeId) return null;

  const draggedNode = canvasNodes.find((n) => n.id === activeId);
  if (draggedNode) {
    return (
      <Box
        sx={{ cursor: 'grabbing', borderRadius: 4, boxShadow: (theme) => theme.vars.shadows[5] }}
      >
        {draggedNode.componentType === REGISTRY_ASSET_TYPE ? (
          <RegistryAssetCardShell
            componentName={draggedNode.props.componentName}
            filePath={draggedNode.props.filePath}
            category={draggedNode.props.category}
          />
        ) : (
          <IcebreakerCardShell
            label={draggedNode.props.label}
            color={draggedNode.props.color}
            size={draggedNode.props.size}
          />
        )}
      </Box>
    );
  }

  if (activeId === ICEBREAKER_ID) {
    return (
      <Box
        sx={{ cursor: 'grabbing', borderRadius: 4, boxShadow: (theme) => theme.vars.shadows[5] }}
      >
        <IcebreakerCardShell />
      </Box>
    );
  }

  const assetEntry = registry.find((r) => `${r.filePath}::${r.componentName}` === activeId);
  return (
    <Box sx={{ cursor: 'grabbing', borderRadius: 4, boxShadow: (theme) => theme.vars.shadows[5] }}>
      <RegistryAssetCardShell
        componentName={assetEntry?.componentName}
        filePath={assetEntry?.filePath}
        category={assetEntry?.category}
      />
    </Box>
  );
};

export interface StudioComponentEntry {
  filePath: string;
  componentName: string;
  category: string;
  securityLevel: 'safe-static' | 'safe-global-context' | 'container-bound';
  renderType: 'atom' | 'composite' | 'container';
  canvasVisibility: 'draggable' | 'internal-only';
  paletteRole: 'atom' | 'composite-container' | 'hidden';
}

interface Props {
  registry: StudioComponentEntry[];
}

interface CategoryBucket {
  name: string;
  atoms: StudioComponentEntry[];
  composites: StudioComponentEntry[];
  hiddenCount: number;
}

function buildBuckets(registry: StudioComponentEntry[]): CategoryBucket[] {
  const map = new Map<string, CategoryBucket>();
  for (const entry of registry) {
    if (!map.has(entry.category)) {
      map.set(entry.category, { name: entry.category, atoms: [], composites: [], hiddenCount: 0 });
    }
    const bucket = map.get(entry.category)!;
    if (entry.paletteRole === 'composite-container') bucket.composites.push(entry);
    else if (entry.paletteRole === 'atom') bucket.atoms.push(entry);
    else bucket.hiddenCount += 1;
  }
  return Array.from(map.values()).sort(
    (a, b) => b.atoms.length + b.composites.length - (a.atoms.length + a.composites.length),
  );
}

const CanvasDropZone = ({
  nodes,
  activeNodeId,
  onSelectNode,
  onClearSelection,
}: {
  nodes: CanvasNode[];
  activeNodeId: string | null;
  onSelectNode: (id: string) => void;
  onClearSelection: () => void;
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: CANVAS_DROPPABLE_ID });
  return (
    <Paper
      ref={setNodeRef}
      variant="outlined"
      onClick={onClearSelection}
      sx={{
        position: 'relative',
        minHeight: 480,
        p: 3,
        bgcolor: isOver ? 'action.hover' : 'background.paper',
        borderStyle: nodes.length === 0 ? 'dashed' : 'solid',
        borderColor: isOver ? 'primary.main' : 'divider',
        transition: 'background-color 120ms ease',
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
        白画布(Droppable · 自由落点 · 点击空白处取消选中)
      </Typography>
      {nodes.length === 0 && (
        <Typography variant="body2" sx={{ color: 'text.disabled' }}>
          长按左侧破冰测试部件 250ms 后拖到这里,松手停在哪就停在哪
        </Typography>
      )}
      {nodes.map((node) => (
        <CanvasPlacedNode
          key={node.id}
          node={node}
          isActive={node.id === activeNodeId}
          onSelect={onSelectNode}
        />
      ))}
    </Paper>
  );
};

// 右侧 Inspector 面板:监听 activeNodeId,未选中时提示"未选中",
// 选中时显示 ID/名称/坐标,并按 componentType 查表渲染属性配置表单(初始值来自该节点的 defaultProps)。
// 表单为受控输入,直接绑定 activeNode.props——onChange 实时写回对应节点,画布同步重渲染(双向数据绑定)。
const InspectorPanel = ({
  activeNode,
  onPropChange,
}: {
  activeNode: CanvasNode | null;
  onPropChange: (nodeId: string, key: string, value: string) => void;
}) => {
  const schema = activeNode ? (COMPONENT_PROP_SCHEMAS[activeNode.componentType] ?? []) : [];
  return (
    <Paper variant="outlined" sx={{ p: 2, minHeight: 480 }}>
      <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
        Inspector(属性检查器)
      </Typography>
      {!activeNode ? (
        <Typography variant="body2" sx={{ color: 'text.disabled' }}>
          未选中
        </Typography>
      ) : (
        <Stack sx={{ gap: 2 }}>
          <Stack sx={{ gap: 1 }}>
            <Typography variant="body2">
              <strong>ID:</strong> {activeNode.id}
            </Typography>
            <Typography variant="body2">
              <strong>名称:</strong> {activeNode.name}
            </Typography>
            <Typography variant="body2">
              <strong>坐标:</strong> ({Math.round(activeNode.x)}, {Math.round(activeNode.y)})
            </Typography>
          </Stack>

          <Stack sx={{ gap: 1.5 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              属性配置(实时生效)
            </Typography>
            {schema.map((field) => (
              <TextField
                key={field.key}
                select={field.kind === 'select'}
                label={field.label}
                type={field.kind === 'color' ? 'color' : 'text'}
                size="small"
                fullWidth
                value={activeNode.props[field.key] ?? ''}
                onChange={(event) => onPropChange(activeNode.id, field.key, event.target.value)}
              >
                {field.kind === 'select' &&
                  field.options?.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
              </TextField>
            ))}
          </Stack>
        </Stack>
      )}
    </Paper>
  );
};

const StudioCanvas = ({ registry }: Props) => {
  const buckets = useMemo(() => buildBuckets(registry), [registry]);
  const [expanded, setExpanded] = useState<string | false>(buckets[0]?.name ?? false);
  const [canvasNodes, setCanvasNodes] = useState<CanvasNode[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const activeNode = canvasNodes.find((n) => n.id === activeNodeId) ?? null;

  const totalDraggable = registry.filter((r) => r.canvasVisibility === 'draggable').length;
  const totalInternal = registry.filter((r) => r.canvasVisibility === 'internal-only').length;

  // iOS 桌面级长按激活:250ms 长按 + 5px 容差后才锁定拖拽,避免误触点击
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { delay: 250, tolerance: 5 },
  });
  const sensors = useSensors(pointerSensor);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over, delta } = event;
    const activeIdStr = String(active.id);

    // 已落地的画布节点被再次拖动:任意摆放(不区分节点类型,统一按 delta 挪动坐标)
    const isExistingCanvasNode = canvasNodes.some((n) => n.id === activeIdStr);
    if (isExistingCanvasNode) {
      setCanvasNodes((prev) =>
        prev.map((n) => (n.id === activeIdStr ? { ...n, x: n.x + delta.x, y: n.y + delta.y } : n)),
      );
      return;
    }

    // 否则是从左侧面板首次拖入(破冰测试按钮,或 1203 个真实 registry 资产之一),必须落在画布 Droppable 区域内才成立
    if (over?.id !== CANVAS_DROPPABLE_ID) return;
    const activeRect = active.rect.current.translated;
    const overRect = over.rect;
    if (!activeRect || !overRect) return;
    const x = activeRect.left - overRect.left;
    const y = activeRect.top - overRect.top;

    if (activeIdStr === ICEBREAKER_ID) {
      setCanvasNodes((prev) => [
        ...prev,
        {
          id: `${ICEBREAKER_ID}-${prev.length}-${Date.now()}`,
          name: '破冰测试 Button',
          componentType: ICEBREAKER_TYPE,
          props: { ...DEFAULT_PROPS_BY_TYPE[ICEBREAKER_TYPE] },
          x,
          y,
        },
      ]);
      return;
    }

    // 真实 registry 资产:按拖拽源 id("filePath::componentName")反查真实元数据,落地为占位信息卡片
    const assetEntry = registry.find((r) => `${r.filePath}::${r.componentName}` === activeIdStr);
    if (!assetEntry) return;
    setCanvasNodes((prev) => [
      ...prev,
      {
        id: `${activeIdStr}-${prev.length}-${Date.now()}`,
        name: assetEntry.componentName,
        componentType: REGISTRY_ASSET_TYPE,
        props: {
          componentName: assetEntry.componentName,
          filePath: assetEntry.filePath,
          category: assetEntry.category,
        },
        x,
        y,
      },
    ]);
  };

  // 双向数据绑定:Inspector 表单 onChange 触发,实时写入对应 activeNodeId 的 props,画布随之重渲染
  const handlePropChange = (nodeId: string, key: string, value: string) => {
    setCanvasNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, props: { ...n.props, [key]: value } } : n)),
    );
  };

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
        排版工作台(Studio) —— 第四阶段拖拽联调
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
        {buckets.length} 个业务分类,可拖拽部件 {totalDraggable} 个(原子 + 整体业务块),已锁定为
        internal-only 不可单独拖拽的表单子组件 {totalInternal} 个。
      </Typography>

      {/* 实时统计展示区:直接把 registry 实际读取到的数字渲染出来,不只是文字描述 */}
      <Stack direction="row" sx={{ gap: 1.5, flexWrap: 'wrap', mb: 3 }}>
        <Chip label={`分类数:${buckets.length}`} color="default" variant="filled" />
        <Chip label={`资产总数:${registry.length}`} color="primary" variant="filled" />
        <Chip
          label={`可拖拽(原子+整体业务块):${totalDraggable}`}
          color="success"
          variant="outlined"
        />
        <Chip label={`internal-only(隐藏):${totalInternal}`} color="warning" variant="outlined" />
        <Chip label={`画布已放置节点:${canvasNodes.length}`} color="info" variant="outlined" />
      </Stack>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 3 }}>
            <DraggableIcebreaker />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CanvasDropZone
              nodes={canvasNodes}
              activeNodeId={activeNodeId}
              onSelectNode={setActiveNodeId}
              onClearSelection={() => setActiveNodeId(null)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <InspectorPanel activeNode={activeNode} onPropChange={handlePropChange} />
          </Grid>
        </Grid>
        {typeof document !== 'undefined' &&
          createPortal(
            <DragOverlay>
              <DragActiveClone activeId={activeId} canvasNodes={canvasNodes} registry={registry} />
            </DragOverlay>,
            document.body,
          )}

        <Stack sx={{ gap: 2 }}>
          {buckets.map((bucket) => (
            <Accordion
              key={bucket.name}
              expanded={expanded === bucket.name}
              onChange={(_, isExpanded) => setExpanded(isExpanded ? bucket.name : false)}
            >
              <AccordionSummary
                expandIcon={<IconifyIcon icon="material-symbols:expand-more-rounded" />}
              >
                <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {bucket.name}
                  </Typography>
                  <Chip size="small" label={`${bucket.atoms.length} 原子`} color="default" />
                  {bucket.composites.length > 0 && (
                    <Chip
                      size="small"
                      label={`${bucket.composites.length} 整体业务块`}
                      color="primary"
                    />
                  )}
                  {bucket.hiddenCount > 0 && (
                    <Chip
                      size="small"
                      label={`${bucket.hiddenCount} internal-only(已隐藏)`}
                      color="warning"
                      variant="outlined"
                    />
                  )}
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {bucket.composites.map((c) => (
                    <Grid key={`${c.filePath}::${c.componentName}`} size={{ xs: 12, sm: 6, md: 4 }}>
                      <DraggableItem id={`${c.filePath}::${c.componentName}`}>
                        <Paper
                          sx={{
                            p: 2,
                            border: '1px solid',
                            borderColor: 'primary.main',
                            bgcolor: 'primary.lighter',
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {c.componentName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            整体业务块 · {c.filePath}
                          </Typography>
                        </Paper>
                      </DraggableItem>
                    </Grid>
                  ))}
                  {bucket.atoms.map((c) => (
                    <Grid key={`${c.filePath}::${c.componentName}`} size={{ xs: 12, sm: 6, md: 4 }}>
                      <DraggableItem id={`${c.filePath}::${c.componentName}`}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {c.componentName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {c.filePath}
                          </Typography>
                        </Paper>
                      </DraggableItem>
                    </Grid>
                  ))}
                  {bucket.atoms.length === 0 && bucket.composites.length === 0 && (
                    <Grid size={12}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        这个分类下没有可拖拽部件(全部是 internal-only 或未归属到父容器)。
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </DndContext>

      {/* 调试面板:实时展示画布节点数组的原始 JSON,数据来自 canvasNodes state,随拖拽/属性编辑同步刷新 */}
      <Paper variant="outlined" sx={{ mt: 4, p: 2, bgcolor: 'background.elevation1' }}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
          调试面板 · 画布节点数组(canvasNodes JSON · 实时同步,共 {canvasNodes.length} 个节点)
        </Typography>
        <Box
          component="pre"
          sx={{
            m: 0,
            p: 1.5,
            maxHeight: 320,
            overflow: 'auto',
            fontSize: 12,
            fontFamily: 'monospace',
            bgcolor: 'background.paper',
            borderRadius: 1,
          }}
        >
          {JSON.stringify(canvasNodes, null, 2)}
        </Box>
      </Paper>
    </Box>
  );
};

export default StudioCanvas;
