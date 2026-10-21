import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { makeMember } from '@/test/fixtures/member';
import { MemberBadgeSet } from './MemberBadgeSet';

const badges = () => screen.getAllByText(/^(\d기|크루|코치|리뷰어|FE|BE|AN|팀 블로그)$/).map((el) => el.textContent);

describe('MemberBadgeSet', () => {
  it('should show the track and, per cohort, crew alone or the non-crew roles', () => {
    render(
      <MemberBadgeSet
        member={makeMember('crew', {
          tracks: ['frontend'],
          cohorts: [
            { cohort: 8, roles: ['crew', 'coach'] },
            { cohort: 7, roles: ['coach', 'reviewer'] },
          ],
        })}
      />,
    );
    expect(badges()).toEqual(['FE', '8기', '크루', '7기', '코치', '리뷰어']);
  });

  it('should fall back to the primary cohort and non-crew roles when cohorts are missing', () => {
    render(
      <MemberBadgeSet
        member={makeMember('old', { tracks: ['backend'], cohort: 6, roles: ['crew', 'reviewer'], cohorts: undefined })}
      />,
    );
    expect(badges()).toEqual(['BE', '6기', '리뷰어']);
  });

  it('should render only the team pill for a team blog', () => {
    const { container } = render(<MemberBadgeSet member={makeMember('team', { isTeamBlog: true, tracks: [] })} />);
    expect(badges()).toEqual(['팀 블로그']);
    expect(container.querySelectorAll('span')).toHaveLength(1);
  });
});
