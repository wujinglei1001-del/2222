'use client';

import { createContext, useContext } from 'react';

export type ProjectHeaderToolbarLayout = 'inline' | 'stacked';

const ProjectHeaderToolbarLayoutContext = createContext<ProjectHeaderToolbarLayout>('inline');

export const ProjectHeaderToolbarLayoutProvider = ProjectHeaderToolbarLayoutContext.Provider;

export const useProjectHeaderToolbarLayout = (): ProjectHeaderToolbarLayout =>
  useContext(ProjectHeaderToolbarLayoutContext);
