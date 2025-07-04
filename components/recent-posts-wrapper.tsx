import { getAllPosts } from '@/lib/posts';
import { RecentPosts } from './recent-posts';

interface RecentPostsWrapperProps {
  limit?: number;
}

export async function RecentPostsWrapper({ limit = 3 }: RecentPostsWrapperProps) {
  const posts = getAllPosts().slice(0, limit);
  
  return <RecentPosts posts={posts} />;
}
