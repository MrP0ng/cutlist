import type { MDXComponents } from 'mdx/types'
import { Button } from '@/components/ui/button'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-6">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 mb-4 mt-8">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 mb-3 mt-6">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-7">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-gray-700 dark:text-gray-300">
        {children}
      </li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400 mb-4">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-4 rounded-lg overflow-x-auto mb-4 text-sm">
        {children}
      </pre>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
    Button,
    ...components,
  }
}
