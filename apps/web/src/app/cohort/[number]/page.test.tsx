import type { ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';

const notFound = vi.fn(() => {
  throw new Error('NEXT_NOT_FOUND');
});
vi.mock('next/navigation', () => ({ notFound }));

const { default: CohortPage } = await import('./page');
const { CohortExplorerPage } = await import('../_lib/CohortExplorerPage');

describe('/cohort/[number]', () => {
  it('should hand a numeric cohort and the search params to the shared page', async () => {
    const tree = (await CohortPage({
      params: Promise.resolve({ number: '8' }),
      searchParams: Promise.resolve({ track: 'backend' }),
    })) as ReactElement;

    expect(tree.type).toBe(CohortExplorerPage);
    expect(tree.props).toEqual({ cohort: 8, searchParams: { track: 'backend' } });
    expect(notFound).not.toHaveBeenCalled();
  });

  it('should 404 for a non-numeric cohort instead of sending NaN to the API', async () => {
    await expect(CohortPage({ params: Promise.resolve({ number: 'abc' }) })).rejects.toThrow('NEXT_NOT_FOUND');
  });
});
