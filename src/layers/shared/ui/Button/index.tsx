import { cls } from '@shared';
import type { ComponentPropsWithoutRef } from 'react';

interface IButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant: 'primary' | 'secondary' | 'text';
}

export const Button = ({ className, ...props }: IButtonProps) => {
  return <button className={cls(className)} {...props} />;
};
