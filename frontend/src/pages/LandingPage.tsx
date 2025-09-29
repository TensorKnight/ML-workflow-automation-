import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Paper,
  Avatar,
  Chip,
} from '@mui/material'
import {
  AutoAwesome as AutoAwesomeIcon,
  Speed as SpeedIcon,
  Analytics as AnalyticsIcon,
  CloudUpload as CloudUploadIcon,
  Psychology as PsychologyIcon,
  Timeline as TimelineIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material'

const LandingPage: React.FC = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Easy Data Upload',
      description: 'Drag and drop your datasets with support for CSV, Excel, and more formats.',
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Smart Preprocessing',
      description: 'Automated data cleaning, feature engineering, and preprocessing pipelines.',
    },
    {
      icon: <PsychologyIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'AutoML Training',
      description: 'Train multiple models automatically and find the best performing one.',
    },
    {
      icon: <TimelineIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Visual Analytics',
      description: 'Interactive charts and visualizations to understand your data and results.',
    },
  ]

  const benefits = [
    'No coding required - visual interface',
    'Automated model selection and tuning',
    'Real-time performance monitoring',
    'Export models for production use',
    'Collaborative project management',
    'Secure cloud-based processing',
  ]

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 12,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                ML Workflow
                <br />
                Automation
              </Typography>
              <Typography
                variant="h5"
                sx={{ mb: 4, opacity: 0.9, fontWeight: 300 }}
              >
                Build, train, and deploy machine learning models with ease.
                No coding required.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      bgcolor: 'grey.100',
                    },
                  }}
                  onClick={() => navigate('/projects')}
                >
                  Get Started
                  <ArrowForwardIcon sx={{ ml: 1 }} />
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 400,
                }}
              >
                <AutoAwesomeIcon sx={{ fontSize: 200, opacity: 0.3 }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
            Powerful Features
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Everything you need to build and deploy machine learning models
            in a single, intuitive platform.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                Why Choose Our Platform?
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                Experience the future of machine learning with our automated
                workflow platform designed for both beginners and experts.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {benefits.map((benefit, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CheckCircleIcon sx={{ color: 'success.main' }} />
                    <Typography variant="body1">{benefit}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 4,
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                }}
              >
                <SpeedIcon sx={{ fontSize: 80, mb: 2, opacity: 0.8 }} />
                <Typography variant="h5" gutterBottom>
                  Lightning Fast
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Process your data and train models in minutes, not hours.
                  Our optimized infrastructure handles the heavy lifting.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Ready to Get Started?
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Join thousands of data scientists and analysts who trust our platform
          for their machine learning needs.
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{ px: 6, py: 2 }}
          onClick={() => navigate('/projects')}
        >
          Start Your First Project
          <ArrowForwardIcon sx={{ ml: 1 }} />
        </Button>
      </Container>
    </Box>
  )
}

export default LandingPage