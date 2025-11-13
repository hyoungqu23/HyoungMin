'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 하이드레이션 불일치 방지
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // 서버 사이드 렌더링 시 버튼만 렌더링 (아이콘 없음)
    return (
      <button
        type='button'
        aria-label='Toggle theme'
        className='p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-10 h-10'
        disabled
      />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type='button'
      aria-label='Toggle theme'
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className='p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
    >
      {isDark ? (
        <SunIcon className='h-6 w-6' />
      ) : (
        <MoonIcon className='h-6 w-6' />
      )}
    </button>
  );
};

export default ThemeToggle;

