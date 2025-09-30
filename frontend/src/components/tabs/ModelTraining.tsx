import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Chip,
  Alert,
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  TextField,
  FormControl,
  FormLabel,
  FormControlLabel,
  Switch,
} from '@mui/material'
import {
  CheckCircle as CheckIcon,
  PlayArrow as PlayIcon,
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Psychology as PsychologyIcon,
  Code as CodeIcon,
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material'

interface ModelResult {
  name: string
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  trainingTime: number
  status: 'pending' | 'training' | 'completed' | 'best'
}

interface ModelTrainingProps {
  onNext?: () => void
}

const ModelTraining: React.FC<ModelTrainingProps> = ({ onNext }) => {
  const [isTraining, setIsTraining] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [currentModel, setCurrentModel] = useState<string>('')
  const [customAlgorithm, setCustomAlgorithm] = useState('modelName(){\n  // Enter your custom algorithm here\n  // Example: return new CustomClassifier()\n}')
  const [useCustomAlgorithm, setUseCustomAlgorithm] = useState(false)
  const [models, setModels] = useState<ModelResult[]>([
    { name: 'Random Forest', accuracy: 0, precision: 0, recall: 0, f1Score: 0, trainingTime: 0, status: 'pending' },
    { name: 'XGBoost', accuracy: 0, precision: 0, recall: 0, f1Score: 0, trainingTime: 0, status: 'pending' },
    { name: 'LightGBM', accuracy: 0, precision: 0, recall: 0, f1Score: 0, trainingTime: 0, status: 'pending' },
  ])
  const [isCompleted, setIsCompleted] = useState(false)

  const startTraining = async () => {
    setIsTraining(true)
    setTrainingProgress(0)
    
    // Add custom algorithm to models if enabled
    let modelsToTrain = [...models]
    if (useCustomAlgorithm && customAlgorithm.trim()) {
      const customModelName = extractModelName(customAlgorithm)
      modelsToTrain.push({
        name: customModelName,
        accuracy: 0,
        precision: 0,
        recall: 0,
        f1Score: 0,
        trainingTime: 0,
        status: 'pending'
      })
      setModels(modelsToTrain)
    }
    
    // Simulate training each model
    for (let i = 0; i < modelsToTrain.length; i++) {
      const model = modelsToTrain[i]
      setCurrentModel(model.name)
      
      // Update model status to training
      setModels(prev => prev.map((m, index) => 
        index === i ? { ...m, status: 'training' as const } : m
      ))
      
      // Simulate training progress for this model
      for (let progress = 0; progress <= 100; progress += 10) {
        setTrainingProgress(progress)
        await new Promise(resolve => setTimeout(resolve, 200))
      }
      
      // Generate realistic results
      const results = generateModelResults(model.name)
      
      // Update model with results
      setModels(prev => prev.map((m, index) => 
        index === i ? { ...m, ...results, status: 'completed' as const } : m
      ))
      
      // Pause between models - reset progress bar
      setTrainingProgress(0)
      setCurrentModel('')
      await new Promise(resolve => setTimeout(resolve, 2000)) // 2 second pause
    }
    
    // Mark best model
    const bestModelIndex = modelsToTrain.findIndex(m => m.name === 'LightGBM')
    setModels(prev => prev.map((m, index) => 
      index === bestModelIndex ? { ...m, status: 'best' as const } : m
    ))
    
    setIsTraining(false)
    setIsCompleted(true)
  }

  const extractModelName = (code: string) => {
    const match = code.match(/(\w+)\s*\(\)\s*\{/)
    return match ? match[1] : 'Custom Model'
  }

  const generateModelResults = (modelName: string) => {
    const baseResults: Record<string, any> = {
      'Random Forest': { accuracy: 96.89, precision: 96.2, recall: 97.1, f1Score: 96.6, trainingTime: 1.2 },
      'XGBoost': { accuracy: 97.32, precision: 97.0, recall: 97.5, f1Score: 97.2, trainingTime: 0.8 },
      'LightGBM': { accuracy: 98.54, precision: 98.3, recall: 98.7, f1Score: 98.5, trainingTime: 0.6 },
    }
    
    // Generate results for custom models
    if (!baseResults[modelName]) {
      const randomAccuracy = 92 + Math.random() * 6 // 92-98% range
      return {
        accuracy: Math.round(randomAccuracy * 100) / 100,
        precision: Math.round((randomAccuracy - 0.5) * 100) / 100,
        recall: Math.round((randomAccuracy + 0.2) * 100) / 100,
        f1Score: Math.round((randomAccuracy - 0.1) * 100) / 100,
        trainingTime: Math.round((1.5 + Math.random() * 2) * 10) / 10
      }
    }
    
    return baseResults[modelName]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default'
      case 'training': return 'primary'
      case 'completed': return 'success'
      case 'best': return 'success'
      default: return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <ScheduleIcon />
      case 'training': return <CircularProgress size={16} />
      case 'completed': return <CheckIcon />
      case 'best': return <TrendingUpIcon />
      default: return <ScheduleIcon />
    }
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        🤖 Model Training & Evaluation
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Training multiple machine learning models on the heart disease dataset
      </Typography>

      {/* Custom Algorithm Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CodeIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Custom Algorithm
              </Typography>
            </Box>
            <Switch
              checked={useCustomAlgorithm}
              onChange={(e) => setUseCustomAlgorithm(e.target.checked)}
            />
          </Box>
          
          {useCustomAlgorithm && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Define your custom machine learning algorithm. Use the placeholder format: modelName(){}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={8}
                value={customAlgorithm}
                onChange={(e) => setCustomAlgorithm(e.target.value)}
                placeholder="modelName(){\n  // Enter your custom algorithm here\n  // Example: return new CustomClassifier()\n}"
                variant="outlined"
                sx={{
                  '& .MuiInputBase-input': {
                    fontFamily: 'monospace',
                    fontSize: '14px',
                  }
                }}
              />
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    const newAlgorithm = customAlgorithm + '\n\n// Add your custom logic here'
                    setCustomAlgorithm(newAlgorithm)
                  }}
                >
                  Add Code Block
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setCustomAlgorithm('modelName(){\n  // Enter your custom algorithm here\n  // Example: return new CustomClassifier()\n}')}
                >
                  Reset
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {!isCompleted && !isTraining && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={startTraining}
            startIcon={<PlayIcon />}
            sx={{ 
              px: 4,
              py: 1.5,
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0, #1976d2)',
              }
            }}
          >
            Start Model Training
          </Button>
        </Box>
      )}


      {isCompleted && (
        <Alert severity="success" sx={{ mt: 2, mb: 3 }}>
          ✅ Model training completed! LightGBM achieved the best performance with 98.54% accuracy.
        </Alert>
      )}

      <Grid container spacing={2}>
        {models.map((model, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{ 
              border: model.status === 'best' ? '2px solid #4caf50' : '1px solid #e0e0e0',
              bgcolor: model.status === 'best' ? 'success.50' : 'background.paper'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {model.name}
                  </Typography>
                  <Chip
                    icon={getStatusIcon(model.status)}
                    label={model.status === 'best' ? 'Best Model' : model.status}
                    color={getStatusColor(model.status)}
                    size="small"
                  />
                </Box>

                {model.status === 'completed' || model.status === 'best' ? (
                  <Box>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'primary.50', borderRadius: 1 }}>
                          <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
                            {model.accuracy}%
                          </Typography>
                          <Typography variant="caption">Accuracy</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'info.50', borderRadius: 1 }}>
                          <Typography variant="h6" color="info.main" sx={{ fontWeight: 600 }}>
                            {model.trainingTime}s
                          </Typography>
                          <Typography variant="caption">Training Time</Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Performance Metrics:
                      </Typography>
                      <List dense>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemText 
                            primary="Precision" 
                            secondary={`${model.precision}%`}
                          />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemText 
                            primary="Recall" 
                            secondary={`${model.recall}%`}
                          />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemText 
                            primary="F1-Score" 
                            secondary={`${model.f1Score}%`}
                          />
                        </ListItem>
                      </List>
                    </Box>
                  </Box>
                ) : model.status === 'training' ? (
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <CircularProgress size={40} sx={{ mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Training in progress...
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <ScheduleIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Waiting to train...
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {isCompleted && (
        <Box sx={{ mt: 3 }}>
          <Paper sx={{ p: 2, bgcolor: 'info.50' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              📊 Training Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                    3
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Models Trained</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                    98.54%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Best Accuracy</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main" sx={{ fontWeight: 700 }}>
                    2.6s
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Total Time</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main" sx={{ fontWeight: 700 }}>
                    LightGBM
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Best Model</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          {onNext && (
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
                Next: Hyperparameter Tuning
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export default ModelTraining
