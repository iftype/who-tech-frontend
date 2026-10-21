import { describe, expect, it } from 'vitest';
import { getBlogSource } from './source';

describe('getBlogSource', () => {
  it.each([
    ['https://velog.io/@crew/post', 'Velog'],
    ['https://crew.tistory.com/1', 'Tistory'],
    ['https://medium.com/@crew/x', 'Medium'],
    ['https://crew.github.io/blog', 'GitHub'],
    ['https://brunch.co.kr/@crew/1', 'Brunch'],
    ['https://crew.notion.site/page', 'Notion'],
    ['https://www.notion.so/page', 'Notion'],
    ['https://example.com', null],
  ])('should detect %s as %s', (url, expected) => {
    expect(getBlogSource(url)).toBe(expected);
  });
});
