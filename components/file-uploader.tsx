'use client'

import { useCallback, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, FileSpreadsheet, Download, X } from 'lucide-react'
import { parseExcelFile, downloadTemplate } from '@/lib/excel-parser'
import type { TrackerData } from '@/lib/types'

interface FileUploaderProps {
  onDataLoaded: (data: TrackerData) => void
  hasData: boolean
}

export function FileUploader({ onDataLoaded, hasData }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFile = useCallback(async (file: File) => {
    setError(null)
    
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      setError('Please upload an Excel file (.xlsx or .xls)')
      return
    }
    
    try {
      const buffer = await file.arrayBuffer()
      const data = parseExcelFile(buffer)
      setFileName(file.name)
      onDataLoaded(data)
    } catch (err) {
      console.error('Error parsing Excel file:', err)
      setError('Failed to parse Excel file. Please check the format.')
    }
  }, [onDataLoaded])

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
  }

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-medium text-foreground">Import Data</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Upload your Excel file or download the template to get started
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadTemplate}
            className="shrink-0"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-muted-foreground/50'
            }
          `}
        >
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          {fileName ? (
            <div className="flex items-center justify-center gap-3">
              <FileSpreadsheet className="h-8 w-8 text-primary" />
              <div className="text-left">
                <p className="font-medium text-foreground">{fileName}</p>
                <p className="text-xs text-muted-foreground">File loaded successfully</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  clearFile()
                }}
                className="ml-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-foreground font-medium">
                Drop your Excel file here
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse
              </p>
            </>
          )}
        </div>

        {error && (
          <p className="text-sm text-destructive mt-3">{error}</p>
        )}

        {hasData && (
          <p className="text-xs text-muted-foreground mt-3">
            Tip: The Excel file should have three sheets: Profile, Talks, and Submissions
          </p>
        )}
      </CardContent>
    </Card>
  )
}
