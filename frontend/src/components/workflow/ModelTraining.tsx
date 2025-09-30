import React, { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Grid,
  LinearProgress,
  Alert,
} from '@mui/material'

interface ModelTrainingProps {
  data: any
  onDataChange: (data: any) => void
  onNext: () => void
  onBack: () => void
}

const ModelTraining: React.FC<ModelTrainingProps> = ({
  data,
  onDataChange,
  onNext,
  onBack,
}) => {
  const [config, setConfig] = useState({
    problemType: 'classification',
    testSize: 0.2,
    randomState: 42,
    selectionType: 'best',
    kModels: 3,
  })

  const [trainingStatus, setTrainingStatus] = useState<'idle' | 'training' | 'completed'>('idle')
  const [results, setResults] = useState<any>(null)

  const handleConfigChange = (key: string, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleStartTraining = () => {
    setTrainingStatus('training')
    
    // Simulate training process
    setTimeout(() => {
      setTrainingStatus('completed')
      setResults({
        models: [
          { name: 'Random Forest', accuracy: 0.89, auc: 0.92, f1: 0.88, time: 2.3 },
          { name: 'XGBoost', accuracy: 0.87, auc: 0.90, f1: 0.86, time: 1.8 },
          { name: 'LightGBM', accuracy: 0.88, auc: 0.91, f1: 0.87, time: 1.2 },
          { name: 'Logistic Regression', accuracy: 0.85, auc: 0.88, f1: 0.84, time: 0.5 },
        ],
        bestModel: 'Random Forest',
      })
      onDataChange({ trainingConfig: config, results })
    }, 3000)
  }

  const handleNext = () => {
    onNext()
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        🤖 Model Training & Selection
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Training Configuration
              </Typography>
              
              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <FormLabel component="legend">Problem Type</FormLabel>
                <RadioGroup
                  value={config.problemType}
                  onChange={(e) => handleConfigChange('problemType', e.target.value)}
                >
                  <FormControlLabel value="classification" control={<Radio />} label="Classification" />
                  <FormControlLabel value="regression" control={<Radio />} label="Regression" />
                </RadioGroup>
              </FormControl>

              <TextField
                fullWidth
                label="Test Size"
                type="number"
                value={config.testSize}
                onChange={(e) => handleConfigChange('testSize', parseFloat(e.target.value))}
                inputProps={{ min: 0.1, max: 0.5, step: 0.1 }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Random State"
                type="number"
                value={config.randomState}
                onChange={(e) => handleConfigChange('randomState', parseInt(e.target.value))}
                sx={{ mb: 2 }}
              />

              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <FormLabel component="legend">Model Selection</FormLabel>
                <RadioGroup
                  value={config.selectionType}
                  onChange={(e) => handleConfigChange('selectionType', e.target.value)}
                >
                  <FormControlLabel value="best" control={<Radio />} label="Best Model Only" />
                  <FormControlLabel value="top_k" control={<Radio />} label="Top K Models" />
                  <FormControlLabel value="ensemble" control={<Radio />} label="Ensemble" />
                </RadioGroup>
              </FormControl>

              {config.selectionType === 'top_k' && (
                <TextField
                  fullWidth
                  label="Number of Top Models"
                  type="number"
                  value={config.kModels}
                  onChange={(e) => handleConfigChange('kModels', parseInt(e.target.value))}
                  inputProps={{ min: 2, max: 10 }}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Training Status
              </Typography>
              
              {trainingStatus === 'idle' && (
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Ready to start training. Click the button below to begin.
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleStartTraining}
                    sx={{ mt: 2 }}
                  >
                    Start Training
                  </Button>
                </Box>
              )}

              {trainingStatus === 'training' && (
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Training models... This may take a few minutes.
                  </Typography>
                  <LinearProgress sx={{ mt: 2 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Training 13+ models and evaluating performance...
                  </Typography>
                </Box>
              )}

              {trainingStatus === 'completed' && results && (
                <Box>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Training completed successfully!
                  </Alert>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Best Model: {results.bestModel}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    {results.models.length} models trained and evaluated
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {results && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🏆 Model Performance Results
                </Typography>
                
                <Box sx={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f5f5f5' }}>
                        <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>
                          Model
                        </th>
                        <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>
                          Accuracy
                        </th>
                        <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>
                          AUC
                        </th>
                        <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>
                          F1 Score
                        </th>
                        <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>
                          Time (sec)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.models.map((model: any, index: number) => (
                        <tr
                          key={index}
                          style={{
                            backgroundColor: model.name === results.bestModel ? '#e8f5e8' : 'white',
                          }}
                        >
                          <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                            {model.name}
                            {model.name === results.bestModel && ' 🏆'}
                          </td>
                          <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                            {(model.accuracy * 100).toFixed(1)}%
                          </td>
                          <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                            {model.auc.toFixed(3)}
                          </td>
                          <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                            {model.f1.toFixed(3)}
                          </td>
                          <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                            {model.time}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button variant="outlined" onClick={onBack}>
          ← Back
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={trainingStatus !== 'completed'}
        >
          View Results →
        </Button>
      </Box>
    </Box>
  )
}

export default ModelTraining

