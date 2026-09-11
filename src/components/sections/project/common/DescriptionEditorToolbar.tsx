'use client';

import {
  MenuButtonAlignCenter,
  MenuButtonAlignJustify,
  MenuButtonAlignLeft,
  MenuButtonAlignRight,
  MenuButtonBold,
  MenuButtonCode,
  MenuButtonItalic,
  MenuButtonUnderline,
  MenuControlsContainer,
  MenuDivider,
} from 'mui-tiptap';
import IconifyIcon from 'components/base/IconifyIcon';

const DescriptionEditorToolbar = () => (
  <MenuControlsContainer>
    <MenuButtonBold
      IconComponent={() => (
        <IconifyIcon
          sx={{ pointerEvents: 'none' }}
          icon="material-symbols:format-bold-rounded"
          fontSize={20}
        />
      )}
    />
    <MenuButtonItalic
      IconComponent={() => (
        <IconifyIcon
          sx={{ pointerEvents: 'none' }}
          icon="material-symbols:format-italic-rounded"
          fontSize={20}
        />
      )}
    />
    <MenuButtonUnderline
      IconComponent={() => (
        <IconifyIcon
          sx={{ pointerEvents: 'none' }}
          icon="material-symbols:format-underlined-rounded"
          fontSize={20}
        />
      )}
    />
    <MenuDivider />
    <MenuButtonAlignLeft
      IconComponent={() => (
        <IconifyIcon
          sx={{ pointerEvents: 'none' }}
          icon="material-symbols:format-align-left-rounded"
          fontSize={20}
        />
      )}
    />
    <MenuButtonAlignCenter
      IconComponent={() => (
        <IconifyIcon
          sx={{ pointerEvents: 'none' }}
          icon="material-symbols:format-align-center-rounded"
          fontSize={20}
        />
      )}
    />
    <MenuButtonAlignRight
      IconComponent={() => (
        <IconifyIcon
          sx={{ pointerEvents: 'none' }}
          icon="material-symbols:format-align-right-rounded"
          fontSize={20}
        />
      )}
    />
    <MenuButtonAlignJustify
      IconComponent={() => (
        <IconifyIcon
          sx={{ pointerEvents: 'none' }}
          icon="material-symbols:format-align-justify-rounded"
          fontSize={20}
        />
      )}
    />
    <MenuDivider />
    <MenuButtonCode
      IconComponent={() => (
        <IconifyIcon
          sx={{ pointerEvents: 'none' }}
          icon="material-symbols:code-rounded"
          fontSize={20}
        />
      )}
    />
  </MenuControlsContainer>
);

export default DescriptionEditorToolbar;
