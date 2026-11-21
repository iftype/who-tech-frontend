'use client';

import { cva } from 'class-variance-authority';
import Image, { type ImageLoaderProps } from 'next/image';
import { useState } from 'react';

const GITHUB_AVATAR_ORIGIN = 'https://avatars.githubusercontent.com/';

// GitHub 아바타는 원본이 수백 KB까지 나오는데 화면에는 16~80px로만 쓴다.
// s= 로 GitHub가 줄인 것을 받는다 (Vercel 이미지 최적화를 거치지 않아 한도와 서버 비용이 없다).
// loader를 주면 next/image가 1x, 2x srcset을 만들어 width를 넘겨 준다
function githubAvatarLoader({ src, width }: ImageLoaderProps): string {
  const url = new URL(src);
  url.searchParams.set('s', String(width));
  return url.toString();
}

/** 반응형 크기 이름. lg = 모바일 48px → sm 80px (프로필 상단) */
type AvatarSize = number | 'lg';

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
  // 그 밖의 출처(로컬 파일 등)는 크기를 줄일 방법이 없어 원본 그대로 받는다
  const resizable = !!src && src.startsWith(GITHUB_AVATAR_ORIGIN);

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
          {...(resizable ? { loader: githubAvatarLoader } : { unoptimized: true })}
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
