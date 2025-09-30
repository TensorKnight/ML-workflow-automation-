import React, { useState } from 'react'
import {
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { projectApi } from '../services/api'
import DataUpload from '../components/workflow/DataUploadSimple'
import DataPreprocessing from '../components/workflow/DataPreprocessing'
import FeatureEngineering from '../components/workflow/FeatureEngineering'
import ModelTraining from '../components/workflow/ModelTraining'
import Results from '../components/workflow/Results'

const steps = [
  'Data Upload',
  'Data Preprocessing',
  'Feature Engineering',
  'Model Training',
  'Results',
]

const NewProject: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [projectData, setProjectData] = useState<any>({})
  const [showProjectDialog, setShowProjectDialog] = useState(true)
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    problemType: 'classification' as const,
  })
  const [createdProject, setCreatedProject] = useState<any>(null)
  const navigate = useNavigate()

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleStepData = (stepData: any) => {
    setProjectData((prev: any) => ({
      ...prev,
      ...stepData,
    }))
  }

  const handleCreateProject = async () => {
    try {
      const response = await projectApi.createProject({
        name: newProject.name,
        description: newProject.description,
        problem_type: newProject.problemType,
      })
      setCreatedProject(response.data)
      setShowProjectDialog(false)
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <DataUpload onDataChange={handleStepData} onNext={handleNext} />
      case 1:
        return (
          <DataPreprocessing
            data={projectData}
            onDataChange={handleStepData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case 2:
        return (
          <FeatureEngineering
            data={projectData}
            onDataChange={handleStepData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case 3:
        return (
          <ModelTraining
            data={projectData}
            onDataChange={handleStepData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case 4:
        return (
          <Results
            data={projectData}
            onBack={handleBack}
            onFinish={() => navigate('/')}
          />
        )
      default:
        return null
    }
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New ML Project
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Follow the steps below to create and train your machine learning model
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mt: 4 }}>
            {renderStepContent(activeStep)}
          </Box>
        </CardContent>
      </Card>

      {/* Project Creation Dialog */}
      <Dialog open={showProjectDialog} onClose={() => navigate('/')} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Project Name"
            fullWidth
            variant="outlined"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Problem Type</InputLabel>
            <Select
              value={newProject.problemType}
              label="Problem Type"
              onChange={(e) => setNewProject({ ...newProject, problemType: e.target.value as any })}
            >
              <MenuItem value="classification">Classification</MenuItem>
              <MenuItem value="regression">Regression</MenuItem>
              <MenuItem value="clustering">Clustering</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate('/')}>Cancel</Button>
          <Button onClick={handleCreateProject} variant="contained" disabled={!newProject.name}>
            Create Project
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default NewProject
