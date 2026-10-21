import { describe, expect, it } from 'vitest';
import { postVisitPath } from './links';

describe('post links', () => {
  it('should route a visit through the API proxy so the backend can count it', () => {
    expect(postVisitPath(42)).toBe('/api/members/blog-posts/42/visit');
  });
});
