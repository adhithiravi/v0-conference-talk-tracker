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
    name: 'Alex Chen',
    title: 'Senior Software Engineer',
    bio: 'Building scalable systems and sharing knowledge through conference talks. Passionate about developer experience, distributed systems, and helping teams ship better software faster.',
    email: 'alex@example.com',
    twitter: '@alexchen',
    linkedin: 'alexchen-dev',
    website: 'https://alexchen.dev',
    photoUrl: '',
  },
  talks: [
    {
      id: '1',
      title: 'Building Resilient Microservices',
      abstract: 'Learn how to design and implement microservices that gracefully handle failures. We will cover circuit breakers, retry patterns, bulkheads, and observability strategies that keep your systems running smoothly even when things go wrong.',
      tags: ['microservices', 'resilience', 'architecture'],
    },
    {
      id: '2',
      title: 'The Art of Code Review',
      abstract: 'Code reviews are more than just finding bugs. This talk explores how to give constructive feedback, build team culture through reviews, and use automation to focus human attention where it matters most.',
      tags: ['best-practices', 'teamwork', 'developer-experience'],
    },
    {
      id: '3',
      title: 'From Monolith to Modules',
      abstract: 'A practical guide to incrementally modernizing legacy applications without the big rewrite. Learn strategies for identifying boundaries, strangling the monolith, and maintaining velocity during the transition.',
      tags: ['architecture', 'legacy', 'refactoring'],
    },
  ],
  submissions: [
    {
      id: '1',
      conferenceName: 'DevConf 2024',
      location: 'San Francisco, CA',
      date: '2024-09-15',
      talkId: '1',
      status: 'accepted',
      notes: 'Main stage, 45 min slot',
    },
    {
      id: '2',
      conferenceName: 'Tech Summit Europe',
      location: 'Berlin, Germany',
      date: '2024-10-20',
      talkId: '2',
      status: 'submitted',
      notes: 'Waiting for CFP results',
    },
    {
      id: '3',
      conferenceName: 'CodeCon Asia',
      location: 'Singapore',
      date: '2024-11-08',
      talkId: '1',
      status: 'pending',
      notes: 'CFP deadline next week',
    },
    {
      id: '4',
      conferenceName: 'Developer Days',
      location: 'Austin, TX',
      date: '2024-08-12',
      talkId: '3',
      status: 'rejected',
      notes: 'Too many architecture talks this year',
    },
  ],
}

const emptyData: TrackerData = {
  profile: {
    name: '',
    title: '',
    bio: '',
    email: '',
    twitter: '',
    linkedin: '',
    website: '',
    photoUrl: '',
  },
  talks: [],
  submissions: [],
}

export default function Home() {
  const [data, setData] = useState<TrackerData>(sampleData)
  const hasData = data.talks.length > 0 || data.submissions.length > 0 || data.profile.name !== ''

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
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
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-6">
          <FileUploader onDataLoaded={setData} hasData={hasData} />
          
          {hasData && (
            <>
              <ProfileCard profile={data.profile} />
              
              <div className="grid gap-6 lg:grid-cols-2">
                <TalksList talks={data.talks} />
                <SubmissionsList 
                  submissions={data.submissions} 
                  talks={data.talks} 
                />
              </div>
            </>
          )}

          {!hasData && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
                <Mic2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Get Started
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Download the template above, fill it with your speaker profile, talks, and conference submissions, then upload it to view your data.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
