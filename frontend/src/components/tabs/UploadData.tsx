import React, { useState, useCallback } from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  LinearProgress,
  Paper,
  Avatar,
  IconButton,
  Badge,
  CircularProgress,
} from '@mui/material'
import { useDropzone } from 'react-dropzone'
import {
  CloudUpload as UploadIcon,
  CheckCircle as CheckIcon,
  DataObject as DataObjectIcon,
  Close as CloseIcon,
} from '@mui/icons-material'

const UploadData: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setUploadedFile(file)
      setUploadStatus('uploading')
      setUploadProgress(0)
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            setUploadStatus('success')
            return 100
          }
          return prev + Math.random() * 15
        })
      }, 200)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/json': ['.json'],
    },
    multiple: false,
  })

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Upload Your Dataset
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed #ccc',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              bgcolor: isDragActive ? 'action.hover' : 'background.paper',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <input {...getInputProps()} />
            <Badge 
              badgeContent={uploadStatus === 'success' ? '✓' : 0} 
              color="success"
              sx={{ mb: 2 }}
            >
              <Avatar sx={{ 
                width: 60, 
                height: 60, 
                bgcolor: 'primary.main',
                mx: 'auto',
                mb: 2,
              }}>
                <UploadIcon sx={{ fontSize: 30 }} />
              </Avatar>
            </Badge>
            
            <Typography variant="h6" gutterBottom>
              {isDragActive ? 'Drop the file here' : 'Drag & drop your dataset here'}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              or click to select a file
            </Typography>
            <Typography variant="caption" display="block">
              Supports CSV, Excel, JSON files
            </Typography>
          </Box>

          {uploadedFile && (
            <Paper sx={{ p: 2, mt: 2, bgcolor: 'primary.50' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DataObjectIcon color="primary" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {uploadedFile.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                  </Box>
                </Box>
                <IconButton size="small" onClick={() => {
                  setUploadedFile(null)
                  setUploadStatus('idle')
                }}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Paper>
          )}

          {uploadStatus === 'uploading' && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Uploading...
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={uploadProgress} 
                sx={{ height: 6, borderRadius: 3 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                {Math.round(uploadProgress)}% complete
              </Typography>
            </Box>
          )}

          {uploadStatus === 'success' && (
            <Alert severity="success" sx={{ mt: 2 }}>
              File uploaded successfully!
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default UploadData

