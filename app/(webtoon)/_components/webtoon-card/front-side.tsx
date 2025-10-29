import { Star } from 'lucide-react';
import Image from 'next/image';

import { cn } from '@/shared/lib';

type FrontSideProps = {
  title: string;
  thumbnail: string;
  isActive?: boolean;
  isDragging?: boolean;
  recommendLevel?: 1 | 2 | 3;
};

export function FrontSide({ title, thumbnail, isActive, recommendLevel }: FrontSideProps) {
  return (
    <div className="bg-foreground absolute flex h-full w-full items-center justify-center overflow-hidden rounded-[5px] backface-hidden">
      <div
        className={cn(
          'absolute block w-40',
          isActive &&
            'animate-rotation h-[160%] bg-[linear-gradient(90deg,transparent,#ff9966,#ff9966,#ff9966,#ff9966,transparent)]'
        )}
      ></div>

      <div
        className={cn(
          'absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-[30px] rounded-[5px]',
          isActive ? 'h-[99%] w-[99%]' : 'h-full w-full'
        )}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[5px] bg-white">
          <Image
            src={thumbnail}
            alt={title}
            fill
            priority
            sizes="190px"
            unoptimized
            className="rounded-[5px] object-cover"
            draggable={false}
          />
          {recommendLevel && recommendLevel >= 2 && (
            <div className="absolute right-2 bottom-2 flex gap-1">
              {Array.from({ length: recommendLevel - 1 }).map((_, index) => (
                <Star
                  key={index}
                  className="h-4 w-4 text-yellow-400"
                  fill="currentColor"
                  strokeWidth={0}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
