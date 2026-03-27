export interface Profile {
  name: string
  title: string
  bio: string
  email: string
  twitter: string
  linkedin: string
  website: string
  photoUrl: string
}

export interface Talk {
  id: string
  title: string
  abstract: string
  tags: string[]
}

export interface ConferenceSubmission {
  id: string
  conferenceName: string
  location: string
  date: string
  talkId: string
  status: 'submitted' | 'accepted' | 'rejected' | 'pending'
  notes: string
}

export interface TrackerData {
  profile: Profile
  talks: Talk[]
  submissions: ConferenceSubmission[]
}
