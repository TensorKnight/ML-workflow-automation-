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
  TextField,
  Button,
  Grid,
  Chip,
  IconButton,
} from '@mui/material'
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material'

interface FeatureEngineeringProps {
  data: any
  onDataChange: (data: any) => void
  onNext: () => void
  onBack: () => void
}

const FeatureEngineering: React.FC<FeatureEngineeringProps> = ({
  data,
  onDataChange,
  onNext,
  onBack,
}) => {
  const [config, setConfig] = useState({
    autoFeatures: {
      polynomial: true,
      interaction: true,
      statistical: true,
      logTransform: true,
    },
    manualFeatures: [
      { name: 'age_trestbps_ratio', expression: 'age / trestbps' },
      { name: 'chol_thalach_product', expression: 'chol * thalach' },
    ],
    selection: {
      method: 'univariate',
      kFeatures: 15,
    },
  })

  const [newFeature, setNewFeature] = useState({ name: '', expression: '' })

  const handleAutoFeatureChange = (feature: string, checked: boolean) => {
    setConfig((prev) => ({
      ...prev,
      autoFeatures: {
        ...prev.autoFeatures,
        [feature]: checked,
      },
    }))
  }

  const handleAddManualFeature = () => {
    if (newFeature.name && newFeature.expression) {
      setConfig((prev) => ({
        ...prev,
        manualFeatures: [...prev.manualFeatures, { ...newFeature }],
      }))
      setNewFeature({ name: '', expression: '' })
    }
  }

  const handleRemoveManualFeature = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      manualFeatures: prev.manualFeatures.filter((_, i) => i !== index),
    }))
  }

  const handleNext = () => {
    onDataChange({ featureConfig: config })
    onNext()
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        🚀 Feature Engineering
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Auto-Generated Features
              </Typography>
              
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={config.autoFeatures.polynomial}
                      onChange={(e) => handleAutoFeatureChange('polynomial', e.target.checked)}
                    />
                  }
                  label="Polynomial Features (degree 2)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={config.autoFeatures.interaction}
                      onChange={(e) => handleAutoFeatureChange('interaction', e.target.checked)}
                    />
                  }
                  label="Interaction Features (max 20)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={config.autoFeatures.statistical}
                      onChange={(e) => handleAutoFeatureChange('statistical', e.target.checked)}
                    />
                  }
                  label="Statistical Features (mean, std, max, min)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={config.autoFeatures.logTransform}
                      onChange={(e) => handleAutoFeatureChange('logTransform', e.target.checked)}
                    />
                  }
                  label="Log Transformations"
                />
              </FormGroup>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Feature Selection
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <FormLabel>Selection Method</FormLabel>
                <select
                  value={config.selection.method}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      selection: { ...prev.selection, method: e.target.value },
                    }))
                  }
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  <option value="univariate">Univariate</option>
                  <option value="rfe">Recursive Feature Elimination</option>
                  <option value="variance">Variance-based</option>
                </select>
              </FormControl>

              <TextField
                fullWidth
                label="Top K Features"
                type="number"
                value={config.selection.kFeatures}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    selection: { ...prev.selection, kFeatures: parseInt(e.target.value) },
                  }))
                }
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Custom Features
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Create custom features using mathematical expressions
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    label="Feature Name"
                    value={newFeature.name}
                    onChange={(e) => setNewFeature((prev) => ({ ...prev, name: e.target.value }))}
                    size="small"
                  />
                  <TextField
                    label="Expression (e.g., age / trestbps)"
                    value={newFeature.expression}
                    onChange={(e) => setNewFeature((prev) => ({ ...prev, expression: e.target.value }))}
                    size="small"
                    sx={{ flexGrow: 1 }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddManualFeature}
                    disabled={!newFeature.name || !newFeature.expression}
                  >
                    Add
                  </Button>
                </Box>
              </Box>

              {config.manualFeatures.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Current Custom Features:
                  </Typography>
                  {config.manualFeatures.map((feature, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1,
                        p: 1,
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                      }}
                    >
                      <Chip label={feature.name} size="small" />
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        {feature.expression}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveManualFeature(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button variant="outlined" onClick={onBack}>
          ← Back
        </Button>
        <Button variant="contained" onClick={handleNext}>
          Continue to Model Training →
        </Button>
      </Box>
    </Box>
  )
}

export default FeatureEngineering

