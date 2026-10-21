import { fireEvent, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useOutsideClick } from './useOutsideClick';

function Box({ onOutside }: { onOutside: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, onOutside);
  return (
    <div>
      <div ref={ref}>
        <button>inside</button>
      </div>
      <button>outside</button>
    </div>
  );
}

describe('useOutsideClick', () => {
  it('should fire only for mousedown outside the element, and stop after unmount', () => {
    const onOutside = vi.fn();
    const { unmount } = render(<Box onOutside={onOutside} />);

    fireEvent.mouseDown(screen.getByText('inside'));
    expect(onOutside).not.toHaveBeenCalled();

    fireEvent.mouseDown(screen.getByText('outside'));
    expect(onOutside).toHaveBeenCalledTimes(1);

    unmount();
    fireEvent.mouseDown(document.body);
    expect(onOutside).toHaveBeenCalledTimes(1);
  });
});
