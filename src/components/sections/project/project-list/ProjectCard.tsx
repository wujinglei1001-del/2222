'use client';

import { Avatar, AvatarGroup, Box, Chip, Stack, Typography, avatarClasses } from '@mui/material';
import { ProjectListItem } from 'data/project/project-list';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';
import DashboardMenu from 'components/common/DashboardMenu';

interface ProjectCardProps {
  project: ProjectListItem;
  onClick?: () => void;
  selected?: boolean;
}

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'Doing':
      return 'primary';
    case 'Done':
      return 'success';
    case 'To do':
      return 'neutral';
    default:
      return 'neutral';
  }
};

const ProjectCard = ({ project, onClick, selected }: ProjectCardProps) => {
  return (
    <Box
      sx={{
        overflow: 'hidden',
        borderRadius: 6,
        bgcolor: selected ? 'background.elevation1' : 'background.paper',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          bgcolor: 'background.elevation1',
        },
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          position: 'relative',
          height: 172,
          width: '100%',
          overflow: 'hidden',
          borderRadius: 6,
          '&:hover .project-card-image': {
            transform: 'scale(1.08)',
          },
        }}
      >
        <Image
          className="project-card-image"
          src={project.image}
          alt={project.name}
          fill
          sx={{
            objectFit: 'cover',
            borderRadius: 6,
            transition: 'transform 0.35s ease-in-out',
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180.55deg, rgba(0, 0, 0, 0) 35.03%, #000000 99.52%)',
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 3,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: 'common.white',
            }}
          >
            {project.name}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ px: 3, py: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Stack
            direction="row"
            sx={{
              gap: 1.5,
              alignItems: 'center',
            }}
          >
            <IconifyIcon
              icon="material-symbols:star-rounded"
              color="warning.main"
              sx={{ fontSize: 18 }}
            />
            <Chip
              label={project.status}
              variant="soft"
              color={getStatusBadgeColor(project.status)}
              sx={{
                textTransform: 'capitalize',
                fontWeight: 500,
                fontSize: '0.875rem',
              }}
            />
          </Stack>

          <AvatarGroup
            max={4}
            sx={{
              [`& .${avatarClasses.root}`]: {
                width: 24,
                height: 24,
                fontSize: 12,
                border: '2px solid',
                borderColor: 'background.paper',
              },
            }}
          >
            {project.collaborators.map((collaborator, index) => (
              <Avatar key={index} alt={collaborator.name} src={collaborator.avatar} />
            ))}
          </AvatarGroup>
        </Stack>

        <Stack
          direction="row"
          sx={{
            gap: 2,
            alignItems: 'center',
          }}
        >
          <Typography component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconifyIcon
              icon="material-symbols:check-box-outline"
              sx={{ color: 'text.secondary' }}
            />
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
              {project.tasks.completed}/{project.tasks.total}
            </Typography>
          </Typography>
          <Typography component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconifyIcon
              icon="material-symbols:comment-outline"
              sx={{ color: 'text.secondary', mb: '-1px' }}
            />
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
              {project.comments}
            </Typography>
          </Typography>
        </Stack>

        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.875rem',
            }}
          >
            Last opened: {project.lastOpened}
          </Typography>
          <DashboardMenu icon={<IconifyIcon fontSize={18} icon="material-symbols:more-horiz" />} />
        </Stack>
      </Box>
    </Box>
  );
};

export default ProjectCard;
