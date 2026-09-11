'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { DndContext, useDroppable } from '@dnd-kit/core';
import { Box, Paper, Stack, TextField, Typography } from '@mui/material';

// 根路径直接就是自由画布,不再走 (main) 路由组、不带 MainLayout(侧边栏/顶栏)。
// /free-canvas 子路径已废弃,原首页(ECommerce 概览)搬到 /home。
const BLANK_CANVAS_ID = 'blank-canvas-droppable';

// 验证1:crm 分类真实组件动态挂载(props 为空,securityLevel: safe-static)
const AddContact = dynamic(() => import('components/sections/crm/add-contact'), {
  ssr: false,
  loading: () => <Typography variant="body2">加载中…</Typography>,
});

// 验证2:Inspector 属性双向绑定的真实闭环——DealDetailsHeader 只有一个必填 props(title: string),
// 用 React state 接 Inspector 的输入框,传给这个真实组件,不是写死文案。
const DealDetailsHeader = dynamic(
  () => import('components/sections/crm/deal-details/page-header/DealDetailsHeader'),
  { ssr: false, loading: () => <Typography variant="body2">加载中…</Typography> },
);

const InspectorBoundDeal = () => {
  const [title, setTitle] = useState('示例 Deal 标题(可编辑)');
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} sx={{ gap: 2, alignItems: 'flex-start' }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <DealDetailsHeader title={title} />
      </Box>
      <Paper sx={{ p: 2, width: { xs: '100%', md: 280 } }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Inspector · title
        </Typography>
        <TextField
          fullWidth
          size="small"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Paper>
    </Stack>
  );
};

const BlankCanvas = () => {
  const { setNodeRef, isOver } = useDroppable({ id: BLANK_CANVAS_ID });
  return (
    <Box
      ref={setNodeRef}
      sx={{
        minHeight: '100vh',
        width: '100%',
        bgcolor: isOver ? 'action.hover' : 'background.default',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <Box>
        <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mb: 2 }}>
          验证1 · 动态挂载:crm/AddContact(真实组件,非占位卡片)
        </Typography>
        <AddContact />
      </Box>
      <Box>
        <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mb: 2 }}>
          验证2 · Inspector 双向绑定:crm/DealDetailsHeader(改右侧输入框,标题实时变)
        </Typography>
        <InspectorBoundDeal />
      </Box>
    </Box>
  );
};

const Page = () => (
  <DndContext>
    <BlankCanvas />
  </DndContext>
);

export default Page;
