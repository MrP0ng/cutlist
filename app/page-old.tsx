"use client"
import React from "react"

import { Button } from "@/components/ui/button"
import { FrameworkSelector } from "@/components/framework-selector"
import { RecentPostsWrapper } from "@/components/recent-posts-wrapper"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Progress } from "@/components/ui/progress"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header section with existing components */}
      <div className="flex flex-col items-center justify-center py-16">
        <div>
          <Button>Click me</Button>
        </div>
        <div className="mt-2">
          <Button>Click me</Button>
        </div>
        <div className="mt-4">
          <FrameworkSelector />
        </div>
        <div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size='lg' variant="destructive">Open</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <ModeToggle />
        <div className="mt-16 w-full max-w-md">
          <p>Value is 33</p>
          <Progress value={33} />
        </div>
      </div>

      {/* Main content section */}
      <div className="flex-1 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome section */}
          <div className="text-center mb-16">
            <div className="w-full max-w-2xl mx-auto prose dark:prose-invert">
              <h1>Welcome to Vibing!</h1>
              <h2>Features</h2>
              <ul>
                <li>Reusable UI components</li>
                <li>Easy framework selection</li>
                <li>Modern design system</li>
                <li>Accessible dialogs and alerts</li>
                <li>MDX-powered blog system</li>
              </ul>
              <blockquote>
                "Good design is as little design as possible." – Dieter Rams
              </blockquote>
              <h3>Get Started</h3>
              <p>
                Explore the components above and start building your next project with confidence!
              </p>
              <p>
                Vibing provides a robust set of UI elements designed to help you move fast without sacrificing quality or accessibility.
              </p>
              <p>
                Each component is customizable and follows best practices, ensuring your app looks great on any device.
              </p>
              <p>
                Check out the documentation for usage examples, or dive right in by experimenting with the buttons and dialogs above.
              </p>
              <p>
                If you have feedback or feature requests, feel free to contribute or open an issue on our GitHub repository.
              </p>
            </div>
          </div>

          {/* Recent blog posts section */}
          <RecentPostsWrapper limit={3} />
        </div>
      </div>
    </div>
  )
}