import { COPYRIGHT, LINKS } from '@shared';
import Link from 'next/link';
import AutoInfiniteSkills from './AutoInfiniteSkills';

export const Footer = () => {
  return (
    <footer className='tablet:h-[25vh] h-[33vh] w-screen overflow-x-hidden px-4 flex flex-col justify-between pb-4'>
      <AutoInfiniteSkills />
      <ul className='flex flex-row flex-wrap justify-end font-medium tablet:gap-x-8 gap-x-3 tablet:text-heading2 text-heading6'>
        {Object.values(LINKS).map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className='block transition-colors duration-1000 text-primary-50 hover:text-primary-500'
          >
            {link.id.toUpperCase()}
          </Link>
        ))}
      </ul>
      <span className='block text-center text-primary-50/75 text-caption1'>{COPYRIGHT}</span>
    </footer>
  );
};
