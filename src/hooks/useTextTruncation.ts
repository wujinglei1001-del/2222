'use client';

import { useCallback, useState } from 'react';

interface UseTextTruncationOptions {
  maxLength?: number;
  expandText?: string;
  collapseText?: string;
}

interface UseTextTruncationReturn {
  displayText: string;
  isExpanded: boolean;
  shouldTruncate: boolean;
  toggleExpanded: () => void;
  expand: () => void;
  collapse: () => void;
  expandText: string;
  collapseText: string;
}

export const useTextTruncation = (
  text: string,
  options: UseTextTruncationOptions = {},
): UseTextTruncationReturn => {
  const { maxLength = 130, expandText = 'Read more', collapseText = 'Read less' } = options;

  const [isExpanded, setIsExpanded] = useState(false);

  const shouldTruncate = text.length > maxLength;

  const displayText = shouldTruncate && !isExpanded ? text.substring(0, maxLength) + '...' : text;

  const expand = useCallback(() => setIsExpanded(true), []);
  const collapse = useCallback(() => setIsExpanded(false), []);
  const toggleExpanded = useCallback(() => setIsExpanded((prev) => !prev), []);

  return {
    displayText,
    isExpanded,
    shouldTruncate,
    toggleExpanded,
    expand,
    collapse,
    expandText,
    collapseText,
  };
};
