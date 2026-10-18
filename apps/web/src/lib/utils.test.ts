import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cn, decodeHtml, formatDate, formatRelativeDate, getBlogSource, groupBy } from './utils';

describe('formatRelativeDate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-18T12:00:00Z'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it.each([
    ['2026-10-18T01:00:00Z', '오늘'],
    ['2026-10-17T12:00:00Z', '1일 전'],
    ['2026-10-12T12:00:00Z', '6일 전'],
    ['2026-10-11T12:00:00Z', '1주 전'],
    ['2026-09-19T12:00:00Z', '4주 전'],
    ['2026-09-18T12:00:00Z', '1개월 전'],
    ['2025-10-19T12:00:00Z', '12개월 전'],
    ['2025-10-18T12:00:00Z', '1년 전'],
    ['2023-10-18T12:00:00Z', '3년 전'],
  ])('should format %s as %s', (date, expected) => {
    expect(formatRelativeDate(date)).toBe(expected);
  });
});

describe('formatDate', () => {
  it('should format in Korean long form', () => {
    expect(formatDate('2026-03-05T12:00:00Z')).toBe('2026년 3월 5일');
  });
});

describe('groupBy', () => {
  it('should group items by key preserving order', () => {
    const items = [
      { cohort: '8', id: 1 },
      { cohort: '7', id: 2 },
      { cohort: '8', id: 3 },
    ];
    expect(groupBy(items, (i) => i.cohort)).toEqual({
      '8': [items[0], items[2]],
      '7': [items[1]],
    });
    expect(groupBy([], () => 'x')).toEqual({});
  });
});

describe('cn', () => {
  it('should join truthy class names', () => {
    expect(cn('a', undefined, null, false, 'b', '')).toBe('a b');
  });
});

describe('decodeHtml', () => {
  it('should decode named, decimal, and hex entities', () => {
    expect(decodeHtml('Tom &amp; Jerry &lt;3&gt; &quot;hi&quot; &apos;yo&apos;')).toBe(`Tom & Jerry <3> "hi" 'yo'`);
    expect(decodeHtml('&ldquo;a&rdquo; &lsquo;b&rsquo; c&mdash;d&ndash;e')).toBe(`"a" 'b' c—d–e`);
    expect(decodeHtml('a&nbsp;b&zwj;c')).toBe('a b‍c');
    expect(decodeHtml('&#54620;&#xAE00;')).toBe('한글');
  });

  // &amp;를 먼저 풀어 RSS에서 흔한 이중 인코딩(&amp;lt;)까지 해제한다
  it('should also decode double-encoded entities', () => {
    expect(decodeHtml('&amp;lt;')).toBe('<');
  });
});

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
