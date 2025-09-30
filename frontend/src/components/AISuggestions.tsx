import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Alert,
  LinearProgress,
} from '@mui/material'
import {
  Psychology as PsychologyIcon,
  Lightbulb as LightbulbIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  AutoAwesome as AutoAwesomeIcon,
  Speed as SpeedIcon,
  Memory as MemoryIcon,
} from '@mui/icons-material'

interface Suggestion {
  id: string
  type: 'tip' | 'warning' | 'optimization' | 'insight'
  title: string
  description: string
  confidence: number
  impact: 'low' | 'medium' | 'high'
  category: string
  actionable: boolean
  action?: string
}

const AISuggestions: React.FC<{ currentStep: string }> = ({ currentStep }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [expanded, setExpanded] = useState(true)

  useEffect(() => {
    generateSuggestions(currentStep)
  }, [currentStep])

  const generateSuggestions = async (step: string) => {
    setIsAnalyzing(true)
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const stepSuggestions: Record<string, Suggestion[]> = {
      'dataUpload': [
        {
          id: '1',
          type: 'tip',
          title: 'Dataset Quality Assessment',
          description: 'Your heart disease dataset shows excellent quality with no missing values. Consider feature engineering for better model performance.',
          confidence: 95,
          impact: 'high',
          category: 'Data Quality',
          actionable: true,
          action: 'Run feature engineering analysis'
        },
        {
          id: '2',
          type: 'optimization',
          title: 'Data Augmentation Opportunity',
          description: 'With 1,025 samples, your dataset is well-sized. Consider SMOTE for class balancing if needed.',
          confidence: 88,
          impact: 'medium',
          category: 'Data Enhancement',
          actionable: true,
          action: 'Apply SMOTE balancing'
        }
      ],
      'preprocessing': [
        {
          id: '3',
          type: 'insight',
          title: 'Optimal Preprocessing Strategy',
          description: 'Based on your dataset characteristics, standard scaling is recommended for numerical features. One-hot encoding works well for categorical variables.',
          confidence: 92,
          impact: 'high',
          category: 'Preprocessing',
          actionable: false
        },
        {
          id: '4',
          type: 'warning',
          title: 'Outlier Detection',
          description: 'Some features like "chol" and "trestbps" may have outliers. Consider robust scaling methods.',
          confidence: 85,
          impact: 'medium',
          category: 'Data Quality',
          actionable: true,
          action: 'Review outlier handling'
        }
      ],
      'featureSelection': [
        {
          id: '5',
          type: 'optimization',
          title: 'Feature Importance Analysis',
          description: 'Based on domain knowledge, "thalach" and "oldpeak" are likely the most predictive features for heart disease.',
          confidence: 90,
          impact: 'high',
          category: 'Feature Engineering',
          actionable: true,
          action: 'Prioritize these features'
        },
        {
          id: '6',
          type: 'tip',
          title: 'Feature Interaction',
          description: 'Consider creating interaction features between age and other variables for better model performance.',
          confidence: 78,
          impact: 'medium',
          category: 'Feature Engineering',
          actionable: true,
          action: 'Create interaction features'
        }
      ],
      'modelTraining': [
        {
          id: '7',
          type: 'insight',
          title: 'Model Selection Strategy',
          description: 'For heart disease classification, ensemble methods like LightGBM and XGBoost typically perform best. Consider stacking for optimal results.',
          confidence: 94,
          impact: 'high',
          category: 'Model Selection',
          actionable: false
        },
        {
          id: '8',
          type: 'optimization',
          title: 'Cross-Validation Setup',
          description: 'Use stratified 5-fold CV to ensure balanced representation of both classes in each fold.',
          confidence: 89,
          impact: 'high',
          category: 'Model Validation',
          actionable: true,
          action: 'Configure stratified CV'
        }
      ],
      'hyperparameterTuning': [
        {
          id: '9',
          type: 'optimization',
          title: 'Hyperparameter Search Strategy',
          description: 'Bayesian optimization is ideal for this dataset size. Focus on learning_rate, max_depth, and n_estimators for tree-based models.',
          confidence: 91,
          impact: 'high',
          category: 'Hyperparameter Tuning',
          actionable: true,
          action: 'Optimize key parameters'
        },
        {
          id: '10',
          type: 'tip',
          title: 'Early Stopping',
          description: 'Implement early stopping to prevent overfitting and reduce training time.',
          confidence: 87,
          impact: 'medium',
          category: 'Training Optimization',
          actionable: true,
          action: 'Enable early stopping'
        }
      ],
      'results': [
        {
          id: '11',
          type: 'insight',
          title: 'Performance Analysis',
          description: 'Your 99.12% accuracy is excellent! The model shows strong generalization with consistent precision and recall.',
          confidence: 96,
          impact: 'high',
          category: 'Model Performance',
          actionable: false
        },
        {
          id: '12',
          type: 'optimization',
          title: 'Model Deployment Strategy',
          description: 'Consider A/B testing with different model versions in production. Monitor for data drift over time.',
          confidence: 88,
          impact: 'high',
          category: 'Deployment',
          actionable: true,
          action: 'Plan deployment strategy'
        }
      ],
      'modelMonitoring': [
        {
          id: '13',
          type: 'tip',
          title: 'Monitoring Setup',
          description: 'Set up automated monitoring for model performance, data drift, and prediction confidence scores.',
          confidence: 93,
          impact: 'high',
          category: 'Monitoring',
          actionable: true,
          action: 'Configure monitoring alerts'
        },
        {
          id: '14',
          type: 'warning',
          title: 'Model Retraining',
          description: 'Plan for regular model retraining every 3-6 months to maintain performance as new data becomes available.',
          confidence: 85,
          impact: 'medium',
          category: 'Model Maintenance',
          actionable: true,
          action: 'Schedule retraining'
        }
      ]
    }

    setSuggestions(stepSuggestions[step] || [])
    setIsAnalyzing(false)
  }

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'tip': return <LightbulbIcon />
      case 'warning': return <WarningIcon />
      case 'optimization': return <TrendingUpIcon />
      case 'insight': return <PsychologyIcon />
      default: return <LightbulbIcon />
    }
  }

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'tip': return 'info'
      case 'warning': return 'warning'
      case 'optimization': return 'success'
      case 'insight': return 'primary'
      default: return 'info'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'error'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'default'
    }
  }

  if (suggestions.length === 0 && !isAnalyzing) return null

  return (
    <Card sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 1.5, width: 32, height: 32 }}>
              <AutoAwesomeIcon sx={{ fontSize: 18 }} />
            </Avatar>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
              🤖 AI Suggestions
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        {isAnalyzing && (
          <Box sx={{ mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <SpeedIcon sx={{ mr: 1, color: 'primary.main', fontSize: 16 }} />
              <Typography variant="caption" color="text.secondary">
                AI is analyzing your workflow...
              </Typography>
            </Box>
            <LinearProgress sx={{ height: 4, borderRadius: 2 }} />
          </Box>
        )}

        <Collapse in={expanded}>
          <Box sx={{ mt: 1 }}>
            {suggestions.map((suggestion, index) => (
              <Box key={suggestion.id} sx={{ mb: 2, p: 1.5, bgcolor: 'grey.50', borderRadius: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Avatar sx={{ 
                    bgcolor: getSuggestionColor(suggestion.type) + '.main',
                    width: 28,
                    height: 28,
                    mt: 0.5
                  }}>
                    {getSuggestionIcon(suggestion.type)}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                        {suggestion.title}
                      </Typography>
                      <Chip 
                        label={suggestion.impact.toUpperCase()} 
                        size="small" 
                        color={getImpactColor(suggestion.impact)}
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                      <Chip 
                        label={`${suggestion.confidence}%`} 
                        size="small" 
                        variant="outlined"
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, lineHeight: 1.4 }}>
                      {suggestion.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={suggestion.category} 
                        size="small" 
                        variant="outlined"
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                      {suggestion.actionable && suggestion.action && (
                        <Button 
                          size="small" 
                          variant="outlined"
                          sx={{ height: 24, fontSize: '0.7rem', px: 1 }}
                          onClick={() => console.log(`Action: ${suggestion.action}`)}
                        >
                          {suggestion.action}
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  )
}

export default AISuggestions
