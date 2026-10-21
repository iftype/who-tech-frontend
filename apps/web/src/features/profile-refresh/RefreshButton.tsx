'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { memberApi, memberDetailQuery, mergeRefreshedMember } from '@/entities/member';
import { RateLimitError } from '@/shared/api';
import { chipButtonVariants } from '@/shared/ui';
import { useTransientValue } from '@/shared/lib/useTransientValue';
import { useRateLimitCountdown } from './model/useRateLimitCountdown';

interface RefreshButtonProps {
  /** 멤버의 지금 GitHub 아이디 (API 경로·카운트다운 저장 키) */
  githubId: string;
  /** 상세 캐시 키에 쓴 아이디 (URL의 아이디. 예전 아이디로 들어온 경우 githubId와 다르다) */
  detailId: string;
}

const COOLDOWN_SECONDS = 60;
const MESSAGE_MS = 2500;

// 프로필 새로고침. 누르는 순간 60초 카운트다운을 시작하고(서버도 1분 제한),
// 결과는 상세 캐시에 직접 넣는다(setQueryData) → 화면이 다시 요청하지 않고 바로 바뀐다
export function RefreshButton({ githubId, detailId }: RefreshButtonProps) {
  const queryClient = useQueryClient();
  const { remaining: countdown, start, clear } = useRateLimitCountdown(githubId);
  // 안내 문구는 2.5초 보여 주고 지운다 (예전에는 실패 문구를 카운트다운 0 효과가 곧바로 지워 보이지 않았다)
  const [error, showMessage, clearMessage] = useTransientValue<string>(MESSAGE_MS);

  const refresh = useMutation({
    mutationFn: () => memberApi.refresh(githubId),
    onMutate: () => {
      clearMessage();
      start(COOLDOWN_SECONDS);
    },
    onSuccess: (member) => {
      queryClient.setQueryData(memberDetailQuery(detailId).queryKey, (prev) => mergeRefreshedMember(prev, member));
    },
    onError: (e) => {
      if (e instanceof RateLimitError) {
        start(e.remainingSeconds);
        showMessage('잠시 후에 시도해주세요');
      } else {
        clear();
        showMessage('새로고침에 실패했습니다');
      }
    },
  });

  const loading = refresh.isPending;
  const disabled = loading || countdown > 0;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => {
          if (!disabled) refresh.mutate();
        }}
        disabled={disabled}
        className={chipButtonVariants({ disabled })}
        title={countdown > 0 ? `${countdown}초 후 다시 시도` : '프로필 새로고침'}
      >
        <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
        {countdown > 0 ? `${countdown}초` : '새로고침'}
      </button>
      {error && <span className="text-tiny text-danger">{error}</span>}
    </div>
  );
}
