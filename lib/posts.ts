import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  author?: string;
  tags?: string[];
  content: string;
}

export interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  author?: string;
  tags?: string[];
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  
  return fs.readdirSync(postsDirectory)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || slug,
      date: data.date || new Date().toISOString().split('T')[0],
      excerpt: data.excerpt,
      author: data.author,
      tags: data.tags,
      content,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export function getAllPosts(): PostMetadata[] {
  const slugs = getPostSlugs();
  
  return slugs
    .map((slug) => {
      const post = getPostBySlug(slug);
      if (!post) return null;
      
      const metadata: PostMetadata = {
        slug: post.slug,
        title: post.title,
        date: post.date,
        excerpt: post.excerpt,
        author: post.author,
        tags: post.tags,
      };
      
      return metadata;
    })
    .filter((post): post is PostMetadata => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostsByTag(tag: string): PostMetadata[] {
  return getAllPosts().filter((post) => 
    post.tags && post.tags.includes(tag)
  );
}
