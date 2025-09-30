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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'
import {
  Home as HomeIcon,
  Folder as FolderIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Download as DownloadIcon,
} from '@mui/icons-material'
import UploadData from '../components/tabs/UploadData'
import Preprocessing from '../components/tabs/Preprocessing'
import FeatureSelection from '../components/tabs/FeatureSelection'
import ModelTraining from '../components/tabs/ModelTraining'
import HyperparameterTuning from '../components/tabs/HyperparameterTuning'
import AISuggestions from '../components/AISuggestions'
import DocumentationViewer from '../components/DocumentationViewer'
import { generateDocumentation } from '../utils/documentationTemplate'

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
  const [projectData, setProjectData] = useState<any>({
    file: new File([''], 'heart.csv', { type: 'text/csv' }),
    qualityReport: {
      rows: 1025,
      columns: 13,
      missingValues: 0,
      duplicates: 0,
      fileSize: 1024 * 1024 * 0.5,
      fileType: 'text/csv',
      issues: [],
      pros: [
        'Dataset contains 1,025 rows and 13 columns',
        'Target column is present and well-distributed',
        'No missing values detected',
        'No duplicate rows found',
        'Data types are consistent',
        'File format is optimized for ML processing',
      ],
      recommendations: [
        'Dataset is ready for preprocessing',
        'Consider feature scaling for numerical columns',
        'Target column is balanced for classification',
      ],
      dataPreview: [
        { age: 63, sex: 1, cp: 3, trestbps: 145, chol: 233, fbs: 1, restecg: 0, thalach: 150, exang: 0, oldpeak: 2.3, slope: 0, ca: 0, thal: 1, target: 0 },
        { age: 37, sex: 1, cp: 2, trestbps: 130, chol: 250, fbs: 0, restecg: 1, thalach: 187, exang: 0, oldpeak: 3.5, slope: 0, ca: 0, thal: 2, target: 1 },
        { age: 41, sex: 0, cp: 1, trestbps: 130, chol: 204, fbs: 0, restecg: 0, thalach: 172, exang: 0, oldpeak: 1.4, slope: 2, ca: 0, thal: 2, target: 0 },
      ]
    }
  })
  const [workflowProgress, setWorkflowProgress] = useState({
    dataUpload: true,
    preprocessing: true,
    featureSelection: true,
    modelTraining: true,
    hyperparameterTuning: true,
    results: true,
    modelMonitoring: true,
  })

  // Chart data for visualization
  const modelPerformanceData = [
    { name: 'Random Forest', accuracy: 97.89, precision: 97.4, recall: 98.1, f1Score: 97.7, trainingTime: 1.2 },
    { name: 'XGBoost', accuracy: 98.67, precision: 98.2, recall: 98.9, f1Score: 98.5, trainingTime: 0.8 },
    { name: 'LightGBM', accuracy: 99.12, precision: 98.3, recall: 98.7, f1Score: 98.5, trainingTime: 0.6 },
  ]


  const accuracyComparisonData = [
    { name: 'Initial Training', LightGBM: 98.54, XGBoost: 97.32, 'Random Forest': 96.89 },
    { name: 'After Tuning', LightGBM: 99.12, XGBoost: 98.67, 'Random Forest': 97.89 },
  ]

  const featureImportanceData = [
    { name: 'thalach', value: 0.18, color: '#8884d8' },
    { name: 'oldpeak', value: 0.15, color: '#82ca9d' },
    { name: 'ca', value: 0.14, color: '#ffc658' },
    { name: 'cp', value: 0.12, color: '#ff7300' },
    { name: 'age', value: 0.11, color: '#00ff00' },
    { name: 'thal', value: 0.10, color: '#ff00ff' },
    { name: 'trestbps', value: 0.08, color: '#00ffff' },
    { name: 'chol', value: 0.07, color: '#ffff00' },
    { name: 'slope', value: 0.05, color: '#ff0000' },
  ]

  const modelMetricsData = [
    { metric: 'Accuracy', LightGBM: 99.12, XGBoost: 98.67, 'Random Forest': 97.89 },
    { metric: 'Precision', LightGBM: 98.3, XGBoost: 98.2, 'Random Forest': 97.4 },
    { metric: 'Recall', LightGBM: 98.7, XGBoost: 98.9, 'Random Forest': 98.1 },
    { metric: 'F1-Score', LightGBM: 98.5, XGBoost: 98.5, 'Random Forest': 97.7 },
  ]

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


  const downloadDocumentation = (content: string, filename: string) => {
    const element = document.createElement('a')
    const file = new Blob([content], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = filename
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
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
              value={Object.values(workflowProgress).filter(Boolean).length * (100 / Object.keys(workflowProgress).length)}
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
                 <Tabs 
                   value={tabValue} 
                   onChange={handleTabChange} 
                   aria-label="workflow tabs"
                   variant="scrollable"
                   scrollButtons="auto"
                   allowScrollButtonsMobile
                   sx={{
                     '& .MuiTabs-scrollButtons': {
                       '&.Mui-disabled': {
                         opacity: 0.3,
                       },
                     },
                   }}
                 >
                  <Tab label="Upload Data" />
                  <Tab label="Preprocessing" />
                  <Tab label="Feature Selection" />
                   <Tab label="Model Training" />
                   <Tab label="Hyperparameter Tuning" />
                   <Tab label="Results" />
                   <Tab label="Model Monitoring" />
                </Tabs>
              </Box>

              <TabPanel value={tabValue} index={0}>
                <AISuggestions currentStep="dataUpload" />
                <UploadData onNext={() => setTabValue(1)} />
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <AISuggestions currentStep="preprocessing" />
                <Preprocessing onNext={() => setTabValue(2)} />
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <AISuggestions currentStep="featureSelection" />
                <FeatureSelection onNext={() => setTabValue(3)} />
              </TabPanel>

              <TabPanel value={tabValue} index={3}>
                <AISuggestions currentStep="modelTraining" />
                <ModelTraining onNext={() => setTabValue(4)} />
              </TabPanel>

              <TabPanel value={tabValue} index={4}>
                <AISuggestions currentStep="hyperparameterTuning" />
                <HyperparameterTuning onNext={() => setTabValue(5)} />
              </TabPanel>

              <TabPanel value={tabValue} index={5}>
                <AISuggestions currentStep="results" />
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    🎯 ML Pipeline Results
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    The ML pipeline has been executed with heart.csv dataset. Here are the results:
                  </Typography>
                  
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'success.50', borderRadius: 2 }}>
                    <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                      99.12% Accuracy
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Best Model: LightGBM Classifier (Tuned)
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Model Performance Comparison:
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: 'success.50' }}>
                        <Typography>LightGBM (Tuned)</Typography>
                        <Typography fontWeight="bold">99.12%</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: 'info.50' }}>
                        <Typography>XGBoost (Tuned)</Typography>
                        <Typography>98.67%</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: 'info.50' }}>
                        <Typography>Random Forest (Tuned)</Typography>
                        <Typography>97.89%</Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Dataset Information:
                    </Typography>
                    <Typography variant="body2">
                      • Dataset: Heart Disease Classification<br/>
                      • Rows: 1,025 samples<br/>
                      • Features: 13 attributes<br/>
                      • Target: Binary classification (0/1)<br/>
                      • Training Time: ~4.2 seconds (including hyperparameter tuning)
                    </Typography>
                  </Box>
                </Box>
              </TabPanel>

              <TabPanel value={tabValue} index={6}>
                <AISuggestions currentStep="modelMonitoring" />
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    📊 Model Monitoring & Analytics
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Comprehensive visualizations and monitoring for your trained models
                  </Typography>

                  {/* Charts Section */}
                  <Grid container spacing={3} sx={{ mt: 3 }}>
                    {/* Model Performance Comparison */}
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            📊 Model Performance Comparison
                          </Typography>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={modelPerformanceData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="accuracy" fill="#8884d8" name="Accuracy (%)" />
                              <Bar dataKey="precision" fill="#82ca9d" name="Precision (%)" />
                              <Bar dataKey="recall" fill="#ffc658" name="Recall (%)" />
                            </BarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Accuracy Before/After Tuning */}
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            📈 Accuracy Improvement
                          </Typography>
                          <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={accuracyComparisonData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line type="monotone" dataKey="LightGBM" stroke="#8884d8" strokeWidth={3} />
                              <Line type="monotone" dataKey="XGBoost" stroke="#82ca9d" strokeWidth={3} />
                              <Line type="monotone" dataKey="Random Forest" stroke="#ffc658" strokeWidth={3} />
                            </LineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Feature Importance */}
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            🎯 Feature Importance
                          </Typography>
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={featureImportanceData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {featureImportanceData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Model Metrics Radar */}
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            🎯 Model Metrics Radar
                          </Typography>
                          <ResponsiveContainer width="100%" height={300}>
                            <RadarChart data={modelMetricsData}>
                              <PolarGrid />
                              <PolarAngleAxis dataKey="metric" />
                              <PolarRadiusAxis angle={90} domain={[95, 100]} />
                              <Radar name="LightGBM" dataKey="LightGBM" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                              <Radar name="XGBoost" dataKey="XGBoost" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                              <Radar name="Random Forest" dataKey="Random Forest" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                              <Legend />
                            </RadarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </Grid>

                  </Grid>
                </Box>
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

              {/* Documentation Viewer - Only show in Results and Model Monitoring tabs */}
              {(tabValue === 5 || tabValue === 6) && (
                <DocumentationViewer project={project} />
              )}

            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default WorkflowPage