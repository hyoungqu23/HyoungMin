'use client';

import { PropsWithChildren } from 'react';
import useKeyboardShortcuts from './useKeyboardShortcuts';

const KeyboardShortcutsProvider = ({ children }: PropsWithChildren) => {
  useKeyboardShortcuts();
  return <>{children}</>;
};

export default KeyboardShortcutsProvider;

