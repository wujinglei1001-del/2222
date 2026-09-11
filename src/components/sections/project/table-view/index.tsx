'use client';

import Stack from '@mui/material/Stack';
import { followingMonthTasks, nextMonthTasks, thisMonthTasks } from 'data/project/table-data';
import ProjectTableSection from './ProjectTableSection';

const TableViewMain = () => {
  return (
    <Stack sx={{ gap: 4 }}>
      <ProjectTableSection title="This Month" barColor="success" tableData={thisMonthTasks} />
      <ProjectTableSection title="Next Month" barColor="warning" tableData={nextMonthTasks} />
      <ProjectTableSection
        title="Following Month"
        barColor="primary"
        tableData={followingMonthTasks}
      />
    </Stack>
  );
};

export default TableViewMain;
