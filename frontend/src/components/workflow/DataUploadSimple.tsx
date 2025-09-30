import React, { useState, useCallback } from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  LinearProgress,
  Chip,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Badge,
  CircularProgress,
  Grid,
} from '@mui/material'
import { useDropzone } from 'react-dropzone'
import {
  CloudUpload as UploadIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  DataObject as DataObjectIcon,
  TableChart as TableChartIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
} from '@mui/icons-material'

interface DataUploadProps {
  onDataChange: (data: any) => void
  onNext: () => void
}

const DataUploadSimple: React.FC<DataUploadProps> = ({ onDataChange, onNext }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [qualityReport, setQualityReport] = useState<any>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setUploadedFile(file)
      setUploadStatus('uploading')
      setUploadProgress(0)
      
      // Simulate progressive upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            setUploadStatus('success')
            setQualityReport({
              rows: 1024,
              columns: 13,
              missingValues: 5,
              duplicates: 2,
              fileSize: file.size,
              fileType: file.type,
              issues: [
                { type: 'warning', message: '5 missing values in age column (0.5%)', severity: 'medium' },
                { type: 'warning', message: '2 duplicate rows found (0.2%)', severity: 'low' },
                { type: 'info', message: 'Dataset contains mixed data types', severity: 'info' },
              ],
              pros: [
                'Dataset contains 1,024 rows and 13 columns',
                'Target column is present and well-distributed',
                'No infinite values detected',
                'Data types are consistent',
                'File format is optimized for ML processing',
              ],
              recommendations: [
                'Consider imputing missing values in age column',
                'Remove duplicate rows to improve model performance',
                'Feature scaling may be beneficial for numerical columns',
              ],
            })
            onDataChange({ file, qualityReport: qualityReport })
            return 100
          }
          return prev + Math.random() * 15
        })
      }, 200)
    }
  }, [onDataChange, qualityReport])

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

  const handleContinue = () => {
    if (uploadedFile && qualityReport) {
      onNext()
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'error'
      case 'medium': return 'warning'
      case 'low': return 'info'
      default: return 'info'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <ErrorIcon />
      case 'medium': return <WarningIcon />
      case 'low': return <InfoIcon />
      default: return <InfoIcon />
    }
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        📁 Data Upload & Quality Assessment
      </Typography>
      
      {/* Upload Area */}
      <Card sx={{ 
        mb: 3, 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        border: '2px dashed transparent',
        '&:hover': {
          border: '2px dashed #1976d2',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        },
        transition: 'all 0.3s ease',
      }}>
        <CardContent>
          <Box
            {...getRootProps()}
            sx={{
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              borderRadius: 2,
              transition: 'all 0.3s ease',
              bgcolor: isDragActive ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
            }}
          >
            <input {...getInputProps()} />
            <Badge 
              badgeContent={uploadStatus === 'success' ? '✓' : 0} 
              color="success"
              sx={{ mb: 2 }}
            >
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: 'primary.main',
                mx: 'auto',
                mb: 2,
              }}>
                <UploadIcon sx={{ fontSize: 40 }} />
              </Avatar>
            </Badge>
            
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              {isDragActive ? 'Drop your dataset here' : 'Drag & drop your dataset'}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              or click to browse files
            </Typography>
            <Typography variant="caption" display="block" sx={{ mt: 2 }}>
              Supports CSV, Excel, JSON, Parquet files up to 100MB
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
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • {uploadedFile.type}
                    </Typography>
                  </Box>
                </Box>
                <IconButton size="small" onClick={() => {
                  setUploadedFile(null)
                  setUploadStatus('idle')
                  setQualityReport(null)
                }}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Paper>
          )}

          {uploadStatus === 'uploading' && (
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Analyzing data quality...
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={uploadProgress} 
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                {Math.round(uploadProgress)}% complete
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Quality Report */}
      {qualityReport && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                <CheckIcon />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                📊 Data Quality Report
              </Typography>
            </Box>
            
            {/* Dataset Overview */}
            <Paper sx={{ p: 2, mb: 3, bgcolor: 'success.50', border: '1px solid #e8f5e8' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TableChartIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Dataset Overview
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                      {qualityReport.rows.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Rows</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                      {qualityReport.columns}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Columns</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                      {qualityReport.missingValues}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Missing</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                      {qualityReport.duplicates}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Duplicates</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Issues and Recommendations */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  ⚠️ Issues Found
                </Typography>
                <List>
                  {qualityReport.issues.map((issue: any, index: number) => (
                    <ListItem key={index} sx={{ px: 0, py: 1 }}>
                      <ListItemIcon>
                        <Avatar sx={{ 
                          bgcolor: getSeverityColor(issue.severity) + '.main',
                          width: 32,
                          height: 32
                        }}>
                          {getSeverityIcon(issue.severity)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={issue.message}
                        secondary={`Severity: ${issue.severity}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  ✅ Positive Aspects
                </Typography>
                <List>
                  {qualityReport.pros.map((pro: string, index: number) => (
                    <ListItem key={index} sx={{ px: 0, py: 1 }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
                          <CheckIcon />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText primary={pro} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>

            {/* Recommendations */}
            {qualityReport.recommendations && (
              <Paper sx={{ p: 2, mt: 2, bgcolor: 'info.50', border: '1px solid #e3f2fd' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'info.main' }}>
                  💡 Recommendations
                </Typography>
                <List dense>
                  {qualityReport.recommendations.map((rec: string, index: number) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon>
                        <InfoIcon color="info" />
                      </ListItemIcon>
                      <ListItemText primary={rec} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          {qualityReport && (
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => console.log('Download report')}
            >
              Download Report
            </Button>
          )}
        </Box>
        <Button
          variant="contained"
          size="large"
          onClick={handleContinue}
          disabled={!uploadedFile || uploadStatus !== 'success'}
          sx={{ 
            px: 4,
            py: 1.5,
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0, #1976d2)',
            }
          }}
        >
          Continue to Preprocessing →
        </Button>
      </Box>
    </Box>
  )
}

export default DataUploadSimple

