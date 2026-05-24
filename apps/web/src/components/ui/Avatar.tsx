'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src: string | null;
  alt: string;
  size?: number;
  className?: string;
  /** When true, sizing is controlled by className (for responsive layouts) */
  responsive?: boolean;
}

export function Avatar({ src, alt, size = 40, className, responsive }: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const showImage = src && !imgError;

  return (
    <div
      className={cn('rounded-full overflow-hidden bg-surface border border-border flex-shrink-0', className)}
      style={responsive ? undefined : { width: size, height: size }}
    >
      {showImage ? (
        <Image
          src={src}
          alt={alt || 'Avatar'}
          width={size}
          height={size}
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
