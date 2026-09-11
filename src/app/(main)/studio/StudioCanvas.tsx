'use client';

import { useMemo, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

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

const StudioCanvas = ({ registry }: Props) => {
  const buckets = useMemo(() => buildBuckets(registry), [registry]);
  const [expanded, setExpanded] = useState<string | false>(buckets[0]?.name ?? false);

  const totalDraggable = registry.filter((r) => r.canvasVisibility === 'draggable').length;
  const totalInternal = registry.filter((r) => r.canvasVisibility === 'internal-only').length;

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
        排版工作台(Studio) —— 部件面板骨架
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
        {buckets.length} 个业务分类,可拖拽部件 {totalDraggable} 个(原子 + 整体业务块),已锁定为 internal-only
        不可单独拖拽的表单子组件 {totalInternal} 个。当前是画布骨架,还没有接入实际拖拽交互。
      </Typography>

      <Stack sx={{ gap: 2 }}>
        {buckets.map((bucket) => (
          <Accordion
            key={bucket.name}
            expanded={expanded === bucket.name}
            onChange={(_, isExpanded) => setExpanded(isExpanded ? bucket.name : false)}
          >
            <AccordionSummary expandIcon={<IconifyIcon icon="material-symbols:expand-more-rounded" />}>
              <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {bucket.name}
                </Typography>
                <Chip size="small" label={`${bucket.atoms.length} 原子`} color="default" />
                {bucket.composites.length > 0 && (
                  <Chip size="small" label={`${bucket.composites.length} 整体业务块`} color="primary" />
                )}
                {bucket.hiddenCount > 0 && (
                  <Chip size="small" label={`${bucket.hiddenCount} internal-only(已隐藏)`} color="warning" variant="outlined" />
                )}
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {bucket.composites.map((c) => (
                  <Grid key={`${c.filePath}::${c.componentName}`} size={{ xs: 12, sm: 6, md: 4 }}>
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
                  </Grid>
                ))}
                {bucket.atoms.map((c) => (
                  <Grid key={`${c.filePath}::${c.componentName}`} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Paper sx={{ p: 2, cursor: 'grab' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {c.componentName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {c.filePath}
                      </Typography>
                    </Paper>
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
    </Box>
  );
};

export default StudioCanvas;
