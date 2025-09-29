import React from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  LinearProgress,
} from '@mui/material'
import {
  Download as DownloadIcon,
  Share as ShareIcon,
  PlayArrow as PlayIcon,
} from '@mui/icons-material'

interface ResultsProps {
  data: any
  onBack: () => void
  onFinish: () => void
}

const Results: React.FC<ResultsProps> = ({ data, onBack, onFinish }) => {
  const results = data.results || {
    bestModel: 'Random Forest',
    models: [
      { name: 'Random Forest', accuracy: 0.89, auc: 0.92, f1: 0.88, time: 2.3 },
      { name: 'XGBoost', accuracy: 0.87, auc: 0.90, f1: 0.86, time: 1.8 },
      { name: 'LightGBM', accuracy: 0.88, auc: 0.91, f1: 0.87, time: 1.2 },
    ],
  }

  const bestModel = results.models.find((model: any) => model.name === results.bestModel)

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        📊 Results & Model Performance
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🏆 Best Model
              </Typography>
              <Typography variant="h4" color="primary" gutterBottom>
                {results.bestModel}
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Accuracy
                </Typography>
                <Typography variant="h5">
                  {(bestModel?.accuracy * 100).toFixed(1)}%
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  AUC Score
                </Typography>
                <Typography variant="h5">
                  {bestModel?.auc.toFixed(3)}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  F1 Score
                </Typography>
                <Typography variant="h5">
                  {bestModel?.f1.toFixed(3)}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Training Time
                </Typography>
                <Typography variant="h5">
                  {bestModel?.time}s
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📈 Performance Metrics
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Accuracy Distribution
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={bestModel?.accuracy * 100}
                  sx={{ height: 8, borderRadius: 4, mb: 1 }}
                />
                <Typography variant="caption">
                  {bestModel?.accuracy.toFixed(3)} / 1.000
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  AUC Score
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={bestModel?.auc * 100}
                  sx={{ height: 8, borderRadius: 4, mb: 1 }}
                />
                <Typography variant="caption">
                  {bestModel?.auc.toFixed(3)} / 1.000
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  F1 Score
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={bestModel?.f1 * 100}
                  sx={{ height: 8, borderRadius: 4, mb: 1 }}
                />
                <Typography variant="caption">
                  {bestModel?.f1.toFixed(3)} / 1.000
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🏅 All Model Results
              </Typography>
              
              <Box sx={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                      <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>
                        Rank
                      </th>
                      <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>
                        Model
                      </th>
                      <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>
                        Accuracy
                      </th>
                      <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>
                        AUC
                      </th>
                      <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>
                        F1 Score
                      </th>
                      <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>
                        Time (sec)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.models
                      .sort((a: any, b: any) => b.accuracy - a.accuracy)
                      .map((model: any, index: number) => (
                        <tr
                          key={index}
                          style={{
                            backgroundColor: model.name === results.bestModel ? '#e8f5e8' : 'white',
                          }}
                        >
                          <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                            #{index + 1}
                          </td>
                          <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                            {model.name}
                            {model.name === results.bestModel && (
                              <Chip label="Best" color="success" size="small" sx={{ ml: 1 }} />
                            )}
                          </td>
                          <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                            {(model.accuracy * 100).toFixed(1)}%
                          </td>
                          <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                            {model.auc.toFixed(3)}
                          </td>
                          <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                            {model.f1.toFixed(3)}
                          </td>
                          <td style={{ padding: '12px', border: '1px solid #ddd' }}>
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

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🚀 Next Steps
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<PlayIcon />}
                    onClick={() => console.log('Retrain model')}
                  >
                    Retrain Model
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<DownloadIcon />}
                    onClick={() => console.log('Download model')}
                  >
                    Download Model
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<ShareIcon />}
                    onClick={() => console.log('Share project')}
                  >
                    Share Project
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => console.log('Create new experiment')}
                  >
                    New Experiment
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button variant="outlined" onClick={onBack}>
          ← Back
        </Button>
        <Button variant="contained" onClick={onFinish}>
          Finish & Save Project
        </Button>
      </Box>
    </Box>
  )
}

export default Results

