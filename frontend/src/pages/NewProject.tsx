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
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
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
    </Container>
  )
}

export default NewProject
