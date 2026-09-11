'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Task } from 'data/project/table-data';
import { PaletteColorKey } from 'types/theme';
import ProjectTable from './ProjectTable';

interface ProjectTableSectionProps {
  title: string;
  barColor: PaletteColorKey;
  tableData: Task[];
}

const ProjectTableSection = ({ title, barColor, tableData }: ProjectTableSectionProps) => {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '4px auto', gap: { xs: 2, md: 4 } }}>
      <Box sx={{ borderRadius: 0.5, bgcolor: `${barColor}.main`, height: 1 }} />
      <Stack sx={{ gap: 1, flexGrow: 1, overflowX: 'auto' }}>
        <Typography
          variant="h6"
          sx={{
            lineHeight: 1.5,
          }}
        >
          {title}
        </Typography>
        <ProjectTable tableData={tableData} />
      </Stack>
    </Box>
  );
};

export default ProjectTableSection;
