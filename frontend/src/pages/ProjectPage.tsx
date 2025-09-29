import React from 'react'
import { useParams } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
} from '@mui/material'
import {
  PlayArrow as PlayIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
} from '@mui/icons-material'

const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  // Mock project data
  const project = {
    id: id,
    name: 'Heart Disease Prediction',
    status: 'completed',
    createdAt: '2024-01-15',
    problemType: 'classification',
    dataset: {
      rows: 1024,
      columns: 13,
      size: '2.1 MB',
    },
    results: {
      bestModel: 'Random Forest',
      accuracy: 0.89,
      auc: 0.92,
      f1Score: 0.88,
    },
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {project.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Chip
            label={project.status}
            color={project.status === 'completed' ? 'success' : 'warning'}
          />
          <Typography variant="body2" color="text.secondary">
            Created: {project.createdAt}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Project Overview
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Problem Type
                  </Typography>
                  <Typography variant="body1">
                    {project.problemType.charAt(0).toUpperCase() + project.problemType.slice(1)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Dataset Size
                  </Typography>
                  <Typography variant="body1">
                    {project.dataset.rows} rows × {project.dataset.columns} columns
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    File Size
                  </Typography>
                  <Typography variant="body1">
                    {project.dataset.size}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Best Model
                  </Typography>
                  <Typography variant="body1">
                    {project.results.bestModel}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Model Performance
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Accuracy
                </Typography>
                <Typography variant="h4" color="primary">
                  {(project.results.accuracy * 100).toFixed(1)}%
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  AUC Score
                </Typography>
                <Typography variant="h4" color="primary">
                  {project.results.auc.toFixed(3)}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  F1 Score
                </Typography>
                <Typography variant="h4" color="primary">
                  {project.results.f1Score.toFixed(3)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Actions
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<PlayIcon />}
                  onClick={() => console.log('Retrain model')}
                >
                  Retrain Model
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => console.log('Download model')}
                >
                  Download Model
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ShareIcon />}
                  onClick={() => console.log('Share project')}
                >
                  Share Project
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default ProjectPage

