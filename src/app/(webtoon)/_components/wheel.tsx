import Image from 'next/image';

export function Wheel() {
  return (
    <button className="absolute bottom-[-75vh] left-1/2 z-10 aspect-square h-screen -translate-x-1/2">
      <Image
        src="/webtoon/wheel.png"
        fill
        alt="휠"
        sizes="100vh"
        className="object-contain"
        draggable={false}
      />
    </button>
  );
}
