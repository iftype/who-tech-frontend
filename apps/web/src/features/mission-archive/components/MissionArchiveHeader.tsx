import { MISSION_TAB_ITEMS } from '../constants';
import type { MissionTab } from '../types';
import { CopyIcon, buttonVariants, segmentVariants } from '@/shared/ui';

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
    <button aria-pressed={selected} onClick={onClick} className={segmentVariants({ shape: 'flush', active: selected })}>
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
    <button onClick={onClick} className={buttonVariants({ variant: 'subtle', size: 'caption' })}>
      <CopyIcon className="h-3 w-3" />
      <span className="hidden sm:inline">{copied ? '복사됨' : 'Markdown 복사'}</span>
      <span className="sm:hidden">{copied ? '복사됨' : 'MD 복사'}</span>
    </button>
  );
}
