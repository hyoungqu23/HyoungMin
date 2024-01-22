import Image from 'next/image';
import Link from 'next/link';
import { ComponentProps } from 'react';

interface ICardProps extends ComponentProps<'a'> {
  articlePreview: {
    category: string;
    title: string;
    description?: string;
    tags: Array<string>;
    thumbnail: { src?: string; alt: string };
    createdAt: string;
    slug: string;
  };
}

const Card = ({
  articlePreview: {
    category,
    tags,
    thumbnail,
    title,
    description,
    createdAt,
    slug,
  },
}: ICardProps) => {
  return (
    <Link
      href={slug}
      className='relative w-100 aspect-square gap-y-3 rounded-xl overflow-hidden grid grid-cols-2 grid-rows-[1.5fr_15%_1fr] group'
    >
      <div className='relative col-span-2 bg-white row-span-2 rounded-br-xl before:z-10 before:absolute before:left-1/2 before:-bottom-3 before:-translate-x-1/4 before:w-12 before:h-12 before:rounded-full before:shadow-[-24px_24px_0px_rgb(59,130,246)] after:absolute after:w-6 after:h-6 after:bottom-0 after:left-1/2 after:rounded-full after:shadow-[-12px_12px_0px_rgb(252,231,243)]'>
        {thumbnail.src ? (
          <Image
            src={thumbnail.src}
            alt={thumbnail?.alt ?? '아티클 프리뷰 이미지'}
            fill
            className='object-cover rounded-xl'
          />
        ) : (
          <div className='bg-white w-full h-full rounded-br-xl flex items-center justify-center px-4'>
            <h2 className='font-bold text-heading4 text-blue-500 line-clamp-1'>
              {title}
            </h2>
          </div>
        )}
      </div>
      <div className='absolute right-0 col-start-2 col-end-3 row-start-1 row-end-2 bg-pink-100 h-1/5 w-2/3 rounded-bl-xl group-hover:opacity-0 transition-opacity duration-500 before:absolute before:w-6 before:h-6 before:rounded-full before:top-0 before:-left-6 before:shadow-[12px_-12px_0px_rgb(252,231,243)] after:absolute after:w-6 after:h-6 after:rounded-full after:top-full after:right-0 after:shadow-[12px_-12px_0px_rgb(252,231,243)]'>
        <div className='flex items-center justify-center w-full h-full'>
          <p className='font-medium text-blue-500 text-body2'>{createdAt}</p>
        </div>
      </div>
      <div className='absolute w-full h-full col-start-1 col-end-2 row-start-2 row-end-3 bg-pink-100 border-pink-100 rounded-tr-3xl border-t-12 border-r-12 before:absolute before:w-6 before:h-6 before:-translate-y-9 before:rounded-full before:shadow-[-12px_12px_0px_rgb(252,231,243)]'>
        <div className='w-full h-[calc(100%+12px)] bg-blue-500 rounded-t-xl flex items-center justify-center p-2 pb-5'>
          <p className='z-20 flex items-center justify-center w-full h-full font-semibold text-blue-500 rounded text-body1 bg-blue-50'>
            {category}
          </p>
        </div>
      </div>
      <div className='z-20 flex flex-col justify-between col-span-2 px-3 py-2 bg-blue-500 rounded-tr-xl rounded-b-xl'>
        <div className='space-y-2'>
          <h2 className='font-bold text-heading5 text-blue-50 line-clamp-1'>
            {title}
          </h2>
          <p className='text-body2 text-blue-50/75 line-clamp-2'>
            {description}
          </p>
        </div>
        <div className='flex gap-1 flex-nowrap whitespace-nowrap'>
          {tags.map((tag) => (
            <span key={tag} className='px-1 text-caption1 text-blue-50/50'>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default Card;
