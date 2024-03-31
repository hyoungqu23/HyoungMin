import { cls } from '@/src/layers/shared/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';
import { IArticlePreview } from '@/src/services/articles/model';

interface ICardProps extends ComponentPropsWithoutRef<'a'> {
  articlePreview: IArticlePreview;
}

export const Card = ({
  articlePreview: {
    category,
    tags,
    thumbnail,
    title,
    description,
    createdAt,
    slug,
  },
  className,
  ...props
}: ICardProps) => {
  return (
    <Link
      href={slug}
      className={cls(
        'relative my-8 w-full hover:-translate-y-2 active:scale-95 transition-all duration-300 tablet:w-100 aspect-square gap-y-3 rounded-xl overflow-hidden grid grid-cols-2 grid-rows-[1.5fr_15%_1fr] group',
        className,
      )}
      {...props}
    >
      <div className='relative col-span-2 bg-white row-span-2 rounded-br-xl before:z-10 before:absolute before:left-1/2 before:-bottom-3 before:-translate-x-1/4 before:w-12 before:h-12 before:rounded-full before:shadow-[-24px_24px_0px_rgb(61,82,255)] after:absolute after:w-6 after:h-6 after:bottom-0 after:left-1/2 after:rounded-full after:shadow-[-12px_12px_0px_rgb(23,23,23)]'>
        {thumbnail.src ? (
          <Image
            src={thumbnail.src}
            alt={thumbnail?.alt ?? title}
            fill
            className='object-cover rounded-xl'
            sizes='100vw, (min-width: 768px) 50vw, (min-width: 1280px) 30vw, (min-width: 1280px) 25vw'
          />
        ) : (
          <div className='flex items-center justify-center w-full h-full px-4 bg-white rounded-br-xl'>
            <h2 className='font-bold text-primary-600 text-heading4 line-clamp-1'>
              {title}
            </h2>
          </div>
        )}
      </div>
      <div className='absolute right-0 col-start-2 col-end-3 row-start-1 row-end-2 bg-secondary-500 h-1/5 w-2/3 rounded-bl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 before:absolute before:w-6 before:h-6 before:rounded-full before:top-0 before:-left-6 before:shadow-[12px_-12px_0px_rgb(23,23,23)] after:absolute after:w-6 after:h-6 after:rounded-full after:top-full after:right-0 after:shadow-[12px_-12px_0px_rgb(23,23,23)]'>
        <div className='flex items-center justify-center w-full h-full'>
          <p className='font-medium text-primary-600 text-body2'>{createdAt}</p>
        </div>
      </div>
      <div className='absolute w-full h-full col-start-1 col-end-2 row-start-2 row-end-3 bg-secondary-500 border-secondary-500 rounded-tr-3xl border-t-12 border-r-12 before:absolute before:w-6 before:h-6 before:-translate-y-9 before:rounded-full before:shadow-[-12px_12px_0px_rgb(23,23,23)]'>
        <div className='w-full h-[calc(100%+12px)] bg-primary-900 rounded-t-xl flex items-center justify-center p-2 pb-5'>
          <p className='z-20 flex items-center justify-center w-full h-full font-semibold rounded text-primary-600 text-body1 bg-primary-50'>
            {category}
          </p>
        </div>
      </div>
      <div className='z-20 flex flex-col justify-between col-span-2 px-3 py-2 bg-primary-900 rounded-tr-xl rounded-b-xl'>
        <div className='space-y-2'>
          <h2 className='font-bold text-heading5 text-primary-50 line-clamp-1'>
            {title}
          </h2>
          <p className='text-body2 text-primary-50/75 line-clamp-2'>
            {description}
          </p>
        </div>
        <div className='flex gap-1 flex-nowrap whitespace-nowrap'>
          {tags.map((tag) => (
            <span key={tag} className='px-1 text-caption1 text-primary-50/50'>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};
