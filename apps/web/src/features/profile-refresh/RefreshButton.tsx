'use client';

import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { memberApi, memberDetailQuery, mergeRefreshedMember } from '@/entities/member';
import { RateLimitError } from '@/shared/api';
import { chipButtonVariants } from '@/shared/ui';
import { useRateLimitCountdown } from './model/useRateLimitCountdown';

interface RefreshButtonProps {
  /** 멤버의 지금 GitHub 아이디 (API 경로·카운트다운 저장 키) */
  githubId: string;
  /** 상세 캐시 키에 쓴 아이디 (URL의 아이디. 예전 아이디로 들어온 경우 githubId와 다르다) */
  detailId: string;
}

const COOLDOWN_SECONDS = 60;
const RATE_LIMIT_MESSAGE_MS = 2500;

// 프로필 새로고침. 누르는 순간 60초 카운트다운을 시작하고(서버도 1분 제한),
// 결과는 상세 캐시에 직접 넣는다(setQueryData) → 화면이 다시 요청하지 않고 바로 바뀐다
export function RefreshButton({ githubId, detailId }: RefreshButtonProps) {
  const queryClient = useQueryClient();
  const { remaining: countdown, start, clear } = useRateLimitCountdown(githubId);
  const [error, setError] = useState<string | null>(null);
  const messageTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // 카운트다운이 끝나면 안내 문구도 지운다
  useEffect(() => {
    if (countdown <= 0) setError(null);
  }, [countdown]);

  useEffect(() => () => clearTimeout(messageTimer.current), []);

  const refresh = useMutation({
    mutationFn: () => memberApi.refresh(githubId),
    onMutate: () => {
      setError(null);
      start(COOLDOWN_SECONDS);
    },
    onSuccess: (member) => {
      queryClient.setQueryData(memberDetailQuery(detailId).queryKey, (prev) => mergeRefreshedMember(prev, member));
    },
    onError: (e) => {
      if (e instanceof RateLimitError) {
        start(e.remainingSeconds);
        setError('잠시 후에 시도해주세요');
        clearTimeout(messageTimer.current);
        messageTimer.current = setTimeout(() => setError(null), RATE_LIMIT_MESSAGE_MS);
      } else {
        setError('새로고침에 실패했습니다');
        clear();
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
