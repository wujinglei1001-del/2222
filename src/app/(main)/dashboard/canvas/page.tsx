'use client';
import { useState } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import AnalyticKPI from 'components/sections/dashboards/analytics/kpi/AnalyticKPI';
import ReactEchart from 'components/base/ReactEchart';

echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer, GridComponent]);

const storeDistributionOption = {
  color: ['#1976d2', '#26a69a'],
  tooltip: { trigger: 'item' as const },
  series: [
    {
      type: 'pie',
      padAngle: 2,
      radius: ['55%', '80%'],
      avoidLabelOverlap: false,
      label: { show: false },
      itemStyle: { borderColor: 'transparent' },
      data: [
        { name: '上海', value: 40 },
        { name: '北京', value: 60 },
      ],
    },
  ],
  grid: { outerBoundsMode: 'same', outerBoundsContain: 'axisLabel' },
};

function SortableItem({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const renderContent = () => {
    if (id === '财务统计') {
      return (
        <AnalyticKPI
          kpi={{
            title: '财务总收入',
            value: 714000,
            icon: { name: 'material-symbols:finance-mode-outline-rounded', color: 'info' },
            link: { prefix: '', text: '', url: '#!' },
          }}
        />
      );
    }
    if (id === '多店铺管理') {
      return (
        <Paper sx={{ p: 3, height: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
            店铺分布
          </Typography>
          <ReactEchart echarts={echarts} option={storeDistributionOption} sx={{ height: 220 }} />
        </Paper>
      );
    }
    return (
      <Paper sx={{ p: 4, textAlign: 'center', height: '100%' }}>
        <Typography variant="h6">{id}</Typography>
      </Paper>
    );
  };

  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }} ref={setNodeRef} style={style}>
      <Box {...attributes} {...listeners} sx={{ cursor: 'grab' }}>
        {renderContent()}
      </Box>
    </Grid>
  );
}

export default function DashboardPage() {
  const [items, setItems] = useState(['财务统计', '多店铺管理', '快递打单', '库存管理', '税务统计']);
  const sensors = useSensors(useSensor(PointerSensor));
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((prev) => {
        const oldIdx = prev.indexOf(active.id);
        const newIdx = prev.indexOf(over.id);
        return arrayMove(prev, oldIdx, newIdx);
      });
    }
  };
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>云桌面画布</Typography>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={rectSortingStrategy}>
          <Grid container spacing={3}>
            {items.map((id) => <SortableItem key={id} id={id} />)}
          </Grid>
        </SortableContext>
      </DndContext>
    </Box>
  );
}
