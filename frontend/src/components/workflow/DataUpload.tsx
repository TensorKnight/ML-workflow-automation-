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
  Divider,
  IconButton,
  Tooltip,
  Badge,
  CircularProgress,
  Fade,
  Zoom,
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
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'

interface DataUploadProps {
  onDataChange: (data: any) => void
  onNext: () => void
}

const DataUpload: React.FC<DataUploadProps> = ({ onDataChange, onNext }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [qualityReport, setQualityReport] = useState<any>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

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
              dataPreview: [
                { age: 63, sex: 1, cp: 3, trestbps: 145, chol: 233, fbs: 1, restecg: 0, thalach: 150, exang: 0, oldpeak: 2.3, slope: 0, ca: 0, thal: 1, target: 0 },
                { age: 37, sex: 1, cp: 2, trestbps: 130, chol: 250, fbs: 0, restecg: 1, thalach: 187, exang: 0, oldpeak: 3.5, slope: 0, ca: 0, thal: 2, target: 1 },
                { age: 41, sex: 0, cp: 1, trestbps: 130, chol: 204, fbs: 0, restecg: 0, thalach: 172, exang: 0, oldpeak: 1.4, slope: 2, ca: 0, thal: 2, target: 0 },
              ]
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
    <Box ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
          📁 Data Upload & Quality Assessment
        </Typography>
      </motion.div>
      
      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
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
              <motion.div
                animate={{ 
                  scale: isDragActive ? 1.1 : 1,
                  rotate: isDragActive ? 5 : 0 
                }}
                transition={{ duration: 0.2 }}
              >
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
              </motion.div>
              
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
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
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
              </motion.div>
            )}

            {uploadStatus === 'uploading' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
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
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quality Report */}
      <AnimatePresence>
        {qualityReport && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
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
                          <CountUp end={qualityReport.rows} duration={1.5} />
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Rows</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                          <CountUp end={qualityReport.columns} duration={1.5} />
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Columns</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                          <CountUp end={qualityReport.missingValues} duration={1.5} />
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Missing</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                          <CountUp end={qualityReport.duplicates} duration={1.5} />
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
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <ListItem sx={{ px: 0, py: 1 }}>
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
                        </motion.div>
                      ))}
                    </List>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                      ✅ Positive Aspects
                    </Typography>
                    <List>
                      {qualityReport.pros.map((pro: string, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <ListItem sx={{ px: 0, py: 1 }}>
                            <ListItemIcon>
                              <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
                                <CheckIcon />
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText primary={pro} />
                          </ListItem>
                        </motion.div>
                      ))}
                    </List>
                  </Grid>
                </Grid>

                {/* Recommendations */}
                {qualityReport.recommendations && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
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
                  </motion.div>
                )}

                {/* Data Preview */}
                {qualityReport.dataPreview && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Paper sx={{ p: 2, mt: 2 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        👀 Data Preview
                      </Typography>
                      <Box sx={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ backgroundColor: '#f5f5f5' }}>
                              {Object.keys(qualityReport.dataPreview[0]).map((key) => (
                                <th key={key} style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {qualityReport.dataPreview.map((row: any, index: number) => (
                              <tr key={index}>
                                {Object.values(row).map((value: any, cellIndex: number) => (
                                  <td key={cellIndex} style={{ padding: '8px', border: '1px solid #ddd' }}>
                                    {value}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </Box>
                    </Paper>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
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
      </motion.div>
    </Box>
  )
}

export default DataUpload
