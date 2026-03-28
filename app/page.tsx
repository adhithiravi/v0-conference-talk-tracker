'use client'

import { useState } from 'react'
import { FileUploader } from '@/components/file-uploader'
import { ProfileCard } from '@/components/profile-card'
import { TalksList } from '@/components/talks-list'
import { SubmissionsList } from '@/components/submissions-list'
import { Mic2 } from 'lucide-react'
import type { TrackerData } from '@/lib/types'

const sampleData: TrackerData = {
  profile: {
    name: 'Jane Developer',
    title: 'Senior Software Engineer',
    bio: 'Passionate about web technologies and sharing knowledge through conference talks.',
    email: 'jane@example.com',
    twitter: '@janedev',
    linkedin: 'janedev',
    website: 'https://janedev.com',
    photoUrl: '',
  },
  talks: [
    {
      id: '1',
      title: 'Building Scalable React Applications',
      abstract: 'Learn how to build React apps that scale with your team and user base.',
      tags: ['react', 'architecture', 'performance'],
    },
    {
      id: '2',
      title: 'TypeScript Best Practices',
      abstract: 'Discover the patterns and practices that make TypeScript shine.',
      tags: ['typescript', 'best-practices'],
    },
  ],
  submissions: [
    {
      id: '1',
      conferenceName: 'React Summit 2024',
      location: 'Amsterdam, NL',
      date: '2024-06-14',
      talkId: '1',
      status: 'accepted',
      notes: 'Keynote slot!',
    },
    {
      id: '2',
      conferenceName: 'TypeScript Congress',
      location: 'Online',
      date: '2024-09-20',
      talkId: '2',
      status: 'submitted',
      notes: '',
    },
  ],
}

export default function Home() {
  const [data, setData] = useState<TrackerData>(sampleData)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Mic2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  Conference Talk Tracker
                </h1>
                <p className="text-xs text-muted-foreground">
                  Manage your talks and submissions
                </p>
              </div>
            </div>
            <FileUploader onDataLoaded={setData} />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-6">
          <ProfileCard profile={data.profile} />
          
          <div className="grid gap-6 lg:grid-cols-2">
            <TalksList talks={data.talks} />
            <SubmissionsList 
              submissions={data.submissions} 
              talks={data.talks} 
            />
          </div>
        </div>
      </main>
    </div>
  )
}
