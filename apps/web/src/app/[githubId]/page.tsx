import type { Metadata } from 'next';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { memberDetailQuery } from '@/entities/member';
import { makeQueryClient } from '@/shared/api/query-client';
import { MemberDetailClient } from './MemberDetailClient';

interface DetailPageProps {
  params: Promise<{ githubId: string }>;
  searchParams?: Promise<{ tab?: string; missionTab?: string }>;
}

// 한 요청 안에서 generateMetadata와 페이지가 같은 QueryClient를 쓴다 → 멤버 상세는 한 번만 받는다
const getRequestQueryClient = cache(makeQueryClient);

async function loadMember(githubId: string) {
  return getRequestQueryClient()
    .fetchQuery(memberDetailQuery(githubId))
    .catch(() => null);
}

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { githubId } = await params;
  const member = await loadMember(githubId);
  if (!member) return {};
  return {
    title: 'who.tech',
    description: `${member.nickname}(@${member.githubId}) 크루의 미션 아카이브와 블로그`,
    openGraph: {
      title: 'who.tech',
      images: member.avatarUrl ? [{ url: member.avatarUrl }] : [],
    },
  };
}

export default async function DetailPage({ params, searchParams }: DetailPageProps) {
  const { githubId } = await params;
  const member = await loadMember(githubId);
  if (!member) notFound();

  const sp = await searchParams;
  const tab = sp?.tab === 'blog' ? 'blog' : 'mission';
  const missionTab = sp?.missionTab === 'common' || sp?.missionTab === 'pending' ? sp.missionTab : 'mission';

  return (
    <HydrationBoundary state={dehydrate(getRequestQueryClient())}>
      <MemberDetailClient githubId={githubId} initialTab={tab} initialMissionTab={missionTab} />
    </HydrationBoundary>
  );
}
