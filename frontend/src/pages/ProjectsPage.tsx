import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Paper,
  Avatar,
} from '@mui/material'
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  PlayArrow as PlayIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Folder as FolderIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material'

interface Project {
  id: string
  name: string
  description: string
  status: 'completed' | 'training' | 'pending' | 'failed'
  createdAt: string
  lastModified: string
  problemType: 'classification' | 'regression' | 'clustering'
  dataset: {
    rows: number
    columns: number
    size: string
  }
  results?: {
    bestModel: string
    accuracy: number
    auc?: number
    f1Score?: number
  }
}

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    problemType: 'classification' as const,
  })

  // Mock projects data
  const [projects] = useState<Project[]>([
    {
      id: '1',
      name: 'Heart Disease Prediction',
      description: 'Predicting heart disease using patient data',
      status: 'completed',
      createdAt: '2024-01-15',
      lastModified: '2024-01-20',
      problemType: 'classification',
      dataset: { rows: 1024, columns: 13, size: '2.1 MB' },
      results: {
        bestModel: 'Random Forest',
        accuracy: 0.89,
        auc: 0.92,
        f1Score: 0.88,
      },
    },
    {
      id: '2',
      name: 'House Price Prediction',
      description: 'Predicting house prices based on features',
      status: 'training',
      createdAt: '2024-01-18',
      lastModified: '2024-01-22',
      problemType: 'regression',
      dataset: { rows: 2000, columns: 8, size: '4.5 MB' },
    },
    {
      id: '3',
      name: 'Customer Segmentation',
      description: 'Grouping customers based on behavior',
      status: 'pending',
      createdAt: '2024-01-20',
      lastModified: '2024-01-20',
      problemType: 'clustering',
      dataset: { rows: 5000, columns: 12, size: '8.2 MB' },
    },
  ])

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, projectId: string) => {
    setAnchorEl(event.currentTarget)
    setSelectedProject(projectId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedProject(null)
  }

  const handleCreateProject = () => {
    // In a real app, this would create a new project
    console.log('Creating project:', newProject)
    setCreateDialogOpen(false)
    setNewProject({ name: '', description: '', problemType: 'classification' })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'training':
        return 'warning'
      case 'pending':
        return 'info'
      case 'failed':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <TrendingUpIcon />
      case 'training':
        return <PlayIcon />
      case 'pending':
        return <ScheduleIcon />
      case 'failed':
        return <DeleteIcon />
      default:
        return <FolderIcon />
    }
  }

  return (
    <Box>
      <Navigation />
      <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            My Projects
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and monitor your machine learning projects
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ px: 3 }}
        >
          New Project
        </Button>
      </Box>

      {/* Projects Grid */}
      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                },
                cursor: 'pointer',
              }}
              onClick={() => navigate(`/workflow/${project.id}`)}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                      {getStatusIcon(project.status)}
                    </Avatar>
                    <Chip
                      label={project.status}
                      color={getStatusColor(project.status) as any}
                      size="small"
                    />
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleMenuOpen(e, project.id)
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                  {project.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {project.description}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Problem Type: {project.problemType.charAt(0).toUpperCase() + project.problemType.slice(1)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Dataset: {project.dataset.rows.toLocaleString()} rows × {project.dataset.columns} columns
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Size: {project.dataset.size}
                  </Typography>
                </Box>

                {project.results && (
                  <Paper sx={{ p: 2, bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
                    <Typography variant="caption" color="success.dark" sx={{ fontWeight: 600 }}>
                      Best Model: {project.results.bestModel}
                    </Typography>
                    <Typography variant="h6" color="success.dark" sx={{ fontWeight: 600 }}>
                      {(project.results.accuracy * 100).toFixed(1)}% Accuracy
                    </Typography>
                  </Paper>
                )}
              </CardContent>

              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Modified: {new Date(project.lastModified).toLocaleDateString()}
                </Typography>
                <Box>
                  <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                    <PlayIcon />
                  </IconButton>
                  <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                    <DownloadIcon />
                  </IconButton>
                  <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                    <ShareIcon />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Project
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <DownloadIcon sx={{ mr: 1 }} />
          Download Model
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ShareIcon sx={{ mr: 1 }} />
          Share Project
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Project
        </MenuItem>
      </Menu>

      {/* Create Project Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
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
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateProject} variant="contained">
            Create Project
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setCreateDialogOpen(true)}
      >
        <AddIcon />
      </Fab>
      </Container>
    </Box>
  )
}

export default ProjectsPage
