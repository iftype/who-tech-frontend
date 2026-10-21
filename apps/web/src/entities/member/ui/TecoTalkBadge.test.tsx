import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { classSet as set } from '@/test/classes';
import { TecoTalkBadge, tecoTalkBadgeVariants } from './TecoTalkBadge';

describe('TecoTalkBadge', () => {
  it('should keep the video chip classes and strip the bracket label from the title', () => {
    render(
      <TecoTalkBadge
        talk={{
          id: 1,
          videoId: 'x',
          title: '[10분 테코톡] 하루의 테스트',
          url: 'https://youtu.be/x',
          thumbnailUrl: null,
          uploadedAt: '2026-10-01T00:00:00.000Z',
          cohort: 8,
        }}
      />,
    );
    const link = screen.getByRole('link', { name: '하루의 테스트' });
    expect(link).toHaveAttribute('href', 'https://youtu.be/x');
    expect(set(tecoTalkBadgeVariants())).toEqual(
      set(
        'inline-flex max-w-[240px] items-center gap-1 rounded border border-video/20 bg-video/10 px-1.5 py-0.5 text-caption text-video hover:bg-video/20',
      ),
    );
  });
});
