'use client';

import { useState } from 'react';
import {
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  TextareaAutosize,
  ToggleButton,
  Typography,
  toggleButtonClasses,
} from '@mui/material';
import { type TaskCommentItem, taskDetailsData } from 'data/project/task-details';
import { users } from 'data/users';
import { User } from 'types/users';
import EmojiPicker from 'components/base/EmojiPicker';
import IconifyIcon from 'components/base/IconifyIcon';

const formatCommentTime = (iso: string) => {
  const date = new Date(iso);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const timePart = date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  if (isToday) return `Today at ${timePart}`;
  if (isYesterday) return `Yesterday at ${timePart}`;

  const datePart = date.toLocaleDateString([], {
    day: '2-digit',
    month: 'short',
  });

  return `${datePart} at ${timePart}`;
};

const TaskComments = () => {
  const [comments, setComments] = useState<TaskCommentItem[]>(() => taskDetailsData.comments);
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!message.trim()) return;

    setComments((prev) => [
      {
        id: String(Date.now()),
        name: 'You',
        time: new Date().toISOString(),
        text: message.trim(),
        likeCount: 0,
        liked: false,
        author: users[1],
        online: true,
      },
      ...prev,
    ]);

    setMessage('');
  };

  const handleLikeToggle = (id: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === id
          ? {
              ...comment,
              liked: !comment.liked,
              likeCount: comment.liked ? comment.likeCount - 1 : comment.likeCount + 1,
            }
          : comment,
      ),
    );
  };

  return (
    <Paper
      sx={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        p: { xs: 2, md: 3 },
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 700,
          mb: 4,
        }}
      >
        Comments
      </Typography>
      <Stack
        sx={{
          gap: 3,
          flex: 1,
          minHeight: 0,
          overflow: 'auto',
          mb: 2,
        }}
      >
        {comments.map((comment) => (
          <Stack
            key={comment.id}
            direction="row"
            sx={{
              gap: 2,
              alignItems: 'flex-start',
            }}
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
              color="success"
              invisible={!comment.online}
            >
              <Avatar
                src={(comment.author as User)?.avatar}
                alt={comment.name}
                sx={{ width: 40, height: 40 }}
              >
                {!comment.author?.avatar && comment.name.charAt(0)}
              </Avatar>
            </Badge>

            <Box
              sx={{
                flex: 1,
              }}
            >
              <Stack sx={{ gap: 0.5, mb: 1 }}>
                <Stack
                  direction="row"
                  sx={{
                    gap: 0.5,
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    {comment.name}
                  </Typography>
                  {comment.verified && (
                    <IconifyIcon
                      icon="mdi:check-circle"
                      sx={{ fontSize: 16, color: 'success.main' }}
                    />
                  )}
                </Stack>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  {formatCommentTime(comment.time)}
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                sx={{
                  fontSize: 14,
                  color: 'text.secondary',
                  mb: 2,
                }}
              >
                {comment.text}
              </Typography>
              <Stack
                direction="row"
                sx={{
                  gap: 1,
                  alignItems: 'center',
                }}
              >
                <ToggleButton
                  value="like"
                  size="small"
                  disableRipple
                  selected={comment.liked}
                  onChange={() => handleLikeToggle(comment.id)}
                  aria-label="Like comment"
                  sx={{
                    '&:hover': {
                      bgcolor: 'transparent',
                    },
                    [`&.${toggleButtonClasses.selected}`]: {
                      bgcolor: 'transparent',
                      '&:hover': {
                        bgcolor: 'transparent',
                      },
                    },
                  }}
                >
                  <Stack direction="row" sx={{ gap: 0.5, alignItems: 'center' }}>
                    <IconifyIcon
                      icon={
                        comment.liked
                          ? 'material-symbols:favorite'
                          : 'material-symbols:favorite-outline'
                      }
                      sx={{
                        fontSize: 18,
                        color: comment.liked ? 'error.main' : 'text.secondary',
                      }}
                    />
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: 'inherit',
                        textBoxEdge: 'cap',
                        textBoxTrim: 'trim-both',
                      }}
                    >
                      {comment.likeCount}
                    </Typography>
                  </Stack>
                </ToggleButton>

                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: 'primary.main',
                  }}
                >
                  Reply
                </Typography>
              </Stack>
            </Box>
          </Stack>
        ))}
      </Stack>
      <Box
        sx={{
          position: 'relative',
          p: 2,
          pb: 6,
          bgcolor: 'background.elevation2',
          borderRadius: 2,
        }}
      >
        <TextareaAutosize
          minRows={3}
          placeholder="Write a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          style={{
            width: '100%',
            border: 'none',
            outline: 'none',
            resize: 'none',
            background: 'transparent',
            fontSize: 16,
            fontFamily: 'inherit',
            padding: 0,
          }}
        />

        <Box sx={{ position: 'absolute', bottom: 16, left: 16 }}>
          <EmojiPicker
            handleEmojiSelect={(emoji) => setMessage((prev) => prev + emoji)}
            actionButtonEle={
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <IconifyIcon icon="material-symbols:mood-outline-rounded" sx={{ fontSize: 20 }} />
              </IconButton>
            }
          />
        </Box>

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            borderRadius: 3,
            textTransform: 'none',
            px: 3,
          }}
        >
          Comment
        </Button>
      </Box>
    </Paper>
  );
};
export default TaskComments;
