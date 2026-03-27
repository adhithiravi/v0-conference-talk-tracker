'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, Copy, Check, FileText } from 'lucide-react'
import type { Talk } from '@/lib/types'

interface TalksListProps {
  talks: Talk[]
}

export function TalksList({ talks }: TalksListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyAbstract = async (talk: Talk) => {
    await navigator.clipboard.writeText(`${talk.title}\n\n${talk.abstract}`)
    setCopiedId(talk.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (talks.length === 0) {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <FileText className="h-5 w-5 text-primary" />
            My Talks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            No talks found. Upload an Excel file with a &quot;Talks&quot; sheet to get started.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <FileText className="h-5 w-5 text-primary" />
          My Talks
          <Badge variant="secondary" className="ml-2">
            {talks.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {talks.map((talk) => (
          <div
            key={talk.id}
            className="border border-border rounded-lg bg-secondary/30 overflow-hidden"
          >
            <button
              onClick={() => setExpandedId(expandedId === talk.id ? null : talk.id)}
              className="w-full p-4 text-left flex items-start justify-between gap-4 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">
                  {talk.title}
                </h3>
                {talk.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {talk.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              {expandedId === talk.id ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
              )}
            </button>
            
            {expandedId === talk.id && (
              <div className="px-4 pb-4 border-t border-border">
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Abstract
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyAbstract(talk)}
                      className="h-7 text-xs"
                    >
                      {copiedId === talk.id ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {talk.abstract}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
