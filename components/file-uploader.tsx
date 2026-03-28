'use client'

import { useCallback, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Upload, FileSpreadsheet, Download, X, Settings2, Loader2 } from 'lucide-react'
import { parseExcelFile, downloadTemplate } from '@/lib/excel-parser'
import { importDemoTrackerData } from '@/lib/actions'

export function FileUploader() {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFile = useCallback(async (file: File) => {
    setError(null)
    
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      setError('Please upload an Excel file (.xlsx or .xls)')
      return
    }
    
    try {
      setIsLoading(true)
      const buffer = await file.arrayBuffer()
      const data = parseExcelFile(buffer)
      setFileName(file.name)
      
      // Import to database
      await importDemoTrackerData(data)
      
      setOpen(false)
      router.refresh()
    } catch (err) {
      console.error('Error parsing Excel file:', err)
      setError('Failed to parse Excel file. Please check the format.')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  const clearFile = () => {
    setFileName(null)
    setError(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="h-4 w-4" />
          <span className="hidden sm:inline">Import Data</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-4">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-foreground text-sm">Import Excel</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Upload your data or download a template
            </p>
          </div>

          {fileName && (
            <div className="flex items-center gap-2 p-2 rounded-md bg-secondary">
              <FileSpreadsheet className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm text-foreground truncate flex-1">{fileName}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFile}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => inputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer
              ${isDragging 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-muted-foreground/50'
              }
              ${isLoading ? 'pointer-events-none opacity-50' : ''}
            `}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleInputChange}
              className="hidden"
              disabled={isLoading}
            />
            {isLoading ? (
              <>
                <Loader2 className="h-6 w-6 text-primary mx-auto mb-2 animate-spin" />
                <p className="text-xs text-foreground font-medium">
                  Importing...
                </p>
              </>
            ) : (
              <>
                <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-foreground font-medium">
                  Drop Excel file or click
                </p>
              </>
            )}
          </div>

          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={downloadTemplate}
              className="flex-1"
              disabled={isLoading}
            >
              <Download className="h-3 w-3 mr-1.5" />
              Template
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Sheets: Profile, Talks, Submissions
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
