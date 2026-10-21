import type { Metadata } from 'next';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { memberDetailQuery } from '@/entities/member';
import { parseMissionTab } from '@/features/mission-archive/parse';
import { parseProfileTab } from '@/widgets/member-profile/model/profileTab';
import { ApiError, makeQueryClient } from '@/shared/api';
import { MemberDetailClient } from './MemberDetailClient';

interface DetailPageProps {
  params: Promise<{ githubId: string }>;
  searchParams?: Promise<{ tab?: string; missionTab?: string }>;
}

// 한 요청 안에서 generateMetadata와 페이지가 같은 QueryClient를 쓴다 → 멤버 상세는 한 번만 받는다
const getRequestQueryClient = cache(makeQueryClient);

// 없는 멤버(404)만 null → 404 화면. 그 밖의 실패(백엔드 장애 등)는 던져서 error.tsx가 "다시 시도"를 보여 준다
async function loadMember(githubId: string) {
  try {
    return await getRequestQueryClient().fetchQuery(memberDetailQuery(githubId));
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
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
  const tab = parseProfileTab(sp?.tab);
  const missionTab = parseMissionTab(sp?.missionTab);

  return (
    <HydrationBoundary state={dehydrate(getRequestQueryClient())}>
      <MemberDetailClient githubId={githubId} initialTab={tab} initialMissionTab={missionTab} />
    </HydrationBoundary>
  );
}
