'use client';

import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { type TaskFileAttachment, taskDetailsData } from 'data/project/task-details';
import { getFileExtension, getFileIcon } from 'lib/utils';
import Attachment from 'components/base/Attachment';
import FileDropZone from 'components/base/FileDropZone';

const formatFileSize = (bytes: number) => `${(bytes / 1024).toFixed(1)} kb`;

const FileRow = ({ item }: { item: TaskFileAttachment }) => (
  <Attachment
    data={{ filename: item.filename, image: item.image, icon: item.icon }}
    secondaryContent={
      item.size ? (
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          {item.size}
        </Typography>
      ) : undefined
    }
  />
);

const FilesSection = () => {
  const [attachments, setAttachments] = useState<TaskFileAttachment[]>(
    () => taskDetailsData.attachments,
  );

  const onDrop = (acceptedFiles: File[]) => {
    const newItems: TaskFileAttachment[] = acceptedFiles.map((file) => {
      const isImage = file.type.startsWith('image/');
      const ext = getFileExtension(file.name).toLowerCase();
      return {
        id: `${file.name}-${Date.now()}`,
        filename: file.name,
        time: '',
        addedBy: '',
        size: formatFileSize(file.size),
        file,
        ...(isImage && { image: URL.createObjectURL(file) }),
        ...(!isImage && { icon: getFileIcon(ext) }),
      };
    });
    setAttachments((prev) => [...newItems, ...prev]);
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        height: 1,
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 700,
          mb: 2,
        }}
      >
        Files
      </Typography>
      <Box sx={{ mb: 2, flexShrign: 0 }}>
        {attachments.map((item) => (
          <FileRow key={item.id} item={item} />
        ))}
      </Box>
      <FileDropZone
        multiple
        accept={{
          'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.avif', '.webp'],
          'video/*': ['.mp4', '.mov'],
          'application/pdf': ['.pdf'],
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
          'application/msword': ['.doc'],
          'application/zip': ['.zip'],
        }}
        onDrop={onDrop}
        previewType="none"
        sx={{ px: { xs: 0, md: 2 }, height: { xs: 'auto', md: 60 }, flex: 1, minHeight: 60 }}
      />
    </Box>
  );
};

export default FilesSection;
