import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MdxImage } from '../MdxImage';

// Next.js Image 컴포넌트 모킹
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => {
    return <img src={src} alt={alt} {...props} />;
  },
}));

describe('MdxImage', () => {
  it('should render Next Image component with correct props', () => {
    const { container } = render(<MdxImage src='/test-image.jpg' alt='Test image' />);

    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img?.getAttribute('src')).toBe('/test-image.jpg');
    expect(img?.getAttribute('alt')).toBe('Test image');
  });

  it('should return null when src is not a string', () => {
    const { container } = render(<MdxImage src={undefined} alt='Test' />);

    expect(container.firstChild).toBeNull();
  });

  it('should use default alt when alt is not a string', () => {
    const { container } = render(<MdxImage src='/test.jpg' alt={undefined} />);

    const img = container.querySelector('img');
    expect(img?.getAttribute('alt')).toBe('');
  });
});
