'use server'

import { createClient } from '@/lib/supabase/server'
import type { Profile, Talk, ConferenceSubmission, TrackerData } from '@/lib/types'
import { revalidatePath } from 'next/cache'

// Demo user ID for seeded data (before auth is set up)
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000'

// Fetch all data (demo mode - no auth required)
export async function getDemoTrackerData(): Promise<TrackerData> {
  const supabase = await createClient()

  const [profileResult, talksResult, submissionsResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', DEMO_USER_ID).single(),
    supabase.from('talks').select('*').eq('user_id', DEMO_USER_ID),
    supabase.from('conference_submissions').select('*').eq('user_id', DEMO_USER_ID),
  ])

  const profile: Profile = profileResult.data ? {
    name: profileResult.data.name || '',
    title: profileResult.data.title || '',
    bio: profileResult.data.bio || '',
    email: profileResult.data.email || '',
    twitter: profileResult.data.twitter || '',
    linkedin: profileResult.data.linkedin || '',
    website: profileResult.data.website || '',
    photoUrl: profileResult.data.photo_url || '',
  } : {
    name: '',
    title: '',
    bio: '',
    email: '',
    twitter: '',
    linkedin: '',
    website: '',
    photoUrl: '',
  }

  const talks: Talk[] = (talksResult.data || []).map(t => ({
    id: t.id,
    title: t.title,
    abstract: t.abstract || '',
    tags: t.tags || [],
  }))

  const submissions: ConferenceSubmission[] = (submissionsResult.data || []).map(s => ({
    id: s.id,
    conferenceName: s.conference_name,
    location: s.location || '',
    date: s.date || '',
    talkId: s.talk_id,
    status: s.status,
    notes: s.notes || '',
  }))

  return { profile, talks, submissions }
}

// Fetch all data for the current user
export async function getTrackerData(): Promise<TrackerData | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [profileResult, talksResult, submissionsResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('talks').select('*').eq('user_id', user.id),
    supabase.from('conference_submissions').select('*').eq('user_id', user.id),
  ])

  const profile: Profile = profileResult.data ? {
    name: profileResult.data.name || '',
    title: profileResult.data.title || '',
    bio: profileResult.data.bio || '',
    email: profileResult.data.email || '',
    twitter: profileResult.data.twitter || '',
    linkedin: profileResult.data.linkedin || '',
    website: profileResult.data.website || '',
    photoUrl: profileResult.data.photo_url || '',
  } : {
    name: '',
    title: '',
    bio: '',
    email: '',
    twitter: '',
    linkedin: '',
    website: '',
    photoUrl: '',
  }

  const talks: Talk[] = (talksResult.data || []).map(t => ({
    id: t.id,
    title: t.title,
    abstract: t.abstract || '',
    tags: t.tags || [],
  }))

  const submissions: ConferenceSubmission[] = (submissionsResult.data || []).map(s => ({
    id: s.id,
    conferenceName: s.conference_name,
    location: s.location || '',
    date: s.date || '',
    talkId: s.talk_id,
    status: s.status,
    notes: s.notes || '',
  }))

  return { profile, talks, submissions }
}

// Update profile
export async function updateProfile(profile: Profile) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    name: profile.name,
    title: profile.title,
    bio: profile.bio,
    email: profile.email,
    twitter: profile.twitter,
    linkedin: profile.linkedin,
    website: profile.website,
    photo_url: profile.photoUrl,
  })

  if (error) throw error
  revalidatePath('/')
}

// Add a new talk
export async function addTalk(talk: Omit<Talk, 'id'>) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase.from('talks').insert({
    user_id: user.id,
    title: talk.title,
    abstract: talk.abstract,
    tags: talk.tags,
  }).select().single()

  if (error) throw error
  revalidatePath('/')
  return data
}

// Update a talk
export async function updateTalk(id: string, talk: Omit<Talk, 'id'>) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase.from('talks').update({
    title: talk.title,
    abstract: talk.abstract,
    tags: talk.tags,
  }).eq('id', id).eq('user_id', user.id)

  if (error) throw error
  revalidatePath('/')
}

// Delete a talk
export async function deleteTalk(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase.from('talks').delete()
    .eq('id', id).eq('user_id', user.id)

  if (error) throw error
  revalidatePath('/')
}

// Add a conference submission
export async function addSubmission(submission: Omit<ConferenceSubmission, 'id'>) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase.from('conference_submissions').insert({
    user_id: user.id,
    conference_name: submission.conferenceName,
    location: submission.location,
    date: submission.date,
    talk_id: submission.talkId,
    status: submission.status,
    notes: submission.notes,
  }).select().single()

  if (error) throw error
  revalidatePath('/')
  return data
}

// Update a submission
export async function updateSubmission(id: string, submission: Omit<ConferenceSubmission, 'id'>) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase.from('conference_submissions').update({
    conference_name: submission.conferenceName,
    location: submission.location,
    date: submission.date,
    talk_id: submission.talkId,
    status: submission.status,
    notes: submission.notes,
  }).eq('id', id).eq('user_id', user.id)

  if (error) throw error
  revalidatePath('/')
}

// Delete a submission
export async function deleteSubmission(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase.from('conference_submissions').delete()
    .eq('id', id).eq('user_id', user.id)

  if (error) throw error
  revalidatePath('/')
}

// Bulk import data for demo user (from Excel upload, no auth required)
export async function importDemoTrackerData(data: TrackerData) {
  const supabase = await createClient()

  // Update profile
  await supabase.from('profiles').upsert({
    id: DEMO_USER_ID,
    name: data.profile.name,
    title: data.profile.title,
    bio: data.profile.bio,
    email: data.profile.email,
    twitter: data.profile.twitter,
    linkedin: data.profile.linkedin,
    website: data.profile.website,
    photo_url: data.profile.photoUrl,
  })

  // Create a mapping from old talk IDs to new UUIDs
  const talkIdMap = new Map<string, string>()

  // Insert talks and track their new IDs
  for (const talk of data.talks) {
    const { data: newTalk, error } = await supabase.from('talks').insert({
      user_id: DEMO_USER_ID,
      title: talk.title,
      abstract: talk.abstract,
      tags: talk.tags,
    }).select().single()

    if (!error && newTalk) {
      talkIdMap.set(talk.id, newTalk.id)
    }
  }

  // Insert submissions with mapped talk IDs
  for (const submission of data.submissions) {
    const mappedTalkId = talkIdMap.get(submission.talkId)
    if (mappedTalkId) {
      await supabase.from('conference_submissions').insert({
        user_id: DEMO_USER_ID,
        conference_name: submission.conferenceName,
        location: submission.location,
        date: submission.date,
        talk_id: mappedTalkId,
        status: submission.status,
        notes: submission.notes,
      })
    }
  }

  revalidatePath('/')
}

// Bulk import data (from Excel upload)
export async function importTrackerData(data: TrackerData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Update profile
  await supabase.from('profiles').upsert({
    id: user.id,
    name: data.profile.name,
    title: data.profile.title,
    bio: data.profile.bio,
    email: data.profile.email,
    twitter: data.profile.twitter,
    linkedin: data.profile.linkedin,
    website: data.profile.website,
    photo_url: data.profile.photoUrl,
  })

  // Create a mapping from old talk IDs to new UUIDs
  const talkIdMap = new Map<string, string>()

  // Insert talks and track their new IDs
  for (const talk of data.talks) {
    const { data: newTalk, error } = await supabase.from('talks').insert({
      user_id: user.id,
      title: talk.title,
      abstract: talk.abstract,
      tags: talk.tags,
    }).select().single()

    if (!error && newTalk) {
      talkIdMap.set(talk.id, newTalk.id)
    }
  }

  // Insert submissions with mapped talk IDs
  for (const submission of data.submissions) {
    const mappedTalkId = talkIdMap.get(submission.talkId)
    if (mappedTalkId) {
      await supabase.from('conference_submissions').insert({
        user_id: user.id,
        conference_name: submission.conferenceName,
        location: submission.location,
        date: submission.date,
        talk_id: mappedTalkId,
        status: submission.status,
        notes: submission.notes,
      })
    }
  }

  revalidatePath('/')
}
