import { cls } from '@/src/libs/utils';
import type { ComponentPropsWithoutRef } from 'react';

interface IButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant: 'primary' | 'secondary' | 'text';
}

const Button = ({ className, ...props }: IButtonProps) => {
  return <button className={cls(className)} {...props} />;
};

export default Button;
