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
  Slider,
  TextField,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material'
import {
  CheckCircle as CheckIcon,
  PlayArrow as PlayIcon,
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Psychology as PsychologyIcon,
  Tune as TuneIcon,
  AutoAwesome as AutoAwesomeIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material'

interface TuningResult {
  model: string
  bestParams: Record<string, any>
  bestScore: number
  improvement: number
  trials: number
  status: 'pending' | 'tuning' | 'completed' | 'best'
}

interface HyperparameterTuningProps {
  onNext?: () => void
}

const HyperparameterTuning: React.FC<HyperparameterTuningProps> = ({ onNext }) => {
  const [isTuning, setIsTuning] = useState(false)
  const [tuningProgress, setTuningProgress] = useState(0)
  const [currentModel, setCurrentModel] = useState<string>('')
  const [tuningMethod, setTuningMethod] = useState('bayesian')
  const [maxTrials, setMaxTrials] = useState(50)
  const [isCompleted, setIsCompleted] = useState(false)
  
  const [tuningResults, setTuningResults] = useState<TuningResult[]>([
    { 
      model: 'LightGBM', 
      bestParams: {}, 
      bestScore: 0, 
      improvement: 0, 
      trials: 0, 
      status: 'pending' 
    },
    { 
      model: 'XGBoost', 
      bestParams: {}, 
      bestScore: 0, 
      improvement: 0, 
      trials: 0, 
      status: 'pending' 
    },
    { 
      model: 'Random Forest', 
      bestParams: {}, 
      bestScore: 0, 
      improvement: 0, 
      trials: 0, 
      status: 'pending' 
    },
  ])

  const startTuning = async () => {
    setIsTuning(true)
    setTuningProgress(0)
    
    // Simulate tuning each model
    for (let i = 0; i < tuningResults.length; i++) {
      const model = tuningResults[i]
      setCurrentModel(model.model)
      
      // Update model status to tuning
      setTuningResults(prev => prev.map((m, index) => 
        index === i ? { ...m, status: 'tuning' as const } : m
      ))
      
      // Simulate tuning progress
      for (let progress = 0; progress <= 100; progress += 5) {
        setTuningProgress(progress)
        await new Promise(resolve => setTimeout(resolve, 150))
      }
      
      // Generate realistic tuning results
      const results = generateTuningResults(model.model)
      
      // Update model with results
      setTuningResults(prev => prev.map((m, index) => 
        index === i ? { ...m, ...results, status: 'completed' as const } : m
      ))
      
      // Small delay between models
      await new Promise(resolve => setTimeout(resolve, 300))
    }
    
    // Mark best model
    const bestModelIndex = tuningResults.findIndex(m => m.model === 'LightGBM')
    setTuningResults(prev => prev.map((m, index) => 
      index === bestModelIndex ? { ...m, status: 'best' as const } : m
    ))
    
    setIsTuning(false)
    setIsCompleted(true)
  }

  const generateTuningResults = (modelName: string) => {
    const baseResults: Record<string, any> = {
      'LightGBM': {
        bestParams: {
          'n_estimators': 150,
          'learning_rate': 0.1,
          'max_depth': 6,
          'num_leaves': 31,
          'subsample': 0.8,
          'colsample_bytree': 0.9
        },
        bestScore: 99.12,
        improvement: 0.58,
        trials: 47
      },
      'XGBoost': {
        bestParams: {
          'n_estimators': 120,
          'learning_rate': 0.08,
          'max_depth': 5,
          'subsample': 0.85,
          'colsample_bytree': 0.9,
          'reg_alpha': 0.1
        },
        bestScore: 98.67,
        improvement: 1.35,
        trials: 43
      },
      'Random Forest': {
        bestParams: {
          'n_estimators': 200,
          'max_depth': 12,
          'min_samples_split': 2,
          'min_samples_leaf': 1,
          'max_features': 'sqrt'
        },
        bestScore: 97.89,
        improvement: 1.0,
        trials: 38
      }
    }
    
    return baseResults[modelName] || {
      bestParams: {},
      bestScore: 95,
      improvement: 0,
      trials: 30
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default'
      case 'tuning': return 'primary'
      case 'completed': return 'success'
      case 'best': return 'success'
      default: return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <ScheduleIcon />
      case 'tuning': return <CircularProgress size={16} />
      case 'completed': return <CheckIcon />
      case 'best': return <TrendingUpIcon />
      default: return <ScheduleIcon />
    }
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        ⚙️ Hyperparameter Tuning
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Optimize model hyperparameters using advanced search algorithms
      </Typography>

      {/* Tuning Configuration */}
      {!isCompleted && !isTuning && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Tuning Configuration
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <FormLabel>Search Method</FormLabel>
                  <Select
                    value={tuningMethod}
                    onChange={(e) => setTuningMethod(e.target.value)}
                  >
                    <MenuItem value="bayesian">Bayesian Optimization</MenuItem>
                    <MenuItem value="random">Random Search</MenuItem>
                    <MenuItem value="grid">Grid Search</MenuItem>
                    <MenuItem value="genetic">Genetic Algorithm</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <FormLabel>Max Trials</FormLabel>
                  <TextField
                    type="number"
                    value={maxTrials}
                    onChange={(e) => setMaxTrials(parseInt(e.target.value))}
                    inputProps={{ min: 10, max: 200 }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Early Stopping"
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {!isCompleted && !isTuning && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={startTuning}
            startIcon={<TuneIcon />}
            sx={{ 
              px: 4,
              py: 1.5,
              background: 'linear-gradient(45deg, #9c27b0, #e91e63)',
              '&:hover': {
                background: 'linear-gradient(45deg, #7b1fa2, #c2185b)',
              }
            }}
          >
            Start Hyperparameter Tuning
          </Button>
        </Box>
      )}


      {isCompleted && (
        <Alert severity="success" sx={{ mt: 2, mb: 3 }}>
          ✅ Hyperparameter tuning completed! LightGBM achieved 99.12% accuracy (+0.58% improvement).
        </Alert>
      )}

      <Grid container spacing={2}>
        {tuningResults.map((result, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ 
              border: result.status === 'best' ? '2px solid #4caf50' : '1px solid #e0e0e0',
              bgcolor: result.status === 'best' ? 'success.50' : 'background.paper'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {result.model}
                  </Typography>
                  <Chip
                    icon={getStatusIcon(result.status)}
                    label={result.status === 'best' ? 'Best Tuned' : result.status}
                    color={getStatusColor(result.status)}
                    size="small"
                  />
                </Box>

                {result.status === 'completed' || result.status === 'best' ? (
                  <Box>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                        {result.bestScore}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Best Accuracy
                      </Typography>
                      <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                        +{result.improvement}% improvement
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                      Best Parameters:
                    </Typography>
                    <List dense>
                      {Object.entries(result.bestParams).map(([key, value]) => (
                        <ListItem key={key} sx={{ py: 0.5 }}>
                          <ListItemText 
                            primary={key.replace(/_/g, ' ')}
                            secondary={value}
                            primaryTypographyProps={{ variant: 'body2' }}
                            secondaryTypographyProps={{ variant: 'caption' }}
                          />
                        </ListItem>
                      ))}
                    </List>

                    <Box sx={{ mt: 2, p: 1, bgcolor: 'info.50', borderRadius: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Trials: {result.trials} • Method: {tuningMethod}
                      </Typography>
                    </Box>
                  </Box>
                ) : result.status === 'tuning' ? (
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <CircularProgress size={40} sx={{ mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Optimizing parameters...
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <ScheduleIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Waiting to tune...
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
              🎯 Tuning Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                    3
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Models Tuned</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                    99.12%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Best Accuracy</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main" sx={{ fontWeight: 700 }}>
                    128
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Total Trials</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main" sx={{ fontWeight: 700 }}>
                    +0.58%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Improvement</Typography>
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
                Next: Results
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export default HyperparameterTuning
