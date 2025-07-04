# MDX Blog Setup

This project now includes a fully functional blog system powered by MDX. Here's how it works:

## Structure

```
cutlist/
├── app/
│   ├── post/
│   │   ├── page.tsx          # Blog index page
│   │   └── [slug]/
│   │       ├── page.tsx      # Individual post page
│   │       └── not-found.tsx # 404 for missing posts
│   └── page.tsx              # Home page with recent posts
├── posts/                    # Your blog posts (MDX files)
│   ├── welcome-to-my-blog.mdx
│   └── nextjs-mdx-guide.mdx
├── lib/
│   └── posts.ts              # Post utilities
├── components/
│   ├── recent-posts.tsx      # Recent posts component
│   └── client-components.tsx # Client-side components
├── mdx-components.tsx        # MDX component styling
└── next.config.ts            # MDX configuration
```

## Creating Blog Posts

1. Create a new `.mdx` file in the `posts/` directory
2. Add frontmatter at the top:

```yaml
---
title: "Your Post Title"
date: "2025-07-03"
excerpt: "A brief description of your post"
author: "Your Name"
tags: ["tag1", "tag2", "tag3"]
---
```

3. Write your content using Markdown and JSX components

## Features

- ✅ **Dynamic routing**: `/post/[slug]` based on filename
- ✅ **Frontmatter support**: Title, date, excerpt, author, tags
- ✅ **SEO optimized**: Automatic meta tags and Open Graph
- ✅ **Responsive design**: Mobile-friendly with Tailwind CSS
- ✅ **Dark mode**: Automatic theme switching
- ✅ **TypeScript**: Full type safety
- ✅ **Static generation**: Fast performance with Next.js SSG
- ✅ **Syntax highlighting**: Code blocks with proper formatting
- ✅ **Component support**: Use React components in your posts

## URLs

- Home page: `/` (shows recent posts)
- Blog index: `/post` (lists all posts)
- Individual posts: `/post/[slug]` (slug = filename without .mdx)

## Example Post

Create `posts/my-first-post.mdx`:

```mdx
---
title: "My First Post"
date: "2025-07-03"
excerpt: "This is my first blog post!"
author: "John Doe"
tags: ["introduction", "blog"]
---

# Hello World!

This is my first blog post using **MDX**.

## Code Example

```javascript
console.log("Hello, world!");
```

You can also use React components here!
```

This will be available at `/post/my-first-post`.

## Customization

- **Styling**: Edit `mdx-components.tsx` to customize how Markdown renders
- **Layout**: Modify `app/post/[slug]/page.tsx` for post layout changes
- **Listing**: Update `app/post/page.tsx` for the blog index page
- **Home integration**: Adjust `components/recent-posts.tsx` for home page display

## Development

```bash
npm run dev
```

Visit:
- `http://localhost:3001` - Home page
- `http://localhost:3001/post` - Blog index
- `http://localhost:3001/post/welcome-to-my-blog` - Example post
