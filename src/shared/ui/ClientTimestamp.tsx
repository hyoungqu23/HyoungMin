'use client';

import { formatDate } from '@shared/lib';
import type { ComponentProps } from 'react';

type TClientTimestampProps = ComponentProps<'span'> & {
  date: Date;
};

export const ClientTimestamp = ({ date, ...props }: TClientTimestampProps) => {
  return <span {...props}>{formatDate(date)}</span>;
};
