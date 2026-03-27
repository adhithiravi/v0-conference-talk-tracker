'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Mail, Twitter, Linkedin, Globe, User } from 'lucide-react'
import type { Profile } from '@/lib/types'

interface ProfileCardProps {
  profile: Profile
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const initials = profile.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          <Avatar className="h-20 w-20 border-2 border-primary">
            <AvatarImage src={profile.photoUrl} alt={profile.name} />
            <AvatarFallback className="bg-secondary text-lg">
              {initials || <User className="h-8 w-8" />}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-foreground truncate">
              {profile.name || 'Your Name'}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {profile.title || 'Your Title'}
            </p>
            
            {profile.bio && (
              <p className="text-muted-foreground text-sm mt-3 line-clamp-2">
                {profile.bio}
              </p>
            )}
            
            <div className="flex flex-wrap gap-3 mt-4">
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{profile.email}</span>
                </a>
              )}
              {profile.twitter && (
                <a
                  href={`https://twitter.com/${profile.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <Twitter className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{profile.twitter}</span>
                </a>
              )}
              {profile.linkedin && (
                <a
                  href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <Linkedin className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">LinkedIn</span>
                </a>
              )}
              {profile.website && (
                <a
                  href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Website</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
