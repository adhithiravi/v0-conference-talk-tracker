import * as XLSX from 'xlsx'
import type { TrackerData, Profile, Talk, ConferenceSubmission } from './types'

export function parseExcelFile(file: ArrayBuffer): TrackerData {
  const workbook = XLSX.read(file, { type: 'array' })
  
  const profile = parseProfileSheet(workbook)
  const talks = parseTalksSheet(workbook)
  const submissions = parseSubmissionsSheet(workbook, talks)
  
  return { profile, talks, submissions }
}

function parseProfileSheet(workbook: XLSX.WorkBook): Profile {
  const sheet = workbook.Sheets['Profile']
  if (!sheet) {
    return {
      name: '',
      title: '',
      bio: '',
      email: '',
      twitter: '',
      linkedin: '',
      website: '',
      photoUrl: '',
    }
  }
  
  const data = XLSX.utils.sheet_to_json<Record<string, string>>(sheet)
  const row = data[0] || {}
  
  return {
    name: row['Name'] || '',
    title: row['Title'] || '',
    bio: row['Bio'] || '',
    email: row['Email'] || '',
    twitter: row['Twitter'] || '',
    linkedin: row['LinkedIn'] || '',
    website: row['Website'] || '',
    photoUrl: row['Photo URL'] || '',
  }
}

function parseTalksSheet(workbook: XLSX.WorkBook): Talk[] {
  const sheet = workbook.Sheets['Talks']
  if (!sheet) return []
  
  const data = XLSX.utils.sheet_to_json<Record<string, string>>(sheet)
  
  return data.map((row, index) => ({
    id: `talk-${index + 1}`,
    title: row['Title'] || '',
    abstract: row['Abstract'] || '',
    tags: (row['Tags'] || '').split(',').map(t => t.trim()).filter(Boolean),
  }))
}

function parseSubmissionsSheet(workbook: XLSX.WorkBook, talks: Talk[]): ConferenceSubmission[] {
  const sheet = workbook.Sheets['Submissions']
  if (!sheet) return []
  
  const data = XLSX.utils.sheet_to_json<Record<string, string>>(sheet)
  
  return data.map((row, index) => {
    const talkTitle = row['Talk Title'] || ''
    const matchingTalk = talks.find(t => t.title.toLowerCase() === talkTitle.toLowerCase())
    
    return {
      id: `sub-${index + 1}`,
      conferenceName: row['Conference'] || '',
      location: row['Location'] || '',
      date: row['Date'] || '',
      talkId: matchingTalk?.id || '',
      status: validateStatus(row['Status']),
      notes: row['Notes'] || '',
    }
  })
}

function validateStatus(status: string | undefined): ConferenceSubmission['status'] {
  const valid: ConferenceSubmission['status'][] = ['submitted', 'accepted', 'rejected', 'pending']
  const normalized = (status || '').toLowerCase() as ConferenceSubmission['status']
  return valid.includes(normalized) ? normalized : 'pending'
}

export function generateTemplateWorkbook(): XLSX.WorkBook {
  const workbook = XLSX.utils.book_new()
  
  // Profile sheet
  const profileData = [
    {
      'Name': 'Your Name',
      'Title': 'Software Engineer',
      'Bio': 'Your speaker bio goes here...',
      'Email': 'you@example.com',
      'Twitter': '@yourhandle',
      'LinkedIn': 'linkedin.com/in/yourprofile',
      'Website': 'yourwebsite.com',
      'Photo URL': 'https://example.com/photo.jpg',
    }
  ]
  const profileSheet = XLSX.utils.json_to_sheet(profileData)
  XLSX.utils.book_append_sheet(workbook, profileSheet, 'Profile')
  
  // Talks sheet
  const talksData = [
    {
      'Title': 'Introduction to AI',
      'Abstract': 'A beginner-friendly talk about artificial intelligence fundamentals...',
      'Tags': 'AI, Machine Learning, Beginner',
    },
    {
      'Title': 'Building Scalable Systems',
      'Abstract': 'Learn how to design systems that scale to millions of users...',
      'Tags': 'Architecture, Backend, Scale',
    },
  ]
  const talksSheet = XLSX.utils.json_to_sheet(talksData)
  XLSX.utils.book_append_sheet(workbook, talksSheet, 'Talks')
  
  // Submissions sheet
  const submissionsData = [
    {
      'Conference': 'Tech Summit 2026',
      'Location': 'San Francisco, CA',
      'Date': '2026-06-15',
      'Talk Title': 'Introduction to AI',
      'Status': 'submitted',
      'Notes': 'CFP closes March 1st',
    },
    {
      'Conference': 'DevCon Europe',
      'Location': 'Berlin, Germany',
      'Date': '2026-09-20',
      'Talk Title': 'Building Scalable Systems',
      'Status': 'pending',
      'Notes': 'Waiting for CFP to open',
    },
  ]
  const submissionsSheet = XLSX.utils.json_to_sheet(submissionsData)
  XLSX.utils.book_append_sheet(workbook, submissionsSheet, 'Submissions')
  
  return workbook
}

export function downloadTemplate() {
  const workbook = generateTemplateWorkbook()
  XLSX.writeFile(workbook, 'conference-tracker-template.xlsx')
}
