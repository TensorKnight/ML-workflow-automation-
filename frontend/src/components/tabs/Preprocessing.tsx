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
  Select,
  MenuItem,
  Grid,
} from '@mui/material'

const Preprocessing: React.FC = () => {
  const [config, setConfig] = useState({
    imputation: {
      mean: ['age', 'trestbps', 'chol'],
      mode: ['sex', 'cp', 'fbs'],
    },
    encoding: {
      onehot: ['cp', 'restecg'],
      binary: ['sex', 'fbs'],
    },
    scaling: {
      standard: ['age', 'trestbps', 'chol'],
    },
    outlier: {
      method: 'zscore',
      threshold: 3,
      action: 'cap',
    },
  })

  const handleConfigChange = (section: string, key: string, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value,
      },
    }))
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Data Preprocessing Configuration
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Missing Value Handling
              </Typography>
              
              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <FormLabel component="legend">Mean Imputation</FormLabel>
                <FormGroup>
                  {['age', 'trestbps', 'chol', 'thalach', 'oldpeak'].map((col) => (
                    <FormControlLabel
                      key={col}
                      control={
                        <Checkbox
                          checked={config.imputation.mean.includes(col)}
                          onChange={(e) => {
                            const newMean = e.target.checked
                              ? [...config.imputation.mean, col]
                              : config.imputation.mean.filter((c) => c !== col)
                            handleConfigChange('imputation', 'mean', newMean)
                          }}
                        />
                      }
                      label={col}
                    />
                  ))}
                </FormGroup>
              </FormControl>

              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <FormLabel component="legend">Mode Imputation</FormLabel>
                <FormGroup>
                  {['sex', 'cp', 'fbs', 'restecg', 'exang'].map((col) => (
                    <FormControlLabel
                      key={col}
                      control={
                        <Checkbox
                          checked={config.imputation.mode.includes(col)}
                          onChange={(e) => {
                            const newMode = e.target.checked
                              ? [...config.imputation.mode, col]
                              : config.imputation.mode.filter((c) => c !== col)
                            handleConfigChange('imputation', 'mode', newMode)
                          }}
                        />
                      }
                      label={col}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Feature Encoding
              </Typography>
              
              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <FormLabel component="legend">One-Hot Encoding</FormLabel>
                <FormGroup>
                  {['cp', 'restecg', 'slope', 'thal'].map((col) => (
                    <FormControlLabel
                      key={col}
                      control={
                        <Checkbox
                          checked={config.encoding.onehot.includes(col)}
                          onChange={(e) => {
                            const newOnehot = e.target.checked
                              ? [...config.encoding.onehot, col]
                              : config.encoding.onehot.filter((c) => c !== col)
                            handleConfigChange('encoding', 'onehot', newOnehot)
                          }}
                        />
                      }
                      label={col}
                    />
                  ))}
                </FormGroup>
              </FormControl>

              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <FormLabel component="legend">Binary Encoding</FormLabel>
                <FormGroup>
                  {['sex', 'fbs', 'exang'].map((col) => (
                    <FormControlLabel
                      key={col}
                      control={
                        <Checkbox
                          checked={config.encoding.binary.includes(col)}
                          onChange={(e) => {
                            const newBinary = e.target.checked
                              ? [...config.encoding.binary, col]
                              : config.encoding.binary.filter((c) => c !== col)
                            handleConfigChange('encoding', 'binary', newBinary)
                          }}
                        />
                      }
                      label={col}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Feature Scaling
              </Typography>
              
              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <FormLabel component="legend">Standard Scaling</FormLabel>
                <FormGroup>
                  {['age', 'trestbps', 'chol', 'thalach', 'oldpeak'].map((col) => (
                    <FormControlLabel
                      key={col}
                      control={
                        <Checkbox
                          checked={config.scaling.standard.includes(col)}
                          onChange={(e) => {
                            const newStandard = e.target.checked
                              ? [...config.scaling.standard, col]
                              : config.scaling.standard.filter((c) => c !== col)
                            handleConfigChange('scaling', 'standard', newStandard)
                          }}
                        />
                      }
                      label={col}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Outlier Handling
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <FormLabel>Method</FormLabel>
                <Select
                  value={config.outlier.method}
                  onChange={(e) => handleConfigChange('outlier', 'method', e.target.value)}
                >
                  <MenuItem value="zscore">Z-Score</MenuItem>
                  <MenuItem value="iqr">IQR</MenuItem>
                  <MenuItem value="isolation_forest">Isolation Forest</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Threshold"
                type="number"
                value={config.outlier.threshold}
                onChange={(e) => handleConfigChange('outlier', 'threshold', parseFloat(e.target.value))}
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth>
                <FormLabel>Action</FormLabel>
                <Select
                  value={config.outlier.action}
                  onChange={(e) => handleConfigChange('outlier', 'action', e.target.value)}
                >
                  <MenuItem value="remove">Remove Outliers</MenuItem>
                  <MenuItem value="cap">Cap Outliers</MenuItem>
                  <MenuItem value="transform">Transform (Log)</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Preprocessing

