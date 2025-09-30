import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  Paper,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
} from '@mui/material'
import {
  Upload as UploadIcon,
  Science as ScienceIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  CloudUpload as CloudUploadIcon,
  Analytics as AnalyticsIcon,
  Timeline as TimelineIcon,
  MoreVert as MoreVertIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import CountUp from 'react-countup'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useInView } from 'react-intersection-observer'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Mock data for analytics
  const [analyticsData] = useState({
    totalProjects: 47,
    activeProjects: 12,
    completedProjects: 35,
    successRate: 89.4,
    avgAccuracy: 87.2,
    totalModels: 156,
    dataProcessed: 2.4, // GB
    lastActivity: '2 hours ago',
  })

  const performanceData = [
    { name: 'Jan', accuracy: 85, models: 12 },
    { name: 'Feb', accuracy: 87, models: 15 },
    { name: 'Mar', accuracy: 89, models: 18 },
    { name: 'Apr', accuracy: 91, models: 22 },
    { name: 'May', accuracy: 88, models: 19 },
    { name: 'Jun', accuracy: 92, models: 25 },
  ]

  const modelDistribution = [
    { name: 'Classification', value: 65, color: '#8884d8' },
    { name: 'Regression', value: 35, color: '#82ca9d' },
  ]

  const quickActions = [
    {
      title: 'Upload Data',
      description: 'Start a new ML project by uploading your dataset',
      icon: <CloudUploadIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      action: () => navigate('/new-project'),
      stats: '2.4GB processed',
    },
    {
      title: 'Use Template',
      description: 'Start with a pre-configured template',
      icon: <ScienceIcon sx={{ fontSize: 40 }} />,
      color: '#388e3c',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      action: () => navigate('/new-project?template=true'),
      stats: '15+ templates',
    },
    {
      title: 'View Analytics',
      description: 'Deep dive into your ML performance',
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      color: '#f57c00',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      action: () => console.log('View analytics'),
      stats: '89.4% success rate',
    },
  ]

  const recentProjects = [
    { 
      id: '1', 
      name: 'Heart Disease Prediction', 
      status: 'completed', 
      date: '2024-01-15',
      accuracy: 89.2,
      models: 13,
      duration: '2h 34m',
      progress: 100,
    },
    { 
      id: '2', 
      name: 'Sales Forecasting', 
      status: 'processing', 
      date: '2024-01-14',
      accuracy: null,
      models: 8,
      duration: '1h 12m',
      progress: 65,
    },
    { 
      id: '3', 
      name: 'Customer Segmentation', 
      status: 'failed', 
      date: '2024-01-13',
      accuracy: null,
      models: 5,
      duration: '45m',
      progress: 0,
    },
    { 
      id: '4', 
      name: 'Fraud Detection', 
      status: 'completed', 
      date: '2024-01-12',
      accuracy: 94.7,
      models: 15,
      duration: '3h 21m',
      progress: 100,
    },
  ]

  const recentActivity = [
    { id: 1, action: 'Model training completed', project: 'Heart Disease Prediction', time: '2 hours ago', type: 'success' },
    { id: 2, action: 'Data preprocessing started', project: 'Sales Forecasting', time: '3 hours ago', type: 'info' },
    { id: 3, action: 'New dataset uploaded', project: 'Customer Segmentation', time: '1 day ago', type: 'upload' },
    { id: 4, action: 'Model deployment failed', project: 'Fraud Detection', time: '2 days ago', type: 'error' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success'
      case 'processing': return 'warning'
      case 'failed': return 'error'
      default: return 'default'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success': return <PlayIcon color="success" />
      case 'info': return <TimelineIcon color="info" />
      case 'upload': return <CloudUploadIcon color="primary" />
      case 'error': return <StopIcon color="error" />
      default: return <AssessmentIcon />
    }
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, background: 'linear-gradient(45deg, #1976d2, #42a5f5)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ML Workflow Automation
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Advanced machine learning pipeline automation with real-time analytics and intelligent model selection
          </Typography>
        </Box>
      </motion.div>

      {/* Analytics Overview */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100px',
                height: '100px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                transform: 'translate(30px, -30px)',
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      <CountUp end={analyticsData.totalProjects} duration={2} />
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Projects
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <AssessmentIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      <CountUp end={analyticsData.successRate} duration={2} decimals={1} suffix="%" />
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Success Rate
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <TrendingUpIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      <CountUp end={analyticsData.avgAccuracy} duration={2} decimals={1} suffix="%" />
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Avg Accuracy
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <SpeedIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      <CountUp end={analyticsData.dataProcessed} duration={2} decimals={1} suffix="GB" />
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Data Processed
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <MemoryIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            🚀 Quick Actions
          </Typography>
        </Grid>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  background: action.gradient,
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '120px',
                    height: '120px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    transform: 'translate(40px, -40px)',
                  }
                }}
                onClick={action.action}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                  <Box sx={{ mb: 2 }}>
                    {action.icon}
                  </Box>
                  <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                    {action.title}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                    {action.description}
                  </Typography>
                  <Chip 
                    label={action.stats} 
                    size="small" 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      fontWeight: 500 
                    }} 
                  />
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button 
                    size="small" 
                    sx={{ 
                      color: 'white', 
                      borderColor: 'rgba(255,255,255,0.5)',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                      }
                    }}
                    variant="outlined"
                  >
                    Get Started
                  </Button>
                </CardActions>
              </Card>
            </motion.div>
          </Grid>
        ))}

        {/* Performance Chart */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card sx={{ height: 400 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  📈 Performance Trends
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Line 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="#1976d2" 
                      strokeWidth={3}
                      dot={{ fill: '#1976d2', strokeWidth: 2, r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="models" 
                      stroke="#42a5f5" 
                      strokeWidth={3}
                      dot={{ fill: '#42a5f5', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Model Distribution */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card sx={{ height: 400 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  🎯 Model Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={modelDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {modelDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ mt: 2 }}>
                  {modelDistribution.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box 
                        sx={{ 
                          width: 12, 
                          height: 12, 
                          bgcolor: item.color, 
                          borderRadius: '50%', 
                          mr: 1 
                        }} 
                      />
                      <Typography variant="body2">{item.name}: {item.value}%</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Recent Projects */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  🔥 Recent Projects
                </Typography>
                <List>
                  {recentProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <ListItem 
                        sx={{ 
                          border: '1px solid #e0e0e0', 
                          borderRadius: 2, 
                          mb: 2,
                          '&:hover': { bgcolor: '#f5f5f5' }
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: getStatusColor(project.status) + '.main' }}>
                            {project.status === 'processing' ? <PlayIcon /> : 
                             project.status === 'completed' ? <AssessmentIcon /> : <StopIcon />}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="h6">{project.name}</Typography>
                              <Chip 
                                label={project.status} 
                                color={getStatusColor(project.status) as any}
                                size="small"
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {project.date} • {project.duration} • {project.models} models
                              </Typography>
                              {project.accuracy && (
                                <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                                  Accuracy: {project.accuracy}%
                                </Typography>
                              )}
                              {project.status === 'processing' && (
                                <Box sx={{ mt: 1 }}>
                                  <LinearProgress 
                                    variant="determinate" 
                                    value={project.progress} 
                                    sx={{ height: 6, borderRadius: 3 }}
                                  />
                                  <Typography variant="caption" color="text.secondary">
                                    {project.progress}% complete
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton onClick={() => navigate(`/project/${project.id}`)}>
                            <MoreVertIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  ⚡ Recent Activity
                </Typography>
                <List>
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <ListItem sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'grey.100', width: 32, height: 32 }}>
                            {getActivityIcon(activity.type)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {activity.action}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {activity.project}
                              </Typography>
                              <Typography variant="caption" display="block" color="text.secondary">
                                {activity.time}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < recentActivity.length - 1 && <Divider />}
                    </motion.div>
                  ))}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Dashboard
