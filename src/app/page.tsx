import Link from 'next/link';

import { PostCard } from '@/components/post-card';

export default function Home() {
  const post = {
    key: 'test2',
    title:
      '니콜라, 짱, 구, 몰리, 잼, 골리스니콜라, 짱, 구, 몰리, 잼, 골리스니콜라, 짱, 구, 몰리, 잼, 골리스니콜라, 짱, 구, 몰리, 잼, 골리스니콜라, 짱, 구, 몰리, 잼, 골리스니콜라, 짱, 구, 몰리, 잼, 골리스니콜라, 짱, 구, 몰리, 잼, 골리스',
    date: '2025-01-27',
    tags: ['React', 'TypeScript', 'Testing', 'Jest', 'React Testing Library'],
    thumbnail: '/posts/test2/thumbnail.png',
    category: 'etc',
    summary:
      '이것은 테스트용 게시물 요약입니다.이것은 테스트용 게시물 요약입니다.이것은 테스트용 게시물 요약입니다.이것은 테스트용 게시물 요약입니다.이것은 테스트용 게시물 요약입니다.이것은 테스트용 게시물 요약입니다.이것은 테스트용 게시물 요약입니다.이것은 테스트용 게시물 요약입니다.이것은 테스트용 게시물 요약입니다.이것은 테스트용 게시물 요약입니다.이것은 테스트용 게시물 요약입니다.이것은 테스트용 게시물 요약입니다.이것은 테스트용 게시물 요약입니다.이것은 테스트용 게시물 요약입니다.이것은 테스트용 게시물 요약입니다.이것은 테스트용 게시물 요약입니다.이것은 테스트용 게시물 요약입니다.이것은 테스트용 게시물 요약입니다.이것은 테스트용 게시물 요약입니다.이것은 테스트용 게시물 요약입니다.이것은 테스트용 게시물 요약입니다.'
  };
  return (
    <div>
      <h1>Home</h1>
      <Link href={`/post/test2`}>test2</Link>
      <PostCard post={post} />
    </div>
  );
}
