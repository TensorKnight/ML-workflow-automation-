import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
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
  TrendingUp as TrendingUpIcon,
  Code as CodeIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material'

const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  // Testimonial transition state
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

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
    {
      icon: <DescriptionIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Auto Documentation',
      description: 'Automatically generate comprehensive documentation for your ML models and workflows.',
    },
  ]

  const benefits = [
    'No coding required - visual interface',
    'AI powered suggestions',
    'Flexibility for everything',
    'Export models for production use',
    'Documents everything for you',
    'Easy deployment',
  ]


  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Data Scientist',
      company: 'TechCorp',
      content: 'This platform revolutionized our ML workflow. We went from weeks to days in model development.',
      avatar: 'SC',
    },
    {
      name: 'Michael Rodriguez',
      role: 'ML Engineer',
      company: 'DataFlow Inc',
      content: 'The automated feature engineering saved us countless hours. Highly recommended!',
      avatar: 'MR',
    },
    {
      name: 'Emily Watson',
      role: 'Analytics Director',
      company: 'GrowthCo',
      content: 'Finally, a tool that makes ML accessible to our entire team. Game changer!',
      avatar: 'EW',
    },
  ]

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
        setTimeout(() => {
          setIsTransitioning(false)
        }, 50) // Small delay to ensure content is updated
      }, 500) // Half of the transition duration
    }, 5000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [testimonials.length])

  // Enhanced scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          // Add staggered animation for multiple elements
          const delay = Array.from(entry.target.parentNode?.children || []).indexOf(entry.target) * 100
          setTimeout(() => {
            if (entry.target instanceof HTMLElement) {
              entry.target.style.animationDelay = `${delay}ms`
            }
          }, 0)
        }
      })
    }, observerOptions)

    const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in')
    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  const useCases = [
    {
      icon: <BusinessIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: 'Business Analytics',
      description: 'Predict customer behavior, optimize pricing, and forecast sales with ease.',
    },
    {
      icon: <SchoolIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: 'Research & Academia',
      description: 'Accelerate research with automated model training and validation.',
    },
    {
      icon: <CodeIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: 'Software Development',
      description: 'Integrate ML models into your applications with our API.',
    },
  ]

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
            py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            animation: 'float 6s ease-in-out infinite',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
            animation: 'shimmer 3s ease-in-out infinite',
          },
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-10px)' },
          },
          '@keyframes shimmer': {
            '0%': { opacity: 0.3 },
            '50%': { opacity: 0.6 },
            '100%': { opacity: 0.3 },
          },
          '@keyframes pulse': {
            '0%, 100%': { opacity: 0.3 },
            '50%': { opacity: 0.8 },
          },
        }}
      >
        {/* Enhanced Floating Icons */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1],
            y: [0, -10, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            top: '20%',
            right: '10%',
            zIndex: 0,
          }}
        >
          <Box sx={{
            '& svg': {
              fontSize: 40,
              color: 'rgba(255, 255, 255, 0.2)',
              filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))',
              transition: 'all 0.3s ease-in-out',
            },
          }}>
            <AnalyticsIcon />
          </Box>
        </motion.div>
        
        <Box sx={{
          position: 'absolute',
          bottom: '30%',
          left: '15%',
          animation: 'float 4s ease-in-out infinite reverse, pulse 3s ease-in-out infinite',
          zIndex: 0,
          '& svg': {
            fontSize: 35,
            color: 'rgba(255, 255, 255, 0.15)',
            filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.2))',
            transition: 'all 0.3s ease-in-out',
          },
          '&:hover svg': {
            color: 'rgba(255, 255, 255, 0.3)',
            transform: 'scale(1.1)',
            filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.4))',
          }
        }}>
          <CloudUploadIcon />
        </Box>

        <Box sx={{
          position: 'absolute',
          top: '60%',
          right: '20%',
          animation: 'float 5s ease-in-out infinite, pulse 2.5s ease-in-out infinite',
          zIndex: 0,
          '& svg': {
            fontSize: 30,
            color: 'rgba(255, 255, 255, 0.1)',
            filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.15))',
            transition: 'all 0.3s ease-in-out',
          },
          '&:hover svg': {
            color: 'rgba(255, 255, 255, 0.25)',
            transform: 'scale(1.1)',
            filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))',
          }
        }}>
          <CodeIcon />
        </Box>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.08, 0.2, 0.08],
            scale: [1, 1.1, 1],
            y: [0, -20, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          style={{
            position: 'absolute',
            top: '40%',
            left: '5%',
            zIndex: 0,
          }}
        >
          <Box sx={{
            '& svg': {
              fontSize: 25,
              color: 'rgba(255, 255, 255, 0.08)',
              filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.1))',
              transition: 'all 0.3s ease-in-out',
            },
          }}>
            <SpeedIcon />
          </Box>
        </motion.div>

        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
              <Typography
                    variant={isMobile ? 'h3' : 'h2'}
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                      mb: 2,
                }}
              >
                OctaML
                <br />
                
              </Typography>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
              <Typography
                    variant={isMobile ? 'h6' : 'h5'}
                    sx={{ mb: 4, opacity: 0.9, fontWeight: 300, lineHeight: 1.6 }}
              >
                Build, train, and deploy machine learning models in minutes.
                    <br />
                    <strong>No coding required.</strong>
              </Typography>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                >
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    px: 4,
                    py: 1.5,
                      fontWeight: 600,
                      borderRadius: 3,
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      bgcolor: 'grey.100',
                        transform: 'translateY(-3px) scale(1.02)',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                    },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:active': {
                        transform: 'translateY(-1px) scale(0.98)',
                      }
                  }}
                  onClick={() => navigate('/projects')}
                >
                    Get Started Free
                    <ArrowForwardIcon sx={{ ml: 1, transition: 'transform 0.3s ease-in-out' }} />
                </Button>
                  </Stack>
                </motion.div>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: { xs: 300, md: 400 },
                  position: 'relative',
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    y: [0, -20, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    ease: "easeOut",
                    y: {
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 10,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      '& svg': {
                        filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))',
                        transition: 'all 0.3s ease-in-out',
                      },
                    }}
                  >
                    <AutoAwesomeIcon sx={{ fontSize: { xs: 150, md: 200 }, opacity: 0.8 }} />
                  </Box>
                </motion.div>
              </Box>
            </Grid>
          </Grid>
        </Container>
        </Box>
      </motion.div>

      {/* Full Width Quote Section */}
      <Box sx={{ 
        bgcolor: 'background.default',
        py: 6,
        textAlign: 'center',
      }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Box sx={{ position: 'relative' }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <Typography 
                  variant="h1" 
                  sx={{ 
                    position: 'absolute',
                    top: -20,
                    left: -10,
                    fontSize: '4rem',
                    color: 'rgba(102, 126, 234, 0.2)',
                    fontFamily: 'serif',
                    lineHeight: 1,
                    zIndex: 0,
                  }}
                >
                  "
                </Typography>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <Typography variant="h3" component="h2" sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  textShadow: '0 0 30px rgba(102, 126, 234, 0.3)',
                  fontStyle: 'italic',
                  position: 'relative',
                  zIndex: 1,
                  pl: 2,
                }}>
                  Machine Learning model in Seconds
                </Typography>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ 
        py: 8,
        '& .fade-in': {
          opacity: 0,
          transform: 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          '&.visible': {
            opacity: 1,
            transform: 'translateY(0)',
          }
        },
        '& .slide-in-left': {
          opacity: 0,
          transform: 'translateX(-50px)',
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          '&.visible': {
            opacity: 1,
            transform: 'translateX(0)',
          }
        },
        '& .slide-in-right': {
          opacity: 0,
          transform: 'translateX(50px)',
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          '&.visible': {
            opacity: 1,
            transform: 'translateX(0)',
          }
        },
        '& .scale-in': {
          opacity: 0,
          transform: 'scale(0.8)',
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          '&.visible': {
            opacity: 1,
            transform: 'scale(1)',
          }
        }
      }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
            Powerful Features
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Everything you need to build and deploy machine learning models
            in a single, intuitive platform.
          </Typography>
        </Box>
        </motion.div>

        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'center', 
          gap: 3,
          maxWidth: 1000,
          mx: 'auto',
          '& > *': {
            flex: '0 0 auto',
          }
        }}>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1, 
                ease: "easeOut" 
              }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
            <Box
              key={index}
                sx={{
                width: { xs: '100%', sm: '280px', md: '300px' },
                height: { xs: 'auto', sm: '200px' },
                  display: 'flex',
                  flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                p: 3,
                position: 'relative',
                '&:nth-of-type(odd)': {
                  transform: { sm: 'translateY(20px)' },
                },
                '&:nth-of-type(3n)': {
                  transform: { md: 'translateX(50px)' },
                },
                '&:nth-of-type(3n+1)': {
                  transform: { md: 'translateX(-50px)' },
                },
                transition: 'all 0.3s ease-in-out',
              }}
            >
              <Box sx={{ 
                mb: 2, 
                display: 'flex', 
                justifyContent: 'center',
                '& svg': {
                  transition: 'transform 0.3s ease-in-out',
                },
                '&:hover svg': {
                  transform: 'scale(1.1)',
                }
              }}>
                {feature.icon}
              </Box>
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                {feature.description}
              </Typography>
            </Box>
            </motion.div>
          ))}
        </Box>
      </Container>

      {/* Full Width Quote Section */}
      <Box sx={{ 
        bgcolor: 'background.default',
        py: 6,
        textAlign: 'center',
      }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Box sx={{ position: 'relative' }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <Typography 
                  variant="h1" 
                  sx={{ 
                    position: 'absolute',
                    top: -20,
                    left: -10,
                    fontSize: '4rem',
                    color: 'rgba(118, 75, 162, 0.2)',
                    fontFamily: 'serif',
                    lineHeight: 1,
                    zIndex: 0,
                  }}
                >
                  "
                </Typography>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <Typography variant="h3" component="h2" sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  textShadow: '0 0 30px rgba(118, 75, 162, 0.3)',
                  fontStyle: 'italic',
                  position: 'relative',
                  zIndex: 1,
                  pl: 2,
                }}>
                  Made in Bharat. Made for the World.
                </Typography>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Pipeline Workflow Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                Your ML Pipeline Journey
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                From raw data to production-ready models in just a few simple steps
              </Typography>
            </Box>
          </motion.div>

          {/* Workflow Steps */}
          <Box sx={{ position: 'relative' }}>
            {/* Connection Lines */}
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              zIndex: 0,
              display: { xs: 'none', md: 'block' }
            }} />

            <Grid container spacing={4}>
              {[
                {
                  step: 1,
                  title: 'Data Upload',
                  description: 'Upload datasets in any format',
                  icon: <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
                  color: 'primary.main'
                },
                {
                  step: 2,
                  title: 'Smart Preprocessing',
                  description: 'AI automatically cleans and transforms data',
                  icon: <AnalyticsIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
                  color: 'secondary.main'
                },
                {
                  step: 3,
                  title: 'Feature Engineering',
                  description: 'Create meaningful features automatically',
                  icon: <PsychologyIcon sx={{ fontSize: 40, color: 'success.main' }} />,
                  color: 'success.main'
                },
                {
                  step: 4,
                  title: 'Model Training',
                  description: 'Train and select the best model',
                  icon: <TimelineIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
                  color: 'warning.main'
                },
                {
                  step: 5,
                  title: 'Validation & Testing',
                  description: 'Comprehensive model evaluation',
                  icon: <CheckCircleIcon sx={{ fontSize: 40, color: 'info.main' }} />,
                  color: 'info.main'
                },
                {
                  step: 6,
                  title: 'Deployment',
                  description: 'One-click production deployment',
                  icon: <CodeIcon sx={{ fontSize: 40, color: 'error.main' }} />,
                  color: 'error.main'
                }
              ].map((step, index) => (
                <Grid item xs={12} md={2} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.2, 
                      ease: "easeOut" 
                    }}
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    <Box sx={{ 
                      textAlign: 'center',
                      position: 'relative',
                      zIndex: 1,
                      p: 3,
                      borderRadius: 3,
                      bgcolor: 'background.paper',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    }}>
                      {/* Step Number */}
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                        viewport={{ once: true }}
                      >
                        <Box sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          bgcolor: step.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 2,
                          boxShadow: `0 4px 15px ${step.color}40`
                        }}>
                          <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                            {step.step}
                          </Typography>
                        </Box>
                      </motion.div>

                      {/* Icon */}
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
                        viewport={{ once: true }}
                      >
                        <Box sx={{ mb: 2 }}>
                          {step.icon}
                        </Box>
                      </motion.div>

                      {/* Content */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 + 0.5 }}
                        viewport={{ once: true }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                          {step.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
                          {step.description}
                        </Typography>
                      </motion.div>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center', mt: 8 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Ready to Start Your ML Journey?
              </Typography>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: 'primary.main',
                    px: 6,
                    py: 2,
                    fontWeight: 600,
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)',
                    },
                    transition: 'all 0.3s ease-in-out',
                  }}
                  onClick={() => navigate('/projects')}
                >
                  Start Building Your Pipeline
                  <ArrowForwardIcon sx={{ ml: 1 }} />
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Use Cases Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                Perfect For
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                Whether you're a data scientist, business analyst, or developer,
                our platform adapts to your needs.
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={4}>
            {useCases.map((useCase, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.2, 
                    ease: "easeOut" 
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ 
                    y: -8, 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                >
                  <Paper
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      height: '100%',
                      transition: 'all 0.3s ease-in-out',
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                      viewport={{ once: true }}
                    >
                      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                        {useCase.icon}
                      </Box>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2 + 0.5 }}
                      viewport={{ once: true }}
                    >
                      <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                        {useCase.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {useCase.description}
                      </Typography>
                    </motion.div>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
      </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                What Our Users Say
              </Typography>
            </Box>
          </motion.div>

          {/* Testimonial Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Box sx={{ 
              maxWidth: 800, 
              mx: 'auto',
              position: 'relative',
              minHeight: '200px'
            }}>
            {/* Quote Container */}
            <Box sx={{
              position: 'relative',
              mb: 4,
              minHeight: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: 2
            }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontStyle: 'italic', 
                  lineHeight: 1.6, 
                  color: 'text.primary',
                  fontWeight: 400,
                  opacity: isTransitioning ? 0 : 1,
                  transform: isTransitioning ? 'translateY(20px)' : 'translateY(0)',
                  transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'absolute',
                  width: '100%',
                  top: 0,
                  left: 0,
                  textAlign: 'center'
                }}
              >
                "{testimonials[currentTestimonial].content}"
              </Typography>
            </Box>
            
            {/* Author Info */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? 'translateY(20px)' : 'translateY(0)',
              transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
              transitionDelay: '0.1s'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {testimonials[currentTestimonial].name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}
              </Typography>
            </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true, margin: "-100px" }}
              >
              <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                    Why Choose {' '}
                    <Box
                      component="span"
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 600,
                      }}
                    >
                      OctoML
                    </Box>
                    ?
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                Experience the future of machine learning with our automated
                workflow platform designed for both beginners and experts.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                      viewport={{ once: true }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CheckCircleIcon sx={{ color: 'success.main' }} />
                    <Typography variant="body1">{benefit}</Typography>
                  </Box>
                    </motion.div>
                ))}
              </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  gap: 4, 
                  p: 3 
                }}>
                  {/* Simple Stats */}
                  {[
                    { value: "60-70%", label: "Reduction in model development time", color: "primary.main" },
                    { value: "70-80%", label: "Reduction in model development time", color: "success.main" },
                    { value: "15-20%", label: "Better accuracies", color: "warning.main" }
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
                      viewport={{ once: true }}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h2" sx={{ fontWeight: 700, color: stat.color, mb: 1 }}>
                          {stat.value}
                </Typography>
                        <Typography variant="h6" color="text.secondary">
                          {stat.label}
                </Typography>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 10,
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            animation: 'float 8s ease-in-out infinite',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)',
            animation: 'shimmer 4s ease-in-out infinite',
          },
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Ready to Get Started?
        </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 300 }}>
          Join thousands of data scientists and analysts who trust our platform
          for their machine learning needs.
        </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
        <Button
          variant="contained"
          size="large"
                      sx={{
                        bgcolor: 'white',
                        color: 'primary.main',
                        px: 6,
                        py: 2,
                        fontWeight: 600,
                        '&:hover': {
                          bgcolor: 'grey.100',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
          onClick={() => navigate('/projects')}
        >
          Start Your First Project
          <ArrowForwardIcon sx={{ ml: 1 }} />
        </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 6,
                    py: 2,
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  Schedule Demo
                </Button>
              </motion.div>
            </Stack>
          </motion.div>
        </Container>
      </Box>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <Box sx={{ 
          bgcolor: 'grey.900', 
          color: 'white', 
          py: 8,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.5) 50%, transparent 100%)',
          }
        }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <AutoAwesomeIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  OctoML
                </Typography>
              </Box>
              <Typography variant="body1" color="grey.300" sx={{ mb: 4, lineHeight: 1.7 }}>
                The most powerful and intuitive platform for machine learning workflow automation.
                Build, train, and deploy models without writing a single line of code.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ borderColor: 'grey.600', color: 'grey.300' }}
                >
                  <PeopleIcon sx={{ mr: 1 }} />
                  LinkedIn
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ borderColor: 'grey.600', color: 'grey.300' }}
                >
                  <TrendingUpIcon sx={{ mr: 1 }} />
                  Twitter
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Product
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>
                  Features
                </Typography>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>
                  Pricing
                </Typography>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>
                  API
                </Typography>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>
                  Integrations
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Company
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>
                  About
                </Typography>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>
                  Blog
                </Typography>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>
                  Careers
                </Typography>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>
                  Contact
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Support
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>
                  Help Center
                </Typography>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>
                  Documentation
                </Typography>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>
                  Community
                </Typography>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>
                  Status
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Legal
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>
                  Privacy
                </Typography>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>
                  Terms
                </Typography>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>
                  Security
                </Typography>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>
                  Compliance
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4, borderColor: 'grey.700' }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="body2" color="grey.400">
              © 2024 ML Workflow. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>
                Privacy Policy
              </Typography>
              <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>
                Terms of Service
              </Typography>
            </Box>
          </Box>
        </Container>
        </Box>
      </motion.div>
    </Box>
  )
}

export default LandingPage
