import type { ThemeOptions } from '../../src/types/svg';

const fullUrl = 'https://5svg.com';

export const addFullUrl = (value: string | ThemeOptions): string | ThemeOptions => {
  if (typeof value === 'string') {
    return `${fullUrl}${value}`;
  } else if (typeof value === 'object') {
    return {
      light: `${fullUrl}${value.light}`,
      dark: `${fullUrl}${value.dark}`
    };
  }
  return value;
};

