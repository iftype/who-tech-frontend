import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProfileLinks } from './ProfileLinks';

describe('ProfileLinks', () => {
  it('should link to GitHub and the blog, with labels hidden on small screens', () => {
    const { container } = render(
      <ProfileLinks
        member={{ githubId: 'crew', blog: 'https://crew.tistory.com' }}
        className="hidden sm:inline-flex"
      />,
    );
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/crew');
    expect(screen.getByRole('link', { name: '블로그' })).toHaveAttribute('href', 'https://crew.tistory.com');
    expect(screen.getByText('GitHub').className).toContain('hidden sm:inline');
    expect(container.firstElementChild!.className).toBe('shrink-0 items-center gap-1 hidden sm:inline-flex');
  });

  it('should omit the blog link when there is no blog', () => {
    render(<ProfileLinks member={{ githubId: 'crew', blog: null }} className="inline-flex" />);
    expect(screen.queryByRole('link', { name: '블로그' })).not.toBeInTheDocument();
  });
});
