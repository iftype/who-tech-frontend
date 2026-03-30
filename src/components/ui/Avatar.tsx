import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src: string | null;
  alt: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, alt, size = 40, className }: AvatarProps) {
  return (
    <div
      className={cn('rounded-full overflow-hidden bg-surface border border-border flex-shrink-0', className)}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image src={src} alt={alt || 'Avatar'} width={size} height={size} className="object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-text-muted text-sm">
          {(alt || 'A').charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}
