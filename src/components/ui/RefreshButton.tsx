'use client';

import { useState, useCallback, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';
import type { MemberDetail } from '@/types';

interface Props {
  githubId: string;
  onRefreshed: (member: MemberDetail) => void;
}

const rateLimitKey = (githubId: string) => `rateLimit_${githubId}`;

export function RefreshButton({ githubId, onRefreshed }: Props) {
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(() => {
    if (typeof window === 'undefined') return 0;
    const expiresAt = localStorage.getItem(rateLimitKey(githubId));
    if (!expiresAt) return 0;
    const remaining = Math.ceil((Number(expiresAt) - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (countdown <= 0) {
      setError(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(rateLimitKey(githubId));
      }
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, githubId]);

  const handleRefresh = useCallback(async () => {
    if (loading || countdown > 0) return;
    setLoading(true);
    setError(null);

    setCountdown(60);
    if (typeof window !== 'undefined') {
      localStorage.setItem(rateLimitKey(githubId), String(Date.now() + 60 * 1000));
    }

    try {
      const member = await api.members.refresh(githubId);
      onRefreshed(member);
    } catch (e: unknown) {
      if (typeof e === 'object' && e !== null && 'rateLimited' in e) {
        const err = e as { rateLimited: boolean; remainingSeconds: number; message: string };
        setCountdown(err.remainingSeconds);
        setError('잠시 후에 시도해주세요');
        if (typeof window !== 'undefined') {
          localStorage.setItem(rateLimitKey(githubId), String(Date.now() + err.remainingSeconds * 1000));
        }
        setTimeout(() => setError(null), 2500);
      } else {
        setError('새로고침에 실패했습니다');
        setCountdown(0);
        if (typeof window !== 'undefined') {
          localStorage.removeItem(rateLimitKey(githubId));
        }
      }
    } finally {
      setLoading(false);
    }
  }, [githubId, loading, countdown, onRefreshed]);

  const disabled = loading || countdown > 0;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleRefresh}
        disabled={disabled}
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[11px] transition-colors ${
          disabled
            ? 'border-border text-text-muted cursor-not-allowed opacity-50'
            : 'border-border text-text-muted hover:text-text hover:bg-surface-alt cursor-pointer'
        }`}
        title={countdown > 0 ? `${countdown}초 후 다시 시도` : '프로필 새로고침'}
      >
        <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
        {countdown > 0 ? `${countdown}초` : '새로고침'}
      </button>
      {error && <span className="text-[10px] text-red-400">{error}</span>}
    </div>
  );
}
