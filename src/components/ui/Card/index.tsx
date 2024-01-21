import Image from 'next/image';
import { ComponentProps } from 'react';

interface ICardProps extends ComponentProps<'section'> {
  articlePreview: {
    category: string;
    title: string;
    description?: string;
    tags: Array<string>;
    thumbnail: { src?: string; alt: string };
    createdAt: string;
  };
}

const Card = ({
  articlePreview: { category, tags, thumbnail, title, description, createdAt },
}: ICardProps) => {
  console.log('✅ thumbnail', thumbnail);
  return (
    <section className='relative w-100 aspect-square gap-y-3 rounded-xl overflow-hidden grid grid-cols-2 grid-rows-[1.5fr_15%_1fr] group'>
      <div className='relative col-span-2 row-span-2 before:z-10 before:absolute before:left-1/2 before:-bottom-3 before:-translate-x-1/4 before:w-12 before:h-12 before:rounded-full before:shadow-[-24px_24px_0px_rgb(37,99,235)] after:absolute after:w-6 after:h-6 after:bottom-0 after:left-1/2 after:rounded-full after:shadow-[-12px_12px_0px_rgb(256,256,256)]'>
        <Image
          src={
            thumbnail?.src ??
            'https://images.unsplash.com/photo-1705437576510-cd12ae0ebb68?q=80&w=1168&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          }
          alt={thumbnail?.alt ?? '아티클 프리뷰 이미지'}
          fill
          className='object-cover rounded-xl'
        />
      </div>
      <div className='absolute right-0 col-start-2 col-end-3 row-start-1 row-end-2 bg-white h-1/5 w-2/3 rounded-bl-xl group-hover:opacity-0 transition-opacity duration-500 before:absolute before:w-6 before:h-6 before:rounded-full before:top-0 before:-left-6 before:shadow-[12px_-12px_0px_rgb(256,256,256)] after:absolute after:w-6 after:h-6 after:rounded-full after:top-full after:right-0 after:shadow-[12px_-12px_0px_rgb(256,256,256)]'>
        <div className='flex items-center justify-center w-full h-full'>
          <p className='font-medium text-blue-600 text-body2'>{createdAt}</p>
        </div>
      </div>
      <div className='absolute w-full h-full col-start-1 col-end-2 row-start-2 row-end-3 bg-white border-white rounded-tr-3xl border-t-12 border-r-12 before:absolute before:w-6 before:h-6 before:-translate-y-9 before:rounded-full before:shadow-[-12px_12px_0px_rgb(256,256,256)]'>
        <div className='w-full h-[calc(100%+12px)] bg-blue-600 rounded-t-xl flex items-center justify-center p-2 pb-5'>
          <p className='z-20 flex items-center justify-center w-full h-full font-semibold text-blue-600 rounded text-body1 bg-blue-50'>
            {category}
          </p>
        </div>
      </div>
      <div className='z-20 flex flex-col justify-between col-span-2 px-3 py-2 bg-blue-600 rounded-tr-xl rounded-b-xl'>
        <div className='space-y-2'>
          <h2 className='font-bold text-heading5 text-blue-50 line-clamp-1'>
            {title}
          </h2>
          <p className='text-body2 text-blue-50/75 line-clamp-2'>
            {description}
          </p>
        </div>
        <div className='flex gap-2 flex-nowrap whitespace-nowrap'>
          {tags.map((tag) => (
            <span key={tag} className='px-1 text-caption1 text-blue-50/50'>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Card;
