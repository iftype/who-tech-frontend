import { MISSION_TAB_ITEMS } from '../constants';
import type { MissionTab } from '../types';

interface MissionArchiveHeaderProps {
  tab: MissionTab;
  copied: boolean;
  onTabChange: (tab: MissionTab) => void;
  onCopy: () => void;
}

export function MissionArchiveHeader({ tab, copied, onTabChange, onCopy }: MissionArchiveHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-body-sm font-semibold text-text">미션 PR 아카이브</h2>

      <div className="flex items-center gap-2">
        <div className="flex overflow-hidden rounded-md border border-border bg-surface">
          {MISSION_TAB_ITEMS.map(({ value, label }) => (
            <MissionTabButton key={value} label={label} selected={tab === value} onClick={() => onTabChange(value)} />
          ))}
        </div>
        <CopyMarkdownButton copied={copied} onClick={onCopy} />
      </div>
    </div>
  );
}

interface MissionTabButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

function MissionTabButton({ label, selected, onClick }: MissionTabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer px-3 py-1.5 text-caption ${
        selected ? 'bg-border text-text' : 'text-text-muted hover:text-text-secondary'
      }`}
    >
      {label}
    </button>
  );
}

interface CopyMarkdownButtonProps {
  copied: boolean;
  onClick: () => void;
}

function CopyMarkdownButton({ copied, onClick }: CopyMarkdownButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-caption text-text-muted hover:text-text"
    >
      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      <span className="hidden sm:inline">{copied ? '복사됨' : 'Markdown 복사'}</span>
      <span className="sm:hidden">{copied ? '복사됨' : 'MD 복사'}</span>
    </button>
  );
}
