import React, { useState } from 'react'
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Paper,
} from '@mui/material'
import Navbar from '../components/Navbar'
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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const MainPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <Box>
      {/* Navbar */}
      <Navbar />
      
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        {/* Two Pillar Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Left Pillar - Results */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: 400 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Results
                </Typography>
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Results will be displayed here
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Pillar - Graphs */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: 400 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Graphs
                </Typography>
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Graphs will be displayed here
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Three Tabs Section */}
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
      </Container>
    </Box>
  )
}

export default MainPage

