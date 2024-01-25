import { COPYRIGHT, LINKS } from '@/src/assets/constants';
import AutoInfiniteSkills from '@/src/components/ui/Footer/AutoInfiniteSkills';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className='tablet:h-[25vh] h-[33vh] w-screen overflow-x-hidden px-4 flex flex-col justify-between pb-4'>
      <AutoInfiniteSkills />
      <ul className='flex flex-row flex-wrap justify-end font-medium tablet:gap-x-8 gap-x-3 tablet:text-heading2 text-heading4'>
        {LINKS.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className='block transition-colors duration-1000 text-primary-50 hover:text-primary-500'
          >
            {link.id.toUpperCase()}
          </Link>
        ))}
      </ul>
      <span className='block text-center text-primary-50/75 text-caption1'>
        {COPYRIGHT}
      </span>
    </footer>
  );
};

export default Footer;
