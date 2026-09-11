import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { PropsWithChildren, useEffect, useMemo } from 'react';
import { useSettingsContext } from 'providers/SettingsProvider';
import rtlPlugin from 'stylis-plugin-rtl';

const createRtlCache = () => {
  const cache = createCache({
    key: 'aurorartl',
    stylisPlugins: [rtlPlugin],
  });
  cache.compat = true;

  return cache;
};

const createLtrCache = () => {
  const cache = createCache({
    key: 'aurora',
  });
  cache.compat = true;

  return cache;
};

const RTLMode = ({ children }: PropsWithChildren) => {
  const {
    config: { textDirection },
  } = useSettingsContext();

  const cache = useMemo(
    () => (textDirection === 'rtl' ? createRtlCache() : createLtrCache()),
    [textDirection],
  );

  useEffect(() => {
    document.dir = textDirection;
  }, [textDirection]);

  return <CacheProvider value={cache}>{children}</CacheProvider>;
};

export default RTLMode;
