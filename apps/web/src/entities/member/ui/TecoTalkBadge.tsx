import { cva } from 'class-variance-authority';
import { PlayIcon } from '@/shared/ui';
import type { TecoTalk } from '../model/types';

// 테코톡 영상 칩. 영상 색(video)은 멤버 도메인의 사실이라 shared linkVariants가 아니라 여기서 정한다
export const tecoTalkBadgeVariants = cva(
  'inline-flex max-w-[240px] items-center gap-1 rounded border border-video/20 bg-video/10 px-1.5 py-0.5 text-caption text-video hover:bg-video/20',
);

// 제목 앞 대괄호 라벨("[10분 테코톡] ")을 제거해 주제만 노출
function talkLabel(title: string): string {
  return title.replace(/^\s*\[[^\]]*\]\s*/, '').trim() || '테코톡';
}

export function TecoTalkBadge({ talk }: { talk: TecoTalk }) {
  return (
    <a href={talk.url} target="_blank" rel="noopener noreferrer" title={talk.title} className={tecoTalkBadgeVariants()}>
      <PlayIcon className="h-3 w-3 shrink-0" aria-hidden="true" />
      <span className="truncate">{talkLabel(talk.title)}</span>
    </a>
  );
}
