import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Collapse,
  Paper,
  Divider,
} from '@mui/material'
import {
  Description as DescriptionIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Download as DownloadIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import { generateDocumentation } from '../utils/documentationTemplate'

interface DocumentationViewerProps {
  project: any
  onClose?: () => void
}

const DocumentationViewer: React.FC<DocumentationViewerProps> = ({ project, onClose }) => {
  const [expanded, setExpanded] = useState(true)
  const [showFullContent, setShowFullContent] = useState(false)

  const handleDownload = () => {
    const content = generateDocumentation(project)
    const element = document.createElement('a')
    const file = new Blob([content], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${project.name || 'ML_Project'}_Documentation.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return (
          <Typography key={index} variant="h4" sx={{ mt: 3, mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
            {line.replace('# ', '')}
          </Typography>
        )
      } else if (line.startsWith('## ')) {
        return (
          <Typography key={index} variant="h5" sx={{ mt: 2, mb: 1, color: 'text.primary', fontWeight: 'bold' }}>
            {line.replace('## ', '')}
          </Typography>
        )
      } else if (line.startsWith('### ')) {
        return (
          <Typography key={index} variant="h6" sx={{ mt: 2, mb: 1, color: 'text.secondary', fontWeight: 'bold' }}>
            {line.replace('### ', '')}
          </Typography>
        )
      } else if (line.startsWith('#### ')) {
        return (
          <Typography key={index} variant="subtitle1" sx={{ mt: 1, mb: 1, color: 'text.secondary', fontWeight: 'bold' }}>
            {line.replace('#### ', '')}
          </Typography>
        )
      } else if (line.startsWith('- **') && line.includes('**:')) {
        const parts = line.split('**')
        return (
          <Box key={index} sx={{ display: 'flex', mb: 0.5 }}>
            <Typography component="span" sx={{ fontWeight: 'bold', mr: 1 }}>
              {parts[1]}:
            </Typography>
            <Typography component="span">
              {parts[2]?.replace(':', '')}
            </Typography>
          </Box>
        )
      } else if (line.startsWith('* **') && line.includes('**')) {
        const parts = line.split('**')
        return (
          <Box key={index} sx={{ display: 'flex', mb: 0.5, ml: 2 }}>
            <Typography component="span" sx={{ fontWeight: 'bold', mr: 1 }}>
              {parts[1]}:
            </Typography>
            <Typography component="span">
              {parts[2]?.replace(':', '')}
            </Typography>
          </Box>
        )
      } else if (line.startsWith('|') && line.includes('|')) {
        // Skip table rows for now - they're complex to render
        return null
      } else if (line.trim() === '---') {
        return <Divider key={index} sx={{ my: 2 }} />
      } else if (line.trim() === '') {
        return <Box key={index} sx={{ height: 8 }} />
      } else if (line.trim().startsWith('*') && !line.includes('**')) {
        return (
          <Typography key={index} component="li" sx={{ ml: 2, mb: 0.5 }}>
            {line.replace('* ', '')}
          </Typography>
        )
      } else if (line.trim()) {
        return (
          <Typography key={index} variant="body2" sx={{ mb: 1, lineHeight: 1.6 }}>
            {line}
          </Typography>
        )
      }
      return null
    })
  }

  const content = generateDocumentation(project)
  const previewLines = content.split('\n').slice(0, 100) // Show first 100 lines as preview
  const previewContent = previewLines.join('\n')

  return (
    <Card sx={{ mb: 3, border: '1px solid #e0e0e0' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              📄 Project Documentation
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              size="small"
            >
              Download
            </Button>
            <IconButton onClick={() => setExpanded(!expanded)}>
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
            {onClose && (
              <IconButton onClick={onClose} size="small">
                <CloseIcon />
              </IconButton>
            )}
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Complete technical documentation for your ML workflow including dataset analysis, preprocessing steps, feature engineering, and model performance results.
        </Typography>

        <Collapse in={expanded}>
          <Paper sx={{ p: 2, bgcolor: 'grey.50', maxHeight: showFullContent ? 'none' : 600, overflow: 'auto' }}>
            <Box sx={{ fontFamily: 'monospace', fontSize: '14px' }}>
              {showFullContent ? formatContent(content) : formatContent(previewContent)}
            </Box>
            
            {!showFullContent && (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setShowFullContent(true)}
                  size="small"
                >
                  Show Full Documentation
                </Button>
              </Box>
            )}
            
            {showFullContent && (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setShowFullContent(false)}
                  size="small"
                >
                  Show Preview
                </Button>
              </Box>
            )}
          </Paper>
        </Collapse>
      </CardContent>
    </Card>
  )
}

export default DocumentationViewer
