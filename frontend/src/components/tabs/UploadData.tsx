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
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material'

interface UploadDataProps {
  onNext?: () => void
}

const UploadData: React.FC<UploadDataProps> = ({ onNext }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(new File([''], 'heart.csv', { type: 'text/csv' }))
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('success')
  const [uploadProgress, setUploadProgress] = useState(100)

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
              ✅ Heart Disease Dataset Ready
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              heart.csv (1,025 rows, 13 features) is loaded and ready for ML processing
            </Typography>
            <Typography variant="caption" display="block">
              Dataset: Heart Disease Classification • Target: Binary Classification
            </Typography>
          </Box>

          {uploadedFile && (
            <Paper sx={{ p: 2, mt: 2, bgcolor: 'success.50', border: '1px solid #e8f5e8' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckIcon color="success" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {uploadedFile.name} - Ready for ML
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      1,025 rows • 13 features • Heart Disease Classification
                    </Typography>
                  </Box>
                </Box>
                <Badge badgeContent="Ready" color="success" />
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

          {uploadStatus === 'success' && onNext && (
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={onNext}
                sx={{
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                  }
                }}
              >
                Next: Preprocessing
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default UploadData

