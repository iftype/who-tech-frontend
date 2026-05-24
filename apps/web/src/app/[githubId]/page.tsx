import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { MemberDetailClient } from './MemberDetailClient';

interface Props {
  params: Promise<{ githubId: string }>;
  searchParams?: Promise<{ tab?: string; missionTab?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { githubId } = await params;
  const member = await api.members.detail(githubId).catch(() => null);
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

export default async function DetailPage({ params, searchParams }: Props) {
  const { githubId } = await params;
  const member = await api.members.detail(githubId).catch(() => null);
  if (!member) notFound();

  const sp = await searchParams;
  const tab = sp?.tab === 'blog' ? 'blog' : 'mission';
  const missionTab = sp?.missionTab === 'common' || sp?.missionTab === 'pending' ? sp.missionTab : 'mission';

  return <MemberDetailClient initialMember={member} initialTab={tab} initialMissionTab={missionTab} />;
}
