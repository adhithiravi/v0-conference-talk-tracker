'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Send } from 'lucide-react'
import type { ConferenceSubmission, Talk } from '@/lib/types'

interface SubmissionsListProps {
  submissions: ConferenceSubmission[]
  talks: Talk[]
}

const statusColors: Record<ConferenceSubmission['status'], string> = {
  submitted: 'bg-sky-100 text-sky-700 border-sky-300',
  accepted: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  rejected: 'bg-red-100 text-red-700 border-red-300',
  pending: 'bg-amber-100 text-amber-700 border-amber-300',
}

export function SubmissionsList({ submissions, talks }: SubmissionsListProps) {
  const getTalkTitle = (talkId: string) => {
    const talk = talks.find(t => t.id === talkId)
    return talk?.title || 'Unknown Talk'
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'TBD'
    try {
      const [year, month, day] = dateStr.split('-').map(Number)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return `${months[month - 1]} ${day}, ${year}`
    } catch {
      return dateStr
    }
  }

  if (submissions.length === 0) {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Send className="h-5 w-5 text-primary" />
            Conference Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            No submissions found. Upload an Excel file with a &quot;Submissions&quot; sheet to track your conference submissions.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Group by status
  const grouped = submissions.reduce((acc, sub) => {
    if (!acc[sub.status]) acc[sub.status] = []
    acc[sub.status].push(sub)
    return acc
  }, {} as Record<string, ConferenceSubmission[]>)

  const statusOrder: ConferenceSubmission['status'][] = ['accepted', 'submitted', 'pending', 'rejected']

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Send className="h-5 w-5 text-primary" />
          Conference Submissions
          <Badge variant="secondary" className="ml-2">
            {submissions.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {statusOrder.map(status => {
            const items = grouped[status]
            if (!items || items.length === 0) return null
            
            return (
              <div key={status}>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className={statusColors[status]}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    ({items.length})
                  </span>
                </div>
                
                <div className="space-y-2">
                  {items.map((submission) => (
                    <div
                      key={submission.id}
                      className="p-4 border border-border rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground">
                            {submission.conferenceName}
                          </h4>
                          <p className="text-sm text-primary mt-1">
                            {getTalkTitle(submission.talkId)}
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground sm:text-right">
                          {submission.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {submission.location}
                            </span>
                          )}
                          {submission.date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(submission.date)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {submission.notes && (
                        <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/50">
                          {submission.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
