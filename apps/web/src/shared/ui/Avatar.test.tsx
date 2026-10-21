import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { classSet } from '@/test/classes';
import { Avatar } from './Avatar';

const BOX = 'rounded-full overflow-hidden bg-surface border border-border flex-shrink-0';

describe('Avatar', () => {
  it('should size a numeric avatar inline and request the image at that size', () => {
    render(<Avatar src="https://img/a.png" alt="하루" size={30} />);
    const img = screen.getByRole('img', { name: '하루' });
    expect(img.parentElement).toHaveStyle({ width: '30px', height: '30px' });
    expect(classSet(img.parentElement)).toEqual(classSet(BOX));
    expect(img).toHaveAttribute('width', '30');
  });

  it('should size the responsive lg avatar with classes and request the largest size', () => {
    render(<Avatar src="https://img/a.png" alt="하루" size="lg" />);
    const img = screen.getByRole('img', { name: '하루' });
    expect(img.parentElement?.getAttribute('style')).toBeNull();
    expect(classSet(img.parentElement)).toEqual(classSet(`${BOX} w-12 h-12 sm:w-20 sm:h-20`));
    expect(img).toHaveAttribute('width', '80');
  });

  it('should fall back to the initial when there is no image or it fails to load', () => {
    const { rerender } = render(<Avatar src={null} alt="하루" />);
    expect(screen.getByText('하')).toBeInTheDocument();

    rerender(<Avatar src="https://img/broken.png" alt="garam" />);
    fireEvent.error(screen.getByRole('img', { name: 'garam' }));
    expect(screen.getByText('G')).toBeInTheDocument();
  });
});
