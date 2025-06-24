import Link from 'next/link';
export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Link href={`/post/test2`}>test2</Link>
    </div>
  );
}
