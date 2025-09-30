import React, { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
  Chip,
  Slider,
  Select,
  MenuItem,
  TextField,
  Alert,
} from '@mui/material'
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material'

interface FeatureSelectionProps {
  onNext?: () => void
}

const FeatureSelection: React.FC<FeatureSelectionProps> = ({ onNext }) => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 
    'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
  ])
  const [method, setMethod] = useState('correlation')
  const [threshold, setThreshold] = useState(0.1)
  const [maxFeatures, setMaxFeatures] = useState(10)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const availableFeatures = [
    'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 
    'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
  ]

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    )
  }

  const handleSelectAll = () => {
    setSelectedFeatures(availableFeatures)
  }

  const handleDeselectAll = () => {
    setSelectedFeatures([])
  }

  const handleSelectFeatures = async () => {
    setIsProcessing(true)
    
    // Simulate feature selection
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsProcessing(false)
    setIsCompleted(true)
  }

  return (
    <Box>
      {!isCompleted ? (
        <>
          <Typography variant="h6" gutterBottom>
            Feature Selection
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Select the features to use for the heart disease classification model
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            ✅ Feature Selection Completed
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            All 13 features have been selected for the heart disease classification model
          </Typography>
          <Alert severity="success" sx={{ mt: 2 }}>
            Feature selection completed! {selectedFeatures.length} features selected for model training.
          </Alert>
          
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
                Next: Model Training
              </Button>
            </Box>
          )}
        </>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Select Features
                </Typography>
                <Box>
                  <Button size="small" onClick={handleSelectAll} sx={{ mr: 1 }}>
                    Select All
                  </Button>
                  <Button size="small" onClick={handleDeselectAll}>
                    Deselect All
                  </Button>
                </Box>
              </Box>

              <FormControl component="fieldset" fullWidth>
                <FormGroup>
                  <Grid container spacing={1}>
                    {availableFeatures.map((feature) => (
                      <Grid item xs={6} sm={4} md={3} key={feature}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedFeatures.includes(feature)}
                              onChange={() => handleFeatureToggle(feature)}
                            />
                          }
                          label={feature}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </FormControl>

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Selected: {selectedFeatures.length} / {availableFeatures.length} features
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {selectedFeatures.map((feature) => (
                    <Chip
                      key={feature}
                      label={feature}
                      size="small"
                      onDelete={() => handleFeatureToggle(feature)}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Selection Method
              </Typography>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <FormLabel>Method</FormLabel>
                <Select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                >
                  <MenuItem value="correlation">Correlation</MenuItem>
                  <MenuItem value="mutual_info">Mutual Information</MenuItem>
                  <MenuItem value="chi2">Chi-Square</MenuItem>
                  <MenuItem value="f_score">F-Score</MenuItem>
                  <MenuItem value="rfe">Recursive Feature Elimination</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Threshold"
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                inputProps={{ min: 0, max: 1, step: 0.01 }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Max Features"
                type="number"
                value={maxFeatures}
                onChange={(e) => setMaxFeatures(parseInt(e.target.value))}
                inputProps={{ min: 1, max: availableFeatures.length }}
                sx={{ mb: 2 }}
              />

              <Button 
                variant="contained" 
                fullWidth
                disabled={selectedFeatures.length === 0}
              >
                Apply Selection
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {!isCompleted && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSelectFeatures}
            disabled={isProcessing}
            sx={{ 
              px: 4,
              py: 1.5,
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0, #1976d2)',
              }
            }}
          >
            {isProcessing ? 'Selecting Features...' : 'Select Features →'}
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default FeatureSelection

