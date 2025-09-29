import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Paper,
  Button,
  Breadcrumbs,
  Link,
  Chip,
  LinearProgress,
} from '@mui/material'
import {
  Home as HomeIcon,
  Folder as FolderIcon,
  PlayArrow as PlayIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material'
import UploadData from '../components/tabs/UploadData'
import Preprocessing from '../components/tabs/Preprocessing'
import FeatureSelection from '../components/tabs/FeatureSelection'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`workflow-tabpanel-${index}`}
      aria-labelledby={`workflow-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const WorkflowPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [tabValue, setTabValue] = useState(0)
  const [workflowProgress, setWorkflowProgress] = useState({
    dataUpload: true,
    preprocessing: false,
    featureSelection: false,
    modelTraining: false,
    results: false,
  })

  // Mock project data
  const project = {
    id: id,
    name: 'Heart Disease Prediction',
    status: 'in-progress',
    problemType: 'classification',
    dataset: {
      rows: 1024,
      columns: 13,
      size: '2.1 MB',
    },
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const getStepStatus = (step: string) => {
    return workflowProgress[step as keyof typeof workflowProgress] ? 'completed' : 'pending'
  }

  const getStepIcon = (step: string) => {
    const status = getStepStatus(step)
    return status === 'completed' ? <CheckCircleIcon /> : <ScheduleIcon />
  }

  const getStepColor = (step: string) => {
    const status = getStepStatus(step)
    return status === 'completed' ? 'success' : 'default'
  }

  return (
    <Box>
      <Navigation />
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link
            color="inherit"
            href="#"
            onClick={() => navigate('/')}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            <HomeIcon fontSize="small" />
            Home
          </Link>
          <Link
            color="inherit"
            href="#"
            onClick={() => navigate('/projects')}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            <FolderIcon fontSize="small" />
            Projects
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <FolderIcon fontSize="small" />
            {project.name}
          </Typography>
        </Breadcrumbs>

        {/* Project Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                {project.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Chip
                  label={project.status}
                  color="primary"
                  variant="outlined"
                />
                <Typography variant="body2" color="text.secondary">
                  Problem Type: {project.problemType.charAt(0).toUpperCase() + project.problemType.slice(1)}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<PlayIcon />}
              size="large"
              sx={{ px: 3 }}
            >
              Run Workflow
            </Button>
          </Box>

          {/* Progress Indicator */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Workflow Progress
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              {Object.keys(workflowProgress).map((step, index) => (
                <React.Fragment key={step}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getStepIcon(step)}
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {step.replace(/([A-Z])/g, ' $1').trim()}
                    </Typography>
                  </Box>
                  {index < Object.keys(workflowProgress).length - 1 && (
                    <Box sx={{ width: 40, height: 2, bgcolor: 'divider', mx: 1 }} />
                  )}
                </React.Fragment>
              ))}
            </Box>
            <LinearProgress
              variant="determinate"
              value={Object.values(workflowProgress).filter(Boolean).length * 20}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Paper>
        </Box>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Left Column - Workflow Steps */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="workflow tabs">
                  <Tab label="Upload Data" />
                  <Tab label="Preprocessing" />
                  <Tab label="Feature Selection" />
                </Tabs>
              </Box>

              <TabPanel value={tabValue} index={0}>
                <UploadData />
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Preprocessing />
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <FeatureSelection />
              </TabPanel>
            </Paper>
          </Grid>

          {/* Right Column - Project Info & Results */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Project Info */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Project Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Dataset Size
                      </Typography>
                      <Typography variant="body1">
                        {project.dataset.rows.toLocaleString()} rows × {project.dataset.columns} columns
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        File Size
                      </Typography>
                      <Typography variant="body1">
                        {project.dataset.size}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Problem Type
                      </Typography>
                      <Typography variant="body1">
                        {project.problemType.charAt(0).toUpperCase() + project.problemType.slice(1)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button variant="outlined" fullWidth>
                      Download Dataset
                    </Button>
                    <Button variant="outlined" fullWidth>
                      Export Results
                    </Button>
                    <Button variant="outlined" fullWidth>
                      Share Project
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              {/* Results Preview */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Results Preview
                  </Typography>
                  <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Results will appear here after model training
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default WorkflowPage