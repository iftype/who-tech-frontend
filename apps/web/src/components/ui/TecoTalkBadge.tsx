import type { TecoTalk } from '@/entities/member';

// 제목 앞 대괄호 라벨("[10분 테코톡] ")을 제거해 주제만 노출
function talkLabel(title: string): string {
  return title.replace(/^\s*\[[^\]]*\]\s*/, '').trim() || '테코톡';
}

export function TecoTalkBadge({ talk }: { talk: TecoTalk }) {
  return (
    <a
      href={talk.url}
      target="_blank"
      rel="noopener noreferrer"
      title={talk.title}
      className="inline-flex max-w-[240px] items-center gap-1 rounded border border-red-400/20 bg-red-400/10 px-1.5 py-0.5 text-[11px] text-red-400 hover:bg-red-400/20"
    >
      <svg className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M8 5v14l11-7z" />
      </svg>
      <span className="truncate">{talkLabel(talk.title)}</span>
    </a>
  );
}
