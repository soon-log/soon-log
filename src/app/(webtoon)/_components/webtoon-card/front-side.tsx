import Image from 'next/image';

type FrontSideProps = {
  title: string;
  thumbnail: string;
};

export function FrontSide({ title, thumbnail }: FrontSideProps) {
  return (
    <div className="bg-foreground absolute flex h-full w-full items-center justify-center overflow-hidden rounded-[5px] backface-hidden">
      <div className="animate-rotation absolute block h-[160%] w-40 bg-[linear-gradient(90deg,transparent,#ff9966,#ff9966,#ff9966,#ff9966,transparent)]"></div>

      <div className="absolute top-1/2 left-1/2 z-10 flex h-[99%] w-[99%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-[30px] rounded-[5px]">
        <div className="relative h-full w-full overflow-hidden rounded-[5px] bg-white">
          <Image
            src={thumbnail}
            alt={title}
            fill
            priority
            sizes="190px"
            unoptimized
            className="rounded-[5px] object-cover"
          />
        </div>
      </div>
    </div>
  );
}
