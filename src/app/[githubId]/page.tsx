import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { MemberDetailClient } from './MemberDetailClient';

interface Props {
  params: Promise<{ githubId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { githubId } = await params;
  const member = await api.members.detail(githubId).catch(() => null);
  if (!member) return {};
  return {
    title: member.nickname,
    description: `${member.nickname}(@${member.githubId}) 크루의 미션 아카이브와 블로그`,
    openGraph: {
      title: `${member.nickname} | who.tech`,
      images: member.avatarUrl ? [{ url: member.avatarUrl }] : [],
    },
  };
}

export default async function DetailPage({ params }: Props) {
  const { githubId } = await params;
  const member = await api.members.detail(githubId).catch(() => null);
  if (!member) notFound();

  return <MemberDetailClient initialMember={member} />;
}
