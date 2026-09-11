'use client';

import { type Dispatch, JSX, MouseEvent, type SetStateAction } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Box,
  Button,
  Step,
  StepButton,
  StepConnector,
  StepContent,
  Stepper,
  Typography,
  stepConnectorClasses,
  stepIconClasses,
  stepLabelClasses,
} from '@mui/material';
import DefaultView from 'components/sections/project/create-project/steps/DefaultView';
import Group from 'components/sections/project/create-project/steps/Group';
import InviteMembers from 'components/sections/project/create-project/steps/InviteMembers';
import ProjectTitle from 'components/sections/project/create-project/steps/ProjectTitle';
import Status from 'components/sections/project/create-project/steps/Status';
import Tasks from 'components/sections/project/create-project/steps/Tasks';
import type { CreateProjectFormValues } from 'components/sections/project/create-project/useCreateProjectStepper';

interface StepDefinition {
  label: string;
  description: string;
  content: JSX.Element;
}

const steps: StepDefinition[] = [
  {
    label: 'Project title',
    description: 'Tell us the title of your project',
    content: <ProjectTitle />,
  },
  {
    label: 'Tasks',
    description: 'What are some tasks you would like to get done',
    content: <Tasks />,
  },
  {
    label: 'Group',
    description: 'Group these tasks into different stages',
    content: <Group />,
  },
  {
    label: 'Status',
    description: 'Set different statuses to attach with different task',
    content: <Status />,
  },
  {
    label: 'Invite members',
    description: 'Add collaborators to your project',
    content: <InviteMembers />,
  },
  {
    label: 'Default View',
    description: 'Choose a default view to start',
    content: <DefaultView />,
  },
];

const getBorderColor = (index: number, activeStep: number, completedSteps: number[]) => {
  if (completedSteps.includes(index)) return 'success.main';
  if (index <= activeStep) return 'primary.main';
  return 'dividerLight';
};

interface CreateProjectStepperProps {
  activeStep: number;
  setActiveStep: (step: number) => void;
  completedSteps: number[];
  setCompletedSteps: Dispatch<SetStateAction<number[]>>;
}

const CreateProjectStepper = ({
  activeStep,
  setActiveStep,
  completedSteps,
  setCompletedSteps,
}: CreateProjectStepperProps) => {
  const { trigger } = useFormContext<CreateProjectFormValues>();

  const handleContinue = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const isValid = await trigger();
    if (!isValid) return;

    setCompletedSteps((prev) => (prev.includes(activeStep) ? prev : [...prev, activeStep]));
    setActiveStep(activeStep + 1);
  };

  const handleBack = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setActiveStep(Math.max(activeStep - 1, 0));
  };

  return (
    <Box sx={{ pt: { xs: 3, md: 5 }, pr: 1 }}>
      <Stepper nonLinear activeStep={activeStep} orientation="vertical" connector={null}>
        {steps.map((step, index) => (
          <Step
            key={step.label}
            completed={completedSteps.includes(index)}
            sx={{
              [`& .${stepConnectorClasses.line}`]: {
                borderWidth: 0,
              },
            }}
          >
            <StepButton
              disableRipple
              onClick={() => setActiveStep(index)}
              sx={{
                py: 0,
                [`& .${stepLabelClasses.iconContainer}`]: {
                  pr: 2,
                  fontWeight: 500,
                  [`& .${stepIconClasses.root}`]: {
                    width: 24,
                    height: 24,
                  },
                },
                [`& .${stepLabelClasses.root}`]: {
                  py: 0,
                },
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: activeStep === index ? 700 : 500,
                  }}
                >
                  {step.label}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  {step.description}
                </Typography>
              </Box>
            </StepButton>

            <StepContent
              sx={{
                pl: 3.5,
                pr: 0,
                my: 1,
                borderColor: getBorderColor(index, activeStep, completedSteps),
                borderLeftWidth: 2,
              }}
            >
              <Box sx={{ mt: 2, mb: { xs: 2, md: 4 } }}>{step.content}</Box>

              <Box sx={{ display: 'flex', gap: 0.5, pb: 3, justifyContent: 'flex-end' }}>
                {activeStep > 0 && (
                  <Button variant="soft" color="neutral" onClick={handleBack} type="button">
                    Back
                  </Button>
                )}

                {steps.length - 1 === activeStep ? (
                  <Button variant="contained" type="submit">
                    Create project
                  </Button>
                ) : (
                  <Button variant="soft" onClick={handleContinue} type="button">
                    Continue
                  </Button>
                )}
              </Box>
            </StepContent>

            <StepConnector
              sx={{
                mt: 1,
                mb: 0.5,
                minHeight: 24,
                ...(activeStep === index && { display: 'none' }),
                ...(index + 1 === steps.length && { display: 'none' }),
                ...(activeStep !== index && {
                  borderColor: completedSteps.includes(index) ? 'success.main' : 'dividerLight',
                  borderLeftStyle: 'solid',
                  borderLeftWidth: 2,
                }),
              }}
            />
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default CreateProjectStepper;
