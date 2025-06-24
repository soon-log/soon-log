export default async function PostNamePage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const { default: Post } = await import(`../../../../posts/${name}/index.mdx`);
  return <Post />;
}
