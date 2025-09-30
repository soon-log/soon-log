import Image from 'next/image';

export function Wheel() {
  return (
    <button className="absolute bottom-[-60%] left-1/2 h-full w-full -translate-x-1/2">
      <Image src="/webtoon/wheel.png" fill alt="휠" sizes="100vw" className="object-contain" />
    </button>
  );
}
