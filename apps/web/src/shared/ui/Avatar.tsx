'use client';

import { cva } from 'class-variance-authority';
import Image from 'next/image';
import { useState } from 'react';

/** 반응형 크기 이름. lg = 모바일 48px → sm 80px (프로필 상단) */
export type AvatarSize = number | 'lg';

// 숫자면 인라인 style로 고정 크기, 이름이면 클래스로 반응형 크기. 두 가지가 한 prop이라 호출부가 className으로 크기를 덧대지 않는다
const avatarVariants = cva('rounded-full overflow-hidden bg-surface border border-border flex-shrink-0', {
  variants: { size: { lg: 'w-12 h-12 sm:w-20 sm:h-20' } },
});

/** 반응형 크기일 때 이미지에 요청하는 원본 픽셀 (가장 큰 표시 크기) */
const INTRINSIC: Record<Exclude<AvatarSize, number>, number> = { lg: 80 };

interface AvatarProps {
  src: string | null;
  alt: string;
  size?: AvatarSize;
}

export function Avatar({ src, alt, size = 40 }: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const showImage = src && !imgError;
  const fixed = typeof size === 'number';
  const pixels = fixed ? size : INTRINSIC[size];

  return (
    <div
      className={avatarVariants({ size: fixed ? undefined : size })}
      style={fixed ? { width: size, height: size } : undefined}
    >
      {showImage ? (
        <Image
          src={src}
          alt={alt || 'Avatar'}
          width={pixels}
          height={pixels}
          unoptimized
          className="object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-text-muted text-sm">
          {(alt || 'A').charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}
