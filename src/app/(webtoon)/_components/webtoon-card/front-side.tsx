import Image from 'next/image';

import { cn } from '@/lib/utils';

type FrontSideProps = {
  title: string;
  thumbnail: string;
  isActive?: boolean;
};

export function FrontSide({ title, thumbnail, isActive }: FrontSideProps) {
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
        </div>
      </div>
    </div>
  );
}
